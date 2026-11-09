package main_test

import (
	"os"
	"os/exec"
	"path/filepath"

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
	"github.com/onsi/gomega/gexec"
)

var _ = Describe("release-digest", func() {
	var (
		binary, workDir, docsDir, recordPath, outputPath, summaryPath string
	)

	BeforeEach(func() {
		var err error
		binary, err = gexec.Build("github.com/syntasso/kratix-docs/scripts/release-digest/cmd/release-digest")
		Expect(err).NotTo(HaveOccurred())
		DeferCleanup(gexec.CleanupBuildArtifacts)

		workDir = GinkgoT().TempDir()
		docsDir = filepath.Join(workDir, "docs")
		Expect(os.MkdirAll(docsDir, 0o755)).To(Succeed())
		Expect(os.WriteFile(filepath.Join(docsDir, "01-portal-patch.mdx"), []byte(`---
title: Portal Patch
slug: "/ske/releases/portal-patch"
---

## Release Notes

### [v0.8.6](http://example.com/v0.8.6/) (2026-11-09)

* Base image updates.

### [v0.8.5](http://example.com/v0.8.5/) (2026-11-06)

* Older.
`), 0o644)).To(Succeed())
		recordPath = filepath.Join(workDir, "record.json")
		outputPath = filepath.Join(workDir, "output")
		summaryPath = filepath.Join(workDir, "summary")
	})

	run := func(record string) *gexec.Session {
		Expect(os.WriteFile(recordPath, []byte(record), 0o644)).To(Succeed())
		command := exec.Command(binary, "-docs", docsDir, "-record", recordPath)
		command.Env = append(os.Environ(), "GITHUB_OUTPUT="+outputPath, "GITHUB_STEP_SUMMARY="+summaryPath)
		session, err := gexec.Start(command, GinkgoWriter, GinkgoWriter)
		Expect(err).NotTo(HaveOccurred())
		Eventually(session).Should(gexec.Exit(0))
		return session
	}

	It("writes the planned email to the step outputs and a preview to the job summary", func() {
		run(`{"goLive": "2026-11-09", "releases": []}`)

		output, err := os.ReadFile(outputPath)
		Expect(err).NotTo(HaveOccurred())
		Expect(string(output)).To(ContainSubstring("has_releases=true\n"))
		Expect(string(output)).To(ContainSubstring(`release_ids=["portal-patch@v0.8.6"]`))
		Expect(string(output)).To(ContainSubstring("subject=SKE release updates: Portal Patch\n"))
		Expect(string(output)).To(ContainSubstring("<h2>Portal Patch v0.8.6</h2>"))
		Expect(string(output)).NotTo(ContainSubstring("v0.8.5"))

		summary, err := os.ReadFile(summaryPath)
		Expect(err).NotTo(HaveOccurred())
		Expect(string(summary)).To(ContainSubstring("**Subject:** SKE release updates: Portal Patch"))
		Expect(string(summary)).To(ContainSubstring("<h2>Portal Patch v0.8.6</h2>"))
	})

	It("reports nothing to send when every release is already in a digest email", func() {
		run(`{"goLive": "2026-11-09", "releases": [{"id": "portal-patch@v0.8.6", "digestEmailId": "38175169118"}]}`)

		output, err := os.ReadFile(outputPath)
		Expect(err).NotTo(HaveOccurred())
		Expect(string(output)).To(Equal("has_releases=false\nrelease_ids=[]\n"))

		summary, err := os.ReadFile(summaryPath)
		Expect(err).NotTo(HaveOccurred())
		Expect(string(summary)).To(ContainSubstring("No releases on or after 2026-11-09"))
	})
})
