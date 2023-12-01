---
description: Run Kratix
slug: /main/guides/installing-kratix
title: Multi cluster
---
```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import PartialInstallCertManager from '../../../_partials/installation/_install-cert-manager.md';
```

## System setup

This guide will show how to use Kratix on two Kubernetes clusters. Install the prerequisites
listed below if they aren't already on your system. If you are using pre-existing clusters
or want to use a different tool to provision your clusters, skip requirements 1 and 2.

1. `kind` CLI / **Kubernetes-in-Docker (KinD)**:
   Used to create and manage local Kubernetes clusters in Docker. See [the quick start guide](https://kind.sigs.k8s.io/docs/user/quick-start/) to install.
2. `docker` CLI / **Docker**:
   Used to orchestrate containers. `kind` (above) requires that you have Docker installed and configured. See [Get Docker](https://docs.docker.com/get-docker/) to install.
3. `kubectl` / **Kubernetes command-line tool**:
   The CLI for Kubernetes — allows you to run commands against Kubernetes clusters. See [the install guide](https://kubernetes.io/docs/tasks/tools/#kubectl).

:::tip

To get setup locally quickly with KinD clusters you can use the `./scripts/quick-start.sh`
from the root of the [Kratix repository](https://github.com/syntasso/kratix). This provisions
an in-cluster `MinIO` to use as the backing [State Store](/docs/main/reference/statestore/intro).
Alternatively you can provide the `--git` flag to create it with an in-cluster Gitea
instance instead.

:::

## Set up platform cluster {#platform-setup}

If you are not using a pre-existing cluster, create your platform cluster locally using KinD:
```bash
kind create cluster --image kindest/node:v1.27.3 --name platform
# set PLATFORM to point to the platform cluster context
export PLATFORM="kind-platform"
```

## Install cert-manager

<PartialInstallCertManager />

## Install Kratix

If your are using your own pre-existing cluster, set the `PLATFORM` environment
variable to the name of the kubectl context used to communicate to it. Install Kratix
on the platform cluster.
```bash
# Install Kratix
kubectl apply --context $PLATFORM --filename https://raw.githubusercontent.com/syntasso/kratix/main/distribution/kratix.yaml
```

## Set up State Store
Kratix uses GitOps to provision resources on the worker clusters. You can configure Kratix
with multiple different GitOps repositories by creating [State Stores](/docs/main/reference/statestore/intro).
Kratix supports [Bucket State Store](/docs/main/reference/statestore/bucketstatestore)
and [Git State Store](/docs/main/reference/statestore/gitstatestore).

If your are using local KinD clusters you can install MinIO or Gitea as an in-cluster State Store

<Tabs className="boxedTabs" groupId="stateStore">
  <TabItem value="minio" label="Bucket (on KinD)">

  ```bash
  # Install MinIO and register it as a BucketStateStore
  kubectl apply --context $PLATFORM --filename https://raw.githubusercontent.com/syntasso/kratix/main/config/samples/minio-install.yaml
  kubectl apply --context $PLATFORM --filename https://raw.githubusercontent.com/syntasso/kratix/main/config/samples/platform_v1alpha1_bucketstatestore.yaml
  ```

  </TabItem>

  <TabItem value="gitea" label="Git (on KinD)">

  ```bash
  # Install Gitea and register it as a Git State Store
  kubectl apply --context $PLATFORM --filename https://raw.githubusercontent.com/syntasso/kratix/main/hack/platform/gitea-install.yaml
  kubectl apply --context $PLATFORM --filename https://raw.githubusercontent.com/syntasso/kratix/main/config/samples/platform_v1alpha1_gitstatestore.yaml
  ```

  </TabItem>

  <TabItem value="custom" label="Custom">

  If your aren't using KinD clusters you will need to create your own State
  Store that is accessible by the platform and worker cluster. Follow the [docs
  for creating State Stores](/docs/main/reference/statestore/intro).

  </TabItem>

</Tabs>



## Set up a worker cluster {#worker-setup}

### Create worker cluster
If you are not using a pre-existing cluster, create your platform cluster locally using KinD:
```bash
kind create cluster --image kindest/node:v1.27.3 --name worker

# set WORKER to point to the worker cluster context
export WORKER="kind-worker"
```

If you are using your own pre-existing cluster, set the `WORKER` environment
variable to the name of the kubectl context used to communicate to it.

### Install Flux
Install [Flux](https://fluxcd.io/). Flux will be used to pull down resources to the
cluster from the State Store
```bash
# Install flux on the worker
kubectl apply --context $WORKER --filename https://raw.githubusercontent.com/syntasso/kratix/main/hack/destination/gitops-tk-install.yaml
```


### Configure Flux
Now that Flux is installed, we need to configure it to pull down from the Kratix State Store.
Follow the steps below that match the State Store you created previously:

<Tabs className="boxedTabs" groupId="stateStore">
<TabItem value="minio" label="Bucket (on KinD)">

```bash
# Configure Flux to pull down from MinIO
kubectl apply --context $WORKER --filename https://raw.githubusercontent.com/syntasso/kratix/main/hack/destination/gitops-tk-resources.yaml
```

</TabItem>

<TabItem value="gitea" label="Git (on KinD)">

```bash
# Configure Flux to pull down from Gitea
kubectl apply --context $WORKER --filename https://raw.githubusercontent.com/syntasso/kratix/main/hack/destination/gitops-tk-resources-git.yaml
```

</TabItem>

<TabItem value="custom" label="Custom">

  You will need to manual configure the Flux resources to use the Git/Bucket created.

  - Bucket: Download and modify this [example configuration](https://raw.githubusercontent.com/syntasso/kratix/main/hack/destination/gitops-tk-resources.yaml)
    to use the endpoint, bucket and credentials for your Bucket.
  - Git: Download and modify this [example configuration](https://raw.githubusercontent.com/syntasso/kratix/main/hack/destination/gitops-tk-resources-git.yaml)
    to use the url, branch, and credentials for your Git Repository.

</TabItem>
</Tabs>

### Register cluster as a Destination with Kratix

The final step is to tell Kratix that the cluster is ready to receive workloads.
Follow the steps below that match the State Store you created previously:

<Tabs className="boxedTabs" groupId="stateStore">
<TabItem value="minio" label="Bucket (on KinD)">

```bash
# Configure Flux to pull down from MinIO
kubectl apply --context $PLATFORM --filename https://raw.githubusercontent.com/syntasso/kratix/main/config/samples/platform_v1alpha1_worker.yaml
```

</TabItem>

<TabItem value="gitea" label="Git (on KinD)">

```bash
# Install flux on the worker and configure it to pull down from MinIO
curl https://raw.githubusercontent.com/syntasso/kratix/main/config/samples/platform_v1alpha1_worker.yaml | \
  sed "s_BucketStateStore_GitStateStore_g" | \
  kubectl apply --context $PLATFORM --filename -
```

</TabItem>

<TabItem value="custom" label="Custom">

You will need to manual configure the Destination resources to use created State Store.
Download and modify this [example configuration](https://raw.githubusercontent.com/syntasso/kratix/main/config/samples/platform_v1alpha1_worker.yaml),
replacing the `spec.StateStoreRef.name`, `spec.StateStoreRef.namespace` and `spec.StateStoreRef.kind`
to match the previously created State Store

</TabItem>
</Tabs>

Flux will eventually reconcile the clusters state, making the `worker` cluster ready
to receive workloads. You can verify its readiness by observing the `kratix-worker-system`
namespace appearing in the `worker` cluster:

```shell-session
$ kubectl --context $WORKER get namespaces
NAME                   STATUS   AGE
...
kratix-worker-system   Active   1m
...
```

🎉   **Congratulations!** Kratix is now installed! Jump to [Installing and using a Promise](installing-a-promise) to spin up your first as-a-service offering.
