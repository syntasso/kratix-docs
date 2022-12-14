---
description: Guides on how to create Composite Promises
title: Composite Promise
---

```mdx-code-block
import PartialPreRequisites from '../../_partials/_generic_prereqs.md';
```
<!-- remark-abbr terms -->
*[WCR]: Worker Cluster Resources
*[WCRs]: Worker Cluster Resources
*[CRD]: Custom Resource Definition
*[CRDs]: Custom Resource Definition

Composite Promises are Promises that, in its WCR, contain other Promises. That
ability allows Platform teams deliver entire stacks on demand, instead of
simple databases or services.

**In this tutorial, you will**

1. encapsulate multiple Promises into a Composite Promise
1. request a complete development environment through a Composite Promise

<PartialPreRequisites />

## Register the Platform as a Worker

To install a Composite Promises, the first step is to register the Platform cluster itself
as an available Worker Cluster. That's because the WCR for the Composite Promises are
Promises themselves, hence need to be scheduled to the Platform cluster.

Create a new [Cluster document](../reference/clusters/intro) `platform-cluster.yaml` with the
following contents:

```yaml title="platform-cluster.yaml"
apiVersion: platform.kratix.io/v1alpha1
kind: Cluster
metadata:
  name: platform-cluster
  labels:
    environment: platform
spec:
  id: platform-cluster
  bucketPath: platform
```

Register the Cluster:

```bash
kubectl --context kind-platform apply --filename platform-cluster.yaml
```

## Install and configure GitOps

For the Platform Cluster to behave like a Worker Cluster, you will need to install the
GitOps toolkit in it. The quickest way to do that is to run the `./scripts/install-gitops`
script from the Kratix root directory:

```bash
cd /path/to/kratix
./scripts/install-gitops --context kind-platform --bucket-path platform
```

## Install a Composite Promise

You can now install a "Paved Path" Promise:

```bash
kubectl --context kind-platform apply --filename https://raw.githubusercontent.com/syntasso/kratix/main/samples/paved-path-demo/paved-path-demo-promise.yaml
```

This Promise is composed of a Knative and Postgres. Installing the Promise on the Platform
will have the following side-effects:

- Three Promises will be installed in the Platform Cluster: Paved Path, Knative and Postgres.
- The Knative and Postgres's WCR will be installed on the Worker Cluster.

To verify the installation was successful, run:

```shell-session
$ kubectl --context kind-platform get promises
NAME                      AGE
ha-postgres-promise       1h
knative-serving-promise   1h
paved-path-demo-promise   1h

$ kubectl --context kind-worker get pods -A
NAME                                 READY   STATUS    RESTARTS   AGE
postgres-operator-6c6dbd4459-kv5lw   1/1     Running   0          1h

$ kubectl --context kind-worker get crds | grep knative
certificates.networking.internal.knative.dev          2022-11-25T12:24:20Z
clusterdomainclaims.networking.internal.knative.dev   2022-11-25T12:24:20Z
...
```

## Send a Resource Request

Platform users can now send Resource Requests for a new "Paved Path". That will create a
new Knative Serving and a new Postgres database in the Worker Cluster:

```bash
kubectl --context kind-platform apply --filename https://raw.githubusercontent.com/syntasso/kratix/main/samples/paved-path-demo/paved-path-demo-resource-request.yaml
```

You can see the pipeline for the Paved Path Promise running, which will in turn trigger
the Knative and Postgres pipelines:

```shell-session
$ kubectl --context kind-platform get pods
NAME                                                     READY   STATUS      RESTARTS   AGE
request-pipeline-ha-postgres-promise-default-617a3       0/1     Completed   0          64s
request-pipeline-knative-serving-promise-default-e0157   0/1     Completed   0          64s
request-pipeline-paved-path-demo-promise-default-d3a89   0/1     Completed   0          87s
```

Eventually, the resources will be ready to be used:

```shell-session
$ kubectl --context kind-worker get pods -A
NAMESPACE            NAME                          READY   STATUS      RESTARTS   AGE
default              acid-minimal-cluster-0        1/1     Running     0          1h
default              acid-minimal-cluster-1        1/1     Running     0          1h
...
knative-serving      activator-7d967fb5f4-4k4m5    1/1     Running     0          1h
knative-serving      autoscaler-684b55df5f-7gw86   1/1     Running     0          1h
knative-serving      controller-65866d54fc-zfh8d   1/1     Running     0          1h
knative-serving      default-domain-dl972          0/1     Completed   0          1h
...
```

🎉 **Congratulations**: you have installed a Composite Promise and created an instance of the Paved Path!

## A closer look in the Promise

Start by noticing the `workerClusterResources` for the Paved Path Promise:

```yaml
apiVersion: platform.kratix.io/v1alpha1
kind: Promise
metadata:
  name: paved-path-demo-promise
spec:
  clusterSelector:
    environment: platform
  workerClusterResources:
    #highlight-start
    - apiVersion: platform.kratix.io/v1alpha1
      kind: Promise
      #highlight-end
      metadata:
        name: knative-serving-promise
      spec:
        clusterSelector:
          environment: dev
        workerClusterResources:
        # remainder of the knative promise
    #highlight-start
    - apiVersion: platform.kratix.io/v1alpha1
      kind: Promise
      #highlight-end
      metadata:
        name: ha-postgres-promise
      spec:
        clusterSelector:
          environment: dev
        workerClusterResources:
        # remainder of the postgres promise ...
  # remainder of the paved path promise...
```

Since Paved Path Promise WCRs are Promises, and considering that Kratix (and
its CRDs) is only installed in the Platform Cluster, you need to ensure the WCR is
applied exclusively to the Platform Cluster.

That is controlled by the `clusterSelector`:

```yaml
apiVersion: platform.kratix.io/v1alpha1
kind: Promise
metadata:
  name: paved-path-demo-promise
spec:
  #highlight-start
  clusterSelector:
    environment: platform
  #highlight-end
  workerClusterResources:
    -  # knative Promise
    -  # postgresPromise
  # remainder of the paved path promise
```

The Paved Path Promise `clusterSelector` is set to `environment: platform`. That is
telling Kratix to install the sub-Promises into Clusters with a
`environment: platform` label.

You may have noticed that, when registering the Platform Cluster, the Cluster definition
included exactly that label. You can verify the applied labels with:

```shell-session
$ kubectl --context kind-platform get clusters.platform.kratix.io --show-labels
NAME                 AGE    LABELS
#highlight-start
platform-cluster     1hr    environment=platform
#highlight-end
worker-cluster-1     1hr    environment=dev
```

However, the sub-Promises WCR (i.e. the Knative and Postgres WCR) should not be installed
in the Platform Cluster, but in the Worker Cluster. When you executed the quick start
script, it registered the Worker Cluster with a label `environment: dev` (as
per output above). The `clusterSelector` field in the sub-Promises are set to
exactly that:

```yaml showLineNumbers
apiVersion: platform.kratix.io/v1alpha1
kind: Promise
metadata:
  name: paved-path-demo-promise
spec:
  clusterSelector:
    environment: platform
  workerClusterResources:
    - apiVersion: platform.kratix.io/v1alpha1
      kind: Promise
      metadata:
        name: knative-serving-promise
      spec:
        #highlight-start
        clusterSelector:
          environment: dev
        #highlight-end
        workerClusterResources:
        # remainder of the knative promise
    - apiVersion: platform.kratix.io/v1alpha1
      kind: Promise
      metadata:
        name: ha-postgres-promise
      spec:
        #highlight-start
        clusterSelector:
          environment: dev
        #highlight-end
        workerClusterResources:
        # remainder of the postgres promise ...
  # remainder of the paved path promise...
```

This configuration ensures the Knative CRDs and the Postgres Operator are installed
exclusively in the Worker Cluster. This is how, when installing the Paved Path Promise,
Kratix knew it should install the sub-Promises in the Platform Cluster and the
sub-Promises dependencies in the Worker Cluster.

## A closer look in the Pipeline

When a Resource Request is created, the Paved Path Pipeline is triggered. Usually, the
output of the pipeline is a set of Kubernetes Resources that need to be created. For
Composite Promises, that's usually a set of Resource Requests to be applied in the
Platform itself.

The Paved Path Promise is a very basic example, but you can see that's exactly what the
pipeline is doing in its
[Dockerfile](https://github.com/syntasso/kratix/blob/main/samples/paved-path-demo/request-pipeline-image/Dockerfile#L6-L11).

## 🎉 Congratulations

✅ &nbsp; You have just installed and used your first Composite Promise. <br/>
👉 &nbsp; Let's see [where to go from here](./whats-next).
