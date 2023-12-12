---
description: Kratix and Terraform can work well together. Find out how one complements the other.
title: Kratix and Terraform
id: terraform
---

_**[Terraform](https://www.terraform.io/)** is a tool for writing infrastructure as code. It is used to define both cloud and on-prem resources in human-readable configuration files that you can version, reuse, and share._

<img
src={require('@site/static/img/k+terraform_arch.png').default}
alt="sample architecture with kratix and terraform"
style={{"float": "right", "width":"400px", "margin":"20px 0 40px 40px"}}
/>

## What

Terraform and Kratix both aim to enable infrastructure as code (IaC) but at different abstraction levels.

Terraform has a mature community that supports managing cloud and other SaaS tooling through their custom HCL programming language. Using HCL, platform teams are able to create, modify, and delete infrastructure in a declarative way.

Kratix enables platform teams to create [Promises](../reference/promises/intro). Promises define an API for their users (application engineers) to easily request on-demand Resources. Promises also define any steps required to fulfil and maintain the Resources including running Terraform or other IaC tools, validating business rules, and any additional steps like releasing software that runs on the provisioned Terraform infrastructure.

## Why

IaC has historically been implemented, and used, almost exclusively by platform and other infrastructure facing teams.

Today, there is a larger focus on making this infrastructure self-service by end users like application engineers. Think Databases-as-a-Service or test environments-as-a-Service. While IaC may be the implementation of how to fulfil these requests, it is not always clear to an end user how to leverage a module to create a new resource so it often requires a ticket for the infrastructure team to complete. This creates blocking queues for end users and increased toil for infrastructure and platform teams.

To provide on-demand services, a platform team is best suited decoupling their API for requesting a service from the implementation for how to create and manage them.

## How

Kratix enables platform teams to declare APIs that orchestrates workloads across your infrastructure. The orchestration of infrastructure can happen in two ways in Kratix:

- via a [Workflow](../reference/resources/workflows) that is executed as part of every request for a Resource (as well as on updates and periodic reconciliation)
- via Kratix [scheduling](../reference/multicluster-management) workloads using GitOps

Kratix Workflow stages are a perfect place to execute sequential tasks such as running Terraform plans and applies, billing checks, security scans, audits, resource decoration and more. These tasks all happen automatically each time a user requests a Promise Resource.

If you use tools like the [Terraform Cloud Operator](https://developer.hashicorp.com/terraform/tutorials/kubernetes/kubernetes-operator) by HashiCorp or the Weaveworks [Terraform Controller](https://docs.gitops.weave.works/docs/terraform/get-started/) then you can use the scheduling portion of Kratix to create your resources.

<br/>

If this sounds interesting to you, [contact us](https://www.syntasso.io/contact-us) and we can help you get started with Kratix and Backstage.

## Additional resources

- [Blog: How one of our early customers solved their QA environment challenges with Kratix and Terraform](https://www.syntasso.io/post/use-case-providing-self-service-environments-on-demand-using-kratix)
