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

If you have defined any `delete` pipelines in the Promise a pipeline will fire for each Resource.

All workloads created by the Resource are applied to the workers using GitOps. This mean that when Kratix deletes the workloads it is removing their definitions from the Destination's State Store and is delegating the responsibility to delete them from the worker infrastructure to the GitOps or other deployment solution on the workers. This results in a small delay between the resources being declared as deleted and them being actually deleted.
