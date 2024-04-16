---
description: Documentation for deleting a Resource
title: Deleting a Resource
sidebar_label: Deleting
---

To delete a Resource, run:

```
kubectl delete <Promise CRD> <Resource Name>
```

Replace `<Promise CRD>` with the targeted Promise and `<Resource Name>` with the
Resource you want to delete.

To find the Promise CRD, run:

```
kubectl get crds
```

To find the Resource Name, run:

```
kubectl get <Promise CRD>
```

Alternatively you can delete a Resource by providing the Resource definition file:

```
kubectl delete --filename resource-request.yaml
```

If the Promise contains a [Resource Delete workflow](../05-resources/02-workflows.md#delete-workflows),
it will also be run during the delete process.

:::info

All workloads created by the Resource are applied to the end destinations using GitOps.

This mean that when Kratix deletes the workloads, it is removing their definitions from
the Destination's State Store, and is delegating the responsibility to actually delete
them from the destination infrastructure to GitOps (or other deployment solution) on the
destinations.

This results in a small delay between the resources being declared as deleted and them
being deleted on the end destination infrastructure.

:::
