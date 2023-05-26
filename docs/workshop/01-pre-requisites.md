---
id: setup
title: Pre-requisites
description: Find out what you need in installed before starting the workshop
---

In this workshop, we'll deploy Kratix on a local Kubernetes cluster, and deploy
Kratix workloads on another Kubernetes cluster. You will need the following
tools:

1. `kind` CLI / **Kubernetes-in-Docker (KinD)**: <br />
  Used to create and manage local Kubernetes clusters in Docker. <br />
  See [the quick start guide](https://kind.sigs.k8s.io/docs/user/quick-start/) to install.

1. `docker` CLI / **Docker**: <br /> Used to orchestrate containers. `kind`
   (above) requires that you have Docker installed and configured. <br /> See
   [Get Docker](https://docs.docker.com/get-docker/) to install.

1. `kubectl` / **Kubernetes command-line tool**: <br /> The CLI for
   Kubernetes&mdash;allows you to run commands against Kubernetes clusters. <br
   /> See [the install guide](https://kubernetes.io/docs/tasks/tools/#kubectl).

:::info

You can run the workshop without KinD. Ideally, you will have access to two
Kubernetes clusters.

One cluster will be the Platform cluster, where Kratix will be installed.
Whenever you see `--context kind-platform`, replace it with the context of your
platform cluster.

The other worker will be the Worker cluster. Whenever you see `--context
kind-worker`, replace it with the context of your worker cluster.

If you want to try it on a single cluster, you can omit the `--context` flag and
argument entirely.

:::

## Docker Resources {#docker-config}

In order to complete all tutorials in this series, you must allocate enough
resources to Docker. Ensure you allocate at least:

* 5 CPU
* 12GB Memory
* 4GB swap

This can be managed through your tool of choice (e.g. Docker Desktop, Rancher, etc).

## Delete pre-existing kind clusters {#delete-clusters}

Ensure no clusters are currently running:

```shell-session
$ kind get clusters
No kind clusters found.
```

If you have clusters named `platform` or `worker` please delete them with:
```bash
kind delete clusters platform worker
```

You are now ready to start. Navigate to the [next
section](installing-kratix) and get started!
