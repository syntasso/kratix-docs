---
title: Frequently Asked Questions
description: Common questions about Kratix and how it fits in the Kubernetes ecosystem
---

# Frequently Asked Questions

### What is the "day two" experience of a Kratix-based platform?

Kratix is intended to help platform teams deliver platforms in a sustainable way. Products are never "done", so a Platform-as-a-Product is never done. Instead, a platform is an opportunity to continuously learn about the best way to accelerate delivery in your organisation. Day two, three, four, etc. are equally as important as day one.

In the future, Kratix will:

- Add health checks and testing to Promises, so that:
  - The capability of the platform to deploy promised resources on-demand is continuously asserted, with Service-Level Objective(s) assigned against relevant Service-Level Indicator(s)
  - The capability of each promised resource to deliver its Service-Level Objective(s) against relevant Service-Level indicator(s) is continuously asserted
- Converge all deployed resources (dependency or resource) when a Promise is updated
- Converge individual resources when a user's Resource is updated

### Should the platform team or the application team be responsible for updating the version of a deployed Resource? Who should be responsible for storage/network/other configuration?

The platform team should collaborate with the application teams when building
Promises. The Promises should encapsulate the contract between the teams; the
elements that application teams care about should be exposed via the API, and
the other elements should be configured by the platform team. The responsibility
for configuration, like storage settings, and lifecycle management, like whether
a particular upgrade is required, is often organisation specific, particularly
for bespoke Promises. A general guiding practice for responsibilities in
application versus platform teams is that cognitive load for operational concerns
should be as low as possible for application teams. Application teams should
only 'own' operations for aspects core to essential day-to-day delivery.

### Is Kratix only useful for deploying simple services?

Quite the opposite. Kratix is at its most powerful when deploying complex
services. The more complexity that is moved from the application teams to the platform, the lower their cognitive load, and the more
productive they are. See the [Compound Promises page](./guides/compound-promises) for details on how you would create larger,
more complex Promises by combining Promises.

### My organisation would like to add all of our tooling as Promises to our platform, and some of our tools are challenging to deploy and manage. I worry a single platform team would get overwhelmed. How do I scale up?

Platform teams do not need to author all, or any, of the Promises in their platform. Kratix has a [marketplace](https://kratix.io/marketplace) of Promises for platform teams. When a platform requires something bespoke, the platform team can work with specialists and application teams to collaboratively author a Promise that encapsulates the technical requirements and business concerns specific to the context. Additionally, many larger organisations will ultimately support multiple, focused platforms. One value Kratix brings in scaling efforts is the ability to encapsulate concerns and easily share functionality across contexts.

### How do I manage roles/teams/credentials/identity/networking/other?

Core Kratix functionality is evolving to utilise the best of the Kubernetes ecosystem for all of these concerns. Additionally the Kratix [marketplace](https://kratix.io/marketplace) has a number of Promises for tools in this space.

### How do I schedule workloads to different clusters?

Good news! We've created a page in our docs around how Kratix [schedules its
workloads](./reference/multidestination-management).

### How does Kratix compare to other tools?

[See here](./value-of-kratix#collaboration-with-other-tools)

### I use AWS, Google Cloud or Microsoft Azure. Why should I use Kratix?

The big public cloud providers offer tremendous power and functionality. Unfortunately, they also require expert knowledge, experience, time, and effort to deliver results in your organisation. Running a multi-cloud multi-cluster Kubernetes-based topology, powered by Kratix and a sustainable platform team, is the best way for your application teams to leverage the power of public clouds without being "locked in" to a vendor.

### What is the versioning strategy for Kratix?

The Open Source releases of Kratix are currently released via [Github](https://github.com/syntasso/kratix). As of July 2024, these releases no longer have version-specific tags and release names, and are instead be mutable, released at `latest` only. The point-in-time record of the code can be validated by the commit of the release but the release itself will not detail a version. All previously versioned releases of Kratix will remain available.

This has no impact on the cadence of OSS releases or the availability of bug fixes and security patches. Our enterprise offering, Syntasso Kratix Enterprise, will continue to use versioning.

### I'd like to invest/partner/buy. Who do I talk to?

Please [contact Syntasso](https://www.syntasso.io/contact-us).
