---
title: Observability
sidebar_label: Observability
description: How to observe Kratix through logs, metrics, traces, and status.
id: observability
keywords: [observability, tracing, open telemetry, logging, logs, probes]
---

# Observability

## What to observe

- **Controller manager:** reconciliation decisions, scheduling, and workflow
  orchestration for Promises and Resources.
- **Workflows:** pipeline Jobs/Pods for Promise and Resource workflows.
- **CRD status and events:** conditions and status fields for Promises, Resources,
  Work, and WorkPlacement.
- **Health Records:** CRDs that drive health status updates on Resources.

## Logs

Kratix logs are emitted by the controller manager and by workflow pipeline pods.
The controller manager runs in the `kratix-platform-system` namespace. You can
control log verbosity and format via the `logging` settings in the
[Kratix Config](/main/reference/kratix-config/config).

When `structured` logging is enabled, the controller emits JSON logs so you can
parse and route logs programmatically. Example:

```json
{"level":"info","ts":"2025-05-07T15:46:59Z","logger":"controllers.Promise","msg":"reconciliation finished","controller":"promise","name":"webapp","generation":1,"severity":"info","duration":0.023759875}
```

Common fields to expect:

- `ts`: RFC3339 timestamp.
- `level`/`severity`: log level (info, warning, debug, trace).
- `logger`: source logger (often controller-specific).
- `msg`: human-readable message.
- `controller`: controller name (e.g. `promise`, `resource`).
- `name`/`namespace`: object identifiers (when applicable).
- `generation`: object generation reconciled.
- `duration`: operation duration in seconds.

When `structured` logging is disabled, logs are emitted as human-readable text.

For workflow logs and common investigation steps, see
[Troubleshooting](/main/troubleshooting).

## Probes

The controller manager Deployment configures liveness, readiness, and startup
probes. Inspect them with:

```bash
kubectl -n kratix-platform-system describe deployment kratix-platform-controller-manager
```

- **Readiness probe:** if it fails, the pod is marked NotReady and Kubernetes
  stops routing traffic to it (e.g. Services remove the endpoint). Readiness can
  fail when the controller manager cannot serve its readiness endpoint, such as
  during startup or when the API client/cache is unhealthy.
- **Liveness probe:** if it fails, Kubernetes restarts the pod.
- **Startup probe:** gates liveness/readiness checks during startup; repeated
  failures cause a restart.

## Metrics

Kratix exposes a Prometheus-compatible `/metrics` endpoint via the
`kratix-platform-controller-manager-metrics-service` Service in the
`kratix-platform-system` namespace. The metrics follow the default Kubebuilder
controller metrics set; see the
[Kubebuilder metrics reference](https://book.kubebuilder.io/reference/metrics-reference.html)
for details.

Metrics worth watching early:

- `controller_runtime_reconcile_errors_total`: reconciliation errors by controller.
- `controller_runtime_reconcile_time_seconds`: time per reconciliation.
- `workqueue_depth`: queue depth for reconcile work.
- `workqueue_retries_total`: retries on reconcile items.
- `rest_client_requests_total`: API request volume and errors by status code.

To scrape metrics with Prometheus, follow the metrics collection steps in the
installing guides for your platform:

- [AKS](/main/guides/installing-kratix-AKS#configuring-metrics-collection)
- [EKS](/main/guides/installing-kratix-EKS#configuring-metrics-collection)
- [GKE](/main/guides/installing-kratix-GKE#configuring-metrics-collection)
- [OpenShift](/main/guides/installing-kratix-openshift#configuring-metrics-collection)
- [Other Kubernetes](/main/guides/installing-kratix-others#configuring-metrics-collection)

We are keen to hear which additional metrics would be useful in your environment.

## Tracing (OpenTelemetry)

Kratix can export OpenTelemetry data when `telemetry` is enabled in the
[Kratix Config](/main/reference/kratix-config/config). Configure the endpoint and
protocol to send data to your collector.

OpenTelemetry support is a newly released feature; we would love feedback and
guidance on what signals and spans you would expect from Kratix.

## Status, conditions, and events

Kratix surfaces workflow progress and outcomes via status conditions on Resources
and related CRDs. Pipelines can also write status data back to Resources. See:

- [Resource Status and Events](/main/reference/resources/resource-status-events)
- [Promise Status and Events](/main/reference/promises/promise-status-events)

Use `kubectl describe` and `kubectl get -o yaml` to inspect conditions and events
while debugging.

## Health checks

Health checks are represented by the `HealthRecord` CRD, which Kratix uses to
update the Resource Request status with health information.

- [Health Record reference](/main/reference/healthrecord)
- [Surfacing health information](/main/guides/resource-health)
