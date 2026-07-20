# SKE Integrations

The vocabulary for documenting how SKE connects Kratix Promises and resource requests to
external developer-facing catalogs/portals (Backstage, Cortex, and future bring-your-own
portals) via the Portal Controller.

## Language

**Portal**:
A developer-facing catalog or interface that SKE syncs Promise/resource entities into —
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
Cortex Controller. Deprecates both as of this release; each legacy controller continues to work
for at least one more release to allow migration.
_Avoid_: "unified controller" (fine in prose once, but the doc's proper noun is Portal Controller)

**Portal type**:
Which kind of portal a `portals[]` entry targets — `backstage`, `cortex`, or a custom/BYO type.
Set via `portals[].type` on the `SKEIntegration`.

**Portal** (a.k.a. **portal instance**):
One entry in `SKEIntegration.spec.portals[]` — a specific instance of a portal type (URL,
credential, config). Multiple portals of the same type can coexist (e.g. two Backstage
instances), disambiguated by `name`. In prose, call it a "portal"; use "portal instance" only
where the instance-vs-type distinction must be stressed.
_Avoid_: "portal connection" / "connection" for the config entry — it implies a persistent,
stateful link, but a `portals[]` entry is just declarative config (Backstage never calls the
portal at all). Reserve "connection" for a genuine live network link (e.g. the Cortex exporter).

**Portal binding**:
The label-based opt-in that binds a Promise (or resource request) to a portal:
`kratix.io/portal-<type>[.<instance>]`. Reported back on the Promise via the
`PortalBindingReady` condition.

**PortalCustomization**:
A cluster-scoped CRD (`portal.kratix.io/v1alpha1`) that lets a Promise author inject extra
pipeline containers to edit the generated entity documents before they ship. Replaces the
deprecated `BackstageEntityCustomization`.
_Avoid_: "customization profile" alone without capitalizing/code-formatting the CRD name

**Customize lane**:
The `promise` or `resource` half of a `PortalCustomization` — `spec.promise.containers[]` runs
in the promise-level sync pipeline, `spec.resource.containers[]` in the per-resource-instance
pipeline. Both are live/working (resource lane shipped with #1129 — despite some
`ske-portal-controller` source docs still describing it as pending).

**Adapter**:
The image that performs the `generate` (and, for some portal types, `writer`) pipeline stage —
`ske-portal-adapter`, bundled inside the `ske-portal-controller` image by default, or a
bring-your-own image via `adapterConfig`.
