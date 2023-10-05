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
- [learn about configuring a worker cluster](#configure-worker)

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
1. [Setup worker cluster](#configure-worker)
1. [Setup platform cluster as a worker](#register-the-platform-as-a-worker)

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
kubectl --context $PLATFORM apply --filename distribution/kratix.yaml
```

This command will create a Kratix deployment (in the
`kratix-platform-system` namespace). It will also install all the APIs (as Kubernetes CRDs) that
Kratix needs.

Verify that the Kratix CRDs are available:

```bash
kubectl --context $PLATFORM get crds
```

The above command will give an output similar to:

```shell-session
NAME                                         CREATED AT
bucketstatestores.platform.kratix.io         2023-05-22T12:02:41Z
destinations.platform.kratix.io              2023-05-22T12:02:41Z
gitstatestores.platform.kratix.io            2023-05-22T12:02:41Z
promises.platform.kratix.io                  2023-05-22T12:02:41Z
workplacements.platform.kratix.io            2023-05-22T12:02:42Z
works.platform.kratix.io                     2023-05-22T12:02:42Z
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

As mentioned above, Kratix leverages GitOps for deploying and reconciling scheduled workloads. From a GitOps perspective, a Destination is the Kratix model that captures how workload definitions should be stored and organised to enable the appropriate infrastructure to be able to identify and reconcile the workloads. Each Kratix Destination has a backing State Store which is either an S3-compatible bucket or a Git repository. For this workshop we will use an S3-compatible MinIO bucket created locally on a MinIO instance running in the platform cluster. Please check the [docs](../main/reference/statestore/intro) for further details.

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
  name: minio-store
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
bucketstatestore.platform.kratix.io/minio-store created
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
page](../main/reference/statestore/intro)

</details>

### Set up a worker cluster {#configure-worker}

#### Create the Kubernetes cluster

You will create a second Kubernetes cluster with `kind`, and this cluster will be
dedicated to running the Kratix workloads.

From the `kratix` directory, create a new cluster:

```bash
kind create cluster --name worker \
    --image kindest/node:v1.27.3 \
     --config config/samples/kind-worker-config.yaml
```

Similar to when you created the platform cluster, `kind` will update your local
configuration with the details to access the worker cluster. This command also
provides `kind` with a configuration file to facilitate accessing the deployed
services later on.

Once the creation completes, you can reach your worker cluster on the
`kind-worker` context.

Verify the cluster is ready:

```bash
export WORKER="kind-worker"
kubectl --context $WORKER cluster-info
```

The above command will give an output similar to:

```shell-session
Kubernetes control plane is running at https://127.0.0.1:YYYYY
CoreDNS is running at https://127.0.0.1:59160/api/v1/...

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
```

:::tip
Note that You have now saved a local environment variable `WORKER` to make it easier for the ongoing commands in this workshop
:::

Before registering the worker cluster with the platform, you will need to make it ready to
receive the workloads.

#### Configure the cluster

Kratix schedules works by writing a state declaration (following Kubernetes
declare-and-converge pattern) to the designated State Store. When it comes to
reconciling the declared state, Kratix remains agnostic about the specific tool
to be used on the clusters. In this tutorial, you will utilise
[Flux](https://fluxcd.io/) on the worker, and configure it to reconcile the
state from the MinIO bucket.

To install and configure Flux, run the following script from the Kratix
repository:

```bash
./scripts/install-gitops --context $WORKER --path worker-cluster
```

The script above will:

- Install Flux
- Create a new Flux `Bucket` Source
- Create two Flux `Kustomizations`

The Flux `Kustomizations` are responsible for continuously reconciling with the state
declared in the `Source`.

<details>
<summary>Configuring the cluster: the manual way</summary>

If you prefer to configure the worker cluster manually, follow the steps below.

Install Flux on the worker cluster:

```bash
kubectl --context $WORKER \
  apply \
  --filename https://github.com/fluxcd/flux2/releases/download/v2.0.0-rc.3/install.yaml
```

Next, Flux must be configured to read from the MinIO bucket. For that, you will create a new
Flux [Bucket Source](https://fluxcd.io/flux/components/source/buckets/),
together with a Secret containing the bucket credentials.

:::caution

You may notice that the value of the Bucket `endpoint` on the document below is
set to `172.18.0.2:31337`.

In the previous tutorial you were able to access the server with in-cluster Kubernetes
DNS. Since Flux now need to access MinIO _across_ clusters you will need to use
an externally available endpoint.

`172.18.0.2` will often be the address of the platform cluster running on KinD.
You can confirm this address with the following command:

```bash
docker inspect platform-control-plane | grep '"IPAddress": "172' | awk -F '"' '{print $4}'
```

The above command will give an output similar to:

```shell-session
172.18.0.2
```

If the command above outputs a different IP, make sure to update the Bucket
configuration below accordingly.

The port part of the endpoint should always be 31337. Verify the NodePort of the
MinIO service in the platform cluster:

```bash
kubectl --context $PLATFORM get services minio --namespace kratix-platform-system
```

The above command will give an output similar to:

```shell-session
NAME    TYPE       CLUSTER-IP    EXTERNAL-IP   PORT(S)        AGE
minio   NodePort   10.96.45.28   <none>        80:31337/TCP   1h
```

:::

Create the Flux Source Bucket (and Secret):

```yaml
cat <<EOF | kubectl --context $WORKER apply -f -
---
apiVersion: v1
kind: Secret
metadata:
  name: minio-credentials
  namespace: flux-system
type: Opaque
stringData:
  accesskey: minioadmin
  secretkey: minioadmin
---
apiVersion: source.toolkit.fluxcd.io/v1beta1
kind: Bucket
metadata:
  name: kratix-bucket
  namespace: flux-system
spec:
  interval: 10s
  provider: generic
  bucketName: kratix
  endpoint: 172.18.0.2:31337 # make sure to read the caution box above
  insecure: true
  secretRef:
    name: minio-credentials
EOF
```

The above command will give an output similar to:

```shell-session
secret/minio-credentials created
bucket.source.toolkit.fluxcd.io/kratix-bucket created
```

This tutorial will not dive into details of how to configure Flux Sources, but please read on their
[documentation](https://fluxcd.io/flux/components/source/) if you are curious.

Once the Bucket Source is created, validates Flux can reach the bucket:

```bash
kubectl --context $WORKER get buckets.source.toolkit.fluxcd.io --namespace flux-system
```

The above command will give an output similar to:

```shell-session
NAME            ENDPOINT           AGE     READY   STATUS
kratix-bucket   172.18.0.2:31337   1h      True    stored artifact: revision 'sha256:some-sha'
```

Next, you must tell Flux what is must do with this Source. Flux does continuous
delivery through the [Kustomize
Controller](https://fluxcd.io/flux/components/kustomize/). You can define a Flux
`Kustomization` that watches for a Source and reconciles on events.

Create the Flux Kustomizations:

```yaml
cat <<EOF | kubectl --context $WORKER apply --filename -
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: kratix-workload-dependencies
  namespace: flux-system
spec:
  interval: 8s
  prune: true
  sourceRef:
    kind: Bucket
    name: kratix-bucket
  path: ./worker-cluster/dependencies
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: kratix-workload-resources
  namespace: flux-system
spec:
  interval: 3s
  prune: true
  dependsOn:
  - name: kratix-workload-dependencies
  sourceRef:
    kind: Bucket
    name: kratix-bucket
  path: ./worker-cluster/resources
EOF
```

The above command will give an output similar to:

```shell-session
kustomization.kustomize.toolkit.fluxcd.io/kratix-workload-dependencies created
kustomization.kustomize.toolkit.fluxcd.io/kratix-workload-resources created
```

You will notice that there are two Kustomizations created. When scheduling
workloads, Kratix will separate the documents based on their GVK (Group, Version,
Kind):

- Custom Resource Definition (as defined
  [here](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.27/#customresourcedefinition-v1-apiextensions-k8s-io))
  will be written to a specific `crds` path within the State Store.
- All other documents will be written to a specific `resources` path within the
  State Store.

Later when you register the cluster as a Destination, Kratix will use the cluster's `namespace`
and `name` to build the full path for that cluster within the State Store.

The first Kustomization above is for the CRDs, while the second is for the other
resources (note the `spec.path`). You can also note that the
`kratix-workload-resources` depends on the `kratix-workload-dependencies`. That's to
avoid failures when a resource documents uses a GVK being defined by a CRD
document.

For further details on the naming convention for the buckets and paths, check
the [documentation](../main/reference/statestore/intro). For more on
Kustomizations, check [the Flux docs
page](https://fluxcd.io/flux/components/kustomize/kustomization/)

</details>

Wait for Flux to start:

```bash
kubectl --context kind-worker get deployments --namespace flux-system --watch
```

The above command will give an output similar to:

```shell-session
NAME                      READY   UP-TO-DATE   AVAILABLE   AGE
helm-controller           1/1     1            1           10m
kustomize-controller      1/1     1            1           10m
notification-controller   1/1     1            1           10m
source-controller         1/1     1            1           10m
```

Once the Ready column reports `1/1`, press <kbd>Ctrl</kbd>+<kbd>C</kbd> to
exit the watch mode.

#### Register the cluster with Kratix

With the worker cluster ready, you can now register it with Kratix. Note that the
order of operations here is not important; you could have registered the worker
first and then followed th steps above. Kratix would have scheduled to the State
Store path representing the worker cluster, and the state would eventually be
applied to a worker.

To register a cluster, create a `Destination` object on your platform cluster:

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
      name: minio-store
      kind: BucketStateStore
EOF
```

The above command will give an output similar to:

```shell-session
cluster.platform.kratix.io/worker-cluster created
```

<details>
<summary>Destination in detail</summary>

The Kratix Destination resource is the representation of a system where workloads
can be scheduled to. Those system are usually other Kubernetes clusters.

The only required field is `spec.stateStoreRef`. It contains a reference to a State
Store present in the platform. In this example, it points to the `minio-store`
object you created on the previous step. The `spec.StateStoreRef.kind` determines
what is the kind of State Store being used by this Destination.

That means different Destinations can use different backing storage. For example,
you can have a set of Destinations backed by Git, while another set of Destinations can
be backed by a Bucket. Further configuration options pertaining paths are also
available both in the [State Store](../main/reference/statestore/intro) and the
[Destination object](../main/reference/destinations/intro).

</details>

### Register the platform as a worker

To register the platform cluster as an available worker cluster, you will run
through the same steps as before:

* Install and configure Flux
* Register the cluster with Kratix

There's a script in the `kratix` directory that will do exactly that. Run:

```bash
./scripts/register-destination --name platform-cluster --with-label environment=platform --context $PLATFORM --state-store minio-store
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

You should also see a `kratix-worker-system` namespace, indicating that Flux is
correctly configured. Verify:

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


And with that, Kratix is fully installed and configured. Continue to the next
section to install your first Promise!

## Summary

Your platform is ready to receive Promises! Well done!

To recap the steps you took:

1. ✅&nbsp;&nbsp;Created a platform cluster
1. ✅&nbsp;&nbsp;Installed Kratix on the platform cluster
1. ✅&nbsp;&nbsp;Installed MinIO on the platform cluster as the GitOps document store
1. ✅&nbsp;&nbsp;Told Kratix about the MinIO bucket
1. ✅&nbsp;&nbsp;Registered the Platform and Worker clusters with Kratix

## 🎉 &nbsp; Congratulations

✅&nbsp;&nbsp;Kratix is now installed. <br />
👉🏾&nbsp;&nbsp;Next you will [install an sample Kratix Promise](installing-a-promise).
