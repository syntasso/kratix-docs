---
description: Documentation for the SKE UpgradeRun Custom Resource
title: Upgrade Runs
sidebar_label: Upgrade Runs
---

# Upgrade Runs

Upgrade Runs represent the execution of an [Upgrade Plan](./upgrade-plans). Each Upgrade Run references an Upgrade Plan
and tracks the progress of upgrading resources according to the plan's rollout groups.

Upgrade Runs are cluster-scoped resources. They can be created by SKE when an Upgrade Plan's execution
policy triggers, but they can also be created manually.

An Upgrade Run looks like this:

```yaml
apiVersion: platform.syntasso.io/v1alpha1
kind: UpgradeRun
metadata:
  name: redis-v1-to-v2-run-001
spec:
  upgradePlanRef:
    name: redis-v1-to-v2
    # Name of the UpgradePlan this run executes. Immutable after creation.
  suspend: false
    # Set to true to pause execution. Defaults to false.
```

## Upgrade Plan Reference

The `upgradePlanRef` field references the Upgrade Plan that this run executes. This field is **immutable**: once set, it
cannot be changed.

```yaml
spec:
  upgradePlanRef:
    name: redis-v1-to-v2
```

When the referenced Upgrade Plan exists, the Upgrade Run will resolve the plan and begin execution.
If the plan does not exist, the Upgrade Run will set a `PlanResolved` condition with status `False` and reason `PlanNotFound`.
A run that starts before its plan exists can still resolve later if the plan appears.

## Suspending an Upgrade Run

You can pause an in-progress Upgrade Run by setting `suspend` to `true`:

```yaml
spec:
  suspend: true
```

Setting `suspend` back to `false` resumes execution. This allows you to temporarily halt an upgrade without deleting the
run.

## Previewing an upgrade before it runs

You can review exactly which resources an Upgrade Run will touch before any of them are upgraded by creating the run
suspended:

```yaml
apiVersion: platform.syntasso.io/v1alpha1
kind: UpgradeRun
metadata:
  name: redis-v1-to-v2-preview
spec:
  upgradePlanRef:
    name: redis-v1-to-v2
  # highlight-next-line
  suspend: true
```

A run created with `suspend: true` still takes its [snapshot](#resource-snapshot) of eligible resources and writes the
snapshot ConfigMap, but it does not patch any Resource Bindings. This gives you a stable, per-rollout-group list of what
the run set out to change, without changing anything.

Once you are happy with the snapshot, set `suspend` back to `false` to let the run proceed. If you decide not to go
ahead, [delete the run](#deleting-an-upgrade-run); the snapshot ConfigMap is cleaned up with it.

## Superseded runs

When an Upgrade Plan is on a schedule and the next trigger fires while a run is still `Pending` or `InProgress`, SKE does
not start a second run alongside the first. It supersedes the active run instead:

- The active run is patched with `spec.suspend: true`, so it stops starting new resource upgrades.
- Its `status.supersededBy` is set to the name of the new run.
- The new run starts in its place.

This keeps a single run rolling out at a time for a given plan, even when a schedule fires during a long-running upgrade.

## How an UpgradeRun executes

When an UpgradeRun starts, it:

1. **Takes a snapshot** of all Resource Bindings for the Promise that are on an eligible `from` version. The snapshot records each resource's version at the moment the run begins. This baseline is used throughout the run to detect drift.
2. **Waits for the target PromiseRevision to exist** before the snapshot is finalised. If the target [Promise Revision](/main/reference/promises/promise-upgrade/promise-revisions) is not yet available, the run requeues until it appears.
3. **Processes rollout groups in plan order.** For each group, it patches the `spec.version` on each matching Resource Binding to the target version and waits for Kratix to apply the upgrade. Only once every resource in the current group is accounted for does the run move to the next group.

## Resource Outcomes

When a run processes a rollout group, each snapshotted resource is evaluated against its current live state. Because the run re-checks bindings on every reconcile cycle, resources can change between when the snapshot was taken and when their group is reached.

| Outcome | When it applies |
|---------|-----------------|
| **Succeeded** | The binding's `lastAppliedVersion` equals the target version; the upgrade was applied. This includes resources that were already applied at the target version by the time their group was reached. |
| **Skipped** | The binding no longer exists (resource was deleted), or the resource was upgraded to a different version externally. |
| **Failed** | Kratix reported an upgrade failure on the binding (`UpgradeSucceeded=False`) during the current run. The failure is part of the current run when the condition's `lastTransitionTime` is at or after the Upgrade Run's `creationTimestamp`. The entire run stops immediately. |
| **Pending** | The binding has been patched to the target version but Kratix has not yet applied it. If the binding is already at the target `spec.version` and the only upgrade failure was recorded before this Upgrade Run was created, the run treats that failure as the result of an earlier run. It sets `kratix.io/manual-reconciliation: "true"` on the Resource Binding to request a retry, then requeues and waits. |

Skipped resources count towards group completion and do not block the run from advancing to the next group. A single failed resource stops the run entirely. Subsequent groups are not processed. Upgrade failures recorded before the Upgrade Run was created do not fail the current run.

### Drift Detection

The snapshot records each resource's version at run start. If, by the time the run processes a resource, its version has been changed externally, the resource is **Skipped** rather than overwritten:

- A resource upgraded to a version *other than the target* (e.g. `v3.0.0` when the target is `v2.0.0`) is skipped.
- A resource with `lastAppliedVersion` already at the target version is counted as **Succeeded** immediately; no patch is issued.
- A resource with `spec.version` already at the target version, but with `lastAppliedVersion` still behind, remains **Pending**. If its only upgrade failure was recorded before the current run was created, the run adds the [manual reconciliation label](/main/reference/resources/reconciliation-labels#requesting-reconciliation-via-a-resource-binding) to the Resource Binding so Kratix retries the Resource Configure workflow.

## PromiseRevision Gate

The run checks that the target [Promise Revision](/main/reference/promises/promise-upgrade/promise-revisions) exists at two points, with different behaviour each time:

**Before the snapshot is taken:** if the target PromiseRevision does not yet exist, the run requeues and waits. No failure is recorded. This handles the case where the revision is still being created when the run starts.

**Once the snapshot exists and the rollout is underway:** if the PromiseRevision is deleted, the run transitions immediately to `Failed` with reason `PromiseRevisionNotFound`. Resources that have not yet been patched remain on their current version.

## Status

The Upgrade Run status tracks the progress of the upgrade across all rollout groups.

```yaml
status:
  # Overall execution state: (empty), Pending, InProgress, Completed, Failed, or Cancelled.
  state: InProgress
  # Total number of resources across all rollout groups.
  totalResources: 10
  # Resources successfully upgraded so far (sum of each group's succeeded; excludes skipped and failed).
  completedResources: 3
  # References to ConfigMaps containing the snapshot of resources to be upgraded.
  resourceListRefs:
    - name: redis-v1-to-v2-run-001-resource-snapshot
  rolloutGroups:
    - name: dev
      # Total resources in this group.
      total: 5
      # Resources successfully upgraded.
      succeeded: 3
      # Resources that failed to upgrade.
      failed: 1
      # Resources that were skipped.
      skipped: 1
    - name: staging
      total: 5
      succeeded: 0
      failed: 0
      skipped: 0
  conditions:
    - type: PlanResolved
      status: "True"
      reason: PlanFound
    - type: RunSucceeded
      status: "False"
      reason: ResourceUpgradeFailed
      message: "1 resource(s) failed to upgrade in rollout group \"dev\""
```

### State

The `state` field reflects the overall execution state of the run:

| State | Meaning |
|-------|---------|
| _(empty)_ | Waiting for the referenced Upgrade Plan or the target PromiseRevision to be available |
| `Pending` | Run is active but rollout has not started. Counts as active on the parent plan (`phase: Running`). The controller typically leaves this empty until the snapshot is created, then sets `InProgress`. |
| `InProgress` | Snapshot created, rollout underway |
| `Completed` | All rollout groups finished successfully |
| `Failed` | A resource reported an upgrade failure, or the target PromiseRevision was deleted mid-run |
| `Cancelled` | The run was deleted while still in progress |

Once a run reaches `Completed`, `Failed`, or `Cancelled` it is terminal. It will not be reconciled further. The controller sets `finishedAt` at that point.

When a run becomes terminal, the controller records a summary on the parent [Upgrade Plan](./upgrade-plans) in `status.lastRun`.

### Resource Snapshot

When an Upgrade Run begins, it records a snapshot of every resource it will upgrade, grouped by rollout group, in a
ConfigMap in the `kratix-platform-system` namespace. The snapshot is written at the start of the run and does not change
as the upgrade proceeds, so it is a stable record of what the run set out to change. See
[Managing Promise Upgrades](/ske/guides/promise-upgrades) for how to use it.

The `resourceListRefs` field lists the ConfigMaps that hold the snapshot. In practice this is a single ConfigMap.

Each entry records the resource's namespace and name, the version captured at snapshot time (`lastAppliedVersion`), and
its `spec.version` (`specVersion`). These versions form the baseline used for [drift detection](#drift-detection).

```json
{
  "groups": [
    {
      "name": "dev",
      "resources": [
        {
          "namespace": "team-a",
          "name": "r1",
          "lastAppliedVersion": "v1",
          "specVersion": "v1"
        }
      ]
    }
  ]
}
```

### Rollout Group Status

Each entry in `groups` summarises the upgrade progress of a single rollout group:

| Field | Description |
|-------|-------------|
| `name` | Name of the rollout group |
| `total` | Total number of resources in this group |
| `succeeded` | Number of resources successfully upgraded |
| `failed` | Number of resources that failed to upgrade |
| `skipped` | Number of resources that were skipped |

### Conditions

The Upgrade Run reports its state via standard Kubernetes conditions:

| Condition | Description |
|-----------|-------------|
| `PlanResolved` | `True` when the referenced Upgrade Plan exists; `False` with reason `PlanNotFound` when absent |
| `RunSucceeded` | `True` with reason `RunCompleted` when all rollout groups complete successfully; `False` with reason `ResourceUpgradeFailed` when a resource fails, `PromiseRevisionNotFound` when the target revision is deleted mid-run, or `RunCancelled` when the run is deleted in progress |

## Manually Creating an Upgrade Run

Upgrade Runs are typically created automatically by the system when an Upgrade Plan's execution policy triggers (via
`repeatSchedule` or `executeAt`). You can also create one manually to trigger an immediate upgrade:

```bash
kubectl apply -f - <<EOF
apiVersion: platform.syntasso.io/v1alpha1
kind: UpgradeRun
metadata:
  name: redis-v1-to-v2-manual-run
spec:
  upgradePlanRef:
    name: redis-v1-to-v2
EOF
```

## Deleting an Upgrade Run

When an Upgrade Run that is still in progress is deleted, the controller marks it `Cancelled`, records the outcome on the parent Upgrade Plan's `status.lastRun`, and then removes the associated resource snapshot ConfigMap.

When a terminal run is deleted, the snapshot ConfigMap is cleaned up automatically. The plan's `lastRun` summary is not removed.
