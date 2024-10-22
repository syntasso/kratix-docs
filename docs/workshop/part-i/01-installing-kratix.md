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
- co-create capabilities by providing a clear contract between application and platform teams through the definition and creation of “Promises”. This tutorial will talk more about Kratix Promises in [the next step](installing-a-promise).
- create a flexible platform by providing your own paved paths as Promises.
- evolve your platform easily as your business needs change.
- start small on a laptop and expand to multi-team, multi-cluster, multi-region, and multi-cloud with a consistent API everywhere.

### Providing a Kratix-built platform allows your users to

- discover available services that are already fit-for-purpose.
- consume services on demand using standard Kubernetes APIs.
- move focus away from infrastructure toward adding product value into your platform.

<hr />

## Hands on: Installing Kratix {#install-kratix}

Before continuing, make sure to go back to [prerequisites](./part-0/intro)
and follow the guide if you haven't done that already.

You should also make sure you are currently in the `kratix` directory and have the following environment variables set:

```bash
export PLATFORM="kind-platform"
export WORKER="kind-worker"
```

This guide will go through the following steps:

1. [Install Kratix](#kratix-setup)
1. [Create the Kratix State Store](#statestore-setup)

### Install Kratix {#kratix-setup}

To install Kratix, all you need is the Kratix distribution file.

Run the command below to deploy Kratix on the platform cluster:

```bash
kubectl --context $PLATFORM apply --filename https://github.com/syntasso/kratix/releases/latest/download/kratix.yaml
```

This command will create a Kratix deployment (in the `kratix-platform-system` namespace). It will also install all the APIs (as Kubernetes CRDs) that Kratix needs.

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

<details>
<summary>What are CRDs?</summary>

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
</details>

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

### Create the Kratix State Store {#statestore-setup}

The State Store represents the various backing storage options to which Kratix
can write. When registering a worker cluster with Kratix, you will need to
specify the state store you intend to use. Kratix will then write to the
specified state store when scheduling workloads for deployment on that cluster.

Create a new State Store that points to the MinIO bucket we created in the previous tutorial:

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

At this point, your environment looks like this (with a few components omitted for clarity):

```mdx-code-block
import Topology01 from "/img/docs/workshop/topology-01.png"
```

<figure className="diagram">
  <img className="medium" src={Topology01} alt="Deployed resources with State Store" />

  <figcaption>Current environment: with Bucket State Store</figcaption>
</figure>

Although Kratix now knows about the State Store, it's not currently aware of any place that the workloads can actually run: there's no _Destination_ registered with the platform cluster.

### Register the Worker cluster as a Destination {#destination-setup}

In Kratix terms, a _Destination_ is any system _converging_ on the state
declared by Kratix.

You already have created a worker cluster as part of the previous tutorial. You will now register this cluster as a Destination.

:::info

Note that the order of operations here is not important; you could have registered the worker as a Destination first, and then created the worker cluster. Kratix would have scheduled to the State Store path representing the worker cluster, and the state would eventually be applied to a worker.

:::

It's important to note that Kratix makes no assumptions about the Destinations themselves. Although Destinations are often Kubernetes clusters, they may be any system that can interpret whatever state is being declared as desired.

For example, you may write a Promise that tells Kratix to declare Terraform
plans as desired state, and a Destination may be a system applying these
plans as they are written to the State Store.

To register the worker cluster, create a `Destination` object on your platform cluster:

```yaml
cat <<EOF | kubectl --context $PLATFORM apply --filename -
apiVersion: platform.kratix.io/v1alpha1
kind: Destination
metadata:
   name: worker-cluster
   labels:
    environment: dev
spec:
   stateStoreRef:
      name: default
      kind: BucketStateStore
EOF
```

The above command will give an output similar to:

```shell-session
destinations.platform.kratix.io/worker-cluster created
```

<details>
<summary>Destinations in detail</summary>

The Kratix Destination resource is the representation of a system where workloads can be scheduled to. Those systems are usually other Kubernetes clusters, but can be any system that can interpret the declared state.

The only required field is `spec.stateStoreRef`, which contains a reference to a State Store present in the platform. In this example, it points to the `default`
object you created on the previous step. The `spec.StateStoreRef.kind` specifies the kind of State Store being used by this Destination.

That means different Destinations can use different backing storage. For example, you can have a set of Destinations backed by Git, while another set of Destinations can be backed by a Bucket. Further configuration options pertaining paths are also available both in the [State Store](../main/reference/statestore/intro) and the [Destination object](../main/reference/destinations/intro).

</details>

With the Destinations registered, Kratix now has a place where it can run workloads!

In fact, as soon as a new Destination is registered, Kratix writes a test document to the State Store. You can use this test to validate that the entire system is wired up correctly.

First, check the MinIO `kratix` bucket:

```bash
mc ls -r kind
```

The above command will give an output similar to:

```shell-session
[2024-01-01 15:00:00 GMT]   116B STANDARD kratix/worker-cluster/dependencies/kratix-canary-namespace.yaml
[2024-01-01 15:00:00 GMT]   206B STANDARD kratix/worker-cluster/resources/kratix-canary-configmap.yaml
```

You can also inspect the contents of the test documents. For example, take the `kratix-canary-namespace.yaml`:

```bash
mc cat kind/kratix/worker-cluster/dependencies/kratix-canary-namespace.yaml
```

The above command will give an output similar to:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  creationTimestamp: null
  name: kratix-worker-system
spec: {}
status: {}
```

Since your worker cluster is already listening to this path within the bucket, you should see Flux automatically creating the namespace on the worker cluster as soon as it detects the change:

```bash
kubectl --context $WORKER get namespace kratix-worker-system
```

It may take a few minutes, but the above command will give an output similar to:

```shell-session
NAME                   STATUS   AGE
kratix-worker-system   Active   1m
```

You environment now looks like this:

```mdx-code-block
import Topology02 from "/img/docs/workshop/topology-02.png"
```

<figure className="diagram">
  <img className="large" src={Topology02} alt="Deployed resources with Destination" />

  <figcaption>Flux reconciled and created the test resources</figcaption>
</figure>

### Register the platform as a Destination

To register the platform cluster as an available Destination, you will run
through similar steps you ran during the worker cluster Destination registration:

* Install and configure Flux
* Register the cluster as a Destination with Kratix

There's a script in the `kratix` directory that will do exactly that. This script replicates the setup you performed previously in the [Destination setup](./installing-kratix#destination-setup) section. Run:

```bash
./scripts/register-destination --name platform-cluster --context $PLATFORM --state-store default --strict-match-labels
```

The platform cluster should now be registered with Kratix and ready to receive
the workloads. Verify:

```bash
kubectl --context $PLATFORM get destinations
```

The above command will give an output similar to:
```shell-session
NAME               AGE
platform-cluster    1m
worker-cluster      1h
```

Similar to when you registered the worker cluster, you should also see a `kratix-worker-system` namespace, indicating that Flux is correctly configured. Verify:

```bash
kubectl --context $PLATFORM get namespaces --watch
```

The above command will give an output similar to:
```shell-session
NAME                     STATUS   AGE
...
kratix-platform-system   Active    1h
//highlight-next-line
kratix-worker-system     Active    1m
...
```

Once you see `kratix-worker-system` on the output,
press <kbd>Ctrl</kbd>+<kbd>C</kbd> to exit the watch mode.

Kratix is now fully installed and configured, and can start deploying Promises and resources to your clusters.

## Summary

Your platform is ready to receive Promises! Well done!

To recap the steps you took:

1. ✅&nbsp;&nbsp;Installed Kratix on the platform cluster
1. ✅&nbsp;&nbsp;Told Kratix about the MinIO bucket, as a Bucket State Store
1. ✅&nbsp;&nbsp;Told Kratix about the worker and platform clusters, as Destinations

## 🎉 Congratulations
✅ Kratix is now installed and configured! <br />
👉🏾 [Next you will deploy your first Promise](./installing-a-promise).
