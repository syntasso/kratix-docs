---
title: Workflows
sidebar_label: Workflows
description: Learn more about conventions in Workflows
id: workflows
---

## Passing secrets to the Pipeline

:::caution Under Development

We're currently working on providing alternative ways to read secrets from both
self hosted and SaaS providers. If you'd like early access, reach out.

:::

To allow the Pipeline to access in-cluster secrets, you will need to use Kubernetes RBAC.

Make sure to target the platform cluster and do the following:

1. Create the Secret you'd like to access. For example:

  ```bash
  kubectl create secret generic promise-secret \
      --from-literal=apikey=topsecret
  ```

1. Create a ClusterRole giving `get` permissions to the `promise-secret` created above:

  ```bash
  kubectl create clusterrole promise-secret-cr \
      --verb=get \
      --resource=secrets \
      --resource-name=promise-secret
  ```

1. Create a ClusterRoleBinding to associate the Pipeline ServiceAccount created
   by Kratix. For Promise Pipelines the service accounts are called
   `PROMISE-promise-pipeline` in the `kratix-platform-system` namespace and for
   Resource Pipelines `PROMISE-resource-pipeline` in whatever namespace the
   resource is requested in.

  ```bash
  # Replace PROMISE with the name of your Promise
  kubectl create clusterrolebinding promise-secret \
      --clusterrole=promise-secret-cr \
      --serviceaccount=default:PROMISE-default-resource-pipeline$
  ```

1. Access the Base64 enconded Secret in the Pipeline with the `kubectl` CLI
  ```
  kubectl get secret promise-secret -o=jsonpath='{.data.apikey}'
  ```

For a working example, check the [Slack
Promise](https://github.com/syntasso/kratix-marketplace/tree/main/slack)
available in the Marketplace.
