// Command release-digest plans the next SKE release digest email and writes it
// to the GitHub Actions step outputs. It does not create or send anything.
package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"log"
	"os"

	digest "github.com/syntasso/kratix-docs/scripts/release-digest"
)

func main() {
	docsDir := flag.String("docs", "docs/ske/08-releases-and-support", "directory of SKE release-notes pages")
	recordPath := flag.String("record", "scripts/release-digest/release-record.json", "release record JSON file")
	flag.Parse()

	if err := run(*docsDir, *recordPath); err != nil {
		log.Fatal(err)
	}
}

func run(docsDir, recordPath string) error {
	recordJSON, err := os.ReadFile(recordPath)
	if err != nil {
		return fmt.Errorf("reading release record: %w", err)
	}
	var record digest.Record
	if err := json.Unmarshal(recordJSON, &record); err != nil {
		return fmt.Errorf("parsing release record: %w", err)
	}

	releases, err := digest.LoadReleases(os.DirFS(docsDir))
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

	summary, closeSummary, err := appendTo(os.Getenv("GITHUB_STEP_SUMMARY"))
	if err != nil {
		return err
	}
	defer closeSummary()
	return writeSummary(summary, record, pending, email)
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

func writeSummary(w io.Writer, record digest.Record, pending []digest.Release, email digest.Email) error {
	if len(pending) == 0 {
		_, err := fmt.Fprintf(w, "## Release digest\n\nNo releases on or after %s are waiting for a digest email.\n", record.GoLive)
		return err
	}
	_, err := fmt.Fprintf(w, "## Release digest: planned email\n\n**Subject:** %s\n\n%d release(s) on or after %s.\n\n---\n\n%s\n",
		email.Subject, len(pending), record.GoLive, email.HTML)
	return err
}
