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
		Expect(string(summary)).To(ContainSubstring("No releases on or after 09/11/2026"))
	})

	Describe("creating or updating the HubSpot draft", func() {
		var (
			hubspot    *httptest.Server
			requests   []string
			bodies     []map[string]any
			emails     map[string]string // email ID -> GET response; missing means 404
			mu         sync.Mutex
			layoutPath string
		)

		BeforeEach(func() {
			requests, bodies, emails = nil, nil, map[string]string{}
			hubspot = httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				raw, _ := io.ReadAll(r.Body)
				var body map[string]any
				_ = json.Unmarshal(raw, &body)
				mu.Lock()
				defer mu.Unlock()
				requests = append(requests, r.Method+" "+r.URL.Path)
				bodies = append(bodies, body)
				Expect(r.Header.Get("Authorization")).To(Equal("Bearer test-token"))

				switch {
				case r.Method == http.MethodPost:
					w.WriteHeader(http.StatusCreated)
					_, _ = io.WriteString(w, `{"id": "511778652367"}`)
				case r.Method == http.MethodGet:
					response, ok := emails[filepath.Base(r.URL.Path)]
					if !ok {
						w.WriteHeader(http.StatusNotFound)
						_, _ = io.WriteString(w, `{"category": "OBJECT_NOT_FOUND"}`)
						return
					}
					_, _ = io.WriteString(w, response)
				default:
					_, _ = io.WriteString(w, `{}`)
				}
			}))
			DeferCleanup(hubspot.Close)

			var err error
			layoutPath, err = filepath.Abs("../../email-layout.json")
			Expect(err).NotTo(HaveOccurred())
		})

		draftArgs := func() []string {
			return []string{"-create-draft", "-layout", layoutPath, "-hubspot-api", hubspot.URL}
		}

		runDraft := func(record string, env ...string) *gexec.Session {
			session := start(record, draftArgs(), append([]string{"HUBSPOT_ACCESS_TOKEN=test-token"}, env...)...)
			Eventually(session).Should(gexec.Exit(0))
			return session
		}

		read := func(path string) string {
			content, err := os.ReadFile(path)
			Expect(err).NotTo(HaveOccurred())
			return string(content)
		}

		bodyHTML := func(i int) string {
			widgets := bodies[i]["content"].(map[string]any)["widgets"].(map[string]any)
			return widgets["module-0-0-0"].(map[string]any)["body"].(map[string]any)["html"].(string)
		}

		It("creates a draft, records it against its releases, and reports it", func() {
			runDraft(`{"goLive": "2026-11-09", "releases": []}`)

			Expect(requests).To(Equal([]string{
				"POST /marketing/v3/emails",
				"PATCH /marketing/v3/emails/511778652367/draft",
			}))
			Expect(bodies[0]["name"]).To(HavePrefix("SKE release digest "))
			Expect(bodies[0]["subject"]).To(Equal("SKE release updates: Portal Patch"))
			Expect(bodyHTML(1)).To(ContainSubstring("<h2>Portal Patch v0.8.6</h2>"))

			Expect(read(recordPath)).To(Equal(`{
  "goLive": "2026-11-09",
  "releases": [
    {
      "id": "portal-patch@0.8.6",
      "digestEmailId": "511778652367"
    }
  ]
}
`))
			output := read(outputPath)
			Expect(output).To(ContainSubstring("email_id=511778652367\n"))
			Expect(output).To(ContainSubstring("draft_action=created\n"))
			Expect(output).To(ContainSubstring("record_changed=true\n"))
			Expect(output).To(MatchRegexp(`send_not_before=\d{4}-\d{2}-\d{2}\n`))
			Expect(read(summaryPath)).To(MatchRegexp(`Created HubSpot draft email 511778652367\. It has not been sent\. Send it no earlier than \d{2}/\d{2}/\d{4}\.`))
			Expect(read(summaryPath)).To(ContainSubstring("1 release on or after 09/11/2026"))
		})

		It("regenerates the pending draft with the new release instead of creating another", func() {
			emails["7"] = `{"id": "7", "state": "DRAFT"}`

			runDraft(`{"goLive": "2026-11-06", "releases": [{"id": "portal-patch@0.8.6", "digestEmailId": "7"}]}`)

			Expect(requests).To(Equal([]string{
				"GET /marketing/v3/emails/7",
				"PATCH /marketing/v3/emails/7/draft",
			}))
			Expect(bodies[1]["subject"]).To(Equal("SKE release updates: Portal Patch"))
			Expect(bodyHTML(1)).To(ContainSubstring("<h2>Portal Patch v0.8.6</h2>"))
			Expect(bodyHTML(1)).To(ContainSubstring("<h2>Portal Patch v0.8.5</h2>"))
			Expect(read(recordPath)).To(ContainSubstring(`"id": "portal-patch@0.8.5",
      "digestEmailId": "7"`))
			Expect(read(outputPath)).To(ContainSubstring("draft_action=updated\n"))
			Expect(read(summaryPath)).To(ContainSubstring("Updated HubSpot draft email 7"))
		})

		It("does nothing in HubSpot when every release's email has been sent", func() {
			emails["1"] = `{"id": "1", "state": "PUBLISHED", "publishDate": "2026-11-09T10:00:00Z"}`
			record := `{"goLive": "2026-11-09", "releases": [{"id": "portal-patch@0.8.6", "digestEmailId": "1"}]}`

			runDraft(record)

			Expect(requests).To(Equal([]string{"GET /marketing/v3/emails/1"}))
			Expect(read(recordPath)).To(Equal(record))
			Expect(read(outputPath)).To(ContainSubstring("has_releases=false\n"))
			Expect(read(outputPath)).NotTo(ContainSubstring("email_id="))
		})

		It("puts a release back into a new draft when its email was deleted", func() {
			runDraft(`{"goLive": "2026-11-09", "releases": [{"id": "portal-patch@0.8.6", "digestEmailId": "5"}]}`)

			Expect(requests).To(Equal([]string{
				"GET /marketing/v3/emails/5",
				"POST /marketing/v3/emails",
				"PATCH /marketing/v3/emails/511778652367/draft",
			}))
			Expect(read(recordPath)).To(ContainSubstring(`"digestEmailId": "511778652367"`))
			Expect(read(recordPath)).NotTo(ContainSubstring(`"5"`))
		})

		Describe("the log", func() {
			It("explains each stage of creating a draft", func() {
				session := runDraft(`{"goLive": "2026-11-09", "releases": []}`)

				Expect(session.Err).To(gbytes.Say(`Release notes: read 2 releases from .*docs`))
				Expect(session.Err).To(gbytes.Say(`Release record: go-live 09/11/2026, no releases recorded yet`))
				Expect(session.Err).To(gbytes.Say(`Digest: 1 release on or after 09/11/2026`))
				Expect(session.Err).To(gbytes.Say(`  - portal-patch@0\.8\.6 \(09/11/2026\)`))
				Expect(session.Err).To(gbytes.Say(`HubSpot: created draft email 511778652367`))
				Expect(session.Err).To(gbytes.Say(`Release record: 1 release recorded against email 511778652367`))
				Expect(session.Err).To(gbytes.Say(`Earliest send date: \d{2}/\d{2}/\d{4} \(.+\)`))
			})

			It("says which recorded emails are pending, sent or deleted", func() {
				emails["7"] = `{"id": "7", "state": "DRAFT"}`
				emails["1"] = `{"id": "1", "state": "PUBLISHED", "publishDate": "2026-11-09T10:00:00Z"}`

				session := runDraft(`{"goLive": "2026-11-06", "releases": [
					{"id": "portal-patch@0.8.6", "digestEmailId": "7"},
					{"id": "portal-patch@0.8.4", "digestEmailId": "1"},
					{"id": "portal-patch@0.8.3", "digestEmailId": "5"}]}`)

				Expect(session.Err).To(gbytes.Say(`Release record: go-live 06/11/2026, 3 releases recorded against 3 emails`))
				Expect(session.Err).To(gbytes.Say(`HubSpot: email 7 is DRAFT: the pending draft`))
				Expect(session.Err).To(gbytes.Say(`HubSpot: email 1 is PUBLISHED \(09/11/2026 10:00 UK time\): its releases stay out of the digest`))
				Expect(session.Err).To(gbytes.Say(`HubSpot: email 5 has been deleted: its releases go back into the digest`))
				Expect(session.Err).To(gbytes.Say(`HubSpot: updated draft email 7`))
			})

			It("says when there is nothing to send and the record is unchanged", func() {
				emails["1"] = `{"id": "1", "state": "PUBLISHED", "publishDate": "2026-11-09T10:00:00Z"}`

				session := runDraft(`{"goLive": "2026-11-09", "releases": [{"id": "portal-patch@0.8.6", "digestEmailId": "1"}]}`)

				Expect(session.Err).To(gbytes.Say(`Digest: nothing to send`))
				Expect(session.Err).To(gbytes.Say(`HubSpot: no draft to create or update`))
				Expect(session.Err).To(gbytes.Say(`Release record: unchanged`))
			})

			It("says HubSpot was not contacted without -create-draft", func() {
				session := start(`{"goLive": "2026-11-09", "releases": []}`, nil)
				Eventually(session).Should(gexec.Exit(0))

				Expect(session.Err).To(gbytes.Say(`HubSpot: not contacted. A release with a recorded email counts as sent. Run with -create-draft`))
			})

			It("raises a notice on the GitHub run page", func() {
				session := runDraft(`{"goLive": "2026-11-09", "releases": []}`, "GITHUB_ACTIONS=true")

				Expect(session.Err).To(gbytes.Say(`::notice title=Release digest::Created HubSpot draft email 511778652367 with 1 release\. Send it no earlier than \d{2}/\d{2}/\d{4}\.`))
			})
		})

		It("does not contact HubSpot without -create-draft", func() {
			session := start(`{"goLive": "2026-11-09", "releases": []}`,
				[]string{"-layout", layoutPath, "-hubspot-api", hubspot.URL}, "HUBSPOT_ACCESS_TOKEN=test-token")
			Eventually(session).Should(gexec.Exit(0))

			Expect(requests).To(BeEmpty())
			Expect(read(recordPath)).To(Equal(`{"goLive": "2026-11-09", "releases": []}`))
		})

		It("fails before planning anything when -create-draft has no token", func() {
			session := start(`{"goLive": "2026-11-09", "releases": []}`, draftArgs(), "HUBSPOT_ACCESS_TOKEN=")
			Eventually(session).Should(gexec.Exit(1))

			Expect(session.Err).To(gbytes.Say("HUBSPOT_ACCESS_TOKEN"))
			Expect(requests).To(BeEmpty())
		})
	})
})
