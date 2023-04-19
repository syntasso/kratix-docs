---
description: Documentation for writing Promise Pipelines, covering how Kratix internally execute the Pipeline containers
title: Promise Pipelines
sidebar_label: Pipelines
---

# Resource Request Pipelines

A [Kratix Promise](../promises/intro) is configured with a Request Pipeline,
defined as `xaasRequestPipeline` in the Promise definition. This pipeline is an
ordered list of OCI-compliant images. Each image runs as an init container
within a single Kubernetes pod. 

## Pipeline Volumes

Each container is given access to three directories:

### `/input`

This directory is pre-populated with files that are provided by Kratix or the
previous pipeline container. The first container will have access to an
`object.yaml` file containing the Resource Request submitted to the platform.
The `/input` directory in subsequent containers contain content from the previous
container's `/output` directory.

### `/output`

This directory is an empty directory provided to the container for writing files
for future use.

Containers must ensure that the files required in future containers or that need
to be scheduled are written to this directory at the end of the container's
execution. In general, containers should copy all files from `/input` to
`/output` unless the container knows the file is no longer required.

#### Intermediary containers
If the container is not the last container in the pipeline its `/output`
directory will become the next container's `/input` directory.

#### Final container
All files present in `/output` directory of the final container will be written
to your GitOps repository.

:::note
At this time, all files must be written to the root directory of `/output` (i.e.
there should not be any subdirectories within `/output`), and every file must
contain only valid Kubernetes documents that can be applied to a cluster. Each
document will be scheduled per the [scheduling docs](../multicluster-management).
:::

### `/metadata`

All containers in the pipeline have access to this directory.

Pipeline containers can control aspects of how Kratix behaves by creating special files in this
directory:
   - `cluster-selectors.yaml` can be added to any Promise to
     further refine where the resources in `/output` will be
     [scheduled](../04-multicluster-management.md#pipeline).
   - `status.yaml` allows the pipeline to communicate information about the
     Resource Request back to the requester. See [status documentation
     for more information](04-status.md).

<br/>

Kratix scans for these files and ignores all other files in the `/metadata`
directory.

## Pipeline runs

A pipeline is run on each Resource Request reconciliation loop. Kubernetes
reconciles on a number of different actions including, but not limited to:

- Regular interval (default: 10 hours, not currently configurable)
- Recreating or restarting the Kratix Controller
- A change to the Resource Request (not yet supported)

<br/>
All pipelines should be idempotent as there is a guarantee that
they will be run multiple times a day, and may be run much more frequently
depending on other environmental impacts like pod restarts.

## Passing secrets to the Pipeline

:::caution Under Development

We're currently working on providing alternative ways to read secrets from both self hosted and SaaS providers. If you'd like early access, reach out.

:::

To allow the pipeline to access in-cluster secrets, target the Platform Cluster and do the following:

1. Create the Secret you'd like to access. For example:
  ```bash
  kubectl create secret generic promise-secret \
      --from-literal=apikey=topsecret
  ```
1. Create a ClusterRole giving `get` permissions to the `promise-secret` created above:
  ```bash
  kubectl create clusterrole promise-secret-cr \
      --verb=get \
      --resource=secrets \
      --resource-name=promise-secret
  ```
1. Create a ClusterRoleBinding to associate the pipeline ServiceAccount
   (created by Kratix, on Promise install) with the ClusterRole. Reference
   the ClusterRole created above:
  ```bash
  # Replace PROMISE with the name of your promise
  kubectl create clusterrolebinding promise-secret \
      --clusterrole=promise-secret-cr \
      --serviceaccount=default:PROMISE-default-promise-pipeline \
  ```
1. Access the Base64 enconded Secret in the pipeline with the `kubectl` CLI
  ```
  kubectl get secret promise-secret -o=jsonpath='{.data.apikey}'
  ```

For a working example, check the [Slack Promise](https://github.com/syntasso/kratix-marketplace/tree/main/slack) available in the Marketplace.
