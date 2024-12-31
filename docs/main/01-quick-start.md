---
description: Quickest way to test Kratix
title: Quick Start
sidebar_label: Quick Start
---

```mdx-code-block
import PartialInstall from '@site/docs/_partials/installation/_single-cluster-install.md';
import PartialConfigure from '@site/docs/_partials/installation/_single-cluster-configure.md';
```

One of the most powerful features of Kratix is its ability to handle requests for
Resources, and deploy them to a specific remote location, Kubernetes or otherwise. However, Kratix also works well
in a single Kubernetes cluster environment. This quick-start guide will walk you through the steps to
install Kratix on a single cluster.

## Prerequisite: Kubernetes cluster

Kratix requires a Kubernetes cluster to run. If you don't already have a cluster, we
recommend starting with a local cluster tool like
[KinD](https://kind.sigs.k8s.io/docs/user/quick-start/) or
[minikube](https://minikube.sigs.k8s.io/docs/start/).

### cert-manager

Kratix requires [cert-manager](https://cert-manager.io/) to be installed in the
cluster.

To install it, run:

```bash
kubectl apply --filename https://github.com/cert-manager/cert-manager/releases/download/v1.15.0/cert-manager.yaml
```

Make sure that `cert-manager` is ready before installing Kratix:

```shell-session
$ kubectl get pods --namespace cert-manager
NAME                                      READY   STATUS    RESTARTS   AGE
cert-manager-7476c8fcf4-r8cnd             1/1     Running   0          19s
cert-manager-cainjector-bdd866bd4-7d8zp   1/1     Running   0          19s
cert-manager-webhook-5655dcfb4b-54r49     1/1     Running   0          19s
```

## 1. Install Kratix

<PartialInstall />

### Configure

<PartialConfigure />

Once the system reconciles, the Kratix resources should now be visible on your
cluster. You can verify its readiness by observing the `kratix-platform-system` namespace
appearing in the cluster (it may take a couple of minutes):

```shell-session
$ kubectl get namespace kratix-platform-system
NAME                   STATUS   AGE
kratix-platform-system   Active   1m
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

Once the Postgres Operator is up and running, you can request a new Postgres Resource with
the command below:

```console
kubectl apply --filename https://raw.githubusercontent.com/syntasso/promise-postgresql/main/resource-request.yaml
```

You can verify the Pipeline pod by running:

<!-- TODO: Verify pipeline pod name -->

```shell-session
$ kubectl get pods
NAME                                          READY   STATUS      RESTARTS   AGE
//highlight-next-line
configure-pipeline-postgresql-default-8f012     0/1     Completed   0          72s
postgres-operator-6c6dbd4459-pbcjp            1/1     Running     0          6m55s
```

Eventually, the Postgres pods will come up as well:

```shell-session
$ kubectl get pods
NAME                                         READY   STATUS      RESTARTS   AGE
//highlight-start
acid-example-postgresql-0                    1/1     Running     0          113s
//highlight-end
postgres-operator-6c6dbd4459-pbcjp           1/1     Running     0          6m55s
configure-pipeline-postgresql-default-8f012    0/1     Completed   0          2m17s
```


You are now ready to use your Postgres Resources! 

To validate, you can access it through the `psql` environment by running:

```
kubectl exec -it acid-example-postgresql-0 -- sh -c "
    PGPASSWORD=$(kubectl get secret postgres.acid-example-postgresql.credentials.postgresql.acid.zalan.do -o 'jsonpath={.data.password}' | base64 -d) \
    PGUSER=$(kubectl get secret postgres.acid-example-postgresql.credentials.postgresql.acid.zalan.do -o 'jsonpath={.data.username}' | base64 -d) \
    psql bestdb"
```

## 4. Administer your Postgres
You can connect to the Postgres database system with administration tools like [PgAdmin](https://www.pgadmin.org/)

First, forward the pod port so that it will be accessible on `localhost` at port `5432`.
```console
kubectl port-forward pod/acid-example-postgresql-0 5432:5432 -n default
```
Next, get the dayabase connection password (string upto the `%`):
```console
kubectl get secret postgres.acid-example-postgresql.credentials.postgresql.acid.zalan.do \
    -o 'jsonpath={.data.password}' | base64 -d
# e.g. returns 
dWECN8SybOUsFM9U4CH4DkJtZ8OgGqnzvcdDwpRzqNtiBRScc10ZSoRZccyBZ9AL%
```
Then in the PgAdmin tool
- Create a localhost server
- Connection: 
    - Host name/address `localhost` and port `5432`
    - maintenance database `postgres`
    - username `postgres`
- Parameters
    - SSL Mode value `disable`
- Connect to Server
- enter password

## Clean up

To clean up the created resources, run:

```console
kubectl delete --filename https://raw.githubusercontent.com/syntasso/promise-postgresql/main/promise.yaml
kubectl delete --filename https://github.com/syntasso/kratix/releases/latest/download/install-all-in-one.yaml
```

## 🎉 Congratulations!

You have successfully installed Kratix and used it to deliver Postgres-as-a-Service to
your platform. Check out our [guides](/category/guides) to learn more about Kratix
capabilities.
