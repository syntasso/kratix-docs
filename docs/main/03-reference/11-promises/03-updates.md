---
title: Updates
sidebar_label: Updates
description: Documentation on how updates behave for Promises
---

An update to a Promise will cause Kratix to reconcile on the new Promise definition,
and any changes will be rolled out during this reconciliation.

All elements of a promise are updatable. Any change to the Promise specification on the platform triggers all of the workflows to re-run. Changes may include:
- Updating the Promise API, which rolls out an update to the underlying CRD for the
  Resources managed by the Promise.
- Updating the Promise or Resource workflows.
- Updating the Promise scheduling.
- Updating the Promise's static dependencies (the `dependencies` field in the Promise
  spec).

This central distribution of updates is a powerful way to keep your Promise-built resources current, secure, and visible over time.

## Workflows

Any update to the Promise `spec` will result in Kratix re-running the Promise Configure
workflow, as well as re-running the Resource Configure workflow for all existing Resource
Requests.

For example, if you bump an image version for a Pipeline container in a Resource Configure
workflow, Kratix will ensure that all Resources are re-reconciled, including re-running
the Resource Configure workflow using the new image for every existing Resource.

See [Promise Workflows](../promises/workflows#configure-workflows) and
[Resource Workflows](../resources/workflows#configure-workflows) for
more details.

## Scheduling

The scheduling for a Promise may be changed by modifying either:
- `.spec.destinationSelectors` in the Promise; or
- the contents of `/kratix/metadata/destination-selectors.yaml` at the end of a Workflow.

See [Managing Multiple Destinations](../destinations/multidestination-management) for more
details on scheduling.

### Misplaced workloads

An update to the Promise's scheduling may result in a set of Destinations previously
targeted from old version of the Promise no longer being targeted.

When this happens, existing files written to the Destination **are not removed**, but are
marked as `misplaced` by Kratix and are **not updated any more**.

It's up to the platform team to manually delete these resources by deleting all
`WorkPlacement` resources marked with the `kratix.io/misplaced` label.

#### Example

Take a simple Promise which creates a namespace on the scheduled Destinations, with
scheduling to `environment: dev` as follows:

```yaml
apiVersion: platform.kratix.io/v1alpha1
kind: Promise
metadata:
  name: promise-name
spec:
  destinationSelectors:
    - matchLabels:
        #highlight-next-line
        environment: dev
  dependencies:
    - apiVersion: v1
      kind: Namespace
      metadata:
        #highlight-next-line
        name: foo
```

Kratix will schedule the `foo` namespace resource to all Destinations with the label
`environment: dev` as expected.

If you later update the Promise to instead have the following spec:

```yaml
apiVersion: platform.kratix.io/v1alpha1
kind: Promise
metadata:
  name: promise-name
spec:
  destinationSelectors:
    - matchLabels:
        #highlight-next-line
        environment: prod
  dependencies:
    - apiVersion: v1
      kind: Namespace
      metadata:
        #highlight-next-line
        name: bar
```

Kratix will schedule the `bar` namespace to all Destinations with the label
`environment: prod` and leave all the `environment: dev` Destinations with the old
`foo` namespace.

The misscheduled `WorkPlacement` resources can be identified by the `misscheduled` label:

```bash
> kubectl --context kind-platform -n kratix-platform-system get workplacements.platform.kratix.io --show-labels
NAME                       AGE   LABELS
namespace.dev-cluster-1    40s   kratix.io/misscheduled=true,kratix.io/work=namespace
namespace.prod-cluster-1   26s   kratix.io/work=namespace
```

Cleaning them up:

```bash
> kubectl --context kind-platform -n kratix-platform-system delete workplacements.platform.kratix.io --selector kratix.io/misscheduled=true
workplacements.platform.kratix.io "namespace.dev-cluster-1" deleted
```
