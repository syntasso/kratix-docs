---
description: Learn about what parts make up a Promise and how to leverage the power of promises in your platform
title: Unpacking a Promise
id: promise-theory
slug: ../promise-theory
---

This is Part 3 of [a series](intro) illustrating how Kratix works. <br />
👈🏾&nbsp;&nbsp; Previous: [Install a Kratix Promise](installing-a-promise) <br />
👉🏾&nbsp;&nbsp; Next: [Using Compound Promises](multiple-promises)

<hr />

**in this tutorial, you will**

* learn about the parts that make up a Promise
* understand how you can leverage the power of Promises in your Platform

## Promise Components


```mdx-code-block
import PromiseDiagram from "/img/docs/workshop/promise-diagram.svg"
```

<PromiseDiagram />

### 1. API

The Promise API serves as the foundational component of a Promise. Similar to
any other API, it establishes a contractual agreement between the software
provider (the Platform) and the client (the Platform user). Through this API,
the Platform team defines the interface that users interact with when utilising
the Platform.

The Promise API of the Jenkins Promise we installed on the previous step was
designed to be straightforward: it requires a single field under `spec` in their
resource request. An alternative Jenkins Promise might want to expose more
configuration options, like pre-installed plugins, or have a different
definition of what a `dev` or `prod` Jenkins is.

Platform teams have the choice to hide complexity, making it easy for users to
request new services. Alternatively, they can offer users greater flexibility,
allowing them to fine-tune lower-level details of the Service or select the
specific cluster where the workload should run.

Moreover, how you expose the API is also a matter of choice. In the previous
section, we used `kubectl` directly. However, you can have a
[Backstage](https://www.syntasso.io/post/kratix-and-backstage-a-perfect-pair)
instance on top of your API to facilitate the creation of services. Similarly,
you can employ [Compass](https://www.syntasso.io/post/kratix-and-compass) as a
driving force for your Platform. Kratix can seamlessly integrate with various
systems such as GitOps Repositories, ticketing systems, or CI/CD tools.

### 2. Imperative Pipeline

The second part of the Promise is the Request Pipeline. It is within the
Pipeline that you define your business processes, encapsulating the steps
required by your organisation to deliver the promised service on-demand.

In essence, the Pipeline consists of a sequence of containers that are executed
in response to a new request to the platform. When you, as the developer using
the Platform, submitted a request for a new Jenkins instance, the Jenkins
Request Pipeline was triggered.

The Jenkins Pipeline is responsible for receiving the user's Resource Request
and converting it into the necessary resources to create a functional Jenkins
instance. The Pipeline outputs a series of documents that define the desired
state for a worker cluster to converge.

The containers utilised in a pipeline are designed to be reusable. This allows
Platform teams to encode specific rules once and apply them consistently across
all services within the platform. Through Pipelines, Platform teams have the
flexibility to customise the Promise according to their specific business and
compliance requirements. For instance, in an organization where all images must
undergo vulnerability scanning, you can include a Snyk image in your Promise.
Similarly, if you wish to receive alerts for specific events, you can include a
Slack image.

### 3. Declarative State

Kratix follows the same *declare and converge* pattern as Kubernetes. The
pipeline executes a series of *imperative* steps to generate the "declarative
state" that the system should converge to.

In our Jenkins example, the Pipeline executed a series of commands to produce a
Jenkins instance declaration in the format expected by the Jenkins Operator.
Kratix then scheduled this declared state to the Worker cluster by writing it to
the GitOps State Store. Flux, running on the Worker cluster, detected the state
change and proceeded to create the resources on the cluster.

It's important to note that Kratix does not make any assumptions about the
actual configuration of the Worker cluster. Its role is to perform the
imperative steps to generate the desired state and store that state in the
GitOps State Store. For instance, you could have a pipeline that declares
Terraform plans to be scheduled on a system running Terraform.

### 4. Dependencies

The final part of a Promise is its Dependencies. A dependency refers to anything
that must be installed or made available on Worker clusters to enable the
promised service to run.

In the case of the Jenkins Promise, one of its dependencies is the Jenkins
Operator. Once the Promise is installed on the Platform, Kratix assesses the
clusters capable of accommodating Jenkins workloads and proceeds to install the
necessary dependencies on them. As a result, the Jenkins Operator is deployed
and initiated on the Worker cluster.

Furthermore, if new clusters join the fleet at a later stage, Kratix ensures that
all the dependencies required by the Promises eligible to run on those clusters
are automatically installed.

## Power of Promises

Those four components enable Platform teams to encapsulate all the steps they
need to provide any service on demand. Furthermore, with Promises, the process
of managing what's running on a fleet of clusters can be greatly simplified. For
instance, when a Promise gets upgraded, the dependencies can be upgraded across
the fleet seamlessly.

Next, we will see how you can [combine Promises](multiple-promises) to deliver full developer
experiences in your Platform.

