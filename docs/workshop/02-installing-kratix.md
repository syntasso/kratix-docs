---
description: Learn how to install kratix
title: Installing Kratix
id: installing-kratix
---
import useBaseUrl from '@docusaurus/useBaseUrl';

This is Part 1 of [a series](intro) illustrating how Kratix works. <br />
👉🏾 Next: [Install a Kratix Promise](installing-a-promise)

<hr />

**In this tutorial, you will**
* [learn more about Kratix as a framework](#what-is-kratix)
* [install and configure Kratix on a Kubernetes cluster](#install-kratix)

<img align="right" src={useBaseUrl('/img/logo_300_with-padding.png')} />

## What is Kratix? {#what-is-kratix}

Kratix is a framework used by platform teams to build the custom platforms tailored to their organisation.

### Using Kratix to build your platform you can:

* use GitOps workflow with Flux and familiar Kubernetes-native constructs.
* co-create capabilities by providing a clear contract between application and platform teams through the definition and creation of “Promises”. We'll talk more about Kratix Promises in [the next step](installing-a-promise).
* create a flexible platform with your paved paths as Promises.
* evolve your platform easily as your business needs change.
* start small on a laptop and expand to multi-team, multi-cluster, multi-region, and multi-cloud with a consistent API everywhere.

### Providing a Kratix-built platform allows your users to:
- discover available services that are already fit-for-purpose.
- consume services on demand using standard Kubernetes APIs.
- move focus away from infrastructure toward adding product value.

<hr />

## Hands on: Installing Kratix {#install-kratix}

Before continuing, make sure to go back to [pre-requisites](setup)
and follow the guide if you haven't done that already.

This guide will go through the following steps:

1. [Clone Kratix](#clone-kratix)
1. [Create the Platform cluster](#platform-setup)
1. [Install Kratix](#kratix-setup)
1. [Set up the GitOps State Store](#gitops-setup)
1. [Create the Kratix State Store](#statestore-setup)

### Clone Kratix {#clone-kratix}

You will need the Kratix source code to complete this workhshop. Clone the
State Store to your local machine and change into the directory:

```bash
git clone https://github.com/syntasso/kratix.git
cd kratix
```

### Create the Platform cluster {#platform-setup}

Kratix leverages the GitOps toolkit to deliver multi-cluster capabilities. The
Kubernetes cluster where Kratix itself is installed is often referred to as "the
platform". The first step in getting Kratix up and running is to have a hold of
a Kubernetes cluster where we can install it.

In this workshop, we will use `kind` to run Kubernetes clusters locally. Let's
go ahead and create the Platform cluster:

```bash
kind create cluster --name platform \
    --image kindest/node:v1.24.0 \
    --config hack/platform/kind-platform-config.yaml
```

The command above will create a cluster on the specified Kubernetes version and
update your local `.kube/config` with the credentials to access the cluster. The
config file specified is needed to simplify accessing services running in the
cluster without the need to forward any ports.

Once the creation completes, you should be able to reach to your local cluster
on the `kind-platform` context:

```shell-session
$ kubectl --context kind-platform cluster-info
Kubernetes control plane is running at https://127.0.0.1:XXXX
CoreDNS is running at https://127.0.0.1:55960/api/v1/...

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
```

### Install Kratix {#kratix-setup}

To install Kratix, all you need is to apply the Kratix distribution file:

```bash
kubectl --context kind-platform apply --filename distribution/kratix.yaml
```

The command above will create a Kratix deployment (on the
`kratix-platform-system` namespace), as well as install all the APIs that Kratix
needs. You can verify the installation by running:

```shell-session
$ kubectl --context kind-platform get crds
NAME                                         CREATED AT
bucketstatestores.platform.kratix.io         2023-05-22T12:02:41Z
clusters.platform.kratix.io                  2023-05-22T12:02:41Z
gitstatestores.platform.kratix.io            2023-05-22T12:02:41Z
promises.platform.kratix.io                  2023-05-22T12:02:41Z
workplacements.platform.kratix.io            2023-05-22T12:02:42Z
works.platform.kratix.io                     2023-05-22T12:02:42Z

$ kubectl --context kind-platform get deployments --namespace kratix-platform-system
NAME                                 READY   UP-TO-DATE   AVAILABLE   AGE
kratix-platform-controller-manager   1/1     1            1           1h
```

With Kratix's APIs available, we can now tell Kratix which repositories it will
use to deploy and manage the workloads.

### Set up the GitOps State Store {#gitops-setup}

One of Kratix capabilities is to orchestrate and schedule workloads across an
array of clusters. It leverages the power of GitOps, by writing documents to a
store, that's later picked up and applied to the clusters tasked with running
that workload. In Kratix terms, those clusters are called "workers".

In this workshop, we will use a MinIO bucket created on MinIO instance local to
the platform cluster. Kratix supports both S3-compatible buckets as Git
repositories as the state store. Please check the [docs](../main/reference/statestore/intro) for further
details.

To install MinIO locally, run:

```bash
kubectl --context kind-platform apply --filename hack/platform/minio-install.yaml
```

The above command will:

- Deploy an instance of MinIO on the `kratix-platform-system` namespace
- Create a Secret with the MinIO credentials
- Run a Job to create a bucket called `kratix` on the MinIO instance. <br />

You can verify the installation by running:

```shell-session
$ kubectl --context kind-platform get deployments --namespace kratix-platform-system
NAME                                 READY   UP-TO-DATE   AVAILABLE   AGE
kratix-platform-controller-manager   1/1     1            1           1h
minio                                1/1     1            1           1h

$ kubectl --context kind-platform get jobs
NAME                  COMPLETIONS   DURATION   AGE
minio-create-bucket   1/1           3m5s       1h
```

Once the Job completes, let's make the MinIO bucket known to Kratix.

### Create the Kratix State Store {#statestore-setup}

The State Store represents the different backing storage options that Kratix can
write to. When registering a worker cluster with Kratix, you'll need to specify
which state store you want to use, and Kratix will write to it when scheduling
works to that cluster.

Go ahead and create a new State Store pointing to the MinIO bucket you just
created:

```yaml
cat << EOF | kubectl --context kind-platform apply -f -
apiVersion: platform.kratix.io/v1alpha1
kind: BucketStateStore
metadata:
  name: minio-store
  namespace: default
spec:
  endpoint: minio.kratix-platform-system.svc.cluster.local
  insecure: true
  bucketName: kratix
  secretRef:
    name: minio-credentials
EOF
```

<details>
<summary>State Store in details</summary>

The StateStore document contains the configuration needed to access the actual
backing storage.

On the example above, we created a new `BucketStateStore`, since we will be
using a MinIO bucket as storage, but you could use any other S3-compatible
storage like Amazon S3 and Google Cloud Storage.

The `spec` includes the details needed to access that specific kind of State
Store. On the example above, we configure the `endpoint` to the cluster address
of the MinIO server we deployed on the Platform cluster. Since MinIO is not
running with TLS enabled, we set `insecure` to true.

You can see the MinIO service on the `kratix-platform-system`:

```shell-session
$ kubectl --context kind-platform --namespace kratix-platform-system get service minio
NAME    TYPE       CLUSTER-IP     EXTERNAL-IP   PORT(S)        AGE
minio   NodePort   10.96.96.166   <none>        80:31337/TCP   17h
```

`bucketName` refers to the actual bucket on the MinIO server. The bucket needs
to exist prior to Kratix trying to use it. That's why we ran a Job to create the
`kratix` bucket during the MinIO setup.

Finally, `secretRef` points to a secret, on the same namespace as the State
Store, containing the credentials to access the store. For `BucketStateStore`,
Kratix expects to find an `accessKeyID` and a `secretAccessKey` when resolving
the secret. As part of the MinIO deployment, we created the necessary secret:

```shell-session
$ kubectl --context kind-platform describe secret minio-credentials
Name:         minio-credentials
Namespace:    default
Labels:       <none>
Annotations:  <none>

Type:  Opaque

Data
====
accessKeyID:      10 bytes
secretAccessKey:  10 bytes
```

For further details on State Stores, check the [State Store documentation
page](../main/reference/statestore/intro)

</details>

And with that, Kratix is fully installed and configured. Continue to the next
section to install your first Promise!

## Summary

Your platform is ready to receive Promises! Well done!

To recap the steps we took:
1. ✅&nbsp;&nbsp;Created a Platform cluster
1. ✅&nbsp;&nbsp;Installed Kratix on the `platform` cluster
1. ✅&nbsp;&nbsp;Installed MinIO on the `platform` cluster as the document store for our GitOps solution
1. ✅&nbsp;&nbsp;Told Kratix about the MinIO bucket


## 🎉 &nbsp; Congratulations!
✅&nbsp;&nbsp;Kratix is now installed. <br />
👉🏾&nbsp;&nbsp;Next you will [install an sample Kratix Promise](installing-a-promise).
