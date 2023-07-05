---
description: Documentation for the lifecycle of Resource Requests
title: Promise Resource Requests
sidebar_label: Introduction
id: intro
---

# Resource Requests

One of the components of a [Kratix Promise](../promises/intro) is the `api`. `api` sets the contract between the Platform and its users, and it defines what properties the user can configure in the Promised service.

The Resource Request is the document Platform Users write, following the `api` contract, to request instances of the Promised service. Each Promise has its own contract, so each Promise will have its own Resource Request format.

Consider a Promise with the following `api`, paying special attention to the highlighted fields:

```yaml showLineNumbers
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: someservice.example.promise.syntasso.io
spec:
  # highlight-next-line
  group: example.promise.syntasso.io
  names:
    # highlight-next-line
    kind: someservice
    plural: someservices
    singular: someservice
  scope: Namespaced
  versions:
    # highlight-next-line
    - name: v1
      served: true
      storage: true
      schema:
        openAPIV3Schema:
          type: object
          properties:
            # highlight-start
            spec:
              type: object
              properties:
                region: { type: string }
                storageGB: { type: integer }
            # highlight-end
```

The Schema in this Promise defines, as the contract, two properties under `spec`: a
string `region` and a integer `storageGB`.

A example Resource Request to get an instance of this Promised service would look like:

```yaml
# Promise spec.group and versions
apiVersion: example.promise.syntasso.io/v1

# Promise spec.names.kind
kind: someservice

# Name of this Resource Request
metadata:
  name: some-name

# From the spec.versions.v1 Schema
spec:
  region: some-region
  storageGB: 10
```

When applied to the Platform Cluster, Kratix will trigger the associated Workflow. For more details on the Workflows, see the [Workflow reference](./workflows).

For a in-depth exploration of the Resource Request and Pipelines, check the [Writing a Promise](../../guides/writing-a-promise) and [Enhancing a Promise](../../guides/enhancing-a-promise) guides.
