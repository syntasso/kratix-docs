package main

import (
	"context"
	"errors"
	"fmt"
	"sort"
	"strings"
	"time"

	digest "github.com/syntasso/kratix-docs/scripts/release-digest"
	"github.com/syntasso/kratix-docs/scripts/release-digest/slack"
)

// slackStep keeps each digest's Slack message and hold-end ping up to date,
// and reports whether it changed the record. Slack failures are logged as
// warnings rather than failing the run, so the record still saves the
// HubSpot draft that has already been created.
type slackStep struct {
	client  slack.Client
	channel string
	now     time.Time
}

func (s slackStep) run(ctx context.Context, record *digest.Record, states map[string]digest.EmailState,
	result draftResult, plan digest.Plan, email digest.Email, newReleases bool) bool {
	if record.Digests == nil {
		record.Digests = map[string]digest.DigestRecord{}
	}
	changed := s.settleFinishedDigests(ctx, record, states)
	if result.emailID == "" {
		return changed
	}

	d := record.Digests[result.emailID]
	if !newReleases && d.SlackMessageTs != "" {
		say("Slack: no new releases, so the message and the hold are unchanged")
		return changed
	}

	holdEnd := digest.HoldEnd(s.now, plan.SendNotBefore)
	if !newReleases && d.HoldEndsAt != "" {
		if kept, err := time.Parse(time.RFC3339, d.HoldEndsAt); err == nil {
			holdEnd = kept
		}
	}
	text := digestMessage(result, email, plan, holdEnd)

	if d.SlackMessageTs != "" {
		err := s.client.UpdateMessage(ctx, d.SlackChannel, d.SlackMessageTs, text)
		var slackErr *slack.Error
		switch {
		case err == nil:
			say("Slack: updated the digest message")
		case errors.As(err, &slackErr) && slackErr.Code == "message_not_found":
			d.SlackMessageTs = ""
		default:
			warn("Slack: could not update the digest message: %v", err)
		}
	}
	if d.SlackMessageTs == "" {
		ts, err := s.client.PostMessage(ctx, s.channel, text)
		if err != nil {
			warn("Slack: could not post the digest message: %v", err)
		} else {
			d.SlackChannel, d.SlackMessageTs = s.channel, ts
			say("Slack: posted the digest message")
		}
	}
	if d.SlackChannel == "" {
		d.SlackChannel = s.channel
	}

	holdEndsAt := holdEnd.UTC().Format(time.RFC3339)
	if holdEndsAt != d.HoldEndsAt || d.SlackScheduledMessageID == "" {
		if d.SlackScheduledMessageID != "" {
			s.cancelPing(ctx, d.SlackChannel, d.SlackScheduledMessageID, "the previous ping")
		}
		id, err := s.client.ScheduleMessage(ctx, d.SlackChannel, holdEnd, pingMessage(result.emailID))
		if err != nil {
			warn("Slack: could not schedule the hold-end ping: %v", err)
			d.SlackScheduledMessageID = ""
		} else {
			d.SlackScheduledMessageID = id
			say("Slack: scheduled the hold-end ping for %s", ukTime(holdEnd))
		}
		d.HoldEndsAt = holdEndsAt
	}

	record.Digests[result.emailID] = d
	return true
}

// settleFinishedDigests cancels the pending ping of any digest whose email
// has been scheduled, sent or deleted, and marks its message.
func (s slackStep) settleFinishedDigests(ctx context.Context, record *digest.Record, states map[string]digest.EmailState) bool {
	ids := make([]string, 0, len(record.Digests))
	for id := range record.Digests {
		ids = append(ids, id)
	}
	sort.Strings(ids)

	changed := false
	for _, id := range ids {
		d := record.Digests[id]
		state, known := states[id]
		if !known || d.SlackScheduledMessageID == "" || (!state.Deleted && state.State == "DRAFT") {
			continue
		}
		status, update := state.State, ""
		if state.Deleted {
			status = "deleted"
			update = fmt.Sprintf(":wastebasket: SKE release digest email %s was deleted in HubSpot. Any of its releases still to send are in a new draft.", id)
		} else {
			when := ""
			if state.PublishDate != "" {
				if t, err := time.Parse(time.RFC3339, state.PublishDate); err == nil {
					when = " for " + ukTime(t)
				}
			}
			update = fmt.Sprintf(":white_check_mark: SKE release digest email %s is %s in HubSpot%s. Nothing more to do.", id, state.State, when)
		}
		say("Slack: email %s is %s, so its hold-end ping is cancelled", id, status)
		s.cancelPing(ctx, d.SlackChannel, d.SlackScheduledMessageID, "ping "+d.SlackScheduledMessageID)
		if d.SlackMessageTs != "" {
			if err := s.client.UpdateMessage(ctx, d.SlackChannel, d.SlackMessageTs, update); err != nil {
				warn("Slack: could not update the message for email %s: %v", id, err)
			}
		}
		d.SlackScheduledMessageID = ""
		record.Digests[id] = d
		changed = true
	}
	return changed
}

func (s slackStep) cancelPing(ctx context.Context, channel, id, what string) {
	err := s.client.DeleteScheduledMessage(ctx, channel, id)
	if err == nil {
		return
	}
	var slackErr *slack.Error
	if errors.As(err, &slackErr) {
		if what == "the previous ping" {
			say("Slack: could not cancel the previous ping %s (%s)", id, slackErr.Code)
		} else {
			say("Slack: could not cancel %s (%s)", what, slackErr.Code)
		}
		return
	}
	warn("Slack: could not cancel %s: %v", what, err)
}

func digestMessage(result draftResult, email digest.Email, plan digest.Plan, holdEnd time.Time) string {
	var b strings.Builder
	fmt.Fprintf(&b, ":email: *SKE release digest: draft %s in HubSpot*\n", result.action)
	fmt.Fprintf(&b, "HubSpot draft email %s, subject \"%s\"\n\n", result.emailID, email.Subject)
	fmt.Fprintf(&b, "%s:\n", capitalise(count(len(plan.Releases), "release")))
	for _, r := range plan.Releases {
		fmt.Fprintf(&b, "• %s %s (`%s`), released %s\n", r.Component, r.Label, r.ID, ukDate(r.Date))
	}
	fmt.Fprintf(&b, "\nEarliest send date: %s (%s).\n", ukDate(plan.SendNotBefore), plan.SendNotBeforeReason)
	fmt.Fprintf(&b, "Hold ends: %s. The hold restarts if more releases join the digest. "+
		"A reminder will be posted here when it ends.", ukTime(holdEnd))
	return b.String()
}

func pingMessage(emailID string) string {
	return fmt.Sprintf(":bell: The SKE release digest (HubSpot draft email %s) has had no new releases for %d business hours. "+
		"If it has not been scheduled or sent yet, please review it in HubSpot and send it. "+
		"If it already has, you can ignore this.", emailID, int(digest.HoldDuration.Hours()))
}
