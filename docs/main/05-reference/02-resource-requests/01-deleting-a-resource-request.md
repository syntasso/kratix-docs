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

Deleting a Resource Request will eventually delete the associated files from the
Repository. Alone, this will not delete resources from Worker clusters. For that to
happen, the GitOps toolkit listening to changes in the Repository must be configured to
remove previously applied objects once they get deleted. For example, on Flux CD, the
[prune configuration
option](https://fluxcd.io/flux/components/kustomize/kustomization/#garbage-collection)
must be `enabled` in the `Kustomization`.
