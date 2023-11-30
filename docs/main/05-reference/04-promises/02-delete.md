---
description: Documentation for deleting a Kratix Promise
title: Deleting a Promise
sidebar_label: Deleting
---

:::caution

Deleting a Promise will cascade delete all the associated requested Resources and Dependencies.

:::

To delete a Promise, run the command below, making sure to replace the
`<promise name>` with the Promise you want to remove:

```shell-session
$ kubectl delete promises.platform.kratix.io <promise-name>
```

Alternatively you can delete a Promise by providing the Promise definition file:

```shell-session
$ kubectl delete --filename promise.yaml
```

Deleting a Promise will take a few minutes to complete while Kratix deletes all the workloads associated with Promise. This includes any requested Resources and all the Promise's Dependencies.

All workloads created by the Promise are applied to the workers using GitOps. This mean that when Kratix deletes the workloads it is removing their definitions from the Destination's State Store and is delegating the responsibility to delete them from the worker infrastructure to the GitOps or other deployment solution on the workers. This results in a small delay between the resources being declared as deleted and them being actually deleted.
