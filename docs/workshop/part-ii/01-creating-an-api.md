---
description: Creating your first service API
title: Creating your first service API
id: creating-an-api
slug: ../creating-an-api
---

```mdx-code-block
import useBaseUrl from '@docusaurus/useBaseUrl';
import PartialPromise from '../../_partials/_promise-architecture.md';
```

This is Part 1 of [a series](intro) illustrating how Kratix works.

👉🏾 Next: [Extracting shared dependencies](shared-dependencies)

<hr />

**In this tutorial, you will**

- [Learn more about a Promise](#what-is-a-promise)
- [Design an API for your service](#api-design)
- [Implement the design with validations and versioning](#api-implementation)
- [Deploy your API using Kratix](#deploy-api)
- [Experience requesting a Resource](#request-via-api)
- [Summary](#summary)
- [Clean up environment](#cleanup)

## What is a Promise? {#what-is-a-promise}

In [Part I](part-i/intro), you learned that Kratix is a framework used by
platform teams to build platforms tailored to their organisation.

Kratix Promises are the encapsulation of platform offerings. They provide a structure
to manage the complexities of providing _something-as-a-service_, including the
definition of how a user can request the Resource, the steps to provision the
requested Resource, and how to provide access to the Resource.

Promises allow platform teams to:

- Define an API, including versioning and validation
- Execute imperative commands per user request
- Use GitOps to continuously reconcile delivered services
- Install and configure (or verify) dependencies for delivering a service
- Manage where services are deployed across the infrastructure (on and
  off-Kubernetes, on Cloud providers, etc)

### Promise Architecture

Before jumping into writing a Promise, here is a quick review of the Promise
Architecture.

<PartialPromise />

As you go through building your own Promise, you will explore each of these
four sections in detail. This specific section will focus on the API.

### API in detail

When building an API, you have a lot of design considerations to include. For example,
you will want to:

- require certain parameters
- make some parameters dependent on values in other parameters
- provide client-side validation
- run server-side validation
- ensure API versioning to manage updates

These and many other features are all provided standard with a Kubernetes Custom Resource
Definition (CRD). This is why Kratix uses CRDs as the mechanism to
codify your Promise API.

:::info

In a Promise, the API is stored in a key called `api`

:::

<details>
<summary>🤔 Want to learn more about CRDs?</summary>

A Custom Resource (CR) is an extension of the Kubernetes API that is not
necessarily available in a default Kubernetes installation. It represents a
customisation of a particular Kubernetes installation.

A Custom Resource Definition (CRD) is the object you create to teach your
Kubernetes cluster about this new resource type.

To read more about CRDs please refer to the [Kubernetes documentation](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#create-a-customresourcedefinition).

This tutorial will not go through details on how to write a Kubernetes CRD, but check out
the [Kubernetes
documentation](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#create-a-customresourcedefinition)
for further details on the topic.

</details>

<hr />

## Design an API for your service {#api-design}

Imagine that your users have requested a monitoring system for their
applications. You on the platform team have investigated potential
options and determined that [Elastic Cloud on Kubernetes
(ECK)](https://www.elastic.co/guide/en/cloud-on-k8s/current/k8s-deploy-eck.html)
is the best fit for your users needs.

In addition, you have found that ECK provides an
[Kubernetes Operator](https://www.elastic.co/downloads/elastic-cloud-kubernetes) which can
help your team manage the configuration of different deployments. There's also a [Helm chart](https://www.elastic.co/guide/en/cloud-on-k8s/current/k8s-stack-helm-chart.html),
which can be used to request fully configured Resources.

You have a few concerns though about how to expose the Operator to your users.
While some of your users have a deep knowledge of monitoring, the majority of them
are not bothered by the details and just want access to the Kibana interface.

Your first job is to decide what options to expose to the Application teams.

### Start with the interface

A Kratix Promise allows platform teams to fine-tune how much application teams
need to know about low-level details while still providing the levers they need
to get the service they want.

You can start by defining an interface for the applications teams to request
their monitoring system. This interface is the contract of what can be
configured and within what parameters.

```mdx-code-block
import PromiseWayfinding from "/img/docs/workshop/part-ii-wayfinding-api-only.svg"
```

<figure class="diagram">
  <PromiseWayfinding className="small"/>

  <figcaption>The Promise API is where you will define the interface</figcaption>
</figure>

### Explore possible parameters

When designing the API for your new Elastic Promise, one option would be to
review the [Helm chart](https://www.elastic.co/guide/en/cloud-on-k8s/current/k8s-stack-helm-chart.html)
configuration options and expose all of them to the users to provide maximum
autonomy and configurability. However, it is a lot to understand and misconfiguration
of services can cause both cost and security issues in the future.

You could go to the other end of the spectrum, hiding all the options, making it
impossible for users to change anything on the deployed ECK Resource. You could
have, for example, a set of strict business rules for how to configure a secure
and reliable ECK. However, this API design would likely cause a lot of
support requests from users who need slight variations to the stock deployment.

```mdx-code-block
import APISpectrum from "/img/docs/workshop/design-api-spectrum.svg"
```

<figure class="diagram">
  <APISpectrum className="large"/>

  <figcaption>The sweet spot for your organisation can be anywhere in the
  spectrum</figcaption>
</figure>

While both extremes are possible using Kratix, the recommendation is to design
your API with one key principle in mind: what do your users (need to) care
about? Answering that question is fundamental to designing a useful API.

### Define your interface

Keeping in mind your users, it is easy to dismiss the "all levers" option as a
first implementation. The
[ElasticSearch](https://github.com/elastic/cloud-on-k8s/blob/2.8/deploy/eck-stack/charts/eck-elasticsearch/values.yaml)
chart provides a lot of important configurations for the platform but most, if
not all, are too low level for the application developer to care about.

Instead, you can focus your energy on the [top level values
file](https://github.com/elastic/cloud-on-k8s/blob/2.8/deploy/eck-stack/values.yaml),
which provides the ability to turn on and off specific services.

```mdx-code-block
import ElasticStack from "/img/docs/workshop/elastic-stack.svg"
```

<figure class="diagram right">
  <ElasticStack className="fullwidth"/>
  <figcaption>Elastic Cloud Stack</figcaption>
</figure>

Upon review of the available services that make up the Elastic Stack, it seems
sensible that both ElasticSearch and Kibana are always delivered. You have also
decided that Fleet Server and Agents should not be included in your offering, as
they will not fulfil any current needs and risk operational overhead. However,
you have seen that data collection is less consistent: some people want to use
the provided collectors whereas others will use language specific libraries in
their applications.

Therefore, a truly user-centric API for your platform may be as simple as:

- _enable data collection: true or false (false by default)_

While only a single parameter, you can notice two key aspects in this final API design:

1. The parameter is named on your internal domain language
1. Your API codifies the platform teams opinion (i.e. Fleet Server and Agents
   are never included)

With your API defined, you can start writing your Promise.

## Implement your Promise API {#api-implementation}

Start by creating a directory on your computer. This workshop will include a
number of other files and directories so it is best to start organising your
Promise now.

```bash
mkdir -p elastic-cloud-promise
cd elastic-cloud-promise
touch promise.yaml
```

The first file you need to create is the Promise with its API defined.

At the root of your newly created directory, create a `promise.yaml` file with
the following contents:

```yaml title="promise.yaml"
apiVersion: platform.kratix.io/v1alpha1
kind: Promise
metadata:
  name: elastic-cloud
spec:
  api:
    apiVersion: apiextensions.k8s.io/v1
    kind: CustomResourceDefinition
    metadata:
      name: elastic-clouds.workshop.kratix.io
    spec:
      group: workshop.kratix.io
      names:
        kind: elastic-cloud
        plural: elastic-clouds
      scope: Namespaced
      versions:
        - name: v1alpha1
          served: true
          storage: true
          schema:
            openAPIV3Schema:
              type: object
              properties:
                spec:
                  type: object
                  properties:
                    enableDataCollection:
                      type: boolean
                      default: false
                      description: |
                        If enabled, you will receive tools for
                        metric, log, and trace collection that
                        can be used to populate the elastic
                        cloud instance.
```

Notice that in this file there is a single key called `api` under the Promise spec.
This is where a complete and valid Kubernetes CRD is provided that contains the data
collection parameter as decided above along with a default value and description that
can later be used for documentation (check highlighted block).

<details>
  <summary>🤔 How did the design result in this CRD?</summary>

Custom Resource Definitions have a specification that must be followed. The two
main areas of interest for your CRD will be how it is named and how to manage
the fields.

**Naming:**

Your API will be referred to as a combination of the CRD defined `group` and `plural`
name. The group can be shared across all of your APIs or be further subdivided.
In this case, the group will be `workshop.kratix.io` and the plural name will be
`elastic-clouds`. This means the full name will be
`elastic-clouds.workshop.kratix.io`.

```yaml jsx title="Partial view of a CRD showing API naming"
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: elastic-clouds.workshop.kratix.io
spec:
  group: workshop.kratix.io
  names:
    kind: elastic-cloud
    plural: elastic-clouds
```

<br />

**Field definition:**

Your API only has a single field, but it requires a number of validations. Specifically you need to:

1. Define a new key within the `spec.properties` field with the name of the field
1. Set the property type as `boolean`
1. Provide a default value of `false`
1. Optionally add a description that can later be used for automated documentation

This is all added to the CRD as a schema for a single version:

```yaml jsx title="Partial view of a CRD showing the version specification"
versions:
  - name: v1alpha1
    schema:
      openAPIV3Schema:
        type: object
        properties:
          spec:
            type: object
            properties:
              enableDataCollection:
                type: boolean
                default: false
                description: |
                  If enabled, you will receive tools for
                  metric, log, and trace collection that
                  can be used to populate the elastic
                  cloud instance.
```

</details>

## Deploy your API using Kratix {#deploy-api}

### Prerequisite setup

For this tutorial, you will need a fresh installation of Kratix.

You can use the following command if you are unsure about your state.

:::tip
If you are participating in a facilitated workshop using Instruqt, this is not necessary.
:::

<details>
  <summary>👉🏾 commands to create a fresh installation 👈🏾</summary>

```bash
git clone https://github.com/syntasso/kratix.git /tmp/kratix
/tmp/kratix/scripts/quick-start.sh --recreate --no-labels
export PLATFORM=kind-platform
export WORKER=kind-worker
```

Once the script completes, you should have Kratix up and running. Verify:

```bash
kubectl --context $PLATFORM get deployments --namespace kratix-platform-system
```

The above command will give an output similar to:

```shell-session
NAME                                 READY   UP-TO-DATE   AVAILABLE   AGE
kratix-platform-controller-manager   1/1     1            1           1h
minio                                1/1     1            1           1h
```

You will also have a single worker cluster which you can verify:

```bash
kubectl --context $PLATFORM get destinations.platform.kratix.io
```

The above command will give an output similar to:

```shell-session
NAME               AGE
worker-cluster-1   10s
```

And you can see that you have two separate Kubectl contexts, one for each KinD cluster you created:

```bash
kubectl config get-contexts
```

Which will result in output similar to:

```shell-session
CURRENT   NAME            CLUSTER         AUTHINFO        NAMESPACE
*         kind-platform   kind-platform   kind-platform
          kind-worker     kind-worker     kind-worker
```

More details on how the Kratix installation and configuration works can be found in [Part
I](part-i/intro)

</details>

### Teaching Kratix about your service

Run the following command to teach Kratix about your newest ECK platform offering:

```bash
kubectl --context $PLATFORM create --filename promise.yaml
```

Since a Kratix Promise is a Kubernetes Custom Resource, you can use the
Kubernetes API to manage them both individually and as a group.

This provides the benefit of being able to catalog all platform offerings
by just listing all Promises in your cluster.

To see that the Promise has been installed, run:

```bash
kubectl --context $PLATFORM get promises
```

Your output will show the `elastic-cloud` Promise:

```shell-session
NAME            STATUS      KIND            API VERSION                   VERSION
elastic-cloud   Available   elastic-cloud   workshop.kratix.io/v1alpha1
```

More importantly, you will also be able to see the `elastic-cloud` API you defined:

```bash
kubectl --context $PLATFORM get crds | grep workshop
```

The above command will give an output similar to:

```shell-session
elastic-cloud.workshop.kratix.io            2023-01-01T12:00:00Z
```

## Experience requesting a Resource {#request-via-api}

Now that your platform is offering ECK, you will switch hats for a minute and
become a user who will request an on-demand elastic-cloud Resource.

To do this, you will create a Kubernetes resource that matches the API defined
in the Promise.

Create a file at the root of your `promise` directory, called
`resource-request.yaml`:

```bash
touch resource-request.yaml
```

Then copy the following contents into that new file:

```yaml title=resource-request.yaml
apiVersion: workshop.kratix.io/v1alpha1
kind: elastic-cloud
metadata:
  name: example
  namespace: default
spec:
  enableDataCollection: true
```

<details>
  <summary>🤔 How can this make a request to the Promise API?</summary>

This resource `apiVersion` and `kind` match the properties configured on the
CRD.

In addition, the `spec` is validated against the OpenAPIv3 Schema. In this
case the spec only contains the single property that was exposed in the API
schema.

</details>

You can now make a request for an Elastic Cloud Resource:

```bash
kubectl --context $PLATFORM apply --filename resource-request.yaml
```

You should get the following output:

```shell-session
elastic-cloud.workshop.kratix.io/example created
```

For this particular Promise, the resources it creates are also Kubernetes Resources. So just as you did for Promises, you can list all the elastic cloud Resources using the following command:

```bash
kubectl --context $PLATFORM get elastic-cloud
```

The above command will give an output similar to:

```shell-session
NAME      STATUS
example   Pending
```

:::note
You may see the status as `Resource requested`.
In future steps of this workshop you will get a chance to edit and update this output.
:::

:::tip Client-side Validations
At this stage you can explore the API validation if you would like.

For example, you can try to:

- remove the `enableDataCollection` field
- setting the `enableDataCollection` field to a non-boolean value
- introducing an addition field that you did not define in your CRD

These are just a few examples of simple validations that are being applied to each user request to the API.
:::

## Summary {#summary}

You have delivered your first Kratix Promise!

However, while Kratix has received and accepted the request, there's no defined
provisioning process for your Promise just yet. That means Elastic Stack
will not be delivered until you codify the provisioning process.

That is not to say that what you just did is useless! The current Promise is, in
a way, very similar to platforms based on tickets: a resource is requested,
which can notify a platform team to go and manually create the service, updating
the request once the service is instantiated.

Before creating on demand Elastic Stack instances, you will first need to define what are the dependencies that need to be installed in the worker cluster. In the next section you will do exactly that.

To recap the steps you took:

1. ✅&nbsp;&nbsp;Identify a service to provide on demand
1. ✅&nbsp;&nbsp;Design a user experience for requesting the service
1. ✅&nbsp;&nbsp;Define an API to match the user experience
1. ✅&nbsp;&nbsp;Install a Kratix Promise with that API definition
1. ✅&nbsp;&nbsp;Request an on-demand Resource from a Promise

## 🎉 &nbsp; Congratulations

✅&nbsp;&nbsp;Your Promise has an API. <br />
👉🏾&nbsp;&nbsp;Next you will [define the Promise dependencies](shared-dependencies).
