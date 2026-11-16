package digest

import "time"

// EmailState is what the planner needs to know about a recorded digest email.
type EmailState struct {
	// State is HubSpot's state, such as DRAFT, SCHEDULED or PUBLISHED.
	State string
	// PublishDate is when the email is or was sent, in RFC 3339.
	PublishDate string
	// Deleted is true when HubSpot no longer has the email.
	Deleted bool
}

// Plan is what the next run should do.
type Plan struct {
	// Releases go in the digest, newest first.
	Releases []Release
	// DraftEmailID is the pending draft to regenerate. Empty means create one.
	DraftEmailID string
	// SendNotBefore is the earliest day, in UK time, the digest may be sent:
	// at most one digest goes out a day, and only on weekdays.
	SendNotBefore string
	// SendNotBeforeReason says why, in words for the run's log.
	SendNotBeforeReason string
}

// PlanDigest decides what the digest holds and which email it goes into.
//
// A release is left out when its recorded email has been scheduled or sent,
// or when that email's state is unknown (to avoid sending it twice). It goes
// back in when its email was deleted. A recorded email still in DRAFT is the
// pending draft: it is regenerated with its own releases and any new ones. If
// there is more than one, the one recorded last is used and the others'
// releases move into it.
func PlanDigest(record Record, releases []Release, emails map[string]EmailState, now time.Time) Plan {
	settled := map[string]bool{}
	draft := ""
	for _, recorded := range record.Releases {
		if recorded.DigestEmailID == nil || *recorded.DigestEmailID == "" {
			continue
		}
		state, known := emails[*recorded.DigestEmailID]
		switch {
		case known && state.Deleted:
		case known && state.State == "DRAFT":
			draft = *recorded.DigestEmailID
		default:
			settled[recorded.ID] = true
		}
	}

	pending := []Release{}
	for _, r := range releases {
		if r.Date >= record.GoLive && !settled[r.ID] {
			pending = append(pending, r)
		}
	}
	sortNewestFirst(pending)

	day, reason := sendNotBefore(emails, now)
	return Plan{Releases: pending, DraftEmailID: draft, SendNotBefore: day, SendNotBeforeReason: reason}
}

// sendNotBefore is today, or the next weekday if today is a weekend or a
// digest is already scheduled or sent today, in now's time zone. It also
// says why.
func sendNotBefore(emails map[string]EmailState, now time.Time) (string, string) {
	today := now.Format("2006-01-02")
	day := now
	reason := "no digest has been scheduled or sent today"
	for _, e := range emails {
		if e.Deleted || e.State == "DRAFT" || e.PublishDate == "" {
			continue
		}
		published, err := time.Parse(time.RFC3339, e.PublishDate)
		if err == nil && published.In(now.Location()).Format("2006-01-02") == today {
			day = day.AddDate(0, 0, 1)
			reason = "a digest is already scheduled or sent today"
			break
		}
	}
	if day.Weekday() == time.Saturday || day.Weekday() == time.Sunday {
		if day.Format("2006-01-02") == today {
			reason = "digests only go out on weekdays"
		}
		for day.Weekday() == time.Saturday || day.Weekday() == time.Sunday {
			day = day.AddDate(0, 0, 1)
		}
	}
	return day.Format("2006-01-02"), reason
}
