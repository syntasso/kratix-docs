// Command release-digest plans the next SKE release digest email and writes it
// to the GitHub Actions step outputs. With -create-draft it also creates the
// email as a HubSpot draft, or regenerates the pending one, and records the
// email against its releases in the release record. It never publishes or
// sends anything.
package main

import (
	"context"
	"errors"
	"flag"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	digest "github.com/syntasso/kratix-docs/scripts/release-digest"
	"github.com/syntasso/kratix-docs/scripts/release-digest/hubspot"
	"github.com/syntasso/kratix-docs/scripts/release-digest/slack"
)

type options struct {
	docsDir, recordPath, layoutPath, hubspotAPI string
	createDraft                                 bool
	token                                       string
	slackAPI, slackChannel, slackToken          string
}

func main() {
	var o options
	flag.StringVar(&o.docsDir, "docs", "docs/ske/08-releases-and-support", "directory of SKE release-notes pages")
	flag.StringVar(&o.recordPath, "record", "scripts/release-digest/release-record.json", "release record JSON file")
	flag.BoolVar(&o.createDraft, "create-draft", false, "create the planned email as a HubSpot draft (needs HUBSPOT_ACCESS_TOKEN)")
	flag.StringVar(&o.layoutPath, "layout", "scripts/release-digest/email-layout.json", "HubSpot email layout JSON file")
	flag.StringVar(&o.hubspotAPI, "hubspot-api", hubspot.DefaultBaseURL, "HubSpot API base URL")
	flag.StringVar(&o.slackAPI, "slack-api", slack.DefaultBaseURL, "Slack Web API base URL")
	flag.StringVar(&o.slackChannel, "slack-channel", os.Getenv("SLACK_DIGEST_CHANNEL"), "Slack channel ID for digest messages (defaults to SLACK_DIGEST_CHANNEL)")
	flag.Parse()
	o.token = os.Getenv("HUBSPOT_ACCESS_TOKEN")
	o.slackToken = os.Getenv("SLACK_BOT_TOKEN")

	if err := run(o); err != nil {
		log.Fatal(err)
	}
}

func run(o options) error {
	var layout hubspot.Layout
	if o.createDraft {
		if o.token == "" {
			return errors.New("-create-draft needs the HUBSPOT_ACCESS_TOKEN environment variable")
		}
		var err error
		if layout, err = hubspot.LoadLayout(o.layoutPath); err != nil {
			return err
		}
	}

	record, err := digest.LoadRecord(o.recordPath)
	if err != nil {
		return err
	}

	releases, err := digest.LoadReleases(os.DirFS(o.docsDir))
	if err != nil {
		return fmt.Errorf("reading release notes: %w", err)
	}
	say("Release notes: read %s from %s", count(len(releases), "release"), o.docsDir)
	sayRecord(record)

	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
	defer cancel()
	client := hubspot.Client{BaseURL: o.hubspotAPI, Token: o.token, HTTP: &http.Client{Timeout: 30 * time.Second}}

	// Without -create-draft, HubSpot is not asked about recorded emails, so any
	// release with a recorded email counts as sent.
	plan := digest.Plan{Releases: digest.SelectPending(record, releases)}
	states := map[string]digest.EmailState{}
	london, err := time.LoadLocation("Europe/London")
	if err != nil {
		return err
	}
	now := time.Now().In(london)
	if o.createDraft {
		if states, err = emailStates(ctx, client, record); err != nil {
			return err
		}
		plan = digest.PlanDigest(record, releases, states, now)
	} else {
		say("HubSpot: not contacted. A release with a recorded email counts as sent. " +
			"Run with -create-draft (create_draft in the workflow) to create or update the draft.")
	}
	pending := plan.Releases
	if len(pending) == 0 {
		say("Digest: nothing to send")
	} else {
		say("Digest: %s on or after %s:", count(len(pending), "release"), ukDate(record.GoLive))
		for _, r := range pending {
			say("  - %s (%s)", r.ID, ukDate(r.Date))
		}
	}
	email := digest.RenderEmail(pending)

	outputs, closeOutputs, err := appendTo(os.Getenv("GITHUB_OUTPUT"))
	if err != nil {
		return err
	}
	defer closeOutputs()
	if err := digest.WriteOutputs(outputs, pending, email); err != nil {
		return fmt.Errorf("writing outputs: %w", err)
	}

	result := draftResult{}
	newReleases := false
	if o.createDraft && len(pending) > 0 {
		draft := hubspot.Draft{
			Name:    "SKE release digest " + time.Now().UTC().Format("2006-01-02"),
			Subject: email.Subject,
			Layout:  layout,
			HTML:    email.HTML,
		}
		if plan.DraftEmailID != "" {
			if err := client.UpdateDraft(ctx, plan.DraftEmailID, draft); err != nil {
				return fmt.Errorf("updating the HubSpot draft: %w", err)
			}
			result = draftResult{emailID: plan.DraftEmailID, action: "updated"}
		} else {
			id, err := client.CreateDraft(ctx, draft)
			if err != nil {
				return fmt.Errorf("creating the HubSpot draft: %w", err)
			}
			result = draftResult{emailID: id, action: "created"}
		}
		say("HubSpot: %s draft email %s", result.action, result.emailID)
		result.sendNotBefore = plan.SendNotBefore

		ids := []string{}
		for _, r := range pending {
			ids = append(ids, r.ID)
		}
		newReleases = record.Assign(ids, result.emailID)
		if newReleases {
			say("Release record: %s recorded against email %s", count(len(ids), "release"), result.emailID)
		} else {
			say("Release record: unchanged")
		}
		say("Earliest send date: %s (%s)", ukDate(plan.SendNotBefore), plan.SendNotBeforeReason)
		notice("%s HubSpot draft email %s with %s. Send it no earlier than %s.",
			capitalise(result.action), result.emailID, count(len(pending), "release"), ukDate(plan.SendNotBefore))
	}

	if o.createDraft && len(pending) == 0 {
		say("HubSpot: no draft to create or update")
		say("Release record: unchanged")
		notice("Nothing to send: every release since %s is already in a scheduled or sent digest.", ukDate(record.GoLive))
	}

	result.recordChanged = newReleases
	if o.createDraft {
		if o.slackToken == "" || o.slackChannel == "" {
			say("Slack: skipped, because SLACK_BOT_TOKEN or the channel is not set")
		} else {
			step := slackStep{
				client:  slack.Client{BaseURL: o.slackAPI, Token: o.slackToken, HTTP: &http.Client{Timeout: 30 * time.Second}},
				channel: o.slackChannel,
				now:     now,
			}
			if step.run(ctx, &record, states, result, plan, email, newReleases) {
				result.recordChanged = true
			}
		}
		if len(record.Digests) == 0 {
			record.Digests = nil
		}
	}

	if result.recordChanged {
		if err := os.WriteFile(o.recordPath, digest.MarshalRecord(record), 0o644); err != nil {
			return fmt.Errorf("writing release record: %w", err)
		}
		say("Release record: saved")
	}
	if o.createDraft {
		if result.emailID != "" {
			if _, err := fmt.Fprintf(outputs, "email_id=%s\ndraft_action=%s\nsend_not_before=%s\n",
				result.emailID, result.action, result.sendNotBefore); err != nil {
				return fmt.Errorf("writing outputs: %w", err)
			}
		}
		if _, err := fmt.Fprintf(outputs, "record_changed=%t\n", result.recordChanged); err != nil {
			return fmt.Errorf("writing outputs: %w", err)
		}
	}

	summary, closeSummary, err := appendTo(os.Getenv("GITHUB_STEP_SUMMARY"))
	if err != nil {
		return err
	}
	defer closeSummary()
	return writeSummary(summary, record, pending, email, result)
}

// draftResult is what a -create-draft run did in HubSpot.
type draftResult struct {
	emailID, action, sendNotBefore string
	recordChanged                  bool
}

// emailStates asks HubSpot for the state of every email in the record.
func emailStates(ctx context.Context, client hubspot.Client, record digest.Record) (map[string]digest.EmailState, error) {
	states := map[string]digest.EmailState{}
	for _, r := range record.Releases {
		if r.DigestEmailID == nil || *r.DigestEmailID == "" {
			continue
		}
		id := *r.DigestEmailID
		if _, done := states[id]; done {
			continue
		}
		status, err := client.EmailStatus(ctx, id)
		if err != nil {
			return nil, err
		}
		states[id] = digest.EmailState{State: status.State, PublishDate: status.PublishDate, Deleted: status.Deleted}
		switch {
		case status.Deleted:
			say("HubSpot: email %s has been deleted: its releases go back into the digest", id)
		case status.State == "DRAFT":
			say("HubSpot: email %s is DRAFT: the pending draft", id)
		case status.PublishDate != "":
			say("HubSpot: email %s is %s (%s): its releases stay out of the digest", id, status.State, ukDateTime(status.PublishDate))
		default:
			say("HubSpot: email %s is %s: its releases stay out of the digest", id, status.State)
		}
	}
	return states, nil
}

// appendTo opens a GitHub Actions file for appending, or uses stdout when the
// variable is unset (running locally).
func appendTo(path string) (io.Writer, func(), error) {
	if path == "" {
		return os.Stdout, func() {}, nil
	}
	f, err := os.OpenFile(path, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0o644)
	if err != nil {
		return nil, nil, err
	}
	return f, func() { _ = f.Close() }, nil
}

func writeSummary(w io.Writer, record digest.Record, pending []digest.Release, email digest.Email, result draftResult) error {
	if len(pending) == 0 {
		_, err := fmt.Fprintf(w, "## Release digest\n\nNo releases on or after %s are waiting for a digest email.\n", ukDate(record.GoLive))
		return err
	}
	created := ""
	if result.emailID != "" {
		verb := "Created"
		if result.action == "updated" {
			verb = "Updated"
		}
		created = fmt.Sprintf("%s HubSpot draft email %s. It has not been sent. Send it no earlier than %s.\n\n",
			verb, result.emailID, ukDate(result.sendNotBefore))
	}
	_, err := fmt.Fprintf(w, "## Release digest: planned email\n\n%s**Subject:** %s\n\n%s on or after %s.\n\n---\n\n%s\n",
		created, email.Subject, count(len(pending), "release"), ukDate(record.GoLive), email.HTML)
	return err
}

// say writes a line to the run's log. It goes to stderr, so that stdout only
// carries the outputs when running locally.
func say(format string, args ...any) {
	fmt.Fprintf(os.Stderr, format+"\n", args...)
}

// notice raises a notice on the GitHub Actions run page.
func notice(format string, args ...any) {
	if os.Getenv("GITHUB_ACTIONS") == "true" {
		fmt.Fprintf(os.Stderr, "::notice title=Release digest::"+format+"\n", args...)
	}
}

// sayRecord describes the release record.
func sayRecord(record digest.Record) {
	recorded := 0
	emails := map[string]bool{}
	for _, r := range record.Releases {
		if r.DigestEmailID != nil && *r.DigestEmailID != "" {
			recorded++
			emails[*r.DigestEmailID] = true
		}
	}
	if recorded == 0 {
		say("Release record: go-live %s, no releases recorded yet", ukDate(record.GoLive))
		return
	}
	say("Release record: go-live %s, %s recorded against %s",
		ukDate(record.GoLive), count(recorded, "release"), count(len(emails), "email"))
}

func count(n int, noun string) string {
	if n == 1 {
		return "1 " + noun
	}
	return fmt.Sprintf("%d %ss", n, noun)
}

func capitalise(word string) string {
	if word == "" {
		return word
	}
	return strings.ToUpper(word[:1]) + word[1:]
}

// ukDate shows a YYYY-MM-DD date as DD/MM/YYYY for people to read. Outputs
// and the release record keep YYYY-MM-DD.
func ukDate(iso string) string {
	date, err := time.Parse("2006-01-02", iso)
	if err != nil {
		return iso
	}
	return date.Format("02/01/2006")
}

// ukDateTime shows an RFC 3339 time as DD/MM/YYYY HH:MM in UK time.
func ukDateTime(rfc3339 string) string {
	moment, err := time.Parse(time.RFC3339, rfc3339)
	if err != nil {
		return rfc3339
	}
	return ukTime(moment)
}

// ukTime shows a time as DD/MM/YYYY HH:MM in UK time.
func ukTime(moment time.Time) string {
	if london, err := time.LoadLocation("Europe/London"); err == nil {
		moment = moment.In(london)
	}
	return moment.Format("02/01/2006 15:04") + " UK time"
}

// warn writes a warning to the run's log, and to the GitHub run page.
func warn(format string, args ...any) {
	if os.Getenv("GITHUB_ACTIONS") == "true" {
		fmt.Fprintf(os.Stderr, "::warning title=Release digest::"+format+"\n", args...)
		return
	}
	say("Warning: "+format, args...)
}
