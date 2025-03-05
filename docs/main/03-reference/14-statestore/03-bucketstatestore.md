---
description: Documentation for the Kratix BucketStateStore Custom Resource
title: BucketStateStore
sidebar_label: BucketStateStore
id: bucketstatestore
---

# BucketStateStore

Kratix supports writing to S3-Compatible buckets. See below for the API documentation:

```yaml
apiVersion: platform.kratix.io/v1alpha1
kind: BucketStateStore
metadata:
  name: default
spec:
  # Bucket name: required
  bucketName: kratix
  # The endpoint of the bucket provider: required
  endpoint: s3.eu-west-2.amazonaws.com
  # Skip TLS veritfication: optional, defaults to false
  insecure: false
  # The Top-level path in the Bucket repository to write to: optional
  path: destinations/
  # Valid options: accessKey, and IAM; defaults to accessKey
  authMethod: accessKey
  # Required when using accessKey auth method
  secretRef:
    # The name and namespace of the secret to use to authenticate 
    name: s3-credentials
    namespace: default
```

### S3-Compatible Providers

Any S3-Compatible provider will work with Kratix. See the documentation on how
to use some of the available providers below:
- [AWS S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html)
- [GCS S3-compatible storage](https://cloud.google.com/storage/docs/interoperability)
- [MinIO](https://min.io/docs/minio/linux/reference/minio-mc/mc-mb.html)

For other providers see there documentation for setting up the bucket and credentials.

## Auth


The `.spec.authMethod` key is used to determine which authentication method
should be used when communicating to the S3-Compatible API. There are two
supports types:

- `accessKey`
- `IAM`

### Access Key

When `authMethod: accessKey` is set Kratix uses the credentials contained in the
`secretRef` to authenticate with the S3-Compatible Bucket. The secret must
contain `accessKeyID` and `secretAccessKey`. Example:

```yaml
---
apiVersion: platform.kratix.io/v1alpha1
kind: BucketStateStore
metadata:
  name: default
spec:
  endpoint: minio.kratix-platform-system.svc.cluster.local
  insecure: true
  bucketName: kratix
  secretRef:
    name: minio-credentials
    namespace: default
---
apiVersion: v1
kind: Secret
metadata:
  name: minio-credentials
  namespace: default
type: Opaque
data:
  accessKeyID: <base64 encoded accessKeyID>
  secretAccessKey: <base64 encoded secretAccessKey>
```

### IAM

When `authMethod: IAM` is set, Kratix will assume that the place in which it's 
running has been given permissions to authenticate with the S3 API using its
IAM Role. In practise, this might mean that you are running Kratix in AWS, and that
the node role for the instance Kratix is running on has been given permissions
to read/write to the bucket. Similarly, rather than giving the node role
permissions, you may be using [IAM Roles for
ServiceAccounts](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html)
to give permissions to just the Kratix container. With both approaches the
configuration for the State store is the same:

```yaml
---
apiVersion: platform.kratix.io/v1alpha1
kind: BucketStateStore
metadata:
  name: default
spec:
  bucketName: kratix-example-test
  endpoint: s3.eu-west-2.amazonaws.com # ensure to change with your bucket region.
  insecure: false
  authMethod: IAM
```

When running in EKS you need to ensure your security group rules allow Kratix to
access the S3 API. If you are running the cluster in a restricted setup you can
grant the access to just the S3 API using [gateway VPC
endpoints](https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-s3.html)

---

Require a different method of authentication? Get in touch with us at
[feedback@syntasso.io](mailto:feedback@syntasso.io?subject=Kratix%20Feedback)
or [open a GitHub Issue](https://github.com/syntasso/kratix/issues/new).

## Status

The status of the BucketStateStore can be `Ready` or `NotReady` based on Kratix's availability to write to the State Store.

A condition of type `Ready` is also provided to enable waiting for the State Store to be ready.

An example is provided below showing a BucketStateStore coming online, including events detailing any status changes.

```
$ kubectl describe bucketstatestores.platform.kratix.io default
Name:         default
...
Status:
  Conditions:
    Last Transition Time:  2025-03-05T12:52:49Z
    Message:               State store is ready
    Reason:                StateStoreReady
    Status:                True
    Type:                  Ready
  Status:                  Ready
Events:
  Type    Reason  Age   From                        Message
  ----    ------  ----  ----                        -------
  Normal  Ready   11m   BucketStateStoreController  BucketStateStore "default" is ready
```

:::info

Kratix determines whether it can write to the State Store by writing a `kratix-write-probe.txt` file under the State Store's `.spec.path` filepath.

:::