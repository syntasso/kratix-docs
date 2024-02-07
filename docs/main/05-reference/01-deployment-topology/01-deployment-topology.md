---
description: Learn more about how to deploy Kratix in a prod-like environment
title: Deployment topology
id: intro
---

This page walks through the Kratix deployment topology for the Platform team for
our example organisation EasyEaty. The organisation has a number of Application
Development teams that all use the Platform to get the services they require.

![Overview](/img/kratix-arch-full.png)

## Kratix platform cluster

The cluster where Kratix is installed is the platform cluster, which is in the
centre of the diagram and has the label _Platform_. This is the cluster that
both the Platform team and Application Development teams interface with.

The Platform contains three important elements:

- **Platform API:** the API for consumers of the platform. In the diagram, the
  API includes three "internal" APIs and a number of installed APIs.
- **Promises:** the components authored and/or installed by the platform team to
  drive the set of services available in the Platform API. See more about
  [Kratix Promises](./promises/intro).
- **Destinations:** a registry of Kratix Worker Destinations. See more about
  [Kratix Destinations](./destinations/intro).

## GitOps State Store

When a [Kratix Promise](./promises/intro) is installed, or when a request for a
new [Resource](./resources/intro) comes in to the Platform, Kratix will react by
writing workloads to the Desintation's State Store.

For example, the State Store in EasyEaty's topology is a Git Repository pictured
to the right of the platform cluster. When the _Web App Golden Path_ Promise was
installed on the Platform, a set of workloads required to fulfil the Promise was
written to that State Store.

## Worker Destinations

Kratix Worker Destinations watch and react to changes in the State Store via a
GitOps toolkit like FluxCD. Kratix requires at least one Worker Destination to
run workloads. All Worker Destinations are registered to the Platform via the
Kratix API (see more about [Kratix Destinations](./destinations/intro)).

For example, in the diagram there are three Destinations that are exclusively
Workers: _EKS_, _GKE_, and _On Prem / Edge_.

### Resources

The primary role for these Worker Destinations is to run Resources requested by
consumers of the platform.

For example, the _EKS_ Worker has a number of Resources that were requested by
_Team 2_ via the _Web App Golden Path_ Promise: two Resources will be created
each with an instance of Jenkins, two instance of PostgreSQL, and three instance
of Nginx.

### Promise Dependencies

To enable these Resources, each Destination also has a set of Dependencies
installed. These Dependencies are baseline capabilities installed on the
Destination at the time the Promise is installed on the Platform, and they
represent the software that needs to be running prior to any requested Resource.

For example, when the _Web App Golden Path_ Promise was installed on the
platform cluster, one of the Dependencies that was immediately installed on the
_EKS_ Worker was the Jenkins Operator, which is required before a request for a
Jenkins Resource can be fulfilled.

### Platform as a Worker

The Platform itself can _also_ be registered as a Destination, which is required
if the Platform offers any [Compound Promises](../guides/compound-promises).

The _Web App Golden Path_ Promise is a Compound Promise because it is composed
of three lower-level Promises: Jenkins, PostgreSQL, and Nginx. Compound Promises
allow Platform teams to provide higher-level value by combining lower-level
Promises available in the Marketplace.

## Kratix Marketplace

In order to populate the lower-level offerings in a Platform, Kratix has
provided a number of pre-written Promises ready for use. These Promises can be
installed on a Platform and configured to meet organisational needs. For
example, Kratix offers an off-the-shelf Promise for Jenkins, and the Platform
team installed this Promise after configuring properties that are specific to
the EasyEaty organisation.

## Workflows and Off Kubernetes Resources

Kratix Promises include a concept called [Workflows](./resources/workflows). The
Workflows are defined by the Promise author and are executed in the Platform
during the Promise lifecycle (for example, when a new Resources is requested
from a Promise). Workflows specify a set of actions that should run to fulfil
the lifecycle operation, and they encapsulate a number of organisational
requirements.

For example, when _Team 2_ requested the _Web App Golden Path_ Promise, the
configure resource Workflow was executed and sent notifications via Slack, set
pup an on-call rota on PagerDuty, and created the appropriate tickets in Zendesk.
