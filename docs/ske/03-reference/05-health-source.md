---
description: Documentation for the Health Source Custom Resource
title: Health Source
sidebar_label: Health Source
id: healthsource
---

# Health Source

The Health Source Custom Resource Definition (CRD) tells the SKE Platform
Manager where to read Health Records from: one bucket, one prefix, one
credential. It is the alternative to a GitOps agent syncing the same records.

It is **cluster-scoped**, and it is not a Destination: one source may carry
records from many Destinations, which stay distinct because their object keys
differ.

```yaml
apiVersion: platform.syntasso.io/v1alpha1
kind: HealthSource
metadata:
  # At most 63 characters: the name labels every record this source applies
  name: worker-1
spec:
  bucket:
    # generic for any S3-compatible store, azure for Azure Blob Storage
    provider: generic
    # A bare host under generic; the storage-account URL under azure
    endpoint: s3.eu-west-2.amazonaws.com
    # The bucket, or under azure the container
    bucketName: kratix
    # accessKey or IAM under generic, sharedKey under azure
    authMethod: accessKey
    # The Secret holding the credentials, required for every method except IAM
    secretRef:
      name: health-store-reader
      namespace: default
  # The prefix to read: Health Records and nothing else
  path: health
  # How often the source is listed
  pollInterval: 10m
```

## `spec`

| Field | Type | Description |
| --- | --- | --- |
| `bucket` | object | **Required.** The object store to read from. See [`spec.bucket`](#specbucket). |
| `path` | string | The prefix to read, matching the `path` the agents writing here use. Read recursively, so it may hold a directory per Destination or records directly. Everything under it must be Health Records and nothing else: the reader can only tell that an object is not one by fetching it. |
| `pollInterval` | duration | How often the source is listed. Minimum `1s`. Default `10m`. |

## `spec.bucket`

| Field | Type | Description |
| --- | --- | --- |
| `endpoint` | string | **Required.** A bare host under `generic`. Under `azure`, the storage-account URL (`https://<account>.blob.core.windows.net`); a bare host gets `https` unless `insecure` is set. |
| `bucketName` | string | **Required.** The bucket to read from; under `azure`, the container. |
| `provider` | enum | `generic` for any S3-compatible store, `azure` for Azure Blob Storage. Default `generic`. |
| `authMethod` | enum | `accessKey`, `IAM` or `sharedKey`. `accessKey` and `sharedKey` read from `secretRef`; `IAM` uses the ambient instance identity. `sharedKey` is `azure`'s only method, and `azure`'s only. Defaults to `accessKey` under `generic` and `sharedKey` under `azure`. |
| `secretRef` | object | `name` and `namespace` of the Secret holding the credentials. Required for every `authMethod` except `IAM`. Keys are `accessKeyID` and `secretAccessKey` for `accessKey`, `accountKey` for `sharedKey`. The reader only lists and gets, though an Azure `sharedKey` cannot be restricted to that. |
| `insecure` | boolean | Connect over HTTP rather than HTTPS. Under `azure` it applies only when the endpoint omits a scheme; an endpoint that spells one keeps it. Default `false`. |
| `useDualStack` | boolean | Opt in to Amazon's dual-stack endpoints, which are unreachable from IPv4-only VPCs. No effect on non-Amazon endpoints, unsupported under `azure`. Default `false`. |

## `status`

| Field | Type | Description |
| --- | --- | --- |
| `conditions` | array | `Ready` is `True` once a poll has read the source and applied everything in it. `False` carries a reason naming the thing at fault: `SourceMisconfigured`, `CredentialsUnavailable`, `CredentialsRejected`, `BucketNotFound`, `SourceUnreachable`, `RecordsUnreadable` or `PlatformUnavailable`. |
| `observedGeneration` | integer | The generation of the spec the last poll acted on. |
| `lastPollTime` | timestamp | When the source was last listed, successfully or not. |
| `lastSuccessfulPollTime` | timestamp | When a poll last read the source and applied what it read. Does not move when a poll fails, so the gap from `lastPollTime` is how long these records have been stale. |
| `recordsObserved` | integer | The number of keys the last successful listing returned. |
| `recordsApplied` | integer | The number of records the last poll applied. Only changed revisions are fetched, so a steady state polls to `0`. |
| `recordsFailed` | integer | The number of keys the last poll could not read or parse. |

## Metadata on applied records

Every `HealthRecord` the reader applies carries:

| Key | Description |
| --- | --- |
| `platform.syntasso.io/health-source` (label) | The `HealthSource` that applied it. Scopes everything the reader does, so it never touches a record it did not apply. |
| `platform.syntasso.io/object-key` (annotation) | The object key the record was read from, relative to `spec.path`. |
| `platform.syntasso.io/object-revision` (annotation) | The revision that was read, which is how the reader decides whether to fetch again. |

Each record is also owned by its `HealthSource`, so deleting the source garbage
collects every record it applied.

## Setting one up

To configure a Health Source, see [Set up the HealthSource on the
Platform](/ske/installing-ske/ske-health-agent#set-up-the-healthsource-on-the-platform).
To move an existing Destination off a GitOps sync onto a bucket without a gap in
health, see [Move health records onto a
bucket](/ske/guides/health-records-from-a-bucket).
