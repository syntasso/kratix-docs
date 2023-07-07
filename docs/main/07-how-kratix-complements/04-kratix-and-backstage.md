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

## What

Backstage and Kratix both believe that the most powerful platforms must be built by each organisation. While a platform needs to be custom built, both tools also encourage building on top of community provided support where possible. Both tools provide a framework for platform engineers that encourages user experience front and center.

Backstage is a framework that enables GUIs to be declaratively created with the aim of unifying infrastructure tooling, services, and documentation to produce a great developer experience. Backstage is un-opinionated and decoupled from how you drive your platform infrastructure.

Kratix enables platform teams to declare platform APIs that orchestrates workloads across your infrastructure. Kratix does not come with a packaged GUI.

## Why

This divide between GUI and API makes Backstage and Kratix the perfect package.

- **Decoupled architecture:**

  GUI architectures shine when their responsibility is limited to the UX experience. Rather than define your platform orchestartation in Backstage directly, you can have Backstage call the Kratix API which provides easier portability across GUIs, alternative experiences for more CLI driven users, and easier refactoring of platfom implementation due to stable API definitions.

- **Auto-populated GUI:**

  Backstage GUIs must be declared: this is toil for the platform. Kratix can reduce this toil by integrating [Promises](../05-reference/03-promises/01-promises.md) with Backstage by default. In addition, these GUIs can diverge from platform offerings if they are managed separately from the backend implementations. Promises that defined the API and the Backstage GUI at the same time provide automatic support for iterations on your offerings.

## How

Integrating Backstage with Kratix is simple. Point Backstage at the Kratix Platform cluster and that's it. Kratix will then build the Backstage views as Promises are loaded into Kratix, and Resources are requested by users of the platform.

Declarative UIs by default with Kratix:

- The Backstage Catalog is automatically populated when Kratix Promises are applied.
- Templates for Promises are automatically created when Promises are loaded. Giving consumers of the platform simple, predictable UX to create Resources from the Promises they require. This could be entire paved-path environments, or simply instances of services developers need. See the [Marketplace](https://www.kratix.io/marketplace) our Promises.
- Due to Kratix's powerful GitOps abstractions, the Backstage configuration data lives outside of Backstage, leaving your Kratix-driven Backstage ephemeral in nature. If your Backstage dies, no problem, redeploy it and your views will be automatically brought back to life by Kratix.

<br />
<div style={{"text-align":"center"}}>
<iframe width="560" height="315" src="https://www.youtube.com/embed/wj5VaXYTvrg" title="Use Kratix to provide on-demand services through a Backstage UI" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

<br/>

If this sounds interesting to you, [contact us](https://www.syntasso.io/contact-us) and we can help you get started with Kratix and Backstage.

## Additional resources

- [Blog: Kratix and Backstage, a perfect pair](https://www.syntasso.io/post/kratix-and-backstage-a-perfect-pair)
