---
title: Multi-cluster management
sidebar_label: Multi-cluster management
description: Learn more about how Kratix schedules Promises and Resources, and how you can control the scheduling process.
---

One of the most powerful Kratix features is the ability Platform teams have to
fully control the scheduling of work across extensive and diverse infrastructure, i.e., to
determine in which Kubernetes cluster (or other infrastructure) a certain workload should be deployed to.

In Kratix, scheduling happens in two stages:

1. Determining Clusters should be available to a given Promise ([Scheduling
   Promises](#promises))
1. Determining where the Resources will run following a request for a Promise Resource ([Scheduling Workloads](#resources))

The following sections in this page document those stages. For hands-on scheduling guides,
check the [Adding a new Worker Cluster](../guides/scheduling-clusters) and [Compound
Promise](../guides/compound-promises) pages.

## Scheduling Promises {#promises}

When a Promise is installed, Kratix will deploy the Promise dependencies into
all Clusters registered with the Platform. When a new Cluster is registered,
Kratix will also deploy all Promise dependencies into this new Cluster.

Platform teams can, however, control which Clusters receive which Promises by
using a combination of Cluster labels and Promise selectors.

The `labels` in the Cluster document are the standard Kubernetes
[labels](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/):
simple, arbitrary, key/value pairs. In the example below, the Cluster object is
being created with a label `environment` with value `dev`:

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

In the Promise document, the scheduling is controlled via the `spec.scheduling`
key, following the format below:

```yaml
apiVersion: platform.kratix.io/v1alpha1
kind: Promise
metadata: #...
spec:
  scheduling:
  - target:
      matchLabels:
        key: value
```

By setting the `matchLabels` with a `key: value` pair, Platform teams can
control to which Clusters (i.e. `target`) the Promise's dependencies should be
scheduled. `matchLabels` is a _equality-based_ selector. This means it will only
match Clusters that have keys/values that match. You can add multiple key/value
pairs to the `matchLabels`, but note that it will only match when the Cluster
has a matching label for _all_ the selectors.

```yaml title=jenkins-promise.yaml
apiVersion: platform.kratix.io/v1alpha1
kind: Promise
metadata:
  name: jenkins-promise
spec:
  #highlight-start
  scheduling:
    - target:
        matchLabels:
          environment: dev
  #highlight-end
  dependencies:
  # ...
```

If a Promise has no `scheduling`, it will be applied to all Clusters. If a
Cluster has no `labels`, only Promises with no `scheduling` set will be applied.

The table below contains a few examples:

| Cluster Label               | Promise Selector            | Match? |
| --------------------------- | --------------------------- | ------ |
| _no label_                  | _no selector_               | ✅     |
| `env: dev`                  | _no selector_               | ✅     |
| `env: dev`                  | `env: dev`                  | ✅     |
| `env: dev` <br /> `zone:eu` | `env: dev`                  | ✅     |
| `env: dev` <br /> `zone:eu` | `env: dev` <br /> `zone:eu` | ✅     |
| `env: dev`                  | `env: prod`                 | ⛔️    |
| `env: dev`                  | `env: dev` <br /> `zone:eu` | ⛔️    |
| _no label_                  | `env: dev`                  | ⛔️    |

## Scheduling Resources {#resources}

When a new request for a Resource comes in, Kratix reacts by triggering the
`resource.configure` Workflow, as defined in the Promise `spec.workflows`.
If the Workflow contains a Kratix Pipeline, the outputs of the Pipeline will then use the labels to identify one matching Kratix Clusters which will be the target Cluster.

By default, Kratix will randomly select a registered Cluster to schedule the Resource.
If the Promise has `spec.scheduling` set, the workload can only be scheduled to a Cluster that has matching labels for the Promise.

It is possible to dynamically determine where Resources will go during the Kratix Pipeline. The section below documents the process.

### Dynamic Scheduling {#pipeline}

Kratix mounts a `metadata` directory at the root of the Pipeline's container when
instantiating the Configure Pipeline. At scheduling time, Kratix will look for a
`scheduling.yaml` file in that directory with the following format:

```yaml
- target:
    matchLabels:
      key: value
```

Kratix will then **add** those to what is already present in the Promise
`spec.scheduling` field when identifying a target Cluster.

There is no way to overwrite keys. For example, if the Promise defines
`matchLabels` with `env: dev` and the Pipeline defines it with `env: prod`,
Kratix will only ever look for Clusters with the `env: dev` label.

The table below contains a few examples:

| Cluster Label                | Promise Selector             | cluster-selectors.yaml | Match? |
| ---------------------------- | ---------------------------- | ---------------------- | ------ |
| _no label_                   | _no selector_                | _no_selector_          | ✅     |
| `env: dev`                   | _no selector_                | _no_selector_          | ✅     |
| `env: dev`                   | `env: dev`                   | _no_selector_          | ✅     |
| `env: dev` <br /> `zone: eu` | `env: dev`                   | `zone: eu`             | ✅     |
| `env: dev` <br /> `zone: eu` | _no selector_                | `zone: eu`             | ✅     |
| `env: dev`                   | `env: dev`                   | `env: prod`            | ✅     |
| `env: dev`                   | `env: prod`                  | `env: dev`             | ⛔️     |
| `env: dev`                   | `env: dev` <br /> `zone: eu` | _no_selector_          | ⛔️     |
| _no label_                   | _no_selector_                | `env: dev`             | ⛔️     |

In the event that more than one cluster matches the resulting labels, Kratix
will randomly select within the available matching registered Clusters. If you
prefer to be certain of a single cluster match, it is suggested that you add a
unique identifier to all clusters (e.g. `clusterName`) so that there can only
ever be a single match.

## Compound Promises

Compound Promises are Promises that, in their dependencies, contain other
Promises. That ability allows Platform teams deliver entire stacks on demand,
instead of simple databases or services.

To enable this functionality, the following needs to be true:

- The Platform cluster must register itself as a Worker cluster
- The GitOps toolkit must be installed in the Platform cluster
- The Compound Promise must instruct Kratix to install its dependencies (i.e. the other Promises)
  in the Platform cluster
- Optionally, the sub-Promises may instruct Kratix to install their dependencies outside the
  Platform cluster

For detailed instruction on the above, please check the [Compound
Promises](../guides/compound-promises) guide.
