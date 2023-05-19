---
description: Documentation for the Kratix BucketStateStore Custom Resource
title: BucketStateStore
sidebar_label: BucketStateStore
id: bucketstatestore
---

## BucketStateStore

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

### Auth


Require a different method of authentication? Get in touch with us at
[feedback@syntasso.io](mailto:feedback@syntasso.io?subject=Kratix%20Feedback)
or [open a GitHub Issue](https://github.com/syntasso/kratix/issues/new).

