---
description: Documentation for the Kratix Destination Custom Resource
title: Destination Custom Resource
sidebar_label: Destinations
id: intro
---

The Kratix Destination Custom Resource Definition (CRD) is the representation of
a system where Kratix can write documents to. These documents are then
reconciled by an external tool.

Some example use cases:
- [Kubernetes cluster](https://kubernetes.io/): Kratix will scheduled documents (Kubernets manifests) to
  the Destination, and then a GitOps tool running on the Kubernetes cluster,
  such as Flux or ArgoCD with pull down the documents and deploy them.
- [Terraform](https://www.terraform.io/): There are many toolings that exists to trigger Terraform applys
  when a new terraform file is committed to a Git repository. For example
  [Terraform
  Enterprise](https://www.hashicorp.com/resources/gitops-and-terraform-enterprise-a-match-made-in-heaven-at-state-farm)
  has built in support for GitOps workflows.
- [Ansible](https://www.ansible.com/), where an Ansible Tower can be configured to reconcile from a Git
  repository.
- [Backstage](https://backstage.io/), where a Backstage instance can be configured have its [Catalog
  filled from a Git
  repository](https://backstage.io/docs/integrations/github/discovery).


Below is the full Spec for the Destination CRD:
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

  # Optional, defaults to false

  # By default, Kratix will schedule workloads for Promises without
  #   `destinationSelectors` to all available Destinations.
  # If this property is set to true, Kratix will only schedule Workloads
  #   to this Destination if the Promise `destinationSelectors` match
  #   this Destination's labels
  strictMatchLabels: false

  # Required
  stateStoreRef:
    # The name of the State Store to use: required
    name: default
    # The kind of the State Store to use: required, valid options: GitStateStore, BucketStateStore
    kind: BucketStateStore
```

When a new Destination is registered in the platform cluster (i.e., a new Destination resource is
created), Kratix will write to two paths in the [State
Store](../statestore/intro):
one for `resources`, one for `crds`. The path within the `State Store` follows the following pattern:

For `dependencies`:

```
statestore.Spec.Path/
    destination.Spec.Path/
        destination.Name/
            dependencies/
                promise.Name/
```

For `resources`:

```
statestore.Spec.Path/
    destination.Spec.Path/
        destination.Name/
            resources/
                resource.Namespace/
                    promise.Name/
                        resource.Namespace/
```

For example installing and requesting from a Promise that provides `Redis` as a service you would get:

```
worker-cluster/dependencies/redis/static/dependencies.yaml
worker-cluster/resources/default/redis/my-request/redis.yaml
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
