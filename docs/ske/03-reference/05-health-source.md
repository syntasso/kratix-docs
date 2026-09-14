---
description: Documentation for the Health Source Custom Resource
title: Health Source
sidebar_label: Health Source
id: healthsource
---

# Health Source

The Health Source Custom Resource Definition (CRD) names a place the SKE Platform Manager reads
Health Records from: one bucket, one prefix, one credential. It is the Platform's side of health
delivery, and the alternative to running a GitOps agent that syncs the same records.

It is **cluster-scoped**, and it is not a Destination. A single source may carry records written by
many Destinations, which stay distinct because their object keys differ.

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
  # The prefix to read, matching the path the agents writing here use
  path: health
  # How often the source is listed
  pollInterval: 10m
```

## `spec`

| Field | Type | Description |
| --- | --- | --- |
| `bucket` | object | **Required.** The object store to read from. See [`spec.bucket`](#specbucket). |
| `path` | string | The prefix within the bucket to read, matching the `path` the agents writing here are configured with. Everything below it is read recursively, so it may hold a directory per Destination or record files directly. Keep it tight. |
| `pollInterval` | duration | How often the source is listed. Minimum `1s`. Default `10m`. |

## `spec.bucket`

| Field | Type | Description |
| --- | --- | --- |
| `endpoint` | string | **Required.** Under `generic`, a bare host with no scheme. Under `azure`, the storage-account URL (`https://<account>.blob.core.windows.net`); a bare host gets `https` unless `insecure` is set. |
| `bucketName` | string | **Required.** The bucket to read from; under `azure`, the container. |
| `provider` | enum | `generic` for any S3-compatible store, `azure` for Azure Blob Storage. Default `generic`. |
| `authMethod` | enum | `accessKey`, `IAM`, or `sharedKey`. `accessKey` and `sharedKey` read from `secretRef`; `IAM` uses the ambient instance identity. `sharedKey` is `azure`'s only method, and `azure`'s only. Omitted means `accessKey` under `generic` and `sharedKey` under `azure`. |
| `secretRef` | object | `name` and `namespace` of the Secret holding the credentials. Required for every `authMethod` except `IAM`, which ignores it. Keys are `accessKeyID` and `secretAccessKey` for `accessKey`, or `accountKey` for `sharedKey`. The reader only ever lists and gets under `spec.path`, though an Azure `sharedKey` cannot itself be restricted to that. |
| `insecure` | boolean | Connect over HTTP rather than HTTPS. Under `azure` it applies only when the endpoint omits a scheme; an endpoint that spells one keeps it. Default `false`. |
| `useDualStack` | boolean | Opt in to Amazon's dual-stack endpoints. Off by default, because they are unreachable from IPv4-only VPCs. No effect on non-Amazon endpoints, and not supported under `azure`. |

## `status`

| Field | Type | Description |
| --- | --- | --- |
| `conditions` | array | `Ready` is `True` once a poll has read the source and applied everything in it. `False` carries a reason naming the thing at fault: `SourceMisconfigured`, `CredentialsUnavailable`, `CredentialsRejected`, `BucketNotFound`, `SourceUnreachable`, `RecordsUnreadable` or `PlatformUnavailable`. |
| `observedGeneration` | integer | The generation of the spec the last poll acted on. |
| `lastPollTime` | timestamp | When the source was last listed, successfully or not. |
| `lastSuccessfulPollTime` | timestamp | When a poll last read the source and applied what it read. Unlike `lastPollTime` it does not move when a poll fails, so the gap between the two is how long this source's records have been stale. |
| `recordsObserved` | integer | The number of keys the last successful listing returned. |
| `recordsApplied` | integer | The number of records the last poll applied. Only records whose object revision changed are fetched, so a steady state polls to `0`. |
| `recordsFailed` | integer | The number of keys the last poll could not read or parse. |

## Metadata on applied records

Every `HealthRecord` the reader applies carries:

| Key | Description |
| --- | --- |
| `platform.syntasso.io/health-source` (label) | The name of the `HealthSource` that applied it. Scopes everything the reader does, so it can never touch a record it did not apply. |
| `platform.syntasso.io/object-key` (annotation) | The object key in the bucket the record was read from. |
| `platform.syntasso.io/object-revision` (annotation) | The object revision that was read, which is how the reader decides whether to fetch again. |

Each record is also owned by its `HealthSource`, so deleting the source garbage collects every
record it applied.

## Setting one up

To configure a Health Source, see
[Set up the HealthSource on the Platform](/ske/installing-ske/ske-health-agent#set-up-the-healthsource-on-the-platform).
To move an existing Destination off a GitOps sync onto a bucket without a gap in health, see
[Move health records onto a bucket](/ske/guides/health-records-from-a-bucket).
