---
description: Learn more about the Scheduling Promises and Workloads
title: Scheduling
---

*[WCR]: Worker Cluster Resource
*[WCRs]: Worker Cluster Resources

One of the most powerful Kratix features is the ability Platform teams have to
fully control scheduling of work across Kubernetes Cluster. Scheduling happens
in two stages:

1. Determining which Promises are installed in which Clusters ([Scheduling
   Promises](#promises))
1. Determining where the workloads will run following a Resource Requests ([Scheduling Workloads](#workloads))

The following sections in this page document those stages. For hands-on scheduling guides,
check the [Adding a new Worker Cluster](../guides/scheduling-clusters) and [Composite
Promise](../guides/composite-promises) pages.

## Scheduling Promises {#promises}

By default, all Clusters registered with the Platform will have all the Promises Worker
Cluster Resources installed in it. In other words, all registered Clusters will be ready
to run workloads for all Promises. When a new Cluster is registered, Kratix will
automatically install the WCRs for the Promises that are already installed in the
Platform.

Platform teams can, however, control which Clusters receive which Promises by using a
combination of Cluster labels and Promise Cluster selectors.

The `labels` in the Cluster document are the standard Kubernetes
[labels](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/):
simple, arbitrary, key/value pairs. In the example below, the Cluster object is being
created with a label `environment` with value `dev`:


```yaml title="worker-cluster-2.yaml"
apiVersion: platform.kratix.io/v1alpha1
kind: Cluster
metadata:
  # highlight-start
  labels:
    environment: dev
  # highlight-end
  # ...
```

In the Promise document, the `clusterSelector` [label
selector](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#label-selectors)
defines in which Clusters the Promise resources should be installed. The `clusterSelector`
is a _equality-based_ selector, i.e., it will only match Clusters that have keys/values
that match. You can add multiple key/value pairs to the `clusterSelector`, but note that
it will only match when the Cluster has a matching label for _all_ the selectors.

```yaml title=jenkins-promise.yaml
apiVersion: platform.kratix.io/v1alpha1
kind: Promise
metadata:
  name: jenkins-promise
spec:
  #highlight-start
  clusterSelector:
    environment: dev
  #highlight-end
  workerClusterResources:
  # ...
```

If a Promise has no `clusterSelector`, it will be applied to all Clusters. If a Cluster
has no `labels`, only Promises with no `clusterSelector` will be applied.

The table below contains a few examples:

  Cluster Label                  |  Promise Selector               |  Match?
---------------------------------|---------------------------------|-------
  _no label_                     |  _no selector_                  |  ✅
  `env: dev`                     |  _no selector_                  |  ✅
  `env: dev`                     |  `env: dev`                     |  ✅
  `env: dev` <br /> `zone:eu`    |  `env: dev`                     |  ✅
  `env: dev` <br /> `zone:eu`    |  `env: dev` <br /> `zone:eu` |  ✅
  `env: dev`                     |  `env: prod`                    |  ⛔️
  `env: dev`                     |  `env: dev` <br /> `zone:eu` |  ⛔️
   _no label_                    |  `env: dev`                     |  ⛔️

## Scheduling Workloads {#workload}

When a new Resource Request comes in, Kratix reacts by triggering the Request Pipeline, as
defined in the Promise's `spec.xaasRequestPipeline`. The output of the pipeline will be
then written to the Repository, which will in turn be applied to one of the registered
Worker Clusters.

By default, Kratix will randomly select a registered Cluster to instantiate the workload.
If the Promise has `spec.clusterSelector` set, the workload will be scheduled to a Cluster
that has matching labels.

It is possible to dynamically determine where workloads will go at the Pipeline stage. The
section below documents the process.

### Dynamic Scheduling {#pipeline}

Kratix mounts a `metadata` directory at the root of the pipeline's container when
instantiating the Request Pipeline. At scheduling time, Kratix will look for a
`cluster-selectors.yaml` file in that directory with arbitrary key/value pairs and will
**add** those to what is already present in the Promise's `spec.clusterSelector` when
filtering Clusters.

That means there's no overwrite of keys. For example, if the Promise defines a
`clusterSelector: { env: dev }` and the Pipeline defines `env: prod`, Kratix will look for
Clusters with labels: `env=dev && env=prod` [^1].

[^1]: This will always return empty, since a label `key` can only hold a single value.

The table below contains a few examples:

  Cluster Label                  |  Promise Selector               | cluster-selectors.yaml | Match?
---------------------------------|---------------------------------| ---------------------- | -------
  _no label_                     |  _no selector_                  | _no_selector_          | ✅
  `env: dev`                     |  _no selector_                  | _no_selector_          | ✅
  `env: dev`                     |  `env: dev`                     | _no_selector_          | ✅
  `env: dev` <br /> `zone: eu`   |  `env: dev`                     | `zone: eu`             | ✅
  `env: dev` <br /> `zone: eu`   |  _no selector_                  | `zone: eu`             | ✅
  `env: dev`                     |  `env: dev`                     | `env: prod`            | ⛔️
  `env: dev`                     |  `env: prod`                    | `env: dev`             | ⛔️
  `env: dev`                     |  `env: dev` <br /> `zone: eu`   | _no_selector_          | ⛔️
   _no label_                    |  _no_selector_                  | `env: dev`             | ⛔️


In the event that more than one cluster matches the resulting labels, Kratix will randomly select within the available matching registered Clusters. If you prefer to be certain of a single cluster match, it is suggested that you add a unique identifier to all clusters (e.g. `clusterName`) so that there can only ever be a single match.

## Composite Promises

Composite Promises are Promises that, in its WCRs, contain other Promises. That ability
allows Platform teams deliver entire stacks on demand, instead of simple databases or
services.

To enable this functionality, the following needs to be true:

* The Platform cluster must register itself as a Worker cluster
* The GitOps toolkit must be installed in the Platform cluster
* The Composite Promise must instruct Kratix to install its WCR (i.e. the other Promises)
  in the Platform cluster
* Optionally, the sub-Promises may instruct Kratix to install their WCR outside the
  Platform cluster

For detailed instruction on the above, please check the [Composite
Promises](../guides/composite-promises) guide.
