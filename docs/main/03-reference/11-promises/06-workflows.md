---
description: Documentation for writing Promise Workflows using Kratix Pipelines, covering how Kratix internally executes the Pipeline containers
title: Promise Workflows
sidebar_label: Workflows
---

A Kratix Promise may contain workflow definitions for hooking into the Promise lifecycle.

Kratix supports two Promise workflow types: `configure` and `delete`.

- The `configure` workflow runs when the Promise is created, updated, or reconciled.
- The `delete` workflow runs when the Promise is deleted.

Kratix workflows are made up of one or more Pipelines.

- The `configure` workflow may contain multiple Pipelines, which are executed serially.
- The `delete` workflow can only contain a single Pipeline.

Refer to the [Workflows documentation](../workflows) for details on **how to
write Kratix Pipelines**.

To define Promise workflows inside a Promise, use `spec.workflows.promise` in the Promise
definition as shown below.

```yaml
platform: platform.kratix.io/v1alpha1
kind: Promise
metadata:
  ...
spec:
  ...
  workflows:
    promise:
      configure:
        - # Pipeline definitions (multiple)
      delete:
        - # Pipeline definition (single)
```

## Configure Workflows

The `configure` workflow runs when the Promise is created, updated, or reconciled.

### Multiple Pipelines

Promise Configure workflows allow for **multiple** Pipelines to be executed in sequence.

This enables step-by-step configuration of declarative state, as each Pipeline ends by
writing its output to the Kratix State Store. This means each Pipeline can depend upon
state declared during the previous Pipelines.

Within each Pipeline, an array of containers are defined, which will also execute in
sequence.

:::info

For simple cases, a single Pipeline with one or many containers will suffice.

:::

The example below shows how a `promise.configure` workflow can be defined:

```yaml
platform: platform.kratix.io/v1alpha1
kind: Promise
metadata:
  ...
spec:
  ...
  workflows:
    promise:
      configure:
        - apiVersion: platform.kratix.io/v1alpha1
          kind: Pipeline
          metadata:
            name: pipeline-a # Executes first
          spec:
            containers:
              ...
        - apiVersion: platform.kratix.io/v1alpha1
          kind: Pipeline
          metadata:
            name: pipeline-b # Follows pipeline-a
          spec:
            containers:
              ...
```

In this example, `pipeline-a` will run first, followed by `pipeline-b`.

### Pipeline Failures

A Pipeline fails if any of its `containers` return a non-zero exit code.

If this occurs, the workflow **halts**: no further containers are executed within the
Pipeline, and no further Pipelines are executed in the workflow.

To re-run a workflow following a Pipeline failure, you can perform a
[manual reconciliation](#manual-reconciliation) of the Promise, which will trigger the
workflow again from the beginning.

### Idempotency

All commands which run in Configure workflows must be idempotent, as there is a guarantee
that they will be run multiple times a day, and may be run much more frequently depending
on other environmental impacts (e.g. Pod restarts).

The `promise.configure` workflow is regularly executed. Kubernetes reconciles on a number
different actions, including, but not limited to:

- Promise creation
- Regular interval (10 hours, not currently configurable)
- Kratix Controller restarts
- Changes to the Promise definition

In addition to the above, the Kratix Promise Controller will reconcile on a 10 hour cadence to
attempt to mitigate against any drift that may have occurred. During this reconciliation,
the controller will ensure that all of the the Workflows for a given promise are re-run.

:::note

This reconciliation will not ensure that unchanged documents are re-written to the
state store. The reconciliation between workflow outputs and the statestore is
currently only triggered on change. For example, if a file has been deleted from your
GitStateStore, but the outputs from your workflow have not changed, this will
not be rewritten. This will be delivered in
[issue #254](https://github.com/syntasso/kratix/issues/254) if you would like to
follow along progress or share your requirements.

:::

As this reconciliation is managed by the Promise Controller, restarts of the Kratix Controller
Manager may disrupt the regularity of this cadence meaning that the reconciliation interval
may be greater than the expected 10 hours.

### Manual Reconciliation

Sometimes you may wish to manually trigger a Configure workflow for a specific Promise.

In addition to the standard triggers outlined above, a Promise can be manually triggered
for reconciliation by labelling it as follows:

```yaml
kratix.io/manual-reconciliation: "true"
```

This will trigger the Promise Configure workflow to run.

This workflow instance will terminate any in-progress Promise Configure workflow and start
again from the first Pipeline.

Once Kratix schedules the manual workflow, the label will be removed, allowing you to add
it again for any additional manual runs.

See below for an example command to trigger a manual reconciliation of a `redis` Promise.

```
kubectl label promises.platform.kratix.io redis kratix.io/manual-reconciliation=true
```

## Delete Workflows

Promise Delete workflows are triggered when a Promise is deleted, and currently only
support a **single** Pipeline.

This Pipeline is responsible for cleaning up resources and configurations that were set up
by the `promise.configure` workflow.

The example below shows how a `promise.delete` workflow can be defined.

```yaml
platform: platform.kratix.io/v1alpha1
kind: Promise
metadata:
  ...
spec:
  ...
  workflows:
    promise:
      delete:
        - apiVersion: platform.kratix.io/v1alpha1
          kind: Pipeline
          metadata:
            name: delete-pipeline # Single pipeline
          spec:
            containers:
              ...
```

### Pipeline Failures

Kratix will trigger the Delete Pipeline exactly once.

If a command fails during container execution, this must be handled **within the container
itself** (including any retry attempts).

Kratix will not automatically reschedule/retry any Pipelines which have failed as part of a Delete
workflow.

### Manual Reconciliation

After a Promise has been marked for deletion, you can manually trigger the
Delete workflow (e.g. to re-run the workflow after a pipeline failure) by
labelling the Promise as follows:

```yaml
kratix.io/manual-reconciliation: "true"
```

This will re-run the Promise Delete workflow immediately, terminating any
workflow that may be in progress.

Once Kratix schedules the manual workflow, the label will be removed, allowing you to add
it again for any additional manual runs.

See below for an example command to trigger a manual reconciliation of a `redis` Promise.

```
kubectl label promises.platform.kratix.io redis kratix.io/manual-reconciliation=true
```
