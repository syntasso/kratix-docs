---
title: Updates
sidebar_label: Updates
description: Documentation on how updates behave for Promises
---

# Updates

Kratix supports updating Promises with new specifications. Any update to the
Promise will result in the re-running the Configure Workflows for all resources. 
For example, if you update the Configure Workflow image version and change 
a field in the Dependencies Kratix will roll out the new Dependencies to
Destinations and re-run all the Configure Workflows
with the new image version.


## Scheduling
When changing the scheduling of a Promise, either by modifying `.spec.destinationSelectors` or
changing the contents of `/kratix/metadata/destination-selectors.yaml` at the end of a Workflow may result
in a set of Destinations previously targeted from old version of the Promise no longer
being targeted. When this happens the files written to the Destination **are not removed**, but are
marked as `misscheduled` by Kratix and are **not updated anymore**.

### Example
If you had a Promise with the following scheduling:
```
apiVersion: platform.kratix.io/v1alpha1
kind: Promise
metadata:
  name: promise-name
spec:
  destinationSelectors:
    - matchLabels:
        environment: dev
  dependencies:
    - apiVersion: v1
      kind: Namespace
      metadata:
        name: foo
```

Kratix will schedule the `foo` namespace resource to all destination with the label
`environment: dev`. If you updated the Promise to now instead have the following spec:

```
apiVersion: platform.kratix.io/v1alpha1
kind: Promise
metadata:
  name: promise-name
spec:
  destinationSelectors:
    - matchLabels:
        environment: prod
  dependencies:
    - apiVersion: v1
      kind: Namespace
      metadata:
        name: bar
```

Kratix will schedule the `bar` namespace to all Destinations with the label
`environment: dev` and leave all of `environment: dev` Desintations with the old
`foo` namespace. It's up to the platform team to manually delete these resources
by deleting all `WorkPlacement` resources marked with the `kratix.io/misscheduled`
label.
```
kubectl --context kind-platform -n kratix-platform-system get workplacements.platform.kratix.io --show-labels
NAME                       AGE   LABELS
namespace.dev-cluster-1    40s   kratix.io/misscheduled=true,kratix.io/work=namespace
namespace.prod-cluster-1   26s   kratix.io/work=namespace
```
