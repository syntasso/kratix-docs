---
title: Resource Reconciliation Labels
description: Labels that change how Kratix reconciles Resource requests.
sidebar_label: Reconciliation labels
slug: /main/reference/resources/reconciliation-labels
---

Kratix exposes labels that change the reconciliation behavior for Resource requests. If you are looking for labels that apply to Promises, see [Promise Reconciliation Labels](/main/reference/promises/reconciliation-labels).

## Manual Reconciliation

```yaml
kratix.io/manual-reconciliation: "true"
```

Adding this label to a Resource request forces Kratix to rerun the Resource workflows outside the normal reconciliation triggers.

- **Resource Configure workflow** – applying the label reruns the Configure workflow from the beginning, terminating any in-progress run.
- **Resource Delete workflow** – after a Resource is marked for deletion, setting the label immediately reruns the Delete workflow.

The label is removed automatically once Kratix schedules the manual run so it can be applied again later.

### Requesting reconciliation via a Resource Binding

The `kratix.io/manual-reconciliation: "true"` label can also be applied to a [Resource Binding](../promises/promise-upgrade/resource-bindings) to request that Kratix reruns the Resource Configure workflow for the bound Resource Request.

This is useful when a Resource has already been patched to the desired Promise version (its `spec.version` is at the target) but the pipeline previously failed. In this case the normal version-mismatch trigger will not fire again, so the label provides an explicit retry signal.

When Kratix detects the label on a ResourceBinding it:

1. Propagates `kratix.io/manual-reconciliation: "true"` to the Resource Request.
2. Removes the label from the ResourceBinding.

The Resource Configure workflow then reruns as described above.

:::info

Kratix will not re-trigger reconciliation for a Resource that has already failed at the target version unless this label is explicitly set on its ResourceBinding.

:::

## Unsuspend a Workflow

Promises can signal Kratix that the current resource workflow should be suspended via the workflow-control file (check docs for [Workflow Control](/main/reference/promises/workflows#suspending-a-workflow)). When the workflow is suspended, Kratix will add the following label to the Resource:

```yaml
kratix.io/workflow-suspended: "true"
```

This label marks a Resource configure workflow as suspended.

While the label is present:

- Kratix does not schedule later Pipelines from the workflow
- the current pipeline is marked as `Suspended` in `status.kratix.workflows.pipelines`

If the label is removed, Kratix resumes from the suspended Pipeline.

## Pausing Reconciliation

```yaml
kratix.io/paused: "true"
```

This label can be applied to a Resource request to suspend reconciliation for that Resource.
Any workflows already running continue until completion, but Kratix will not schedule new
workflows while the label is present.

When the label is removed, Kratix will re-reconcile the Resource and run its configure workflows.

Pausing affects both configuration and deletion:

- **Configure workflows** – changes to the Resource will not trigger any workflows until it is unpaused.
- **Delete workflows** – if the Resource is marked for deletion while paused, the
  delete workflow will only be triggered when the label is removed.

When an object is paused, its status condition will reflect the 'paused' state until the label is removed:

```yaml
status:
  apiVersion: marketplace.kratix.io/v1alpha1
  conditions:
  - lastTransitionTime: "2025-09-22T13:17:27Z"
    message: Paused
    reason: PausedReconciliation
    status: Unknown
    type: Reconciled
```
