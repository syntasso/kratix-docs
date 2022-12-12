---
id: intro
---

# Resource Requests

One of the components of a [Promise](../promises/intro) is the
`xaasCrd`. In it, Promise Authors set the contract between the Platform and its
users, defining what properties the user can configured in the Promised
service.

The Resource Request is the document Platform Users write, following the contract, to
request the creation of instances of that Promised Service. Each Promise have their own
contract, so each Promise will have their own Resource Request format.

Consider a Promise with the following `xaasCrd`, paying special attention to the
highlighted fields:

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
              region: {type: string}
              storageGB: {type: integer}
          # highlight-end
```

The Schema in this Promise defines, as the contract, two properties under `spec`: a
string `region` and a integer `storageGB`.

A user of the Platform would write a Resource Request that looks like the following
document:

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

When applied to the Platform Cluster, Kratix will trigger the Pipelines, passing the
Resource Request YAML as an input. The Pipeline can then decide what needs to be done to
create an instance of the service with the user-provided values.

For a in-depth exploration of the Resource Request and Pipelines, check the [Writing a
Promise](../../guides/writing-a-promise) and [Enhancing a
Promise](../../guides/enhancing-a-promise) guides.
