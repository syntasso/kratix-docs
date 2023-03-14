---
description: Guide on how to register a new Worker Cluster with Kratix
title: Adding a new Worker Cluster
---

One of the most powerful features of Kratix is its ability to react when new Kubernetes
Clusters are added to the platform. By default, any Promise installed in the Platform
cluster will be automatically installed in the clusters joining the platform.

## Pre-requisites

To see this in action, you will need an environment running Kratix with a Promise
installed. For that, you can follow the [Installing a Promise](installing-a-promise)
guide. Before continuing, ensure you have a Platform Cluster and a Worker Cluster created
with KinD:

```shell-session
$ kind get clusters
platform
worker

$ kubectl --context $PLATFORM get clusters.platform.kratix.io
NAME               AGE
worker-cluster-1   1h
```

You should also have a Jenkins Promise installed:

```shell-session
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

## Preparing the new Cluster

You will now add a new Cluster to the Platform Cluster and watch Kratix reconciling the
system. For that, you need to first create the new Kubernetes cluster:

```bash
kind create cluster --name worker-cluster-2
```

Next, install the GitOps toolkit and create the necessary GitOps resources. The quickest
way to do that is to run the `./scripts/install-gitops` script from the Kratix root
directory:

```bash
cd /path/to/kratix
./scripts/install-gitops --context $WORKER-cluster-2 --bucket-path worker-cluster-2
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
  id: worker-cluster-2-id
  bucketPath: worker-cluster-2
```

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
$ kubectl --context $WORKER-cluster-2 get pods
NAME                                READY   STATUS    RESTARTS   AGE
jenkins-operator-778d6fc487-c9w8f   1/1     Running   0          1h
```

When you request a new Jenkins, the instance will be created in one of the available
Clusters, in a non-deterministic way.

For further documentation on Cluster Scheduling, check the [Cluster Reference
documentation](../reference/clusters/intro)

## 🎉 Congratulations

✅&nbsp;&nbsp; You have created and registered a new Cluster and watched the system react to it.<br />
👉🏾&nbsp;&nbsp; Let's [write compound promises](./compound-promises).

export const toc = [...EnhancingPromiseTOC];
