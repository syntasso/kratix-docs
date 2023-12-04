---
description: Documentation for writing Promise Workflows using Kratix Pipelines, covering how Kratix internally executes the Pipeline containers
title: Resource Workflows
sidebar_label: Workflows
id: workflows
---

# Workflows

Within a Kratix Promise, you can define two different workflow types:
`configure` and `delete`.

The `configure` workflow is executed when a Resource is created, updated, or
reconciled. The `delete` workflow is executed when the Resource is deleted.

To specify the Resource workflows, you should use the `workflows.resource` key
in the Promise definition:

```yaml
platform: platform.kratix.io/v1alpha1
kind: Promise
metadata:
  # ...
spec:
  # ...
  workflows:
    # lifecycle hook for Resources
    resource:
      # lifecycle hook for creates/updates/ongoing reconciliation of Resources
      configure:
        -  # Pipeline definition
      # lifecycle hook for deletion of Resources
      delete:
        -  # Pipeline definition
```

Check out the [Workflows documentation](../workflows) for more details.

## Running Workflows

The Workflows are regularly executed on each Resource. Kubernetes reconciles on
a number of different actions including, but not limited to:

- On the creation of a new Resource
- Regular interval (default: 10 hours, not currently configurable)
- Recreating or restarting the Kratix Controller
- A change to the Resource definition

All commands should be idempotent as there is a guarantee that
they will be run multiple times a day, and may be run much more frequently
depending on other environmental impacts like pod restarts.
