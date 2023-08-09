---
description: Documentation for the Kratix Destination Custom Resource
title: Destination Custom Resource
sidebar_label: Destinations
id: intro
---

The Kratix Destination Custom Resource Definition (CRD) is the representation of a system where workloads
can be scheduled to. These can be Kubernetes clusters or any other infrastructure that can be deployed to using GitOps.
See below for the API documentation:

```yaml
apiVersion: platform.kratix.io/v1alpha1
kind: Destination
metadata:
  # The Destination name is an arbitrary name that represent where workloads will be scheduled by the platform
  name: destination-name
  # The Destination labels are arbitrary key/value pairs that can be used for scheduling
  #   the installation of Promises and the Resources
  labels:
    environment: dev
spec:
  # Destination identifier: optional, appended path to be used within the State Store
  path: path/in/statestore
  # Required
  stateStoreRef:
    # The name of the State Store to use: required
    name: default
    # The kind of the State Store to use: required, valid options: GitStateStore, BucketStateStore
    kind: BucketStateStore
```

When a new Destination is registered in the Platform cluster (i.e., a new Destination resource is
created), Kratix will write to two paths in the [State Store](../06-statestore/01-statestore.md):
one for `resources`, one for `crds`. The path within the `State Store` follows the following pattern:
```
statestore.Spec.Path/
    destination.Spec.Path/
        destination.Metadata.Namespace/
            destination.Metadata.Name/
```

For example:
```yaml
---
apiVersion: platform.kratix.io/v1alpha1
kind: BucketStateStore
metadata:
  name: default
  namespace: default
spec:
  path: destinations
  endpoint: s3.amazonaws.com
  insecure: true
  bucketName: kratix
  secretRef:
    name: aws-credentials
---
apiVersion: platform.kratix.io/v1alpha1
kind: Destination
metadata:
  name: worker-1
  labels:
    environment: dev
spec:
  path: dev
  stateStoreRef:
    name: default
    kind: BucketStateStore
```

The above configuration would result in the following paths being written to:
 - `destinations/dev/default/worker-1/crds/`
 - `destinations/dev/default/worker-1/resources/`

<br/>

The paths should be used when setting up the workers to pull
down from the `StateStore`.

:::info

The reason for two directories is that GitOps applies require any prerequisite workloads like CRDs to be ready before any dependent workloads are applied. By dividing the two directories you can configure your GitOps tool to manage this for you.

:::
