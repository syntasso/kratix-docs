---
description: Learn more about how Kratix works with Backstage
title: Kratix and Backstage
id: backstage
---

import useBaseUrl from '@docusaurus/useBaseUrl';

_[Backstage](https://backstage.io/) is a framework for building developer portals. Kratix is a framework for building platforms. The two were almost designed to work perfectly with one another._

<img
align="right"
src={useBaseUrl('/img/k+backstage.png')}
alt="Kratix logo and Backstage logo"
/>

Kratix takes the design position that Kubernetes is ubiquitous in most organizations. This choice has enabled us to build Kratix by extending the Kubernetes API to provide a consistent platform UX experience. Every time you load a Promise into Kratix you are extending the K8s API through the creation of custom resource definitions (CRDs), controller processes and custom resources. Platform teams often wish to abstract away this complexity and provide higher abstractions to ease platform usage—not just in the case of Kratix but in the case of all internal platforms. This pattern has led to the exciting rise of technologies such as Backstage.

Backstage is a framework that enables UIs to be declaratively created with the aim of unifying infrastructure tooling, services, and documentation to produce a great developer experience. The difficulty with Backstage is that its plugins often require complex backends that are written in Javascript.

If you wish to build a Backstage workflow that depends on Terraform, Kubernetes, and an off-platform technology such as SAP then you will be left with an integration problem. The Backstage plugin managing the workflow would need to orchestrate all of those integrations to achieve the required results. This leaves your UX with too much knowledge of the underlying platform. This design also introduces a high cost of change if you wish to introduce another UX technology. In our experience Backstage–and UI architectures in general–shine when their responsibility is limited to the UX experience not being the source of knowledge on infrastructure wiring. This is where Kratix can really compliment Backstage.

Kratix is the framework for building platforms. A platform team can compose their platform by loading in [new capabilities](/marketplace) via a powerful abstraction known as Kratix [Promises](../04-promises/01-promises.md). Promises provide the perfect surface area to orchestrate the concerns of the platform. To take our example from above, if the platform team need to orchestrate Terraform, Kubernetes and off platform tools such as SAP with Promises they can create single consistent API, which is the perfect abstraction for a tool like Backstage to interact with. Promises also provide built-in [pipelines](../05-resource-requests/02-pipelines.md), and via the simple building blocks of containers can run any tools needed to orchestrate tools such as Terraform and SAP.

With Promises the platform team also gets the added benefit of being able to declaratively drive Backstage UIs with direct Kratix-Backstage integrations. When Promises are loaded then the Backstage portal is immediately updated with UI views that represent that Promise—for free driven by Kratix. Our Backstage for Kratix integration is in the works. If you wish to preview our Kratix Promise then [contact us](https://www.syntasso.io/contact-us).
