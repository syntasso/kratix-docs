---
description: Documentation for deleting a Kratix Promise
title: Deleting a Promise
sidebar_label: Deleting
---

:::caution

Deleting a Promise will cascade delete all the associated Resource Requests and Worker Cluster Resources.

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

Deleting a Promise will take a few minutes to complete while Kratix deletes all the
resources associated with Promise. This includes any Resource Requests and all the
Worker Cluster Resources.

All resources created by the Promise are applied to the work clusters using GitOps.
This mean that when Kratix deletes the resources its removing them from the GitOps Repository and
is delegating the responsibility to delete them on the Worker Cluster to the GitOps
controller. This results in a small delay between the resources being declared
as deleted and them being actually deleted.
