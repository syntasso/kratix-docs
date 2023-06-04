---
description: Create and configure a Worker cluster, and install a Promise
title: Installing a Promise
id: installing-a-promise
slug: ../installing-a-promise
---

This is Part 2 of [a series](intro) illustrating how Kratix works. <br />
👈🏾&nbsp;&nbsp; Previous: [Install Kratix](installing-kratix) <br />
👉🏾&nbsp;&nbsp; Next: [Unpacking a Promise](promise-theory)

<hr />

**in this tutorial, you will**

- [learn what Promises are](#promise-definition)
- [install your first Kratix Promise](#install-jenkins)
- [learn about configuring a Worker cluster](#configure-worker)
- [request an instance of the Promised service](#request-jenkins)

Following the [Installing Kratix](installing-kratix) tutorial, you should now
have a deployment of both Kratix and MinIO running on your Platform cluster.
Verify the current state of your installation:

```bash
kubectl --context kind-platform get deployments --namespace kratix-platform-system
```

The above command will give an output similar to:

```shell-session
NAME                                 READY   UP-TO-DATE   AVAILABLE   AGE
kratix-platform-controller-manager   1/1     1            1           1h
minio                                1/1     1            1           1h
```

You should also have a State Store created and configured to point to the
`kratix` bucket on MinIO. Verify the `bucketstatestores`:

```bash
kubectl --context kind-platform get bucketstatestores.platform.kratix.io
```

The above command will give an output similar to:
```shell-session
NAME          AGE
minio-store   1h
```

:::tip

To check the configuration parameters, run:

```bash
kubectl --context kind-platform \
   describe bucketstatestore minio-store
```

:::

If your outputs do not align with the expected, please refer back to
[Installing Kratix](installing-kratix).

With that, you have all the pieces you need to install your first Promise!

## What's a Promise? {#promise-definition}

A Promise is the building block that Kratix provides to enable Platform teams to
build their platforms incrementally. Promises are what allow the Platform to
provide anything-as-a-Service, and are composed of mainly three pieces:

- A set of dependencies that needs to be installed on any Worker cluster
  intending to run the Promise workload.
- An API exposing to the user of the Platform the configuration options they
  have when requesting the service provided by the Promise.
- A series of steps that need to be executed to fulfill the Promise and create
  the service.

<details>
   <summary>🤔 How's that different from Helm? Or Crossplane? Or... </summary>

Kratix positions itself as a framework for building Platforms. Instead of
thinkins _Kratix or X_, think **Kratix and X**. The team has written
extensively on how Kratix can work together with other Kubernetes tools.
Please check [The Value of
Kratix](https://kratix.io/docs/main/value-of-kratix#collaboration-with-other-tools)
for details.

</details>

### Promise Architecture

```mdx-code-block
import PromiseDiagram from "/img/docs/workshop/promise-diagram.svg"
```

<figure class="diagram">
  <PromiseDiagram className="medium"/>

  <figcaption>A Promise in details</figcaption>
</figure>

At a very high-level, a Promise is made up of four parts:

1. **The Promise API:** The Promise API is what the users of the Platform will
   interact with when requesting a new instance of the Promised Service
2. **The Imperative Pipeline:** A series of containers where Platform teams can
   codify all of their business requirements.
3. **The Declarative State:** The pipeline executes a series of *imperative*
   steps top generate a *declarative state* that's then persisted into the State
   Store. Other systems will then *converge* on that state.
4. **The Dependencies**: A dependency is anything that must be installed or made
   available on Worker clusters to enable the promised service to run.

As you go through installing and using the Promise, we will unpack and highlight
the parts of the Promise you are interacting with.

## Provide Jenkins-as-a-Service {#install-jenkins}

This tutorial will focus on making Jenkins-as-a-Service available, on-demand,
for developers using the Platform. Kratix offers a variety of ready-to-use
Promises in the [Kratix Marketplace](/marketplace), including a Jenkins Promise.
You will utilise this Promise to complete this task. By following the [Promise
documentation](https://github.com/syntasso/kratix-marketplace/tree/main/jenkins),
you can find the installation steps.

Install the Jenkins Promise:

```bash
kubectl apply \
   --context kind-platform \
   --filename https://raw.githubusercontent.com/syntasso/kratix-marketplace/main/jenkins/promise.yaml
```

And that's it! Promise installed!

Once the Promise is installed, the Platform cluster is extended with a new API:
the Jenkins Promise API. This API teaches the Platform cluster how to deal with
requests for Jenkins instances.

```bash
kubectl --context kind-platform get crds | grep jenkins
```

The above command will give an output similar to:

```shell-session
jenkins.marketplace.kratix.io          2023-01-01T01:01:01Z
```

Kratix will also write to the State Store a declaration of state, informing any
Worker clusters they should install the Promise dependencies. For the Jenkins
Promise, the dependencies include the Jenkins Operator.

However, at this state, we have no Worker cluster.

<details>
<summary>🤔 What's a Worker Cluster?</summary>

In Kratix terms, a _Worker Cluster_ is any system _converging_ on the state
declared by Kratix.

It's important to note that Kratix makes no assumptions about the Worker cluster
themselves. Although Worker clusters are often Kubernetes clusters, they may be
any system that can interpret whatever state is being declared as desired.

For example, you may write a Promise that tells Kratix to declare Terraform
plans as desired state, and a Worker cluster may be a system applying these
plans as they are written to the State Store.

</details>

In fact, if you look closely, the Kratix controller will be complaining:

```yaml
kubectl --context kind-platform --namespace kratix-platform-system \
  logs deployment/kratix-platform-controller-manager \
  --container manager | grep "Reconciler error"
```

The above command will give an output similar to:
```shell-session
# output formatted for readability
ERROR	Reconciler error {
    "Work": {"name":"jenkins-default","namespace":"default"},
    "error": "no Clusters can be selected for clusterSelector"
}
```

This is Kratix telling you that it cannot find any Clusters that can get the
Jenkins Promise dependencies installed.

You can also verify the registered clusters:

```bash
kubectl --context kind-platform get clusters.platform.kratix.io --all-namespaces
```

The above command will give an output similar to:
```shell-session
No resources found
```

So, to fix the error, we must create and register a new Worker Cluster. Let's do that
now.

## Set up a Worker Cluster {#configure-worker}

### Create the cluster

You'll create a second Kubernetes cluster with `kind`, and this cluster will be
dedicated to running the Kratix workloads.

From the `kratix` directory, create a new cluster:

```bash
kind create cluster --name worker \
    --image kindest/node:v1.24.0 \
     --config config/samples/kind-worker-config.yaml
```

Similar to when we created the Plaform cluster, `kind` will update your local
configuration with the details to access the worker cluster. We are also
providing `kind` with a configuration file to facilitate accessing the deployed
services later on.

Once the creation completes, you can reach your worker cluster on the
`kind-worker` context.

Verify the cluster is ready:

```bash
kubectl --context kind-worker cluster-info
```

The above command will give an output similar to:
```shell-session
Kubernetes control plane is running at https://127.0.0.1:YYYYY
CoreDNS is running at https://127.0.0.1:59160/api/v1/...

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
```

Before registering the Worker cluster with the Platform, let's make it ready to
receive the workloads.

### Configure the cluster

Kratix schedules works by writing a state declaration (following Kubernetes
declare-and-converge pattern) to the designated State Store. When it comes to
reconciling the declared state, Kratix remains agnostic about the specific tool
to be used on the clusters. In this tutorial, we will utilise
[Flux](https://fluxcd.io/) on the Worker, and configure it to reconcile the
state from the MinIO bucket.

To install and configure Flux, run the following script from the Kratix
repository:

```bash
./scripts/install-gitops --context kind-worker --path worker-cluster
```

The script above will:

* Install Flux
* Create a new Flux `Bucket` Source
* Create two Flux `Kustomizations`

The Flux `Kustomizations` are responsible for continuously reconciling with the state
declared in the `Source`.

<details>
<summary>Configuring the Worker Cluster: the manual way</summary>

If you prefer to configure the Worker cluster manually, follow the steps below.

Install Flux on the Worker cluster:

```bash
kubectl apply \
   --context kind-worker \
   --filename https://github.com/fluxcd/flux2/releases/download/v2.0.0-rc.3/install.yaml
```

Next, let's tell Flux about the MinIO bucket. For that, we will create a new
Flux [Bucket Source](https://fluxcd.io/flux/components/source/buckets/),
together with a Secret containing the bucket credentials.

:::caution

You may notice that the value of the Bucket `endpoint` on the document below is
set to `172.18.0.2:31337`. Since the MinIO server is running on the Platform
cluster, and we want to access it from the Worker cluster, we cannot leverage
Kubernetes DNS as we did in the previous tutorial.

`172.18.0.2` will often be the address of the Platform cluster running on KinD.
Please make sure to double check this address.

Verify the Platform control-plane IP:

```bash
docker inspect platform-control-plane | grep '"IPAddress": "172' | awk -F '"' '{print $4}'
```

The above command will give an output similar to:
```shell-session
172.18.0.2
```

If the command above outputs a different IP, make sure to update the Bucket
configuration below accordingly.

The port part of the endpoint should always be 31337. Verify the NodePort of the
MinIO service in the Platform cluster:

```bash
kubectl --context kind-platform get services minio --namespace kratix-platform-system
```

The above command will give an output similar to:

```shell-session
NAME    TYPE       CLUSTER-IP    EXTERNAL-IP   PORT(S)        AGE
minio   NodePort   10.96.45.28   <none>        80:31337/TCP   1h
```

:::

Create the Flux Source Bucket (and Secret):

```yaml
cat <<EOF | kubectl --context kind-worker apply -f -
---
apiVersion: v1
kind: Secret
metadata:
  name: minio-credentials
  namespace: flux-system
type: Opaque
stringData:
  accesskey: minioadmin
  secretkey: minioadmin
---
apiVersion: source.toolkit.fluxcd.io/v1beta1
kind: Bucket
metadata:
  name: kratix-bucket
  namespace: flux-system
spec:
  interval: 10s
  provider: generic
  bucketName: kratix
  endpoint: 172.18.0.2:31337 # make sure to read the caution box above
  insecure: true
  secretRef:
    name: minio-credentials
EOF
```

The above command will give an output similar to:
```shell-session
secret/minio-credentials created
bucket.source.toolkit.fluxcd.io/kratix-bucket created
```

We won't dive into details of how to configure Flux Sources, but please read on their
[documentation](https://fluxcd.io/flux/components/source/) if you are curious.

Once the Bucket Source is created, validates Flux can reach the bucket:

```bash
kubectl --context kind-worker get buckets.source.toolkit.fluxcd.io --namespace flux-system
```

The above command will give an output similar to:
```shell-session
NAME            ENDPOINT           AGE     READY   STATUS
kratix-bucket   172.18.0.2:31337   1h      True    stored artifact: revision 'sha256:some-sha'
```

Next, you must tell Flux what is must do with this Source. Flux does continuous
delivery through the [Kustomize
Controller](https://fluxcd.io/flux/components/kustomize/). You can define a Flux
`Kustomization` that watches for a Source and reconciles on events.

Create the Flux Kustomizations:

```yaml
cat <<EOF | kubectl --context kind-worker apply --filename -
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: kratix-workload-crds
  namespace: flux-system
spec:
  interval: 8s
  prune: true
  sourceRef:
    kind: Bucket
    name: kratix-bucket
  path: ./default/worker-cluster/crds
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: kratix-workload-resources
  namespace: flux-system
spec:
  interval: 3s
  prune: true
  dependsOn:
  - name: kratix-workload-crds
  sourceRef:
    kind: Bucket
    name: kratix-bucket
  path: ./default/worker-cluster/resources
EOF
```

The above command will give an output similar to:
```shell-session
kustomization.kustomize.toolkit.fluxcd.io/kratix-workload-crds created
kustomization.kustomize.toolkit.fluxcd.io/kratix-workload-resources created
```

You will notice that we are creating two Kustomizations. When scheduling
Works, Kratix will separate the documents based on their GVK (Group, Version,
Kind):

- Custom Resource Definition (as defined
  [here](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.27/#customresourcedefinition-v1-apiextensions-k8s-io))
  will be written to a specific `crds` path within the State Store.
- All other documents will be written to a specific `resources` path within the
  State Store.

When we later on register the Cluster, Kratix will use the cluster's `namespace`
and `name` to build the full path for that cluster within the State Store.

The first Kustomization above is for the CRDs, while the second is for the other
resources (note the `spec.path`). You can also note that the
`kratix-workload-resources` depends on the `kratix-workload-crds`. That's to
avoid failures when a resource documents uses a GVK being defined by a CRD
document.

For further details on the naming convention for the buckets and paths, check
the [documentation](../main/reference/statestore/intro). For more on
Kustomizations, check [the Flux docs
page](https://fluxcd.io/flux/components/kustomize/kustomization/)

</details>

### Register the cluster with Kratix

With the Worker cluster ready, we can now register it with Kratix. Note that the
order of operations here is not important; we could've registered the Worker
first and then followed th steps above. Kratix would've scheduled to the State
Store path representing the Worker cluster, and the state would eventually be
applied to a Worker.

To register a cluster, create a `Cluster` object on your Platform cluster:

```yaml
cat <<EOF | kubectl --context kind-platform apply --filename -
apiVersion: platform.kratix.io/v1alpha1
kind: Cluster
metadata:
   name: worker-cluster
   namespace: default
   labels:
    environment: dev
spec:
   stateStoreRef:
      name: minio-store
      kind: BucketStateStore
EOF
```

The above command will give an output similar to:
```shell-session
cluster.platform.kratix.io/worker-cluster created
```

<details>
<summary>Cluster in detail</summary>

The Kratix Cluster Resource is the representation of a system where workloads
can be scheduled to. Those system are usually other Kubernetes clusters.

The only required field is `spec.stateStoreRef`. It contains a reference to a State
Store present in the Platform. In our example, it points to the `minio-store`
object we created on the previous step. The `spec.StateStoreRef.kind` determines
what is the kind of State Store being used by this Cluster.

That means different Clusters can use different backing storage. For example,
you can have a set of Clusters backed by Git, while another set of Clusters can
be backed by a Bucket. Further configuration options pertaining paths are also
available both in the [State Store](../main/reference/statestore/intro) and the
[Cluster object](../main/reference/clusters/intro).
</details>

With the Cluster registered, Kratix now have a place where it can run workloads.
That means that the Jenkins Promise dependencies will now be scheduled to the
Worker cluster. As previously mentioned, one of those dependencies is the
Jenkins Operator.


Verify that the Jenkins Operator starts in the Worker cluster:

```shell-session
kubectl --context kind-worker get deployments --watch
```

The above command will give an output similar to (it may take a couple of
minutes):

```shell-session
NAME               READY   UP-TO-DATE   AVAILABLE   AGE
jenkins-operator   0/1     0            0           0s
jenkins-operator   0/1     0            0           0s
jenkins-operator   0/1     0            0           0s
jenkins-operator   0/1     1            0           0s
jenkins-operator   1/1     1            1           11s
```

Once the jenkins-operator deployment is ready, press <kbd>Ctrl</kbd>+<kbd>C</kbd>
to exit the watch mode.

If at this stage we create another Kubernetes cluster and follow similar steps
as the above, the Jenkins Promise dependencies would also be installed on the
new Worker cluster. We will later on see how we can nudge Kratix to only make
certain Promises available in certain clusters.

Great! The Jenkins Promise installation is now complete. Let's switch roles for
a moment and become the developer requesting a new Jenkins instance.

## Request a Jenkins Instance {#request-jenkins}

As a user of the Platform, you can find out what's available by checking the
installed Promises:

```bash
kubectl --context kind-platform get promises.platform.kratix.io
```

The above command will give an output similar to:
```shell-session
NAME      AGE
jenkins   1h
```

To request a Jenkins instance, all you need is to send a new Jenkins Resource
Request to the Platform.

Create a Jenkins Instance:

```yaml
cat <<EOF | kubectl --context kind-platform apply --filename -
apiVersion: marketplace.kratix.io/v1alpha1
kind: jenkins
metadata:
  name: example
  namespace: default
spec:
  env: dev
EOF
```

The above command will give an output similar to:
```shell-session
jenkins.marketplace.kratix.io/example created
```

<details>
<summary>🤔 How do Platform users interact with the Promise API?</summary>

In this example, users are interacting with the API using the `kubectl`
directly. However, how users of your platform will, it's up to you.

For example, you could have a
[Backstage](https://www.syntasso.io/post/kratix-and-backstage-a-perfect-pair)
instance on top of the API to facilitate the creation of services. Similarly,
you can employ [Compass](https://www.syntasso.io/post/kratix-and-compass) as a
driving force for your Platform. Kratix can seamlessly integrate with various
systems such as GitOps Repositories, ticketing systems, or CI/CD tools.
</details>

When writing the Resource Request, the Platform user will have all the
configuration options exposed to them as part of the Promise API, as defined by
the Platform team. The Jenkins Promise we are using is exposing a single
configuration option: `spec.env` (see the [Jenkins Promise
documentation](https://github.com/syntasso/kratix-marketplace/tree/main/jenkins)).
When set to `prod`, the resulting instance will have backups enabled.

<details>
<summary>🤔 How's the Promise API determined?</summary>

The Promise API is fully defined by the Platform team. They have the choice to
hide complexity, making it easy for users to request new services.
Alternatively, they can offer users greater flexibility, allowing them to
fine-tune lower-level details of the Service or select the specific cluster
where the workload should run.
</details>

Once the request is created, Kratix will kick-off the Imperative Pipeline of the
Promise. The Jenkins Promise Pipeline is a very basic pipeline that transforms
the user's request into a Jenkins instance manifest.

However, Pipelines can do much more. It is within the Pipeline that you define
the business processes of your organisation, encapsulating the steps required to
deliver the promised service on-demand. Through Pipelines, Platform teams have the
flexibility to customise the Promise according to their specific business and
compliance requirements.

For instance, in an organization where all container images must undergo
vulnerability scanning, you can include a Snyk image in your Promise. Similarly,
if you wish to receive alerts for specific events, you can include a Slack
image.

Furthermore, the containers utilised in a pipeline are designed to be reusable.
This allows Platform teams to encode specific rules once and apply them
consistently across all services within the platform.

Verify the Jenkins Pipeline execution:

```bash
kubectl --context kind-platform get pods
```

The above command will give an output similar to:
```shell-session
NAME                                     READY   STATUS      RESTARTS   AGE
request-pipeline-jenkins-default-c726b   0/1     Completed   0          71s
```

Once the pipeline completes, Kratix will write the documents it outputted (i.e.
the declaration of state) to the directory within the bucket that the Worker
cluster is watching. You will soon see the Jenkins instance pod starting up on
the Worker cluster.

Verify the Jenkins instance is booting up:

```bash
kubectl --context kind-worker get pods --watch
```

The above command will give an output similar to:

:::note

It will take a couple of minutes for Jenkins to start, and it may cycle through
a few states, including _Terminating_, before it eventually succeeds.

:::

```shell-session
NAME                                READY   STATUS    RESTARTS   AGE
//highlight-next-line
jenkins-dev-example                 0/1     Running   0          1m
jenkins-operator-7f58798d5c-sr825   1/1     Running   0          1h
```

When the `Ready` column reports `1/1` for `jenkins-dev-example`, your Jenkins
instance is fully deployed and ready to be accessed! Press <kbd>Ctrl</kbd>+<kbd>C</kbd> to
exit the watch mode.

Go to [http://localhost:30269](http://localhost:30269) and check it out!

:::caution

If you gave your Jenkins a different name, you may need port-forwarding to
access the running instance:

```shell
kubectl --context kind-worker port-forward pod/jenkins-dev-<NAME> 8080:30269
```

:::

<details>
  <summary>🤔 Where are the Jenkins Credentials?</summary>

To login to Jenkins, you will need to fetch the credentials on the Worker
cluster:

```bash
kubectl get secrets --context kind-worker --selector app=jenkins-operator -o go-template='{{range .items}}{{"username: "}}{{.data.user|base64decode}}{{"\n"}}{{"password: "}}{{.data.password|base64decode}}{{"\n"}}{{end}}'
```

</details>

## Clean up

We won't be using the Jenkins or the Jenkins Promise anymore. So let's go ahead
and delete the resources.

Delete the Jenkins Promise:

```bash
kubectl --context kind-platform delete promise jenkins
```

The above command will give an output similar to:
```shell-session
promise.platform.kratix.io "jenkins" deleted
```

The delete command will also cascade-delete all traces of Jenkins from our
Platform, including the deployed Jenkins on the Worker cluster.

Verify that the Jenkins instance gets deleted:

```bash
kubectl get pods --context kind-worker
```

The above command will give an output similar to (it may take a few minutes):

```shell-session
No resources found in default namespace.
```

## Summary

To recap the steps we took:

1. ✅&nbsp;&nbsp;Installed the Jenkins Promise
1. ✅&nbsp;&nbsp;Created and configured a Worker cluster
1. ✅&nbsp;&nbsp;Registered the Worker cluster with the Platform
1. ✅&nbsp;&nbsp;Requested a Jenkins instance

## 🎉 &nbsp; Congratulations!

✅&nbsp;&nbsp;Your promise is now installed. <br />
👉🏾&nbsp;&nbsp;Next, let's learn more about th[e theory behind
Promises](promise-theory)
