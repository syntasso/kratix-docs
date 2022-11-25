---
description: Documentation around scheduling Promises and workloads
position: 7
title: Scheduling
---

*[WCR]: Worker Cluster Resource

Promises and Promise Authors can control scheduling by setting the `clusterSelector`
field in the `spec`:

```yaml
apiVersion: platform.kratix.io/v1alpha1
kind: Promise
metadata:
  name: promise-name
spec:
  #highlight-start
  clusterSelector:
    key1: some-value
    key2: another-balue
  #highlight-end
  workerClusterResources:
  # ...
```

When set, the Promise Worker Cluster Resources will only be installed in Clusters
with matching `metadata.labels`. Similarly, when a Resoure Request is sent to the
Platform, the workload will only be scheduled to Clusters where the Promise's WCR was
installed.

For further documentaton on how Cluster labels interact with the Promise's
`clusterSelector`, check [the Cluster reference
documentation](../clusters#scheduling).

## Scheduling Resource Requests

When a new Resource Request comes in, Kratix reacts by triggering the Request Pipeline, as
defined in the Promise's `spec.xaasRequestPipeline`. The output of the pipeline will be
then written to the Repository, which will in turn be applied to one of the registered
Worker Clusters.

By default, Kratix will randomly select a registered Cluster to instantiate the workload.
If the Promise has `spec.clusterSelector` set, the workload will be scheduled to a Cluster
that has matching labels.


### Dynamic scheduling in the Request Pipeline

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


## Composite Promises

Composite Promises are Promises that, in its WCR, contain other Promises. That ability
allows Platform teams deliver entire stacks on demand, instead of simple databases or
services.

To enable this functionality, the following needs to be true:

* The Platform cluster must register itself as a Worker cluster
* The GitOps toolkit must be installed in the Platform cluster
* The Composite Promise must instruct Kratix to install its WCR (i.e. the other Promises)
  in the Platform cluster
* Optionally, the sub-Promises may instruct Kratix to install their WCR outside the
  Platform cluster

For detailed instruction on the above, please check the [Writing Composite
Promises](../../guides/composite-promises) guide.
