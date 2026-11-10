// Package hubspot creates release digest draft emails in HubSpot.
package hubspot

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
)

// DefaultBaseURL is HubSpot's API.
const DefaultBaseURL = "https://api.hubapi.com"

// bodyBlock is the layout's rich-text block that holds the digest HTML.
const bodyBlock = "module-0-0-0"

// Layout is the drag-and-drop content a digest email is built from:
// email-layout.json in this module.
type Layout struct {
	templatePath string
	content      map[string]any
}

// LoadLayout reads a layout file and checks it has a rich-text body block.
func LoadLayout(path string) (Layout, error) {
	source, err := os.ReadFile(path)
	if err != nil {
		return Layout{}, fmt.Errorf("reading the email layout: %w", err)
	}
	var file struct {
		TemplatePath  string         `json:"templatePath"`
		StyleSettings map[string]any `json:"styleSettings"`
		FlexAreas     map[string]any `json:"flexAreas"`
		Widgets       map[string]any `json:"widgets"`
	}
	if err := json.Unmarshal(source, &file); err != nil {
		return Layout{}, fmt.Errorf("parsing the email layout: %w", err)
	}

	block, _ := file.Widgets[bodyBlock].(map[string]any)
	body, _ := block["body"].(map[string]any)
	if body["path"] != "@hubspot/rich_text" {
		return Layout{}, fmt.Errorf("the email layout has no %s rich-text block for the body", bodyBlock)
	}

	content := map[string]any{"flexAreas": file.FlexAreas, "widgets": file.Widgets}
	if file.StyleSettings != nil {
		content["styleSettings"] = file.StyleSettings
	}
	return Layout{templatePath: file.TemplatePath, content: content}, nil
}

// withBody returns a copy of the layout's content with html in the body block.
func (l Layout) withBody(html string) (map[string]any, error) {
	raw, err := json.Marshal(l.content)
	if err != nil {
		return nil, err
	}
	var content map[string]any
	if err := json.Unmarshal(raw, &content); err != nil {
		return nil, err
	}
	widgets := content["widgets"].(map[string]any)
	widgets[bodyBlock].(map[string]any)["body"].(map[string]any)["html"] = html
	return content, nil
}

// Draft is a digest email to create.
type Draft struct {
	Name    string
	Subject string
	Layout  Layout
	HTML    string
}

// Client calls HubSpot's marketing email API with a static access token.
type Client struct {
	BaseURL string
	Token   string
	HTTP    *http.Client
}

// apiError is a failed HubSpot call, with HubSpot's own explanation.
type apiError struct {
	Status   int
	Category string `json:"category"`
	Message  string `json:"message"`
}

func (e *apiError) Error() string {
	return fmt.Sprintf("HubSpot returned %d %s: %s", e.Status, e.Category, e.Message)
}

// CreateDraft creates the email and sets its draft content. A new email starts
// with no blocks, so the content is the whole layout with the HTML in its body
// block. If the content cannot be set, the new email is deleted again.
func (c Client) CreateDraft(ctx context.Context, d Draft) (string, error) {
	var created struct {
		ID string `json:"id"`
	}
	err := c.do(ctx, http.MethodPost, "/marketing/v3/emails", map[string]any{
		"name":         d.Name,
		"subject":      d.Subject,
		"templatePath": d.Layout.templatePath,
	}, &created)
	if err != nil {
		return "", fmt.Errorf("creating the email: %w", err)
	}

	content, err := d.Layout.withBody(d.HTML)
	if err == nil {
		err = c.do(ctx, http.MethodPatch, "/marketing/v3/emails/"+created.ID+"/draft",
			map[string]any{"content": content}, nil)
	}
	if err != nil {
		err = fmt.Errorf("setting the body of email %s: %w", created.ID, err)
		if deleteErr := c.do(ctx, http.MethodDelete, "/marketing/v3/emails/"+created.ID, nil, nil); deleteErr != nil {
			err = errors.Join(err, fmt.Errorf("could not delete it either, so delete email %s by hand: %w", created.ID, deleteErr))
		}
		return "", err
	}
	return created.ID, nil
}

// EmailStatus is what CI needs to know about a recorded digest email.
type EmailStatus struct {
	// State is HubSpot's state, such as DRAFT, SCHEDULED or PUBLISHED.
	State string
	// PublishDate is when the email is or was sent, if it has been scheduled.
	PublishDate string
	// Deleted is true when HubSpot no longer has the email.
	Deleted bool
}

// EmailStatus reads an email's state. An email HubSpot no longer has is
// reported as deleted rather than as an error.
func (c Client) EmailStatus(ctx context.Context, id string) (EmailStatus, error) {
	var email struct {
		State       string `json:"state"`
		PublishDate string `json:"publishDate"`
	}
	err := c.do(ctx, http.MethodGet, "/marketing/v3/emails/"+id, nil, &email)
	var failure *apiError
	if errors.As(err, &failure) && failure.Status == http.StatusNotFound {
		return EmailStatus{Deleted: true}, nil
	}
	if err != nil {
		return EmailStatus{}, fmt.Errorf("reading email %s: %w", id, err)
	}
	return EmailStatus{State: email.State, PublishDate: email.PublishDate}, nil
}

// UpdateDraft replaces an existing email's draft subject and whole body. The
// email's name is left as it is.
func (c Client) UpdateDraft(ctx context.Context, id string, d Draft) error {
	content, err := d.Layout.withBody(d.HTML)
	if err == nil {
		err = c.do(ctx, http.MethodPatch, "/marketing/v3/emails/"+id+"/draft",
			map[string]any{"subject": d.Subject, "content": content}, nil)
	}
	if err != nil {
		return fmt.Errorf("updating email %s: %w", id, err)
	}
	return nil
}

func (c Client) do(ctx context.Context, method, path string, body, result any) error {
	var reader io.Reader
	if body != nil {
		raw, err := json.Marshal(body)
		if err != nil {
			return err
		}
		reader = bytes.NewReader(raw)
	}

	req, err := http.NewRequestWithContext(ctx, method, c.BaseURL+path, reader)
	if err != nil {
		return err
	}
	req.Header.Set("Authorization", "Bearer "+c.Token)
	req.Header.Set("Content-Type", "application/json")

	httpClient := c.HTTP
	if httpClient == nil {
		httpClient = http.DefaultClient
	}
	resp, err := httpClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	raw, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	if resp.StatusCode < 200 || resp.StatusCode > 299 {
		failure := &apiError{Status: resp.StatusCode}
		_ = json.Unmarshal(raw, failure)
		return failure
	}
	if result != nil && len(raw) > 0 {
		return json.Unmarshal(raw, result)
	}
	return nil
}
