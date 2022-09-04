---
description: Install a use a Kratix Promise
---

# Installing and using a Promise

**In this guide, you will**
1. [learn more about Kratix Promises](#what-is-a-kratix-promise)
1. [install Jenkins as a Kratix Promise](#install-the-kratix-sample-jenkins-promise)

## What is a Kratix Promise?

Conceptually, Promises are the building blocks of Kratix that allow you to develop your platform incrementally. Technically, a Promise is a YAML document that defines a contract between the Platform and its users. You can explore more about this contract and the internals of a Kratix Promise in the [writing a Promise](writing-a-promise) guide.

## Kratix Promises

* enable you to build your platform incrementally and in response to the needs of your users.
* codify the contract between platform teams and application teams for the delivery of a specific service, e.g. a database, an identity service, a supply chain, or a complete development pipeline of patterns and tools.
* are easy to build, deploy, and update.
* are sharable and reusable between platforms, teams, business units, and other organisations.
* add up to a frictionless experience when platform users want to create services that they need to deliver value.

Now that you know more about Kratix Promises, follow the steps below to install a Promise.


## Prerequisites
You need a fresh installation of Kratix for this section. The simplest way to do so is by running the quick-start script from within the Kratix directory.

```bash
./scripts/quick-start.sh --recreate
```

Alternatively, you can go back to [Installing Kratix](../category/installing-kratix) and follow the appropriate guide.

:::note

The remaining of this guide will assume you have a [multi-cluster setup with KinD](installing-kratix/multi-cluster-with-kind). If you are using a different setup, you will need to adapt the commands accordingly.

:::

## Install the Kratix sample Jenkins Promise

Now that your system is set up, you can install your first Kratix Promise! This guide will follow the steps below:

1. [Install the Jenkins Promise](#install-the-jenkins-promise)
1. [Request a new Jenkins instance](#request-instance)
1. [Use the instance](#use-instance)
1. [Tear down your environment](#teardown)

:::tip

The commands below will refer to a `KRATIX_REPO` env variable. You can either:

* clone Kratix and set it to the path of your local clone:
    ```bash
    export KRATIX_REPO=/path/to/kratix
    ```
* set it to a remote URL:
    ```bash
    export KRATIX_REPO="https://raw.githubusercontent.com/syntasso/kratix/main"
    ```
:::

![Overview](/img/docs/Treasure_Trove-Install_a_Promise.jpeg)


### Install the Jenkins Promise

Installing a Kratix Promise is as simple as applying the Promise YAML definition on your Platform cluster:

```bash
kubectl apply \
  --context kind-platform \
  --filename "${KRATIX_REPO}/samples/jenkins/jenkins-promise.yaml"
```

You can check that your `platform` cluster has registered Jenkins as a new available Kratix Promise:

```bash
kubectl get crds \
    --context kind-platform \
    jenkins.example.promise.syntasso.io
```

The above command will give an output similar to
```console
NAME                                  CREATED AT
jenkins.example.promise.syntasso.io   2021-05-10T12:00:00Z
```

On your `worker` cluster, you can verify that the Jenkins Operator is now installed, which gives the `worker` the ability to create Jenkins instances:

```bash
kubectl get pods \
    --context kind-worker \
    --namespace default
```

The above command will give an output similar to (it may take a couple of minutes):

```console
NAME                                READY   STATUS    RESTARTS   AGE
jenkins-operator-7886c47f9c-zschr   1/1     Running   0          1m
```

🎉  Congratulations! You have installed your first Kratix Promise, which means your application teams can now get on-demand instances of Jenkins from your platform.

### <a name="request-instance"></a>Request a Jenkins Instance

Application developers using your platform will be issued a Jenkins instance after applying a Kratix Resource Request.

![Verify-Instance](/img/docs/Treasure_Trove-Get_an_instance.jpeg)

Test your platform by acting as an application developer and submitting a Resource Request.
```bash
kubectl apply \
    --context kind-platform \
    --filename "${KRATIX_REPO}/samples/jenkins/jenkins-resource-request.yaml"
```

Verify that the Resource Request was issued on the `platform` cluster.
```bash
kubectl --context kind-platform get jenkins.example.promise.syntasso.io
```

The above command will give an output similar to
```console
NAME                AGE
example             1m
```

Eventually (it can take a couple of minutes), a new Jenkins instance should spin up on your `worker` cluster. You can verify this by running the following command:

```bash
kubectl get pods \
    --context kind-worker \
    --namespace default get pods
```

The above command will give an output similar to
```console
NAME                                READY   STATUS    RESTARTS   AGE
jenkins-example                     1/1     Running   0          1m
jenkins-operator-7886c47f9c-zschr   1/1     Running   0          10m
```

🎉  Congratulations! You have successfully requested and created an on-demand instance of Jenkins from your platform.

### Use your Jenkins instance

Access the Jenkins UI in a browser to ensure the instance is working.

:::note
Before you can access Jenkins UI, you must port forward from within the Kubernetes cluster to a local port on your computer. Running the `port-forward` command is continuous&mdash;as long as the command is running, the connection stays open.

_**Open a new terminal to request the port forward**_.

```console
kubectl --context kind-worker port-forward jenkins-example 8080:8080
```

:::

Navigate to [http://localhost:8080](http://localhost:8080) and log in with the credentials you get from the commands below:

```console jsx title="username"
kubectl get secret jenkins-operator-credentials-example \
    --context kind-worker \
    -o 'jsonpath={.data.user}' | base64 -d
```
```console jsx title="password"
kubectl get secret jenkins-operator-credentials-example \
    --context kind-worker \
    -o 'jsonpath={.data.password}' | base64 -d
```

## Summary

You installed your first Kratix Promise on your platform. Well done!

To recap the steps you took:
1. ✅&nbsp;&nbsp;Installed the sample Jenkins Promise
1. ✅&nbsp;&nbsp;Requested an instance of Jenkins
1. ✅&nbsp;&nbsp;Tested the instance by logging in to the Jenkins UI

This is only the beginning of working with Promises. Next you will deploy three different Promises to provide a complete solution for an application team.

## <a name="teardown"></a>Tearing it all down
To clean up your environment, run the following command:

```bash
kind delete clusters platform worker
```

---

**🎉 Congratulations!** You have installed a Kratix Promise and used it to create on-demand instances of a service. Now you will [deploy a web app that uses multiple Kratix Promises](multiple-promises).
