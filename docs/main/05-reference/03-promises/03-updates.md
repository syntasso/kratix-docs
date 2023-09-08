---
title: Updates
sidebar_label: Updates
description: Documentation on how updates behaviour for promises
---

# Updates

Kratix supports updating Promises with new specifications. Any update to the
Promise will result in the retriggering of the configure workflows for all
resources. For example if you update the configure workflow image version and
change a field in the dependencies Kratix will roll out all the changes to
dependencies to all the destinations and retrigger all the configure workflows
with the new image version.


## Scheduling
When changing the scheduling of a Promise, either by modifying `.spec.destinationSelectors` or
changing what the contents of `/kratix/metadata/destination-selectors.yaml` this may result
in a set of destinations previously targeted from old version of the Promise no longer
being targeted. When this happens the files written to the destination **are not removed**, but are
marked as `orphaned` by Kratix and are **not updated anymore**.

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

Kratix will schedule the `bar` namespace to all destinations with the label
`environment: dev` and leave all of `environment: dev` clusters with the old
`foo` namespace. Its up to the platform team to manually delete these resources
by deletes all `WorkPlacement` resources marked with the `kratix.io/orphaned`
label.
```
kubectl --context kind-platform -n kratix-platform-system get workplacements.platform.kratix.io --show-labels
NAME                       AGE   LABELS
namespace.dev-cluster-1    40s   kratix.io/orphaned=true,kratix.io/work=namespace
namespace.prod-cluster-1   26s   kratix.io/work=namespace
```
