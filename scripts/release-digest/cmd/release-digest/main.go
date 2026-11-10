// Command release-digest plans the next SKE release digest email and writes it
// to the GitHub Actions step outputs. With -create-draft it also creates the
// email as a HubSpot draft. It never publishes or sends anything.
package main

import (
	"context"
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	digest "github.com/syntasso/kratix-docs/scripts/release-digest"
	"github.com/syntasso/kratix-docs/scripts/release-digest/hubspot"
)

type options struct {
	docsDir, recordPath, layoutPath, hubspotAPI string
	createDraft                                 bool
	token                                       string
}

func main() {
	var o options
	flag.StringVar(&o.docsDir, "docs", "docs/ske/08-releases-and-support", "directory of SKE release-notes pages")
	flag.StringVar(&o.recordPath, "record", "scripts/release-digest/release-record.json", "release record JSON file")
	flag.BoolVar(&o.createDraft, "create-draft", false, "create the planned email as a HubSpot draft (needs HUBSPOT_ACCESS_TOKEN)")
	flag.StringVar(&o.layoutPath, "layout", "scripts/release-digest/email-layout.json", "HubSpot email layout JSON file")
	flag.StringVar(&o.hubspotAPI, "hubspot-api", hubspot.DefaultBaseURL, "HubSpot API base URL")
	flag.Parse()
	o.token = os.Getenv("HUBSPOT_ACCESS_TOKEN")

	if err := run(o); err != nil {
		log.Fatal(err)
	}
}

func run(o options) error {
	var layout hubspot.Layout
	if o.createDraft {
		if o.token == "" {
			return errors.New("-create-draft needs the HUBSPOT_ACCESS_TOKEN environment variable")
		}
		var err error
		if layout, err = hubspot.LoadLayout(o.layoutPath); err != nil {
			return err
		}
	}

	recordJSON, err := os.ReadFile(o.recordPath)
	if err != nil {
		return fmt.Errorf("reading release record: %w", err)
	}
	var record digest.Record
	if err := json.Unmarshal(recordJSON, &record); err != nil {
		return fmt.Errorf("parsing release record: %w", err)
	}

	releases, err := digest.LoadReleases(os.DirFS(o.docsDir))
	if err != nil {
		return fmt.Errorf("reading release notes: %w", err)
	}

	pending := digest.SelectPending(record, releases)
	email := digest.RenderEmail(pending)

	outputs, closeOutputs, err := appendTo(os.Getenv("GITHUB_OUTPUT"))
	if err != nil {
		return err
	}
	defer closeOutputs()
	if err := digest.WriteOutputs(outputs, pending, email); err != nil {
		return fmt.Errorf("writing outputs: %w", err)
	}

	emailID := ""
	if o.createDraft && len(pending) > 0 {
		ctx, cancel := context.WithTimeout(context.Background(), time.Minute)
		defer cancel()
		client := hubspot.Client{BaseURL: o.hubspotAPI, Token: o.token, HTTP: &http.Client{Timeout: 30 * time.Second}}
		emailID, err = client.CreateDraft(ctx, hubspot.Draft{
			Name:    "SKE release digest " + time.Now().UTC().Format("2006-01-02"),
			Subject: email.Subject,
			Layout:  layout,
			HTML:    email.HTML,
		})
		if err != nil {
			return fmt.Errorf("creating the HubSpot draft: %w", err)
		}
		if _, err := fmt.Fprintf(outputs, "email_id=%s\n", emailID); err != nil {
			return fmt.Errorf("writing outputs: %w", err)
		}
	}

	summary, closeSummary, err := appendTo(os.Getenv("GITHUB_STEP_SUMMARY"))
	if err != nil {
		return err
	}
	defer closeSummary()
	return writeSummary(summary, record, pending, email, emailID)
}

// appendTo opens a GitHub Actions file for appending, or uses stdout when the
// variable is unset (running locally).
func appendTo(path string) (io.Writer, func(), error) {
	if path == "" {
		return os.Stdout, func() {}, nil
	}
	f, err := os.OpenFile(path, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0o644)
	if err != nil {
		return nil, nil, err
	}
	return f, func() { _ = f.Close() }, nil
}

func writeSummary(w io.Writer, record digest.Record, pending []digest.Release, email digest.Email, emailID string) error {
	if len(pending) == 0 {
		_, err := fmt.Fprintf(w, "## Release digest\n\nNo releases on or after %s are waiting for a digest email.\n", record.GoLive)
		return err
	}
	created := ""
	if emailID != "" {
		created = fmt.Sprintf("Created HubSpot draft email %s. It has not been sent.\n\n", emailID)
	}
	_, err := fmt.Fprintf(w, "## Release digest: planned email\n\n%s**Subject:** %s\n\n%d release(s) on or after %s.\n\n---\n\n%s\n",
		created, email.Subject, len(pending), record.GoLive, email.HTML)
	return err
}
