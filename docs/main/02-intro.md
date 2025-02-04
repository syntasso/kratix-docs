---
title: Docs Introduction
description: Introduction to Kratix and how to get started quickly. Includes guides on how to read Kratix docs and pointers to other pages.
keywords: [kratix documentation]
sidebar_label: Introduction
slug: /
---

# Introduction

Kratix is the open-source Platform Framework, that enables you to provide anything as-a-Service, while incorporating your key business processes and managing everything as a fleet.

:::info
Ready to get started? Follow our [Quick Start](01-quick-start.md) to jump right in.
:::

## Why Kratix?

Kratix is designed and built by a team with decades of experience creating [internal developer platforms](https://www.syntasso.io/internal-developer-platforms). We've learned that great platforms address three key challenges faced by enterprise organisations: 

- **Slow delivery of value** because software engineers must wait weeks for other teams to process their tickets.
- **Inconsistent application of key business rules** as teams create shadow IT systems to bypass lengthy ticket queues, introducing business risk.
- **Tech sprawl leading to operational overhead** as SRE, DevOps, and Platform Teams spend their time maintaining services and infrastructure instead of improving them.

A [Kratix Promise](./03-reference/11-promises/01-intro.md) enables you to provide anything-as-a-service, eliminating the need for engineers to wait for manual ticket processing.

[Workflows](./03-reference/12-workflows.md) let you embed any business rule into your Promise definition, from security scans and billing checks to manual approvals.

And with Kratix's built-in [Fleet Management](./03-reference/11-promises/03-updates.md) capabilities, you can maintain and upgrade all your resources with a single click.

![Kratix Architecture](/img/kratix-architecture.svg)

## Who is Kratix for

### Platform Engineers
Teams responsible for building and maintaining platforms often struggle to meet the growing expectations of application teams and organisations. Delivering the right services quickly, safely, and consistently is already challenging—adding Day 2 operations like upgrades and continuous improvements can lead to burnout.

With Kratix and Promises, Platform Engineers can offer anything-as-a-service, consistently enforce business rules, and streamline maintenance by managing all resources collectively, like a fleet.
:::tip
Learn more about platform team cognitive load from [Paula Kennedy at PlatformCon](https://www.youtube.com/watch?v=zfKwxL9KZ9I)
:::

### Domain experts & Specialists (Promise Authors) 
Many organisations have teams that specialise in specific domains, such as security, compliance, databases, or networking. These teams are responsible for ensuring that application teams follow the relevant business rules and policies.

With Promises, domain specialists can guarantee that every service request adheres to compliance requirements automatically. When policies change, they only need to update a Promise once—Kratix ensures all instances of their services are updated accordingly.

### Application Developers 
Many application teams face delays waiting for essential platform services, leading to poor developer experience (DevEx), workarounds, shadow IT, and missed deadlines. The additional concerns—such as infrastructure, networking, security policies, and billing limits—can overwhelm teams, diverting focus from delivering value.

Effective platforms minimise cognitive load by offering everything-as-a-service with built-in business rules and policies. Kratix and Promises enable this while allowing Platform teams to provide services at the right level of abstraction—hiding complexity from those who don’t need to manage it.

## Kratix in action
Watch how Kratix supports teams using Backstage to provide anything-as-a-service.
<div  align="center"><iframe width="560" height="315" src="https://www.youtube.com/embed/LlHHovxfJDg?si=326slhM8-yPPSFem" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>

## Already using Kratix?

Check out our [Troubleshooting](./08-troubleshooting.md) & [FAQ pages](./07-faq.md) if you are looking for help.

Read the [Kratix blog](/blog/) - written by our awesome Product Engineers, this is where we share the more advanced Kratix patterns and our latest product features.

## New to Kratix?

Follow our handy guides to get started on the basics as quickly as possible:

- [Installing Kratix](https://docs.kratix.io/category/installing-kratix)
- [Installing and using a Promise](https://docs.kratix.io/main/guides/installing-a-promise)
- [Writing a Promise](https://docs.kratix.io/main/guides/writing-a-promise)

If you can't find what you need, or need help with building your platform as a product, reach out to us on [Github](https://github.com/syntasso/kratix/) or through [Syntasso.io](https://www.syntasso.io/contact-us) and we'll be happy to help.
