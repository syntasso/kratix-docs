---
description: Install Kratix and multiple Promises
title: Part 1
id: using-multiple-promises
slug: /events/2022-kcduk/using-multiple-promises
---

# Use Kratix Promises to build a paved path

## What you will do

**As a Platform Engineer**
1. [Bootstrap a local cluster with Kratix](#set-up)
1. [Install multiple Promises as a platform engineer](#install-promises)

**As a Platform User**
1. [Request an instance as a application developer](#request-instance)

<hr />

## Platform Engineer

### Bootstrap a local cluster with Kratix {#set-up}

#### System setup {#pre-requisites}

For this workshop, we'll use Kratix on two local Kubernetes clusters. Install the prerequisites listed below if they aren't already on your system.

1. `kind` CLI / **Kubernetes-in-Docker(KinD)**: <br />
  Used to create and manage local Kubernetes clusters in Docker. <br />
  See [the quick start guide](https://kind.sigs.k8s.io/docs/user/quick-start/) to install.

1. `docker` CLI / **Docker**: <br />
  Used to orchestrate containers. `kind` (above) requires that you have Docker installed and configured. <br />
  See [Get Docker](https://docs.docker.com/get-docker/) to install.

  :::caution

  Docker Desktop (For Mac) v4.13.0 has a [known issue](https://github.com/docker/for-mac/issues/6530) that crashes Docker Daemon on specific situations. Please ensure you are using an earlier or later version of Docker.

  :::

1. `kubectl` / **Kubernetes command-line tool**: <br />
The CLI for Kubernetes&mdash;allows you to run commands against Kubernetes clusters.<br />
See [the install guide](https://kubernetes.io/docs/tasks/tools/#kubectl).

##### Update your Docker resource allocations {#docker-config}
In order to complete all tutorials in this series, you must allocate enough resources to Docker. Docker requires:
* 5 CPU
* 12GB Memory
* 4GB swap

This can be managed through your tool of choice (e.g. Docker Desktop, Rancher, etc).

#### Quick Start Kratix

You need a fresh installation of Kratix for this workshop. The simplest way to bootstrap your environment is running the quick-start script from within the Kratix directory.

```bash
git clone https://github.com/syntasso/kratix.git
cd kratix
./scripts/quick-start.sh --recreate
```
<br />
<br />

![Environment setup](/img/docs/events/kratix_diagrams-PlatformDev-Setup_environment.jpg)

### Install multiple Promises {#install-promises}

#### Install all required Promises {#install-all-promises}

Promises are the building blocks that enable teams to design platforms that specifically meet their customer needs in a self-service way. To deliver a dev environment for a new application, with Kratix install Promises for knative serving and Postgres on your platform cluster:

```bash title="Install knative and Postgres Promises"
kubectl --context kind-platform apply --filename https://raw.githubusercontent.com/syntasso/kratix/main/samples/postgres/postgres-promise.yaml
kubectl --context kind-platform apply --filename https://raw.githubusercontent.com/syntasso/kratix/main/samples/knative-serving/knative-serving-promise.yaml
```

When a Promise is installed into the cluster, it will do two visible things:
1. Teach Kratix how to accept requests for an instance of the service
1. Set up any prerequisite infrastructure that is required to create an instance

<br />
<br />

![Installing a promise](/img/docs/events/kratix_diagrams-PlatformDev-Install_promises.jpg)
<br />

Verify the Promises are all installed on your platform cluster
```console
kubectl --context kind-platform get promises
```

The above command will give an output similar to
```console
NAME                      AGE
#highlight-start
ha-postgres-promise       1m
knative-serving-promise   1m
#highlight-end
```
<br />

Verify the CRDs that let a customer request an instance have been installed
```console
kubectl --context kind-platform get crds
```

The above command will give an output similar to
```console
NAME                                          CREATED AT
clusters.platform.kratix.io                   2022-09-23T14:37:20Z
#highlight-start
knativeservings.example.promise.syntasso.io   2022-09-23T14:38:48Z
postgreses.example.promise.syntasso.io        2022-09-23T14:38:51Z
#highlight-end
promises.platform.kratix.io                   2022-09-23T14:37:20Z
workplacements.platform.kratix.io             2022-09-23T14:37:20Z
works.platform.kratix.io                      2022-09-23T14:37:20Z
```
<br />

Finally, verify the prerequisite infrastructure for delivering Postgres on demand have been installed on the worker cluster

```console
kubectl --context kind-worker get pods
```

The above command will give an output similar to
```console
NAME                                 READY   STATUS    RESTARTS   AGE
#highlight-start
postgres-operator-7dccdbff7c-2hqhc   1/1     Running   0          1m
#highlight-end
```

and for knative

```bash
kubectl --context kind-worker get crds
```

The above command will give an output similar to
```console
NAME                                                  CREATED AT
alerts.notification.toolkit.fluxcd.io                 2022-11-17T12:00:00Z
buckets.source.toolkit.fluxcd.io                      2022-11-17T12:00:00Z
#highlight-start
certificates.networking.internal.knative.dev          2022-11-17T12:11:00Z
clusterdomainclaims.networking.internal.knative.dev   2022-11-17T12:11:00Z
configurations.serving.knative.dev                    2022-11-17T12:11:00Z
domainmappings.serving.knative.dev                    2022-11-17T12:11:00Z
#highlight-end
gitrepositories.source.toolkit.fluxcd.io              2022-11-17T12:00:00Z
...
```

<br />

## Platform User

### Request resources for a dev environment {#request-instance}

As an application dev, you have a new app you want to deploy along with a new database. To do this, you can make a request for the resources you need providing only the details that are required.

![Requesting resources](/img/docs/events/kratix_diagrams-AppDev_Request-instances.jpg)

Submit a set of Kratix Resource Requests to get a Knative Serving component and a Postgres database.

```console title="Request instances"
kubectl --context kind-platform apply --filename https://raw.githubusercontent.com/syntasso/kratix/main/samples/postgres/postgres-resource-request.yaml
kubectl --context kind-platform apply --filename https://raw.githubusercontent.com/syntasso/kratix/main/samples/knative-serving/knative-serving-resource-request.yaml
```
<br />

Verify that the Kratix Resource Request was issued on the platform cluster.
```console
kubectl --context kind-platform get postgreses.example.promise.syntasso.io
```

The above command will give an output similar to
```console
NAME                    AGE
#highlight-start
acid-minimal-cluster    1m
#highlight-end
```

<br />

<p>Each request needs to be delivered through the pipeline defined by the platform team. If you want to peak at what is happening, you can use the following command
</p>

```console
kubectl --context kind-platform get pods --watch
```

This will result in a similar output to below:
```console
NAME                                                     READY   STATUS      RESTARTS   AGE
#highlight-start
request-pipeline-ha-postgres-promise-default-266c2       0/1     Completed   0          1m
request-pipeline-knative-serving-promise-default-4ffed   0/1     Completed   0          1m
#highlight-end
```

<p>These pipelines configure your resources in an opinionated way. Including setting the replicas for postgres to two. To verify your Postgres cluster (named per the Resource Request name, <code>acid-minimal</code>) is up and running you can use the following command.<br />
</p>

<br />

```console
kubectl --context kind-worker get pods --watch
```

:::note

This may take a few minutes so <code>--watch</code> will watch the command. Press <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop watching

:::


The above command will give an output similar to
```console
NAME                                      READY   STATUS    RESTARTS         AGE
#highlight-start
acid-minimal-cluster-0                    1/1     Running   0                5m
acid-minimal-cluster-1                    1/1     Running   0                5m
#highlight-end
postgres-operator-6c6dbd4459-4jf5h        1/1     Running   0                10m
```
<br />

Verify that knative has also installed its networking resources into two new namespaces
```console
kubectl --context kind-worker get namespaces
```

The above command will give an output similar to
```console
NAME                   STATUS   AGE
default                Active   5m
flux-system            Active   5m
#highlight-start
knative-serving        Active   1m
kourier-system         Active   1m
#highlight-end
kratix-worker-system   Active   3m
kube-node-lease        Active   5m
kube-public            Active   5m
kube-system            Active   5m
local-path-storage     Active   5m
```
<br />

#### Run the application

With all the necessary resources available, you can now run your app using the just created services. In this step, you will deploy a [sample application](https://github.com/syntasso/sample-golang-app) that uses Postgres for persistence and knative for serving the application.

To deploy the app, run:

```console
kubectl --context kind-worker apply --filename https://raw.githubusercontent.com/syntasso/sample-golang-app/main/k8s/serving.yaml
```

:::note
It takes some time for Knative to get up and running. If you get a webhook-related error wait a few minutes
before trying the command again.
:::

<br />

<!-- TODO: add verification instructions? -->
#### Validate the deployment {#validate-deployment}

Verify that the Knative Service for the application is ready:

```console
kubectl --context kind-worker get services.serving.knative.dev
```

The above command will give an output similar to
```console
NAME   URL                             LATESTCREATED   LATESTREADY   READY   REASON
#highlight-start
todo   http://todo.default.local.gd    todo-00001      todo-00001    True
#highlight-end
```
<br />

#### Test the deployed application {#test-app}

Now test the app.

On a separate terminal, you'll need to open access to the app by port-forwarding the kourier service:

```console
kubectl --context kind-worker --namespace kourier-system port-forward svc/kourier 8081:80
```

Now go to [http://todo.default.local.gd:8081](http://todo.default.local.gd:8081) to see the app running.

### Summary {#summary}
Your platform has pieced together two different Promises to provide a solution for an application team to deploy a new service using Knative and Postgres. Well done!

To recap the steps we took:
1. ✅&nbsp;&nbsp;Installed two Kratix Promises
2. ✅&nbsp;&nbsp;Requested an instance of each Kratix Promise
3. ✅&nbsp;&nbsp;Pushed an application to Knative that integrates with the instance of Postgres
4. ✅&nbsp;&nbsp;Viewed our successfully running application!

This is only the beginning of working with Promises. Next you will learn how to write a Promise.

## 🎉 &nbsp; Congratulations!
✅&nbsp;&nbsp; You have deployed a web app that uses multiple Kratix Promises. <br />
👉🏾&nbsp;&nbsp; Now you will [write your own Promise to provide CI-as-a-Service](writing-a-ci-promise)
