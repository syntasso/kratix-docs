---
title: Controlling Kratix with labels
description: Labels that influence how Kratix reconciles Promises and Resources.
tags: ["suspending reconciliation", "pausing reconciliation", "manual reconciliation", "workflows"]
---

Kratix exposes a set of labels that alter the standard reconciliation behaviour for Promises and Resources. This page summarises how to use these labels and what to expect when they are applied.

## Manual Reconciliation

```
kratix.io/manual-reconciliation: "true"
```

Adding this label to a Promise or Resource Request forces Kratix to rerun the relevant workflow outside of the normal reconciliation triggers.

- **Promise Configure workflow** – applying the label reruns the Configure workflow from the beginning, terminating any in-progress run.
- **Promise Delete workflow** – after a Promise is marked for deletion, setting the label immediately reruns the Delete workflow.
- **Resource Configure workflow** – applying the label to a Resource Request behaves the same, restarting the Configure workflow.
- **Resource Delete workflow** – after a Resource Request is marked for deletion, adding the label reruns the Delete workflow at once.

The label is removed automatically once Kratix schedules the manual run so it can be applied again later.

## Pausing Reconciliation

```
kratix.io/paused: "true"
```

This label suspends reconciliation for the Promises and Resource Requests it is applied to. Any workflows
already running continue until completion, but Kratix will not schedule new
workflows while the label is present.

Pausing a promise will stop Kratix from triggering workflows for any resource requests for that Promise. It also means that any updates to the Promise will not be carried out until it has been unpaused.

When the label is removed, Kratix will re-reconcile the affected objects.

Pausing affects both configuration and deletion:

- **Configure workflows** – changes to the object will not trigger any workflows until it is unpaused.
- **Delete workflows** – if the object is marked for deletion while paused, the
  delete workflow will only be triggered when the label is removed.

### Compound Promises

When using [Compound Promises](../guides/compound-promises), each Promise evaluates the pause label independently:

- **Parent paused, children not** – the parent Promise stops reconciling. Child Promises continue reconciling normally.
- **Child paused, parent not** – the parent Promise continues reconciling, but requests depending on the paused child are not fully processed until that child is unpaused.
