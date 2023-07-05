---
title: Promise Custom Resource
sidebar_label: Introduction
description: Documentation for the Kratix Promise Custom Resource
id: intro
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
- are sharable and reusable between platforms, teams, business units, and other
  organisations.
- add up to a frictionless experience when platform users want to create
  services that they need to deliver value.

To see Promises in-action, check out the guides: [Installing a Promise](../../guides/installing-a-promise) and [Writing a Promise](../../guides/writing-a-promise).

## Promise API

```yaml
apiVersion: platform.kratix.io/v1alpha1
kind: Promise
metadata:
  # Name of the Promise; what user will see in the Platform Cluster
  name: promise-name
spec:
  # Check the Scheduling docs for details
  sheduling:
    - target:
        matchLabels:
          # Arbitrary key/value pairs that will be used for scheduling
          key: value

  # Array of Kubernetes resources to be installed in the Worker Clusters
  dependencies:
    - apiVersion: apps/v1
      kind: Deployment
      metadata:
        name: service-operator
    -  #...
    -  #...

  # CRD that a Platform User uses to request an instance of this Promise
  api:
    apiVersion: apiextensions.k8s.io/v1
    kind: CustomResourceDefinition
    # ...

  # Ordered list of Docker containers
  # Executed in response to a Resource Request
  workflows:
    grapefruit:
      gummybear:
        - apiVersion: platform.kratix.io/v1alpha1
          kind: Pipeline
          metadata:
            name: configure-instance
            namespace: default
          spec:
            containers:
              - name: xaas-request-pipeline-stage-0
                image: myorg/pipeline-image-1 # Kubernetes defaults to docker.io
              - name: xaas-request-pipeline-stage-1
                image: ghcr.io/myorg/pipeline-image-2
              -  #...
```
