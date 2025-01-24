---
description: Create and configure a worker cluster, and install a Promise
title: "Section B: Installing a Promise"
id: installing-a-promise
slug: ../installing-a-promise
---

```mdx-code-block
import InstallErrorDiagram from "/img/docs/workshop/install-a-promise-install-error.svg"
import InstallSuccessDiagram from "/img/docs/workshop/install-a-promise-install-success.svg"
import ResourceRequestDiagram from "/img/docs/workshop/install-a-promise-request.svg"
import PipelineDiagram from "/img/docs/workshop/install-a-promise-pipeline.svg"
import PartialPromise from '../../_partials/_promise-architecture.md';
```

This is Part 2 of [a series](intro) illustrating how Kratix works. <br />
👈🏾 Previous: [Install Kratix](installing-kratix) <br />
👉🏾 Next: [Using a Compound Promise](multiple-promises)

<hr />

**In this tutorial, you will**

- [learn what Promises are](#promise-definition)
- [install your first Kratix Promise](#install-jenkins)
- [request a Resource from a promised service](#request-jenkins)

Following the [Installing Kratix](installing-kratix) tutorial, you should now have Kratix up and running in your platform cluster. You should also have a worker cluster reconciling on the documents in the MinIO Bucket.

Validate your installation by running:

```bash
kubectl --context $PLATFORM get deployments --namespace kratix-platform-system
```

The above command will give an output similar to:

```shell-session
NAME                                 READY   UP-TO-DATE   AVAILABLE   AGE
kratix-platform-controller-manager   1/1     1            1           1h
minio                                1/1     1            1           1h
```

You should also have a `kratix-worker-system` namespace in your worker cluster:

```bash
kubectl --context $WORKER get namespace kratix-worker-system
```

The above command will give an output similar to:

```shell-session
NAME                   STATUS   AGE
kratix-worker-system   Active   35m
```

If your outputs do not align with the above, please refer back to
[Installing Kratix](installing-kratix).

With that, you have all the pieces you need to install your first Promise!

## What's a Promise? {#promise-definition}

A Promise is the building block that Kratix provides to enable platform teams to
build their platforms incrementally. Promises are what allow the platform to
provide anything-as-a-Service and are composed of mainly three pieces:

- A set of Dependencies that need to be installed on any worker cluster
  intending to run the Promise workload.
- An API exposing to the user of the platform the configuration options they
  have when requesting the service provided by the Promise.
- A series of Workflows are executed to fulfil the Promise and create
  the service.

<details>
   <summary>🤔 How's that different from Helm? Or Crossplane? Or... </summary>

Kratix positions itself as a framework for building platforms. Instead of
thinking _Kratix or X_, think **Kratix and X**. The team has written
extensively on how Kratix can work together with other Kubernetes tools.
Please check [The Value of Kratix](/main/how-kratix-complements/intro)
for details.

</details>

### Promise Architecture

<PartialPromise />

As you go through installing and using the Promise, this tutorial will unpack and highlight
the parts of the Promise you are interacting with.

## Provide Jenkins-as-a-Service {#install-jenkins}

Kratix offers a variety of ready-to-use Promises in the [Kratix Marketplace](/marketplace). This tutorial will focus on making [Jenkins-as-a-Service](https://github.com/syntasso/kratix-marketplace/tree/main/jenkins) available, on demand, for platform users.

Install the Jenkins Promise:

```bash
kubectl --context $PLATFORM apply --filename https://raw.githubusercontent.com/syntasso/kratix-marketplace/main/jenkins/promise.yaml
```

And that's it! Promise installed!

Once the Promise is installed, the platform cluster is extended with a new API:
the Jenkins Promise API. This API teaches the platform cluster how to deal with
requests for Jenkins.

<details>
<summary>🤔 How's the Promise API determined?</summary>

The Promise API is fully defined by the platform team. They have the choice to
hide complexity, making it easy for users to request new services.
Alternatively, they can offer users greater flexibility, allowing them to
fine-tune lower-level details of the services or select the specific destination
where the workload should run.

</details>

```bash
kubectl --context $PLATFORM get crds | grep jenkins
```

The above command will give output similar to:

```shell-session
jenkins.marketplace.kratix.io          2024-01-26T16:16:13Z
```

Kratix will also write a declaration of state to the State Store, informing any destinations that they should install the Promise Dependencies. For the Jenkins Promise, the Dependencies include the Jenkins Operator.

<figure className="diagram">
  <InstallSuccessDiagram className="large"/>

  <figcaption>Installation of the Jenkins Promise</figcaption>
</figure>

Verify that the Jenkins Operator starts in the worker cluster:

```shell-session
kubectl --context $WORKER get deployments --watch
```

The above command will give an output similar to the following (it may take a couple of
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

If at this stage you create another Kubernetes cluster and follow similar steps to register and configure this new cluster, the Jenkins Promise dependencies automatically be installed in the new cluster.

Later in this tutorial you will learn how to make certain Promises available only in certain clusters based on Promise configuration.

Your environment now looks like this (with some detail omitted for clarity):


```mdx-code-block
import Topology03 from "/img/docs/workshop/topology-03.png"
```

<figure className="diagram">
  <img className="large" src={Topology03} alt="Deployed resources with a Promise" />

  <figcaption>Jenkins dependencies are reconciled on all workers</figcaption>
</figure>

With both the API available in the platform, and the dependencies installed in the worker, the Jenkins Promise installation is now complete.

It is now time to switch roles for a moment, and imagine you are a developer who wants to request a new Jenkins Resource.

## Request a Resource from a Promised service {#request-jenkins}

As a user of the platform, you can find out what's available by checking the
installed Promises:

```bash
kubectl --context $PLATFORM get promises.platform.kratix.io
```

The above command will give an output similar to:

```shell-session
NAME      STATUS      KIND      API VERSION                      VERSION
jenkins   Available   jenkins   marketplace.kratix.io/v1alpha1
```

To request a Jenkins, all you need is to send a request for a new Jenkins Resource to the platform.

Create a Jenkins Resource:

```yaml
cat <<EOF | kubectl --context $PLATFORM apply --filename -
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
<summary>🤔 How do platform users interact with the Promise API?</summary>

In this example, you are interacting with the API using the `kubectl` cli
directly. However, how users of your platform will is up to you.

For example, you could have [Backstage](https://www.syntasso.io/post/kratix-and-backstage-a-perfect-pair)
on top of the API to facilitate the creation of services. Similarly,
you can employ [Compass](https://www.syntasso.io/post/kratix-and-compass) as a
driving force for your platform. Kratix can seamlessly integrate with various
systems such as GitOps Repositories, ticketing systems, or CI/CD tools.

</details>

When writing a request for a Resource, the platform user will have all the
configuration options exposed to them as part of the Promise API, as defined by
the platform team. The Jenkins Promise exposes a single
configuration option: `spec.env` (see the [Jenkins Promise
documentation](https://github.com/syntasso/kratix-marketplace/tree/main/jenkins)).
When set to `prod`, the resulting Resources will have backups enabled.

Once the request is created, Kratix will kick-off the imperative Workflow for the
Configure. The Jenkins Configure Workflow is a very basic Kratix Pipeline that transforms
the user's request into a Jenkins manifest.

However, Workflows can do much more. It is within the Workflow that you define
the business processes of your organisation, encapsulating the steps required to
deliver the promised service on-demand. Through Workflows, platform teams have the
flexibility to customise the Promise according to their specific business and
compliance requirements in either simple Kratix Pipelines or other popular pipeline technologies (e.g. Tekton).

<figure className="diagram">
  <PipelineDiagram className="large"/>
  <figcaption>An example multi-stage Kratix Pipeline</figcaption>
</figure>

For instance, in an organisation where all container images must undergo
vulnerability scanning, you can include a Snyk image in your Promise. Similarly,
if you wish to receive alerts for specific events, you can include a Slack
image.

Furthermore, the stages of a Workflow and within a Kratix Pipeline are designed to be reusable. This allows platform teams to encode specific rules once and apply them consistently across all services within the platform.

Verify the Jenkins Workflow execution:

```bash
kubectl --context $PLATFORM get pods
```

The above command will give an output similar to:

```shell-session
NAME                                                    READY   STATUS      RESTARTS   AGE
kratix-jenkins-example-instance-configure-655a8-vpmg2   0/1     Completed   0          71s
```

Once the Workflow completes, Kratix will write the documents it outputted (i.e. the declaration of state) to the directory within the bucket that the worker cluster is watching. You will soon see the requested Jenkins resources starting up on the worker cluster.

<figure className="diagram">
  <ResourceRequestDiagram className="large"/>
</figure>

Verify Jenkins is booting up:

```bash
kubectl --context $WORKER get pods --watch
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
is fully deployed and ready to be accessed! Press <kbd>Ctrl</kbd>+<kbd>C</kbd> to
exit the watch mode.

Go to [http://localhost:30269](http://localhost:30269) and check it out!

:::caution

If you gave your Jenkins a different name, you may need port-forwarding to
access the running Jenkins:

```shell-session
kubectl --context $WORKER port-forward pod/jenkins-dev-<NAME> 8080:30269
```

:::

<details>
  <summary>🤔 Where are the Jenkins Credentials?</summary>

To login to Jenkins, you will need to fetch the credentials on the worker
cluster:

```bash
kubectl --context $WORKER get secrets --selector app=jenkins-operator -o go-template='{{range .items}}{{"username: "}}{{.data.user|base64decode}}{{"\n"}}{{"password: "}}{{.data.password|base64decode}}{{"\n"}}{{end}}'
```

</details>

## Clean up

Since you will no longer need Jenkins for the remainder of this tutorial, you can go ahead and delete it.

Delete the Jenkins Promise:

```bash
kubectl --context $PLATFORM delete promise jenkins
```

The above command will give an output similar to:

```shell-session
promise.platform.kratix.io "jenkins" deleted
```

The delete command will also cascade-delete all traces of Jenkins from the
platform, including the deployed Jenkins on the worker cluster.

Verify that the Jenkins Resource gets deleted:

```bash
kubectl --context $WORKER get pods
```

The above command will give an output similar to (it may take a few minutes):

```shell-session
No resources found in default namespace.
```

## Summary

To recap the steps you took:

1. ✅&nbsp;&nbsp;Installed the Jenkins Promise
1. ✅&nbsp;&nbsp;Requested a Jenkins Resource

## 🎉 &nbsp; Congratulations

✅&nbsp;&nbsp;Your Promise has been installed and deleted. <br />
👉🏾&nbsp;&nbsp;Next, you will learn more about [Compound
Promises](multiple-promises)
