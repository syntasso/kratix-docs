---
description: Install a Promise on the Platform cluster, followed by the creation and registration of a new Worker cluster
title: Installing a Promise
id: installing-a-promise
---

This is Part 2 of [a series](intro) illustrating how Kratix works. <br />
👈🏾&nbsp;&nbsp; Previous: [Install Kratix](installing-kratix) <br />
👉🏾&nbsp;&nbsp; Next: [Unpacking a Promise](promise-theory)

<hr />

**in this tutorial, you will**

* [learn what Promises are](#promise-definition)
* [install your first Kratix Promise](#install-jenkins)
* [learn about configuring a Worker cluster](#configure-worker)
* [request an instance of the Promised service](#request-jenkins)

Following the [Installing Kratix](installing-kratix) tutorial, you should now
have a deployment of both Kratix and MinIO running on your Platform cluster:

```shell-session
$ kubectl --context kind-platform get deployments --namespace kratix-platform-system
NAME                                 READY   UP-TO-DATE   AVAILABLE   AGE
kratix-platform-controller-manager   1/1     1            1           1h
minio                                1/1     1            1           1h
```

You should also have a State Store created and configured to point to the
`kratix` bucket on MinIO:

```shell-session
$ kubectl --context kind-platform get bucketstatestores.platform.kratix.io
NAME          AGE
minio-store   1h
```

:::tip

You can run

```bash
kubectl --context kind-platform \
   describe bucketstatestore minio-store
```

to check the configuration parameters.

:::

With that, you have all the pieces you need to install your first Promise!

## What's a Promise? {#promise-definition}

A Promise is the building block that Kratix provides to enable Platform teams to
build their platforms incrementally. Promises are what allow the Platform to
provide anything-as-a-Service, and are composed of mainly three pieces:

* A set of dependencies that needs to be installed on any Worker cluster
  intending to run the Promise workload.
* An API exposing to the user of the Platform the configuration options they
  have when requesting the service provided by the Promise.
* A series of steps that need to be executed to fulfill the Promise and create
  the service.

<details>
   <summary>🤔 How's that different from Helm? Or Crossplane? Or... </summary>

   Kratix positions itself as a framework for building Platforms. Instead of
   thinkins *Kratix or X*, think **Kratix and X**. The team has written
   extensively on how Kratix can work together with other Kubernetes tools.
   Please check [The Value of
   Kratix](https://kratix.io/docs/main/value-of-kratix#collaboration-with-other-tools)
   for details.

</details>

In the [next section](promise-theory), we'll unpack what's inside a Promise and explain the theory
behind it.

## Provide Jenkins-as-a-Service {#install-jenkins}

In this tutorial, we will provide Jenkins-as-a-Service in the Platform, making
it available on-demand for the developers using it.

Kratix publishes an array of ready-to-use Promises in the [Kratix
Marketplace](/marketplace). There's a Jenkins Promise that we can leverage to
fulfill this task. Following the [Promise
documentation](https://github.com/syntasso/kratix-marketplace/tree/main/jenkins),
we can run the installation steps:

```bash
kubectl apply \
   --context kind-platform \
   --filename https://raw.githubusercontent.com/syntasso/kratix-marketplace/main/jenkins/promise.yaml
```

And that's it! Promise installed!

However, if you look closely, the Kratix controller should be complaining:

```shell-session
$ kubectl --context kind-platform --namespace kratix-platform-system \
   logs deployment/kratix-platform-controller-manager \
   --container manager

   # output formatted for readability
   ERROR	Reconciler error {
        "Work": {"name":"jenkins-default","namespace":"default"},
        "error": "no Clusters can be selected for clusterSelector"
   }
```

When Kratix receives a new request, being it the installation of a Promise or
the request of a promised service, it creates a new Work. You can see the
created works with:

```shell-session
$ kubectl get works.platform.kratix.io
NAME              AGE
jenkins-default   1h
```

Once a Work is created, the Kratix Schedules kicks in and tries to determine to
which registered Cluster should that work be placed. However, as it stands, we
haven't told Kratix about where it can run the workloads:

```shell-session
$ kubectl --context kind-platform get clusters.platform.kratix.io --all-namespaces
No resources found
```

Let's fix that.

## Set up a Worker Cluster {#configure-worker}

### Create the cluster

We'll create a second Kubernetes cluster with `kind`, and this cluster will be
dedicated to running the Kratix workloads:

```bash
# make sure you are still in the "kratix" directory
kind create cluster --name worker \
    --image kindest/node:v1.24.0 \
     --config hack/worker/kind-worker-config.yaml
```

Similar to when we created the Plaform cluster, `kind` will update your local
configuration with the details to access the worker cluster. We are also
providing `kind` with a configuration file to facilitate accessing the services
later on.

Once the creation completes, you should be able to reach your worker cluster on
the `kind-worker` context:

```shell-session
$ kubectl --context kind-worker cluster-info
Kubernetes control plane is running at https://127.0.0.1:YYYYY
CoreDNS is running at https://127.0.0.1:59160/api/v1/...

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
```

Before registering the Worker cluster with the Platform, let's make it ready to
receive the Works.

### Configure the cluster

Kratix schedules work by writing the documents to the appropriate State Store.
For reconciliation of the declared state, Kratix does not hold an opinion on
what tool you should use on the clusters.

In this tutorial, we will use [Flux](https://fluxcd.io/) on the Worker, and
configure it to reconcile the state from the MinIO bucket.

Let's start by installing Flux itself on the Worker:

```bash
kubectl apply \
   --context kind-worker \
   --filename https://github.com/fluxcd/flux2/releases/download/v2.0.0-rc.3/install.yaml
```

Next, let's tell Flux about the MinIO bucket. For that, we will create a new
Flux [Bucket Source](https://fluxcd.io/flux/components/source/buckets/),
together with a Secret containing the bucket credentials:

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
  endpoint: 172.18.0.2:31337
  insecure: true
  secretRef:
    name: minio-credentials
EOF
```

:::caution

You may have noticed that we set the value of the Bucket `endpoint` to
`172.18.0.2:31337`. Since the MinIO server is running on a separate cluster, we
cannot leverage Kubernetes DNS as we did in the previous tutorial.

`172.18.0.2` is often the address of the Docker running on your machine. Please
make sure to double check this address:

```shell-session
$ docker inspect platform-control-plane | grep '"IPAddress": "172' | awk -F '"' '{print $4}'
172.18.0.2
```

If the command above outputs a different IP, make sure to update the
Bucket configuration accordingly.

The port part of the endpoint should always be 31337. You can double-check by
checking the NodePort of the MinIO service in the Platform cluster:

```shell-session
$ kubectl --context kind-platform get services minio --namespace kratix-platform-system
NAME    TYPE       CLUSTER-IP    EXTERNAL-IP   PORT(S)        AGE
minio   NodePort   10.96.45.28   <none>        80:31337/TCP   1h
```

:::

We won't dive into details of how to configure Flux Sources, but please read on their
[documentation](https://fluxcd.io/flux/components/source/) if you are curious.

Once the Bucket Source is created, you can validate the configuration by running:

```shell-session
$ kubectl --context kind-worker get buckets.source.toolkit.fluxcd.io --namespace flux-system
NAME            ENDPOINT           AGE     READY   STATUS
kratix-bucket   172.18.0.2:31337   1h      True    stored artifact: revision 'sha256:some-sha'
```

Next, you must tell Flux what is must do with this Source. Flux does continue
delivery through the [Kustomize
Controller](https://fluxcd.io/flux/components/kustomize/). You can define a
Flux `Kustomization` that watches for a Source and reconciles on events. Let's
go ahead and define the Kustomizations:

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

We won't dive into details of how to configure [Flux
Kustomizations](https://fluxcd.io/flux/components/kustomize/kustomization/)
(check the Kustomization docs if you are curious), but there's a few parameters
it's worth explaining.

You will notice that we are creating two Kustomizations. When scheduling
Works, Kratix will separate the documents based on their GVK (Group, Version,
Kind):

* Custom Resource Definition (as defined
  [here](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.27/#customresourcedefinition-v1-apiextensions-k8s-io))
  will be written to a specific `crds` path within the State Store.
* All other documents will be written to a specific `resources` path within the
  State Store.

When we later on register the Cluster with Kratix, it will have both a
`namespace` and a `name`. Those two properties determine the full path within
the State Store for the Kratix documents.

The first Kustomization above is for the CRDs, while the second is for the other
resources (note the `spec.path`). You can also note that the
`kratix-workload-resources` depends on the `kratix-workload-crds`. That's to
avoid failures when a resource documents uses a GVK being defined by a CRD
document.

For further details on the naming convention for the buckets and paths, check
the [documentation](../main/reference/statestore/intro).

If you try to list the Kustomizations at this point, you should see the
following message on Status:

```shell-session
$ kubectl --context kind-worker get kustomizations.kustomize.toolkit.fluxcd.io --namespace flux-system
NAME                        AGE   READY   STATUS
kratix-workload-crds        20s   False   kustomization path not found: stat /tmp/kustomization-540356764/default/worker-cluster/crds: no such file or directory
kratix-workload-resources   20s   False   dependency 'flux-system/kratix-workload-crds' is not ready
```

That's because the path within the bucket does not yet exist. As mentioned,
Kratix will create it when the cluster is registered.

### Register the cluster with Kratix

With the Worker cluster ready, we can now register it with Kratix. Note that we
could've registered the cluster first, and then configured the Worker
cluster&mdash;Kratix has no expectation that there's an actual cluster acting on
the declaration of states it makes.

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

<details>
<summary>Cluster in details</summary>

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
If you fetch the WorkPlacements, you should see that the Jenkins Promise has now
been scheduled to the Worker cluster:

```shell-session
$ kubectl --context kind-platform get workplacements.platform.kratix.io
NAME                             AGE
jenkins-default.worker-cluster   1h
```

That means that all the dependencies the Jenkins Promise needs to fulfill a
Jenkins request are now penciled to be installed in the Worker cluster. One of
the dependencies for the Jenkins Promise is the Jenkins Operator itself. You can
verify that the Jenkins Operator is starting up by fetching the deployments in
the Worker cluster (it may take a couple of minutes for it to appear):

```shell-session
$ kubectl --context kind-worker get deployments
NAME               READY   UP-TO-DATE   AVAILABLE   AGE
jenkins-operator   1/1     1            1           1h
```

If at this stage we create another Kubernetes cluster and follow similar steps
as the above, the Jenkins Promise dependencies would also be installed on the
new Worker cluster. We will later on see how we can nudge Kratix to only make
certain Promises available in certain clusters.

Great! The Jenkins Promise installation is now complete. Let's switch roles for
a moment and become the developer requesting a new Jenkins instance.

## Request a Jenkins Instance {#request-jenkins}

As a user of the Platform, you can find out what's available by checking the
installed Promises:


```shell-session
$ kubectl --context kind-platform get promises.platform.kratix.io
NAME      AGE
jenkins   1h
```

To request a Jenkins instance, all you need is to send a new Jenkins Resource
Request to the Platform:

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

When writing the Resource Request, the Platform user will have all the
configuration options exposed to them as part of the Promise API, as defined by
the Platform team. The Jenkins Promise we are using is exposing a single
configuration option: `spec.env` (see the [Jenkins Promise
documentation](https://github.com/syntasso/kratix-marketplace/tree/main/jenkins)).
When set to `prod`, the resulting instance will have backups enabled.

Once Kratix receives the request, it will create a new Work (it may take a
couple of minutes):

```shell-session
$ kubectl --context kind-platform get works.platform.kratix.io
NAME                              AGE
jenkins-default                   1h
//highlight-next-line
jenkins-default-default-example   1m
```

Once the Work is created, Kratix will look for available clusters and determine
where the Workload should be scheduled. As we only have on cluster registered,
it will be scheduled to that cluster:

```shell-session
$ kubectl --context kind-platform get workplacements.platform.kratix.io
NAME                                               AGE
//highlight-next-line
jenkins-default-default-example.worker-cluster     1m
jenkins-default.worker-cluster                     1h
```

Kratix will then write the documents to the directory within the bucket that the
Worker cluster is watching. You will soon see the Jenkins instance pod starting
up on the Worker cluster (it may take a couple of minutes):

```shell-session
$ kubectl --context kind-worker get pods
NAME                                READY   STATUS    RESTARTS   AGE
//highlight-next-line
jenkins-dev-example                 0/1     Running   0          1m
jenkins-operator-7f58798d5c-sr825   1/1     Running   0          1h
```

When the `Ready` column reports `1/1` for `jenkins-dev-example` (it may take a
few minutes since Jenkins takes a while to actually start), your Jenkins
instance is fully deployed and ready to be accessed!

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
