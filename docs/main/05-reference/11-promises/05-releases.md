---
description: Documentation for the Promise Release
title: Versioning
sidebar_label: Versioning
id: releases
---

Platform engineers can version their Promise by adding the following label to
their Promise definition:

```yaml
apiVersion: platform.kratix.io/v1alpha1
kind: Promise
metadata:
  name: jenkins
  labels:
#highlight-next-line
    kratix.io/promise-version: v1.1.0
spec:
  # Promise spec
```

A Promise version is an arbitrary number that represents a specific version of a
Promise. Kratix will, through Promise Releases, ensure the Promise at the
specified version is installed in the Platform.

## Promise Release

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
  version: # The version of the Promise found at the sourceRef
  sourceRef:
    type: # Source type: http, git, etc.
    # Source specific fields
```

The `spec.version` represents the version of the Promise that can be found at
the `sourceRef`. If the Promise version label and the Promise Release
`spec.version` do not match, Kratix will not install the Promise.

`spec.version` can be left blank. In this case, Kratix will set the Promise
Release `spec.version` to the version of the Promise found at the `sourceRef` at
the first reconciliation loop.

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
    url: https://raw.githubusercontent.com/syntasso/kratix-marketplace/main/jenkins/promise.yam
    # secretRef: # OPTIONAL
      # name: secret-name
      # namespace: example-namespace
```

#### Authenticated endpoints

When fetching a URL, authorization can be provided via the `Authorization` header.
To provide this to Kratix, add the optional `secretRef` field to the `sourceRef`.

The secret must contain a key called `authorizationHeader` which is set to the full
value of the `Authorization` header. For example, to curl from a private GitHub
repository you could run:

```bash
curl -H 'Authorization: Bearer my-bearer-token-for-gh' https://raw.githubusercontent.com/secret-org/secret-repo/refs/heads/main/promise.yaml
```

To enable the PromiseRelease to access the same URL, you must have the following
key:value in your secret:

```yaml
authorizationHeader: "Bearer my-bearer-token-for-gh"
```

:::note

This header value needs to be a simple string. If you are creating the secret manually,
make sure not to include any new lines in your base64 encoded value. You can do this
by including `-n` in any echo command (e.g. `echo -n "Bearer my-bearer-token-for-gh" | base64`)

:::

## Updating Promise Releases

Whenever the `spec.version` of a Promise Release changes, Kratix will
automatically fetch the latest Promise definition from the `sourceRef` and
update it in the Platform, as long as the Promise version label matches the
Promise Release version.

Note that updating the Promise version in the remote location will not
automatically update the Promise in the Platform. The Promise Release
`spec.version` must be updated to trigger the Promise update.

If the Promise is deleted from Platform, but the Promise Release still exists, Kratix
will automatically re-install the Promise.

## Deleting Promise Releases

When a Promise Release is deleted, the underlying Promise is also deleted. This will
delete all resources associated with that Promise. See [Deleting a Promise](../promises/delete).
