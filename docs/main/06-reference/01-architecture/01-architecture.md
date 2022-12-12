---
description: Learn more about the Architecture document
title: Architecture
id: intro
---

This page walks through the Kratix deployment topology for the Platform team for our example organisation EasyEaty. The organisation has a number of Application Development teams that all use the Platform to get the services they require.

![Overview](/img/kratix-arch-diagram.png)

## Kratix Platform Cluster

The cluster where Kratix is installed is the Platform cluster, which is in the centre of the diagram and has the label _Platform_. This is the cluster that both the Platform team and Application Development teams interface with.

The Platform contains three important elements:

- **Platform API:** the API for consumers of the platform. In the diagram, the API includes three "internal" CRDs and a number of installed CRDs.
- **Promises:** the components authored and/or installed by the platform team to drive the set of services available in the Platform API. See more about [Kratix Promises](./promises/intro).
- **Clusters:** a registry of Kratix Worker Clusters. See more about [Kratix Clusters](./clusters/intro).

## GitOps Repository

When a [Kratix Promise](./promises/intro) is installed, or when a new [Resource Request](./resource-requests/intro) comes in to the Platform, Kratix will react by writing documents to the Repository.

For example, the Repository in EasyEaty's topology is pictured to the right of the Platform cluster. When the _Web App Golden Path_ Promise was installed on the Platform, a set of documents required to fulfil the Promise was written to that Repository.

## Worker Clusters

Kratix Worker Clusters watch and react to changes in the Repository via a GitOps toolkit like FluxCD. Kratix requires at least one Worker cluster to run workloads. All Worker clusters are registered to the Platform via the Kratix API (see more about [Kratix Clusters](./clusters/intro)).

For example, in the diagram there are three clusters that are exclusively Worker clusters: _EKS_, _GKE_, and _On Prem / Edge_.

### Kratix Workloads

The primary role for these Worker clusters is to run workloads requested by consumers of the platform. 

For example, the _EKS_ Worker cluster has a number of workloads that were requested by _Team 2_ via the _Web App Golden Path_ Promise: two instances of Jenkins, two instances of PostgreSQL, and three instances of Nginx.

### Worker Resources

To run these workloads, each Worker cluster also has a set of Worker Resources. These resources are baseline capabilities installed on the Worker cluster at the time the Promise is installed on the Platform, and they represent the software that needs to be running prior to any requested workload.

For example, when the _Web App Golden Path_ Promise was installed on the Platform cluster, one of the Worker Resources that was immediately installed on the _EKS_ Worker cluster was the Jenkins Operator, which is required before a request for an instance of Jenkins can be fulfilled.

### Platform as a Worker

The Platform itself can _also_ be registered as a Worker cluster, which is required if the Platform offers any [Composite Promises](../guides/composite-promise).

The _Web App Golden Path_ Promise is a Composite Promise because it is composed of three lower-level Promises: Jenkins, PostgreSQL, and Nginx. Composite Promises allow Platform teams to provide higher-level value by combining lower-level Promises available in the Marketplace.

## Kratix Marketplace

In order to populate the lower-level offerings in a Platform, Kratix has provided a number of pre-written Promises ready for use. These Promises can be installed on a Platform and configured to meet organisational needs. For example, Kratix offers an off-the-shelf Promise for Jenkins, and the Platform team installed this Promise after configuring properties that are specific to the EasyEaty organisation.

## Pipelines and Off Cluster Resources

Kratix Promises include a concept called Request Pipelines. These pipelines are defined by the Promise author and are executed in the Platform when a consumer makes a request for a Promise. Pipelines specify a set of containers that will run prior to the instantiation of workloads, and they encapsulate a number of organisational requirements.

For example, when _Team 2_ requested the _Web App Golden Path_ Promise, the Request Pipeline executed and sent notifications via Slack, set up an on-call rota on PagerDuty, and created the appropriate tickets in Zendesk.
