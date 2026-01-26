---
description: Documentation for the Kratix PromiseRevision Custom Resource
title: Promise Revisions
sidebar_label: Promise Revisions
---

# Promise Revisions

```mdx-code-block
import FeatureFlagBox from "./_feature_flag_box.md"
```

<FeatureFlagBox />

Promise Revisions provide a mechanism for locking a Promise to a specific version.

When a Promise is installed, Kratix will automatically create a Promise Revision for that Promise. This Promise Revision
consists of a reference to the Promise, the desired version, and the `spec` of the Promise at
that version, including the Promise API, dependencies and workflows. This
initial Promise Revision will be labeled as the `latest` revision (via the `kratix.io/latest-revision` label).

The Resource request for the Promise will be bound to the `latest` Promise Revision via a Resource Binding.

:::info

Promise Revisions are fully managed by Kratix. As a Kratix user, you will not need to create or update Promise
Revisions manually.

:::

A Promise Revision will look like this:

```yaml
apiVersion: platform.kratix.io/v1alpha1
kind: PromiseRevision
metadata:
  labels:
    kratix.io/promise-name: promise-name
  name: promise-revision-name
  # Name of the Promise Revision; this takes the form <PROMISE_NAME>-<VERSION>
spec:
  promiseRef:
    name: promise-name
  promiseSpec:
  # The full promise.spec of the Promise
    api:
    destinationSelectors:
    workflows:
  version: v0.1.0
  # The version of the Promise as indicated by the kratix.io/promise-version label
status: {}
```

## Updating a Promise

Kratix will automatically generate a `latest` Promise Revision for the latest applied Promise. When a new
_version_ of the Promise is installed, a new Promise Revision will be created reflecting the updated specification at the
updated version. This newly created Promise Revision will be become the new `latest` revision.

For example, if the Redis Promise is initially installed at `v0.1.0` (via the `kratix.io/promise-version` label) and then upgraded to `v0.2.0` (via the same label), there will be two Promise Revisions in the system, with `v0.2.0` labelled as the `latest`.

```shell-session
$ kubectl get promiserevisions
NAME           LATEST
redis-v0.1.0
redis-v0.2.0   true
```

:::tip

When a Promise is installed with no version tag, the Promise Revision will be crated with a `version` configured as `not set`.

:::

If a Promise is updated, but the version already has a Promise Revision
associated to it, the existing Promise Revision will be updated to reflect the
updated Promise spec.

:::warning

Kratix _does not take_ [semantic versioning](https://semver.org/) into account
when applying the `latest` label, as not all Promises might use it. This means
that if you have version `0.2.0` installed and you install version `0.1.0`, the
`latest` Promise version will be `0.1.0` because it is the most recently
installed Promise.

:::


## Deleting a Promise Revision

Upon initiating the deletion of a Promise Revision, the Resource Requests created from that Promise Revision will be
deleted alongside their Resource Bindings.

:::info

The Promise Revision with the `latest` label cannot be deleted, as a result, the Resource Requests will not be
deleted. To delete the `latest` Revision, you should delete the Promise.

:::
