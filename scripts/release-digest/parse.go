package digest

import (
	"fmt"
	"io/fs"
	"path/filepath"
	"regexp"
	"sort"
	"strings"
)

// SiteURL is where the docs site is published.
const SiteURL = "https://docs.kratix.io"

// Release is one release found on a release-notes page.
type Release struct {
	ID        string
	Component string
	Label     string
	Date      string
	PageURL   string
	Body      string
}

// The release-notes pages do not share one heading format, so a release is any
// heading under "## Release Notes" that ends in a date in brackets, for example:
//
//	### [v0.8.6](https://...) (2026-11-09)
//	## [0.2.8](https://...) (2026-11-05)
//	### v0.1.7 (27-10-2026)
//	### [v0.17.0](https://...)(2025-07-11) {#v0.17.0}
//
// A heading without a date that sits above release headings (ske-lift's tool
// names) prefixes the label of the releases under it. A heading without a date
// whose section opens with a "Latest version" line (the Portal Controller's
// minor-version sections) is one release, named after that latest version.
var (
	headingPattern       = regexp.MustCompile(`^(#{1,6})\s+(.*?)\s*$`)
	releaseTitlePattern  = regexp.MustCompile(`^(.*?)\s*\((\d{4}-\d{2}-\d{2}|\d{2}-\d{2}-\d{4})\)\s*(?:\{#[^}]*\})?$`)
	latestVersionPattern = regexp.MustCompile(`^Latest version:\s*\[([^\]]+)\]\([^)]*\)\s*\((\d{4}-\d{2}-\d{2}|\d{2}-\d{2}-\d{4})\)`)
	linkPattern          = regexp.MustCompile(`\[([^\]]*)\]\([^)]*\)`)
	fencePattern         = regexp.MustCompile("^\\s*(```|~~~)")
	dayFirstPattern      = regexp.MustCompile(`^(\d{2})-(\d{2})-(\d{4})$`)
	versionPattern       = regexp.MustCompile(`\bv?(\d+\.\d+\.\d+(?:-[0-9A-Za-z.]+)?)`)
	nonWordPattern       = regexp.MustCompile(`[^a-z0-9]+`)
	frontMatterPattern   = regexp.MustCompile(`(?s)^---\n(.*?)\n---`)
	fieldPattern         = regexp.MustCompile(`^(\w+):\s*(.*)$`)
)

type line struct {
	text    string
	level   int
	heading string
}

// ParseReleasePage returns the releases listed on one release-notes page, in
// page order.
func ParseReleasePage(source string) []Release {
	fields := frontMatter(source)
	slug := fields["slug"]
	slugParts := strings.Split(strings.Trim(slug, "/"), "/")
	componentKey := slugParts[len(slugParts)-1]
	component := fields["sidebar_label"]
	if component == "" {
		component = fields["title"]
	}

	lines := splitLines(source)
	start := -1
	for i, l := range lines {
		if l.level == 2 && strings.EqualFold(l.heading, "Release Notes") {
			start = i
			break
		}
	}
	if start == -1 {
		return nil
	}

	releases := []Release{}
	groups := map[int]string{}

	for i := start + 1; i < len(lines); i++ {
		level := lines[i].level
		if level == 0 {
			continue
		}

		end := i + 1
		for end < len(lines) && !(lines[end].level > 0 && lines[end].level <= level) {
			end++
		}
		section := []string{}
		for _, l := range lines[i+1 : end] {
			section = append(section, l.text)
		}

		title := releaseTitlePattern.FindStringSubmatch(lines[i].heading)
		if title == nil {
			if first := firstNonBlank(section); first != -1 {
				if latest := latestVersionPattern.FindStringSubmatch(section[first]); latest != nil {
					title = latest
					section = section[first+1:]
				}
			}
		}

		for deeper := level; deeper <= 6; deeper++ {
			delete(groups, deeper)
		}
		if title == nil {
			groups[level] = linkPattern.ReplaceAllString(lines[i].heading, "$1")
			continue
		}

		groupNames := []string{}
		for _, groupLevel := range sortedLevelsBelow(groups, level) {
			groupNames = append(groupNames, groups[groupLevel])
		}
		heading := strings.TrimSpace(linkPattern.ReplaceAllString(title[1], "$1"))
		label := strings.Join(append(append([]string{}, groupNames...), heading), " ")

		releases = append(releases, Release{
			ID:        releaseID(componentKey, groupNames, heading),
			Component: component,
			Label:     label,
			Date:      isoDate(title[2]),
			PageURL:   SiteURL + slug,
			Body:      strings.TrimSpace(strings.Join(section, "\n")),
		})
	}

	return releases
}

func frontMatter(source string) map[string]string {
	fields := map[string]string{}
	match := frontMatterPattern.FindStringSubmatch(source)
	if match == nil {
		return fields
	}
	for _, l := range strings.Split(match[1], "\n") {
		if field := fieldPattern.FindStringSubmatch(l); field != nil {
			fields[field[1]] = strings.Trim(strings.TrimSpace(field[2]), `"'`)
		}
	}
	return fields
}

func splitLines(source string) []line {
	lines := []line{}
	inFence := false
	for _, text := range strings.Split(source, "\n") {
		if fencePattern.MatchString(text) {
			inFence = !inFence
		}
		l := line{text: text}
		if !inFence {
			if heading := headingPattern.FindStringSubmatch(text); heading != nil {
				l.level = len(heading[1])
				l.heading = heading[2]
			}
		}
		lines = append(lines, l)
	}
	return lines
}

func firstNonBlank(lines []string) int {
	for i, l := range lines {
		if strings.TrimSpace(l) != "" {
			return i
		}
	}
	return -1
}

func sortedLevelsBelow(groups map[int]string, level int) []int {
	levels := []int{}
	for groupLevel := range groups {
		if groupLevel < level {
			levels = append(levels, groupLevel)
		}
	}
	sort.Ints(levels)
	return levels
}

func isoDate(date string) string {
	if match := dayFirstPattern.FindStringSubmatch(date); match != nil {
		return fmt.Sprintf("%s-%s-%s", match[3], match[2], match[1])
	}
	return date
}

// LoadReleases parses every Markdown or MDX page in fsys.
func LoadReleases(fsys fs.FS) ([]Release, error) {
	releases := []Release{}
	err := fs.WalkDir(fsys, ".", func(path string, entry fs.DirEntry, err error) error {
		if err != nil || entry.IsDir() {
			return err
		}
		if ext := filepath.Ext(path); ext != ".md" && ext != ".mdx" {
			return nil
		}
		source, err := fs.ReadFile(fsys, path)
		if err != nil {
			return err
		}
		releases = append(releases, ParseReleasePage(string(source))...)
		return nil
	})
	return releases, err
}

// releaseID identifies a release by its component and version, so rewording a
// heading does not make an emailed release look new. A package name before a
// version is kept (normalised), because one page can list several packages
// that share a version number: the SKE Operator and its Helm Chart, or the
// Backstage frontend and backend. A name that only repeats the page's
// component is dropped. A heading with no version number falls back to its
// wording.
func releaseID(componentKey string, groupNames []string, heading string) string {
	parts := []string{}
	for _, segment := range strings.Split(heading, ";") {
		match := versionPattern.FindStringSubmatchIndex(segment)
		if match == nil {
			continue
		}
		version := segment[match[2]:match[3]]
		name := strings.Trim(nonWordPattern.ReplaceAllString(strings.ToLower(segment[:match[0]]), "-"), "-")
		if name == "" || name == componentKey {
			parts = append(parts, version)
		} else {
			parts = append(parts, name+"-"+version)
		}
	}

	if len(parts) == 0 {
		return fmt.Sprintf("%s@%s", componentKey, heading)
	}
	id := strings.Join(parts, "+")
	if len(groupNames) > 0 {
		id = strings.Join(groupNames, "-") + "-" + id
	}
	return fmt.Sprintf("%s@%s", componentKey, id)
}
