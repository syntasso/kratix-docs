---
title: Behaviour Modifying Labels
description: Labels that influence how Kratix reconciles Promises and Resources.
id: behaviour-labels
---

Kratix exposes a small set of labels that alter the standard reconciliation behaviour for Promises and Resources. This page summarises how to use these labels and what to expect when they are applied.

## `kratix.io/manual-reconciliation: "true"`

Adding this label to a Promise or Resource Request forces Kratix to rerun the relevant workflow outside of the normal reconciliation triggers.

- **Promise Configure workflow** – applying the label reruns the Configure workflow from the beginning, terminating any in-progress run.
- **Promise Delete workflow** – after a Promise is marked for deletion, setting the label immediately reruns the Delete workflow.
- **Resource Configure workflow** – applying the label to a Resource Request behaves the same, restarting the Configure workflow.
- **Resource Delete workflow** – after a Resource Request is marked for deletion, adding the label reruns the Delete workflow at once.

The label is removed automatically once Kratix schedules the manual run so it can be applied again later. See the [Promise workflow documentation](../../reference/promises/workflows#manual-reconciliation) and [Resource workflow documentation](../../reference/resources/workflows#manual-reconciliation) for more details.

## `kratix.io/paused: "true"`

This label pauses reconciliation for the object it is applied to. Any workflows
already running continue until completion, but Kratix will not schedule new
workflows while the label is present.

Pausing affects both configuration and deletion:

- **Configure workflows** – changes to the object are ignored until it is
  unpaused.
- **Delete workflows** – if the object is marked for deletion while paused, the
  delete workflow is queued and only executed once the label is removed.

### Compound Promises

When using [Compound Promises](../guides/compound-promises), each Promise evaluates the pause label independently:

- **Parent paused, children not** – the parent Promise stops reconciling. Child Promises continue reconciling normally.
- **Child paused, parent not** – the parent Promise continues reconciling, but requests depending on the paused child are not fully processed until that child is unpaused.

Removing the label resumes reconciliation for the affected Promise or Resource.
