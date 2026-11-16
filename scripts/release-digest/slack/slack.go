// Package slack posts and schedules release digest messages in Slack.
package slack

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

// DefaultBaseURL is Slack's Web API.
const DefaultBaseURL = "https://slack.com/api"

// Client calls Slack's Web API with a bot token that has chat:write.
type Client struct {
	BaseURL string
	Token   string
	HTTP    *http.Client
}

// Error is Slack's error code for a failed call. Slack reports failures with
// HTTP 200 and "ok": false.
type Error struct {
	Method string
	Code   string
}

func (e *Error) Error() string {
	return fmt.Sprintf("Slack %s: %s", e.Method, e.Code)
}

// PostMessage posts text to a channel and returns the message's ts.
func (c Client) PostMessage(ctx context.Context, channel, text string) (string, error) {
	var result struct {
		TS string `json:"ts"`
	}
	err := c.call(ctx, "chat.postMessage", map[string]any{"channel": channel, "text": text, "unfurl_links": false}, &result)
	return result.TS, err
}

// UpdateMessage replaces a posted message's text.
func (c Client) UpdateMessage(ctx context.Context, channel, ts, text string) error {
	return c.call(ctx, "chat.update", map[string]any{"channel": channel, "ts": ts, "text": text}, nil)
}

// ScheduleMessage schedules text to be posted at postAt and returns the
// scheduled message's ID.
func (c Client) ScheduleMessage(ctx context.Context, channel string, postAt time.Time, text string) (string, error) {
	var result struct {
		ID string `json:"scheduled_message_id"`
	}
	err := c.call(ctx, "chat.scheduleMessage", map[string]any{"channel": channel, "post_at": postAt.Unix(), "text": text}, &result)
	return result.ID, err
}

// DeleteScheduledMessage cancels a scheduled message before it is posted.
func (c Client) DeleteScheduledMessage(ctx context.Context, channel, id string) error {
	return c.call(ctx, "chat.deleteScheduledMessage", map[string]any{"channel": channel, "scheduled_message_id": id}, nil)
}

func (c Client) call(ctx context.Context, method string, body map[string]any, result any) error {
	raw, err := json.Marshal(body)
	if err != nil {
		return err
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, c.BaseURL+"/"+method, bytes.NewReader(raw))
	if err != nil {
		return err
	}
	req.Header.Set("Authorization", "Bearer "+c.Token)
	req.Header.Set("Content-Type", "application/json; charset=utf-8")

	httpClient := c.HTTP
	if httpClient == nil {
		httpClient = http.DefaultClient
	}
	resp, err := httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("Slack %s: %w", method, err)
	}
	defer resp.Body.Close()
	payload, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("Slack %s: %w", method, err)
	}

	var status struct {
		OK    bool   `json:"ok"`
		Error string `json:"error"`
	}
	if err := json.Unmarshal(payload, &status); err != nil {
		return fmt.Errorf("Slack %s returned HTTP %d that is not JSON", method, resp.StatusCode)
	}
	if !status.OK {
		return &Error{Method: method, Code: status.Error}
	}
	if result != nil {
		return json.Unmarshal(payload, result)
	}
	return nil
}
