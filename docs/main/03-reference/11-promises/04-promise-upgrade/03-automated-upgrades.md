---
description: Automate the upgrade of Resource Requests across rollout groups using UpgradePlan and UpgradeRun
title: Automated Upgrades
sidebar_label: Automated Upgrades
---

# Automated Upgrades

```mdx-code-block
import FeatureFlagBox from "./_feature_flag_box.md"
```

<FeatureFlagBox />

Automated upgrades let you control how and when [Resource Bindings](./resource-bindings) are updated to a new Promise version, across large fleets of Resource Requests, without manual intervention.

This is done through two resources:

- **UpgradePlan** — defines *what* to upgrade (the Promise and version transition), *which* resources to include (via rollout groups and label selectors), and *when* to execute.
- **UpgradeRun** — represents a single execution of an UpgradePlan. Each run processes the rollout groups in order and tracks per-resource progress until all groups are complete or one fails.

:::info

`UpgradePlan` and `UpgradeRun` are SKE resources in the `platform.syntasso.io` API group. They are not available in open-source Kratix.

:::

---

## UpgradePlan

An `UpgradePlan` describes the full configuration for an automated upgrade: which Promise, which version transition, which resources to include, and when execution should trigger.

```yaml
apiVersion: platform.syntasso.io/v1alpha1
kind: UpgradePlan
metadata:
  name: redis-upgrade-plan
spec:
  promiseRef:
    name: redis                  # the Promise whose resources will be upgraded
  upgradePath:
    from:
      - "v1.0.0"                 # version(s) currently on resources eligible for upgrade
    to: "v2.0.0"                 # target version
  upgradeExecutionPolicy:
    repeatSchedule: "0 23 * * 6" # cron: every Saturday at 23:00
    timeZone: "Europe/London"
  rolloutGroups:
    - name: dev
      resourceUpgradeWindows:
        - kind: allow
          window: "0 1-7 * * *"
          timeZone: "Europe/London"
      selectors:
        matchLabels:
          env: dev
    - name: staging
      resourceUpgradeWindows:
        - kind: allow
          window: "0 1-7 * * *"
          timeZone: "Europe/London"
      selectors:
        matchExpressions:
          - key: env
            operator: In
            values:
              - staging
```

### `upgradePath`

`from` lists the versions that make a resource *eligible* for this upgrade. Resources on any other version are ignored. 

`to` is the single target version all eligible resources will be upgraded to.

### `upgradeExecutionPolicy`

Controls when an UpgradeRun is automatically created to execute the plan.

| Field | Description |
|---|---|
| `repeatSchedule` | Cron expression for recurring execution (e.g. `"0 23 * * 6"`) |
| `executeAt` | RFC3339 datetime for a one-time execution |
| `timeZone` | Timezone for schedule evaluation (e.g. `"Europe/London"`) |

Both `repeatSchedule` and `executeAt` may be set on the same plan; `executeAt` fires once while `repeatSchedule` recurs.

### `rolloutGroups`

Rollout groups define *which* resources are upgraded and in *what order*. Groups are processed sequentially — a group must fully complete before the next one begins.

Each group requires:

- **`name`** — a unique identifier for the group, used to track progress.
- **`selectors`** — label-based criteria that determine which resources belong to this group. Supports `matchLabels` and `matchExpressions`. Resources that do not match any group are not upgraded.
- **`resourceUpgradeWindows`** — cron-based time windows that gate when upgrades within the group may proceed. Each window has a `kind` of `allow` or `deny`.

:::tip

Resources not matched by any rollout group selector are never upgraded by this plan. Use this to keep certain environments (e.g. production) out of scope entirely.

:::

---

## UpgradeRun

An `UpgradeRun` triggers a single execution of an `UpgradePlan`. It is created automatically when the plan's execution policy fires, or you can create one manually to trigger an immediate run:

```yaml
apiVersion: platform.syntasso.io/v1alpha1
kind: UpgradeRun
metadata:
  name: redis-upgrade-run
spec:
  upgradePlanRef:
    name: redis-upgrade-plan
```

Once created, the run takes a snapshot of all eligible Resource Bindings and begins processing rollout groups in order.

:::info

`spec.upgradePlanRef` is immutable after the UpgradeRun is created.

:::

---

## How a run executes

When an UpgradeRun starts, it:

1. **Takes a snapshot** of all Resource Bindings for the Promise that are on an eligible `from` version. The snapshot records each resource's version at the moment the run begins — this baseline is used throughout the run to detect drift.
2. **Waits for the target PromiseRevision to exist** before the snapshot is finalised. If the target [Promise Revision](./promise-revisions) is not yet available, the run requeues until it appears.
3. **Processes rollout groups in plan order.** For each group, it patches the `spec.version` on each matching Resource Binding to the target version and waits for Kratix to apply the upgrade. Only once every resource in the current group is accounted for does the run move to the next group.

---

## Resource outcomes

Each snapshotted resource is evaluated on every reconcile cycle. The run re-checks the live state of each binding, so resources can change between when the snapshot was taken and when their group is processed.

| Outcome | When it applies |
|---|---|
| **Succeeded** | `lastAppliedVersion` on the binding equals the target version — the upgrade was applied. This includes resources that were already at the target version by the time their group was reached. |
| **Skipped** | The binding no longer exists (resource was deleted), or the resource was upgraded to a different version externally. See [drift](#drift-detection) below. |
| **Failed** | Kratix reported an upgrade failure on the binding. The entire run stops. |
| **Pending** | The binding has been patched to the target version but Kratix has not yet applied it. The run requeues and waits. |

Skipped resources count towards group completion and do not block the run from advancing to the next group. A single failed resource stops the run immediately — subsequent groups are not processed.

### Drift detection

The snapshot records each resource's version at run start. If, by the time the run processes a resource, its version has been changed externally (by another process, a manual patch, or another run), the resource is **Skipped** rather than overwritten:

- A resource upgraded to a version *other than the target* (e.g. `v3.0.0` when the target is `v2.0.0`) is skipped.
- A resource already at the target version is counted as **Succeeded** immediately — no patch is issued.

---

## Tracking progress

### UpgradeRun state

The run's overall state is visible at `.status.state`:

| State | Meaning |
|---|---|
| _(empty)_ | Waiting for the referenced UpgradePlan or the target PromiseRevision to be available |
| `InProgress` | Snapshot created, rollout underway |
| `Completed` | All rollout groups finished successfully |
| `Failed` | A resource reported an upgrade failure, or the target PromiseRevision was deleted mid-run |

Once a run reaches `Completed` or `Failed` it is terminal — it will not be reconciled further.

Per-group progress is available at `.status.rolloutGroups`:

```bash
kubectl get upgraderun redis-upgrade-run \
  -o jsonpath='{.status.rolloutGroups}'
```

Each entry reports `name`, `total`, `succeeded`, `skipped`, and `failed` for that group.

### UpgradePlan state

The plan's `.status.state` reflects the aggregate state across all its runs:

| State | Meaning |
|---|---|
| `InProgress` | At least one run is currently in progress |
| `Completed` | All runs have completed successfully |
| `Pending` | No runs are active |

---

## Deletion behaviour

| Deleted object | Effect |
|---|---|
| **UpgradeRun** | In-flight binding patches that Kratix has already started will complete; no new groups are started |
| **UpgradePlan** | All owned UpgradeRuns are deleted; same as above for any in-flight work |
| **PromiseRevision** (mid-run) | The run transitions to `Failed`; resources that have not yet been patched remain on their current version |
