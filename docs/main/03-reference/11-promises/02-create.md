---
title: Creating a Promise
sidebar_label: Create
description: Documentation on creating a Promise
---

## Getting Started
When getting started with Kratix, many people install a Marketplace Promise to experiment with. As you use it, it may become clear that you need a more customised solution.

You clone the Promise and tweak the Promise description to apply to your own environment. You then install it so the Promise is available for request.

This iterative writing is useful because it allows you to use the structure of existing Promises to customise what you want for your own platform. Once you’re comfortable with modifying existing Promises, creating your own from scratch is more natural. 

We suggest these examples as good starting places:
- [Promise Marketplace](https://docs.kratix.io/marketplace)
- [Promise writing guide](../../../workshop/part-ii/writing-your-first-promise)

## Creating a Promise
You create a Promise by assembling a YAML file which defines all the dependencies and workflows that the Promise will include. It also defines the API that is used to request a resource. Once the Promise is written, it needs to be installed so that the dependencies it refers to will be available when a user requests them.

Below is an example of a Promise contains all the essential elements. For Promises that have more complexity, you can see the Promise Marketplace. 

First, there is the metadata that describes the Promise name, version, and labels. 

```apiVersion: platform.kratix.io/v1alpha1
kind: Promise
metadata:
  name: app-example
  labels:
    kratix.io/promise-version: v0.1.0
```
Then the specification describes how the resources will be created.

```
Spec:
```

Dependencies are all the things required for the platform to run the Promise. For example, a Promise might create a namespace.

 ```
 dependencies:
    - apiVersion: v1
      kind: Namespace
      metadata:
        name: promise-example
```

The API is how the user creates and customises their resources. Using the API, application teams can create, update, or delete promise instances. Users can also use the API to customise the Promise request in ways made available by the Promise. For example, the container image of a resource or its size. 

```
 api:
    apiVersion: apiextensions.k8s.io/v1
    kind: CustomResourceDefinition
    metadata:
      name: apps.marketplace.kratix.io
    spec:
      group: marketplace.kratix.io
      names:
        kind: app
        plural: apps
        singular: app
      scope: Namespaced
      versions:
        - name: v1alpha1
          schema:
            openAPIV3Schema:
              properties:
                spec:
                  properties:
                    image:
                      description: container image for application that will be deployed
                      example: gcr.io/syntasso/great-app
                      type: string
                  type: object
              type: object
          served: true
          storage: true
```

Workflows are a series of containers executed in sequence. Putting the actions in containers allows them to be consistent and reusable. Containerising the actions allows for maximum flexibility in language and modularity while maximising testability.

```
  workflows:
    resource:
      configure:
        - apiVersion: platform.kratix.io/v1alpha1
          kind: Pipeline
          metadata:
            name: configure-resource
          spec:
            containers:
              - name: pipeline-stage-0
                image: myorg/pipeline-image-1 # Kubernetes defaults to docker.io
              - name: pipeline-stage-1
                image: ghcr.io/myorg/pipeline-image-2
              -  #...
 workflows:
    resource:
      configure:
        - apiVersion: platform.kratix.io/v1alpha1
          kind: Pipeline
          metadata:
            name: instance-configure
          spec:
           containers:
              - name: create-resources
                image: ghcr.io/syntasso/kratix-marketplace/app-example-promise:v0.1.0
```

## Installing a Promise

Installing a Promise is a simple application of the Promise YAML file to the platform cluster. The API is then available for users to call, promise-workflows execute, and the dependencies are installed and made available so that the Promise can be fulfilled when it is requested. A promise exists on the platform cluster and can be called to create an consistent promise instance at any time.
