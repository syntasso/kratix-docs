---
description: Learn more about how Kratix works with Crossplane
title: Kratix and Crossplane
id: crossplane
---

import useBaseUrl from '@docusaurus/useBaseUrl';

_**[Crossplane](https://www.crossplane.io/)** is an open-source multi-cloud control plane that allows you to extend Kubernetes to connect to and from external sources like databases, the cloud and the edge._

<img
src={useBaseUrl('/img/k+crossplane_arch.png')}
alt="Sample architecture with Kratix and Crossplane"
style={{"float": "right", "width":"400px", "margin":"20px 0 40px 40px"}}
/>

_We have written a tremendous [blog](https://www.syntasso.io/post/building-your-platform-your-way-with-crossplane-and-kratix) about how Kratix and Crossplane complement each other._

[Kratix Promises](../promises/intro) and [Crossplane Compositions](https://docs.crossplane.io/v1.8/reference/composition/) are similar in that they both provide declarative APIs and a facade into more complicated underlying platform orchestration.

Kratix does not aim to compete with Crossplane on cloud orchestration and it can help a platform builder already using Crossplane.

- Creating a [Promise](../promises/intro) for Crossplane simplifies the Crossplane installation experience.
- Kratix provides [multi-cluster support](../deployment-topology) for free. Where Crossplane users are managing several Crossplane provider clusters, Kratix complements by providing the cross-cluster management of resources.
- A Promise can abstract away Crossplane. If a Platform needs to provide a Postgres as a Service with a production version managed by Crossplane _and_ and they also need to provide an inexpensive dev version that is run on a densified development cluster then this can be handled for free with Kratix via Promises. See the [blog](https://www.syntasso.io/post/building-your-platform-your-way-with-crossplane-and-kratix) for more detail on this pattern.
- [Kratix Promises](../promises/intro) can offer the benefits of pipelines. Tasks such as billing checks, security scans, audits, resource decoration etc can all happen in the Promise before a delegation to Crossplane is made.
- Kratix provides GitOps out of the box so the state of Crossplane resources is all managed for free.
