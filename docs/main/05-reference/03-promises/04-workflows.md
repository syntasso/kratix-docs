---
description: Documentation for writing Promise Workflows using Kratix Pipelines, covering how Kratix internally executes the Pipeline containers
title: Promise Workflows
sidebar_label: Workflows
---

# Workflows

A [Kratix Promise](../promises/intro) is configured with a series of Workflows
defined in the Promise's `workflows` key. Within the Workflows, Promise writers
can trigger a series of actions (pipelines) that must be executed when certain
conditions are met in the system. The `workflows` is defined as follows:

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
```

To define a Workflow, promise writers can use any technology they want (i.e.
Tekton, plain Pods, etc). Kratix provide a basic `kind` to make the process of writing Workflows simpler.

## Kratix Pipelines

Kratix `Pipeline` is defined as follows:

```yaml
apiVersion: platform.kratix.io/v1alpha1
kind: Pipeline
metadata:
  name: # name
spec:
  containers:
    - name: # container name
      image: # container image
    -  # ...
```

Kratix will run each container in the `spec.containers` list in order,
providing a set of common volumes.

### `/kratix/input`

This directory is pre-populated with files that are provided by Kratix or the
previous container. The first container will have access to an
`object.yaml` file containing the Promise definition submitted to the platform. All
containers will have access to this file at the `/kratix/input` directory.

### `/kratix/output`

This directory is an empty directory provided to the container for writing files
for future use. If the Promise specifies additional `.spec.depenencies` these
will be automatically added to the directory at the beginning of the pipeline at
`/kratix/output/static/dependencies.yaml`.

All containers in the pipeline will have access to the `/kratix/output`
directory. Any documents on this directory by the end of the pipeline will be
scheduled to all Worker Clusters. Any container on the list may add, update, or
remove documents from this directory.

In the `configure` pipeline all files present in `/kratix/output` directory of the
final container will be written to your GitOps repository.

## Running Workflows

The Workflows are regularly executed on each Resource. Kubernetes reconciles on a number of different actions including, but not
limited to:

- On the creation of the Promise
- Regular interval (default: 10 hours, not currently configurable)
- Recreating or restarting the Kratix Controller
- A change to the Promise definition

<br/>
All commands should be idempotent as there is a guarantee that
they will be run multiple times a day, and may be run much more frequently
depending on other environmental impacts like pod restarts.

## Passing secrets to the Pipeline

 See [workflow documentation for more
 information](../workflows) on how to pass secrets to
 Pipelines
