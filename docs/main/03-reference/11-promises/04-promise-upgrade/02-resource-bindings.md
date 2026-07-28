---
description: Documentation for the Kratix Resource Binding Custom Resource
title: Resource Bindings
sidebar_label: Resource Bindings
---

# Resource Bindings

Resource Bindings bind a Resource Request to a [Promise Revision](./promise-revisions).

When a Resource Request is made, Kratix reconciles this Resource using the latest Promise Revision.
Kratix will automatically create a Resource Binding for this Resource using `latest` as the Promise version.
This Binding consists of a reference to the Resource Request and the Promise Revision that the Resource is reconciled at.

:::info

Resource Bindings are managed by Kratix. For most workflows you will not need to create or delete Resource
Bindings manually. The exception is
[pinning a Resource Request when it is created](#pinning-a-resource-request-when-it-is-created).

:::

A Resource Binding looks like this:

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
  version: v0.1.0 # version of the Promise this Resource is associated to, can be 'latest'
```

:::info

When updating a Resource Request, Kratix will reconcile the Resource using the Promise Revision recorded in the Resource Binding.
If you want the Resource to be reconciled using a different Promise Revision, you need to update the Resource Binding.

:::

## Upgrading a Resource Request

To update the Promise Revision that a Resource Request is reconciled at, you can update its Resource Binding.
To find the corresponding Resource Binding, you can run the `kubectl` command with label filters.

:::tip

Resource Bindings have a 1:1 relationship to a resource request.

:::

For example, to look for the Resource Binding of a `redis` Resource Request with name `example` in namespace `default`, run:

```bash
kubectl -n default get resourcebindings -l kratix.io/promise-name=redis -l kratix.io/resource-name=example

NAME                  RESOURCE   PROMISE   VERSION
example-redis-e7f90   example    redis     v0.1.0
```

Then, update the `.spec.version` of the Binding:

```yaml
apiVersion: platform.kratix.io/v1alpha1
kind: ResourceBinding
metadata:
  name: example-resource
spec:
  ...
  version: v0.2.0 # update to upgrade Resource Requests
```

Following this update, Kratix will automatically reconcile and run the Resource Configure workflow for the Resource Request.

## Pinning a Resource Request when it is created

Kratix serves a brand new Resource Request using the `latest` Promise Revision. There is no field on the
Resource Request itself to ask for a different version, so a request that must be served by a non-latest
Revision needs its Resource Binding to exist **before** the Resource Request is created.

This matters most for [Compound Promises](/main/reference/promises/compound), whose workflows output Resource Requests for component Promises.

Kratix identifies a Resource Binding by its labels, so the name is yours to choose. Create it in the
namespace the Resource Request will be created in, pointing at the version you want:

```yaml title="binding.yaml"
apiVersion: platform.kratix.io/v1alpha1
kind: ResourceBinding
metadata:
  name: example-pinned-to-v0-1-0
  namespace: default
  #highlight-start
  labels:
    kratix.io/promise-name: redis # must match spec.promiseRef.name
    kratix.io/resource-name: example # must match spec.resourceRef.name
  #highlight-end
spec:
  promiseRef:
    name: redis
  resourceRef:
    name: example
    namespace: default
  version: v0.1.0
```

:::warning

Both labels are required. Without them Kratix cannot match the Binding to the Resource Request, and will
create its own Binding at `latest` instead — leaving two Bindings for the same Resource, which is an error.

:::

Apply the Binding, then the Resource Request:

```bash
kubectl apply --filename binding.yaml
kubectl apply --filename resource-request.yaml
```

Kratix adopts the Binding you created rather than creating one of its own, and reconciles the Resource using
the `v0.1.0` Promise Revision. It does not overwrite a version you have already set. From that point the
Binding behaves like any other: change `spec.version` to upgrade, and Kratix removes it with the Resource
Request.

:::info

Both the Promise and a Promise Revision at the requested version must already exist. Kratix cannot resolve a
Binding that points at a version that has never been installed.

:::

## Deleting a Resource Binding

Resource Bindings are managed by Kratix. It will be automatically cleaned up by Kratix when the Resource Request is removed.
If you remove a Resource Binding for an existing Resource Request, Kratix will automatically recreate the Binding.
