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
apiVersion: ske.platform.syntasso.io/v1alpha1
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

The `upgradePlanRef` field references the Upgrade Plan that this run executes. This field is **immutable** — once set, it
cannot be changed.

```yaml
spec:
  upgradePlanRef:
    name: redis-v1-to-v2
```

When the referenced Upgrade Plan exists, the Upgrade Run will resolve the plan and begin execution.
If the plan does not exist, the Upgrade Run will set a `PlanResolved` condition with status `False` and reason `PlanNotFound`.

## Suspending an Upgrade Run

You can pause an in-progress Upgrade Run by setting `suspend` to `true`:

```yaml
spec:
  suspend: true
```

Setting `suspend` back to `false` resumes execution. This allows you to temporarily halt an upgrade without deleting the
run.

## Status

The Upgrade Run status tracks the progress of the upgrade across all rollout groups.

```yaml
status:
  totalResources: 10
  # Total number of resources across all rollout groups.
  resourceListRefs:
    - name: redis-v1-to-v2-run-001-resource-snapshot
    # References to ConfigMaps containing the snapshot of resources to be upgraded.
  rolloutGroups:
    - name: dev
      total: 5
      # Total resources in this group.
      succeeded: 3
      # Resources successfully upgraded.
      failed: 1
      # Resources that failed to upgrade.
      skipped: 1
      # Resources that were skipped.
    - name: staging
      total: 5
      succeeded: 0
      failed: 0
      skipped: 0
  conditions:
    - type: PlanResolved
      status: "True"
      reason: PlanFound
```

### Resource Snapshot

When an Upgrade Run begins, it creates a ConfigMap containing a snapshot of the resources to be upgraded, grouped by
rollout group. This snapshot is taken at the start of the run and does not change as resources are upgraded. The
`resourceListRefs` field in the status references this ConfigMap.

The ConfigMap data may look like this:

```json
{
  "resourceGroups": [
    {
      "name": "dev",
      "resources": [
        {
          "name": "my-redis-dev-1",
          "namespace": "default"
        },
        {
          "name": "my-redis-dev-2",
          "namespace": "team-b"
        }
      ]
    }
  ]
}
```

### Rollout Group Status

Each entry in `rolloutGroups` summarises the upgrade progress of a single rollout group:

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

## Creating an Upgrade Run

Upgrade Runs are typically created automatically by the system when an Upgrade Plan's execution policy triggers (via
`repeatSchedule` or `executeAt`). You can also create one manually to trigger an immediate upgrade:

```bash
kubectl apply -f - <<EOF
apiVersion: ske.platform.syntasso.io/v1alpha1
kind: UpgradeRun
metadata:
  name: redis-v1-to-v2-manual-run
spec:
  upgradePlanRef:
    name: redis-v1-to-v2
EOF
```

## Deleting an Upgrade Run

When an Upgrade Run is deleted, the associated resource snapshot ConfigMap is cleaned up automatically.
