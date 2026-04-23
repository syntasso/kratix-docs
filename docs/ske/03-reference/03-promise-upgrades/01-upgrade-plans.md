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
apiVersion: ske.platform.syntasso.io/v1alpha1
kind: UpgradePlan
metadata:
  name: redis-v1-to-v2
spec:
  promiseRef:
    name: redis
    # Name of the Promise whose resources will be upgraded.
  upgradePath:
    from:
      - "v1.0.0"
      # List of versions and version patterns that are eligible for upgrade.
      # Plain strings are exact matches; wrap in "/" for regex (e.g. "/v1\\..*/" matches all v1.x.x).
    to: "v2.0.0"
    # The target version that resources will be upgraded to.
  upgradeExecutionPolicy:
    repeatSchedule: "0 23 * * 6"
    # Cron expression for recurring execution (e.g. every Saturday at 23:00).
    executeAt: "2026-05-01T23:00:00Z"
    # One-time execution datetime in RFC 3339 format.
    timeZone: "Europe/London"
    # Time zone applied to both repeatSchedule and executeAt.
    # It has to be a valid IANA Time Zone.
  rolloutGroups:
    - name: dev
      # Identifier for this rollout group.
      selectors:
        matchExpressions:
        - key: prod
          operator: NotIn
          values: ["true"]
        matchLabels:
          env: dev
        # Label selectors to determine which ResourceBindings belong to this group.
        # Selectors match against ResourceBinding labels.
      maxConcurrent: 5
      # Maximum number of resources upgraded concurrently. Accepts an integer or a percentage (e.g. "25%").
      resourceUpgradeWindows:
        - kind: allow
          window: "0 1-7 * * *"
          timeZone: "Europe/London"
          # Cron-based time window that allows upgrades during hours 1-7 UTC.
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

The `upgradeExecutionPolicy` controls when the upgrade executes. At least one of `repeatSchedule` or `executeAt` must be
set. Both may be set simultaneously — `executeAt` fires once while `repeatSchedule` recurs.

```yaml
spec:
  upgradeExecutionPolicy:
    repeatSchedule: "0 23 * * 6"
    executeAt: "2026-05-01T23:00:00Z"
    timeZone: "Europe/London"
```

| Field | Description | Required |
|-------|-------------|----------|
| `repeatSchedule` | Cron expression for recurring execution | At least one of `repeatSchedule` or `executeAt` |
| `executeAt` | One-time execution datetime (RFC 3339) | At least one of `repeatSchedule` or `executeAt` |
| `timeZone` | Time zone for schedule evaluation (e.g. `Europe/London`) | No |

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
          window: "0 1-7 * * *"
          timeZone: "Europe/London"
```

At least one rollout group is required.

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
  matchNamespaces:
    - default
```

| Field | Description |
|-------|-------------|
| `matchLabels` | Key-value label pairs that ResourceBindings must have |
| `matchExpressions` | Label selector requirements with operators (`In`, `NotIn`, `Exists`, `DoesNotExist`) |
| `matchNamespaces` | Restricts selection to resources in the listed namespaces | TODO: this is not implemented yet; placeholder for now

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

### Resource Upgrade Windows

Resource upgrade windows define cron-based time windows that gate when upgrades may proceed for resources in the group.
Each window has a `kind` (either `allow` or `deny`) and a `window` cron expression.

```yaml
resourceUpgradeWindows:
  - kind: allow
    window: "0 1-7 * * *"
    timeZone: "Europe/London"
  - kind: deny
    window: "0 0 25 12 *"
    timeZone: "Europe/London"
```

At least one resource upgrade window is required per rollout group.

| Field | Description | Required |
|-------|-------------|----------|
| `kind` | `allow` or `deny` — whether this window permits or blocks upgrades | Yes |
| `window` | Cron expression defining when this rule applies | Yes |
| `timeZone` | Time zone for the window schedule | Yes |

## Deleting an Upgrade Plan

When an Upgrade Plan is deleted, any Upgrade Runs that reference it will be cleaned up.
