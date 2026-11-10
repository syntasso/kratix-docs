package digest

import (
	"bytes"
	"encoding/json"
	"fmt"
	"os"
)

// LoadRecord reads the release record file.
func LoadRecord(path string) (Record, error) {
	source, err := os.ReadFile(path)
	if err != nil {
		return Record{}, fmt.Errorf("reading release record: %w", err)
	}
	var record Record
	if err := json.Unmarshal(source, &record); err != nil {
		return Record{}, fmt.Errorf("parsing release record: %w", err)
	}
	return record, nil
}

// Assign ties each release to the digest email, adding releases the record
// has not seen and moving ones it has. It reports whether anything changed.
func (r *Record) Assign(ids []string, emailID string) bool {
	changed := false
	for _, id := range ids {
		found := false
		for i := range r.Releases {
			if r.Releases[i].ID != id {
				continue
			}
			found = true
			if current := r.Releases[i].DigestEmailID; current == nil || *current != emailID {
				r.Releases[i].DigestEmailID = &emailID
				changed = true
			}
			break
		}
		if !found {
			r.Releases = append(r.Releases, RecordedRelease{ID: id, DigestEmailID: &emailID})
			changed = true
		}
	}
	return changed
}

// MarshalRecord writes the record as indented JSON with a trailing newline,
// so the committed file only changes where the record does.
func MarshalRecord(r Record) []byte {
	if r.Releases == nil {
		r.Releases = []RecordedRelease{}
	}
	var out bytes.Buffer
	encoder := json.NewEncoder(&out)
	encoder.SetIndent("", "  ")
	encoder.SetEscapeHTML(false)
	_ = encoder.Encode(r)
	return out.Bytes()
}
