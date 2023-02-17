---
description: Documentation for the Kratix Cluster Custom Resource
title: Cluster Custom Resource
sidebar_label: Clusters
id: intro
---

The Kratix Cluster Resource is the representation of a system where workloads can be scheduled to, which are usually Kubernetes clusters. See below for the API documentation:

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
  # Cluster identifier: required
  id: cluster-id
  # Path to be used by Kratix to create the buckets
  bucketPath: bucket-path
```

When a new Cluster is registered in the Platform cluster (i.e., a new Cluster Resource is
created), Kratix will create a pair of buckets in the [Repository](../01-deployment-topology/01-deployment-topology.md#gitops-repository): one for `resources`, one for `crds`. The
full path of the buckets will be:

- `<spec.bucketPath>-resources`
- `<spec.bucketPath>-crds`
