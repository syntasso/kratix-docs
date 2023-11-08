---
title: Multi-cluster management
sidebar_label: Multi-cluster management
description: Learn more about how Kratix schedules Promises and Resources, and how you can control the scheduling process.
---

One of the most powerful features of Kratix full control over the scheduling of work
across extensive and diverse infrastructure. For example, this could be determining which
Kubernetes cluster (or other infrastructure) a certain workload should be deployed to.

In Kratix, scheduling happens in two stages:

1. Determining Destinations that should be available to a given Promise ([Scheduling
   Promises](#promises))
2. Determining where the Resources will run following a request for a Promise Resource
   ([Scheduling Workloads](#resources))

The following sections in this page document those stages. For hands-on scheduling guides,
check the [Adding a new Worker Destination](../guides/scheduling) and [Compound
Promise](../guides/compound-promises) pages.

## Scheduling Promises {#promises}

When a Promise is installed, by default Kratix will schedule the Promise Dependencies onto
all Destinations registered with the Platform. When a new Destination is registered,
Kratix will also schedule all Promise Dependencies onto this new Destination.

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

By setting `matchLabels` with a `key: value` pair, Platform teams can
control which Destinations the Promise's Dependencies should be
scheduled to.

`matchLabels` is an _equality-based_ selector. This means it will only match Destinations
that have keys/values that match. You can add multiple key/value pairs to the
`matchLabels`, but note that it will only match when the Destination has a matching label
for _all_ the selectors.

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
Destination has no `labels`, only Promises with no `destinationSelectors` set will be
applied.

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

In the event that more than one Destination matches the resulting labels, Kratix
will randomly select within the available matching registered Destinations. If you
prefer to be certain of a single Destination match, it is suggested that you add a
unique identifier to all Destinations (e.g. `destinationName`) so that there can only
ever be a single match.

It is possible to _dynamically_ determine where the Promise dependencies should go during
the Promise workflow. Check the [dynamic scheduling](#dynamic) section for more details.

## Scheduling Resources {#resources}

When a new request for a Resource comes in, Kratix reacts by triggering the
`resource.configure` Workflow, as defined in the Promise `spec.workflows`. If the Workflow
contains a Kratix Pipeline, the outputs of the Pipeline will then use the labels to
identify a matching Kratix Destination as the target Destination.

When multiple Destinations match, Kratix will by default randomly select a registered
Destination to schedule the Resource. If the Promise has `spec.destinationSelectors` set,
the workload can only be scheduled to a Destination that has matching labels for the
Promise.

It is possible to _dynamically_ determine where Resources will go during the Workflow.
Check the [dynamic scheduling](#dynamic) section below for more details.

## Dynamic scheduling {#dynamic}

For both the [promise](./promises/workflows) and the [resource](./resources/workflows)
workflows, Kratix mounts a metadata directory under `/kratix/metadata`. At scheduling
time, Kratix will look for a `destination-selectors.yaml` file in that directory with the
following format:

```yaml
- directory: dir # Optional
  matchLabels:
    key: value
```

The next two sections will explain how the `directory` key is used to determine how the
labels in that array item are used during scheduling.

### Directory-based scheduling {#directory}

If the `directory` key is present, Kratix will **ignore** the Promise
`spec.destinationSelectors` entirely, and use the matchers defined in the workflow. The
`directory` represents a directory in `/kratix/output`, where any files to be deployed as
part of that specific workload must be placed.

For example, given the following Promise:

```yaml title=promise.yaml
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
├── some-dir/
│   └── document-1.yaml
└── scheduled-dir/
    ├── document-2.yaml
    └── document-3.yaml
```

With the following `/kratix/metadata/destination-selectors.yaml`:

```yaml title="workflow /kratix/metadata/destination-selectors.yaml"
- directory: scheduled-dir # matches /kratix/output/scheduled-dir/
  matchLabels:
    workflow: subdir
```

Kratix will schedule the documents as follows:

* `document-2.yaml`, `document-3.yaml` are scheduled to destinations with the
  `workflow=subdir` label.
  * The scheduling config in `destination-selectors.yaml` has specifically scheduled this
    directory.
* `document-0.yaml`, `some-dir/document-1.yaml` are scheduled to destinations with
  the `promise=label` label.
  * They are not contained within a directory associated with a specific scheduling, so
    revert to the [default scheduling](#default).

### Default scheduling {#default}

If the `directory` key is not present, Kratix will then **add** those to what is already
present in the Promise `spec.destinationSelectors` field when identifying a target
Destination.

For example, given the following Promise:

```yaml title=promise.yaml
apiVersion: platform.kratix.io/v1alpha1
kind: Promise
metadata: #...
spec:
  destinationSelectors:
    - matchLabels:
        promise: label
```

And a Workflow that outputs the following `/kratix/metadata/destination-selectors.yaml`:

```yaml title="workflow /kratix/metadata/destination-selectors.yaml"
- matchLabels:
    workflow: another-label
```

All resources will only be scheduled to destinations containing _both_ `promise=label` and
`workflow=another-label` labels.

:::important

In the event of a label conflict, the Promise `spec.destinationSelectors` take precedence
over any dynamic scheduling.

The order of precendence is as follows:
1. Promise `spec.destinationSelectors`
2. Promise workflow `destination_selectors.yaml`
3. Resource workflow `destination_selectors.yaml`
:::

:::important

If the Promise Configure workflow creates the `/kratix/output/destination-selector.yaml`
with an element **without** `directory`, any subsequent Resource requests will use the
resulting combination of labels as the default scheduling policy.

In the example above, if that was the output of a Promise Configure workflow, any
subsequent resource requests for that Promise would be scheduled to Destinations with
`promise=label` and `workflow=another-label` labels.
:::

## Compound Promises

Compound Promises are Promises that, in their Dependencies, contain other
Promises. That ability allows Platform teams deliver entire stacks on demand,
instead of simple databases or services.

To enable this functionality, the following needs to be true:

- The platform cluster must register itself as a worker cluster
- The GitOps toolkit must be installed in the platform cluster
- The Compound Promise must instruct Kratix to install its Dependencies (i.e. the other
  Promises) in the platform cluster
- Optionally, the sub-Promises may instruct Kratix to install their Dependencies outside
  the platform cluster

For detailed instruction on the above, please check the [Compound
Promises](../guides/compound-promises) guide.
