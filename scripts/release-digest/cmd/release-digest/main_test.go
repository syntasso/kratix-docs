package main_test

import (
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"os/exec"
	"path/filepath"
	"sync"

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
	"github.com/onsi/gomega/gbytes"
	"github.com/onsi/gomega/gexec"
)

var _ = Describe("release-digest", func() {
	var (
		workDir, docsDir, recordPath, outputPath, summaryPath string
	)

	BeforeEach(func() {
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

	start := func(record string, args []string, env ...string) *gexec.Session {
		Expect(os.WriteFile(recordPath, []byte(record), 0o644)).To(Succeed())
		command := exec.Command(binary, append([]string{"-docs", docsDir, "-record", recordPath}, args...)...)
		command.Env = append(os.Environ(), append([]string{"GITHUB_OUTPUT=" + outputPath, "GITHUB_STEP_SUMMARY=" + summaryPath}, env...)...)
		session, err := gexec.Start(command, GinkgoWriter, GinkgoWriter)
		Expect(err).NotTo(HaveOccurred())
		return session
	}

	run := func(record string) *gexec.Session {
		session := start(record, nil)
		Eventually(session).Should(gexec.Exit(0))
		return session
	}

	It("writes the planned email to the step outputs and a preview to the job summary", func() {
		run(`{"goLive": "2026-11-09", "releases": []}`)

		output, err := os.ReadFile(outputPath)
		Expect(err).NotTo(HaveOccurred())
		Expect(string(output)).To(ContainSubstring("has_releases=true\n"))
		Expect(string(output)).To(ContainSubstring(`release_ids=["portal-patch@0.8.6"]`))
		Expect(string(output)).To(ContainSubstring("subject=SKE release updates: Portal Patch\n"))
		Expect(string(output)).To(ContainSubstring("<h2>Portal Patch v0.8.6</h2>"))
		Expect(string(output)).NotTo(ContainSubstring("v0.8.5"))

		summary, err := os.ReadFile(summaryPath)
		Expect(err).NotTo(HaveOccurred())
		Expect(string(summary)).To(ContainSubstring("**Subject:** SKE release updates: Portal Patch"))
		Expect(string(summary)).To(ContainSubstring("<h2>Portal Patch v0.8.6</h2>"))
	})

	It("reports nothing to send when every release is already in a digest email", func() {
		run(`{"goLive": "2026-11-09", "releases": [{"id": "portal-patch@0.8.6", "digestEmailId": "38175169118"}]}`)

		output, err := os.ReadFile(outputPath)
		Expect(err).NotTo(HaveOccurred())
		Expect(string(output)).To(Equal("has_releases=false\nrelease_ids=[]\n"))

		summary, err := os.ReadFile(summaryPath)
		Expect(err).NotTo(HaveOccurred())
		Expect(string(summary)).To(ContainSubstring("No releases on or after 2026-11-09"))
	})

	Describe("creating the HubSpot draft", func() {
		var (
			hubspot    *httptest.Server
			requests   []string
			bodies     []map[string]any
			mu         sync.Mutex
			layoutPath string
		)

		BeforeEach(func() {
			requests, bodies = nil, nil
			hubspot = httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				raw, _ := io.ReadAll(r.Body)
				var body map[string]any
				_ = json.Unmarshal(raw, &body)
				mu.Lock()
				requests = append(requests, r.Method+" "+r.URL.Path+" "+r.Header.Get("Authorization"))
				bodies = append(bodies, body)
				mu.Unlock()
				if r.Method == http.MethodPost {
					w.WriteHeader(http.StatusCreated)
					_, _ = io.WriteString(w, `{"id": "511778652367"}`)
					return
				}
				w.WriteHeader(http.StatusOK)
				_, _ = io.WriteString(w, `{}`)
			}))
			DeferCleanup(hubspot.Close)

			var err error
			layoutPath, err = filepath.Abs("../../email-layout.json")
			Expect(err).NotTo(HaveOccurred())
		})

		draftArgs := func() []string {
			return []string{"-create-draft", "-layout", layoutPath, "-hubspot-api", hubspot.URL}
		}

		It("creates the draft from the layout and writes its ID to the step outputs and summary", func() {
			session := start(`{"goLive": "2026-11-09", "releases": []}`, draftArgs(), "HUBSPOT_ACCESS_TOKEN=test-token")
			Eventually(session).Should(gexec.Exit(0))

			Expect(requests).To(Equal([]string{
				"POST /marketing/v3/emails Bearer test-token",
				"PATCH /marketing/v3/emails/511778652367/draft Bearer test-token",
			}))
			Expect(bodies[0]["name"]).To(HavePrefix("SKE release digest "))
			Expect(bodies[0]["subject"]).To(Equal("SKE release updates: Portal Patch"))
			widgets := bodies[1]["content"].(map[string]any)["widgets"].(map[string]any)
			html := widgets["module-0-0-0"].(map[string]any)["body"].(map[string]any)["html"]
			Expect(html).To(ContainSubstring("<h2>Portal Patch v0.8.6</h2>"))

			output, err := os.ReadFile(outputPath)
			Expect(err).NotTo(HaveOccurred())
			Expect(string(output)).To(ContainSubstring("email_id=511778652367\n"))
			summary, err := os.ReadFile(summaryPath)
			Expect(err).NotTo(HaveOccurred())
			Expect(string(summary)).To(ContainSubstring("Created HubSpot draft email 511778652367"))
		})

		It("does not contact HubSpot when no release is pending", func() {
			session := start(`{"goLive": "2026-11-09", "releases": [{"id": "portal-patch@0.8.6", "digestEmailId": "1"}]}`,
				draftArgs(), "HUBSPOT_ACCESS_TOKEN=test-token")
			Eventually(session).Should(gexec.Exit(0))

			Expect(requests).To(BeEmpty())
			output, err := os.ReadFile(outputPath)
			Expect(err).NotTo(HaveOccurred())
			Expect(string(output)).NotTo(ContainSubstring("email_id="))
		})

		It("does not contact HubSpot without -create-draft", func() {
			session := start(`{"goLive": "2026-11-09", "releases": []}`,
				[]string{"-layout", layoutPath, "-hubspot-api", hubspot.URL}, "HUBSPOT_ACCESS_TOKEN=test-token")
			Eventually(session).Should(gexec.Exit(0))

			Expect(requests).To(BeEmpty())
		})

		It("fails before planning anything when -create-draft has no token", func() {
			session := start(`{"goLive": "2026-11-09", "releases": []}`, draftArgs(), "HUBSPOT_ACCESS_TOKEN=")
			Eventually(session).Should(gexec.Exit(1))

			Expect(session.Err).To(gbytes.Say("HUBSPOT_ACCESS_TOKEN"))
			Expect(requests).To(BeEmpty())
		})
	})
})
