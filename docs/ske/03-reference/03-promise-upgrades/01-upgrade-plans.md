---
description: Documentation for the SKE UpgradePlan Custom Resource
title: Upgrade Plans
sidebar_label: Upgrade Plans
---

# Upgrade Plans

Upgrade Plans define the strategy for upgrading Resource Requests from one Promise version to another.
An Upgrade Plan specifies which Promise and versions and when upgrades should execute.

Upgrade Plans are cluster-scoped resources. An Upgrade Plan looks like this:

```yaml
apiVersion: platform.syntasso.io/v1alpha1
kind: UpgradePlan
metadata:
  name: redis-v1-to-v2
spec:
  promiseRef:
    # Name of the Promise whose resources will be upgraded.
    name: redis
  upgradePath:
    from:
      # List of versions and version patterns that are eligible for upgrade.
      # Plain strings are exact matches; wrap in "/" for regex (e.g. "/v1\\..*/" matches all v1.x.x).
      - "v1.0.0"
    # The target version that resources will be upgraded to.
    to: "v2.0.0"
  # Optional. When set, SKE creates Upgrade Runs automatically on this schedule.
  # If omitted, you trigger the plan by creating an Upgrade Run manually.
  upgradeExecutionPolicy:
    # Cron expression for recurring execution (e.g. every Saturday at 23:00).
    repeatSchedule: "0 23 * * 6"
    # One-time execution datetime, formatted YYYY-MM-DDTHH:mm (no seconds or zone).
    executeAt: "2026-05-01T23:00"
    # Time zone applied to both repeatSchedule and executeAt.
    # It has to be a valid IANA Time Zone.
    timeZone: "Europe/London"
  rolloutGroups:
      # Identifier for this rollout group.
    - name: dev
      selectors:
        matchExpressions:
        - key: prod
          operator: NotIn
          values: ["true"]
        matchLabels:
        # Label selectors to determine which ResourceBindings belong to this group.
        # Selectors match against ResourceBinding labels.
          env: dev
      # Maximum number of resources upgraded concurrently. Accepts an integer or a percentage (e.g. "25%").
      maxConcurrent: 5
      # Optional. Defines the time windows where upgrades can start. If not
      # specified, upgrades can start at any time.
      resourceUpgradeWindows:
        - kind: allow
          schedule: "0 22 * * *"
          duration: "4h"
          timeZone: "Europe/London"
```

## Promise Reference

The `promiseRef` field references the Promise whose Resource Requests will be upgraded. The Promise must exist in the cluster.

```yaml
spec:
  promiseRef:
    name: redis
```

## Upgrade Path

The `upgradePath` field defines the versions this plan covers.
The `from` field is a list of versions and version patterns that are eligible for upgrade, and the `to` field is the target version.

Upgrade path that will upgrade resources of versions `v1.1.0` and `v1.1.2` to `v1.2.0`.
```yaml
spec:
  upgradePath:
    from:
      - "v1.1.0"
      - "v1.1.2"
    to: "v1.2.0"
```

Upgrade path that will upgrade resources of versions `v1.1.*` (all patch versions) to `v1.2.0`.
```yaml
spec:
  upgradePath:
    from:
      - "/v1\.1\..*/"
    to: "v1.2.0"
```

### Version Matching

By default, version strings in `from` are compared as exact matches. To use a regular expression, wrap the pattern in
forward slashes (`/`):

| Pattern | Type | Matches |
|---------|------|---------|
| `v1.0.0` | Exact match | Only `v1.0.0` |
| `/v1\\.0\\..*/` | Regex | `v1.0.0`, `v1.0.1`, `v1.0.10`, etc. |
| `/v1\\..*/` | Regex | Any version starting with `v1.` |

:::warning

Regex patterns are automatically anchored (matched against the full version string). Characters like `.` must be escaped
with `\\` to match a literal dot, otherwise they match any character.

:::

## Upgrade Execution Policy

The `upgradeExecutionPolicy` is optional and controls when SKE creates an Upgrade Run automatically. Set
`repeatSchedule`, `executeAt`, or both: `executeAt` fires once, `repeatSchedule` recurs, and the earliest future trigger
becomes [`status.nextRunAt`](#scheduling-status).

If `upgradeExecutionPolicy` is omitted, SKE does not create any Upgrade Runs for this plan. You can still execute the
plan by [creating an Upgrade Run manually](./upgrade-runs#manually-creating-an-upgrade-run).

```yaml
spec:
  upgradeExecutionPolicy:
    repeatSchedule: "0 23 * * 6"
    executeAt: "2026-05-01T23:00"
    timeZone: "Europe/London"
```

| Field | Description | Required |
|-------|-------------|----------|
| `repeatSchedule` | Cron expression (standard 5-field) for recurring execution | No |
| `executeAt` | One-time execution datetime, formatted `YYYY-MM-DDTHH:mm` (no seconds or zone suffix) | No |
| `timeZone` | IANA time zone used to evaluate both fields (e.g. `Europe/London`); defaults to UTC | No |

Automatically-created runs are named `<plan-name>-YYYYMMDD-HHMM` from the trigger time in UTC. So that a generated run
name stays within the Kubernetes 253-character limit, the name of a scheduled plan is limited to 229 characters.

If a schedule fires while a run for this plan is still `Pending` or `InProgress`, SKE suspends the active run and starts
a new one in its place. See [superseded runs](./upgrade-runs#superseded-runs).

## Rollout Groups

Rollout groups define ordered sets of resources to upgrade. Groups are processed sequentially and each group must complete
before the next begins.

```yaml
spec:
  rolloutGroups:
    - name: dev
      selectors:
        matchLabels:
          env: dev
      maxConcurrent: 5
      resourceUpgradeWindows:
        - kind: allow
          schedule: "0 22 * * *"
          duration: "4h"
          timeZone: "Europe/London"
```

At least one rollout group is required. A resource whose labels match more than one group's selectors is included in
each matching group. Rollout groups are not de-duplicated.

### Selectors

Selectors determine which resources belong to a rollout group. Selectors match against the labels on
resources. Both `matchLabels` and `matchExpressions` can be used, following the same semantics as Kubernetes
[label selectors](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#label-selectors).

```yaml
selectors:
  matchLabels:
    env: dev
  matchExpressions:
    - key: env
      operator: In
      values: ["staging", "dev"]
```

| Field | Description |
|-------|-------------|
| `matchLabels` | Key-value label pairs the Resource Binding must have |
| `matchExpressions` | Label selector requirements with operators (`In`, `NotIn`, `Exists`, `DoesNotExist`) |

Kratix copies the labels from a Resource Request onto its Resource Binding, so you can label either the Resource Request
or the Resource Binding directly.

:::tip

If `selectors` is omitted or empty, the rollout group matches no resources. You must explicitly define selectors to
include resources in a group.

:::

### Max Concurrent

The `maxConcurrent` field limits how many resources within a group are upgraded at the same time. It accepts either an
integer or a percentage string.

```yaml
maxConcurrent: 5       # At most 5 resources at a time
maxConcurrent: "25%"   # At most 25% of resources in the group at a time
```

A percentage accepts `"1%"` to `"100%"`. It is calculated against the number of resources in the group and rounded down
to a whole number, but is always at least one resource. If `maxConcurrent` is omitted, all resources in the group may
start together.

### Resource Upgrade Windows

Resource upgrade windows control when new upgrades may start for resources in a group. Each window has a `kind`
(`allow` or `deny`), a cron `schedule`, a `duration`, and a `timeZone`.

```yaml
resourceUpgradeWindows:
  - kind: allow
    schedule: "0 22 * * 6"
    duration: "4h"
    timeZone: "Europe/London"
```

| Field | Description |
|-------|-------------|
| `kind` | `allow` or `deny`: whether this window permits or blocks upgrades |
| `schedule` | When the window opens (standard 5-field cron, e.g. `"0 23 * * 6"`) |
| `duration` | How long the window stays open (e.g. `"2h"`, `"30m"`) |
| `timeZone` | IANA timezone for the schedule (e.g. `"Europe/London"`, `"UTC"`) |

If no windows are defined, upgrades are always permitted. The behaviour when windows are defined depends on which
kinds are present:

| Windows defined | Behaviour |
|-----------------|-----------|
| None | Always open |
| Allow only | Open during allow windows; denied outside them |
| Deny only | Open at all times except during deny windows |
| Allow and deny | Open during allow windows; deny takes precedence if both are active |

:::note

Windows only gate when new upgrades start. Resources already being upgraded are not interrupted when a window closes.

:::

## Status

The Upgrade Plan status reflects whether a run is currently active and summarises the most recent finished run. Rollout progress details live on the [Upgrade Run](./upgrade-runs), not on the plan.

```yaml
status:
  observedGeneration: 3
  phase: Available
  activeRunRef: ""
  # Timestamp of the next automatic run trigger.
  nextRunAt: "2026-05-29T23:00:00Z"
  # The scheduled trigger time that was last serviced.
  lastScheduledAt: "2026-05-22T23:00:00Z"
  lastRun:
    name: redis-v1-to-v2-run-001
    finishedAt: "2026-05-22T15:47:11Z"
    result: Failed
    reason: ResourceUpgradeFailed
    message: '1 resource(s) failed to upgrade in rollout group "dev"'
  conditions: []
```

### Phase

The `phase` field describes whether an upgrade is running now. It does **not** record whether the last run succeeded or failed; see [`lastRun`](#last-run) for that.

| Phase | Meaning |
|-------|---------|
| `Available` | No run is `Pending` or `InProgress`. The plan is idle. |
| `Running` | A run is `Pending` or `InProgress`. See `activeRunRef` for the run name. |

When a run finishes (`Completed`, `Failed`, or `Cancelled`), the plan returns to `Available`. The outcome is recorded in `lastRun`.

### Active run reference

`activeRunRef` is the name of the `Pending` or `InProgress` [Upgrade Run](./upgrade-runs) for this plan, if any. It is cleared when no run is active.

### Scheduling status

These fields are populated when the plan has an [`upgradeExecutionPolicy`](#upgrade-execution-policy):

| Field | Description |
|-------|-------------|
| `nextRunAt` | Timestamp of the next automatic run trigger. |
| `lastScheduledAt` | The scheduled trigger time that was last serviced. |

### Last run

`lastRun` is a sticky summary of the most recent terminal run. It is written when a run reaches `Completed`, `Failed`, or `Cancelled`, and is not cleared when the plan becomes idle.

| Field | Description |
|-------|-------------|
| `name` | Name of the Upgrade Run |
| `finishedAt` | When the run reached a terminal state |
| `result` | `Completed`, `Failed`, or `Cancelled` |
| `reason` | Copied from the run's `RunSucceeded` condition when present |
| `message` | Copied from the run's `RunSucceeded` condition when present |

Inspecting an Upgrade Plan:

| Question | Where to look |
|----------|---------------|
| Is an upgrade running now? | `phase == Running` and `activeRunRef` |
| When will it run next? | `nextRunAt` |
| Has this plan been executed? | `lastRun` is set |
| How did the last run end? | `lastRun.result` |

## Deleting an Upgrade Plan

When an Upgrade Plan is deleted, any Upgrade Runs that reference it will be cleaned up.

:::note

Deleting the referenced Promise does not delete the Upgrade Plan. The plan is only removed when you delete it
explicitly.

:::
