---
description: Documentation for the DryRun Custom Resource, which previews the output of a Resource Request before it is applied
title: Dry Run (Preview)
sidebar_label: Dry Run (Preview)
id: dry-run
---

# Dry Run

:::danger Preview feature. Do not use in production.

Dry Run is an early preview. It is **not** production ready, and we do not
recommend running it against a production platform.

- Everything on this page is subject to change, including the `DryRun` API,
the labels Kratix sets, and the format of the generated summary.
- Breaking changes may land in any release, with no migration path and no
deprecation period.
- This preview feature is available in SKE version `v0.55.0-rc1` onwards.

:::

:::tip Feedback wanted
We are actively looking for feedback. Tell us what works, what does not, and
what you would need before you would trust this in production: email
[feedback@syntasso.io](mailto:feedback@syntasso.io?subject=Kratix%20Dry%20Run%20Feedback)
or [open a GitHub Issue](https://github.com/syntasso/kratix/issues/new).
:::

A `DryRun` previews what a Resource Request would produce, without applying
anything to a real Destination. Kratix runs the Promise's Resource Workflows
against a proposed spec, compares the output against what the live Resource
Request currently produces, and writes a summary of the difference.

Dry Run covers Resource Workflows only. It does not preview Promise Workflows.

## When to use it

- Reviewing a change to a Resource Request before applying it, for example in a
pull request, where you want to see the manifests that would change rather than
the request that changed.
- Previewing a Resource Request that does not exist yet, to see everything it
would create.

## Prerequisites

Dry Run needs two things that are not present by default. Without either one the
`DryRun` object is accepted by the API server and then does nothing.

### Enable the feature flag

Dry Run is off by default. Set
[`featureFlags.dryRun`](/main/reference/kratix-config/config#featureflags) in the
`kratix` ConfigMap and restart the controller manager:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: kratix
  namespace: kratix-platform-system
data:
  config: |
    featureFlags:
      dryRun: true
```

```bash
kubectl rollout restart deployment -n kratix-platform-system kratix-platform-controller-manager
```

While the flag is off, the controller that reconciles `DryRun` objects is never
started, and Kratix ignores dry-run labels everywhere else.

### Create a dry-run Destination

Dry-run output is scheduled exclusively to Destinations labelled
`kratix.io/dry-run: "true"`. Create one:

```yaml
apiVersion: platform.kratix.io/v1alpha1
kind: Destination
metadata:
  name: dry-run
  labels:
    kratix.io/dry-run: "true"
spec:
  path: dry-run
  stateStoreRef:
    name: default
    kind: BucketStateStore
```

Use a Destination that no GitOps agent reconciles. Its contents are previews,
not desired state, and nothing should apply them to a cluster.

We recommend keeping one dry run destination and do not schedule any normal work to this destination.

## API

```yaml
apiVersion: platform.kratix.io/v1alpha1
kind: DryRun
metadata:
  name: preview-my-redis
  namespace: default
spec:
  promiseRef:
    name: redis
  resourceRequestRef:
    name: my-redis
    namespace: default
  resource:
    size: large
```

| Field | Required | Description |
| --- | --- | --- |
| `spec.promiseRef.name` | Yes | The Promise whose Resource Workflows to run. |
| `spec.resourceRequestRef.name` | Yes | The live Resource Request to diff against. It does not have to exist; see [Previewing a Resource Request that does not exist yet](#previewing-a-resource-request-that-does-not-exist-yet). |
| `spec.resourceRequestRef.namespace` | No | Namespace of the live Resource Request. Defaults to the `DryRun`'s own namespace. |
| `spec.resource` | Yes | The proposed spec, in the shape expected by the Promise's Resource API. This is the `spec` of the Resource Request, not the whole object. |

## Behaviour

When you create a `DryRun`, Kratix:

1. Creates an ephemeral Resource Request named
`kratix-dry-run-<dry-run-name>-<hash>`, owned by the `DryRun`, carrying
`spec.resource` as its spec and labelled `kratix.io/dry-run: "true"`. It appears
in `kubectl get` output alongside real requests for that Promise.
2. Runs the Promise's Resource Workflows for that request, with
`KRATIX_DRY_RUN=true` set in every pipeline container. Pipelines see the live
Resource Request's name, namespace and labels, combined with the proposed spec,
so output that derives from request metadata matches what a real run would
produce.
3. Labels the resulting Work `kratix.io/dry-run: "true"` and schedules it to the
dry-run Destination.
4. Compares the dry-run output against the live Resource Request's current Work,
pipeline by pipeline, and writes the summary to the dry-run Destination as
`kratix-dry-run-summary.md`.
5. Sets `Completed` on the `DryRun` status.

The ephemeral Resource Request is not reconciled onto any real Destination, and
Kratix will not update the statuses of the real Resource Request.

Deleting the `DryRun` deletes the ephemeral Resource Request with it.

### Status

`status.conditions` reports the outcome:

| Condition | Status | Reason | Meaning |
| --- | --- | --- | --- |
| `Completed` | `True` | `SummaryWritten` | The run finished and the summary was written. |
| `Completed` | `False` | `PipelineFailed` | A pipeline failed. `message` carries the detail. |
| `ComponentsSucceeded` | `True` or `False` | | Compound Promises only. See [Compound Promises](#compound-promises). |

An absent `Completed` condition means the run has not finished.

### Reading the summary

The summary is a file on the dry-run Destination, so you can read it from the
state store like any other Kratix output.

The summary opens with a per-pipeline count, then shows added files in full and
modified files as a unified diff:

```markdown
# Kratix Dry Run Summary

## Pipeline: `redis-configure`

**1 added · 1 modified · 0 removed**
```

### Compound Promises

When a Promise's workflow emits Resource Requests for other Promises, a preview
of the parent alone would show only that the component requests changed, not what
those components would then do.

For Kratix to follow the chain, the parent's workflow must label each component
request it emits with `kratix.io/parent-resource-name`. That label is the whole
contract: Kratix has no other way to tell a component Resource Request apart from
an ordinary workload in the pipeline's output. Kratix raises a child `DryRun` for
each labelled request and folds their summaries into the parent's.

`status.components` reports one entry per component, each with `promise`,
`request`, `namespace`, `dryRun`, `phase` (`Pending`, `Succeeded` or `Failed`)
and, on failure, `message`.

Gate on `ComponentsSucceeded`, not on `Completed`. A compound run whose component
failed still writes a partial summary and still reports `Completed: True`,
because a partial preview is worth reading. `ComponentsSucceeded` is what
distinguishes "the run finished" from "the preview is complete".

A compound run waits up to 10 minutes for its components. After that it writes a
partial summary rather than waiting indefinitely, because a component whose
pipeline crash-loops never reports a condition at all.

## Examples

### Previewing a change to an existing Resource Request

`spec.resource` is the spec you are proposing. The diff is against whatever the
real request currently produces:

```yaml
apiVersion: platform.kratix.io/v1alpha1
kind: DryRun
metadata:
  name: preview-my-redis-resize
  namespace: default
spec:
  promiseRef:
    name: redis
  resourceRequestRef:
    name: my-redis
    namespace: default
  resource:
    size: large # currently small
```

### Previewing a Resource Request that does not exist yet

Name the request you are about to create. Nothing exists to diff against, so
every file reads as added:

```yaml
apiVersion: platform.kratix.io/v1alpha1
kind: DryRun
metadata:
  name: preview-new-redis
  namespace: default
spec:
  promiseRef:
    name: redis
  resourceRequestRef:
    name: not-created-yet
    namespace: default
  resource:
    size: small
```

Naming the intended request matters even though it does not exist. Pipelines that
derive names from the request's metadata, which is how compound Promises name
their component requests, produce the names they would really produce rather than
names based on the ephemeral request.

## Related documentation

- [Kratix Config](/main/reference/kratix-config/config): the `featureFlags.dryRun`
setting.
- [Destinations](/main/reference/destinations/intro): destination selectors and
filepath modes.
- [Resource Workflows](/main/reference/resources/workflows): the pipelines a dry
run executes.
