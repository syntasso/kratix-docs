---
title: Promise Reconciliation Labels
description: Labels that change how Kratix reconciles Promises.
sidebar_label: Reconciliation labels
slug: /reference/promises/reconciliation-labels
---

Kratix exposes labels that change the reconciliation behavior for Promise objects. If you are looking for labels that apply to Resource requests, see [Resource Reconciliation Labels](/main/reference/resources/reconciliation-labels).

## Manual Reconciliation

```
kratix.io/manual-reconciliation: "true"
```

Adding this label to a Promise forces Kratix to rerun the Promise workflows outside the normal reconciliation triggers.

- **Promise Configure workflow** – applying the label reruns the Configure workflow from the beginning, terminating any in-progress run.
- **Promise Delete workflow** – after a Promise is marked for deletion, setting the label immediately reruns the Delete workflow.

The label is removed automatically once Kratix schedules the manual run so it can be applied again later.

## Pausing Reconciliation

```
kratix.io/paused: "true"
```

This label can be applied to a Promise to suspend reconciliation for that Promise.
Any workflows already running continue until completion, but Kratix will not schedule new
workflows while the label is present.

Pausing a Promise will stop Kratix from triggering workflows for any resource requests for that Promise.
It also means that any updates to the Promise will not be carried out until it has been unpaused.

When the label is removed, Kratix will re-reconcile the affected objects:
* For a Promise, Kratix will run the Promise configure workflows, and re-reconcile all existing resources.

Pausing affects both configuration and deletion:

- **Configure workflows** – changes to the Promise will not trigger any workflows until it is unpaused.
- **Delete workflows** – if the Promise is marked for deletion while paused, the
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

A paused Promise will also be marked as `Unavailable`.

### Compound Promises

When using [Compound Promises](/main/guides/compound-promises), each Promise evaluates the pause label independently:

- **Parent paused, children not** – the parent Promise stops reconciling. Child Promises continue reconciling normally.
- **Child paused, parent not** – the parent Promise continues reconciling, but requests depending on the paused child are not fully processed until that child is unpaused.
