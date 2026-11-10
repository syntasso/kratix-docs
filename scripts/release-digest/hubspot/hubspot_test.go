package hubspot_test

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"sync"

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"

	"github.com/syntasso/kratix-docs/scripts/release-digest/hubspot"
)

const layoutJSON = `{
  "source": {"emailId": "1"},
  "templatePath": "@hubspot/email/dnd/plain_text.html",
  "styleSettings": {"primaryFont": "Arial, sans-serif"},
  "flexAreas": {"main": {"sections": [
    {"columns": [{"widgets": ["logo"]}]},
    {"columns": [{"widgets": ["module-0-0-0"]}]},
    {"columns": [{"widgets": ["module-1-0-0"]}]}
  ]}},
  "widgets": {
    "logo": {"type": "module", "body": {"img": {"src": "https://example.com/logo.png"}}},
    "module-0-0-0": {"type": "module", "body": {"path": "@hubspot/rich_text", "html": ""}},
    "module-1-0-0": {"type": "module", "body": {"path": "@hubspot/email_footer"}}
  }
}`

type request struct {
	Method, Path, Authorization string
	Body                        map[string]any
}

// fakeHubSpot records each request and answers from the responses map,
// keyed by "METHOD path".
type fakeHubSpot struct {
	mu        sync.Mutex
	requests  []request
	responses map[string]func() (int, string)
}

func (f *fakeHubSpot) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	raw, _ := io.ReadAll(r.Body)
	var body map[string]any
	_ = json.Unmarshal(raw, &body)

	f.mu.Lock()
	f.requests = append(f.requests, request{r.Method, r.URL.Path, r.Header.Get("Authorization"), body})
	respond, ok := f.responses[r.Method+" "+r.URL.Path]
	f.mu.Unlock()

	if !ok {
		w.WriteHeader(http.StatusNotFound)
		return
	}
	status, response := respond()
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_, _ = io.WriteString(w, response)
}

var _ = Describe("Client.CreateDraft", func() {
	var (
		fake   *fakeHubSpot
		server *httptest.Server
		client hubspot.Client
		layout hubspot.Layout
	)

	BeforeEach(func() {
		fake = &fakeHubSpot{responses: map[string]func() (int, string){
			"POST /marketing/v3/emails":                     func() (int, string) { return 201, `{"id": "511778652367", "state": "DRAFT"}` },
			"PATCH /marketing/v3/emails/511778652367/draft": func() (int, string) { return 200, `{}` },
			"DELETE /marketing/v3/emails/511778652367":      func() (int, string) { return 204, `` },
		}}
		server = httptest.NewServer(fake)
		DeferCleanup(server.Close)
		client = hubspot.Client{BaseURL: server.URL, Token: "test-token", HTTP: server.Client()}

		path := filepath.Join(GinkgoT().TempDir(), "email-layout.json")
		Expect(os.WriteFile(path, []byte(layoutJSON), 0o644)).To(Succeed())
		var err error
		layout, err = hubspot.LoadLayout(path)
		Expect(err).NotTo(HaveOccurred())
	})

	draft := func() hubspot.Draft {
		return hubspot.Draft{
			Name:    "SKE release digest 2026-11-10",
			Subject: "SKE release updates: Portal Patch",
			Layout:  layout,
			HTML:    "<h2>Portal Patch v0.8.6</h2>",
		}
	}

	It("creates the email from the layout's template and returns its ID", func() {
		id, err := client.CreateDraft(context.Background(), draft())

		Expect(err).NotTo(HaveOccurred())
		Expect(id).To(Equal("511778652367"))
		Expect(fake.requests[0].Method).To(Equal("POST"))
		Expect(fake.requests[0].Path).To(Equal("/marketing/v3/emails"))
		Expect(fake.requests[0].Body).To(Equal(map[string]any{
			"name":         "SKE release digest 2026-11-10",
			"subject":      "SKE release updates: Portal Patch",
			"templatePath": "@hubspot/email/dnd/plain_text.html",
		}))
	})

	It("then sets the draft to the layout with the digest HTML in the rich-text block", func() {
		_, err := client.CreateDraft(context.Background(), draft())

		Expect(err).NotTo(HaveOccurred())
		Expect(fake.requests).To(HaveLen(2))
		patch := fake.requests[1]
		Expect(patch.Method).To(Equal("PATCH"))
		Expect(patch.Path).To(Equal("/marketing/v3/emails/511778652367/draft"))

		content := patch.Body["content"].(map[string]any)
		Expect(content).To(HaveKey("flexAreas"))
		Expect(content["styleSettings"]).To(Equal(map[string]any{"primaryFont": "Arial, sans-serif"}))
		widgets := content["widgets"].(map[string]any)
		Expect(widgets).To(HaveKey("logo"))
		Expect(widgets).To(HaveKey("module-1-0-0"))
		body := widgets["module-0-0-0"].(map[string]any)["body"].(map[string]any)
		Expect(body["html"]).To(Equal("<h2>Portal Patch v0.8.6</h2>"))
	})

	It("does not change the layout it was given", func() {
		_, err := client.CreateDraft(context.Background(), draft())
		Expect(err).NotTo(HaveOccurred())

		second := draft()
		second.HTML = "<h2>Second</h2>"
		_, err = client.CreateDraft(context.Background(), second)
		Expect(err).NotTo(HaveOccurred())

		_, err = client.CreateDraft(context.Background(), hubspot.Draft{Name: "n", Subject: "s", Layout: layout, HTML: ""})
		Expect(err).NotTo(HaveOccurred())
		last := fake.requests[len(fake.requests)-1].Body["content"].(map[string]any)
		html := last["widgets"].(map[string]any)["module-0-0-0"].(map[string]any)["body"].(map[string]any)["html"]
		Expect(html).To(Equal(""))
	})

	It("sends the token as a bearer token", func() {
		_, err := client.CreateDraft(context.Background(), draft())

		Expect(err).NotTo(HaveOccurred())
		for _, r := range fake.requests {
			Expect(r.Authorization).To(Equal("Bearer test-token"))
		}
	})

	It("returns HubSpot's error when the email cannot be created", func() {
		fake.responses["POST /marketing/v3/emails"] = func() (int, string) {
			return 403, `{"category": "MISSING_SCOPES", "message": "This app hasn't been granted all required scopes"}`
		}

		_, err := client.CreateDraft(context.Background(), draft())

		Expect(err).To(MatchError(And(
			ContainSubstring("creating the email"),
			ContainSubstring("403"),
			ContainSubstring("MISSING_SCOPES"),
		)))
		Expect(fake.requests).To(HaveLen(1))
	})

	It("deletes the new email when its body cannot be set, so no half-built draft is left", func() {
		fake.responses["PATCH /marketing/v3/emails/511778652367/draft"] = func() (int, string) {
			return 400, `{"category": "VALIDATION_ERROR", "message": "bad widget"}`
		}

		_, err := client.CreateDraft(context.Background(), draft())

		Expect(err).To(MatchError(And(ContainSubstring("setting the body"), ContainSubstring("VALIDATION_ERROR"))))
		Expect(fake.requests).To(HaveLen(3))
		Expect(fake.requests[2].Method).To(Equal("DELETE"))
		Expect(fake.requests[2].Path).To(Equal("/marketing/v3/emails/511778652367"))
	})

	It("says so when the half-built draft cannot be deleted either", func() {
		fake.responses["PATCH /marketing/v3/emails/511778652367/draft"] = func() (int, string) { return 400, `{}` }
		fake.responses["DELETE /marketing/v3/emails/511778652367"] = func() (int, string) { return 500, `{}` }

		_, err := client.CreateDraft(context.Background(), draft())

		Expect(err).To(MatchError(ContainSubstring("delete email 511778652367 by hand")))
	})
})

var _ = Describe("LoadLayout", func() {
	It("rejects a layout without a rich-text block for the body", func() {
		path := filepath.Join(GinkgoT().TempDir(), "email-layout.json")
		Expect(os.WriteFile(path, []byte(`{"templatePath": "x", "flexAreas": {}, "widgets": {"module-1-0-0": {}}}`), 0o644)).To(Succeed())

		_, err := hubspot.LoadLayout(path)

		Expect(err).To(MatchError(ContainSubstring("module-0-0-0")))
	})

	It("loads the layout committed in the repo", func() {
		_, err := hubspot.LoadLayout("../email-layout.json")

		Expect(err).NotTo(HaveOccurred())
	})
})
