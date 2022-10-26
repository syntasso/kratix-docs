---
description: Install Kratix and multiple Promises
title: Part 1
id: using-multiple-promises
slug: /events/2022-kcduk/using-multiple-promises
---

# Use Kratix Promises to build a paved path

**In this tutorial, you will**
1. [Bootstrap a local cluster with Kratix](#set-up)
1. [Install multiple promises as a platform engineer](#platform-engineer)
1. [Request an instance as a application developer](#application-developer)

## Bootstrap a local cluster with Kratix {#set-up}

### System setup {#pre-requisites}

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

#### Update your Docker resource allocations {#docker-config}
In order to complete all tutorials in this series, you must allocate enough resources to Docker. Docker requires:
* 5 CPU
* 12GB Memory
* 4GB swap

This can be managed through your tool of choice (e.g. Docker Desktop, Rancher, etc).

### Quick Start Kratix

You need a fresh installation of Kratix for this workshop. The simplest way to bootstrap your environment is running the quick-start script from within the Kratix directory.

```bash
git clone https://github.com/syntasso/kratix.git
cd kratix
./scripts/quick-start.sh --recreate
```

Alternatively, you can go back to [Installing Kratix](../../workshop/02-installing-kratix.md) and follow the appropriate guide.

## Install multiple promises as a platform engineer {#platform-engineer}

### The power of Promises {#power-of-promises}

Promises are the building blocks that enable teams to design platforms that specifically meet their customer needs. Through writing and extending Promises, Platform teams can raise the value line of the platform they provide. They can use multiple simpler, low-level Promises to provide an experience tailored to their users needs.

Consider the task of setting up development environments for application teams. This task is usually repetitive and requires many cookie-cutter steps. It may involve wiring up Git repos, spinning up a CI/CD server, creating a PaaS to run the applications, instructing CI/CD to listen to the Git repos and push successful builds into the PaaS, and finally wiring applications to their required data services.

A Promise can encapsulate all the required steps and handle the toil of running those low-level tasks. It can be designed as a single Promise that does it all, or it can be a collection of Promises that, combined, deliver the desired functionality.

Now you will see the power of Kratix Promises by deploying a web app that uses multiple Promises.

<br />
<hr />
<br />

![Overview](/img/docs/Treasure_Trove-Install_Multiple_Promises_no_jenkins.jpeg)

### Install all required Promises {#install-all-promises}

In order for an application team to deploy an application to a dev environment they require a relational datastore (postgres) and networking for user traffic (Knative). To deliver this functionality on-demand with Kratix install the required Promises on your platform cluster:

```console
kubectl --context kind-platform apply --filename https://raw.githubusercontent.com/syntasso/kratix/main/samples/postgres/postgres-promise.yaml
kubectl --context kind-platform apply --filename https://raw.githubusercontent.com/syntasso/kratix/main/samples/knative-serving/knative-serving-promise.yaml
```
<br />

Verify the Promises are all installed on your platform cluster
```console
kubectl --context kind-platform get promises
```

The above command will give an output similar to
```console
NAME                      AGE
ha-postgres-promise       1m
knative-serving-promise   1m
```
<br />

Verify the CRDs are all installed on your platform cluster. Note that you know have `knativeserving` and `postgres` available.

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

<p>Verify the <code>workerClusterResources</code> are installed on your worker cluster<br />
<sub>(This may take a few minutes so <code>--watch</code> will watch the command. Press <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop watching)</sub>
</p>

```console
kubectl --context kind-worker get pods --watch
```

The above command will give an output similar to
```console
NAME                                 READY   STATUS    RESTARTS   AGE
postgres-operator-7dccdbff7c-2hqhc   1/1     Running   0          1m
```
<br />

## Request an instance as an application developer {#application-developer}

![Overview-instances](/img/docs/Treasure_Trove-Get_instances_of_multiple_Promises_no_jenkins.jpeg)

Submit a set of Kratix Resource Requests to get a Knative Serving component and a Postgres database.
```console
kubectl --context kind-platform apply --filename https://raw.githubusercontent.com/syntasso/kratix/main/samples/postgres/postgres-resource-request.yaml
kubectl --context kind-platform apply --filename https://raw.githubusercontent.com/syntasso/kratix/main/samples/knative-serving/knative-serving-resource-request.yaml
```
<br />

<p>By requesting these resources, you will start two pods which create a postgres cluster (named per the Resource Request name, <code>acid-minimal</code>). To verify you have all the necessary resources up and running<br />
<sub>(This may take a few minutes so <code>--watch</code> will watch the command. Press <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop watching)</sub>
</p>

```console
kubectl --context kind-worker get pods --watch
```

The above command will give an output similar to
```console
NAME                                      READY   STATUS    RESTARTS         AGE
acid-minimal-cluster-0                    1/1     Running   0                5m
acid-minimal-cluster-1                    1/1     Running   0                5m
...
```
<br />

Verify that knative has also installed its networking resources into two new namespaces
```console
kubectl --context kind-worker get namespaces
```
<br />

The above command will give an output similar to
```console
NAME                   STATUS   AGE
knative-serving        Active   1h
kourier-system         Active   1h
...
```
<br />

Verify that the Kratix Resource Request was issued on the platform cluster.
```console
kubectl --context kind-platform get postgreses.example.promise.syntasso.io
```
<br />

The above command will give an output similar to
```console
NAME                    AGE
acid-minimal-cluster    1m
```

### Run the application

With all the necessary resources available, you can now run your app using the just created services. In this step, you will deploy a [sample application](https://github.com/syntasso/sample-golang-app) that uses Postgres for persistence and Knative for serving the application.

To deploy the app, run:

```console
kubectl --context kind-worker apply --filename https://raw.githubusercontent.com/syntasso/sample-golang-app/main/k8s/serving.yaml
```

<!-- TODO: add verification instructions? -->
### Validate the deployment {#validate-deployment}

Verify that the Knative Service for the application is ready:

```console
kubectl --context kind-worker get services.serving.knative.dev
```

The above command will give an output similar to
```console
NAME   URL                               LATESTCREATED   LATESTREADY   READY   REASON
todo   http://todo.default.example.com   todo-00001      todo-00001    True
```
<br />

### Test the deployed application {#test-app}

Now test the app.

On a separate terminal, you'll need to open access to the app by port-forwarding the kourier service:

```console
kubectl --context kind-worker --namespace kourier-system port-forward svc/kourier 8081:80
```
<br />

Now curl the app:
```console
curl -H "Host: todo.default.example.com" localhost:8081
```


## Summary {#summary}
Your platform has pieced together two different Promises to provide a solution for an application team to deploy a new service using Knative and Postgres. Well done!

To recap the steps we took:
1. ✅&nbsp;&nbsp;Installed two Kratix Promises
2. ✅&nbsp;&nbsp;Requested an instance of each Kratix Promise
3. ✅&nbsp;&nbsp;Pushed an application to Knative that integrates with the instance of Postgres
4. ✅&nbsp;&nbsp;Viewed our successfully running application!

This is only the beginning of working with Promises. Next you will learn how to write a Promise.

## 🎉 &nbsp; Congratulations!
✅&nbsp;&nbsp; You have deployed a web app that uses multiple Kratix Promises. <br />
👉🏾&nbsp;&nbsp; Now you will [write your own Jenkins Promise to learn more about how Kratix Promises work](writing-a-jenkins-promise).
