---
description: Quickest way to test Kratix
title: Quick Start
sidebar_label: Quick Start
---

# Quick Start

This guide gives you a hands-on introduction to Kratix. In less than 30 minutes
and with minimal dependencies you will see how Kratix Promises deliver self-service
to enable quick time to value while also enabling fleet management to maintain that
speed and efficiency.

Platforms need to provide a wide range of services to their users. Some
examples include databases (i.e. individual infrastructure), developer environments
(i.e. paved roads), CI/CD pipelines (i.e. any internal capability-as-a-Service).

In this quick-start you will learn about a Kratix Promise which provides the structure
between platform _producers_ and _consumers_. Platform producers are often operators or
other subject matter experts who need to contribute and manage their services while
consumers are often application developers, data scientists, managers and others who
need to depend on and use the provided services.

## Prerequisites

To follow along, you'll need access to a Kubernetes cluster.

We recommend using a clean, disposable cluster for this quick start and you can use any
Kubernetes distribution including:

- Managed services like GKE, EKS, or AKS
- On-premises clusters like OpenShift, Rancher, or vanilla Kubernetes
- Local environments like KinD or Minikube

If you're working in a shared or production-like environment, see the full
[installation guide](/category/installing-kratix) to avoid configuration conflicts. The
quick start deploys a local, insecure MinIO instance—intended only for local development.

## Installation

Kratix extends the Kubernetes API by introducing custom resources and controllers.

:::tip
While Kratix runs on Kubernetes, it orchestrates resources both in and outside of Kubernetes.
There are examples of Kratix orchestrating SaaS products, edge compute, IoT, and even
mainframes.
:::

While production installations can be managed more closely, below is an all-in-one
quick-start that uses a single job to install Kratix with sensible defaults.

<details>
  <summary>What gets installed?</summary>

The install manifest does the following:

1. Installs [**cert-manager**](https://cert-manager.io/) to manage TLS certificates for
   Kratix webhooks
1. Deploys the [**Kratix API server and controllers**](https://docs.kratix.io/main/learn-more/kratix-resources)
   in the `kratix-system` namespace
1. Deploys [**MinIO**](https://min.io/), a local S3-compatible bucket for storing
   declarative workloads
1. Installs and configures [**Flux**](https://fluxcd.io/) to apply changes from the
   MinIO bucket via GitOps
1. Registers your Kubernetes cluster as a [**Destination**](https://docs.kratix.io/main/reference/destinations/intro)
so Kratix can schedule workloads to it
</details>

Install Kratix:

```bash
kubectl apply -f https://github.com/syntasso/kratix/releases/download/latest/kratix-quick-start-installer.yaml
```

This will deploy a job that installs Kratix and its dependencies. To follow along
with the installation process, you can watch the logs of the installer job:

```bash
kubectl logs -f job/kratix-quick-start-installer -n kratix-platform-system
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
kubectl describe job kratix-quick-start-installer
```

Look for `failed` conditions or pod-level errors.

🔍 2. View logs from the installer pod

```bash
kubectl logs -f job/kratix-quick-start-installer
```

This will show exactly which step failed (e.g. cert-manager install, Kratix controller readiness, config sync).

🧪 3. Check pod readiness in system namespaces

Sometimes pods take longer to pull images or start up, especially in cold or constrained environments. Check system namespaces:

```bash
kubectl get pods -n cert-manager
kubectl get pods -n kratix-platform-system
kubectl get pods -n flux-system
```

Use `kubectl describe` on any pods stuck in `Pending` or `CrashLoopBackOff` for more detail.

📦 4. Common causes

- Slow image pulls or cluster resource limits
- Webhook service not ready before config is applied
- Missing cluster DNS or RBAC issues in custom environments

🧰 5. Retry the job manually (if needed)

If you'd like to re-run the installer Job:

```bash
kubectl delete job kratix-quick-start-installer
kubectl apply -f kratix-quick-start-installer.yaml
```

</details>

## Publish a Promise

Right now, the platform is empty. To offer services, you publish Promises. This is
traditionally done by platform operators or contributors.

While Promises can be custom written, there is also a community [marketplace](/marketplace) to get
started. Start by publishing a simple marketplace PostgreSQL Promise to your platform:

```bash
kubectl apply -f https://raw.githubusercontent.com/syntasso/promise-postgresql/refs/heads/main/promise.yaml
```

Once published, a new custom resource type becomes available in your cluster:

```bash
kubectl get crds -l kratix.io/promise-name
```

This shows that the new API is available which can be used via all the `kubectl` commands
such as get, create, or delete. This means consumers can now self-serve PostgreSQL
instances providing only the values your API requires.

:::info
Don't want your consumers managing tabs vs spaces in YAML? All the portals on the market
work with Kratix. Prefer a portal with faster time to delivery lower overhead? Syntasso
Kratix Enterprise (SKE) makes integrations with portals simple and production-ready.

[Learn more →](https://syntasso.io/pricing)
:::

### Request an Instance

Now that a Promise is available, the platform consumers (often app developer) can
self-serve what they need when they need it using the interface that the platform
defines.

Let’s look at what the Promise API exposes:

```yaml
kubectl explain postgresqls.marketplace.kratix.io.spec
```

This command provides a detailed description of the `postgresql` resource type and
what fields are available in the `spec` section. In this example, all of the fields are
optional since the platform can provide sensible defaults. Reducing required fields
allows consumers to focus on what matters most to them and grow into more specific
configuration as and when they need it.

Picking a few key fields, we can apply a simple PostgreSQL request:

```bash
cat << EOF | kubectl apply -f -
apiVersion: marketplace.kratix.io/v1alpha2
kind: postgresql
metadata:
  name: example
  namespace: default
spec:
  teamId: "acme-org-team-a"
EOF
```

From the consumers perspective, they can watch the status of their request until it
is ready for use. This waiting can be done through automation that results in a
notification or be checked on by a human user:

```bash
kubectl get postgresql.marketplace.kratix.io example --watch
```

Eventually the request will be updated with a user friendly status:

```yaml
NAME      STATUS
dev       1Gi instance v16 deployed successfully without backups
```

:::tip

To exit the `watch` on the command line, use `ctrl+c`

:::

Behind the scenes, Kratix is running a set of Workflows defined by the platform
producer in the Promise. These Workflows incorporate all of the business rules
and required actions before scheduling any declarative workloads to the correct
GitOps repository. In this case the workflow for the PostgreSQL Promise was
quite simple, it took the users input and used this to generate the required
Kubernetes resources to create the PostgreSQL instance. Those resources were
then scheduled to the Platform via the GitOps repo (in this simple scenario, an
in-cluster s3 compatible bucket using MinIO).

You can see the workflows that were run by inspecting the Pods:

```bash
kubectl get pods -l kratix.io/promise-name=postgresql
```

While readiness is useful, often services demand a number of additional specifications
for use. Further inspection of the request status will show any additional details the
provider defined. In this case, it includes a number of fields including connection
information:

```yaml
kubectl get postgresqls.marketplace.kratix.io example -o yaml
```

```yaml

---
status:
  conditions:
    - lastTransitionTime: "2025-05-27T13:15:15Z"
      message: Pipelines completed
      reason: PipelinesExecutedSuccessfully
      status: "True"
      type: ConfigureWorkflowCompleted
    - lastTransitionTime: "2025-05-27T13:15:15Z"
      message: All works associated with this resource are ready
      reason: WorksSucceeded
      status: "True"
      type: WorksSucceeded
    - lastTransitionTime: "2025-05-27T13:15:16Z"
      message: Reconciled
      reason: Reconciled
      status: "True"
      type: Reconciled
  connectionDetails:
    credentials: 'Username and Password available in Secret: "default/postgres.acme-org-team-a-example-postgresql.credentials.postgresql.acid.zalan.do"'
    host: acme-org-team-a-example-postgresql.default.svc.cluster.local
  instanceName: acme-org-team-a-example-postgresql
  lastSuccessfulConfigureWorkflowTime: "2025-05-27T13:15:15Z"
  message: 1Gi instance v16 deployed successfully without backups
  observedGeneration: 4
```

These fields are how the producer communicates important information to the consumer
since the consumer should not need to know how the database is created.

:::tip
These status fields are an example of how Kratix provides the framework so that you can
focus on building your platform your way.
:::

### Update an Instance

Kratix isn't a fire and forget solution; it handles the full lifecycle,
including all day 2 operations. For example, if your requirements change, it's
easy to adapt. As a consumer, you simply update the spec and re-submit the
request. Promises are designed to safely handle updates without requiring
custom scripts or manual intervention.

For example, introducing backups is as simple as adding another field to the request:

```yaml
cat << EOF | kubectl apply -f -
apiVersion: marketplace.kratix.io/v1alpha2
kind: postgresql
metadata:
  name: example
  namespace: default
spec:
  teamId: "acme-org-team-a"
  backupEnabled: true  # introduce backups
EOF
```

This time after running the apply command the Kubernetes CLI will respond that the
instance is `configured` instead of `created`. But whether it is a create or an update
Kratix will reconcile the changes automatically without any custom scripts or manual
intervention. In this example, a new CronJob is created to handle backups. Wait for the
update to complete:

```bash
kubectl get postgresqls.marketplace.kratix.io example --watch
```

Once the Workflow runs, the status will show the update was successful:

```bash
NAME      STATUS
example   1Gi instance v16 deployed successfully with backups enabled
```

A successful Workflow means that the expectation has been set, but the decoupled GitOps
will reconcile on a schedule. So it may take a couple of minutes for the backup CronJob
to become visible:

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

In order to show how Kratix can manage a fleet of instances, use the command provided below
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

You can observe the roll out in action with the following command (it may take a
minute or two):

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

Kratix will roll out the update to every instance that uses the Promise continuing to
follow any of the business rules defined in the Workflows without having to ask each
consumer to run a CI/CD pipeline, make PRs into a number of different repositories or
take any other action one-by-one.

Since Promises create and manage services in a consistent and repeatable way, platform
contributors are provided full control and visibility without disrupting any consumers.

## Business Processes, Built-in

While this quick-start focuses on how to use marketplace Promises, this is really only
the beginning.

Promises become truly powerful once they encode your internal company standards such as
compliance checks, cost controls, or governance policies inside the Workflows. Since
these Workflows are reconciled on each change as well as a regular basis, each request
automatically includes the rules your organisation cares about.

Self-service doesn’t mean a loss of control. With Kratix, it means speed **and** safety.

## Summary

In this quick start, you:

- Installed Kratix and published a Marketplace Promise
- Experienced self-service creation and update of a PostgreSQL instance
- Managed a policy change for a fleet of three PostgreSQL instances

If you're ready to go deeper:

- [Try writing your own Promise in the Kratix Workshop →](https://docs.syntasso.io/workshop)
- [Explore Syntasso Kratix Enterprise →](https://docs.syntasso.io/ske)

:::tip
**Want to see how this fits your platform strategy?** [Book a call with us →](https://syntasso.io/#contact-us)
:::
