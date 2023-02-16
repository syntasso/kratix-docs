---
description: Resource Request Pipelines
title: Pipelines
---

# Resource Request Pipelines

The pipeline is an ordered list of OCI-compliant images that run as an ordered
set of init containers in a Kubernetes pod. Each container is given read and
write access to the same storage.

:::info

Kubernetes uses `docker.io` as it's default registry. If you choose to store your images in another registery, be sure to provide for the full path (e.g. `ghcr.io/syntasso/kratix-marketplace/jenkins-request-pipeline:v0.1.0`, not just `syntasso/kratix-marketplace/jenkins-request-pipeline:v0.1.0`)

:::

## Passing data between pipeline steps

There are three mount points, all of which are read-write and can be altered by each pipeline stage:

- `/input`: Files made available to the pipeline stage. This is a read/write directory which means each stage can add, remove, or edit inputs to the next stage. The Resource Request itself is stored initially as `object.yaml` in this directory.
- `/output`: At the end of a pipeline, each file in this directory will be written to your GitOps repository of choice. At this time, all files must be written to the root directory (i.e. there should not be any subdirectories within `/output`) and every file must contain only valid Kubernetes documents that can be applied to a cluster. Each document will be scheduled per the [scheduling docs](../04-scheduling.md).
- `/metadata`: This directory can hold non-Kubernetes document files that are used when scheduling output files. At this time, the only known files for this directory are `cluster-selectors.yaml` and `status.yaml`. 
   - `cluster-selectors.yaml` can be added to any Promise cluster-selectors to further refine where the output resources will be [scheduled](../04-scheduling.md#pipeline).
   - `status.yaml` allows the pipeline to communicate information about the resource request back to the resource requester. See [status documentation for more infoformation](04-status.md)

## Pipeline runs

A pipeline is run on each Resource Request reconciliation loop. Kuberentes reconciles on a number of different actions including, but not limited to:

- Regular interval (default: 10 hours, not currently configurable)
- Recreating or restarting Kratix Controller
- A change to the Resource Request (not yet supported)

<br/>
Because of this, all pipelines should be idempotent as there is a guarantee that they will be run multiple times a day, and may be run much more frequently depending on other environmental impacts like pod restarts.

## Passing secrets to the Pipeline

:::caution Under Development

We're currently working on providing alternative ways to read secrets from both self hosted and SaaS providers. If you'd like early access, reach out.

:::

To allow the pipeline to access in-cluster secrets, do the following while targeting the Platform Cluster:

1. Create the Secret you'd like to access. For example:
  ```bash
kubectl create secret generic promise-secret --from-literal=apikey=topsecret
  ```
1. Create a Cluster Role giving `get` permissions to the `promise-secret` created above:
  ```bash
kubectl create clusterrole promise-secret-cr \
      --verb=get \
      --resource=secrets \
      --resource-name=promise-secret
  ```
1. Create a Cluste Role Binding, associating the pipeline Service Account (created by Kratix, on Promise install) to the Cluster Role, by referencing the Cluster Role created above:
  ```bash
# Replace PROMISE with the name of your promise
kubectl create clusterrolebinding promise-secret \
      --clusterrole=promise-secret-cr \
      --serviceaccount=default:PROMISE-default-pipeline-secret \
  ```
1. Access the Base64 enconded Secret in the pipeline with the `kubectl` CLI
  ```
  kubectl get secret promise-secret -o=jsonpath='{.data.apikey}'
  ```

For a working example, check the [Slack Promise](https://github.com/syntasso/kratix-marketplace/tree/main/slack) available in the Marketplace.
