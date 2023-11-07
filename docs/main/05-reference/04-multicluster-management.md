---
title: Multi-cluster management
sidebar_label: Multi-cluster management
description: Learn more about how Kratix schedules Promises and Resources, and how you can control the scheduling process.
---

One of the most powerful Kratix features is the ability Platform teams have to
fully control the scheduling of work across extensive and diverse infrastructure, i.e., to
determine in which Kubernetes cluster (or other infrastructure) a certain workload should be deployed to.

In Kratix, scheduling happens in two stages:

1. Determining Destinations that should be available to a given Promise ([Scheduling
   Promises](#promises))
1. Determining where the Resources will run following a request for a Promise Resource ([Scheduling Workloads](#resources))

The following sections in this page document those stages. For hands-on scheduling guides,
check the [Adding a new Worker Destination](../guides/scheduling) and [Compound
Promise](../guides/compound-promises) pages.

## Scheduling Promises {#promises}

When a Promise is installed, Kratix will schedule the Promise Dependencies onto all
Destinations registered with the Platform. When a new Destination is registered, Kratix
will also schedule all Promise Dependencies onto this new Destination.

Platform teams can, however, control which Destinations receive which Promises by
using a combination of Destination labels and Promise target selectors.

The `labels` in the Destination document are the standard Kubernetes
[labels](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/):
simple, arbitrary, key/value pairs. In the example below, the Destination object is
being created with a label `environment` with value `dev`:

```yaml title="worker-2.yaml"
apiVersion: platform.kratix.io/v1alpha1
kind: Destination
metadata:
  # highlight-start
  labels:
    environment: dev
  # highlight-end
  # ...
```

In the Promise document, the scheduling is controlled via the `spec.destinationSelectors`
key, following the format below:

```yaml
apiVersion: platform.kratix.io/v1alpha1
kind: Promise
metadata: #...
spec:
  destinationSelectors:
    - matchLabels:
      key: value
```

By setting the `matchLabels` with a `key: value` pair, Platform teams can
control to which Destinations the Promise's Dependencies should be
scheduled. `matchLabels` is a _equality-based_ selector. This means it will only
match Destinations that have keys/values that match. You can add multiple key/value pairs to the `matchLabels`, but note that it will only match when the Destination has a matching label for _all_ the selectors.

```yaml title=jenkins-promise.yaml
apiVersion: platform.kratix.io/v1alpha1
kind: Promise
metadata:
  name: jenkins-promise
spec:
  #highlight-start
  destinationSelectors:
    - matchLabels:
        environment: dev
  #highlight-end
  dependencies:
  # ...
```

If a Promise has no `destinationSelectors`, it will be applied to all Destinations. If a
Destination has no `labels`, only Promises with no `destinationSelectors` set will be applied.

The table below contains a few examples:

| Destination Label           | Promise Selector            | Match? |
| --------------------------- | --------------------------- | ------ |
| _no label_                  | _no selector_               | ✅     |
| `env: dev`                  | _no selector_               | ✅     |
| `env: dev`                  | `env: dev`                  | ✅     |
| `env: dev` <br /> `zone:eu` | `env: dev`                  | ✅     |
| `env: dev` <br /> `zone:eu` | `env: dev` <br /> `zone:eu` | ✅     |
| `env: dev`                  | `env: prod`                 | ⛔️    |
| `env: dev`                  | `env: dev` <br /> `zone:eu` | ⛔️    |
| _no label_                  | `env: dev`                  | ⛔️    |

It is possible to dynamically determine where the Promise dependencies should go during the Promise workflow. Check the [dynamic scheduling](#dynamic) section for more details.

## Scheduling Resources {#resources}

When a new request for a Resource comes in, Kratix reacts by triggering the `resource.configure` Workflow, as defined in the Promise `spec.workflows`. If the Workflow contains a Kratix Pipeline, the outputs of the Pipeline will then use the labels to identify one matching Kratix Destination which will be the target Destination.

When multiple Destinations match, Kratix will by default randomly select a registered Destination to schedule the Resource. If the Promise has `spec.destinationSelectors` set, the workload can only be scheduled to a Destination that has matching labels for the Promise.

It is possible to dynamically determine where Resources will go during the Workflow. The section below documents the process.

## Dynamic scheduling {#dynamic}

For both the [promise](./promises/workflows) and the [resource](./resources/workflows)
workflows, Kratix mounts a metadata directory under `/kratix/metadata`. At scheduling
time, Kratix will look for a `destination-selectors.yaml` file in that directory with the
following format:

```yaml
- directory: somedir # Optional
  matchLabels:
    key: value
```

If the `directory` key is not present, Kratix will then **add** those to what is already
present in the Promise `spec.destinationSelectors` field when identifying a target
Destination.

For example:

Given the following Promise:

```yaml,title=promise.yaml
apiVersion: platform.kratix.io/v1alpha1
kind: Promise
metadata: #...
spec:
  destinationSelectors:
    - matchLabels:
        promise: label
```

And a Workflow that outputs the following `/kratix/metadata/destination-selectors.yaml`

```yaml,title=workflow /kratix/metadata/destination-selectors.yaml
- matchLabels:
    workflow: another-label
```

Will result in resources being scheduled only to destinations containing both labels
`promise=label` and `workflow=another-label` labels.

:::important

If the Promise Configure workflow creates the `/kratix/output/destination-selector.yaml`
with an element **without** `directory`, any subsequent Resource requests will use the
resulting combination of labels as the default scheduling policy.

In the example above, if that was the output of a Promise Configure workflow, any
subsequent resource requests for that Promise would be scheduled to Destinations with
`promise=label` and `workflow=another-label` labels.
:::

If the `directory` key is present, Kratix will **ignore** the Promise
`spec.destinationSelectors` entirely, and use the matchers defined in the workflow. The
`directory` represents a directory in `/kratix/output`.

For example:

Given the following Promise:

```yaml,title=promise.yaml
apiVersion: platform.kratix.io/v1alpha1
kind: Promise
metadata: #...
spec:
  destinationSelectors:
    - matchLabels:
        promise: label
```

And a Workflow that outputs the following files:

```
/kratix/output
├── document-0.yaml
├── document-1.yaml
└── somedir/
    ├── document-2.yaml
    └── document-3.yaml
```

With the following `/kratix/metadata/destination-selectors.yaml`

```yaml,title=workflow /kratix/metadata/destination-selectors.yaml
- directory: somedir
  matchLabels:
    workflow: subdir
```

Kratix will schedule the documents as follows:

* `document-0.yaml` and `document-1.yaml` will be scheduled to destinations with the
  `promise=label` label.
* `document-2.yaml` and `document-3.yaml` will be scheduled to destinations with the
  `workflow=subdir` label.

In the event that more than one Destination matches the resulting labels, Kratix
will randomly select within the available matching registered Destinations. If you
prefer to be certain of a single Destination match, it is suggested that you add a
unique identifier to all Destinations (e.g. `destinationName`) so that there can only
ever be a single match.

## Compound Promises

Compound Promises are Promises that, in their Dependencies, contain other
Promises. That ability allows Platform teams deliver entire stacks on demand,
instead of simple databases or services.

To enable this functionality, the following needs to be true:

- The platform cluster must register itself as a worker cluster
- The GitOps toolkit must be installed in the platform cluster
- The Compound Promise must instruct Kratix to install its Dependencies (i.e. the other Promises)
  in the platform cluster
- Optionally, the sub-Promises may instruct Kratix to install their Dependencies outside the
  platform cluster

For detailed instruction on the above, please check the [Compound
Promises](../guides/compound-promises) guide.
