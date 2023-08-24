---
description: Learn about how Compound Promises can deliver complete developer experiences
title: Using Compound Promises
id: multiple-promises
slug: ../multiple-promises
---
```mdx-code-block
import CompoundPromiseDiagram from "/img/docs/workshop/compound-promise-diagram.svg"
import PavedPathDiagram from "/img/docs/workshop/compound-promise-paved-path-diagram.svg"
import InstallationDiagram from "/img/docs/workshop/compound-promise-installation-diagram.svg"
import InstallErrorDiagram from "/img/docs/workshop/compound-promise-install-error-diagram.svg"
import InstallationPlatformDiagram from "/img/docs/workshop/compound-promise-install-platform-diagram.svg"
import InstallationCompleteDiagram from "/img/docs/workshop/compound-promise-install-complete-diagram.svg"
import PipelineDiagram from "/img/docs/workshop/compound-promise-pipeline-execution-diagram.svg"
```

This is Part 3 of [a series](intro) illustrating how Kratix works. <br />
👈🏾&nbsp;&nbsp; Previous: [Install a Kratix Promise](installing-a-promise) <br />
👉🏾&nbsp;&nbsp; Next: [Part II](part-ii/intro)

<hr />

**In this tutorial, you will:**

- [learn about Compound Promises](#what-is-a-compound-promise)
- [see a Compound Promise in action](#write-a-compound-promise)

## What's a Compound Promise? {#what-is-a-compound-promise}

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
services and it should be possible to get the specialised ones. You decide to
provide each of the individual services as a Promise. Specialist teams can then
use the API to get the exact service they need.

To deliver the simpler experience though, you want to orchestrate those Promises
in a higher-level Promise. In Kratix terms, this is a Compound Promise: a
Promise that define other Promises as its Dependencies.

<figure class="diagram">
  <CompoundPromiseDiagram className="small"/>

  <figcaption>A Compound Promise</figcaption>
</figure>

In this tutorial, you will install and use a Compound Promise.

## Installing a Compound Promise {#write-a-compound-promise}

The Compound Promise you will install can be found on the Kratix repository,
under `samples/easy-app`. This Compound Promise encapsulate the Nginx
and the Postgres Promises.

Compound Promises work by including, in their list of Dependencies, other
Promises. Those Promises need to be scheduled to the platform cluster itself.
That means you will need to include the platform cluster to the list of clusters
where workloads can be scheduled to.

### Validate the state of your platform cluster

Before jumping in, verify that Kratix is still up and running on your platform cluster:

```bash
kubectl --context $PLATFORM get pods --namespace kratix-platform-system
```

The above command will give an output similar to:
```shell-session
NAME                                                  READY   STATUS    RESTARTS   AGE
kratix-platform-controller-manager-7cc49f598b-zqkmz   2/2     Running   0          4h4m
minio-6f75d9fbcf-jpstv                                1/1     Running   0          4h4m
```

If the command above display a different output, please refer back to previous
guides.


### Register the platform as a worker

To register the platform cluster as an available worker cluster, you will run
through the same steps you ran during the worker cluster registration in
[Installing a Promise](installing-a-promise):

* Install and configure Flux
* Register the cluster with Kratix

There's a script in the `kratix` directory that will do exactly that. Run:

```bash
./scripts/register-destination --name platform-cluster --context $PLATFORM --state-store minio-store
```

The platform cluster should now be registered with Kratix and ready to receive
the workloads. Verify:

```bash
kubectl --context $PLATFORM get destinations
```

The above command will give an output similar to:
```shell-session
NAME               AGE
platform-cluster    1m
worker-cluster      1h
```

You should also see a `kratix-worker-system` namespace, indicating that Flux is
correctly configured. Verify:

```bash
kubectl --context $PLATFORM get namespaces --watch
```

The above command will give an output similar to:
```shell-session
NAME                     STATUS   AGE
...
kratix-platform-system   Active    1h
//highlight-next-line
kratix-worker-system     Active    1m
...
```

Once you see `kratix-worker-system` on the output,
press <kbd>Ctrl</kbd>+<kbd>C</kbd> to exit the watch mode.

You are now ready to install the EasyApp Promise.

### Install the Promise

Ensure there's no other Promise currently installed:

```bash
kubectl --context $PLATFORM get promises
```

The above command will give an output similar to:
```shell-session
No resources found in default namespace.
```

:::note

If the Jenkins Promise is still showing up on your list, delete it before
continuing:

```bash
kubectl --context $PLATFORM delete promise jenkins
```

:::

<figure class="diagram">
  <PavedPathDiagram className="small"/>

  <figcaption>EasyApp Promise</figcaption>
</figure>

Since the EasyApp Promise declares two other Promises as its Dependencies,
installing it will add a total of three Promises to the platform:

* The EasyApp Promise itself
* Its Dependencies: NGINX and PostgreSQL

From the Kratix directory, install the EasyApp Promise:

```bash
kubectl --context $PLATFORM apply --filename samples/easy-app/promise.yaml
```

Validate the three Promises are now available:

```bash
kubectl --context $PLATFORM get promises
```

The above command will give an output similar to:
```shell-session
NAME       AGE
easyapp    1m
```

Something is not quite right. You expected three Promises, but only one was
actually installed. Check the Kratix Controller Manager logs for insights on
what is happening:

```bash
kubectl --context $PLATFORM --namespace kratix-platform-system \
 logs deployment/kratix-platform-controller-manager \
 --container manager | grep "Reconciler error"
```

The above command will give an output similar to:
```yaml
# output formatted for readability
ERROR    Reconciler error {
  "Work": {"name":"easyapp","namespace":"kratix-platform-system"},
  "error": "no Destinations can be selected for scheduling"
}
```

Kratix is failing to reconcile since _no Destination can be selected for
scheduling_. Promises can specify scheduling logic to determine the
suitable Destinations for hosting Dependencies and workloads. Check what
destination selectors have been defined for the EasyApp Promise:

```bash
kubectl --context $PLATFORM describe promise easyapp | tail -n 20 | \
  grep "Destination Selectors" --after-context 2 --max-count 1
```

The above command will give an output similar to:
```shell-session
Destination Selectors:
  Match Labels:
    Environment: platform
```

This means the EasyApp Promise is telling Kratix:

> Only install my Dependencies (i.e., the NGINX and the PostgreSQL Promises) in
> Destinations with the **label environment=platform**.

Check the registered Destinations again, but this time ask `kubectl` to also show
the Destination labels:

```bash
kubectl --context $PLATFORM get destinations --show-labels
```

The above command will give an output similar to:
```shell-session
NAME               AGE   LABELS
platform-cluster   10m   <none>
worker-cluster      1h   environment=dev
```

<figure class="diagram">
  <InstallErrorDiagram className="large"/>

</figure>

Note that the platform cluster is missing the required label. Adding the missing
label should cause the system to converge to the desired state:

```bash
kubectl --context $PLATFORM label destination platform-cluster environment=platform; \
kubectl --context $PLATFORM get promises --watch
```

The above command will give an output similar to:
```shell-session
cluster.platform.kratix.io/platform-cluster labelled
NAME            AGE
easyapp         10m
nginx-ingress    0s
postgresql       0s
...
```

Once you see the expected three Promises, press <kbd>Ctrl</kbd>+<kbd>C</kbd> to
exit the watch mode.

<figure class="diagram">
  <InstallationPlatformDiagram/>
  <figcaption>Sequence of events during the installation of a Compound Promise</figcaption>
</figure>

Once the sub-Promises are installed, their Dependencies will be scheduled to a
Destination. The EasyApp sub-Promises are also declaring a cluster Selector.
Verify:

```bash
kubectl --context $PLATFORM describe promise nginx-ingress |  grep "Destination Selectors:" -A 2 -m 1
kubectl --context $PLATFORM describe promise postgresql | grep "Destination Selectors:" -A 2 -m 1
```

The above command will give an output similar to:
```shell-session
Destination Selectors:
  Match Labels:
    Environment: dev
```

The NGINX and the PosgreSQL Promises are telling Kratix:

> Only install my Dependencies (which include, the NGINX Ingress Controller and the
> PostgreSQL operator) in Destinations with the **label environment=dev**.

As you may have noted before, the worker cluster is already labelled correctly.
Verify:

```bash
kubectl --context $PLATFORM get destination worker-cluster --show-labels
```

The above command will give an output similar to:
```shell-session
NAME               AGE   LABELS
worker-cluster      1h   environment=dev
```

Since the worker Destination include the label, the NGINX and PostgreSQL Promise
Dependencies should be getting installed into the worker cluster. Verify:

```bash
kubectl --context $WORKER get deployments --watch
```

The above command will give an output similar to (it may take a few minutes for
it to appear and to start):

```shell-session
NAME                  READY   UP-TO-DATE   AVAILABLE   AGE
nginx-nginx-ingress   1/1     1            1           1m
postgres-operator     1/1     1            1           1m
```

When the deployments eventually complete, press <kbd>Ctrl</kbd>+<kbd>C</kbd> to
exit.

<figure class="diagram">
  <InstallationCompleteDiagram />

  <figcaption>Full sequence of events during the installation of the Compound Promise</figcaption>
</figure>

Platform users can go ahead and start using the Promises!

:::info Managing a Fleet of Destinations

The mechanism described above is one of the most powerful features in Kratix:
the ability platform teams have to fully control the scheduling of works across
Destinations.

When a Destination is registered, Kratix will use the destination selectors to
determine what should be immediately installed on the new Destination. When a
Promise gets updated or upgraded, its Dependencies are seamlessly propagated
across the fleet. If a Destination labels change, Kratix will automatically converge
on the expected system state.

If you are curious to learn more about Kratix scheduling, check the
[Multi-cluster Management](../main/reference/multicluster-management) docs.

:::


## Request an EasyApp

As a platform user, you now have a few choices of Promises. Verify the available
Promises:

```bash
kubectl --context $PLATFORM get promises
```

The above command will give an output similar to:
```shell-session
NAME            AGE
nginx-ingress   1h
easyapp         1h
postgresql      1h
```

You could request each one of those services individually if you need
fine-grained control of how they ought to be deployed, or you can use the
EasyApp Promise to get an opinionated deployment of each of those. In this
example, don't really care about the details; all you want is to run your
application.

Create a request for a new EasyApp Resource:

```yaml
cat <<EOF | kubectl --context $PLATFORM apply --filename -
---
apiVersion: example.promise.syntasso.io/v1
kind: EasyApp
metadata:
  name: example
  namespace: default
spec:
  name: todo
  image: syntasso/sample-todo-app:v0.1.2
  dbDriver: postgres
EOF
```

The above command will give an output similar to:
```shell-session
easyapp.example.promise.syntasso.io/example created
```

The EasyApp Promise will take that request and generate the necessary
requests for the sub-Promises, wiring up the application to the Postgres
service.


<figure class="diagram">
  <PipelineDiagram className="large"/>

  <figcaption>EasyApp Workflow execution; NGINX omitted from brevity</figcaption>
</figure>

Verify the Workflows running on the platform cluster:


```bash
kubectl --context $PLATFORM get pods --watch
```

The above command will give an output similar to:
```shell-session
NAME                                        READY   STATUS      RESTARTS   AGE
configure-pipeline-nginx-default-22ee9        0/1     Completed   0          18s
configure-pipeline-easyapp-default-8769b      0/1     Completed   0          40s
configure-pipeline-postgresql-default-c3516   0/1     Completed   0          18s
```

Once the Status column reports `Complete`, press <kbd>Ctrl</kbd>+<kbd>C</kbd> to
exit the watch mode.

Similar to last time, Kratix will store the Pipeline outputs (i.e. the desired
state) in the State Store for the worker cluster, and that will be picked up by
the GitOps toolkit running on the worker.

Verify that the requested pods start on the worker cluster (it may take a few
minutes):

```bash
kubectl --context $WORKER get pods --watch
```

The above command will give an output similar to:
```shell-session
NAME                                   READY   STATUS    RESTARTS   AGE
#highlight-next-line
acid-todo-postgresql-0                 1/1     Running   0          110s
nginx-nginx-ingress-58c4dcb47d-49fd8   1/1     Running   0          10m
postgres-operator-79754946d-nmkhr      1/1     Running   0          10m
#highlight-next-line
todo-84f6b6698-vqxqm                   1/1     Running   0          74s
```

Once you see the `todo` and the `acid-todo-postgresql-0` pods reporting `Ready
1/1`, press <kbd>Ctrl</kbd>+<kbd>C</kbd> to exit the watch mode.

The app is now fully deployed! You can now access it on
[http://todo.local.gd:31338/](http://todo.local.gd:31338/).

## 🎉 Congratulations

You have installed a Compound Promise and created an _EasyApp_ Resource!

✅&nbsp;&nbsp;This tutorial concludes the Introduction to Kratix. <br />
👉🏾&nbsp;&nbsp;You can go ahead and start the next module to learn [how to write your own
Promises](part-ii/intro) or jump to [What's next](whats-next) to learn about
what else you can achieve with Kratix.
