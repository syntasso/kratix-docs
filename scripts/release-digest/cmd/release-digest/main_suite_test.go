package main_test

import (
	"testing"

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
	"github.com/onsi/gomega/gexec"
)

// binary is the release-digest command, built once for the whole suite.
var binary string

var _ = BeforeSuite(func() {
	var err error
	binary, err = gexec.Build("github.com/syntasso/kratix-docs/scripts/release-digest/cmd/release-digest")
	Expect(err).NotTo(HaveOccurred())
	DeferCleanup(gexec.CleanupBuildArtifacts)
})

func TestReleaseDigestCommand(t *testing.T) {
	RegisterFailHandler(Fail)
	RunSpecs(t, "release-digest command suite")
}
