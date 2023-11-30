---
title: Workflows
sidebar_label: Workflows
description: Learn more about conventions in Workflows
id: workflows
---

A [Kratix Promise](../promises/intro) can be configured with a series of
Workflows defined in the Promise's `workflows` key.

Within the Workflows, Promise writers can trigger a series of actions
(pipelines) that must be executed when certain conditions are met in the system.
The `workflows` is defined as follows:

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

    # lifecycle hook for Promises
    promise:
      # lifecycle hook for creates/updates/ongoing reconciliation of the Promise
      configure:
        -  # Pipeline definition
      # lifecycle hook for deletion of Promises
      delete:
        -  # Pipeline definition
```

A particular workflow (for example, `resource.configure`) is an array of
Kubernetes objects that will be executed in order. Kratix provides a built-in kind
(`Pipeline`, see below) that makes the process of writing Workflows easier.

:::note

Currently, Kratix only supports `kind: Pipeline` in the workflow definition. In
the future, we will extend this to support any other Kubernetes Objects, like
Tekton Pipelines, Argo Workflows, plain Pods/Jobs, etc.

:::

## The Pipeline kind

The Kratix `Pipeline` kind is a simple wrapper around a Kubernetes Pod. It will
automatically mount the necessary [Kratix Volumes](#volumes) and set
[Enviromnemt Variables](#environment-variables) for the provided containers.

It is defined as follows:

```yaml
apiVersion: platform.kratix.io/v1alpha1
kind: Pipeline
metadata:
  name: # name
spec:
  volumes: # optional
  containers:
    - name: # container name
      image: # container image
      # optional fields
      command: []
      args: []
      env: []
      envFrom: []
      volumeMounts: []
```

Refer to the [Kubernetes Pod Spec
documentation](https://kubernetes.io/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec)
for more information on the fields above.

To access secrets in the pipeline, refer to the [Kubernetes documentation](https://kubernetes.io/docs/concepts/configuration/secret/).

:::note

Not all fields from the Pod spec are supported. We will add support for more
fields in the future.

:::

## Volumes {#volumes}

Kratix will run each container in the `spec.containers` list in order,
providing a set of common volumes, as defined below.

### Input

Kratix provides a input directory to the container at `/kratix/input`. This
directory is populated with different files depending on the type of Workflow.

In Promise Workflows, this directory is empty.

In Resource Workflows, all container will have access to an `object.yaml`
within the `/kratix/input` directory. The `object.yaml` contains the Resource
definition submitted to the platform.

### Output

At the end of the workflow, all files present in the output volume, mounted at
`/kratix/output`, will be written to the State Store. All containers in the
pipeline can write to this volume, and any container can add, update, or remove
documents from this directory.

In Promise Workflows, if the Promise specifies additional `.spec.dependencies`,
these will be automatically added to the directory at the beginning of the
pipeline at `/kratix/output/static/dependencies.yaml`.

:::note

Files written to `/kratix/output` in `delete` pipelines will be ignored.

:::

### Metadata

All containers in the `configure` Pipeline have access to
this directory, mounted at `/kratix/metadata`.

Pipeline containers can control aspects of how Kratix behaves by creating
special files in this directory:

- `destination-selectors.yaml` can be added to any Promise to
  further refine where the resources in `/kratix/output` will be
  [scheduled](./multicluster-management).
- `status.yaml` allows the Pipeline to communicate information about the
  Resource back to the requester. See [status documentation
  for more information](./resources/status).

Kratix scans for these files and ignores all other files in the `/kratix/metadata`
directory. If you need to pass additional information to the next container in
the pipeline, you can safely write to the `/kratix/metadata` directory.

## Environment Variables {#environment-variables}

Kratix will set the following environment variables for all containers in the
workflow:


| Variable                  | Description     |
| ------------------------- | --------------- |
| `KRATIX_WORKFLOW_ACTION`  | The action that triggered the workflow. Either `configure` or `delete`. |
| `KRATIX_WORKFLOW_TYPE`    | The type of workflow. Either `resource` or `promise`. |
| `KRATIX_PROMISE_NAME`     | The name of the Promise. |

By checking the `KRATIX_WORKFLOW_ACTION` and `KRATIX_WORKFLOW_TYPE` environment
variables, you can write a single container that can be used in both `configure`
and `delete` workflows.
