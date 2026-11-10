package digest_test

import (
	"os"
	"testing"

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
)

func TestDigest(t *testing.T) {
	RegisterFailHandler(Fail)
	RunSpecs(t, "Release digest suite")
}

func mustRead(path string) []byte {
	content, err := os.ReadFile(path)
	Expect(err).NotTo(HaveOccurred())
	return content
}
