package digest_test

import (
	"testing"

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
)

func TestDigest(t *testing.T) {
	RegisterFailHandler(Fail)
	RunSpecs(t, "Release digest suite")
}
