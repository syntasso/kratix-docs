---
description: Documentation for writing Resource Workflows using Kratix Pipelines, covering how Kratix internally executes the Pipeline containers
title: Resource Workflows
sidebar_label: Workflows
id: workflows
---

A Kratix Promise may contain workflow definitions for hooking into the lifecycle of any
Resource Requests made against the Promise.

Kratix supports two Resource workflow types: `configure` and `delete`.

- The `configure` workflow runs when the Resource is created, updated or reconciled, or
  when the parent Promise is updated.
- The `delete` workflow runs when the Resource is deleted.

Kratix workflows are made up of one or more Pipelines.

- The `configure` workflow may contain multiple Pipelines, which are executed serially.
- The `delete` workflow can only contain a single Pipeline.

Refer to the [Workflows documentation](../workflows) for detailed information on **how to
write Kratix Pipelines**.

To define Resource workflows inside a Promise, use `spec.workflows.resource` in the
Promise definition as shown below.

```yaml
platform: platform.kratix.io/v1alpha1
kind: Promise
metadata:
  ...
spec:
  ...
  workflows:
    resource:
      configure:
        - # Pipeline definitions (multiple)
      delete:
        - # Pipeline definition (single)
```


## Configure Workflows

The `configure` workflow runs when the Resource is created, updated or reconciled, or
when the parent Promise is updated.

### Multiple Pipelines

Resource Configure workflows allow for **multiple** Pipelines to be executed in
sequence.

This enables step-by-step configuration of declarative state, as each Pipeline
ends by writing its output to the Kratix State Store. This means each Pipeline can depend
upon state declared during all previous Pipelines.

Within each Pipeline, an array of containers are defined, which will also execute in
sequence.

:::info

For simple cases, a single Pipeline with one or many containers will suffice.

:::

The example below shows how a `resource.configure` workflow can be defined:

```yaml
platform: platform.kratix.io/v1alpha1
kind: Promise
metadata:
  ...
spec:
  ...
  workflows:
    resource:
      configure:
        - apiVersion: platform.kratix.io/v1alpha1
          kind: Pipeline
          metadata:
            name: pipeline-a # Executes first
          spec:
            ...
        - apiVersion: platform.kratix.io/v1alpha1
          kind: Pipeline
          metadata:
            name: pipeline-b # Follows pipeline-a
          spec:
            ...
```

In this example, `pipeline-a` will run first, followed by `pipeline-b`.

### Pipeline Failures

A Pipeline fails if any of its `containers` return a non-zero exit code.

If this occurs, the workflow **halts**: no further containers are executed within the
Pipeline, and no further Pipelines are executed in the workflow.

To re-run a workflow following a Pipeline failure, you can perform a
[manual reconciliation](/main/learn-more/controlling-with-labels) of the Resource, which will trigger the
workflow again from the beginning.

### Idempotency

All commands which run in Configure workflows must be idempotent, as there is a guarantee
that they will be run multiple times a day, and may be run much more frequently depending
on other environmental impacts (e.g. Pod restarts).

The `resource.configure` workflow is regularly executed. Kubernetes reconciles on a number
different actions, including, but not limited to:

- Resource creation
- Kratix Controller restarts
- Changes to the Resource definition
- Changes to the Promise definition

In addition to the above, Kratix will reconcile on a regular cadence (10 hours by 
default, [configurable](/main/reference/kratix-config/config)) to attempt to
mitigate against any drift that may have occurred. During this reconciliation,
Kratix will ensure that all the Workflows for a given resource are re-run.

## Delete Workflows

Resource Delete workflows are triggered when a Resource is deleted, and currently only
support a **single** Pipeline.

This Pipeline is responsible for cleaning up resources and configurations that were set up
by the `resource.configure` workflow.

The example below shows how a `resource.delete` workflow can be defined.

```yaml
platform: platform.kratix.io/v1alpha1
kind: Promise
metadata:
  ...
spec:
  ...
  workflows:
    resource:
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

Kratix will create a single Delete Pipeline Job when deletion is initiated. If a failure occurs
within a pod created by the Job, new pods for the Job will continue to be created until the
`backoffLimit` for the Job has been reached and the Job fails. Kratix will not attempt to
create any additional Delete Pipeline Job after this point and the Resource deletion will not complete without
further intervention.

Kratix will create a new Pipeline Job when:

- The Resource or Promise is updated
- A [Manual Reconciliation](/main/learn-more/controlling-with-labels#manual-reconciliation)
is triggered

This means that if the failing Pipeline Job can be fixed by applying an update to the Promise,
this change can be applied to the Promise and a Delete Job reflecting this change will run.

If a command intermittently fails during container execution, this should be handled **within
the container itself** (including any retry attempts). This reduces the risk of such
commands causing the delete pipeline pod, and eventually the Job as whole, to fail.
