---
description: Learn more about how to deploy Kratix in a prod-like environment
title: The Parts of a Platform
id: parts-of-a-platform
---

This page walks through the parts you would typically find in a Platform, with all the components that you need to run Kratix in a production environment.

:::tip Looking for SKE?

Check out the [SKE Platform](/ske/reference/parts-of-a-platform) for a detailed walkthrough of the parts of a SKE Platform.

:::

```mdx-code-block
import DeploymentTopology from "/img/docs/oss-platform-parts.jpg"
```

<figure className="diagram">
  <img className="large" src={DeploymentTopology} alt="The parts of a Platform" />
</figure>

Central to the Platform is the Platform Cluster. This is the cluster where Kratix is installed, where all the Promises will be made available, and where the users will send their requests to.

Kratix comes with its own webhooks, so it needs certificates to be configurable. You can provide the certificates yourself, or use cert-manager to generate them. To install cert-manager, follow the instructions in the [cert-manager documentation](https://cert-manager.io/docs/installation/).

Still in the Platform Cluster, you will likely want to deploy a GitOps Agent like [FluxCD](https://fluxcd.io/docs/installation/) or [ArgoCD](https://argo-cd.readthedocs.io/en/stable/getting_started/). The GitOps Agent is required for [Compound Promises](/main/guides/compound-promises) and for [Health Checks](/ske/guides/healthchecks) to work. To install the GitOps Agent, follow the instructions in the [GitOps Agent documentation](/category/installing-gitops-agent).

Kratix schedules workloads to Destinations, like the Worker Cluster in the diagram above, via a State Store (Git Repository or S3-Compatible). The Worker Clusters watch the State Store for changes, and apply them to the cluster via a GitOps Agent. Each Worker Cluster should have its own GitOps Agent running. 