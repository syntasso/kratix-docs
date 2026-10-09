---
title: Enterprise documentation implementation plan
unlisted: true
---

# Enterprise Documentation Accuracy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans for the current inline implementation. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish accurate, release-grounded Portal Controller documentation before implementing the approved Enterprise information architecture.

**Architecture:** Keep each milestone independently buildable. Preserve current document IDs and published routes during the accuracy pass. Later use explicit Enterprise sidebar groups to express customer journeys without unnecessarily moving every source file or breaking URLs.

**Tech Stack:** Docusaurus 3.10.2, Markdown/MDX, React, Yarn 4.12.0. Local verification uses `rtk proxy mise exec node@22.23.2 -- yarn build`; CI remains on its configured Node version.

**Spec:** `docs/superpowers/specs/2026-10-09-enterprise-documentation.md` records the approved tree and reader outcomes.

## Global Constraints

- Follow AGENTS.md and CONTEXT.md, except that the approved design explicitly places Port in the same customer-facing portal integration family.
- No changes to controller implementations, deployed clusters, registry packages or GitHub issues in this documentation task.
- Do not publish, push or merge without a separate request.
- The user selected this checkout on a new branch: `codex/enterprise-docs-journeys`.
- Pin current primary controller examples to `v0.6.1`; retain older versions in migration and release-history examples where they describe those releases.
- Portal Controller `v0.4.0` introduced ConfigMap configuration and needs SKE Operator `v0.34.0` or later when operator-managed.
- SKE `v0.59.0` changed status workflow fields and needs Portal Controller `v0.4.2` or later; Portal Controller `v0.4.2` release notes require SKE `v0.59.0`.
- Current Backstage feature guidance uses backend `v0.24.0` and frontend `v0.22.0`. Upgrade plugins before generating newer Templates.
- Portal Patch is optional and independently versioned. Do not invent a blanket helper-version requirement for unrelated portal functionality.
- For prose, verify claims against released source and primary documentation. Do not add brittle tests that grep wording; the TDD skill's writing-good-tests reference explicitly excludes human prose from such tests.
- Run the full site build per milestone; add behaviour tests before changing executable navigation or validation tooling later.

## Review Focus

1. Existing installations: version requirements and upgrade order must not invite a controller/plugin mismatch.
2. Multiple portals: editing one portal must not imply that all setup Jobs are recreated; global workload changes are a separate case.
3. Operatorless installations: binding diagnostics refer to the configuration the released controller actually reads, not an obsolete mandatory SKEIntegration.
4. Storage and credentials: Git and bucket catalogue publication are distinct from the repository accepting developer requests.
5. Current versus deprecated paths: new Cortex users must not be routed through old controller installation; historical notes retain their version-specific meaning.

## Programme roadmap

Only Tasks 1 and 2 below are the first executable milestone. Later milestones receive their own file-level execution briefs against the same approved spec, so a broad editorial project is not mistaken for one small patch.

### Milestone 1: Correctness before navigation

- [x] Verify current examples, requirements, setup scope, binding conditions and ownership against released source and release records.
- [x] Fix supported-version references and upgrade warnings without rewriting unrelated release history.
- [x] Remove the current Cortex prerequisite's dependence on deprecated controller setup.
- [x] Correct Git-only architecture wording and restore the distinction between destination resources and backing storage.
- [ ] Build and review this first patch. Record remaining runtime questions rather than guessing.

### Milestone 2: Establish canonical controller pages

- [ ] Turn `09-portal-controller/00-intro.mdx` into How it works: bindings, generation/configuration/writing, ownership and deletion.
- [ ] Keep `01-installation.mdx` as Install and upgrade: full operator and operatorless procedures, version choices, upgrade ordering and verification.
- [ ] Create `09-portal-controller/reference/portal-configuration.mdx` for connection fields, ConfigMap shape, labels, conditions, generate flags and exporter overrides.
- [ ] Rework `04-customization/00-intro.mdx` as PortalCustomization reference; move task examples into the portal-specific guides.
- [ ] Combine Portal Patch introduction and grammar into one canonical recipe reference, preserving old entry routes and anchors.
- [ ] Consolidate adapter flags and `02-backstage/12-entity-yaml-format.mdx` into adapter reference; retain `11-adapter-pipeline-stage.mdx` as a linked optional guide.
- [ ] Add `09-portal-controller/troubleshooting.mdx`, organised by symptoms and diagnostic commands. Use known conditions and events, not invented recovery actions.
- [ ] Keep Job configuration scoped to sync/setup Jobs, not the Cortex exporter Deployment.
- [ ] Check every reference has defaults, supported values, behaviour, edge cases and complete minimal examples; build.

### Milestone 3: Complete Backstage publication and discovery

- [ ] Create a Backstage journey Overview that gives the whole two-direction flow and links the three ordered milestones.
- [ ] Rework the existing configuration material into `02-backstage/generate-entities.mdx`: install/reuse, own store plus Destination, reuse store, adopt Destination, label a Promise and inspect output.
- [ ] Use a consistent example Promise and clearly distinguish catalogue storage from request storage.
- [ ] Refocus `01-configure-backstage.mdx` on the two plugin packages and catalogue discovery, with explicit old/new frontend-system variants.
- [ ] Provide working GitHub and supported bucket discovery routes, using primary Backstage provider documentation.
- [ ] Fold hosted/air-gapped installation into conditional sections, retaining old URLs through redirects where needed.
- [ ] Add observable checkpoints: generated files, Promise Component, matching Template and Resource Component.
- [ ] Build and walk the rendered pages as a reader following only the ordered route.

### Milestone 4: Complete Backstage requests and customisation

- [ ] Create `02-backstage/send-resource-requests.mdx` from backend configuration, delivery and namespace material.
- [ ] Separate transport (`ske.mode`), approval (`config.mode`) and namespace policy. Show credentials, network access and permission requirements for each choice.
- [ ] Cover Kubernetes, GitOps and hybrid modes; use existing Flux/Argo examples and verify that configured repositories, branches and paths match.
- [ ] Include create/update/delete, pending catalogue entries, approval waiting and final reconciliation checks.
- [ ] Fold OIDC guidance into the relevant authentication route; retain warnings about trusted Groups and do not present Group checks as a substitute for Kubernetes RBAC.
- [ ] Extend `08-customising-the-request-template.mdx` into the complete customisation guide: API first, generated document patches second, UI extension through the frontend API third.
- [ ] Every worked PortalCustomization includes its binding label, apply step and expected result. Keep mode-specific recipe caveats at the affected example.
- [ ] Preserve frontend/backend API pages and link the optional development image from Overview.
- [ ] Build and review requests, approvals and customisation separately from publication.

### Milestone 5: Complete Cortex and Port navigation

- [ ] Create Cortex journey Overview and `03-cortex/generate-entities.mdx`: credentials, workspace preparation, portal settings, bindings, generated entity/workflow checks and exporter behaviour.
- [ ] Create `03-cortex/send-resource-requests.mdx`: Git integration alias, repository permissions, platform GitOps, creation, pending status, update and deletion.
- [ ] Rework `01-examples.mdx` as a complete customisation guide with binding and verification.
- [ ] Retain migration pages; ensure none of the new-user route requires deprecated controller installation.
- [ ] Keep the current Port page and Preview warning, explaining its separate controller without suggesting it supports Portal Controller fields.
- [ ] Build and check the two complete portal journeys plus the existing Port route.

### Milestone 6: Reorganise existing Enterprise content

- [ ] Rework `docs/ske/00-intro.mdx` as a technical entry point with task routes, product boundaries and support/preview status.
- [ ] Combine installation prerequisites and `03-reference/06-tokens.mdx` into Requirements and access tokens; preserve token anchors.
- [ ] Move existing Promise-development, testing, Terraform and rollout content into Build and evolve Promises in navigation, not necessarily on disk.
- [ ] Move platform architecture, SKE upgrades, health and GUI content into Operate your platform. Distinguish SKE upgrades from Promise/resource rollouts.
- [ ] Keep Terraform Enterprise/HCP Terraform and MCP under Tool integrations; place SKE Lift with Promise building.
- [ ] Make the Reference index an index of canonical pages, including links to local portal/plugin references, without duplicate copies.
- [ ] Retain the complete deprecated-controller and component-release collections; build.

### Milestone 7: Fill targeted operational gaps

- [ ] Create `docs/ske/operations/production-readiness.mdx` from evidenced supported topology, registry/TLS/identity choices, observability, health and recovery requirements.
- [ ] Expand `21-backup-and-restore.mdx` with an SKE-specific inventory, dependency ordering, controller ownership considerations and restored-platform verification.
- [ ] Create `docs/ske/operations/troubleshooting.mdx` with symptoms, evidence collection, safe checks and support escalation.
- [ ] Create `docs/ske/50-releases/compatibility.mdx`: independently versioned components, release-backed requirements and upgrade order. Do not claim combinations were integration-tested unless there is test evidence.
- [ ] For destructive recovery actions or unsupported topology questions, obtain the necessary product evidence/approval before documenting instructions.
- [ ] Build; review recovery and security wording against source and supported product behaviour.

### Milestone 8: Activate the approved sidebar and preserve discovery

- [ ] Write a failing behaviour test for the explicit Enterprise sidebar's category order, required leaves, unique canonical document ownership and exclusion of optional walkthroughs.
- [ ] Replace only `skeSidebar` in `sidebars.js`; keep Main and Workshop navigation unchanged.
- [ ] Match the approved tree exactly, using existing stable IDs where possible.
- [ ] Update front matter labels, descriptions, related links and next/previous expectations to match page purpose.
- [ ] Add redirects in `docusaurus.config.js` only where routes changed or pages consolidated. Check historically linked anchors explicitly.
- [ ] Build and inspect desktop/mobile rendered navigation; follow old bookmarked entry routes and external migration/release links.

### Milestone 9: Verify and maintain

- [ ] Run the complete site build and navigation/route tests; review every changed YAML and command example for placeholders and consistency.
- [ ] Read the three-stage Backstage and two-stage Cortex paths in isolation: no required missing hand-offs, stale controller setup or secret/permission ambiguity.
- [ ] Review the whole branch against the approved spec, including the five Review Focus cases.
- [ ] Record which examples were structurally checked, source-reviewed or actually run; do not present a build as a runtime smoke test.
- [ ] Add release-review guidance for compatibility tables, durable behaviour, examples and deprecation links. Add automation only where it tests real contracts, not prose phrasing.
- [ ] Hand over reviewable commits and remaining evidence gaps. No publishing or GitHub mutations without a request.

---

## Initial milestone file map

Paths below are relative to `docs/ske`. Source repositories are read-only evidence, not edit targets.

| File | Responsibility in this milestone |
| --- | --- |
| `10-integrations/09-portal-controller/01-installation.mdx` | Current compatible requirements, primary controller example, upgrade order and current binding diagnostics |
| `10-integrations/09-portal-controller/02-backstage/00-intro.mdx` | Current primary Backstage SKEIntegration version |
| `10-integrations/09-portal-controller/02-backstage/01-configure-backstage.mdx` | Current plugin requirements, released Backstage compatibility and clearly conditional frontend instructions |
| `10-integrations/09-portal-controller/03-cortex/00-intro.mdx` | Current primary Cortex example, active workspace prerequisites, setup scope, ownership and pending-request behaviour |
| `10-integrations/09-portal-controller/00-intro.mdx` | Git/bucket publication, separate Port implementation and request-transport distinction |
| `03-reference/01-parts-of-a-platform.mdx` | Consistent Git/bucket architecture description |
| `50-releases/20-platform/10-ske-operator.mdx` | Correct erroneous Portal Controller `v0.8.0` reference to the ConfigMap transition release |
| `50-releases/30-integrations/20-backstage.mdx` | Correct erroneous Portal Controller `v0.11.0` reference to push pending-request generation |

### Task 1: Correct version requirements and primary examples

**Files:** Modify the installation page, Backstage portal overview, Configure Backstage, Cortex overview and the two release pages listed above.

**Interfaces:** Consumes released component tags and the existing release records. Produces a coherent version vocabulary and primary `v0.6.1` controller examples for Task 2 and the later guides. Published IDs/routes remain unchanged.

- [x] **Step 1: Establish evidence before edits.** Compare existing requirements and erroneous references with controller tags `v0.3.0`, `v0.4.0` and `v0.6.1`, the SKE `v0.59.0` note, Operator `v0.34.0` and plugin release records. Record findings in the ledger.
- [x] **Step 2: Correct requirements.** Clearly state the version profile described by current examples; explain the ConfigMap transition, status compatibility and plugin-first upgrade order. Link to existing component release pages.
- [x] **Step 3: Align examples and plugin instructions.** Update the three primary SKEIntegration examples to `v0.6.1`. Align current plugin requirements with backend `v0.24.0` and frontend `v0.22.0`; make old/new frontend instructions conditional. Do not blanket-replace historical versions.
- [x] **Step 4: Correct the two release references.** Operator ConfigMap transition refers to Portal Controller `v0.4.0`, not `v0.8.0`; plugin push pending-request generation refers to `v0.3.0`, not `v0.11.0`.
- [x] **Step 5: Verify the complete site.** Run `rtk proxy mise exec node@22.23.2 -- yarn build`. Expected: exit 0 and generated static files; no broken Markdown links, MDX errors or invalid front matter.
- [x] **Step 6: Review and record.** Compare every changed version claim with the evidence; inspect the rendered requirements and upgrade warning. Commit this coherent correction if Git writes are permitted, then record the build and outcome in the ledger.

### Task 2: Correct current portal behaviour and active prerequisites

**Files:** Modify the controller overview, installation binding diagnostics, Cortex overview and platform architecture page.

**Interfaces:** Consumes Task 1's current release profile. Produces consistent current behaviour and a non-deprecated Cortex prerequisite path; no navigation changes.

- [ ] **Step 1: Read released behaviour.** In the `v0.6.1` controller source, inspect per-portal fingerprints, global workload digests, missing-config condition names, exporter ownership, and pending Cortex entity generation. Check the existing tests protecting sibling setup Jobs. Record what is evidenced versus not runtime-tested here.
- [ ] **Step 2: Correct architecture and request wording.** Explain Backstage output through a Destination backed by Git or a bucket; distinguish immediate submissions from backend Kubernetes/Git transport. Describe Port as a developer portal with a separate controller.
- [ ] **Step 3: Correct Cortex setup and ownership.** Explain that changing one portal affects its setup only, while workload template changes can affect all Jobs. Name the actual generated ConfigMap ownership and retain the portal-removal lifecycle description.
- [ ] **Step 4: Make prerequisites current.** Replace the deprecated setup cross-link with a short current workspace/Git preparation section linking primary Cortex integration/token docs and current platform GitOps guides. Do not copy deprecated controller installation commands.
- [ ] **Step 5: Document durable pending behaviour.** Describe the pending request entity and workflow result link from `v0.6.1`, without promising provisioning success or immediate reconciliation.
- [ ] **Step 6: Correct binding diagnostics.** Distinguish the released missing-configuration condition from the invalid-configuration warning event and explain the configuration object each refers to, including the operatorless route.
- [ ] **Step 7: Verify and review.** Run the full build; inspect rendered current Cortex and architecture pages. Expected: exit 0, no broken links, source-consistent behaviour and no deprecated prerequisite on the current Cortex route.
- [ ] **Step 8: Record the initial milestone.** Commit the coherent corrections if permitted, update the ledger and task checkboxes, and obtain a fresh review of this milestone. Later programme milestones remain unchecked.
