---
description: Quickest way to test Syntasso Kratix Enterprise (SKE)
title: Quick Start (Enterprise)
sidebar_label: Quick Start (Enterprise)
---

```mdx-code-block
import useBaseUrl from '@docusaurus/useBaseUrl';
```


:::info

In order to run through this page you need Syntasso Kratix Enterprise license **token**.
Don't have one? [Request your free trial token →](https://www.syntasso.io/pricing)

:::

# Quick Start (Enterprise Edition)

This guide gives you a hands-on introduction to [**Syntasso Kratix
Enterprise**](https://syntasso.io/pricing) (SKE). In less than 30 minutes  and with
minimal dependencies, you will see how Kratix Promises deliver self-service  to
enable quick time to value while also enabling fleet management to maintain that
speed and efficiency.

Platforms need to provide a wide range of services to their users. Some
examples include databases (i.e. individual infrastructure), developer
environments  (i.e. paved roads), CI/CD pipelines (i.e. any internal
capability-as-a-Service).

In this quick start you will learn about a Kratix Promise which provides the
structure  between platform _producers_ and _consumers_. Platform producers are
often operators or  other subject matter experts who need to contribute and
manage their services while  consumers are often application developers, data
scientists, managers and others who  need to depend on and use the provided
services. You will also see how SKE makes integrating with Portals like
Backstage easy, so that consumers can request services without needing to write
YAML or understand the underlying Kubernetes resources.

## Prerequisites

To follow along, you'll need access to a Kubernetes cluster.

We recommend using a clean, disposable cluster for this quick start and you can
use any  Kubernetes distribution including:

- Managed services like GKE, EKS, or AKS  
- On-premises clusters like OpenShift, Rancher, or vanilla Kubernetes  
- Local environments like KinD or Minikube  

If you're working in a shared or production-like environment, see the full
[installation guide](/ske/kratix/configuring-ske/intro) to avoid configuration
conflicts. The  quick start deploys a local, insecure MinIO instance—intended
only for local development.

## Installation

SKE extends the Kubernetes API by introducing custom resources and controllers.  

:::tip
While SKE runs on Kubernetes, it orchestrates resources both in and outside of Kubernetes.  
There are examples of SKE orchestrating SaaS products, edge compute, IoT, and even  
mainframes.
:::

SKE comes with easy integration to existing Portal solutions such as Port and
Backstage. To highligh this, a pre-configured Backstage instance is included in
the quick start.

Before installing, create the namespace and secret so your cluster can access the private container registry:

```bash
kubectl create namespace kratix-platform-system

kubectl create secret docker-registry syntasso-registry \
  --namespace=kratix-platform-system \
  --docker-server=registry.syntasso.io \
  --docker-username=syntasso-pkg \
  --docker-password=<YOUR TOKEN>
```

Then apply the SKE installer manifest:

```bash
kubectl apply -f http://s3.eu-west-2.amazonaws.com/syntasso-enterprise-releases/ske/v0.28.0-rc3/dev-only/ske-quick-start-installer.yaml
```

This will deploy a job that installs SKE and its dependencies. To follow along
with the installation process, you can watch the logs of the installer job:

```bash
kubectl logs -f job/ske-quick-start-installer -n kratix-platform-system
```

In less than 5 minutes all dependencies will be installed and the platform controller  
should be running:

```bash
kubectl get pods -n kratix-platform-system
```

And the output will be similar to:

```bash
NAME                                        READY   STATUS    RESTARTS   AGE
kratix-platform-controller-manager          1/1     Running   0          2m
```

<details>
  <summary><strong>Having issues? Here's how to debug the installer Job</strong></summary>

If the Kratix `quick-start` Job fails, here are some steps to help troubleshoot the issue:

📋 1. Check the Job status

```bash
kubectl get jobs
kubectl describe job ske-quick-start-installer
```

🔍 2. View logs from the installer pod

```bash
kubectl get pods -l job-name=ske-quick-start-installer
kubectl logs <installer-pod-name>
```

🧪 3. Check pod readiness in system namespaces

```bash
kubectl get pods -n cert-manager
kubectl get pods -n kratix-platform-system
kubectl get pods -n flux-system
```

📦 4. Common causes
- Slow image pulls or cluster resource limits  
- Webhook service not ready before config is applied  
- Missing cluster DNS or RBAC issues in custom environments

🧰 5. Retry the job manually (if needed)

```bash
kubectl delete job ske-quick-start-installer
kubectl apply -f ske-quick-start-installer.yaml
```

</details>

## Publish a Promise

Now that SKE is installed, the platform is empty. To offer services, you publish Promises.  
This is traditionally done by platform operators or contributors.

While Promises can be custom written, there is also a community [marketplace](/marketplace) to get  
started. Start by publishing a simple marketplace PostgreSQL Promise to your platform:

```bash
kubectl apply -f https://raw.githubusercontent.com/syntasso/promise-postgresql/refs/heads/main/promise.yaml
```

Once published, a new custom resource type becomes available in your cluster:

```bash
kubectl get crds -l kratix.io/promise-name
```

SKE takes care of publishing all the required information into Backstage for
you, meaning you don't need to manually configure the Backstage catalog. Lets
take a look at the Promise we just published:


In a seperate terminal, open a port-forward so you can access the Backstage UI:
```bash
kubectl port-forward svc/backstage 7007:7007 -n kratix-platform-system
```

Then navigate to [http://localhost:7007](http://localhost:7007) in your browser.
You should see the Backstage UI with the Postgres Promise Component listed in
the catalog.

<figure className="diagram">
  <img className="medium" src={useBaseUrl('/img/ske/01-quick-start-catalog.png')} alt="The App Promise" />

  <figcaption>Backstage catalog post-promise installation</figcaption>
</figure>


If you select `Templates` in the top right, you will then be able to see that
the PostgreSQL Promise is available to be created.

<figure className="diagram">
  <img className="medium" src={useBaseUrl('/img/ske/02-quick-start-templates.png')} alt="The App Promise" />

  <figcaption>Backstage templates post-promise installation</figcaption>
</figure>

## Request an Instance (via Backstage)

With the Promise published, consumers can use Backstage portal to request
services. Fill in a request for a PostgreSQL instance using the
PostgreSQL Promise template. Once the request is submitted, SKE will
reconcile the request and create the instance in the cluster.


:::tip

SKE supports multiple ways to interact with the Platform. Whether you prefer
using kubectl, one or more Backstage instances, or a custom UI, SKE allows all
of them to work seamlessly—individually or in parallel—so you can use the right
tool for the job.

:::

Once the instance is created, you can see the new resource in Backstage:

<figure className="diagram">
  <img className="medium" src={useBaseUrl('/img/ske/03-quick-start-instance.png')} alt="The App Promise" />

  <figcaption></figcaption>
</figure>

<figure className="diagram">
  <img className="medium" src={useBaseUrl('/img/ske/04-quick-start-instance-description.png')} alt="The App Promise" />

  <figcaption></figcaption>
</figure>

You can see in the `status` section in the `Overview` tab that the request is
ready and information on how to access the PostgreSQL instance is provided. All
of this information is also available via the `kubectl` command line:

```bash
kubectl get postgresqls.marketplace.kratix.io <name> -o yaml
```

SKE is mirroring the state of the resource in Backstage, enabling you to keep
your Portal logic minimal and focused on the user experience, while SKE handles
the heavy lifting of managing the resource lifecycle.

Behind the scenes, Kratix is running a set of Workflows defined by the platform producer
in the Promise. These Workflows incorporate all of the business rules and required
actions before scheduling any declarative workloads to the correct GitOps repository.

You can see the workflows that were run by inspecting the Pods:
```bash
kubectl get pods -l kratix.io/promise-name=postgresql
```


### Update an Instance (via Backstage)

SKE isn't a fire and forget solution; it handles the full lifecycle, including
all day 2 operations.  For example, if your requirements change, it's easy to
adapt. As a consumer,  you simply update the request and re-submit. Promises are
designed  to safely handle updates without requiring custom scripts or manual
intervention. Open the resource in Backstage, navigate to the `Manage` tab, edit
the configuration, and submit.  The update will be automatically applied and
reflected in the GitOps repo.

<figure className="diagram">
  <img className="medium" src={useBaseUrl('/img/ske/05-quick-start-instance-update.png')} alt="The App Promise" />

  <figcaption></figcaption>
</figure>

You’ll see the CronJob show up in the cluster:

```bash
kubectl get cronjob --watch
```

```bash
NAME                                                SCHEDULE      TIMEZONE   SUSPEND   ACTIVE   LAST SCHEDULE   AGE
logical-backup-acme-org-team-a-example-postgresql   30 00 * * *   <none>     False     0        <none>          30s
```

## Manage a Fleet

It's not just consumers who grow and change. A platform with 10s, 100s or even
1000s of consumers needs to also manage changing requirements or even new security
risks.

In order to show how SKE can manage a fleet of instances, use the command provided below
to create a couple more PostgreSQL instances:

```bash
kubectl apply -f https://raw.githubusercontent.com/syntasso/promise-postgresql/refs/heads/main/multiple-resource-requests.yaml
```

This will create 2 more instances as shown below:
```bash
kubectl get pods -l application=spilo
```
```bash
NAME                                   READY   STATUS    RESTARTS   AGE
...
acme-org-team-a-example-postgresql-0   1/1     Running   0          2m
acme-org-team-b-dev-postgresql-0       1/1     Running   0          5s
acme-org-team-c-testing-postgresql-0   1/1     Running   0          5s
...
```

Now, let's say you need to patch a CVE in the PostgreSQL images, updating the
configuration, or even just expanding your offering to include that cloud instance
option.

You can do this by updating the Promise itself. In this case, let's update the Promise
to increase the default replica count of the PostgreSQL instances from 1 to 3. As with
any service, updating this default will mean any newly created PostgreSQL instances will
create 3 replicas. But since Kratix is built for fleet management, this update will also
evaluate and then update all existing instances.

```bash
kubectl apply -f https://raw.githubusercontent.com/syntasso/promise-postgresql/refs/heads/main/promise-ha.yaml
```

You can observe the roll out in action with the following command:

```bash
kubectl get pods -l application=spilo --watch
```

This will show a number of pods being created and completed:

```bash
NAME                                                       READY   STATUS      RESTARTS   AGE
acme-org-team-a-example-postgresql-0                       1/1     Running     0          3m
acme-org-team-a-example-postgresql-1                       1/1     Running     0          14s
acme-org-team-a-example-postgresql-2                       1/1     Running     0          9s
acme-org-team-b-dev-postgresql-0                           1/1     Running     0          1m
acme-org-team-b-dev-postgresql-1                           1/1     Running     0          14s
acme-org-team-b-dev-postgresql-2                           1/1     Running     0          10s
acme-org-team-c-testing-postgresql-0                       1/1     Running     0          1m
acme-org-team-c-testing-postgresql-1                       1/1     Running     0          14s
acme-org-team-c-testing-postgresql-2                       1/1     Running     0          9s
```

SKE will roll out the update to every instance that uses the Promise continuing to
follow any of the business rules defined in the Workflows without having to ask each
consumer to run a CI/CD pipeline, make PRs into a number of different repositories or
take any other action one-by-one.

Since Promises create and manage services in a consistent and repeatable way, platform
contributors are provided full control and visibility without disrupting any consumers.

## Business Processes, Built-in

While this quick-start focuses on how to use marketplace Promises, this is
really only the beginning.

Promises become truly powerful once they encode your internal company standards
such as compliance checks, cost controls, or governance policies inside the
Workflows. Since these Workflows are reconciled on each change as well as a
regular basis, each request automatically includes the rules your organisation
cares about.

Self-service doesn’t mean a loss of control. With Kratix, it means speed **and**
safety.

## Summary

In this quick start, you:

- Installed Syntasso Kratix Enterprise  
- Published a Marketplace Promise  
- Used Backstage to create and update a PostgreSQL instance  
- Updated a fleet of instances with a single Promise update  

If you're ready to go deeper:

- [Try writing your own Promise in the Kratix Workshop →](/workshop/intro)  
- [Explore Syntasso Kratix Enterprise →](/ske)  

:::tip
**Want to see how this fits your platform strategy?** [Book a call with us →](https://syntasso.io/#contact-us)
:::
