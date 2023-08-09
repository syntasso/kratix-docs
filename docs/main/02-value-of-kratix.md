---
title: The Value of Kratix
description: Explore the main benefits in using Kratix to build your Platform.
---

# The Value of Kratix

The modern digital organisation is populated with customer-focused teams delivering business value. These teams need to create differentiated products for their customers, but are too often dragged down into wrangling commodity infrastructure components. This is the **Platform Gap.**&#x20;

Unlike other frameworks and tooling which focus exclusively on application-developer experience, Kratix focuses on empowering platform engineers to build better platforms. By using Kubernetes as the building block, Kratix brings together the power and flexibility of raw Kubernetes and enables platform teams to simplify the experience for application teams by reducing complexity.

In addition, Kratix enables the injection of business-specific requirements such as compliance, security, and billing so that the “Promises” delivered by the platform represent the Golden Paths to production; making the right way the easy way.

For more on the Platform Gap, check out [_Crossing the Platform Gap_ article on Syntasso.io](https://www.syntasso.io/post/crossing-the-platform-gap).

**With Kratix, a Platform Team can:**

* Curate a bespoke platform API to offer a compelling Platform as a Product.
* Codify their organisation's policies and opinions (security, compliance, etc) into their as-a-Service software supply chain.
* Provide usable on-demand services composed from lower-level Kubernetes "operators".
* Use familiar Kubernetes tools and native constructs.
* Start small on a laptop and expand to multi-team multi-cluster multi-region multi-cloud with a consistent API everywhere.
* Discover and share on-demand multi-cluster software (Promises) with the Kratix ecosystem.

**A Stream-Aligned / Application Team can:**

* Discover and consume the services in their organisation on demand using standard Kubernetes APIs.
* Consume as-a-Service from the platform, safe in the knowledge that the service is fit for purpose in their organisation.

## Collaboration with other tools

### Kubernetes Operators

Kubernetes Operators work hand-in-hand with Kratix. In nearly all cases
Operators are required on many clusters across a single organisation. Kratix helps you manage the installation and maintenance of these Operators across clusters and can then schedule requests to the correct Operator in the correct cluster when a user makes a request.

### Helm

Kratix contributors are currently working on an easy to use Helm Promise converter so it will be trivial to offer Helm Charts as Promises. Watch this space!

### Crossplane

Crossplane is an ideal candidate for a Promise, and works well with Kratix.
Crossplane's complexity can be hidden from stream-aligned teams by platform
teams, and IaaS(AWS, Google, MS)-specific clusters, with bespoke Crossplane
implementations, used with a Kratix-powered platform. A sample Crossplane
Promise is under development.

Check out [this
page](https://kratix.io/docs/main/how-kratix-complements/crossplane) to see how
Kratix and Crossplane can work together. We also published [this blog
post](https://www.syntasso.io/post/building-your-platform-your-way-with-crossplane-and-kratix),
which contains more concrete examples.

### Operator Lifecycle Manager

RedHat's Operator Lifecycle Manager (OLM) is an ideal candidate for a Promise. OLM is a single-cluster solution, of high complexity, and ideally suited for Kratix's multi-cluster GitOps orchestration, combined with the codification of the roles for the platform and stream-aligned teams. OLM is an excellent way to manage the operators used by Kratix.

### Open Cluster Management

Open Cluster Management (OCM) shares many ideas with Kratix, in particular the "Work" resource across multiple clusters, but takes a different direction in some areas. OCM philosophically appears to treat multiple clusters as one big cluster, with tight coupling between managed clusters via the klusterlet agent. Kratix decouples managed clusters, orchestrating the distributed platform via the GitOps Toolkit, enabling greater scale and resiliency of the platform as a whole. The enables the platform team to readily debug, audit, and control what's being deployed to managed clusters. This also enables the platform team to pause updates from the Platform cluster to any number of workers, or add additional resources to the GitOps repositories directly.
