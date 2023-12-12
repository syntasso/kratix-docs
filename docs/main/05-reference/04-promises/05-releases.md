---
description: Documentation for the Promise Release
title: Releases
sidebar_label: Releases
id: releases
---

A Promise Release represents a Promise with a specific version that will be installed in
the Platform. Kratix knows how to fetch the Promise from the specified source and will
manage the lifecycle of that Promise.

The API for a Promise Release is:

```yaml
apiVersion: platform.kratix.io/v1alpha1
kind: PromiseRelease
metadata:
  name: jenkins-release
spec:
  version: # The version of the Promise
  sourceRef:
    type: # Source type: http, git, etc.
    # Source specific fields
```

The `spec.version` represents the version of the Promise as it relates to your platform.
It is an arbitrary number and doesn't need to follow any specific format.

Promise authors can decide to version their Promises either via a Promise Release or by
versioning their Promise definition directly. In the latter case, platform engineers
must wrap that Promise in a Promise Release and assign it a version.

## Source Reference types

Currently, the following `sourceRef.types` are supported:

### HTTP

The HTTP `sourceRef.type` is used to fetch a Promise from a HTTP endpoint. The
`sourceRef.url` must be set to a valid URL containing a single Promise definition.

The below example shows a Promise Release using the HTTP `sourceRef.type`:

```yaml
apiVersion: platform.kratix.io/v1alpha1
kind: PromiseRelease
metadata:
  name: jenkins-release
spec:
  version: v1.1.0
  sourceRef:
    type: http
    url: https://raw.githubusercontent.com/syntasso/kratix-marketplace/main/jenkins/promise.yaml
```

## Updating Promise Releases

Whenever the `spec.version` of a Promise Release changes, Kratix will
automatically fetch the latest Promise definition from the `sourceRef` and
update it in the Platform.

Note that updating the Promise definition in the remote location will not
automatically update the Promise in the Platform. The Promise Release
`spec.version` must be updated to trigger the Promise update.

If the Promise is deleted from Platform, but the Promise Release still exists, Kratix
will automatically re-install the Promise.

## Deleting Promise Releases

When a Promise Release is deleted, the underlying Promise is also deleted. This will
delete all resources associated with that Promise. See [Deleting a Promise](../promises/delete).
