package digest_test

import (
	"encoding/json"
	"os"

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
)

// The email layout is the HubSpot drag-and-drop content that CI puts the
// digest HTML into. These specs guard the parts the digest depends on.
var _ = Describe("email-layout.json", func() {
	type widget struct {
		Body   map[string]any `json:"body"`
		Styles map[string]any `json:"styles"`
	}
	type layout struct {
		TemplatePath string `json:"templatePath"`
		FlexAreas    struct {
			Main struct {
				Sections []struct {
					Columns []struct {
						Widgets []string `json:"widgets"`
					} `json:"columns"`
					Style map[string]any `json:"style"`
				} `json:"sections"`
			} `json:"main"`
		} `json:"flexAreas"`
		Widgets map[string]widget `json:"widgets"`
	}

	var l layout

	BeforeEach(func() {
		source, err := os.ReadFile("email-layout.json")
		Expect(err).NotTo(HaveOccurred())
		Expect(json.Unmarshal(source, &l)).To(Succeed())
	})

	sectionOrder := func() []string {
		order := []string{}
		for _, s := range l.FlexAreas.Main.Sections {
			for _, c := range s.Columns {
				order = append(order, c.Widgets...)
			}
		}
		return order
	}

	It("uses HubSpot's plain drag-and-drop layout", func() {
		Expect(l.TemplatePath).To(Equal("@hubspot/email/dnd/plain_text.html"))
	})

	It("has the logo, then the body, then the footer, and nothing else", func() {
		Expect(sectionOrder()).To(Equal([]string{"module_17197002285121", "module-0-0-0", "module-1-0-0"}))
		Expect(l.Widgets).To(HaveLen(3))
	})

	It("has an empty rich-text body for CI to fill", func() {
		body := l.Widgets["module-0-0-0"].Body
		Expect(body["path"]).To(Equal("@hubspot/rich_text"))
		Expect(body["html"]).To(Equal(""))
	})

	It("has the footer with its unsubscribe link", func() {
		body := l.Widgets["module-1-0-0"].Body
		Expect(body["path"]).To(Equal("@hubspot/email_footer"))
		Expect(body["unsubscribe_link_type"]).NotTo(BeEmpty())
	})

	It("has the Syntasso logo", func() {
		img, ok := l.Widgets["module_17197002285121"].Body["img"].(map[string]any)
		Expect(ok).To(BeTrue())
		Expect(img["src"]).To(ContainSubstring("Syntasso"))
		Expect(img["alt"]).To(Equal("Syntasso"))
	})

	It("hides no block or section at any screen size", func() {
		hidden := func(styles map[string]any) []string {
			found := []string{}
			breakpoints, _ := styles["breakpointStyles"].(map[string]any)
			for name, settings := range breakpoints {
				if s, ok := settings.(map[string]any); ok && s["hidden"] == true {
					found = append(found, name)
				}
			}
			return found
		}
		for key, w := range l.Widgets {
			Expect(hidden(w.Styles)).To(BeEmpty(), "block %s is hidden", key)
		}
		for i, s := range l.FlexAreas.Main.Sections {
			Expect(hidden(s.Style)).To(BeEmpty(), "section %d is hidden", i)
		}
	})
})
