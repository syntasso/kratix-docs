---
description: Documentation for writing Promise Workflows using Kratix Pipelines, covering how Kratix internally executes the Pipeline containers
title: Promise Workflows
sidebar_label: Workflows
---

A Kratix Promise can define two workflows for itself: `configure` and `delete`.

The `configure` workflow runs whenever the Promise is created, updated, or reconciled.
The `delete` workflow runs when the Promise is removed.

Use `spec.workflows.promise` to define these workflows as shown below.

See the [Workflows reference](../workflows) for pipeline details and other common behaviour.

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

