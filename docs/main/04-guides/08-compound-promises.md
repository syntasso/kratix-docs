---
description: Learn how to combine multiple promises into a single Compound Promise, delivering full developer experiences
title: Compound Promise
---

```mdx-code-block
import PartialPreRequisites from '../../_partials/_generic_prereqs_guides.md';
```
<!-- remark-abbr terms -->
*[Dep]: Dependency
*[Deps]: Dependencies
*[CRD]: Custom Resource Definition
*[CRDs]: Custom Resource Definitions

Compound Promises are Promises that, in its Dependencies, contain other Promises. That ability allows Platform teams deliver entire stacks on demand, instead of simple databases or services.

**In this tutorial, you will**

1. encapsulate multiple Promises into a Compound Promise
1. request a complete development environment Resource through a Compound Promise

<PartialPreRequisites />

## Register the Platform as a Worker

To install a Compound Promises, the first step is to register the Platform cluster itself as an available Destination. That's because the Dependencies for the Compound Promises are Promises themselves, therefore they need to be scheduled to the Platform cluster.

Create a new [Destination document](../reference/destinations/intro) platform-cluster.yaml` with the following contents:

```yaml title="platform-cluster.yaml"
apiVersion: platform.kratix.io/v1alpha1
kind: Destination
metadata:
  name: platform-cluster
  labels:
    environment: platform
spec:
  stateStoreRef:
    name: default
    kind: BucketStateStore
```

Register the Destination:

```bash
kubectl --context $PLATFORM apply --filename platform-cluster.yaml
```

## Install and configure GitOps

For the Platform cluster to sync as a worker, you will need to install the GitOps toolkit in it. The quickest way to do that is to run the `./scripts/install-gitops` script from the Kratix root directory:

```bash
cd /path/to/kratix
./scripts/install-gitops --context $PLATFORM --path platform-cluster
```

## Install a Compound Promise

You can now install a "Paved Path" Promise:

```bash
kubectl --context $PLATFORM apply --filename https://raw.githubusercontent.com/syntasso/kratix/main/samples/paved-path-demo/paved-path-demo-promise.yaml
```

This Promise is composed of a Knative and Postgres. Installing the Promise on the Platform will have the following side-effects:

- Three Promises will be scheduled to the platform Destination: Paved Path, Knative and Postgres.
- The Knative and Postgres's Dependencies will be scheduled to the worker Destination

To verify the installation was successful, run:

```shell-session
$ kubectl --context $PLATFORM get promises
NAME                      AGE
ha-postgres-promise       1h
knative-serving-promise   1h
paved-path-demo-promise   1h

$ kubectl --context $WORKER get pods -A
NAME                                 READY   STATUS    RESTARTS   AGE
postgres-operator-6c6dbd4459-kv5lw   1/1     Running   0          1h

$ kubectl --context $WORKER get crds | grep knative
certificates.networking.internal.knative.dev          2022-11-25T12:24:20Z
clusterdomainclaims.networking.internal.knative.dev   2022-11-25T12:24:20Z
...
```

## Send a request for a Resource

Platform users can now send requests for a new "Paved Path" Resource. That will create a new Knative Serving and a new Postgres database in the worker cluster:

```bash
kubectl --context $PLATFORM apply --filename https://raw.githubusercontent.com/syntasso/kratix/main/samples/paved-path-demo/paved-path-demo-resource-request.yaml
```

You can see the Workflow for the Paved Path Promise running, which will in turn trigger the Knative and Postgres Workflows:

```shell-session
$ kubectl --context $PLATFORM get pods
NAME                                                     READY   STATUS      RESTARTS   AGE
configure-pipeline-ha-postgres-promise-default-617a3       0/1     Completed   0          64s
configure-pipeline-knative-serving-promise-default-e0157   0/1     Completed   0          64s
configure-pipeline-paved-path-demo-promise-default-d3a89   0/1     Completed   0          87s
```

Eventually, the resources will be ready to be used:

```shell-session
$ kubectl --context $WORKER get pods -A
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

🎉 **Congratulations**: you have installed a Compound Promise and requested a Paved Path Resource!

## A closer look in the Promise

Start by noticing the `dependencies` for the Paved Path Promise:

```yaml
apiVersion: platform.kratix.io/v1alpha1
kind: Promise
metadata:
  name: paved-path-demo-promise
spec:
  scheduling:
    - target:
        matchLabels:
          environment: platform
  dependencies:
    #highlight-start
    - apiVersion: platform.kratix.io/v1alpha1
      kind: Promise
      #highlight-end
      metadata:
        name: knative-serving-promise
      spec:
        scheduling:
          - target:
              matchLabels:
                environment: dev
        dependencies:
        ... # remainder of the knative Promise
    #highlight-start
    - apiVersion: platform.kratix.io/v1alpha1
      kind: Promise
      #highlight-end
      metadata:
        name: ha-postgres-promise
      spec:
        scheduling:
          - target:
              matchLabels:
                environment: dev
        dependencies:
        ... # remainder of the postgres Promise
  ... # remainder of the paved path Promise...
```

Since Paved Path Promise Dependencies are Promises, and considering that Kratix and its CRDs are only installed in the Platform cluster, you need to ensure the Dependencies are applied exclusively to the Platform cluster.

That is controlled by the `scheduling` key:

```yaml
apiVersion: platform.kratix.io/v1alpha1
kind: Promise
metadata:
  name: paved-path-demo-promise
spec:
  #highlight-start
  scheduling:
    - target:
        matchLabels:
          environment: platform
  #highlight-end
  dependencies:
    -  # knative Promise
    -  # postgresPromise
  ... # remainder of the paved path Promise
```

The Paved Path Promise `scheduling` is set to target clusters with `matchLabel`
equal to `environment: platform`. In other words, that is telling Kratix to
install the sub-Promises into Destinations with an `environment: platform` label.

You may have noticed that, when registering the Platform Destination, the Destination definition
included exactly that label. You can verify the applied labels with:

```shell-session
$ kubectl --context $PLATFORM get destinations.platform.kratix.io --show-labels
NAME                 AGE    LABELS
#highlight-start
platform-cluster     1hr    environment=platform
#highlight-end
worker-cluster-1     1hr    environment=dev
```

However, the sub-Promises' Dependencies (i.e. the Knative and Postgres Dependencies) should not be installed
in the Platform cluster, but in the worker cluster. When you executed the quick start
script, it registered the worker cluster as a Destination with a label `environment: dev` (as
per output above). The `scheduling` field in the sub-Promises are set to target
those clusters:

```yaml showLineNumbers
apiVersion: platform.kratix.io/v1alpha1
kind: Promise
metadata:
  name: paved-path-demo-promise
spec:
  scheduling:
    - target:
        matchLabels:
          environment: platform
  dependencies:
    - apiVersion: platform.kratix.io/v1alpha1
      kind: Promise
      metadata:
        name: knative-serving-promise
      spec:
        #highlight-start
        scheduling:
          - target:
              matchLabels:
                environment: dev
        #highlight-end
        dependencies:
        ... # remainder of the knative Promise
    - apiVersion: platform.kratix.io/v1alpha1
      kind: Promise
      metadata:
        name: ha-postgres-promise
      spec:
        #highlight-start
        scheduling:
          - target:
              matchLabels:
                environment: dev
        #highlight-end
        dependencies:
        ... # remainder of the postgres Promise ...
  ... # remainder of the paved path Promise...
```

This configuration ensures the Knative CRDs and the Postgres Operator are installed
exclusively in the worker. This is how, when installing the Paved Path Promise,
Kratix knew it should install the sub-Promises in the Platform cluster and the
sub-Promises' Dependencies in the worker.

## A closer look in the Workflow

When a request for a Resource is created, the Paved Path Workflow is triggered. Usually, the
output of the Workflow is a set of Kubernetes Resources that need to be created. For
Compound Promises, that's usually a set of requests for other promised Resources to be applied in the Platform itself.

The Paved Path Promise is a very basic example, but you can see that's exactly what the
Workflow Pipeline is doing in its
[Dockerfile](https://github.com/syntasso/kratix/blob/main/samples/paved-path-demo/configure-pipeline-image/Dockerfile#L6-L11).

## 🎉 Congratulations

✅ &nbsp; You have just installed and used your first Compound Promise. <br/>
👉 &nbsp; Let's see [where to go from here](./whats-next).
