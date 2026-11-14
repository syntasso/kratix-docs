package digest

import "time"

// HoldDuration is how long a digest waits after its last new release before
// the CS team is asked to send it. Only business hours count.
const HoldDuration = 2 * time.Hour

// Business hours, in UK time, on weekdays.
const (
	openHour, openMinute   = 9, 30
	closeHour, closeMinute = 16, 30
)

// HoldEnd is when the hold ends for a digest whose newest release arrived at
// start. The hold counts business hours only: it starts at start, or at 09:30
// on sendNotBefore (YYYY-MM-DD) if that is later, and time left at 16:30
// carries over to 09:30 on the next weekday. The result is in UK time.
func HoldEnd(start time.Time, sendNotBefore string) time.Time {
	london, err := time.LoadLocation("Europe/London")
	if err != nil {
		london = time.UTC
	}
	current := start.In(london)
	if day, err := time.ParseInLocation("2006-01-02", sendNotBefore, london); err == nil {
		if earliest := atTime(day, openHour, openMinute); earliest.After(current) {
			current = earliest
		}
	}

	remaining := HoldDuration
	for {
		current = nextBusinessMoment(current)
		closing := atTime(current, closeHour, closeMinute)
		if left := closing.Sub(current); remaining <= left {
			return current.Add(remaining)
		} else {
			remaining -= left
		}
		current = atTime(current.AddDate(0, 0, 1), openHour, openMinute)
	}
}

// nextBusinessMoment moves t forward to the first moment within business
// hours: unchanged if it already is, otherwise 09:30 on this or the next
// weekday.
func nextBusinessMoment(t time.Time) time.Time {
	for {
		if t.Weekday() == time.Saturday || t.Weekday() == time.Sunday {
			t = atTime(t.AddDate(0, 0, 1), openHour, openMinute)
			continue
		}
		opening, closing := atTime(t, openHour, openMinute), atTime(t, closeHour, closeMinute)
		switch {
		case t.Before(opening):
			return opening
		case !t.Before(closing):
			t = atTime(t.AddDate(0, 0, 1), openHour, openMinute)
		default:
			return t
		}
	}
}

func atTime(day time.Time, hour, minute int) time.Time {
	return time.Date(day.Year(), day.Month(), day.Day(), hour, minute, 0, 0, day.Location())
}
