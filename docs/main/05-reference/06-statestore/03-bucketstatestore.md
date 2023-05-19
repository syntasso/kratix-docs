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
  namespace: default
spec:
  # Bucket name: required
  bucketName: kratix
  # The endpoint of the bucket provider: required
  endpoint: s3.amazonaws.com
  # Skip TLS veritfication: optional, defaults to false
  insecure: false
  # The Top-level path in the Bucket repository to write to: optional
  path: clusters/
  # Required
  secretRef:
    # The name of the secret to use to authenticate: required
    name: s3-credentials
    # The namespace of the secret to use: optional, defaults to the BucketStateStore namespace
    namespace: default
    # The Top-level path in the Bucket repository to write to: optional
```

## Auth

Kratix uses the credentials contained in the `secretRef` to authenticate with the
S3-Compatible Bucket. Kratix currently supports `accessKeyID` and `secretAccessKey` to authenticate.
The secret should be in the following format:
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: # name
  namespace: # namespace
type: Opaque
data:
  accessKeyID: # base64 encoded accessKeyID
  secretAccessKey: # base64 encoded secretAccessKey
```


## Best Practises
Its recommended that the bucket configured is only used by Kratix and doesn't contain
any other objects. Its also recommended that credentials provided only have read/write
access to the specific bucket.


Require a different method of authentication? Get in touch with us at
[feedback@syntasso.io](mailto:feedback@syntasso.io?subject=Kratix%20Feedback)
or [open a GitHub Issue](https://github.com/syntasso/kratix/issues/new).

