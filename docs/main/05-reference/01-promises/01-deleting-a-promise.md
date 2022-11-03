---
description: Deleting a promise
title: Deleting
---

:::caution

Deleting a promise will cascade delete all the associated resource requests.

:::

To delete a promise, run the command below, making sure to replace the
`<promise name>` with the Promise you want to remove:

```
kubectl delete promises.platform.kratix.io <promise-name>
```

This command may take a few minutes to complete, while Kratix deletes all the
resources associated with Promise. Deleting a Promise will eventually delete the
Promise files from the Repository.

Deleting a Promise will eventually delete the associated files from the Repository.
Alone, this will not delete resources from Worker clusters. For that to happen, the
GitOps toolkit listening to changes in the Repository must be configured to remove
previously applied objects once they get deleted. For example, on Flux CD, the [prune
configuration
option](https://fluxcd.io/flux/components/kustomize/kustomization/#garbage-collection)
must be `enabled` in the `Kustomization`.

It's also possible to delete a Promise by providing the Promise definition file:

```
kubectl delete --filename promise.yaml
```
