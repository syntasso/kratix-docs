---
description: Instructions on how to setup Kratix with Git
title: Running with Git
---

Kratix talks to the Worker clusters through a Repository. This Repository can be
either be a Git server (like Github or Gitea) or a S3-compatible object store
(like GCS and MinIO). Check [the reference deployment topology for more
details](/docs/main/reference/deployment-topology).

This page documents how to setup Kratix with Git. It will also install Gitea as
the Git server. To deploy Kratix with an S3-compatible repository, check out
[this guide](/docs/main/guides/installing-kratix).

## Installing Kratix

:::tip

You can also run `./scripts/quick-start.sh --git` from the root of the [Kratix
repository](https://github.com/syntasso/kratix) to test it locally with KinD.

:::


### Create the Kubernetes Clusters

You can run Kratix either with a multi-cluster or a single-cluster setup. The
commands on this document assume that two environment variables are set:

1. `PLATFORM` representing the Platform cluster Kubernetes context
2. `WORKER` representing the Worker cluster Kubernetes context

For example, with KinD, you can create two clusters and set the variables with:

```bash
# Create the clusters
kind create cluster --name platform
kind create cluster --name worker

# Set the environment variables
export PLATFORM="kind-platform"
export WORKER="kind-worker"
```

For single cluster setups, the two variables should be set to the same value.
You can find your cluster context by running:

```
kubectl config get-contexts
```

### Set up a Platform Cluster {#platform-setup}

In your Platform cluster, install Gitea and Kratix. Gitea will be the
repository for the GitOps toolkit.

```bash
# Install Gitea
kubectl apply --context $PLATFORM --filename https://raw.githubusercontent.com/syntasso/kratix/main/hack/platform/gitea-install.yaml

# Install Kratix
curl -s https://raw.githubusercontent.com/syntasso/kratix/main/distribution/kratix.yaml | sed "s/repository-type=s3/repository-type=git/g" |
   kubectl apply --filename -
```

### Set up your Worker Cluster {#worker-setup}

In your Worker cluster, install [Flux](https://fluxcd.io/). This
will create a cluster for running the X as-a-Service workloads:

```bash
# Register the Worker Cluster with the Platform Cluster
kubectl apply --context $PLATFORM --filename https://raw.githubusercontent.com/syntasso/kratix/main/config/samples/platform_v1alpha1_worker_cluster.yaml

# Ensure Gitea is running on the Platform
kubectl wait pod --context $PLATFORM -n gitea --selector app=gitea --for=condition=ready

# Install flux on the worker
kubectl apply --context $WORKER --filename https://raw.githubusercontent.com/syntasso/kratix/main/hack/worker/gitops-tk-install.yaml
kubectl apply --context $WORKER --filename https://raw.githubusercontent.com/syntasso/kratix/main/hack/worker/gitops-tk-resources-git.yaml
```

Flux will eventually reconcile the clusters state, making the `worker` cluster
ready to receive workloads. You can verify its readiness by observing the
`kratix-worker-system` namespace appearing in the `worker` cluster:

```bash
$ kubectl --context $WORKER get namespaces
NAME                   STATUS   AGE
...
kratix-worker-system   Active   1m
...
```

🎉   **Congratulations!** Kratix is now ready to receive workloads, backed by
Git. Jump to [Installing and using a Promise](../installing-a-promise) to spin up
your first as-a-service workload.
