package digest_test

import (
	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"

	digest "github.com/syntasso/kratix-docs/scripts/release-digest"
)

var _ = Describe("Record", func() {
	emailID := func(id string) *string { return &id }

	Describe("Assign", func() {
		It("adds releases it has not seen, tied to the email", func() {
			record := digest.Record{GoLive: "2026-11-09"}

			record.Assign([]string{"portal-patch@0.8.6", "ske-gui@0.17.12"}, "511778652367")

			Expect(record.Releases).To(Equal([]digest.RecordedRelease{
				{ID: "portal-patch@0.8.6", DigestEmailID: emailID("511778652367")},
				{ID: "ske-gui@0.17.12", DigestEmailID: emailID("511778652367")},
			}))
		})

		It("moves a release it has seen to the new email, keeping its place", func() {
			record := digest.Record{GoLive: "2026-11-09", Releases: []digest.RecordedRelease{
				{ID: "a@1.0.0", DigestEmailID: emailID("1")},
				{ID: "b@1.0.0", DigestEmailID: emailID("2")},
			}}

			record.Assign([]string{"a@1.0.0"}, "3")

			Expect(record.Releases).To(Equal([]digest.RecordedRelease{
				{ID: "a@1.0.0", DigestEmailID: emailID("3")},
				{ID: "b@1.0.0", DigestEmailID: emailID("2")},
			}))
		})

		It("reports whether anything changed", func() {
			record := digest.Record{GoLive: "2026-11-09"}

			Expect(record.Assign([]string{"a@1.0.0"}, "1")).To(BeTrue())
			Expect(record.Assign([]string{"a@1.0.0"}, "1")).To(BeFalse())
			Expect(record.Assign(nil, "1")).To(BeFalse())
		})
	})

	Describe("MarshalRecord", func() {
		It("writes indented JSON with a trailing newline, and null for no email", func() {
			record := digest.Record{GoLive: "2026-11-09", Releases: []digest.RecordedRelease{
				{ID: "a@1.0.0", DigestEmailID: emailID("1")},
				{ID: "b@1.0.0"},
			}}

			Expect(string(digest.MarshalRecord(record))).To(Equal(`{
  "goLive": "2026-11-09",
  "releases": [
    {
      "id": "a@1.0.0",
      "digestEmailId": "1"
    },
    {
      "id": "b@1.0.0",
      "digestEmailId": null
    }
  ]
}
`))
		})

		It("writes an empty list, not null, when there are no releases", func() {
			Expect(string(digest.MarshalRecord(digest.Record{GoLive: "2026-11-09"}))).To(Equal(`{
  "goLive": "2026-11-09",
  "releases": []
}
`))
		})

		It("round-trips the committed release record unchanged", func() {
			committed, err := digest.LoadRecord("release-record.json")
			Expect(err).NotTo(HaveOccurred())

			Expect(digest.MarshalRecord(committed)).To(Equal(mustRead("release-record.json")))
		})
	})
})
