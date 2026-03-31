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
      defaultImagePullPolicy: IfNotPresent # can be `IfNotPresent`, `Always`, or `Never`
      defaultContainerSecurityContext:
        runAsNonRoot: false
    logging:
      level: "info" # one of info, warning, debug, trace
      structured: false # if true, emit logs as json
    telemetry:
      traces: true # false to disable traces
      metrics: true # false to disable metrics
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

Enable label selector caching of Secrets on the cluster to optimise memory usage. Secrets used by Kratix must be labelled with app.`kubernetes.io/part-of=kratix`.

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

#### defaultImagePullPolicy

When to pull the images specified in Workflows. This configures the [imagePullPolicy](https://kubernetes.io/docs/concepts/containers/images/#updating-images) in Workflow Jobs. Can be `IfNotPresent`, `Always`, or `Never`

#### defaultContainerSecurityContext

The [Security Context](/main/reference/workflows#security-context) to apply to all Workflow Pods.

### logging

Logging configuration for the Kratix Controller Manager pod logs.

#### level (default: "info")

The log level. Can be "info", "warning", "debug" or "trace".

The different log levels and their meanings are described in the table below:

| Level / Severity | Target Audience           | Usage Guidelines                                                                                                                     | Examples                                                                                                     |
|------------------|-------------------|--------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------|
| ERROR            | All               | <ul><li>Something is permanently broken and may require human intervention</li></ul>                                                                   | <ul><li>Invalid YAMLs</li><li>Can't talk to Git server</li><li>Invalid Bucket endpoints</li></ul>                                        |
| WARNING          | All               | <ul><li>Something is temporarily broken but may fix itself within the Reconciliation loop</li></ul>                                                    | <ul><li>Promise is unavailable</li><li>State Store secret not found</li><li>No available destinations</li></ul>                          |
| INFO             | Platform Operator | <ul><li>Heartbeat of the platform</li><li>Reconciliation-level logs</li><li>Business relevant actions completed</li><li>A resource status has changed</li></ul> | <ul><li>Reconciliation started and ended</li><li>Scheduling work to a destination</li><li>Next reconciliation time</li></ul>            |
| DEBUG            | Platform Operator / Platform Engineer | <ul><li>Function-level logs</li><li>Transitional errors</li><li>Code actions completed</li></ul>                                                             | <ul><li>Applying the Promise API</li><li>Running a Pipeline for a Resource</li><li>Creating a WorkPlacement</li></ul>                    |
| TRACE            | Kratix Developer  | <ul><li>Pre and Post actions</li><li>Used to identify a particular line/area of code</li></ul>                                                            | <ul><li>Creating auxiliary resources</li><li>Verifying if there's a pipeline in progress</li><li>Calculating Promise Spec hash</li></ul> |


#### structured (default: false)

Set to true to emit logs as json.

### telemetry

Telemetry configuration for Kratix.

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
