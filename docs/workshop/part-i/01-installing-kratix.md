---
description: Create a platform cluster, install and configure Kratix
title: Installing Kratix
id: installing-kratix
slug: ../installing-kratix
---

import useBaseUrl from '@docusaurus/useBaseUrl';
import PartialInstallCertManager from '../../_partials/installation/_install-cert-manager.md';

This is Part 1 of [a series](intro) illustrating how Kratix works. <br />
👉🏾 Next: [Install a Kratix Promise](installing-a-promise)

<hr />

**In this tutorial, you will**

- [learn more about Kratix as a framework](#what-is-kratix)
- [install and configure Kratix on a Kubernetes cluster](#install-kratix)

<img align="right" src={useBaseUrl('/img/logo_300_with-padding.png')} />

## What is Kratix? {#what-is-kratix}

Kratix is a framework used by platform teams to build the custom platforms tailored to their organisation.

### Using Kratix to build your platform you can

- use GitOps workflow and familiar Kubernetes-native constructs.
- co-create capabilities by providing a clear contract between application and platform teams through the definition and creation of “Promises”.This tutorial will talk more about Kratix Promises in [the next step](installing-a-promise).
- create a flexible platform with your paved paths as Promises.
- evolve your platform easily as your business needs change.
- start small on a laptop and expand to multi-team, multi-cluster, multi-region, and multi-cloud with a consistent API everywhere.

### Providing a Kratix-built platform allows your users to

- discover available services that are already fit-for-purpose.
- consume services on demand using standard Kubernetes APIs.
- move focus away from infrastructure toward adding product value.

<hr />

## Hands on: Installing Kratix {#install-kratix}

Before continuing, make sure to go back to [prerequisites](setup)
and follow the guide if you haven't done that already.

This guide will go through the following steps:

1. [Clone Kratix](#clone-kratix)
1. [Create the platform cluster](#platform-setup)
1. [Install Kratix](#kratix-setup)
1. [Set up the GitOps State Store](#gitops-setup)
1. [Create the Kratix State Store](#statestore-setup)

### Clone Kratix {#clone-kratix}

You will need the Kratix source code to complete this workshop. Clone the
project to your local machine and change into the directory:

```bash
git clone https://github.com/syntasso/kratix.git
cd kratix
```

### Create a Kubernetes cluster where you will install Kratix {#platform-setup}

One of the most powerful Kratix features is the ability platform teams have to
fully control the scheduling of work across extensive and diverse infrastructure, i.e., to
determine in which Kubernetes cluster (or other infrastructure) a certain workload should be deployed to.
Kratix leverages the GitOps toolkit to deliver this capability.

Kratix itself runs in Kubernetes. The first step in getting Kratix up and running is to create a Kubernetes cluster where you can install it. In this workshop, you will use `kind` to run Kubernetes clusters locally. Run the
following command to create a Kubernetes cluster and give it the name `platform`:

```bash
kind create cluster --name platform \
    --image kindest/node:v1.27.3 \
    --config config/samples/kind-platform-config.yaml
```

This command will create a cluster on the specified Kubernetes version and
update your local `.kube/config` with the credentials to access the cluster. You
are also providing `kind` with a config file to simplify accessing the services
running in the cluster.

Once the creation completes, you can reach the local platform cluster with the
`kind-platform` context.

Verify the cluster is ready:

```bash
export PLATFORM="kind-platform"
kubectl --context $PLATFORM cluster-info
```

The above command will give an output similar to:

```shell-session
Kubernetes control plane is running at https://127.0.0.1:XXXX
CoreDNS is running at https://127.0.0.1:55960/api/v1/...

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
```

:::tip
Note that You have now saved a local environment variable `PLATFORM` to make it easier for the ongoing commands in this workshop
:::

### Install cert-manager

<PartialInstallCertManager />

### Install Kratix {#kratix-setup}

To install Kratix, all you need is the Kratix distribution file.

Run the command below to deploy Kratix on the platform cluster:

```bash
kubectl --context $PLATFORM apply --filename https://github.com/syntasso/kratix/releases/latest/download/kratix.yaml
```

This command will create a Kratix deployment (in the
`kratix-platform-system` namespace). It will also install all the APIs (as Kubernetes CRDs) that
Kratix needs.

Verify that the Kratix CRDs are available:

```bash
kubectl --context $PLATFORM get crds | grep kratix
```

The above command will give an output similar to:

```shell-session
bucketstatestores.platform.kratix.io   2023-01-22T11:53:15Z
destinations.platform.kratix.io        2023-01-22T11:53:15Z
gitstatestores.platform.kratix.io      2023-01-22T11:53:15Z
promisereleases.platform.kratix.io     2023-01-22T11:53:15Z
promises.platform.kratix.io            2023-01-22T11:53:15Z
workplacements.platform.kratix.io      2023-01-22T11:53:15Z
works.platform.kratix.io               2023-01-22T11:53:15Z
```

:::info What are CRDs?

A Custom Resource (CR) is an extension of the Kubernetes API that is not
necessarily available in a default Kubernetes installation. It represents a
customisation of a particular Kubernetes installation.

A Custom Resource Definition (CRD) is the object you create to teach your
Kubernetes cluster about this new API.

Kratix comes with multiple API extensions (CRDs), as you see above.

Check the Kubernetes documentation for further details on [Custom
Resources](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
and [Custom Resources
Definition](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/).

:::

Verify the Kratix deployment:

```bash
kubectl --context $PLATFORM get deployments --namespace kratix-platform-system
```

The above command will give an output similar to:

```shell-session
NAME                                 READY   UP-TO-DATE   AVAILABLE   AGE
kratix-platform-controller-manager   1/1     1            1           1h
```

You can now tell Kratix which repositories it will use to deploy and manage the
workloads.

### Set up the GitOps State Store {#gitops-setup}

As mentioned above, Kratix leverages GitOps for deploying and reconciling
scheduled workloads. From a GitOps perspective, a Destination is the Kratix
model that captures how workload definitions should be stored and organised to
enable the appropriate infrastructure to be able to identify and reconcile the
workloads. Each Kratix Destination has a backing State Store which is either an
S3-compatible bucket or a Git repository. For this workshop we will use an
S3-compatible MinIO bucket created locally on a MinIO instance running in the
platform cluster. Please check the [docs](/main/reference/statestore/intro)
for further details.

To install the MinIO instance, run:

```bash
kubectl --context $PLATFORM apply --filename config/samples/minio-install.yaml
```

The above command will:

- Deploy an instance of MinIO on the `kratix-platform-system` namespace
- Create a Secret with the MinIO credentials
- Run a Job to create a bucket called `kratix` on the MinIO instance. <br />

Verify the installation:

```bash
kubectl --context $PLATFORM get deployments --namespace kratix-platform-system
```

The above command will give an output similar to:

```shell-session
NAME                                 READY   UP-TO-DATE   AVAILABLE   AGE
kratix-platform-controller-manager   1/1     1            1           1h
minio                                1/1     1            1           1h
```

Verify the Create Bucket job:

```
kubectl --context $PLATFORM get jobs
```

The above command will give an output similar to:

```shell-session
NAME                  COMPLETIONS   DURATION   AGE
minio-create-bucket   1/1           3m5s       1h
```

Once the Job completes, you are able register the MinIO bucket with Kratix.

### Create the Kratix State Store {#statestore-setup}

The State Store represents the various backing storage options to which Kratix
can write. When registering a worker cluster with Kratix, you will need to
specify the state store you intend to use. Kratix will then write to the
specified state store when scheduling workloads for deployment on that cluster.

Create a new State Store that points to the MinIO bucket we created on the previous
step:

```yaml
cat << EOF | kubectl --context $PLATFORM apply -f -
apiVersion: platform.kratix.io/v1alpha1
kind: BucketStateStore
metadata:
  name: default
spec:
  endpoint: minio.kratix-platform-system.svc.cluster.local
  insecure: true
  bucketName: kratix
  secretRef:
    name: minio-credentials
    namespace: default
EOF
```

The above command will give an output similar to:

```shell-session
bucketstatestore.platform.kratix.io/default created
```

<details>
<summary>More on the Kratix State Store</summary>

The State Store document contains the configuration needed to access the actual
backing storage.

In the example above, you created a new `BucketStateStore`, since a MinIO bucket
has been provisioned for storage, but you could use any other S3-compatible
storage like Amazon S3 and Google Cloud Storage.

The `spec` includes the details needed to access that specific kind of State
Store. On the example above, you configured the `endpoint` to the cluster address
of the MinIO server you deployed on the platform cluster. Since MinIO is running
in-cluster and without TLS enabled, it is necessary to set `insecure` to true.

You can see the MinIO service on the `kratix-platform-system`:

```bash
kubectl --context $PLATFORM --namespace kratix-platform-system get service minio
```

The above command will give an output similar to:

```shell-session
NAME    TYPE       CLUSTER-IP     EXTERNAL-IP   PORT(S)        AGE
minio   NodePort   10.96.96.166   <none>        80:31337/TCP   17h
```

`bucketName` refers to the actual bucket on the MinIO server. The bucket needs
to exist prior to Kratix trying to use it. As a part of setting up MinIO you
ran a Job to create the base `kratix` bucket.

Finally, `secretRef` points to a secret, in the same namespace as the State
Store, containing the credentials to access the store. For `BucketStateStore`,
Kratix expects to find an `accessKeyID` and a `secretAccessKey` when resolving
the secret. As part of the MinIO deployment, you also created the necessary secret:

```bash
kubectl --context $PLATFORM describe secret minio-credentials
```

The above command will give an output similar to:

```shell-session
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
page](/main/reference/statestore/intro)

</details>

And with that, Kratix is fully installed and configured. Continue to the next
section to install your first Promise!

## Summary

Your platform is ready to receive Promises! Well done!

To recap the steps you took:

1. ✅&nbsp;&nbsp;Created a platform cluster
1. ✅&nbsp;&nbsp;Installed Kratix on the platform cluster
1. ✅&nbsp;&nbsp;Installed MinIO on the platform cluster as the GitOps document store
1. ✅&nbsp;&nbsp;Told Kratix about the MinIO bucket

## 🎉 &nbsp; Congratulations

✅&nbsp;&nbsp;Kratix is now installed. <br />
👉🏾&nbsp;&nbsp;Next you will [install an sample Kratix Promise](installing-a-promise).
