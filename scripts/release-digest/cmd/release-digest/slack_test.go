package main_test

import (
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"sync"
	"time"

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
	"github.com/onsi/gomega/gbytes"
	"github.com/onsi/gomega/gexec"
)

type call struct {
	Method string
	Body   map[string]any
}

var _ = Describe("Slack message and hold-end ping", func() {
	var (
		workDir, docsDir, recordPath, layoutPath string
		hubspot, slackAPI                        *httptest.Server
		emails                                   map[string]string // HubSpot email ID -> GET response
		slackCalls                               []call
		slackErrors                              map[string]string // Slack method -> error code
		mu                                       sync.Mutex
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
		var err error
		layoutPath, err = filepath.Abs("../../email-layout.json")
		Expect(err).NotTo(HaveOccurred())

		emails, slackCalls, slackErrors = map[string]string{}, nil, map[string]string{}
		hubspot = httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			switch r.Method {
			case http.MethodPost:
				w.WriteHeader(http.StatusCreated)
				_, _ = io.WriteString(w, `{"id": "511778652367"}`)
			case http.MethodGet:
				response, ok := emails[filepath.Base(r.URL.Path)]
				if !ok {
					w.WriteHeader(http.StatusNotFound)
					return
				}
				_, _ = io.WriteString(w, response)
			default:
				_, _ = io.WriteString(w, `{}`)
			}
		}))
		DeferCleanup(hubspot.Close)

		slackAPI = httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			raw, _ := io.ReadAll(r.Body)
			var body map[string]any
			_ = json.Unmarshal(raw, &body)
			method := strings.TrimPrefix(r.URL.Path, "/")
			mu.Lock()
			slackCalls = append(slackCalls, call{method, body})
			code, fails := slackErrors[method]
			mu.Unlock()
			Expect(r.Header.Get("Authorization")).To(Equal("Bearer xoxb-test"))

			if fails {
				_, _ = io.WriteString(w, `{"ok": false, "error": "`+code+`"}`)
				return
			}
			switch method {
			case "chat.postMessage":
				_, _ = io.WriteString(w, `{"ok": true, "ts": "1772618400.000100"}`)
			case "chat.scheduleMessage":
				_, _ = io.WriteString(w, `{"ok": true, "scheduled_message_id": "Q-new"}`)
			default:
				_, _ = io.WriteString(w, `{"ok": true}`)
			}
		}))
		DeferCleanup(slackAPI.Close)
	})

	run := func(record string, env ...string) *gexec.Session {
		Expect(os.WriteFile(recordPath, []byte(record), 0o644)).To(Succeed())
		command := exec.Command(binary, "-docs", docsDir, "-record", recordPath,
			"-create-draft", "-layout", layoutPath, "-hubspot-api", hubspot.URL,
			"-slack-api", slackAPI.URL, "-slack-channel", "C0123")
		command.Env = append(os.Environ(), append([]string{
			"GITHUB_OUTPUT=" + filepath.Join(workDir, "output"),
			"GITHUB_STEP_SUMMARY=" + filepath.Join(workDir, "summary"),
			"HUBSPOT_ACCESS_TOKEN=test-token",
			"SLACK_BOT_TOKEN=xoxb-test",
		}, env...)...)
		session, err := gexec.Start(command, GinkgoWriter, GinkgoWriter)
		Expect(err).NotTo(HaveOccurred())
		Eventually(session).Should(gexec.Exit(0))
		return session
	}

	type savedRecord struct {
		Digests map[string]struct {
			SlackChannel            string `json:"slackChannel"`
			SlackMessageTs          string `json:"slackMessageTs"`
			SlackScheduledMessageID string `json:"slackScheduledMessageId"`
			HoldEndsAt              string `json:"holdEndsAt"`
		} `json:"digests"`
	}

	saved := func() savedRecord {
		raw, err := os.ReadFile(recordPath)
		Expect(err).NotTo(HaveOccurred())
		var r savedRecord
		Expect(json.Unmarshal(raw, &r)).To(Succeed())
		return r
	}

	methods := func() []string {
		names := []string{}
		for _, c := range slackCalls {
			names = append(names, c.Method)
		}
		return names
	}

	It("posts the digest message and schedules the ping for when the hold ends, then records both", func() {
		session := run(`{"goLive": "2026-11-09", "releases": []}`)

		Expect(methods()).To(Equal([]string{"chat.postMessage", "chat.scheduleMessage"}))
		post := slackCalls[0].Body
		Expect(post["channel"]).To(Equal("C0123"))
		Expect(post["text"]).To(ContainSubstring("SKE release updates: Portal Patch"))
		Expect(post["text"]).To(ContainSubstring("portal-patch@0.8.6"))
		Expect(post["text"]).To(ContainSubstring("511778652367"))
		Expect(post["text"]).To(MatchRegexp(`Hold ends: \d{2}/\d{2}/\d{4} \d{2}:\d{2} UK time`))

		digest := saved().Digests["511778652367"]
		Expect(digest.SlackChannel).To(Equal("C0123"))
		Expect(digest.SlackMessageTs).To(Equal("1772618400.000100"))
		Expect(digest.SlackScheduledMessageID).To(Equal("Q-new"))
		holdEnds, err := time.Parse(time.RFC3339, digest.HoldEndsAt)
		Expect(err).NotTo(HaveOccurred())
		Expect(slackCalls[1].Body["post_at"]).To(BeNumerically("==", holdEnds.Unix()))
		Expect(slackCalls[1].Body["text"]).To(ContainSubstring("511778652367"))

		Expect(session.Err).To(gbytes.Say(`Slack: posted the digest message`))
		Expect(session.Err).To(gbytes.Say(`Slack: scheduled the hold-end ping for \d{2}/\d{2}/\d{4} \d{2}:\d{2} UK time`))
	})

	It("updates the same message and replaces the ping when a new release joins the draft", func() {
		emails["7"] = `{"id": "7", "state": "DRAFT"}`

		run(`{"goLive": "2026-11-06",
			"releases": [{"id": "portal-patch@0.8.6", "digestEmailId": "7"}],
			"digests": {"7": {"slackChannel": "C0123", "slackMessageTs": "111.222",
				"slackScheduledMessageId": "Q-old", "holdEndsAt": "2026-11-10T13:00:00Z"}}}`)

		Expect(methods()).To(Equal([]string{"chat.update", "chat.deleteScheduledMessage", "chat.scheduleMessage"}))
		Expect(slackCalls[0].Body["ts"]).To(Equal("111.222"))
		Expect(slackCalls[0].Body["text"]).To(ContainSubstring("portal-patch@0.8.5"))
		Expect(slackCalls[1].Body["scheduled_message_id"]).To(Equal("Q-old"))
		digest := saved().Digests["7"]
		Expect(digest.SlackMessageTs).To(Equal("111.222"))
		Expect(digest.SlackScheduledMessageID).To(Equal("Q-new"))
		Expect(digest.HoldEndsAt).NotTo(Equal("2026-11-10T13:00:00Z"))
	})

	It("leaves Slack and the hold alone when a run adds no new releases", func() {
		emails["7"] = `{"id": "7", "state": "DRAFT"}`
		record := `{"goLive": "2026-11-09",
			"releases": [{"id": "portal-patch@0.8.6", "digestEmailId": "7"}],
			"digests": {"7": {"slackChannel": "C0123", "slackMessageTs": "111.222",
				"slackScheduledMessageId": "Q-old", "holdEndsAt": "2026-11-10T13:00:00Z"}}}`

		session := run(record)

		Expect(slackCalls).To(BeEmpty())
		raw, _ := os.ReadFile(recordPath)
		Expect(string(raw)).To(Equal(record))
		Expect(session.Err).To(gbytes.Say(`Slack: no new releases, so the message and the hold are unchanged`))
	})

	It("cancels the ping and marks the message once the digest is scheduled or sent", func() {
		emails["7"] = `{"id": "7", "state": "SCHEDULED", "publishDate": "2026-11-10T15:00:00Z"}`

		session := run(`{"goLive": "2026-11-09",
			"releases": [{"id": "portal-patch@0.8.6", "digestEmailId": "7"}],
			"digests": {"7": {"slackChannel": "C0123", "slackMessageTs": "111.222",
				"slackScheduledMessageId": "Q-old", "holdEndsAt": "2026-11-10T13:00:00Z"}}}`)

		Expect(methods()).To(Equal([]string{"chat.deleteScheduledMessage", "chat.update"}))
		Expect(slackCalls[0].Body["scheduled_message_id"]).To(Equal("Q-old"))
		Expect(slackCalls[1].Body["text"]).To(ContainSubstring("SCHEDULED"))
		Expect(saved().Digests["7"].SlackScheduledMessageID).To(BeEmpty())
		Expect(session.Err).To(gbytes.Say(`Slack: email 7 is SCHEDULED, so its hold-end ping is cancelled`))
	})

	It("carries on when the old ping cannot be cancelled, and says so", func() {
		emails["7"] = `{"id": "7", "state": "DRAFT"}`
		slackErrors["chat.deleteScheduledMessage"] = "invalid_scheduled_message_id"

		session := run(`{"goLive": "2026-11-06",
			"releases": [{"id": "portal-patch@0.8.6", "digestEmailId": "7"}],
			"digests": {"7": {"slackChannel": "C0123", "slackMessageTs": "111.222",
				"slackScheduledMessageId": "Q-old", "holdEndsAt": "2026-11-10T13:00:00Z"}}}`)

		Expect(methods()).To(ContainElement("chat.scheduleMessage"))
		Expect(session.Err).To(gbytes.Say(`Slack: could not cancel the previous ping Q-old \(invalid_scheduled_message_id\)`))
	})

	It("still saves the new draft in the record when Slack fails, and warns", func() {
		slackErrors["chat.postMessage"] = "not_in_channel"
		slackErrors["chat.scheduleMessage"] = "not_in_channel"

		session := run(`{"goLive": "2026-11-09", "releases": []}`)

		raw, err := os.ReadFile(recordPath)
		Expect(err).NotTo(HaveOccurred())
		Expect(string(raw)).To(ContainSubstring(`"digestEmailId": "511778652367"`))
		Expect(session.Err).To(gbytes.Say(`Warning: Slack: could not post the digest message: Slack chat\.postMessage: not_in_channel`))
		Expect(session.Err).To(gbytes.Say(`Warning: Slack: could not schedule the hold-end ping`))
	})

	It("skips Slack, and says so, without a Slack token", func() {
		session := run(`{"goLive": "2026-11-09", "releases": []}`, "SLACK_BOT_TOKEN=")

		Expect(slackCalls).To(BeEmpty())
		Expect(saved().Digests).To(BeEmpty())
		Expect(session.Err).To(gbytes.Say(`Slack: skipped, because SLACK_BOT_TOKEN or the channel is not set`))
	})
})
