---
title: Docs Introduction
description: Introduction to Kratix.
keywords: [kratix documentation]
sidebar_label: Introduction
slug: /
---

# Introduction to Kratix

Kratix is an open-source platform framework built by
[Syntasso](https://syntasso.io) to help you create an internal developer
platform exactly the way your organisation needs it. We believe great platforms
can't be bought off the shelf, they must be built and tailored to your
organisation's needs. Kratix provides the flexibility, integration, and
automation needed to build your platform your way.

Some teams describe Kratix as a platform orchestrator, designed specifically to
help platform teams deliver more value, faster, safer, and with less overhead.

:::info
Looking for **Enterprise support**? Check out [Syntasso Kratix
Enterprise (SKE)](https://syntasso.io/pricing)
:::


## Why Build Your Platform with Kratix?

Kratix addresses critical challenges faced by platform teams, providing clear
benefits:

### 🚀 Go Faster

Developers lose productivity when forced to wait on manual processes or tickets.
Kratix lets you offer everything as-a-service via clear APIs, which can easily
be exposed through developer portals like Backstage. This enables developers to
instantly self-service resources, significantly accelerating software delivery.

### 🔒 Be Safer

Inconsistent application of critical processes creates risks. Kratix helps you
embed essential business rules—such as security, compliance, and
governance—directly into automated workflows, ensuring reliable enforcement
every time.

### ⚙️ Increase Efficiency

Manual management of fragmented infrastructure results in operational overhead.
Kratix simplifies operations by managing platform resources as a unified,
automated fleet, reducing complexity and scaling effortlessly as your
organisation grows.

:::info

**Ready to take your platform to the next level?**
Get two weeks of free expert consultancy when you engage with Syntasso to explore Syntasso Kratix Enterprise.
Book a [demo call to find out more](https://www.syntasso.io/#contact-us). 

:::

## How Kratix Works: Promises

At Kratix's core are **Promises**—contracts between your platform and your
application teams. Each Promise defines exactly what your platform provides
as-a-service and includes:

- **Self-Service APIs**: Clear, frictionless interfaces enabling immediate and
autonomous resource provisioning.
- **Embedded Workflows**: Automated processes embedded directly within each
Promise, ensuring consistent compliance and security.
- **Fleet Management**: Built-in reconciliation ensures resources remain
up-to-date, simplifying management at scale.

:::info
Ready to get started? Follow our [Quick Start](01-quick-start.md) to jump right in.
:::

## Example: Self-Service Database Promise

Imagine your application development team needs a new database instance to test their application against. Today, this typically plays out in one of two ways, each problematic in its own way:

- **Manual bottlenecks in the Platform (Platform Team Pain):**  
  Developers raise tickets requesting the database, placing a heavy operational burden on the platform team:
  - Platform engineers manually provision cloud infrastructure using Terraform.
  - Kubernetes administrators deploy and configure databases by hand.
  - Documentation and developer portals (like Backstage) must be manually updated.
  
  This manual, repetitive workload creates delays, inconsistent setups, and high operational overhead, negatively impacting the platform team's efficiency.

- **Shadow IT and unmanaged complexity (Developer Pain):**  
  Developers bypass platform delays by provisioning resources themselves, taking on additional operational complexity:
  - Terraform scripts and infrastructure may be incorrectly or insecurely configured.
  - Resources are deployed using outdated, vulnerable, or unapproved images.
  - Infrastructure quickly becomes inconsistent, insecure, and difficult for developers to maintain effectively.

Both scenarios result in inefficiencies, increased risk, and unsustainable complexity, either draining the platform team’s resources or overwhelming developers with infrastructure management.

**With Kratix**, provisioning this database becomes simple and fully automated:

- **Self-service request**: Developers request resources directly through a
Promise API. This API can be easily integrated into developer portals, like
Backstage, providing a familiar interface for teams.

- **Promise workflow triggered**: Once the request is made, the Promise workflow
automatically kicks in. This workflow seamlessly combines infrastructure
provisioning (Terraform), Kubernetes resource deployment (K8s manifests), and
your internal business processes (compliance checks, security validations).
These workflows are then continuously reconciled, ensuring that the resources
never drift from the desired state.

- **Resource management and visibility**: The completed workflow results in a
fully managed resource within Kratix, instantly available and visible in
developer portals like Backstage. Platform teams can easily handle ongoing
operations (Day 2 tasks), such as resource updates or deletions, with confidence
and consistency.

What previously required days, numerous handoffs, and manual interventions is
now completed swiftly, securely, and consistently—empowering your teams to focus
on delivering value rather than managing complexity.

:::info
Interested in a fully supported Backstage integration? Check out [Syntasso Kratix Enterprise
(SKE)](https://www.syntasso.io/solutions/upgrade-backstage-from-portal-to-platform-with-kratix)
:::

## Ready to Build Your Platform?

See Kratix in action today:

- 👉 [**Try the Kratix Quick Start Guide**](/main/quick-start) and experience
Kratix first-hand.
- 👉 [**Want to see Kratix in action**? Book a demo](https://www.syntasso.io/#contact-us) to explore how [Syntasso](https://www.syntasso.io/) can support your platform goals.


Build your ideal platform fast, efficient, and safe, with Kratix.
