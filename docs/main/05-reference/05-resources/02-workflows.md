---
description: Documentation for writing Promise Workflows using Kratix Pipelines, covering how Kratix internally executes the Pipeline containers
title: Resource Workflows
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
    # lifecycle hook for Resources
    resource:
      # lifecycle hook for creates/updates/ongoing reconciliation of Resources
      configure:
        -  # Pipeline definition
      # lifecycle hook for deletion of Resources
      delete:
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

Kratix will run each container in the `spec.containers` list in order, providing
a set of common volumes. The behaviour of these volumes differ slightly for
`configure` and `delete` (see blow). In order to allow re-use of the same image
in both `configure` and `delete` Kratix sets the `KRATIX_WORKFLOW_ACTION` environment
variable to `configure`/`delete` depending on what context the image is being
called in. Additionally Kratix also sets the `KRATIX_WORKFLOW_TYPE` environment variable
to `resource`/`promise` depending on what context the image is being called in.

### `/kratix/input`

This directory is pre-populated with files that are provided by Kratix or the
previous container. The first container will have access to an
`object.yaml` file containing the Resource definition submitted to the platform. All
containers will have access to this file at the `/kratix/input` directory.

### `/kratix/output`

This directory is an empty directory provided to the container for writing files
for future use.

All containers in the pipeline will have access to the `/kratix/output` directory. Any
documents on this directory by the end of the pipeline will be scheduled to a Worker
Cluster. Any container on the list may add, update, or remove documents from this directory.

In the `configure` pipeline all files present in `/kratix/output` directory of the
final container will be written to your GitOps repository. In the `delete`
pipeline no action occurs in the final container as nothing should be scheduled
as part of `delete`

:::note

At this time, all files must be written to the root directory of `/kratix/output` (i.e.
there should not be any subdirectories within `/kratix/output`), and every file must
contain only valid Kubernetes documents that can be applied to a cluster. Each
document will be scheduled per the [scheduling docs](../multicluster-management).

This is actively being prioritised so should you require this feature please [reach out](../../community.md)

:::

### `/kratix/metadata` (`configure` only)

All containers in the `configure` Pipeline have access to this directory.

Pipeline containers can control aspects of how Kratix behaves by creating special files in this directory:

- `destination-selectors.yaml` can be added to any Promise to
  further refine where the resources in `/kratix/output` will be
  [scheduled](../04-multicluster-management.md#pipeline).
- `status.yaml` allows the Pipeline to communicate information about the
  Resource back to the requester. See [status documentation
  for more information](04-status.md).

<br/>

Kratix scans for these files and ignores all other files in the `/kratix/metadata`
directory.

## Running Workflows

The Workflows are regularly executed on each Resource. Kubernetes reconciles on a number of different actions including, but not
limited to:

- On the creation of a new Resource
- Regular interval (default: 10 hours, not currently configurable)
- Recreating or restarting the Kratix Controller
- A change to the Resource definition

<br/>
All commands should be idempotent as there is a guarantee that
they will be run multiple times a day, and may be run much more frequently
depending on other environmental impacts like pod restarts.

## Workflow conventions
For conventions on how to do things like pass secrets into the Pipeline checkout
[the documentation](../workflows).

