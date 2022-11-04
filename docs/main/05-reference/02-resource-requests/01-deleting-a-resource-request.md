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

Deleting a Resource Request will eventually delete the resources created on the worker cluster.
This can take some time as the changes are synced across to the worker cluster by Flux.
