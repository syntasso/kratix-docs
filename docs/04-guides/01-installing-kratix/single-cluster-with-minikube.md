---
description: Run Kratix locally using minikube
---

# Single Cluster with minikube

One of the most powerful features of Kratix is its ability to handle requests for resources, and deploy them to a remote specific cluster. However, Kratix also works well in a single cluster environment. This guide will walk you through the steps to install Kratix on a single cluster, using minikube.

## System Setup

1. `minikube`:
   Used to create and manage a local Kubernetes cluster in Docker. See [the minikube documentation](https://minikube.sigs.k8s.io/docs/start/) to install and start a local cluster.
2. `docker` CLI / **Docker**:
   Used to orchestrate containers. `minikube` (above) requires that you have Docker installed and configured. See [Get Docker](https://docs.docker.com/get-docker/) to install.
3. `kubectl` / **Kubernetes command-line tool**:
   The CLI for Kubernetes — allows you to run commands against Kubernetes clusters. See [the install guide](https://kubernetes.io/docs/tasks/tools/#kubectl).


## Install Kratix

Create your cluster with minikube and install Kratix and MinIO. MinIO will be the repository for the GitOps toolkit. For production installations, MinIO can be replaced by Git or any other S3-compatible storage, depending on your preference.


```bash
minikube start

# Install Kratix
kubectl apply --filename https://raw.githubusercontent.com/syntasso/kratix/main/distribution/kratix.yaml

# Install MinIO
kubectl apply --filename https://raw.githubusercontent.com/syntasso/kratix/main/hack/platform/minio-install.yaml
```

### Set up the Gitops toolkit

This stage would typically be set up on a Worker cluster. On single cluster installations, the same cluster performs the role of the Platform and the Worker cluster. The commands below will set up the GitOps toolkit and register

```bash
# Register the cluster with Kratix
kubectl apply --filename https://raw.githubusercontent.com/syntasso/kratix/main/config/samples/platform_v1alpha1_worker_cluster.yaml

# Install the GitOps toolkit
kubectl apply --filename https://raw.githubusercontent.com/syntasso/kratix/main/hack/worker/gitops-tk-install.yaml
kubectl apply --filename https://raw.githubusercontent.com/syntasso/kratix/main/hack/worker/gitops-tk-resources-single-cluster.yaml
```

Once Flux is installed and running (this may take a few minutes), the Kratix resources should now be visible on the your cluster. You can verify its readiness by observing the `kratix-worker-system` namespace appearing in the cluster:

```bash
$ kubectl get namespace kratix-worker-system
NAME                   STATUS   AGE
kratix-worker-system   Active   1m
```

🎉   **Congratulations!** Kratix is now ready to receive workloads. Jump to [Installing and using a Promise](../installing-a-promise) to spin up your first as-a-service workload.
