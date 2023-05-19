---
description: Documentation for the Kratix StateStore Custom Resources
title: StateStores
sidebar_label: StateStores
id: intro
---
# StateStores

The Kratix `StateStore` resources represent the different backing storage options
for Kratix to write to. Kratix supports both [GitStateStore](./02-gitstatestore.md) for writing to Git repositories,
and [BucketStateStores](./03-bucketstatestore.md) for writing to S3-compatible buckets. When registering a
[Cluster](../02-clusters/01-clusters.md) you specify which `StateStore` it should
write to. Checkout the docs for the supported StateStores:

- [GitStateStore](./02-gitstatestore.md)
- [BucketStateStores](./03-bucketstatestore.md)


<br />

Require a different type of `StateStore`? Get in touch with us at
[feedback@syntasso.io](mailto:feedback@syntasso.io?subject=Kratix%20Feedback)
or [open a GitHub Issue](https://github.com/syntasso/kratix/issues/new).