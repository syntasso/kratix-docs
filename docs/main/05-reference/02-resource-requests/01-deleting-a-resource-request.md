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

After the Resource Request is deleted it takes some time for the GitOps configuration
to sync the deletions across to the worker cluster.
