---
title: Promise Custom Resource
sidebar_label: Introduction
description: Documentation for the Kratix Promise Custom Resource
---

# Promises

At the core of Kratix are Promises. Promises are a set of instructions written in YAML that will produce a [resource](../resources/intro) whenever the Promise is invoked. This means that you can run software-as-a-service from your platform. A Promise consists of the dependencies it must setup before the Promise can be requested, an API description of how a user can request that Promise, the workflows that define how the provisioning takes place, and destination rules that allow the Promise Author to determine where resources should go.

This introduction is intended for platform engineers and people creating promises for use by the rest of their organisation.

```mdx-code-block
import PromiseHighLevel from "/img/docs/promise-high-level.png"
```

<figure className="diagram">
  <img className="small" src={PromiseHighLevel} alt="High level diagram of the parts of a Promise - API, Dependencies, Workflows and Destinations Rules" />

  <figcaption>High level diagram of the parts of a Promise - API, Dependencies, Workflows and Destinations Rules</figcaption>
</figure>

## Use Case

Consider the task of setting up development environments for application teams.
This task is usually repetitive and requires many cookie-cutter steps. It may
involve wiring up Git repos, spinning up a CI/CD server, creating a PaaS to run
the applications, instructing CI/CD to listen to the Git repos and push
successful builds into the PaaS, and finally wiring applications to their
required data services.

A Promise can encapsulate all the required steps and handle the toil of running
those low-level tasks. It can be designed as a single Promise that does it all,
or it can be a collection of Promises that, combined, deliver the desired
functionality.

To see Promises in-action, check out the guides: [Installing a Promise](../../guides/installing-a-promise) and [Writing a Promise](../../guides/writing-a-promise).

## The Promise API

```yaml
apiVersion: platform.kratix.io/v1alpha1
kind: Promise
metadata:
  # Name of the Promise; what the platform team will manage in the platform cluster
  name: promise-name
  labels:
    # optional: the version of this promise
    kratix.io/promise-version: v1.0.0
spec:
  # API that a Platform User will use to request a Resource from this Promise
  api:
    apiVersion: apiextensions.k8s.io/v1
    kind: CustomResourceDefinition
    # ... 
  # Array of Kubernetes resources to be scheduled to matching Workers
  dependencies:
    - apiVersion: apps/v1
      kind: Deployment
      metadata:
        name: service-operator
    -  #...
    -  #...
  # Ordered set of tasks to run during a Promise and Resource lifecycle
  workflows:
    # Tasks to be run only during the Promise lifecycle
    promise:
      # Tasks to be run only on creation, maintenance, or update of the Promise
      configure:
        # A Kratix provided Pipeline that runs an ordered set of OCI compliant images
        - apiVersion: platform.kratix.io/v1alpha1
          kind: Pipeline
          metadata:
            name: configure-promise
          spec:
            containers:
              - name: pipeline-stage-0
                image: myorg/pipeline-image-1 # Kubernetes defaults to docker.io
              - name: pipeline-stage-1
                image: ghcr.io/myorg/pipeline-image-2
              -  #...
      # Tasks to be run when a Promise is deleted
      delete: 
        - apiVersion: platform.kratix.io/v1alpha1
          kind: Pipeline
          metadata:
            name: delete-promise
          spec:
            containers:
              - #...
    # Tasks to be run only during the Resource lifecycle
    resource:
      # Tasks to be run only on creation, maintenance, or update of a Resource
      configure:
        # A Kratix provided Pipeline that runs an ordered set of OCI compliant images
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
      # Tasks to be run when a Resource is deleted
      delete: 
        - apiVersion: platform.kratix.io/v1alpha1
          kind: Pipeline
          metadata:
            name: delete-resource
          spec:
            containers:
              - #...
  # Check the scheduling docs for details
  destinationSelectors:
    - matchLabels:
        # Arbitrary key/value pairs that will be used for scheduling
        key: value
  # A list of Promises that are required by the Promise
  # All required Promises must be present and available for this promise to be made available
  requiredPromises:
    - name: required-promise-name
      version: required-promise-version
```
:::info
Learn more about the requiredPromises fields in the [Compound Promise Workshop](../../../workshop/part-ii/compound-promise#defining-promises-as-required-promises).
:::


It's also possible to install Promises via a Promise Release. Check the [Promise Release](../promises/releases) docs for details.

### API
When a platform engineer installs a Promise, Kratix creates a new API that application developers use to create and customise their resources using the available API options.
When the API request is submitted to Kratix, the Promise uses the API options to create the resources as described in the Promise.  
For example, if the Promise describes a database, a Jenkins installation, and an update script, calling the Promise from the API will generate a new instance of all of those resources for the user.
Promise APIs are Kubernetes Custom Resource Definitions (CRDs) under the hood. Kratix supports namespace-scoped CRDs only.
You can learn more about CRDs [here](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/).

### Dependencies
Dependencies are everything that the Promise relies on to function. A Kratix Promise can even be built on other Kratix Promises. A dependency is the pre-requisite software to create the resource and make it operational. A dependency might be a low-level resource such as a database, a pre-defined environment, a connection, a queue, or a bundle of related items that work together.

### Workflows
Workflows are the actions that must run in order to fulfil a Promise. They are a chain of containers that execute in sequence to fulfill the promise specifications, including responses to API specifications, notifications, business rules, and custom specifications.

The Promise workflows are run as part of the Promise lifecycle, and the Resource workflows are run as part of the Resource lifecycle. Under both Promise and Resource workflows, Kratix supports two workflow types:
- The `configure` workflows runs when either the Promise or Resource is created, updated or reconciled.
- The `delete` workflow runs when either the Promise or Resource is deleted.

You can learn more about [Promise Workflows](workflows) and [Resource Workflows](../resources/workflows) in their respective docs.

### Destination Rules
Destination rules are defined in the `destinationSelectors` section of the Promise spec. These are the rules that all the Promise will follow when determining where resources should go. Learn more about how to use destinationSelectors as part of [multi-destination scheduling](../destinations/multidestination-management#promises). 
