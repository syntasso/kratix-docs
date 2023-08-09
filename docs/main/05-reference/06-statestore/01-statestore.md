---
description: Documentation for the Kratix State Store Custom Resources
title: State Stores
sidebar_label: State Stores
id: intro
---
# State Stores

The Kratix `StateStore` resources represent the different backing storage options
for Kratix to write to. Kratix supports both [Git State Store](./gitstatestore) for writing to Git repositories,
and [Bucket State Store](./bucketstatestore) for writing to S3-compatible buckets. When registering a
[Destination](../02-destinations/01-destinations.md) you specify which `StateStore` it should
write to. Checkout the docs for the supported State Stores:

- [GitStateStore](./gitstatestore)
- [BucketState Stores](./bucketstatestore)


<br />

Require a different type of `StateStore`? Get in touch with us at
[feedback@syntasso.io](mailto:feedback@syntasso.io?subject=Kratix%20Feedback)
or [open a GitHub Issue](https://github.com/syntasso/kratix/issues/new).
