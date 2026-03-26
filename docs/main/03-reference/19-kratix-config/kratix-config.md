---
description: Configuring Kratix
title: Configuring Kratix
id: config
---

Kratix can be configured and customised via two ConfigMaps; Kratix Config and Kratix Pipeline Adapter Config.

## Kratix Config

When Kratix starts, it reads the `kratix` `ConfigMap` from the
`kratix-platform-system` namespace. This `ConfigMap` allow you to configure
various parts of Kratix and follows the format outlined below. It is loaded when
the `kratix-platform-controller-manager` pod starts within the same namespace.

If any changes are made to the `ConfigMap`, you will need to restart the
`kratix-platform-controller-manager` pod to apply the updated configuration.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: kratix
  namespace: kratix-platform-system
data:
  config: |
    numberOfJobsToKeep: 5
    selectiveCache: false
    reconciliationInterval: "10h"
    controllerLeaderElection:
      leaseDuration: 15s
      renewDeadline: 10s
      retryPeriod: 2s
    workflows:
      jobOptions:
        defaultBackoffLimit: 6
        podTTLSecondsAfterFinished: 3600 # seconds to keep completed Job Pods before cleanup; omit to use Kubernetes default
      defaultImagePullPolicy: IfNotPresent # can be `IfNotPresent`, `Always`, or `Never`
      defaultContainerResources: # optional; default CPU/memory requests and limits for pipeline containers
        requests:
          cpu: "100m"
          memory: "128Mi"
        limits:
          cpu: "200m"
          memory: "256Mi"
      defaultContainerSecurityContext:
        runAsNonRoot: false
      defaultContainerResources:
        requests:
          cpu: "100m"
          memory: "128Mi"
          ephemeral-storage: "256Mi"
        limits:
          cpu: "200m"
          memory: "256Mi"
          ephemeral-storage: "256Mi"
    logging:
      level: "info" # one of info, warning, debug, trace
      structured: false # if true, emit logs as json
    telemetry:
      traces:
        enabled: true # false to disable traces
      metrics:
        enabled: true # false to disable metrics
      endpoint: grafana-k8s-monitoring-alloy-receiver.default.svc.cluster.local:4317 # exporter endpoint
      protocol: grpc # or http
      insecure: true
      headers: # additional headers if required
        authorization: "Bearer <grafana-api-token>"
    featureFlags:
      promiseUpgrade: false # enable/disable promise revisions
```

### numberOfJobsToKeep (default: 5)

The total number of completed Kratix workflow jobs to keep in the cluster. The oldest jobs will be deleted as new jobs are created.

### selectiveCache (default: false)

Enable label selector caching of Secrets on the cluster to optimise memory usage. Secrets used by Kratix must be labelled with `app.kubernetes.io/part-of=kratix`.

### reconciliationInterval (default: 10h)

The interval on which Kratix will re-run the Workflows for both Promises and Resources.

### controllerLeaderElection

Timeouts for the kratix controller's leader election. Defaults:

- leaseDuration: 15s
- renewDeadline: 10s
- retryPeriod: 2s

### Workflows

Default configurations for Kratix Workflows. Any options configured within individual workflows will take precedence over those in the Kratix Config.

#### jobOptions

Options for the Jobs that are created by Kratix Workflows.

##### defaultBackoffLimit

The number of times to retry a failing workflow Job before marking it failed. This configures the [backoffLimit](https://kubernetes.io/docs/concepts/workloads/controllers/job/#pod-backoff-failure-policy) in Workflow Jobs. This will default to the Kubernetes Job default of 6.

##### podTTLSecondsAfterFinished

The number of seconds to retain completed workflow Job Pods before they are cleaned up. When set, Kratix runs a controller that deletes Pods belonging to completed Jobs after this TTL. Omit to use the Kubernetes default (Pods are retained until the Job is deleted). Must be greater than zero when set.

#### defaultContainerResources

Default CPU and memory requests and limits for pipeline containers. Pipeline-level `resources` override these defaults. When omitted, Kratix uses built-in defaults (100m/128Mi requests, 200m/256Mi limits).

#### defaultImagePullPolicy

When to pull the images specified in Workflows. This configures the [imagePullPolicy](https://kubernetes.io/docs/concepts/containers/images/#updating-images) in Workflow Jobs. Can be `IfNotPresent`, `Always`, or `Never`

#### defaultContainerSecurityContext

The [Security Context](/main/reference/workflows#security-context) to apply to all Workflow Pods.

#### defaultContainerResources

Defines the resource requirements that Workflow Jobs should default to. This controls the `spec.resources` for the generated pods.

### logging

Logging configuration for the Kratix Controller Manager pod logs.

#### level (default: "info")

The log level. Can be "info", "warning", "debug" or "trace"

#### structured (default: false)

Set to true to emit logs as json.

### telemetry

Telemetry configuration for Kratix. Configures OpenTelemetry export for traces and metrics.

- **endpoint**: OTLP exporter endpoint (e.g. `grafana-k8s-monitoring-alloy-receiver.default.svc.cluster.local:4317`).
- **protocol**: OTLP protocol; `grpc` (default) or `http`.
- **insecure**: Set to `true` to skip TLS verification when connecting to the endpoint.
- **headers**: Optional map of headers (e.g. `authorization: "Bearer <token>"`) for authenticated endpoints.
- **traces.enabled**: Set to `false` to disable trace export. Defaults to `true` when telemetry is configured.
- **metrics.enabled**: Set to `false` to disable metrics export. Defaults to `true` when telemetry is configured.

### featureFlags

Enable Kratix features. These are disabled by default.

#### promiseUpgrade (default: false)

Enable the use of Promise Revision and Resource Bindings to manage Resource upgrades.

## Kratix Pipeline Adapter Config

When Kratix schedules work as part of either Promise or Resource workflows,
by default, it uses the `PIPELINE_ADAPTER_IMG` image specified in the
`kratix-platform-pipeline-adapter-config` configmap in the `kratix-platform-system` namespace. To
override this image, which is necessary when deploying Kratix in an air-gapped
environment, you can update this configmap to point to an internally hosted
version of the image.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: kratix-platform-pipeline-adapter-config
  namespace: kratix-platform-system
...
//highlight-start
data:
  PIPELINE_ADAPTER_IMG: org-registry.org/team/kratix-platform-pipeline-adapter:v0.2.0
//highlight-end
```
