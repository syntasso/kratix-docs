---
description: Learn more about how Kratix works with Terraform
title: Kratix and Terraform
id: terraform
---

import useBaseUrl from '@docusaurus/useBaseUrl';

_**TODO WRITE BLURB** Terraform (TODO LINK) is a thing that we need to describe here with many words and this is just filling up space but when we get words they will be great. Yes indeed._

<img
align="right"
src={useBaseUrl('/img/k+terraform.png')}
alt="Kratix logo and Terraform logo"
/>

One of Syntasso’s first real-world integrations was with a Fintech company that had an existing microservices architecture running on public-cloud based Kubernetes. Much of this infrastructure was created using Terraform.

The first use case we set out to solve was enabling their QA teams to spin up dedicated environments on demand via a simple API request. This was an evolution of their existing ticket-driven system that required a platform team member to create the testing environment on behalf of the QA teams.

Kratix is a framework for building platforms, part of that vision includes meeting customers where they are through simple integration with existing IaC technologies. In the use case outlined above, our customer built a TestEnvironment Promise to orchestrate their existing toolchain and to provide a more streamlined platform experience.

The TestEnvironment Promise enabled the platform team to declaratively create a simple CRD which exposed a simple API to enable on-demand creation and deletion of environments as required. This API exposed variables that their QA needed to input into their on-demand environment, like the version of the system they needed to test. On request of a new test environment, the Promise pipeline took the variables from the API request and mapped them into the `Tfvars` file, which was used to imperatively drive the Terraform plan command before applying to create the cloud infrastructure. The Promise pipeline then simply waited until Terraform apply had completed the creation of the cloud infrastructure before continuing the Promise workflow with the deployment of the microservice architecture under test.

As Kratix takes no opinion on what technologies are used within a Promise, our client was quickly able to embed their existing IaC scripts directly into the TestEnvironment Promise to rapidly deliver on their use case: A shift of their manually-run, ticket-driven, IaC scripts into a declarative API, ready to be consumed on-demand driven by Kratix.
