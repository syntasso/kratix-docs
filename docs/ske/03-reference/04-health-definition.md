---
description: Documentation for the Health Definition Custom Resource
title: Health Definition
sidebar_label: Health Definition
id: healthdefinition
---

# Health Definition

The Health Definition Custom Resource Definition (CRD) is the outline of a task that will be performed on a
Destination to verify the health of a Resource Request.

```yaml
apiVersion: platform.kratix.io/v1alpha1
kind: HealthDefinition
metadata:
  name: healthdefinition
  namespace: default
spec:
  # A reference to the Resource Request the Health Check should be performed against
  resourceRef:
    name: request-name
    namespace: default
  # A reference the Promise the Health Check should be performed against
  promiseRef:
    name: promise-name
  # Set by Kratix when it writes the HealthDefinition to the Destination. For
  # a Promise without the kratix.io/promise-version label Kratix does not set
  # it, and any value the Pipeline wrote stays.
  promiseVersion: v2.0.0
  # The time or interval the check should run against
  # This can follow Cron syntax or macros such as @hourly
  schedule: "* * * * *"
  # The definition of the Resource the check will be performed against
  input: |
    apiVersion: mypromise.org/v1
    kind: someservice
    metadata:
        name: someservice
        namespace: default
    spec:
        example: data
    status:
        url: test.com
  # The task to be performed on the destination
  workflow:
    # A Pipeline that runs an ordered set of OCI compliant images to perform health checks
    apiVersion: platform.kratix.io/v1alpha1
    kind: Pipeline
    metadata:
      name: health
    spec:
      containers:
        - image: ghcr.io/myorg/health-check
          name: health
```

## Promise version

A HealthDefinition created by a Resource Configure workflow belongs to one
version of the Promise. Kratix sets `spec.promiseVersion` on it before writing
it to the Destination, overwriting any value the workflow set.
This does not happen for an unversioned Promise, that is, one without the
`kratix.io/promise-version` label.

Kratix also records on the Resource's `status.healthStatus` which Promise
version it expects health results for, and how many HealthDefinitions the
Configure workflow wrote. Results for earlier Promise versions are kept. See the
[health checks guide](/main/guides/resource-health) for more information.

:::warning

When a HealthDefinition is created outside the Resource Configure workflow, for
example applied straight to a Destination or produced by another controller,
Kratix does **not** set `spec.promiseVersion` on it. Set it yourself when you
create the HealthDefinition, so that its results can be matched to a Promise
version. Every workflow container has the value in `KRATIX_PROMISE_VERSION`.

A HealthDefinition without `spec.promiseVersion` still produces health records.
They show in the Resource's `status.healthStatus` and count towards `state`,
but they never move the `HealthChecksSucceeded` condition.

A HealthDefinition you stamp yourself counts towards the condition only when the
Configure workflow for that Promise version also wrote at least one
HealthDefinition and it has reached a Destination. When the Configure workflow
wrote none, the condition is `True` with reason `NoHealthChecks` whatever your
HealthDefinition reports. When it did write one:

- An unhealthy result at the expected version makes the condition `False` with
  reason `Unhealthy`.
- The platform never waits for it. `expectedRecords` counts only the
  HealthDefinitions the Configure workflow wrote and the Destinations they
  reached. If your HealthDefinition is removed, the Health Agent deletes its
  record and nothing stalls. If your check stops running, its last record
  stays: a record that stopped at unhealthy keeps the condition `False` until
  the record is deleted.
- The platform counts records at the expected version; it does not match them
  to the HealthDefinitions it expects. A healthy record from a HealthDefinition
  you stamped yourself can therefore take the place of one the Configure
  workflow shipped, and the condition can become `True` before that check has
  reported.

:::

### How the SKE Health Agent carries the version

The SKE Health Agent copies `spec.promiseVersion` onto the HealthState it
writes on the Destination (`data.promiseVersion`), and from there onto the
HealthRecord it writes to the state store. The version on a result is the
version of the HealthDefinition the check run was built from. A run that
started before the HealthDefinition changed reports the old version, including
when the run fails. A HealthDefinition without `spec.promiseVersion` produces
results without one. When a run fails and its Job has already been cleaned up,
the unhealthy result has no version either.

A check reports for a new version only after its first run under that version,
and a version change does not trigger a run. The check's `schedule` therefore
sets how long a Resource waits at `WaitingForRecords` after an upgrade.

## Namespace

The Health Agent creates the `CronJob` — along with the `ServiceAccount` and RBAC it needs — in the
**same namespace as the `HealthDefinition`**, and the Health Check runs there. This is independent
of `spec.resourceRef.namespace`, which identifies the Resource being checked and may live in a
different namespace.

## Security context

The Health Agent runs each Health Check as a Kubernetes `CronJob`, and the pods it generates are
**non-root by default**:

- the pod is given a pod-level `securityContext` of `runAsNonRoot: true` and
  `seccompProfile.type: RuntimeDefault`, which every container inherits;
- the containers the agent injects (its `reader` and `health-state-creator`) are fully hardened
  with `allowPrivilegeEscalation: false`, `capabilities.drop: ["ALL"]`, `runAsNonRoot: true` and
  `seccompProfile.type: RuntimeDefault`.

This lets Health Checks run on clusters that mandate `runAsNonRoot` (for example a Gatekeeper
policy or the `restricted` Pod Security Standard) without any extra configuration, as long as your
own workflow image can run as a non-root user.

### Overriding the default per container

Your workflow containers inherit the non-root default, but you can override it per container via
`spec.workflow.spec.containers[].securityContext`. The agent passes whatever you declare through
unchanged.

You **must** override when your workflow image runs as root (many general-purpose utility images,
such as `ghcr.io/syntasso/kratix-pipeline-utility`, do). Otherwise the kubelet refuses to start the
container under the non-root default and the Health Check never runs. Which override you use
depends on the cluster:

- **Where non-root is mandatory** (Gatekeeper / `restricted` Pod Security Standard) — run as a
  non-root user by setting `runAsUser` to a non-zero UID. These policies reject
  `runAsNonRoot: false`.

  ```yaml
  workflow:
    spec:
      containers:
        - image: bitnami/kubectl
          name: health
          securityContext:
            runAsNonRoot: true
            runAsUser: 65534 # "nobody"
            runAsGroup: 65534 # "nogroup"
  ```

- **Where root is permitted** (for example a local cluster with no admission policy) — opt out of
  the non-root default:

  ```yaml
  workflow:
    spec:
      containers:
        - image: ghcr.io/syntasso/kratix-pipeline-utility:v0.0.1
          name: health
          securityContext:
            runAsNonRoot: false
  ```
