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
- [Terraform](https://www.terraform.io/): There are many tools that can trigger a `terraform apply`
  when a new Terraform file is committed to a Git repository. For example,
  [Terraform
  Enterprise](https://www.hashicorp.com/resources/gitops-and-terraform-enterprise-a-match-made-in-heaven-at-state-farm)
  has built-in support for GitOps workflows.
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
  # Required field; In most cases, you can set it to the name of the Destination.
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
  #   - aggregatedYAML: Writes to the State Store in a single YAML file
  #   - none: Writes to the State Store in a flat structure
  filepath:
    mode: nestedByMetadata | aggregatedYAML | none

    # Optional; only used for `aggregatedYAML` mode
    # The filename to use when writing to the State Store
    # defaults to `aggregated.yaml`
    filename: "aggregated.yaml"

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
statestore.spec.path/
├── destination.spec.path/
    ├── dependencies/
        ├── promise.name/
```

For `resources`:

```
statestore.spec.path/
├── destination.spec.path/
    ├── resources/
        ├── resource.mamespace/
            ├── promise.name/
                ├── resource.namespace/
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

The following directories would be created in the State Store (that is, the bucket `kratix.s3.amazonaws.com`):

- `destinations/dev/default/dependencies/`
- `destinations/dev/default/resources/`

:::info

Here's a breakdown of the path structure and their relationship to the example above:

```text
destinations/      ← statestore.spec.path
├── dev/           ← destination.spec.path
    ├── default/   ← destination.spec.path
        ├── resources/        ← fixed name
        ├── dependencies/        ← fixed name
```
:::

Kratix will, by default, write to unique directories within those paths
depending on the Promise or Resource being requested. To stop this behaviour,
check the `filepath.mode` field in the Destination Spec.

:::info

Pre-requisites, like CRDs, are written to the `dependencies` subdirectory. This setup is
often required by GitOps tools to ensure that all dependencies are ready before the
resources themselves are applied.

:::

## Status

A condition of type `Ready` is provided to enable waiting for the Destination to be ready. The Destination is considered
ready when Kratix is able to write test documents successfully.

See the example below showing a Destination with `Ready` condition.

```
$ kubectl describe destinations.platform.kratix.io worker-1
Name:         worker-1
...
Status:
  Conditions:
    Last Transition Time:  2025-03-04T15:26:21Z
    Message:               Test documents written to State Store
    Reason:                TestDocumentsWritten
    Status:                True
    Type:                  Ready
```

:::info

The test documents include `dependencies/kratix-canary-namespace.yaml` and `resources/kratix-canary-configmap.yaml`. When
the `Ready` condition status is `True` and the target is a Kubernetes cluster set up to reconcile on the Destination, you
will see a `kratix-worker-system` namespace and a `kratix-info` configmap on the target cluster.

:::
