---
description: Run Kratix locally using KinD
slug: /installing-kratix
---

# Multi-cluster with KinD

## System setup

For this workshop, we'll use Kratix on two local Kubernetes clusters. Install the prerequisites listed below if they aren't already on your system.

1. `kind` CLI / **Kubernetes-in-Docker (KinD)**:
   Used to create and manage local Kubernetes clusters in Docker. See [the quick start guide](https://kind.sigs.k8s.io/docs/user/quick-start/) to install.
2. `docker` CLI / **Docker**:
   Used to orchestrate containers. `kind` (above) requires that you have Docker installed and configured. See [Get Docker](https://docs.docker.com/get-docker/) to install.
3. `kubectl` / **Kubernetes command-line tool**:
   The CLI for Kubernetes — allows you to run commands against Kubernetes clusters. See [the install guide](https://kubernetes.io/docs/tasks/tools/#kubectl).


## Installing Kratix

:::tip

You can also run `./scripts/quick-start.sh` from the root of the [Kratix repository](https://github.com/syntasso/kratix).

:::

### Set up a Platform cluster <a href="#platform-setup" id="platform-setup"></a>

Create your `platform` cluster and install Kratix and MinIO. MinIO will be the repository for the GitOps toolkit. For production installations, MinIO can be replaced by Git or any other S3-compatible storage, depending on your preference.

```bash
kind create cluster --name platform

# Install Kratix
kubectl apply --context kind-platform --filename https://raw.githubusercontent.com/syntasso/kratix/main/distribution/kratix.yaml

# Install MinIO
kubectl apply --context kind-platform --filename https://raw.githubusercontent.com/syntasso/kratix/main/hack/platform/minio-install.yaml
```

### Set up your Worker cluster <a href="#worker-setup" id="worker-setup"></a>

Create your Kratix `worker` cluster and install [Flux](https://fluxcd.io/). This will create a cluster for running the X as-a-Service workloads:

```bash
kind create cluster --name worker

# Register the worker cluster with the platform cluster
kubectl apply --context kind-platform --filename https://raw.githubusercontent.com/syntasso/kratix/main/config/samples/platform_v1alpha1_worker_cluster.yaml

# Install flux on the worker
kubectl apply --context kind-worker --filename https://raw.githubusercontent.com/syntasso/kratix/main/hack/worker/gitops-tk-install.yaml
kubectl apply --context kind-worker --filename https://raw.githubusercontent.com/syntasso/kratix/main/hack/worker/gitops-tk-resources.yaml
```

Flux will eventually reconcile the clusters state, making the `worker` cluster ready to receive workloads. You can verify its readiness by observing the `kratix-worker-system` namespace appearing in the `worker` cluster:

```bash
$ kubectl --context kind-worker get namespaces
NAME                   STATUS   AGE
...
kratix-worker-system   Active   1m
...
```

🎉   **Congratulations!** Kratix is now ready to receive workloads. Jump to [Installing and using a Promise](../installing-a-promise) to spin up your first as-a-service workload.