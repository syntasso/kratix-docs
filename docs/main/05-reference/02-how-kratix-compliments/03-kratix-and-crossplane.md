---
description: Learn more about how Kratix works with Crossplane
title: Kratix and Crossplane
id: crossplane
---

import useBaseUrl from '@docusaurus/useBaseUrl';

_**TODO WRITE BLURB** Crossplane (TODO LINK) is a thing that we need to describe here with many words and this is just filling up space but when we get words they will be great. Yes indeed._

<img
src={useBaseUrl('/img/k+crossplane_arch.png')}
alt="Sample architecture with Kratix and Crossplane"
style={{"float": "right", "width":"400px", "margin":"20px 0 40px 40px"}}
/>

_We have written a tremendous [blog](https://www.syntasso.io/post/building-your-platform-your-way-with-crossplane-and-kratix) about how Kratix and Crossplane integration can complement each other._

Promises and Crossplane (TODO LINK) composition are similar in that they both provide declarative APIs, and a facade into more complicated underlying platform orchestration.

Kratix does not aim to compete with Crossplane on cloud orchestration and it can help a platform builder already using Crossplane by:

- A Crossplane Promise simplifies the Crossplane installation experience.
- Kratix provides multi-cluster support for free, so where Crossplane users are managing several Crossplane provider clusters, Kratix compliments by providing the cross cluster management of resources.
- A Promise can abstract away Crossplane. If a Platform needs to provide a Postgres as a Service with a production version managed by crossplane, yet they also need to Provide a cheap dev version that is run on a densified development cluster then this can be handled for free with Promises via the Promise. See the [blog](https://www.syntasso.io/post/building-your-platform-your-way-with-crossplane-and-kratix) for more detail on this pattern.
- Promises can offer the benefits of Pipelines today meaning tasks such as billing checks, security scans, audits, resource decoration etc can all happen in the Promise before a delegation to Crossplane is made.

As Kratix provides Gitops out of the box then the state of the Crossplane resources are all managed for free.
