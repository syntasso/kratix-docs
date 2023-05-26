---
description: Learn about how Compound Promises can deliver complete developer experiences
title: Using Compound Promises
id: multiple-promises
slug: ../multiple-promises
---

This is Part 4 of [a series](intro) illustrating how Kratix works. <br />
👈🏾&nbsp;&nbsp; Previous: [Install a Kratix Promise](installing-a-promise) <br />
👉🏾&nbsp;&nbsp; Next: [Unpacking a Promise](promise-theory)

<hr />

**In this tutorial, you will:**

- learn about Compound Promises
- see a Compound Promise in action

## What's a Compound Promises

Imagine that you want to provide your users with a simpler way to deploy their
applications. You do your research and notice that most teams use a similar
stack: PostgreSQL as database, Redis for caching, Grafana for monitoring, etc.
You also find out that the majority of users don't care about a lot of the
configuration options of those services, as long as they come with sane
defaults.

However, not all teams are created equal. Some teams need specific versions of
those services, configured with specific parameters, on specific regions and
resources.

You want the platform to cater for both: it should be simple to get the simple
services and it should be possible to get the specialised ones.

You decide to provide each of the individual services as a Promise. Specialist
teams can then use the API to get the exact service they need.

To deliver the simple experience though, you want to orchestrate those Promises
in a higher-level promise. In Kratix terms, this is a Compound Promise: a
Promise that define other Promises as its dependencies.

In this tutorial, we will install and use a Compound Promise.

## Installing a Compound Promise

At this stage, you should still have your Platform and your Worker clusters
running:

```shell-session
$ kubectl --context kind-platform get pods --namespace kratix-platform-system
NAME                                                  READY   STATUS    RESTARTS   AGE
kratix-platform-controller-manager-7cc49f598b-zqkmz   2/2     Running   0          4h4m
minio-6f75d9fbcf-jpstv                                1/1     Running   0          4h4m

$ kubectl --context kind-worker get pods
NAME                                READY   STATUS    RESTARTS   AGE
jenkins-dev-example                 1/1     Running   0          1h
jenkins-operator-7f58798d5c-sr825   1/1     Running   0          1h
```

We won't be using the Jenkins or the Jenkins Promise anymore. So let's go ahead
and delete the resources:

```bash
kubectl --context kind-platform delete promise jenkins
```

The command above will cascade-delete all traces of Jenkins from our Platform,
including the deployed Jenkins on the Worker cluster.

There's an example Compound Promise on the Kratix repository under
`samples/paved-path-nginx`. This Compound Promise encapsulate the Nginx and the
Postgres Promises. It also includes a "Deployment" Promise to run the
application image.

Let's go ahead and install it (ensure you are in the Kratix directory before
running the command below):

```bash
kubectl --context kind-platform apply --filename samples/paved-path-nginx/promise.yaml
```

Once it's applied, you can check it should now be available on the Platform:

```shell-session
$ kubectl --context kind-platform get promises
NAME            AGE
paved-path       1m
```

However, similar to last time, if we check the Kratix Controller Manager logs,
we will once again see a failure to reconcile.

```shell-session
$ kubectl --context kind-platform --namespace kratix-platform-system \
   logs deployment/kratix-platform-controller-manager \
   --container manager

   # output formatted for readability
   ERROR    Reconciler error {
        "Work": {"name":"paved-path-default","namespace":"default"},
        "error": "no Clusters can be selected for clusterSelector"
   }
```

By reading the [Paved Path Promise
documentation](https://github.com/syntasso/kratix/tree/main/samples/paved-path-nginx),
closely, we can see the following:

> To use this Promise, the Kubernetes cluster running Kratix must be registered
> as a Worker Cluster

Since the Paved Path Promise has other Promises as dependencies, we need to
ensure those dependencies are installed on the Platform cluster itself. For
that, we will follow a similar process as we executed previously.

### Registering the Platform as a Worker

First, let's register the Platform cluster itself as a worker cluster. We can do
that by creating a Cluster object:

```yaml
cat <<EOF | kubectl --context kind-platform apply -f -
apiVersion: platform.kratix.io/v1alpha1
kind: Cluster
metadata:
  name: platform-cluster
  namespace: default
  labels:
    environment: platform
spec:
  stateStoreRef:
    name: minio-store
    kind: BucketStateStore
EOF
```

The Paved Path Promise dependencies (i.e. other Promises) cannot be installed to
any Worker cluster. It should only be installed on clusters where the Promise
CRD is available&mdash;which is usually only in the Platform cluster.

Kratix allows Promise writers to determine to which clusters the Promisee dependencies
can be installed. The Paved Path Promise contains, in its definition, a line
that says _only install the dependencies in clusters with a label `environment`
with value `platform`_. That's why, if you look closely on the Cluster
definition above, we are labelling the Platform cluster with those values.

We also need to install the GitOps toolkit on the Platform cluster. We could do
it manually as last time, but you can also just run the `install-gitops` script
located inside the `scripts` directory:

```bash
./scripts/install-gitops --context kind-platform --path platform-cluster
```

Once the Flux running on the Platform picks up the changes, you should see the
sub-Promises appearing in the Platform cluster:

```shell-session
$ kubectl --context kind-platform get promises
NAME            AGE
deployment      10m
nginx-ingress   10m
paved-path      15m
postgresql      10m
```

The Paved Path Promise also determines that the sub-Promises dependencies should
only be installed to clusters with label `environment = dev`. Fortunatelly, we
already labelled the Worker cluster with that label when we created it:

```shell-session
$ kubectl --context kind-platform get clusters --show-labels
NAME               AGE   LABELS
platform-cluster   1h    environment=platform
worker-cluster     1h    environment=dev
```

Checking the Worker cluster, we should see the Nginx Controller and the
PostgreSQL operator starting (it may take a few minutes):

```shell-session
$ kubectl --context kind-worker get deployments
NAME                  READY   UP-TO-DATE   AVAILABLE   AGE
nginx-nginx-ingress   0/1     1            1           1m
postgres-operator     1/1     1            1           1m
```

When the deployments eventually complete, Platform users can go ahead and start
using the Promises!

## Request a Paved Path

As a Platform user, you now have a few choices:

```shell-session
$ kubectl --context kind-platform get promises
NAME            AGE
deployment      1h
nginx-ingress   1h
paved-path      1h
postgresql      1h
```

You could request each one of those services individually if you need
fine-grained control of how they ought to be deployed, or you can use the Paved
Path promise to get an opinionated deployment of each of those. Let's go ahead
and request the Platform to run an application using the Paved Path offering:

```yaml
cat <<EOF | kubectl --context kind-platform apply --filename -
---
apiVersion: example.promise.syntasso.io/v1
kind: app
metadata:
  name: example
  namespace: default
spec:
  name: todo
  image: syntasso/sample-todo-app:v0.1.2
  dbDriver: postgres
EOF
```

The Paved Path Promise will take that request and generate the necessary
requests for the sub-Promises, as well as doing the wire up of the services and
the application.

You can see the Pipelines in actions by watching the Pods running on your
Platform cluster (it may take a few seconds):

```shell-session
$ kubectl --context kind-platform get pods
NAME                                        READY   STATUS      RESTARTS   AGE
request-pipeline-deployment-default-22ee9   0/1     Completed   0          18s
request-pipeline-paved-path-default-8769b   0/1     Completed   0          40s
request-pipeline-postgresql-default-c3516   0/1     Completed   0          18s
```

Kratix will, once again, store the pipeline output (i.e. the desired state) in
the State Store for the Worker cluster, which will in turn be picked up by the
GotOps toolkit and deployed onto the Worker (it may take a few minutes):

```shell-session
$ kubectl --context kind-worker get pods
NAME                                   READY   STATUS    RESTARTS   AGE
#highlight-next-line
acid-todo-postgresql-0                 1/1     Running   0          110s
nginx-nginx-ingress-58c4dcb47d-49fd8   1/1     Running   0          10m
postgres-operator-79754946d-nmkhr      1/1     Running   0          10m
#highlight-next-line
todo-84f6b6698-vqxqm                   1/1     Running   0          74s
```

You can see the new PostgreSQL instance, as well as the application, fully
deployed. You can now access the app! It should be running on
[http://todo.local.gd:31338/](http://todo.local.gd:31338/).

## 🎉 Congratulations

You have installed a Compound Promise and created an instance of the Paved Path!

✅&nbsp;&nbsp;This tutorial concludes our Introduction to Kratix. <br />
👉🏾&nbsp;&nbsp;You can go ahead and start the next module to learn [how to write your own
Promises](writing-a-promise) or jump to [What's next](whats-next) to learn about
what else you can achieve with Kratix.
