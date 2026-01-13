---
title: Resource Reconciliation Labels
description: Labels that change how Kratix reconciles Resource requests.
sidebar_label: Reconciliation labels
slug: /reference/resources/reconciliation-labels
---

Kratix exposes labels that change the reconciliation behavior for Resource requests. If you are looking for labels that apply to Promises, see [Promise Reconciliation Labels](/main/reference/promises/reconciliation-labels).

## Manual Reconciliation

```
kratix.io/manual-reconciliation: "true"
```

Adding this label to a Resource request forces Kratix to rerun the Resource workflows outside the normal reconciliation triggers.

- **Resource Configure workflow** – applying the label reruns the Configure workflow from the beginning, terminating any in-progress run.
- **Resource Delete workflow** – after a Resource is marked for deletion, setting the label immediately reruns the Delete workflow.

The label is removed automatically once Kratix schedules the manual run so it can be applied again later.

## Pausing Reconciliation

```
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
