---
title: Enterprise documentation design
unlisted: true
---

# Enterprise documentation design

Approved in the documentation review on 9 October 2026. This is a working design record, not customer-facing guidance. `unlisted` keeps it out of the normal documentation navigation and discovery; it does not make this file private.

## Reader outcomes

An SKE customer can install and operate their platform, build and evolve Promises, and integrate their chosen developer interface without assembling a procedure from disconnected reference pages.

The Backstage integration has three verified milestones:

1. Generate entities: install or reuse the controller, configure a Destination, bind a Promise and verify generated files.
2. Configure Backstage: install the two SKE packages, configure catalogue discovery and verify Components and Templates.
3. Send requests: configure backend access and permissions, configure GitOps where required, submit a request and verify reconciliation and status. Explain update, delete and approval behaviour.

Cortex has two verified milestones: generate entities/workflows through the Cortex API, then submit requests through the Git integration and verify their return to the platform. It must not depend on deprecated controller installation documentation.

Customisation guides distinguish Promise API behaviour, changes to generated documents through `PortalCustomization`, and Backstage UI changes through the plugin APIs. Worked examples include the binding and verification steps on the same page.

## Approved sidebar

Groups end in `/`; other entries are pages. Linked optional walkthroughs are listed separately below the tree.

```text
Enterprise/
├── Overview
├── Install SKE/
│   ├── Requirements and access tokens
│   ├── Install SKE with the Operator
│   ├── Air-gapped installation
│   └── Migrate from open-source Kratix
├── Build and evolve Promises/
│   ├── Build and test a database Promise
│   ├── Test Promise pipelines
│   ├── Create a Promise from a Terraform module
│   ├── Schedule resources to Terraform workspaces
│   ├── Roll out Promise upgrades
│   └── SKE Lift (Preview)
├── Operate your platform/
│   ├── Platform architecture
│   ├── Prepare SKE for production
│   ├── Upgrade SKE
│   ├── Backup and restore
│   ├── Health checks/
│   │   ├── Install and configure the Health Agent
│   │   ├── Add health checks to a Promise
│   │   ├── Check non-Kubernetes resources
│   │   └── Migrate health records to a bucket
│   ├── SKE GUI/
│   │   ├── Install the GUI
│   │   └── Use the GUI
│   └── Troubleshoot SKE
├── Portal integrations/
│   ├── Overview
│   ├── Backstage/
│   │   ├── Overview
│   │   ├── Generate Backstage entities
│   │   ├── Configure Backstage
│   │   ├── Send resource requests to Kratix
│   │   ├── Customise entities and request templates
│   │   ├── Frontend plugin API
│   │   ├── Backend plugin API
│   │   └── Migrate from the Backstage Controller
│   ├── Cortex/
│   │   ├── Overview
│   │   ├── Generate Cortex entities and workflows
│   │   ├── Send resource requests to Kratix
│   │   ├── Customise entities and workflows
│   │   └── Migrate from the Cortex Controller
│   ├── Port (Preview)
│   ├── Portal Controller/
│   │   ├── How it works
│   │   ├── Install and upgrade
│   │   ├── Configure sync and setup Jobs
│   │   ├── Troubleshoot portal sync
│   │   └── Reference/
│   │       ├── Portal configuration and bindings
│   │       ├── PortalCustomization
│   │       ├── Portal Patch recipes
│   │       └── Adapter reference
│   └── Deprecated controllers/
│       ├── Backstage Controller/
│       │   ├── Overview
│       │   ├── Install the Backstage integration
│       │   ├── Create the entity state store
│       │   ├── Configure catalogue ingestion
│       │   ├── Generate Backstage Components
│       │   └── Air-gapped installation
│       ├── Backstage generator/
│       │   ├── Overview
│       │   ├── SKE Backstage Generator
│       │   └── SKE Component Promise
│       └── Cortex Controller/
│           ├── Overview
│           ├── Configure Cortex
│           └── Use the Cortex integration
├── Tool integrations/
│   ├── Terraform Enterprise and HCP Terraform
│   └── MCP Server (Preview)
├── Reference/
│   ├── API and CLI index
│   ├── SKE Operator API
│   ├── HealthDefinition
│   ├── HealthSource
│   ├── UpgradePlan
│   ├── UpgradeRun
│   └── Promise Testing CLI/
│       ├── kratix test
│       ├── kratix test pipeline
│       └── kratix test stage
└── Releases and support/
    ├── Release index
    ├── Supported versions and compatibility
    ├── SKE
    ├── Platform components/
    │   ├── SKE Operator
    │   ├── SKE Health Agent
    │   ├── SKE GUI
    │   └── Promise Testing Framework
    ├── Integrations/
    │   ├── Portal Controller
    │   ├── Portal Patch
    │   ├── Backstage plugins
    │   ├── Port Controller
    │   └── MCP Server
    ├── Pipeline stages/
    │   └── Terraform State Finder
    ├── Deprecated components/
    │   ├── Backstage Controller
    │   ├── Backstage Generator
    │   └── Cortex Controller
    └── Support policy
```

## Page consolidation and preservation

- Delivery modes and namespace policy become sections of the Backstage request guide, not extra mandatory stages.
- OIDC is conditional authentication guidance in the request guide. Its security requirements are not optional when that authentication method is chosen.
- Hosted and air-gapped plugin installation are conditional sections of Configure Backstage.
- Entity YAML format becomes adapter output reference, linked from the plugin APIs.
- Development-image and adapter-as-pipeline walkthroughs remain linked optional guides, outside the main sidebar.
- Reference index links to the same canonical portal and plugin pages; do not create duplicate reference copies.
- Preserve existing published URLs wherever possible. Add redirects and anchor-compatible links when consolidation changes a destination.
- Keep deprecated controller documentation and release history. Correct factual errors, but do not silently rewrite historical behaviour for newer releases.

## Constraints

- British English; retain exact API identifiers, including `PortalCustomization` and YAML field names.
- No real tokens, customer identifiers or new internal-only URLs.
- Port remains a portal integration using the separate Port Controller. Retain its Preview status.
- Backstage and Cortex standalone controllers are deprecated, with no invented removal timeline.
- Document only released, evidenced capabilities. Do not introduce bring-your-own portal types or unsupported deployment topologies.
- Distinguish catalogue output storage, request input storage, backend access (`ske.mode`), approval (`config.mode`) and namespace policy (`requestNamespace`).
- Label every page as concept, guide, reference, tutorial or troubleshooting in the implementation inventory, not necessarily in visible titles.
- Every guide has concrete prerequisites, complete steps, verification, relevant troubleshooting and a clear next step.
- Run `yarn build` after each independently reviewable slice. Compilation and link validation do not prove runtime integration correctness.

## Validation

Walk through a new Backstage installation, existing-controller reuse, Git and bucket publication, Kubernetes/GitOps/hybrid request access, approval, customisation and migration. Walk through Cortex publication and GitOps request reconciliation without deprecated setup pages. Check namespace policy and trusted Group warnings before the action they constrain. Validate the final sidebar and old URLs in the built site.
