**In this guide, you will**
1. [learn more about Kratix Promises](#what-is-a-kratix-promise)
1. [install Jenkins as a Kratix Promise](#install-the-kratix-sample-jenkins-promise)

## What is a Kratix Promise?

Conceptually, Promises are the building blocks of Kratix that allow you to
develop your platform incrementally. Technically, a Promise is a YAML document
that defines a contract between the Platform and its users. You can explore
more about this contract and the internals of a Kratix Promise in the [writing
a Promise](writing-a-promise) guide.

## Kratix Promises

* enable you to build your platform incrementally and in response to the needs of your users.
* codify the contract between platform teams and application teams for the delivery of a specific service, e.g. a database, an identity service, a supply chain, or a complete development workflow including patterns and tools.
* are easy to build, deploy, and update.
* are shareable and reusable between platforms, teams, business units, and other organisations.
* add up to a frictionless experience when platform users want to create services that they need to deliver value.

Now that you know more about Kratix Promises, follow the steps below to install a Promise.

<br />
<hr />

## Install the Kratix sample Jenkins Promise

Now that your system is set up, you can install your first Kratix Promise! This guide will follow the steps below:

1. [Install the Jenkins Promise](#install-the-jenkins-promise)
1. [Request a new Jenkins Resource](#request-resource)
1. [Use the Jenkins](#use-your-jenkins-resource)
1. [Clean up environment](#cleanup)

![Overview](/img/docs/Treasure_Trove-Install_a_Promise.jpeg)
### Install the Jenkins Promise


:::tip

In this guide, we will be using Promises available on the [Kratix Marketplace](/marketplace).
The commands below will refer to a `KRATIX_MARKETPLACE_REPO` env variable. You can either:

* clone the [Kratix Marketplace](https://github.com/syntasso/kratix-marketplace) and set it to the path of your local clone:
    ```bash
    export KRATIX_MARKETPLACE_REPO=/path/to/kratix-marketplace
    ```
* set it to a remote URL:
    ```bash
    export KRATIX_MARKETPLACE_REPO="https://raw.githubusercontent.com/syntasso/kratix-marketplace/main"
    ```
:::


Installing a Kratix Promise is as simple as applying the Promise YAML definition on your Platform cluster:

```bash
kubectl --context $PLATFORM apply \
  --filename "${KRATIX_MARKETPLACE_REPO}/jenkins/promise.yaml"
```
<br />

Verify that your `platform` cluster has registered Jenkins as a new available Kratix Promise.

```bash
kubectl --context $PLATFORM get crds jenkins.marketplace.kratix.io
```

The above command will give an output similar to
```console
NAME                            CREATED AT
jenkins.marketplace.kratix.io   2021-05-10T12:00:00Z
```

<br />

<p>The Jenkins Promise requires the Jenkins Operator to be deployed to the <code>worker</code> Destination clusters. Kratix will deploy the operator when you apply the Promise. You can verify that the Jenkins Operator is now installed<br />
<sub>(This may take a few minutes so <code>--watch</code> will watch the command. Press <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop watching)</sub>
</p>

```bash
kubectl --context $WORKER get pods --watch
```

The above command will give an output similar to (it may take a couple of minutes):

```console
NAME                                READY   STATUS    RESTARTS   AGE
jenkins-operator-7886c47f9c-zschr   1/1     Running   0          1m
```

<br />

🎉  Congratulations! You have installed your first Kratix Promise, which means your application teams can now get on-demand Jenkins from your platform.

### Request a Jenkins Resource {#request-resource}

Application developers using your platform will be issued a Jenkins after requesting a new Resource.
<br />
<br />

![Verify-Instance](/img/docs/Treasure_Trove-Get_an_instance.jpeg)

Test your platform by acting as an application developer and submitting a request for a Resource:
```bash
kubectl --context $PLATFORM apply \
    --filename "${KRATIX_MARKETPLACE_REPO}/jenkins/resource-request.yaml"
```

<br />

Verify that the request was issued on the `platform` cluster.
```bash
kubectl --context $PLATFORM get jenkins.marketplace.kratix.io
```

The above command will give an output similar to
```console
NAME      STATUS
example   Resource requested
```

Eventually (it can take a couple of minutes), a new Jenkins should spin up on your `worker` Destination cluster. You can verify this by running the following command:

<p>Verify the Jenkins was created on the worker cluster<br />
<sub>(This may take a few minutes so <code>--watch</code> will watch the command. Press <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop watching)</sub>
</p>

```bash
kubectl --context $WORKER get pods --watch
```

The above command will give an output similar to
```console
NAME                                READY   STATUS    RESTARTS   AGE
jenkins-dev-example                 1/1     Running   0          1m
jenkins-operator-7886c47f9c-zschr   1/1     Running   0          10m
```
<br />

🎉  Congratulations! You have successfully requested and created an on-demand Jenkins from your platform.

### Use your Jenkins

Access the UI in a browser to ensure the Jenkins is working.

:::note
Before you can access Jenkins UI, you must port forward from within the Kubernetes cluster to a local port on your computer. Running the `port-forward` command is continuous&mdash;as long as the command is running, the connection stays open.

_**Open a new terminal to request the port forward**_.

```console
export WORKER=kind-worker
kubectl --context $WORKER port-forward jenkins-dev-example 8080:8080
```

:::

You can find Jenkins credentials by running:

```console jsx title="username"
kubectl --context $WORKER get secret jenkins-operator-credentials-dev-example \
    -o 'jsonpath={.data.user}' | base64 -d
```
```console jsx title="password"
kubectl --context $WORKER get secret jenkins-operator-credentials-dev-example \
    -o 'jsonpath={.data.password}' | base64 -d
```

Navigate to [http://localhost:8080](http://localhost:8080) and log in with the
credentials. In production, you want the credentials to be stored in a secure
location where it could be accessed by the application team. In this example,
credentials are stored as unencrypted Kubernetes secrets.

## Summary

You installed your first Kratix Promise on your platform. Well done!

To recap the steps you took:
1. ✅&nbsp;&nbsp;Installed the sample Jenkins Promise
1. ✅&nbsp;&nbsp;Requested an Jenkins Resource
1. ✅&nbsp;&nbsp;Tested the Jenkins by logging in to the Jenkins UI

This is only the beginning of working with Promises. Next you will deploy three different Promises to provide a complete solution for an application team.

## Clean up environment {#cleanup}
To clean up your environment you need to delete the Jenkins Resources and the Jenkins Promise.

To delete the Jenkins Resources:
```bash
kubectl --context $PLATFORM delete \
    --filename "${KRATIX_MARKETPLACE_REPO}/jenkins/resource-request.yaml"
```

Verify the Jenkins Resource in the platform cluster is gone
```console
kubectl --context $PLATFORM get jenkins
```


and the Jenkins workloads in the worker cluster have been deleted
```console
kubectl --context $WORKER get pods
```

The above command will give an output similar to (it may take a couple of minutes)

```console
NAME                                READY   STATUS    RESTARTS   AGE
jenkins-operator-7886c47f9c-zschr   1/1     Running   0          1m
```


Now you can delete the Jenkins Promise
```bash
kubectl --context $PLATFORM delete \
  --filename "${KRATIX_MARKETPLACE_REPO}/jenkins/promise.yaml"
```

Verify the Jenkins Promise is gone
```console
kubectl --context $PLATFORM get promises
```

and the Jenkins Operator is deleted from the worker cluster (this might take a couple minutes)
```console
kubectl --context $WORKER get pods
```

Alternatively, you could delete the Promise directly. By default Kratix will delete all child Resources when a Promise is deleted. For more details, check the [deletion
reference docs](/docs/main/reference/promises/delete)

---

## 🎉 &nbsp; Congratulations!
✅&nbsp;&nbsp; You have installed a Kratix Promise and used it to create on-demand Resources. <br />
👉&nbsp;&nbsp; Now you will [write your own Promise](writing-a-promise).
