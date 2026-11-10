package hubspot_test

import (
	"testing"

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
)

func TestHubSpot(t *testing.T) {
	RegisterFailHandler(Fail)
	RunSpecs(t, "HubSpot client suite")
}
