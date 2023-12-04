---
description: Documentation for writing Promise Workflows using Kratix Pipelines, covering how Kratix internally executes the Pipeline containers
title: Promise Workflows
sidebar_label: Workflows
---

# Workflows

Within a Kratix Promise, you can define two different workflow types:
`configure` and `delete`.

The `configure` workflow is executed when the Promise is created, updated, or
reconciled. The `delete` workflow is executed when the Promise is deleted.

To specify the Promise workflows, you should use the `workflows.promise` key in
the Promise definition:

```yaml
platform: platform.kratix.io/v1alpha1
kind: Promise
metadata:
  # ...
spec:
  # ...
  workflows:
    # lifecycle hook for Promise
    promise:
      # lifecycle hook for creates/updates/ongoing reconciliation of the Promise
      configure:
        -  # Pipeline definition
      # lifecycle hook for deletion of the Promise
      delete:
        -  # Pipeline definition
```

Check out the [Workflows documentation](../workflows) for more details.

## Running Workflows

The Workflows are regularly executed. Kubernetes reconciles on a number of
different actions including, but not limited to:

- On the creation of the Promise
- Regular interval (default: 10 hours, not currently configurable)
- Recreating or restarting the Kratix Controller
- A change to the Promise definition

All commands should be idempotent as there is a guarantee that they will be run
multiple times a day, and may be run much more frequently depending on other
environmental impacts like pod restarts.
