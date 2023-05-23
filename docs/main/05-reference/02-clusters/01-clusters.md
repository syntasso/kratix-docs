---
description: Documentation for the Kratix Cluster Custom Resource
title: Cluster Custom Resource
sidebar_label: Clusters
id: intro
---

The Kratix Cluster Resource is the representation of a system where workloads
can be scheduled to, which are usually Kubernetes clusters.
See below for the API documentation:

```yaml
apiVersion: platform.kratix.io/v1alpha1
kind: Cluster
metadata:
  # The Cluster name is an arbitrary name that represent the cluster in the platform
  name: cluster-name
  # The Cluster labels are arbitrary key/value pairs that can be used for scheduling
  #   the installation of Promises and the workloads
  labels:
    environment: dev
spec:
  # Cluster identifier: optional, appended path to be used within the StateStore
  path: path/in/statestore
  # Required
  stateStoreRef:
    # The name of the StateStore to use: required
    name: default
    # The kind of the StateStore to use: required, valid options: GitStateStore, BucketStateStore
    kind: BucketStateStore
```

When a new Cluster is registered in the Platform cluster (i.e., a new Cluster Resource is
created), Kratix will write to two paths in the [StateStore](../06-statestore/01-statestore.md):
one for `resources`, one for `crds`. The path within the `StateStore` follows the following pattern:
```
statestore.Spec.Path/
    cluster.Spec.Path/
        cluster.Metadata.Namespace/
            cluster.Metadata.Name/
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
  path: clusters
  endpoint: s3.amazonaws.com
  insecure: true
  bucketName: kratix
  secretRef:
    name: aws-credentials
---
apiVersion: platform.kratix.io/v1alpha1
kind: Cluster
metadata:
  name: worker-cluster-1
  labels:
    environment: dev
spec:
  path: dev
  stateStoreRef:
    name: default
    kind: BucketStateStore
```

The above configuration would result in the following paths being written to:
 - `clusters/dev/default/worker-cluster-1/crds/`
 - `clusters/dev/default/worker-cluster-1/resources/`

<br/>

The paths should be used when setting up the worker clusters to pull
down from the `StateStore`.
