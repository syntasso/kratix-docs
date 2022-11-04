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

Alternatively you can delete a Promise by providing the Promise definition file:

```
kubectl delete --filename promise.yaml
```

Deleting a Promise will take a few minutes to complete while Kratix deletes all the
resources associated with Promise. Once finished it will take some time for all
of the worker cluster resources to be deleted as changes are synced across to
the worker clusters by Flux.


