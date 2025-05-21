---
description: Quickest way to test Kratix
title: Quick Start
sidebar_label: Quick Start
---

# Quick Start

This guide gives you a hands-on introduction to Kratix by demonstrating Promises in action.

A Promise defines a service you want to offer your users—like a database, developer environment, or any internal capability—as-a-Service. Promises are the core concept of Kratix and the foundation of your platform.

Through this guide, you'll experience how Promises simplify self-service, enable fleet-wide service management, and embed essential business processes—helping you deliver reliable, scalable internal platforms.

## Prerequisites

To follow along, you'll need access to a Kubernetes cluster. Kratix works with any Kubernetes distribution:

- Managed services like GKE, EKS, and AKS
- Local environments like KinD or Minikube

We recommend using a clean, disposable cluster for this quick start. If you're working in a shared or production-like environment, see the full [installation guide](/category/installing-kratix) to avoid configuration conflicts. The quick start deploys a local, insecure MinIO instance—intended only for local development.

## Installation

Kratix runs on Kubernetes and extends its API by introducing custom resources and controllers. This section installs everything you need to get started.

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
kubectl apply -f kratix-install.yaml
```

Verify the platform controller is running:

```bash
kubectl get pods -n kratix-platform-system
```

You should see output similar to:

```bash
NAME                                        READY   STATUS    RESTARTS   AGE
kratix-platform-controller-manager          1/1     Running   0          2m
```

## Publish a Promise

Right now, your platform is empty. To offer services, you publish Promises.

Let’s start with a PostgreSQL database Promise:

```bash
kubectl apply -f database-promise.yaml
```

This makes a new custom resource type available in your cluster:

```bash
kubectl get postgresql
```

You’ll see no instances yet, but the new API is now live. App developers can start requesting PostgreSQL instances with minimal YAML.

:::info
Using Backstage? Syntasso Kratix Enterprise (SKE) makes integration simple and production-ready. [Learn more →](https://syntasso.io/pricing)
:::

## Request an Instance

As an app developer, you don’t need to know how the database is provisioned. You simply fill out a small custom resource with a few required fields. The platform takes care of the rest.

Let’s look at what the Promise exposes:

```yaml
kind: Promise
metadata:
  name: postgresql
spec:
  api:
    versions:
    - name: v1alpha1
      schema:
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              properties:
                teamId:
                  type: string
                  description: The team ID requesting the database.
                version:
                  type: string
                  description: The PostgreSQL version.
                  default: "15"
                  enum:
                  - "15"
                  - "16"
              required:
              - teamId
```

Now create a database request:

```yaml
apiVersion: marketplace.kratix.io/v1alpha1
kind: postgresql
metadata:
  name: user-db
  namespace: default
spec:
  teamId: "team-a"
  version: "16"
```

Apply the request:

```bash
kubectl apply -f database-request.yaml
```

The database is provisioned behind the scenes. Developers get what they asked for; platform contributors know the right tools and policies were used.

## Update an Instance

Need to make a change? Just update the spec. For example, increasing storage:

```yaml
spec:
  teamId: "team-a"
  version: "16"
  storage: "20Gi"
```

Re-apply it:

```bash
kubectl apply -f database-request.yaml
```

Kratix reconciles the changes automatically—no custom scripts, no manual intervention.

## Manage a Fleet

Once multiple teams are requesting PostgreSQL databases, Kratix makes fleet-wide updates simple.

Let’s say you need to apply a security patch or adjust shared config. Just update the Promise:

```yaml
spec:
  image: postgres:16.3-alpine # patched version
  configuration:
    max_connections: 200
```

Apply the update:

```bash
kubectl apply -f database-promise.yaml
```

Kratix will roll out the update to every instance that uses the Promise. Platform contributors gain full control and visibility without disrupting application teams.

## Business Processes, Built In

Promises can also encode your internal standards—like compliance checks, cost controls, or governance policies. Each request automatically includes the rules your org cares about.

Self-service doesn’t mean a loss of control. With Kratix, it means speed **and** safety.

## Summary

In this quick start, you:

- Installed Kratix and published a Promise
- Created and updated a database instance
- Saw how fleet-wide changes are easy
- Learned how Promises align platform control with developer velocity

If you're ready to go deeper:

- [Try the Kratix Workshop →](https://docs.syntasso.io/workshop)
- [Explore Syntasso Kratix Enterprise →](https://docs.syntasso.io/ske)

👉 **Want to see how this fits your platform strategy? [Book a call with us →](https://syntasso.io/#contact-us)**
