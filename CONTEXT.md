# SKE Integrations

The vocabulary for documenting how SKE connects Kratix Promises and resource requests to
external developer-facing catalogs/portals (Backstage, Cortex, and future bring-your-own
portals) via the Portal Controller.

## Language

**Portal**:
A developer-facing catalog or interface that SKE syncs Promise/resource entities into.
Backstage and Cortex today, with bring-your-own portals supported via a pluggable adapter.
Always write the full phrase ("Portal Controller", "Portal Integrations") in docs headings and
nav labels, never the bare word "Portal" alone, to avoid collision with the unrelated **Port**
(port.io) integration that sits in the same integrations list.
_Avoid_: bare "Portal" in headings/nav; "catalog" (that's Backstage-specific vocabulary)

**Port**:
The unrelated third-party product (port.io) documented at `10-integrations/20-port.mdx`. Not to
be confused with **Portal**.

**Portal Controller** (`ske-portal-controller`):
The unified controller (ADR0009) that replaces the standalone Backstage Controller and SKE
Cortex Controller. Both legacy controllers are deprecated as of this release. Do not state a
removal release or timeline in the docs.
_Avoid_: "unified controller" (fine in prose once, but the doc's proper noun is Portal Controller)

**Portal type**:
Which kind of portal a `portals[]` entry targets: `backstage`, `cortex`, or a custom/BYO type.
Set via `portals[].type` on the `SKEIntegration`.

**Portal** (a.k.a. **portal instance**):
One entry in `SKEIntegration.spec.portals[]`, a specific instance of a portal type (URL,
credential, config). Multiple portals of the same type can coexist (e.g. two Backstage
instances), disambiguated by `name`. In prose, call it a "portal"; use "portal instance" only
where the instance-vs-type distinction must be stressed.
_Avoid_: "portal connection" / "connection" for the config entry. It implies a persistent,
stateful link, but a `portals[]` entry is just declarative config. Reserve "connection" for a
genuine live network link (e.g. the Cortex exporter).

**Portal binding**:
The label-based opt-in that binds a Promise (or resource request) to a portal:
`kratix.io/portal-<type>[.<instance>]`. Reported back on the Promise via the
`PortalBindingReady` condition. On a resource request, setting the same label to the literal
string `"false"` opts that single request out.

**Delivery mode**:
For a `backstage` portal, `config.mode` selects how a developer's request reaches the platform:
`push` (the default; the request is applied directly) or `pull-request` (the request is raised
as a pull request for review). GitHub only. Do not confuse with the Backstage plugin's own
backend-wide `ske.mode` setting, which is a different knob; disambiguate the two wherever
both appear.

**PortalCustomization**:
A cluster-scoped CRD (`platform.syntasso.io/v1alpha1`) that lets a Promise author inject extra
pipeline containers to edit the generated entity documents before they ship. Replaces the
deprecated `BackstageEntityCustomization`. `spec.portalType` names the portal type it applies to.
_Avoid_: "customization profile" alone without capitalizing/code-formatting the CRD name

**Configure lane**:
The `promise` or `resource` half of a `PortalCustomization`. `spec.promise.configure` runs in
the promise-level sync pipeline, `spec.resource.configure` in the per-resource-instance
pipeline. Each is a full Kratix `PipelineSpec`, not a bare container list.
_Avoid_: "customize" for this stage. The stage is called **configure**.

**Portal Patch** (`portal-patch`):
A separately versioned image (`ghcr.io/syntasso/portal-patch`) that runs as a container in a
`PortalCustomization`'s configure pipeline and applies declarative recipes to the generated
documents. This is the recommended way to shape generated entities; hand-written `yq` or shell
containers are the escape hatch, not the default.

**Adapter**:
The image that performs the `generate` (and, for some portal types, `writer`) pipeline stage.
`ske-portal-adapter`, bundled inside the `ske-portal-controller` image by default, or a
bring-your-own image via `adapterConfig`.

## House style

- British English spelling in prose ("customise", "behaviour"), but keep American spelling where
  it is part of an identifier or a page title that already ships ("Customization", `PortalCustomization`).
- No em-dashes. Use commas, colons, or separate sentences.
