---
description: Learn about how Compound Promises can deliver complete developer experiences
title: "Section C: Using Compound Promises"
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
👈🏾 Previous: [Install a Kratix Promise](installing-a-promise) <br />
👉🏾 Next: [Part II](part-ii/intro)

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
services, and it should be possible to get the specialised ones. You decide to
provide each of the individual services as a Promise. Specialist teams can then
use the API to get the exact service they need.

To deliver the simpler experience though, you want to orchestrate those Promises
in a higher-level Promise. In Kratix terms, this is a Compound Promise: a
Promise that defines other Promises as its Dependencies.

<figure className="diagram">
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
```

If the command above does not include a ready kratix-platform-controller-manager,
please refer back to previous guides.

### Register the platform as a Destination

To install a Compound Promises, the first step is to register the platform cluster
itself as an available Destination.
That's because the Dependencies for the Compound Promises are Promises themselves,
therefore they need to be scheduled to the platform cluster.

To register the platform cluster as an available Destination, you will run
through similar steps you ran during the worker cluster Destination registration:

* Install and configure Flux
* Register the cluster as a Destination with Kratix

There's a script in the `kratix` directory that will do exactly that. This
script includes the same [Destination
setup](./installing-kratix#destination-setup) steps you performed previously.
Run:

```bash
./scripts/register-destination --name platform-cluster --context $PLATFORM --state-store default --strict-match-labels --with-label environment=platform
```

The platform cluster should now be registered with Kratix and ready to receive
the workloads. Verify:

```bash
kubectl --context $PLATFORM get destinations
```

The above command will give an output similar to:

```shell-session
NAME               READY
platform-cluster   True
worker-cluster     True
```

Similar to when you registered the worker cluster, you should also see a `kratix-worker-system` namespace, indicating that Flux is correctly configured. Verify with:

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

I've successfully registered the platform cluster as a Kratix Destination.
We are now ready to install the compound Promise.

### Install the Promise

Since the EasyApp Promise declares two other Promises as its Dependencies,
installing it will add a total of three Promises to the platform:

* The EasyApp Promise itself
* The EasyApp Promise dependencies: NGINX and PostgreSQL

<figure className="diagram">
  <PavedPathDiagram className="small"/>

  <figcaption>EasyApp Promise</figcaption>
</figure>

From the Kratix directory, install the EasyApp Promise:

```bash
kubectl --context $PLATFORM apply --filename samples/easy-app/promise.yaml
```

Validate the EasyApp promises are successfully installed:

```bash
kubectl --context $PLATFORM get promises --watch
```

The above command will eventually include the following output:

```shell-session
easyapp   Unavailable   EasyApp   example.promise.syntasso.io/v1
easyapp   Unavailable   EasyApp   example.promise.syntasso.io/v1
easyapp   Unavailable   EasyApp   example.promise.syntasso.io/v1
easyapp   Available     EasyApp   example.promise.syntasso.io/v1
```

Once the EasyApp promise becomes "Available", you should see the sub-Promises
getting automatically installed. If you haven't killed the watch command, you
should see the following output appearing:

```shell-session
nginx-ingress
postgresql
nginx-ingress   Unavailable   deployment   marketplace.kratix.io/v1alpha1
postgresql      Unavailable   postgresql   marketplace.kratix.io/v1alpha1
...
nginx-ingress   Available     deployment   marketplace.kratix.io/v1alpha1
postgresql      Available     postgresql   marketplace.kratix.io/v1alpha1
```

Once all promises are "Available", press <kbd>Ctrl</kbd>+<kbd>C</kbd> to
exit the watch mode.

The dependencies for the sub-Promises, on the other hands, are installed on the Worker
destination. You can validate that by checking the deployments on the Worker:

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

When the deployments eventually complete, press <kbd>Ctrl</kbd>+<kbd>C</kbd> to exit.

## Understanding Destination Selectors

You may be asking yourself: how did Kratix know it should install the
sub-promises on the Platform cluster? And how did it know to install the NGINX
and the PostgreSQL Promises dependencies on the Worker cluster?

The answer is: **Destination Selectors**.

Destination Selectors are a powerful feature in Kratix that allows Promises to
specify where their dependencies and resources should be scheduled to. Similar
to how Kubernetes uses labels to select resources, Kratix uses Destination
Selectors to select Destinations.

You can verify the EasyApp Destination Selectors by describing the Promise:

```bash
kubectl --context $PLATFORM describe promise easyapp | tail -n 50 | \
  grep "Destination Selectors" --after-context 2 --max-count 1
```

The above command will give an output similar to:

```shell-session
Destination Selectors:
  Match Labels:
    Environment: platform
```

This tells Kratix:

> Only install the EasyApp Dependencies (i.e., the NGINX and the PostgreSQL
> Promises) in Destinations with the **label environment=platform**.

So, on the Platform Destination, you should have a label `environment=platform`. Verify:

```bash
kubectl --context $PLATFORM get destination platform-cluster --show-labels
```

The above command will give an output similar to:

```shell-session
NAME               AGE   LABELS
platform-cluster    1h   environment=platform
```

<figure className="diagram">
  <InstallationPlatformDiagram/>
  <figcaption>Sequence of events during the installation of a Compound Promise</figcaption>
</figure>

That explains why the NGINX and the PostgreSQL Promises were installed on the
Platform cluster. But how did the dependencies of those Promises end up on the
Worker cluster?

Once again, Destination Selectors are the answer. Check the destination
selectors defined in the NGINX and the PostgreSQL Promises:

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

The NGINX and the PostgreSQL Promises are telling Kratix:

> Only install my Dependencies (which include, the NGINX Ingress Controller and the
> PostgreSQL operator) in Destinations with the **label environment=dev**.

Similarly, if you check the Worker Destination, you should see the label
`environment=dev`:

```bash
kubectl --context $PLATFORM get destination worker-cluster --show-labels
```

The above command will give an output similar to:

```shell-session
NAME               AGE   LABELS
worker-cluster      1h   environment=dev
```

The entire installation process is summarised in the diagram below:

<figure className="diagram">
  <InstallationCompleteDiagram />

  <figcaption>Full sequence of events during the installation of the Compound Promise</figcaption>
</figure>


:::info Managing a Fleet of Destinations

The mechanism described above is one of the most powerful features in Kratix:
the ability platform teams have to fully control the scheduling of works across
Destinations.

When a Destination is registered, Kratix will use the destination selectors to
determine what should be immediately installed on the new Destination. When a
Promise gets updated or upgraded, its Dependencies are seamlessly propagated
across the fleet. If a Destination's labels change, Kratix will automatically converge on the expected system state.

If you are curious to learn more about Kratix scheduling, check the
[Multi-cluster Management](../main/reference/destinations/multidestination-management) docs.

:::

Your Platform is now ready to deploy EasyApps!

## Request an EasyApp

As a platform user, you now have a few choices of Promises. Verify the available
Promises:

```bash
kubectl --context $PLATFORM get promises
```

The above command will give an output similar to:

```shell-session
NAME            STATUS      KIND         API VERSION                      VERSION
easyapp         Available   EasyApp      example.promise.syntasso.io/v1
nginx-ingress   Available   deployment   marketplace.kratix.io/v1alpha1
postgresql      Available   postgresql   marketplace.kratix.io/v1alpha1
```

You could request each one of those services individually if you needed
fine-grained control of how they ought to be deployed, or you can use the
EasyApp Promise to get an opinionated deployment of each of those. In this
example, all you want is to run your application without much fuss.

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

<figure className="diagram">
  <PipelineDiagram className="large"/>

  <figcaption>EasyApp Workflow execution; NGINX omitted from brevity</figcaption>
</figure>

Verify the Workflows running on the platform cluster:

```bash
kubectl --context $PLATFORM get pods --watch
```

The above command will give an output similar to:

```shell-session
NAME                                                       READY   STATUS      RESTARTS   AGE
kratix-easyapp-example-instance-configure-43a5e-x7sdg      0/1     Completed   0          45s
kratix-nginx-ingress-todo-instance-configure-0907d-8zs5m   0/1     Completed   0          13s
kratix-postgresql-todo-instance-configure-6b25f-chtj6      0/1     Completed   0          13s
```

Once the Status column reports `Completed` for all three request pipelines,
press <kbd>Ctrl</kbd>+<kbd>C</kbd> to exit the watch mode. It may take a few
seconds for the Postgres and Nginx pipelines to start.

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

:::note

It will take a couple of minutes for the Todo App to start, and it may cycle through
a few states, including _Error_, before it eventually succeeds.

:::

Once you see the `todo` and the `acid-todo-postgresql-0` pods reporting `Ready
1/1`, press <kbd>Ctrl</kbd>+<kbd>C</kbd> to exit the watch mode.

The app is now fully deployed! You can now access it on
[http://todo.local.gd:31338/](http://todo.local.gd:31338/).

## Clean up

Delete the EasyApp Promise:

```bash
kubectl --context $PLATFORM delete promise easyapp
```

The above command will give an output similar to:

```shell-session
promise.platform.kratix.io "easyapp" deleted
```

## 🎉 Congratulations

You have installed a Compound Promise and created an _EasyApp_ Resource!

✅&nbsp;&nbsp;This tutorial concludes the Introduction to Kratix. <br />
👉🏾&nbsp;&nbsp;You can go ahead and start the next module to learn [how to write your own
Promises](part-ii/intro) or jump to [What's next](whats-next) to learn about
what else you can achieve with Kratix.
