---
description: Deleting a Resource Request
title: Deleting
---

To delete a Resource Request, run:

```
kubectl delete <Promise CRD> <Resource Request Name>
```

Replace `<Promise CRD>` with the targeted Promise and `<Resource Request Name>` with the
Resource Request you want to delete.

To find the Promise CRD, run:

```
kubectl get crds
```

To find the Resource Request Name, run:

```
kubectl get <Promise CRD>
```

Alternatively you can delete a Resource Request by providing the Resource Requests
definition file:

```
kubectl delete --filename resource-request.yaml
```

All resources created by the Resource Request are applied to the work clusters using GitOps.
This mean that when Kratix deletes the resources its removing them from the GitOps Repository and
is delegating the responsibility to delete them on the worker cluster to the GitOps
controller. This results in a small delay
between the resources being declared as deleted and them being actually deleted.
