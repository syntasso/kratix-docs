package digest_test

import (
	"fmt"
	"testing/fstest"

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"

	digest "github.com/syntasso/kratix-docs/scripts/release-digest"
)

const s3 = "http://syntasso-enterprise-releases.s3-website.eu-west-2.amazonaws.com"

func page(slug, title, releaseNotes string) string {
	return fmt.Sprintf(`---
title: %s
sidebar_label: "%s"
slug: "%s"
---

## Overview

Some overview text.

## Release Notes

%s`, title, title, slug, releaseNotes)
}

func ids(releases []digest.Release) []string {
	result := []string{}
	for _, r := range releases {
		result = append(result, r.ID)
	}
	return result
}

var _ = Describe("ParseReleasePage", func() {
	It("parses a linked heading with an ISO date", func() {
		releases := digest.ParseReleasePage(page("/ske/releases/portal-patch", "Portal Patch",
			"### [v0.8.6]("+s3+"/#portal-patch/v0.8.6/) (2026-11-09)\n\n#### Maintenance\n\n* Base image updates.\n\n"+
				"### [v0.8.5]("+s3+"/#portal-patch/v0.8.5/) (2026-11-06)\n\n#### Maintenance\n\n* Older.\n"))

		Expect(releases).To(HaveLen(2))
		Expect(releases[0]).To(Equal(digest.Release{
			ID:        "portal-patch@v0.8.6",
			Component: "Portal Patch",
			Label:     "v0.8.6",
			Date:      "2026-11-09",
			PageURL:   "https://docs.kratix.io/ske/releases/portal-patch",
			Body:      "#### Maintenance\n\n* Base image updates.",
		}))
		Expect(releases[1].ID).To(Equal("portal-patch@v0.8.5"))
	})

	It("parses level-two headings", func() {
		releases := digest.ParseReleasePage(page("/ske/releases/ske-mcp-server", "SKE MCP Server",
			"## [0.2.8]("+s3+"/#ske-mcp-server/v0.2.8/) (2026-11-05)\n\n### Features\n\n* A feature.\n\n"+
				"## [0.2.7]("+s3+"/#ske-mcp-server/v0.2.7/) (2026-10-28)\n\n### Security Fixes\n\n* Updates.\n"))

		Expect(ids(releases)).To(Equal([]string{"ske-mcp-server@0.2.8", "ske-mcp-server@0.2.7"}))
		Expect(releases[1].Date).To(Equal("2026-10-28"))
		Expect(releases[0].Body).To(Equal("### Features\n\n* A feature."))
	})

	It("parses a heading that names several packages", func() {
		releases := digest.ParseReleasePage(page("/ske/releases/backstage", "Backstage plugins",
			"### [ske-backend v0.26.0]("+s3+"/#backstage/ske-backend-v0.26.0/); [ske-frontend v0.23.1]("+s3+"/#backstage/ske-frontend-v0.23.1/) (2026-11-09)\n\n#### Features\n\n* A feature.\n"))

		Expect(releases[0].ID).To(Equal("backstage@ske-backend v0.26.0; ske-frontend v0.23.1"))
		Expect(releases[0].Label).To(Equal("ske-backend v0.26.0; ske-frontend v0.23.1"))
	})

	It("parses unlinked headings with day-month-year dates", func() {
		releases := digest.ParseReleasePage(page("/ske/releases/promise-testing-framework", "Promise Testing Framework",
			"### v0.1.7 (27-10-2026)\n\n#### Security Fixes\n\n* Updates.\n"))

		Expect(releases[0].ID).To(Equal("promise-testing-framework@v0.1.7"))
		Expect(releases[0].Date).To(Equal("2026-10-27"))
	})

	It("prefixes releases with the tool heading they sit under", func() {
		releases := digest.ParseReleasePage(page("/ske/releases/ske-lift", "SKE Lift",
			"### kratix-skelift-check\n\n#### v0.1.2 (21-10-2026)\n\n* A change.\n\n"+
				"### kratix-skelift-review\n\n#### v0.1.2 (27-10-2026)\n\n* Another change.\n"))

		Expect(ids(releases)).To(Equal([]string{
			"ske-lift@kratix-skelift-check v0.1.2",
			"ske-lift@kratix-skelift-review v0.1.2",
		}))
		Expect(releases[0].Body).To(Equal("* A change."))
	})

	It("parses a date with no space before it and a heading anchor after it", func() {
		releases := digest.ParseReleasePage(page("/ske/releases/backstage-generator", "Backstage Generator",
			"### [v0.17.0]("+s3+"/#aspects/ske-backstage-generator/v0.17.0/)(2025-07-11) {#v0.17.0}\n\n* A change.\n"))

		Expect(releases[0].ID).To(Equal("backstage-generator@v0.17.0"))
		Expect(releases[0].Date).To(Equal("2025-07-11"))
	})

	It("reads a minor-version section by its \"Latest version\" line", func() {
		releases := digest.ParseReleasePage(page("/ske/releases/portal-controller", "Portal Controller",
			"### v0.10\n\nLatest version: [v0.10.2]("+s3+"/#ske-portal-controller/v0.10.2/) (2026-11-09), released via the SKE Operator Helm Chart [version 0.109.0]("+s3+"/#ske-operator-helm-chart/0.109.0/)\n\n"+
				"#### Bug Fixes\n\n* A fix.\n\nEarlier v0.10 versions:\n\n"+
				"* [v0.10.1]("+s3+"/#ske-portal-controller/v0.10.1/) (2026-11-06), released via the SKE Operator Helm Chart\n\n"+
				"### [v0.9.0]("+s3+"/#ske-portal-controller/v0.9.0/) (2026-11-02)\n\n* Older.\n"))

		Expect(ids(releases)).To(Equal([]string{"portal-controller@v0.10.2", "portal-controller@v0.9.0"}))
		Expect(releases[0].Date).To(Equal("2026-11-09"))
		Expect(releases[0].Body).To(HavePrefix("#### Bug Fixes\n\n* A fix."))
		Expect(releases[0].Body).NotTo(ContainSubstring("Latest version"))
	})

	It("ignores headings inside code blocks", func() {
		releases := digest.ParseReleasePage(page("/ske/releases/x", "X",
			"### [v1.0.0]("+s3+"/#x/v1.0.0/) (2026-11-09)\n\n```markdown\n### [v9.9.9]("+s3+"/#x/v9.9.9/) (2026-11-09)\n```\n"))

		Expect(ids(releases)).To(Equal([]string{"x@v1.0.0"}))
	})

	It("returns nothing for a page without release notes", func() {
		Expect(digest.ParseReleasePage("---\ntitle: Support\nslug: \"/ske/releases/support\"\n---\n\n## Overview\n")).To(BeEmpty())
	})
})

var _ = Describe("LoadReleases", func() {
	It("reads every Markdown page in the directory tree and skips other files", func() {
		fsys := fstest.MapFS{
			"02-ske.mdx": {Data: []byte(page("/ske/releases/ske", "SKE",
				"### [v0.63.0]("+s3+"/#ske/v0.63.0/) (2026-10-29)\n\n* A change.\n"))},
			"04-integrations/01-portal-patch.mdx": {Data: []byte(page("/ske/releases/portal-patch", "Portal Patch",
				"### [v0.8.6]("+s3+"/#portal-patch/v0.8.6/) (2026-11-09)\n\n* A change.\n"))},
			"04-integrations/_category_.json": {Data: []byte(`{"label": "Integrations"}`)},
		}

		releases, err := digest.LoadReleases(fsys)

		Expect(err).NotTo(HaveOccurred())
		Expect(ids(releases)).To(ConsistOf("ske@v0.63.0", "portal-patch@v0.8.6"))
	})
})
