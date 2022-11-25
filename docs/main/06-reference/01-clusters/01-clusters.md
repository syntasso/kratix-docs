---
description: Learn more about the Cluster document
title: Clusters
---

This reference provides detailed examples of defining, configuring, and using Composite
Resources in Crossplane. You can also refer to Crossplane’s API documentation for more
details. If you’re looking for a more general overview of Composite Resources and
Composition in Crossplane, try the Composite Resources page under Concepts.

This page contains documentation for the Kratix Cluster. The Cluster Resource is a
representation of a system where workloads can be scheduled to, which in turn are usually
Kubernetes clusters. See below for the API documentation:

```yaml
apiVersion: platform.kratix.io/v1alpha1
kind: Cluster
metadata:
  # The Cluster name is an arbitrary name that represent the cluster in the platform
  name: cluster-name
  # The Cluster labels are arbitrary key/value pairs that can be used for scheduling
  #   the installation of Promises and the workloads
  labels:
    environment: dev
spec:
  # Cluster identifier: required
  id: cluster-id
  # Path to be used by Kratix to create the buckets
  bucketPath: bucket-path
```

When a new Cluster is registered in the Platform cluster (i.e., a new Cluster Resource is
created), Kratix will create a pair of buckets: one for `resources`, one for `crds`. The
full path of the buckets will be:

* `<spec.bucketPath>-resources`
* `<spec.bucketPath>-crds`

### Promise scheduling {#scheduling}

When a new Cluster is registered, Kratix will automatically install the Worker Cluster
Resources for the Promises that are already installed in the Platform. It is possible to
have finer control of which Clusters receive which Promises by using a combination of
Cluster labels and Promise Cluster selectors.

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
  `env: dev` <br /> `region: uk` |  `env: dev`                     |  ✅
  `env: dev` <br /> `region: uk` |  `env: dev` <br /> `region: uk` |  ✅
  `env: dev`                     |  `env: prod`                    |  ⛔️
  `env: dev`                     |  `env: dev` <br /> `region: uk` |  ⛔️
   _no label_                    |  `env: dev`                     |  ⛔️

## Workload scheduling

Check the [Promise reference documentation](promises/scheduling).
