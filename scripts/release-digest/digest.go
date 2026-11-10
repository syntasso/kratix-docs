// Package digest turns SKE release-notes pages into a planned release digest email.
package digest

import (
	"bytes"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"html"
	"io"
	"sort"
	"strings"
	"time"

	"github.com/yuin/goldmark"
	"github.com/yuin/goldmark/ast"
	"github.com/yuin/goldmark/parser"
	"github.com/yuin/goldmark/text"
	"github.com/yuin/goldmark/util"
)

// Record is the release record: when digests started, and which digest email
// each release went into.
type Record struct {
	GoLive   string            `json:"goLive"`
	Releases []RecordedRelease `json:"releases"`
}

// RecordedRelease ties one release to the digest email it went into.
type RecordedRelease struct {
	ID            string  `json:"id"`
	DigestEmailID *string `json:"digestEmailId"`
}

// Email is a planned digest email.
type Email struct {
	Subject string
	HTML    string
}

// SelectPending returns the releases on or after the go-live date that the
// record does not tie to a digest email yet, newest first, then by component.
func SelectPending(record Record, releases []Release) []Release {
	sent := map[string]bool{}
	for _, r := range record.Releases {
		if r.DigestEmailID != nil && *r.DigestEmailID != "" {
			sent[r.ID] = true
		}
	}

	pending := []Release{}
	for _, r := range releases {
		if r.Date >= record.GoLive && !sent[r.ID] {
			pending = append(pending, r)
		}
	}
	sort.SliceStable(pending, func(i, j int) bool {
		if pending[i].Date != pending[j].Date {
			return pending[i].Date > pending[j].Date
		}
		return pending[i].Component < pending[j].Component
	})
	return pending
}

// RenderEmail renders the digest email for the given releases.
func RenderEmail(releases []Release) Email {
	components := []string{}
	seen := map[string]bool{}
	sections := []string{}

	for _, r := range releases {
		if !seen[r.Component] {
			seen[r.Component] = true
			components = append(components, r.Component)
		}
		sections = append(sections, strings.Join([]string{
			fmt.Sprintf("<h2>%s</h2>", html.EscapeString(r.Component+" "+r.Label)),
			fmt.Sprintf(`<p>Released %s. <a href="%s">Read the release notes</a>.</p>`,
				longDate(r.Date), html.EscapeString(r.PageURL)),
			renderMarkdown(r.Body),
		}, "\n"))
	}

	return Email{
		Subject: "SKE release updates: " + strings.Join(components, ", "),
		HTML:    strings.Join(sections, "\n"),
	}
}

// WriteOutputs writes the planned email in the GitHub Actions step-output
// format. Multi-line values use a random delimiter so the content cannot end
// the value early.
func WriteOutputs(w io.Writer, releases []Release, email Email) error {
	ids := []string{}
	for _, r := range releases {
		ids = append(ids, r.ID)
	}
	idsJSON, err := json.Marshal(ids)
	if err != nil {
		return err
	}

	if _, err := fmt.Fprintf(w, "has_releases=%t\nrelease_ids=%s\n", len(releases) > 0, idsJSON); err != nil {
		return err
	}
	if len(releases) == 0 {
		return nil
	}

	delimiter, err := randomDelimiter()
	if err != nil {
		return err
	}
	_, err = fmt.Fprintf(w, "subject=%s\nhtml<<%s\n%s\n%s\n", email.Subject, delimiter, email.HTML, delimiter)
	return err
}

func randomDelimiter() (string, error) {
	b := make([]byte, 16)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return "EOF_" + hex.EncodeToString(b), nil
}

func longDate(isoDate string) string {
	date, err := time.Parse("2006-01-02", isoDate)
	if err != nil {
		return isoDate
	}
	return date.Format("2 January 2006")
}

// absoluteLinks points root-relative links at the docs site, so they work
// from an email.
type absoluteLinks struct{}

func (absoluteLinks) Transform(doc *ast.Document, _ text.Reader, _ parser.Context) {
	_ = ast.Walk(doc, func(n ast.Node, entering bool) (ast.WalkStatus, error) {
		if !entering {
			return ast.WalkContinue, nil
		}
		switch node := n.(type) {
		case *ast.Link:
			node.Destination = absolute(node.Destination)
		case *ast.Image:
			node.Destination = absolute(node.Destination)
		}
		return ast.WalkContinue, nil
	})
}

func absolute(destination []byte) []byte {
	if bytes.HasPrefix(destination, []byte("/")) && !bytes.HasPrefix(destination, []byte("//")) {
		return append([]byte(SiteURL), destination...)
	}
	return destination
}

var markdown = goldmark.New(goldmark.WithParserOptions(
	parser.WithASTTransformers(util.Prioritized(absoluteLinks{}, 100)),
))

func renderMarkdown(source string) string {
	var out bytes.Buffer
	if err := markdown.Convert([]byte(source), &out); err != nil {
		return "<pre>" + html.EscapeString(source) + "</pre>"
	}
	return strings.TrimSpace(out.String())
}
