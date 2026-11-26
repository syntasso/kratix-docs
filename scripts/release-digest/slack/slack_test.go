package slack_test

import (
	"context"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"net/http/httptest"
	"time"

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"

	"github.com/syntasso/kratix-docs/scripts/release-digest/slack"
)

var _ = Describe("Client", func() {
	var (
		method        string
		body          map[string]any
		authorization string
		response      string
		client        slack.Client
	)

	BeforeEach(func() {
		response = `{"ok": true}`
		server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			method = r.URL.Path
			authorization = r.Header.Get("Authorization")
			raw, _ := io.ReadAll(r.Body)
			body = nil
			_ = json.Unmarshal(raw, &body)
			_, _ = io.WriteString(w, response)
		}))
		DeferCleanup(server.Close)
		client = slack.Client{BaseURL: server.URL, Token: "xoxb-test", HTTP: server.Client()}
	})

	It("posts a message and returns its ts", func() {
		response = `{"ok": true, "channel": "C0123", "ts": "1772618400.000100"}`

		ts, err := client.PostMessage(context.Background(), "C0123", "Hello")

		Expect(err).NotTo(HaveOccurred())
		Expect(ts).To(Equal("1772618400.000100"))
		Expect(method).To(Equal("/chat.postMessage"))
		Expect(authorization).To(Equal("Bearer xoxb-test"))
		Expect(body).To(Equal(map[string]any{"channel": "C0123", "text": "Hello", "unfurl_links": false}))
	})

	It("updates a message", func() {
		Expect(client.UpdateMessage(context.Background(), "C0123", "1772618400.000100", "Changed")).To(Succeed())

		Expect(method).To(Equal("/chat.update"))
		Expect(body).To(Equal(map[string]any{"channel": "C0123", "ts": "1772618400.000100", "text": "Changed"}))
	})

	It("schedules a message for a time and returns its ID", func() {
		response = `{"ok": true, "scheduled_message_id": "Q1298393284", "post_at": 1778410800}`
		postAt := time.Date(2026, 11, 10, 13, 0, 0, 0, time.UTC)

		id, err := client.ScheduleMessage(context.Background(), "C0123", postAt, "Ready to send")

		Expect(err).NotTo(HaveOccurred())
		Expect(id).To(Equal("Q1298393284"))
		Expect(method).To(Equal("/chat.scheduleMessage"))
		Expect(body["post_at"]).To(BeNumerically("==", postAt.Unix()))
		Expect(body["text"]).To(Equal("Ready to send"))
	})

	It("deletes a scheduled message", func() {
		Expect(client.DeleteScheduledMessage(context.Background(), "C0123", "Q1298393284")).To(Succeed())

		Expect(method).To(Equal("/chat.deleteScheduledMessage"))
		Expect(body).To(Equal(map[string]any{"channel": "C0123", "scheduled_message_id": "Q1298393284"}))
	})

	It("returns Slack's error code when Slack says ok is false", func() {
		response = `{"ok": false, "error": "not_in_channel"}`

		_, err := client.PostMessage(context.Background(), "C0123", "Hello")

		Expect(err).To(MatchError(ContainSubstring("chat.postMessage: not_in_channel")))
		var slackErr *slack.Error
		Expect(errors.As(err, &slackErr)).To(BeTrue())
		Expect(slackErr.Code).To(Equal("not_in_channel"))
	})
})
