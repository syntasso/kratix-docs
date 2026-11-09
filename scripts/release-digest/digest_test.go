package digest_test

import (
	"bytes"
	"strings"

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"

	digest "github.com/syntasso/kratix-docs/scripts/release-digest"
)

func release(change func(*digest.Release)) digest.Release {
	r := digest.Release{
		ID:        "portal-patch@v0.8.6",
		Component: "Portal Patch",
		Label:     "v0.8.6",
		Date:      "2026-11-09",
		PageURL:   "https://docs.kratix.io/ske/releases/portal-patch",
		Body:      "#### Maintenance\n\n* Base image updates.",
	}
	if change != nil {
		change(&r)
	}
	return r
}

func dated(id, component, date string) digest.Release {
	return release(func(r *digest.Release) { r.ID, r.Component, r.Date = id, component, date })
}

var _ = Describe("SelectPending", func() {
	It("selects releases from the go-live date onwards", func() {
		pending := digest.SelectPending(digest.Record{GoLive: "2026-11-09"}, []digest.Release{
			dated("a@v2", "A", "2026-11-09"),
			dated("a@v1", "A", "2026-11-08"),
		})

		Expect(ids(pending)).To(Equal([]string{"a@v2"}))
	})

	It("leaves out releases already recorded against a digest email", func() {
		emailID := "38175169118"
		pending := digest.SelectPending(digest.Record{
			GoLive: "2026-11-09",
			Releases: []digest.RecordedRelease{
				{ID: "a@v2", DigestEmailID: &emailID},
				{ID: "b@v1", DigestEmailID: nil},
			},
		}, []digest.Release{
			dated("a@v2", "A", "2026-11-10"),
			dated("b@v1", "B", "2026-11-10"),
		})

		Expect(ids(pending)).To(Equal([]string{"b@v1"}))
	})

	It("orders pending releases newest first, then by component", func() {
		pending := digest.SelectPending(digest.Record{GoLive: "2026-11-01"}, []digest.Release{
			dated("z@v1", "Zeta", "2026-11-09"),
			dated("a@v1", "Alpha", "2026-11-02"),
			dated("b@v1", "Beta", "2026-11-09"),
		})

		Expect(ids(pending)).To(Equal([]string{"b@v1", "z@v1", "a@v1"}))
	})
})

var _ = Describe("RenderEmail", func() {
	It("renders each release with its component, version, date and a link to its notes", func() {
		email := digest.RenderEmail([]digest.Release{release(nil)})

		Expect(email.HTML).To(ContainSubstring("<h2>Portal Patch v0.8.6</h2>"))
		Expect(email.HTML).To(ContainSubstring("9 November 2026"))
		Expect(email.HTML).To(ContainSubstring(`<a href="https://docs.kratix.io/ske/releases/portal-patch">`))
		Expect(email.HTML).To(ContainSubstring("<h4>Maintenance</h4>"))
		Expect(email.HTML).To(ContainSubstring("<li>Base image updates.</li>"))
	})

	It("makes links to other docs pages absolute", func() {
		email := digest.RenderEmail([]digest.Release{release(func(r *digest.Release) {
			r.Body = "See the [guide](/ske/guides/promise-upgrades)."
		})})

		Expect(email.HTML).To(ContainSubstring(`href="https://docs.kratix.io/ske/guides/promise-upgrades"`))
	})

	It("names the components in the subject, once each", func() {
		email := digest.RenderEmail([]digest.Release{
			release(nil),
			release(func(r *digest.Release) { r.ID, r.Label = "portal-patch@v0.8.5", "v0.8.5" }),
			release(func(r *digest.Release) { r.ID, r.Component = "tfstate-finder@v0.13.5", "Terraform State Finder" }),
		})

		Expect(email.Subject).To(Equal("SKE release updates: Portal Patch, Terraform State Finder"))
	})
})

var _ = Describe("WriteOutputs", func() {
	It("writes the planned email as GitHub step outputs, multi-line values included", func() {
		var out bytes.Buffer
		email := digest.Email{Subject: "SKE release updates: Portal Patch", HTML: "<h2>A</h2>\n<p>B</p>"}

		Expect(digest.WriteOutputs(&out, []digest.Release{release(nil)}, email)).To(Succeed())

		lines := strings.Split(out.String(), "\n")
		Expect(lines[:3]).To(Equal([]string{
			"has_releases=true",
			`release_ids=["portal-patch@v0.8.6"]`,
			"subject=SKE release updates: Portal Patch",
		}))
		Expect(lines[3]).To(HavePrefix("html<<"))
		delimiter := strings.TrimPrefix(lines[3], "html<<")
		Expect(delimiter).NotTo(BeEmpty())
		Expect(lines[4:]).To(Equal([]string{"<h2>A</h2>", "<p>B</p>", delimiter, ""}))
	})

	It("says there is nothing to send when no release is pending", func() {
		var out bytes.Buffer

		Expect(digest.WriteOutputs(&out, nil, digest.Email{})).To(Succeed())

		Expect(out.String()).To(Equal("has_releases=false\nrelease_ids=[]\n"))
	})
})
