---
description: Guide on how to register a new Worker Cluster with Kratix
title: Adding a new Worker Cluster
---

One of the most powerful features of Kratix is its ability to react when new Kubernetes
Clusters are added to the platform. By default, any Promise installed in the Platform
cluster will be automatically installed in the clusters joining the platform.

## Pre-requisites

In this section, we will register a new Kubernetes Cluster with Kratix, and
verify its multi-cluster capabilities. Before continuing, you will need a Platform
Kubernetes cluster running Kratix, and a second worker Kubernetes cluster to
register with the Platform. You also need at least one Promise installed on
the Platform.

For the context of this guide, we will assume the setup from [Installing Kratix
with KinD](./installing-kratix) and that the following environment variables are
set:

```bash
export PLATFORM="kind-platform"
export WORKER="kind-worker"
```

We will also use the [Jenkins
Promise](https://github.com/syntasso/kratix-marketplace/tree/main/jenkins) as an
example. Follow [Installing a Promise](./installing-a-promise) to get Jenkins
installed, if needed.


```shell-session
$ kubectl --context $PLATFORM get clusters.platform.kratix.io
NAME               AGE
worker-cluster-1   1h

$ kubectl --context $PLATFORM get promises.platform.kratix.io
NAME              AGE
jenkins-promise   1h
```

On the Worker Cluster, you should see the Jenkins Operator running:

```shell-session
$ kubectl --context $WORKER get pods
NAME                                READY   STATUS    RESTARTS   AGE
jenkins-operator-778d6fc487-gczpb   1/1     Running   0          1h
```

If your setup is different, update the commands accordingly.

## Preparing the new Cluster

You will now add a new Cluster to the Platform Cluster and watch Kratix reconciling the
system. For that, you need to first create the new Kubernetes cluster:

```bash
kind create cluster --image kindest/node:v1.24.0 --name worker-cluster-2
export WORKER_2="kind-worker-cluster-2"
```

Next, install the GitOps toolkit and create the necessary GitOps resources. The quickest
way to do that is to run the `./scripts/install-gitops` script from the Kratix root
directory:

```bash
cd /path/to/kratix
./scripts/install-gitops --context ${WORKER_2} --path worker-cluster-2
```

## Registering the Cluster

You can now register your cluster. Create a file called `worker-cluster-2.yaml` with the
following contents:

```yaml title="worker-cluster-2.yaml"
apiVersion: platform.kratix.io/v1alpha1
kind: Cluster
metadata:
  name: worker-cluster-2
  labels:
    environment: dev
spec:
  stateStoreRef:
    name: default
    kind: BucketStateStore
```

The cluster will using the pre-existing MinIO [StateStore](/docs/main/05-reference/06-statestore/01-statestore.md).
Apply the Cluster document to the Platform cluster:

```bash
kubectl --context $PLATFORM apply --filename worker-cluster-2.yaml
```

Check the Cluster was created:

```shell-session {4}
$ kubectl --context $PLATFORM get clusters.platform.kratix.io
NAME               AGE
worker-cluster-1   1h
worker-cluster-2   1h
```

Kratix will react to the new Cluster by scheduling the installation of the Jenkins Promise
to the new Worker Cluster. After a couple of minutes, you should see the Jenkins Operator
running on the new Worker Cluster:

```shell-session {3}
$ kubectl --context ${WORKER_2} get pods
NAME                                READY   STATUS    RESTARTS   AGE
jenkins-operator-778d6fc487-c9w8f   1/1     Running   0          1h
```

When you request a new Jenkins, the instance will be created in one of the available
Clusters, in a non-deterministic way.

For further documentation on Cluster Scheduling, check the [Cluster Reference
documentation](../reference/clusters/intro)

## 🎉 Congratulations

✅&nbsp;&nbsp; You have created and registered a new Cluster and watched the system react to it.<br />
👉🏾&nbsp;&nbsp; Let's [write compound Promises](./compound-promises).

export const toc = [...EnhancingPromiseTOC];
