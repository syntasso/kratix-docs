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
