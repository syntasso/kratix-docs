---
description: Documentation for the Kratix Destination Custom Resource
title: Destination
sidebar_label: Destinations
id: intro
---

The Kratix Destination Custom Resource Definition (CRD) is the representation of
a system that Kratix can write documents to. These documents are then
reconciled by an external tool.

Some example use cases:

- [Kubernetes cluster](https://kubernetes.io/): Kratix will scheduled documents (Kubernetes manifests) to
  the Destination, and then a GitOps tool running on the Kubernetes cluster,
  such as Flux or ArgoCD with pull down the documents and deploy them. See our
  [GitOps Agent documentation](/category/installing-gitops-agent) for more information.
- [Terraform](https://www.terraform.io/): There are many toolings that exist to trigger a `teraform apply`
  when a new Terraform file is committed to a Git repository. For example
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
  # Path within the State Store to write to.
  # Optional, defaults to the name of the Destination.
  # To write straight to the root of the State Store, set it to `/`.
  path: path/in/statestore

  # Optional, defaults to false.
  # By default, Kratix will schedule workloads for Promises without
  #   `destinationSelectors` to all available Destinations.
  # If this property is set to true, Kratix will only schedule Workloads
  #   to this Destination if the Promise `destinationSelectors` match
  #   this Destination's labels
  strictMatchLabels: false

  # Optional, defaults to `nestedByMetadata`
  # The mode to use when writing to the State Store, valid options are:
  #   - nestedByMetadata: Writes to the State Store in a nested structure
  #   - none: Writes to the State Store in a flat structure
  filepath:
    mode: nestedByMetadata | none

  # Optional, defaults to `none`
  # The cleanup policy to use when deleting the Destination, valid options are:
  #   - none: No cleanup will be performed
  #   - all: All files in the State Store for this Destination will be deleted
  #          when the Destination is deleted
  cleanup: none

  # Required
  stateStoreRef:
    # The name of the State Store to use: required
    name: default
    # The kind of the State Store to use: required, valid options: GitStateStore, BucketStateStore
    kind: BucketStateStore
```

When a new Destination is created in the platform cluster, Kratix will write to
two paths in the [State Store](../statestore/intro): one for `resources`, one
for `dependencies`. The path within the `State Store` follows the pattern:

For `dependencies`:

```
statestore.Spec.Path/
    destination.Spec.Path/
        dependencies/
            promise.Name/
```

For `resources`:

```
statestore.Spec.Path/
    destination.Spec.Path/
        resources/
            resource.Namespace/
                promise.Name/
                    resource.Namespace/
```

For example, for the following configuration:

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

The following directories would be created in the State Store:

- `destinations/dev/default/dependencies/`
- `destinations/dev/default/resources/`

Kratix will, by default, write to unique directories within those paths depending on the
Promise or Resource being requested. You can stop this behaviour by setting the `filepath.mode` to `none`.

:::info

Pre-requisites, like CRDs, are written to the `dependencies` subdirectory. This setup is
often required by GitOps tools to ensure that all dependencies are ready before the
resources themselves are applied.

:::
