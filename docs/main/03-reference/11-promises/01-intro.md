---
title: Promise Custom Resource
sidebar_label: Introduction
description: Documentation for the Kratix Promise Custom Resource
---

# Promises

Conceptually, Kratix Promises are the building blocks that enable teams to design
platforms that specifically meet their customer needs.

Technically, a Promise is a YAML document that defines a contract between the Platform and its users.

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

## Benefits

Promises:

- enable you to build your platform incrementally and in response to the needs
  of your users.
- codify the contract between platform teams and application teams for the
  delivery of a specific service, e.g. a database, an identity service, a
  supply chain, or a complete development pipeline of patterns and tools.
- are easy to build, deploy, and update.
- are shareable and reusable between platforms, teams, business units, and other
  organisations.
- add up to a frictionless experience when platform users want to create
  services that they need to deliver value.

To see Promises in-action, check out the guides: [Installing a Promise](../../guides/installing-a-promise) and [Writing a Promise](../../guides/writing-a-promise).

## Promise API

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

  # Array of Kubernetes resources to be scheduled to matching Workers
  dependencies:
    - apiVersion: apps/v1
      kind: Deployment
      metadata:
        name: service-operator
    -  #...
    -  #...

  # API that a Platform User will use to request an Resource from this Promise
  api:
    apiVersion: apiextensions.k8s.io/v1
    kind: CustomResourceDefinition
    # ...

  # Ordered set of tasks to run during a Promise and Resource lifecycle
  workflows:
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
  # Healthcheck to be performed for requests of the Promise
  healthChecks:
    resource:
      # The time or interval the check should run against
      # This can follow Cron syntax or macros such as @hourly
      schedule: "* * * * *"
      # A Pipeline that runs an ordered set of OCI compliant images to perform health checks
      workflow:
        apiVersion: platform.kratix.io/v1alpha1
        kind: Pipeline
        metadata:
          name: health
        spec:
          containers:
            - image: ghcr.io/myorg/health-check
              name: health
```

It's also possible to install Promises via a Promise Release. Check the [Promise Release](../promises/releases) docs for details.
