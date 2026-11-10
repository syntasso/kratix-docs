package digest_test

import (
	"time"

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"

	digest "github.com/syntasso/kratix-docs/scripts/release-digest"
)

var _ = Describe("HoldEnd", func() {
	var london *time.Location

	BeforeEach(func() {
		var err error
		london, err = time.LoadLocation("Europe/London")
		Expect(err).NotTo(HaveOccurred())
	})

	// at is a time in UK time on a day in November 2026: 10 November is a Tuesday.
	at := func(day, hour, minute int) time.Time {
		return time.Date(2026, 11, day, hour, minute, 0, 0, london)
	}

	holdFrom := func(start time.Time, sendNotBefore string) time.Time {
		return digest.HoldEnd(start, sendNotBefore)
	}

	It("ends two hours later within business hours", func() {
		Expect(holdFrom(at(10, 11, 0), "2026-11-10")).To(Equal(at(10, 13, 0)))
	})

	It("can end exactly at the close of business", func() {
		Expect(holdFrom(at(10, 14, 30), "2026-11-10")).To(Equal(at(10, 16, 30)))
	})

	It("carries time left at 16:30 over to 09:30 on the next weekday", func() {
		Expect(holdFrom(at(10, 15, 30), "2026-11-10")).To(Equal(at(11, 10, 30)))
	})

	It("starts at 09:30 when the release lands before business hours", func() {
		Expect(holdFrom(at(10, 8, 0), "2026-11-10")).To(Equal(at(10, 11, 30)))
	})

	It("starts at 09:30 the next weekday when the release lands after business hours", func() {
		Expect(holdFrom(at(10, 17, 0), "2026-11-10")).To(Equal(at(11, 11, 30)))
	})

	It("carries Friday's remaining time over to Monday", func() {
		Expect(holdFrom(at(13, 16, 0), "2026-11-13")).To(Equal(at(16, 11, 0)))
	})

	It("starts at 09:30 on Monday when the release lands at the weekend", func() {
		Expect(holdFrom(at(14, 10, 0), "2026-11-16")).To(Equal(at(16, 11, 30)))
	})

	It("starts at 09:30 on the earliest send date when that is a later day", func() {
		Expect(holdFrom(at(10, 11, 0), "2026-11-11")).To(Equal(at(11, 11, 30)))
	})

	It("works in British Summer Time", func() {
		start := time.Date(2026, 7, 15, 15, 0, 0, 0, london)
		Expect(holdFrom(start, "2026-07-15")).To(Equal(time.Date(2026, 7, 16, 10, 0, 0, 0, london)))
	})

	It("returns UK time whatever time zone the start is in", func() {
		Expect(holdFrom(at(10, 11, 0).UTC(), "2026-11-10").Location().String()).To(Equal("Europe/London"))
	})
})
