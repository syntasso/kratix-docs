---
description: Learn more about the Cluster document
title: Clusters
id: intro-clusters
---

This page contains documentation for the Kratix Cluster. The Cluster Resource is a
representation of a system where workloads can be scheduled to, which in turn are usually
Kubernetes clusters. See below for the API documentation:

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
created), Kratix will create a pair of buckets: one for `resources`, one for `crds`. The
full path of the buckets will be:

* `<spec.bucketPath>-resources`
* `<spec.bucketPath>-crds`
