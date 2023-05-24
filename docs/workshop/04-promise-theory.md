---
description: Learn about what parts make up a Promise and how to leverage the power of promises in your platform
title: Unpacking a Promise
id: promise-theory
---

This is Part 3 of [a series](intro) illustrating how Kratix works. <br />
👈🏾&nbsp;&nbsp; Previous: [Install a Kratix Promise](installing-a-promise) <br />
👉🏾&nbsp;&nbsp; Next: [Writing and installing a Kratix Promise](todo)

<hr />

**in this tutorial, you will**

* learn about the parts that make up a Promise
* understand how you can leverage the power of Promises in your Platform

## Promise Components

INSERT HERE DIAGRAM

### API

The first part of a Primise is the Promise API. Like any other API, it serves as
a contractual agreement between the software provider (the Platform) and the
client (the Platform user). It is through this API that the Platform team
defines the interface through which their users interact while utilising the
Platform.

The Jenkins Promise API is quite simple: it requires the user to define a single
field under `spec` on their resource request. This API could've been more
complex, exposing an array of Jenkins configuration options (like pre-installed
plugins), or even simpler, requiring no configuration option whatsoever.

The decision is yours. You may choose to hide away complexity, making it very
straightforward to the users to request new services. You may choose to give
your users more flexibility, allowing them to tweak lower-level details of the
Service, or even in which set of cluster the workload should run.

Furthermore, how you expose the API to the users is also up to you. In the
previous section, we used `kubectl` directly. However, you could have a
[Backstage](https://www.syntasso.io/post/kratix-and-backstage-a-perfect-pair),
instance on top of your API, and drive the creation of the services through it,
for example. You could have
[Compass](https://www.syntasso.io/post/kratix-and-compass) driving your
Platform. You could easily use Kratix behind a GitOps Repository, or a ticketing
system, or CI/CD tools.

### Imperative Pipelines

The second part of the Promise is the Request Pipeline. It's in the Pipeline you
define you business processes, codifying the steps required by your organisation
to have the Promised service on-demand.

In a nutshell, the Pipeline is a series of containers that are executed in
response to a new request to the platform. When you assumed the role of a
developer and sent a request for a new Jenkins, the Jenkins Request Pipeline
kicked in.

:::tip

You can see the pipeline execution by checking the pods on your Platform
cluster:

```shell-session
$ kubectl --context kind-platform get pods
NAME                                     READY   STATUS      RESTARTS   AGE
request-pipeline-jenkins-default-80067   0/1     Completed   0          1h
```

:::

The Jenkins Pipeline knows how to receive the user's Resource Request and
transform it to output the necessary resources to get a real Jenkins instance.
The output of the Pipeline is a series of documents that define what state a
worker cluster should converge to.

The containers used in a pipeline are reusable. This allows Platform teams to
codify certain rules only once and apply them across all the services in the
platform. Through Pipelines, Platform teams can customise the Promise to their
own business and compliance requirements. For example, in an organisation where
all images must be scanned for vulnerabilities, you can add a Snyk image to your
Promise; if you want to get an alert when a certain event happens, you can add a
Slack image.

### Declarative State

Kratix follows the same *declare and converge* apprach as Kubernetes. The
pipeline executes a series of *imperative* steps to generate the *declarative
state* that the system should converge to.

In our Jenkins example, the Pipeline ran a series of commands to output a
Jenkins instance declaration in the format expected by the Jenkins Operator.
Kratix then scheduled this declared state to the Worker cluster by writing it to
the GitOps State Store. Flux, running on the Worker cluster, detected the state
change and proceeded to create the resources on the cluster.

It's important to note that Kratix doesn't make any assumptions about the actual
configuration of the Worker cluster. Its role is to carry out the imperative
steps to produce the desired state and store that state in the GitOps State
Store. For instance, you could have a pipeline that declares Terraform plans to
be scheduled on a system running Terraform.

### Dependencies

The final part of a Promise is its Dependencies. A dependency is anything that
must be installed or available on Worker clusters prior to enable the service
being promised to run.

The Jenkins Promise has, between its dependencies, the Jenkins Operator. When
the Promise is installed on the Platform, Kratix will determine which clusters
could receive Jenkins workloads and install the dependencies on it. As a result,
the Jenkins Operator gets deployed and starts on the Worker cluster.

If new clusters join the fleet later on, Kratix will ensure that all the
dependencies for all the Promises that can run on that new cluster are
installed automatically.

## Power of Promises

Those four components enable Platform teams to encapsulate all the steps they
need to provide any service on demand. Furthermore, with Promises, the process
of managing what's running on a fleet of clusters can be greatly simplified. For
instance, when a Promise gets upgraded, the dependencies can be upgraded across
the fleet seamlessly.

Next, we will see how you can [combine Promises](multiple-promises) to deliver full developer
experiences in your Platform.

