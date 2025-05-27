---
description: Quickest way to test Kratix
title: Quick Start
sidebar_label: Quick Start
---

# Quick Start

This guide gives you a hands-on introduction to Kratix by demonstrating how
Kratix provides self-service and fleet management in action through the use of
Promises.

A Promise defines a service you want to offer your users, like a database,
developer environment, or any internal capability—as-a-Service. Promises are the
core concept of Kratix and the foundation of your platform. They are written by
platform operators or contributors, and are consumed by the users of the
platform, such as application developers.


## Prerequisites

To follow along, you'll need access to a Kubernetes cluster. Kratix works with
any Kubernetes distribution:

- Managed services like GKE, EKS, or AKS

- On-premises clusters like OpenShift, Rancher, or vanilla Kubernetes

- Local environments like KinD or Minikube

We recommend using a clean, disposable cluster for this quick start. If you're
working in a shared or production-like environment, see the full [installation
guide](/category/installing-kratix) to avoid configuration conflicts. The quick
start deploys a local, insecure MinIO instance—intended only for local
development.

## Installation

Kratix runs on Kubernetes and extends its API by introducing custom resources
and controllers. Kratix can orchestrate resouces that are in Kubernetes, as well
as those outside. Normally there are multiple steps to install and configure
Kratix, bellow is a all-in-one quick-start installation experience that sets up
everything you need, by running a single Job to install Kratix and its
dependencies.

<details>
  <summary>What gets installed?</summary>

  The install manifest does the following:

  1. Installs **cert-manager** to manage TLS certificates for Kratix webhooks
  2. Deploys the **Kratix API server and controllers** in the `kratix-system` namespace
  3. Deploys **MinIO**, a local S3-compatible bucket for storing declarative workloads
  4. Installs and configures **Flux** to apply changes from the MinIO bucket via GitOps
  5. Registers your Kubernetes cluster as a **Destination** so Kratix can schedule workloads to it
</details>

Install Kratix:

```bash
kubectl apply -f https://github.com/syntasso/kratix/releases/download/latest/kratix-quick-start-installer.yaml
```

After a minute the platform controller should be running:

```bash
kubectl get pods -n kratix-platform-system
```

You should see output similar to:

```bash
NAME                                        READY   STATUS    RESTARTS   AGE
kratix-platform-controller-manager          1/1     Running   0          2m
```

<details>
  <summary><strong>Having issues? Here's how to debug the installer Job</strong></summary>

If the Kratix quick-start Job fails, here are some steps to help troubleshoot the issue:

📋 1. Check the Job status

```bash
kubectl get jobs
kubectl describe job kratix-quick-start-installer
```

Look for `failed` conditions or pod-level errors.

🔍 2. View logs from the installer pod

Find the pod name:

```bash
kubectl get pods -l job-name=kratix-quick-start-installer
```

Then get the logs:

```bash
kubectl logs <installer-pod-name>
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

This will re-run the full installation logic from scratch.

</details>

## Publish a Promise

Right now, the platform is empty. To offer services, you publish Promises. This
is traditionally done by platform operators or contributors.

Let’s start with by publishing a simple PostgreSQL Promise:

```bash
kubectl apply -f https://raw.githubusercontent.com/syntasso/promise-postgresql/refs/heads/main/promise.yaml
```

This makes a new custom resource type available in your cluster:

```bash
kubectl get postgresqls.marketplace.kratix.io
```

You’ll see no instances yet, but the new API is now live. App developers can
start requesting PostgreSQL instances with minimal YAML.

:::info
Want to front your platform with a Portal like Backstage? Syntasso Kratix Enterprise (SKE) makes integrations with portals simple and production-ready. [Learn more →](https://syntasso.io/pricing)
:::

### Request an Instance

Now that a Promise is available, the platform consumers (often app developer) can
now start self-serving the services that they need. The platform provides the
abstraction so they don’t need to know how the PostgreSQL is provisioned. They simply
fill out a custom resource request with a few fields. The platform takes
care of the rest.

Let’s look at what the Promise API exposes:

```yaml
kubectl explain postgresqls.marketplace.kratix.io.spec
```

This command provides a detailed description of the `postgresql` resource and
what fields are available in the `spec` section. All of the fields are optional,
with sensible defaults provided by the platform. This allows users to focus on
what matters most to them, without getting bogged down in configuration details.

Lets create a simple PostgreSQL request:

```yaml
# copy into a postgresql-request.yaml file
apiVersion: marketplace.kratix.io/v1alpha1
kind: postgresql
metadata:
  name: example
  namespace: default
spec:
  teamId: "acme-org-team-a"
  version: "16"
  backupEnabled: false
```

Apply the request:

```bash
kubectl apply -f postgresql-request.yaml
```

This triggers Kratix to reconcile the request. It will trigger the workflows
defined in the Promise, and schedule any declarative workloads needed. From the
users persepective, all they have to do is watch the status of their request:

```bash
kubectl get postgresql.marketplace.kratix.io example -w
```

Eventually the request will be marked as `Ready`:

```yaml
NAME      STATUS
dev       1Gi instance v16 deployed successfully without backups
```

Further inspection of the status will show additional details, like the
connection information:

```yaml
kubectl get postgresql example -o yaml'
...
status:
  conditions:
  - lastTransitionTime: "2025-05-27T13:15:15Z"
    message: Pipelines completed
    reason: PipelinesExecutedSuccessfully
    status: "True"
    type: ConfigureWorkflowCompleted
  connectionDetails:
    credentials: 'Username and Password available in Secret: "default/postgres.acme-org-team-a-example-postgresql.credentials.postgresql.acid.zalan.do"'
    host: acme-org-team-a-example-postgresql.default.svc.cluster.local
  instanceName: acme-org-team-a-example-postgresql
  lastSuccessfulConfigureWorkflowTime: "2025-05-27T13:15:15Z"
  message: 1Gi instance v16 deployed successfully without backups
  observedGeneration: 4

```

In this example, the PostgreSQL is provisioned in the Kubernetes cluster. A
Promise can orchestrate any system or service, so you could just as easily swap
the Promise to provision a managed database in the cloud, and provide back to
the user the connection information for that service instead. Kratix enables you
to build your platform your way.

### Update an Instance

Need to make a change? Just update the spec. For example, increasing storage:

```yaml
apiVersion: marketplace.kratix.io/v1alpha1
kind: postgresql
metadata:
  name: example
  namespace: default
spec:
  teamId: "acme-org-team-a"
  version: "16"
  # changed from false to true
  backupEnabled: true
```

Re-apply it:

```bash
kubectl apply -f postgresql-request.yaml
```

Kratix reconciles the changes automatically—no custom scripts, no manual intervention.
In this example, a new CronJob is created to handle backups. Wait for the update
to complete:

```bash
kubectl get postgresqls.marketplace.kratix.io example -w
```

Eventually, the status will show the update was successful:

```yaml
NAME      STATUS
example   1Gi instance v16 deployed successfully with backups enabled
```

If we check the CronJob, we can see that the backup job has been created:

```bash
kubectl get cronjob
k get cronjobs
NAME                                                SCHEDULE      TIMEZONE   SUSPEND   ACTIVE   LAST SCHEDULE   AGE
logical-backup-acme-org-team-a-example-postgresql   30 00 * * *   <none>     False     0        <none>          30s
```

## Manage a Fleet

In order to show how Kratix can manage a fleet of instances, lets create a
couple more PostgreSQL instances. This will demonstrate how Kratix can
orchestrate changes across multiple instances at once:

```
kubectl apply -f https://raw.githubusercontent.com/syntasso/promise-postgresql/refs/heads/main/multiple-resource-requests.yaml
```

You should then see the new instances being created:
```
kubectl get pods
AME                                    READY   STATUS    RESTARTS   AGE
acme-org-team-a-example-postgresql-0   1/1     Running   0          2m
acme-org-team-b-dev-postgresql-0       1/1     Running   0          5s
acme-org-team-c-testing-postgresql-0   1/1     Running   0          5s
```

Now, let's say you want to update all instances to have a new modification. This
could be patching a CVE in the images, updating the configuration, or even
expanding whats deployed. You can do this by updating the Promise itself. In
this case, lets update the Promise to increase the default replica count of the
PostgreSQL instances from 1 to 3. This will cause all existing instances to be
updated, and any new instances created to use the new default.

```bash
kubectl apply -f https://raw.githubusercontent.com/syntasso/promise-postgresql/refs/heads/main/promise-ha.yaml
```

Kratix will roll out the update to every instance that uses the Promise.
Platform contributors gain full control and visibility without disrupting
application teams.

After a few moments, you can observe the affect of the rolling:

```bash
kubectl get pods
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

## Business Processes, Built In

Promises can also encode your internal standards—like compliance checks, cost
controls, or governance policies. Each request automatically includes the rules
your org cares about.

Self-service doesn’t mean a loss of control. With Kratix, it means speed **and** safety.

## Summary

In this quick start, you:

- Installed Kratix and published a Promise
- Created and updated a PostgreSQL instance
- Saw how fleet-wide changes are easy

If you're ready to go deeper:

- [Try the Kratix Workshop →](https://docs.syntasso.io/workshop)
- [Explore Syntasso Kratix Enterprise →](https://docs.syntasso.io/ske)

👉 **Want to see how this fits your platform strategy? [Book a call with us →](https://syntasso.io/#contact-us)**
