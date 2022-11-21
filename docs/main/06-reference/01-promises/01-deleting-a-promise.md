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
resources associated with Promise. This includes any resource requests and all the
worker cluster resources.

All resources created by the Promise are applied to the work clusters using GitOps.
This mean that when Kratix deletes the resources its removing them from the GitOps Repository and
is delegating the responsibility to delete them on the worker cluster to the GitOps
controller. This results in a small delay
between the resources being declared as deleted and them being actually deleted.

