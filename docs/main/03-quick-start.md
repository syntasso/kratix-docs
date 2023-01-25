---
description: Get Kratix up and running
---

# Quick Start

One of the most powerful features of Kratix is its ability to handle requests for
resources, and deploy them to a remote specific cluster. However, Kratix also works well
in a single cluster environment. This quick-start guide will walk you through the steps to
install Kratix on a single cluster.

## Prerequisite: Kubernetes Cluster

Kratix requires a Kubernetes cluster to run. If you don't already have a cluster, we
recommend starting with a local cluster tool like
[KinD](https://kind.sigs.k8s.io/docs/user/quick-start/) or
[minikube](https://minikube.sigs.k8s.io/docs/start/).

## 1. Install Kratix

Install Kratix and its dependencies with the command below:

```bash
kubectl apply --filename https://raw.githubusercontent.com/syntasso/kratix/main/distribution/single-cluster/install-all-in-one.yaml
```

The above will install Kratix, MinIO, and FluxCD. MinIO will be the repository for the
GitOps, while FluxCD will watch the repository for any changes that need to be applied to
the cluster. For production installations, both can be replaced with other tools and
technologies depending on your preference.

### Configure

Once Kratix is installed, you can register Kubernetes clusters where workloads should run.
On single cluster installations, the same cluster performs the role of the Platform and
the Worker clusters. The commands below will register the cluster, as well as configure
FluxCD to watch for the cluster's repository:

```bash
kubectl apply --filename https://raw.githubusercontent.com/syntasso/kratix/main/distribution/single-cluster/config-all-in-one.yaml
```

Once the system reconciles, the Kratix resources should now be visible on your
cluster. You can verify its readiness by observing the `kratix-worker-system` namespace
appearing in the cluster (it may take a couple of minutes):

```console
$ kubectl get namespace kratix-worker-system
NAME                   STATUS   AGE
kratix-worker-system   Active   1m
```

## 2. Provide Postgres-as-a-Service via a Kratix Promise

Install the sample Postgres Promise with the command below:

```bash
kubectl apply --filename https://raw.githubusercontent.com/syntasso/promise-postgresql/main/promise.yaml
```

Installing the Promise will eventually start the Postgres Operator on your cluster. You
can verify by running:

```console
kubectl get pods
```

It may take a few seconds, but you should eventually see something similar to:
```console
NAME                                 READY   STATUS    RESTARTS   AGE
postgres-operator-7dccdbff7c-2hqhc   1/1     Running   0          1m
```

## 3. Self serve a Postgres

Once the Postgres Operator is up and running, you can request a new Postgres instance with
the command below:

```console
kubectl apply --filename https://raw.githubusercontent.com/syntasso/promise-postgresql/main/resource-request.yaml
```

You can verify the pipeline pod by running:

```console
$ kubectl get pods
NAME                                                 READY   STATUS      RESTARTS   AGE
//highlight-next-line
request-pipeline-ha-postgres-promise-default-152bb   0/1     Completed   0          72s
postgres-operator-6c6dbd4459-pbcjp                   1/1     Running     0          6m55s
```

Eventually, the Postgres instance pods will come up as well:

```console
$ kubectl get pods
NAME                                                 READY   STATUS      RESTARTS   AGE
//highlight-start
acid-minimal-cluster-0                               1/1     Running     0          113s
acid-minimal-cluster-1                               1/1     Running     0          90s
//highlight-end
postgres-operator-6c6dbd4459-pbcjp                   1/1     Running     0          6m55s
request-pipeline-ha-postgres-promise-default-152bb   0/1     Completed   0          2m17s
```


You are now ready to use your Postgres instance! To validate, you can run:

```
kubectl exec -it acid-minimal-cluster-0 -- sh -c "
    PGPASSWORD=$(kubectl get secret zalando.acid-minimal-cluster.credentials -o 'jsonpath={.data.password}' | base64 -d) \
    PGUSER=$(kubectl get secret zalando.acid-minimal-cluster.credentials -o 'jsonpath={.data.username}' | base64 -d) \
    psql mydb"
```

## Clean up

To clean up the created resources, run:

```console
kubectl delete --filename https://raw.githubusercontent.com/syntasso/promise-postgresql/main/promise.yaml
kubectl delete --filename https://raw.githubusercontent.com/syntasso/kratix/main/distribution/single-cluster/install-all-in-one.yaml
```

## 🎉 Congratulations!

You have successfully installed Kratix and used it to deliver Postgres-as-a-Service to
your platform. Check out our [guides](/docs/category/guides) to learn more about Kratix
capabilities.

