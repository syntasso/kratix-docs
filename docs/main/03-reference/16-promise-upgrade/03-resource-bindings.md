---
description: Documentation for the Kratix Resource Binding Custom Resource
title: Resource Bindings
sidebar_label: Resource Bindings
---

# Resource Bindings

Resource Bindings bind a Resource Request to a [Promise Revision](./promise-revisions).

When a Resource Request is made, Kratix reconciles this Resource using the latest Promise Revision.
Kratix will automatically create a Resource Binding for this Resource.
This Binding consists of a reference to the Resource Request and the Promise Revision that the Resource is reconciled at.

:::info
Resource Bindings are managed by Kratix. As a Kratix users, you will not need to create or delete Resource
Bindings manually.
:::

```yaml
apiVersion: platform.kratix.io/v1alpha1
kind: ResourceBinding
metadata:
  labels:
    kratix.io/promise-name: redis # name of the Promise
    kratix.io/resource-name: example # name of the Resource
  name: example-redis-e7f90
  namespace: default # Resource Bindings are created in the same namespace as the Resource itself
spec:
  promiseRef:
    name: redis # name of the Promise
  resourceRef:
    name: example # name of the Resource
    namespace: default # namespace of the Resource
  version: v0.1.0 # version of the Promise
```

:::info
When updating a Resource Request, Kratix will reconcile the Resource using the Promise Revision recorded in the Resource Binding.
If you want the Resource to be reconciled using a different Promise Revision, you need to update the Resource Binding.
:::

## Upgrading a Resource Request

To update the Promise Revision that a Resource Request is reconciled at, you can update its Resource Binding.
To find the corresponding Resource Binding, you can run `kubectl` command with label filters.

For example, to look for Resource Binding of a `redis` Resource Request with name `example` in namespace `default`, run :

```bash
kubectl -n default get resourcebindings -l kratix.io/promise-name=redis -l kratix.io/resource-name=example

NAME                  RESOURCE   PROMISE   VERSION
example-redis-e7f90   example    redis     v0.1.0
```

Then, update `.spec.version` of the Binding:

```yaml
apiVersion: platform.kratix.io/v1alpha1
kind: ResourceBinding
metadata:
  name: example-resource
spec:
  ...
  version: v0.1.0 # update to upgrade Resource Requests
```

Following this update, Kratix will automatically reconcile and run the Resource Configure workflow for the Resource Request.

## Deleting a Resource Binding

Resource Bindings are managed by Kratix. It will be automatically cleaned up by Kratix when the Resource Request is removed.
If you remove a Resource Binding for an existing Resource Request, Kratix will automatically recreate the Binding.
