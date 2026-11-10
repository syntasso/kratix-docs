package digest_test

import (
	"time"

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"

	digest "github.com/syntasso/kratix-docs/scripts/release-digest"
)

type planInput struct {
	Record digest.Record
	Emails map[string]digest.EmailState
}

var _ = Describe("PlanDigest", func() {
	var (
		london   *time.Location
		tuesday  time.Time
		releases []digest.Release
	)

	email := func(id string) *string { return &id }

	BeforeEach(func() {
		var err error
		london, err = time.LoadLocation("Europe/London")
		Expect(err).NotTo(HaveOccurred())
		tuesday = time.Date(2026, 11, 10, 11, 0, 0, 0, london)
		releases = []digest.Release{
			dated("a@1.0.0", "Alpha", "2026-11-10"),
			dated("b@1.0.0", "Beta", "2026-11-09"),
			dated("c@1.0.0", "Gamma", "2026-11-09"),
			dated("old@1.0.0", "Old", "2026-11-01"),
		}
	})

	record := func(recorded ...digest.RecordedRelease) digest.Record {
		return digest.Record{GoLive: "2026-11-09", Releases: recorded}
	}

	It("plans a new draft of every release since go-live when nothing is recorded", func() {
		plan := digest.PlanDigest(record(), releases, nil, tuesday)

		Expect(ids(plan.Releases)).To(Equal([]string{"a@1.0.0", "b@1.0.0", "c@1.0.0"}))
		Expect(plan.DraftEmailID).To(BeEmpty())
		Expect(plan.SendNotBefore).To(Equal("2026-11-10"))
	})

	It("leaves out releases whose email is scheduled or sent", func() {
		plan := digest.PlanDigest(record(
			digest.RecordedRelease{ID: "b@1.0.0", DigestEmailID: email("1")},
			digest.RecordedRelease{ID: "c@1.0.0", DigestEmailID: email("2")},
		), releases, map[string]digest.EmailState{
			"1": {State: "PUBLISHED", PublishDate: "2026-11-09T10:00:00Z"},
			"2": {State: "SCHEDULED", PublishDate: "2026-11-11T09:30:00Z"},
		}, tuesday)

		Expect(ids(plan.Releases)).To(Equal([]string{"a@1.0.0"}))
		Expect(plan.DraftEmailID).To(BeEmpty())
	})

	It("regenerates the pending draft with its own releases and the new ones", func() {
		plan := digest.PlanDigest(record(
			digest.RecordedRelease{ID: "b@1.0.0", DigestEmailID: email("7")},
			digest.RecordedRelease{ID: "c@1.0.0", DigestEmailID: email("7")},
		), releases, map[string]digest.EmailState{"7": {State: "DRAFT"}}, tuesday)

		Expect(plan.DraftEmailID).To(Equal("7"))
		Expect(ids(plan.Releases)).To(Equal([]string{"a@1.0.0", "b@1.0.0", "c@1.0.0"}))
	})

	It("puts releases whose email was deleted back in the digest", func() {
		plan := digest.PlanDigest(record(
			digest.RecordedRelease{ID: "b@1.0.0", DigestEmailID: email("5")},
		), releases, map[string]digest.EmailState{"5": {Deleted: true}}, tuesday)

		Expect(plan.DraftEmailID).To(BeEmpty())
		Expect(ids(plan.Releases)).To(ContainElement("b@1.0.0"))
	})

	It("keeps a release out when its email's state is unknown, rather than risk sending it twice", func() {
		plan := digest.PlanDigest(record(
			digest.RecordedRelease{ID: "b@1.0.0", DigestEmailID: email("9")},
		), releases, map[string]digest.EmailState{}, tuesday)

		Expect(ids(plan.Releases)).NotTo(ContainElement("b@1.0.0"))
	})

	It("merges two pending drafts into the one recorded last", func() {
		plan := digest.PlanDigest(record(
			digest.RecordedRelease{ID: "b@1.0.0", DigestEmailID: email("7")},
			digest.RecordedRelease{ID: "c@1.0.0", DigestEmailID: email("8")},
		), releases, map[string]digest.EmailState{"7": {State: "DRAFT"}, "8": {State: "DRAFT"}}, tuesday)

		Expect(plan.DraftEmailID).To(Equal("8"))
		Expect(ids(plan.Releases)).To(Equal([]string{"a@1.0.0", "b@1.0.0", "c@1.0.0"}))
	})

	Describe("one digest a day", func() {
		sentAt := func(state, publishDate string) planInput {
			return planInput{
				Record: record(digest.RecordedRelease{ID: "b@1.0.0", DigestEmailID: email("1")}),
				Emails: map[string]digest.EmailState{"1": {State: state, PublishDate: publishDate}},
			}
		}

		plan := func(in planInput, now time.Time) digest.Plan {
			return digest.PlanDigest(in.Record, releases, in.Emails, now)
		}

		It("holds the digest until the next business day when one is scheduled for today", func() {
			Expect(plan(sentAt("SCHEDULED", "2026-11-10T15:00:00Z"), tuesday).SendNotBefore).To(Equal("2026-11-11"))
		})

		It("holds the digest until the next business day when one was sent today", func() {
			Expect(plan(sentAt("PUBLISHED", "2026-11-10T09:31:00.387Z"), tuesday).SendNotBefore).To(Equal("2026-11-11"))
		})

		It("goes to Monday when Friday's digest has already gone", func() {
			friday := time.Date(2026, 11, 13, 14, 0, 0, 0, london)
			Expect(plan(sentAt("PUBLISHED", "2026-11-13T09:31:00Z"), friday).SendNotBefore).To(Equal("2026-11-16"))
		})

		It("allows today when the last digest went yesterday", func() {
			Expect(plan(sentAt("PUBLISHED", "2026-11-09T10:00:00Z"), tuesday).SendNotBefore).To(Equal("2026-11-10"))
		})

		It("compares dates in UK time, not UTC", func() {
			// 00:30 on 11 November in London is 00:30 UTC in winter; in summer it would be
			// 23:30 UTC the day before. Use a summer date to check the conversion.
			summer := time.Date(2026, 7, 15, 10, 0, 0, 0, london)
			Expect(plan(sentAt("PUBLISHED", "2026-07-14T23:30:00Z"), summer).SendNotBefore).To(Equal("2026-07-16"))
		})

		It("moves a weekend to Monday", func() {
			saturday := time.Date(2026, 11, 14, 10, 0, 0, 0, london)
			Expect(digest.PlanDigest(record(), releases, nil, saturday).SendNotBefore).To(Equal("2026-11-16"))
		})
	})
})
