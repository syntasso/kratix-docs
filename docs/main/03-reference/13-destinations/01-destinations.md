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

- [Kubernetes cluster](https://kubernetes.io/): Kratix will schedule documents (Kubernetes manifests) to
  the Destination, and then a GitOps tool running on the Kubernetes cluster,
  such as Flux or ArgoCD, will pull down the documents and deploy them. See our
  [GitOps Agent documentation](/category/installing-gitops-agent) for more information.
- [Terraform](https://www.terraform.io/): There are many tools that can trigger a `terraform apply`
  when a new Terraform file is committed to a Git repository. For example,
  [Terraform
  Enterprise](https://www.hashicorp.com/resources/gitops-and-terraform-enterprise-a-match-made-in-heaven-at-state-farm)
  has built-in support for GitOps workflows.
- [Ansible](https://www.ansible.com/), where an Ansible Tower can be configured to reconcile from a Git
  repository.
- [Backstage](https://backstage.io/), where a Backstage instance can be configured to have its [Catalog
  filled from a Git
  repository](https://backstage.io/docs/integrations/github/discovery).

## Spec

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


  # Controls whether Kratix writes initial placeholder files to the StateStore for this Destination
  initWorkloads:
    # If false, Kratix will not create the files
    # Defaults to true
    enabled: true
```

## State Store layout

When a new Destination is created in the platform cluster, Kratix writes to two
top-level directories within the [State Store](../statestore/intro): one for
`dependencies` and one for `resources`. Both live under the Destination path,
which is itself nested under the State Store path:

```text
<statestore.spec.path>/<destination.spec.path>/
├── dependencies/
└── resources/
```

- **`dependencies/`** holds files scheduled at the Promise level, such as the
  CRDs and other prerequisites a Promise installs.
- **`resources/`** holds files generated for individual Resource requests.

:::info

Pre-requisites, like CRDs, are written to the `dependencies` subdirectory. This
setup is often required by GitOps tools to ensure that all dependencies are
ready before the resources themselves are applied.

:::

### Example

For the following State Store and Destination configuration:

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

Kratix would create the following directories in the State Store (that is, the
bucket `kratix.s3.amazonaws.com`):

```text
destinations/            ← statestore.spec.path
└── dev/                 ← destination.spec.path
    ├── dependencies/    ← fixed name
    └── resources/       ← fixed name
```

Kratix will, by default, write to unique directories within those paths
depending on the Promise or Resource being requested. To change this behaviour,
set the `filepath.mode` field in the Destination Spec, described below.

## Filepath modes

The `filepath.mode` field controls the exact layout Kratix uses when writing
files to the State Store. It is **immutable** once the Destination is created.
There are three modes: `nestedByMetadata` (the default), `aggregatedYAML`, and
`none`.

In the path templates below, `<destination.spec.path>` is the path configured on
the Destination, written relative to the `statestore.spec.path`.

### nestedByMetadata (default)

Files are written into a nested directory structure derived from the Promise and
Resource metadata. This extends the `dependencies/` and `resources/` layout
shown above with further directories that keep each Promise, Resource, and
pipeline run isolated.

- Dependencies:

  ```text
  <destination.spec.path>/dependencies/<promise-name>/<pipeline-name>/<id>/<files>
  ```

- Resources:

  ```text
  <destination.spec.path>/resources/<resource-namespace>/<promise-name>/<resource-name>/<pipeline-name>/<id>/<files>
  ```

`<id>` is a short, deterministic identifier for the pipeline run, which keeps the
output of each pipeline isolated within its own directory.

### aggregatedYAML

All documents from all pipelines scheduled to the Destination are concatenated
into a single multi-document YAML file written at the root of the Destination
path:

```text
<destination.spec.path>/<filename>
```

`<filename>` defaults to `aggregated.yaml` and can be overridden with the
`filepath.filename` field.

### none

Files are written flat, directly into the top-level Destination path, with no
metadata-based nesting:

```text
<destination.spec.path>/<files>
```

Because the files carry no metadata in their path, Kratix cannot infer which
files belong to which WorkPlacement when it needs to clean them up. To track
this, Kratix writes a state file for each WorkPlacement into a `.kratix`
directory at the root of the Destination path:

```text
<destination.spec.path>/.kratix/<workplacement-namespace>-<workplacement-name>.yaml
```

Each state file lists every file written for that WorkPlacement, for example:

```yaml
files:
  - <destination.spec.path>/configmap.yaml
  - <destination.spec.path>/deployment.yaml
```

:::warning

The `.kratix` directory is managed by Kratix and is used internally to track and
clean up the flat files written in `none` mode. Do not edit or remove its
contents manually.

:::
