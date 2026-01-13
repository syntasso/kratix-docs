---
description: Configuring Kratix via the Config
title: Kratix Config
id: config
---

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

    # Number of old successful pipeline pods to keep. Default is 5
    numberOfJobsToKeep: 1

    # Selective cache for Secrets to limit memory usage. Please ensure Secrets used by Kratix are
    # created with label: app.kubernetes.io/part-of=kratix. Default is false.
    selectiveCache: false

    # interval in which the Kratix runs the Promises/Resources workflows
    reconciliationInterval: "10h"
    # Timeout configuration of controller's leader election.

    controllerLeaderElection:
      leaseDuration: 15s
      renewDeadline: 10s
      retryPeriod: 2s

    workflows:
      jobOptions:
        # Number of times Kubernetes retries a failing workflow Job before marking it failed.
        # Kratix does not set a default for this field, so Kubernetes uses its own
        # Job default (6) if it is omitted.
        defaultBackoffLimit: 4
      defaultImagePullPolicy: # can be `IfNotPresent`, `Always`, or `Never`
      defaultContainerSecurityContext:
        # Security context fields, e.g.:
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
