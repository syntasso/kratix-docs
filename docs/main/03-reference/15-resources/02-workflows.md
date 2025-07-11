---
description: Documentation for writing Resource Workflows using Kratix Pipelines, covering how Kratix internally executes the Pipeline containers
title: Resource Workflows
sidebar_label: Workflows
id: workflows
---

A Kratix Promise can define workflows that run for each Resource request made against it.

The `configure` workflow runs whenever a Resource is created, updated or reconciled, or when the parent Promise is updated.
The `delete` workflow runs when the Resource is deleted.

Use `spec.workflows.resource` to define these workflows as shown below.

See the [Workflows reference](../workflows) for pipeline details and other common behaviour.

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


