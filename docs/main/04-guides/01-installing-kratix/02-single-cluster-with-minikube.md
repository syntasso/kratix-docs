---
description: Run Kratix locally using minikube
title: Single Cluster with minikube
---

```mdx-code-block
import PartialInstall from '../../../_partials/installation/_single-cluster-install.md';
import PartialConfigure from '../../../_partials/installation/_single-cluster-configure.md';
```

One of the most powerful features of Kratix is its ability to handle requests for resources, and deploy them to a remote specific cluster. However, Kratix also works well in a single cluster environment. This guide will walk you through the steps to install Kratix on a single cluster, using minikube.

## System Setup

1. `minikube`:
   Used to create and manage a local Kubernetes cluster in Docker. See [the minikube documentation](https://minikube.sigs.k8s.io/docs/start/) to install and start a local cluster.
2. `docker` CLI / **Docker**:
   Used to orchestrate containers. `minikube` (above) requires that you have Docker installed and configured. See [Get Docker](https://docs.docker.com/get-docker/) to install.
3. `kubectl` / **Kubernetes command-line tool**:
   The CLI for Kubernetes — allows you to run commands against Kubernetes clusters. See [the install guide](https://kubernetes.io/docs/tasks/tools/#kubectl).


## Bootstap the cluster

Create your cluster with minikube:

```bash
minikube start
```

<PartialInstall />

<details>
  <summary>Alternative install instructions</summary>

To install Kratix and MinIO separately, run the commands below:

```bash
# Install Kratix
kubectl apply --filename https://raw.githubusercontent.com/syntasso/kratix/main/distribution/kratix.yaml

# Install MinIO
kubectl apply --filename https://raw.githubusercontent.com/syntasso/kratix/main/hack/platform/minio-install.yaml

# Install Flux
kubectl apply --filename https://raw.githubusercontent.com/syntasso/kratix/main/hack/worker/gitops-tk-install.yaml
```

</details>

### Configure the Platform

<PartialConfigure />

<details>
  <summary>Alternative install instructions</summary>

To register the minikube cluster as a Kratix Worker Cluster, run the command below:

```bash
kubectl apply --filename https://raw.githubusercontent.com/syntasso/kratix/main/config/samples/platform_v1alpha1_worker_cluster.yaml
```

You can then install and conigure Flux with the commands below:

```bash
# Install the GitOps toolkit
kubectl apply --filename https://raw.githubusercontent.com/syntasso/kratix/main/hack/worker/gitops-tk-resources-single-cluster.yaml
```

</details>

Once Flux is installed and running (this may take a few minutes), the Kratix resources should now be visible on the your cluster. You can verify its readiness by observing the `kratix-worker-system` namespace appearing in the cluster:

```bash
$ kubectl get namespace kratix-worker-system
NAME                   STATUS   AGE
kratix-worker-system   Active   1m
```

🎉   **Congratulations!** Kratix is now ready to receive workloads. Jump to [Installing and using a Promise](../installing-a-promise) to spin up your first as-a-service workload.
