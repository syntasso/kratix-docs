---
description: Documentation for deleting a Kratix Promise
title: Deleting a Promise
sidebar_label: Deleting
---
Deleting a Promise deletes both the Promise and all the resources and dependencies associated with it. Deleting a Promise runs the specific delete workflow that is declared in the Promise. Once the delete workflow runs, the resources uniquely associated with that Promise are removed from the platform and finally the Promise itself is removed from the platform.

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

Deleting a Promise will take a few minutes to complete while Kratix deletes all the
workloads associated with Promise, including any requested Resources and all the of the
Promise dependencies.

If the Promise contains a [Promise Delete workflow](../promises/workflows#delete-workflows),
it will also be run during the delete process.

:::info

All workloads created by the Promise are applied to the end destinations using GitOps.

This mean that when Kratix deletes the workloads, it is removing their definitions from
the Destination's State Store, and is delegating the responsibility to actually delete
them from the destination infrastructure to GitOps (or other deployment solution) on the
destinations.

This results in a small delay between the resources being declared as deleted and them
being deleted on the end destination infrastructure.

:::
