---
description: Writing a Jenkins Promise
title: Part 2
id: writing-a-jenkins-promise
slug: /events/2022-kcduk/writing-a-jenkins-promise
---

# Writing a Jenkins Promise

import useBaseUrl from '@docusaurus/useBaseUrl';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

**In this tutorial, you will**
1. [learn more about what's inside a Kratix Promise](#whats-inside-a-kratix-promise)
1. [write and install your own Jenkins Promise](#writing-your-own-kratix-promise)

## What's inside a Kratix Promise?

You've [installed Kratix and a couple sample Promises](using-multiple-promises). Now you'll create a Promise from scratch.

A Kratix Promise is a YAML document that defines a contract between the platform and its users. It is what allows platforms to be built incrementally.

### A Promise consists of three parts:

<img
  align="right"
  src={useBaseUrl('/img/docs/base-promise-structure.png')}
  alt="Kratix logo"
/>

1. `workerClusterResources`: a collection of Kubernetes resources that enable the creation of an instance and will be pre-installed in the worker clusters.
1. `xaasCrd`: the CRD that an application developer uses to request an instance of the Kratix Promise from the platform cluster.
1. `xaasRequestPipeline`: an ordered list of docker containers that result in the creation an instance of the promised service on a worker cluster.

## Basics of getting a promised instance to your users

At a very high level

* You talk to users of your platform to find out what they're using and what they need.
* You write a Kratix Promise for the service
  * In `workerClusterResources`, you define what baseline resources are needed to deliver this capability.
  * In `xaasCrd`, you list what your users can configure in their request.
  * In `xaasRequestPipeline`, you list Docker images that will take the user's request and decorate it with configuration that you or the business require.
* You install the Promise on your platform cluster, where Kratix is installed.
* Your user wants an instance of the Promise.
* Your user submit a Kratix Resource Request that lists what they want and how they want it, and this complies with the `xaasCrd` (more details on this request later).
* Kratix fires off the request pipeline that you defined in `xaasRequestPipeline` and passes the Resource Request as an input.
* The pipeline outputs valid Kubernetes documents that say what the user wants and what the business wants for that Promise instance.
* The worker cluster has what it needs based on the `workerClusterResources` and is ready to create the instance when the request comes through.

## A Kratix Promise to deliver Jenkins

In the last section, you enabled teams to deliver their application onto Knative with a Postgres datastore. Now your team wants to deploy changes to this application using a Jenkins CI/CD pipeline.

Imagine this is the third request to your platform team for a Jenkins instance. You decide three times is too many times to manually set up Jenkins.

Now you decide to write a Jenkins Promise and install it on your platform so that your teams get Jenkins&mdash;and you get time back for more valuable work.

<hr />

## Writing your own Kratix Promise

This guide will follow the steps below:


**Define Promise**
1. [Directory setup](#directory-setup)

**Promise definition: workerClusterResources**
1. [Define your `workerClusterResources` in your Promise definition](#worker-cluster-resources)

**Promise definition: xaasCrd**
1. [X as-a-Service Custom Resource Definition: define your Promise API](#promise-api)

**Promise definition: xaasRequestPipeline**
1. [Build a simple request pipeline](#pipeline-script)
1. [Test your container image](#test-image)
1. [Build your pipeline image](#build-image)

**Test Promise**
1. [Install your Promise](#install-promise)
1. [Create and submit a Kratix Resource Request](#create-resource-request)
1. [Review of a Kratix Promise parts (in detail)](#promise-review)
1. [Summary](#summary)
1. [Tear down your environment](#teardown)

<hr />


### Directory setup {#directory-setup}

To begin writing a Promise you will need a basic directory structure to work in. You can use our promise template to get started.

Run the following commands in a working directory of your choosing.

```bash
git clone https://github.com/syntasso/promise-template.git
cd promise-template
```

### Define your Promise API {#promise-api}

You've decided you want to create a Jenkins promise available to your users. To do this you need to setup the `promise.yaml` file. First lets
setup the name of the Promise. Update the `promise.yaml` so that the name is set to `Jenkins`:
```yaml jsx title="xaasCrd in promise.yaml"
apiVersion: platform.kratix.io/v1alpha1
kind: Promise
metadata:
  name: jenkins
spec:
  # workerClusterResources:
  # xaasCrd:
  # xaasRequestPipeline:
```

Now you can start working your way through the 3 components of the promise, the `xaasCrd`, `workerClusterResources` and `xaasRequestPipeline`.

For the purpose of this tutorial, you will create an API that accepts a single `string` parameter called `name`. In real world scenarios, the API can be as simple or as complex you design it to be. The Promise API is defined within the `xaasCrd` of your Promise YAML.

Replace the `xaasCrd` field in `promise.yaml` with the complete field details below. Ensure the indentation is correct (`xaasCrd` is nested under `spec`).

```yaml jsx title="xaasCrd in promise.yaml"
  xaasCrd:
    apiVersion: apiextensions.k8s.io/v1
    kind: CustomResourceDefinition
    metadata:
      name: jenkins.example.promise.syntasso.io
    spec:
      group: example.promise.syntasso.io
      scope: Namespaced
      names:
        plural: jenkins
        singular: jenkins
        kind: jenkins
      versions:
      - name: v1
        served: true
        storage: true
        schema:
          openAPIV3Schema:
            type: object
            properties:
              spec:
                type: object
                properties:
                  name:
                    type: string
```

You have now defined the as-a-Service API.

### Define your `workerClusterResources` in your Promise definition {#worker-cluster-resources}

The `workerClusterResources` describes everything required to be running on the cluster before a users request is applied. Kratix applies this content on all registered worker clusters.

For this Promise, the `workerClusterResources` needs to contain the Jenkins Operator. One option to deploy the Jenkins Operator is to use a helm chart. Flux is already in use on the worker clusters and provides an easy way to reference and configure Helm charts. In this case, you will use a `HelmRepository` resource to reference the public Jenkins Operator Helm chart. Then you will use a `Helm Release` resource to deploy an instance of that chart including any custom values.

Replace the `workerClusterResources` field in the `promise.yaml` with the complete field details below. Ensure the indentation is correct (`workerClusterResources` is nested under `spec`).
```yaml jsx title="xaasCrd in promise.yaml"
  workerClusterResources:
  - apiVersion: source.toolkit.fluxcd.io/v1beta1
    kind: HelmRepository
    metadata:
      name: jenkins-operator-repo
    spec:
      interval: 5m
      url: https://raw.githubusercontent.com/jenkinsci/kubernetes-operator/master/chart
  - apiVersion: helm.toolkit.fluxcd.io/v2beta1
    kind: HelmRelease
    metadata:
      name: jenkins-operator
    spec:
      interval: 5m
      values:
        jenkins:
          enabled: false
      chart:
        spec:
          chart: jenkins-operator
          sourceRef:
            kind: HelmRepository
            name: jenkins-operator-repo
          version: 0.6.2
```

### Create your Resource Request Pipeline {#create-pipeline}
You've now completed setting up the `workerClusterResources` which deploys the Jenkins Operator to all worker clusters. You also have set up the `xaasCrd` which requests values from your users to customise an instance request. The Kratix pipeline is where you can define business logic generate a Jenkins instance request using the custom values.

The Jenkins Operator defines a Jenkins custom resources which is used to request an instance where the spec is any custom configuration. Below is an example:

```yaml
apiVersion: jenkins.io/v1alpha2
kind: Jenkins
metadata:
  name: example-jenkins
  namespace: default
spec:
  jenkinsAPISettings:
    authorizationStrategy: createUser
  master:
    basePlugins:
    - name: kubernetes
      version: "1.31.3"
  ...
```

You need to setup a pipeline to produce a Jenkins request that meets your business and user requirements.

#### Build a simple request pipeline {#pipeline-script}

Kratix takes no opinion on the tooling used within a pipeline. Kratix will pass a set of resources to the pipeline, and expect back a set of resources. What happens within the pipeline, and what tooling is used, is a decision left entirely to you.

For this example, you're taking a name from the Kratix Resource Request for an instance and passing it to the Jenkins custom resource output.

To keep this transformation simple, you'll use `yq`, a CLI tool to manipulate yaml.

Inside the `request-pipeline-image/` directory you will find a the following files:

```
Dockerfile
asset.yaml
execute-pipeline.sh
```

The Dockerfile has already been setup to contain `yq` and to execute the `execute-pipeline.sh` when run. You need to update the pipeline so that it outputs the desired Jenkins custom resource.

First lets add an asset file containing an example Jenkins custom resource, we can then update the `execute-pipeline.sh` script to manipulate this file to have the desired name.

Update the contents of `asset.yaml` to contain the following:

```yaml jsx title="request-pipeline-image/asset.yaml"
apiVersion: jenkins.io/v1alpha2
kind: Jenkins
metadata:
  name: example
  namespace: default
spec:
  configurationAsCode:
    configurations: []
    secret:
      name: ""
  groovyScripts:
    configurations: []
    secret:
      name: ""
  jenkinsAPISettings:
    authorizationStrategy: createUser
  master:
    basePlugins:
    - name: kubernetes
      version: "1.31.3"
    - name: workflow-job
      version: "1180.v04c4e75dce43"
    - name: workflow-aggregator
      version: "2.7"
    - name: git
      version: "4.11.0"
    - name: job-dsl
      version: "1.79"
    - name: configuration-as-code
      version: "1414.v878271fc496f"
    - name: kubernetes-credentials-provider
      version: "0.20"
    disableCSRFProtection: false
    containers:
      - name: jenkins-master
        image: jenkins/jenkins:2.332.2-jdk17
        imagePullPolicy: Always
        command:
          - bash
          - -c
          - /var/jenkins/scripts/init.sh && /usr/bin/tini -s -- /usr/local/bin/jenkins.sh
        env:
          - name: JAVA_OPTS
            value: -Xmx125m -XX:MinRAMPercentage=50.0 -XX:MaxRAMPercentage=80.0 -Djenkins.install.runSetupWizard=false -Djava.awt.headless=true
        livenessProbe:
          failureThreshold: 12
          httpGet:
            path: /login
            port: http
            scheme: HTTP
          initialDelaySeconds: 100
          periodSeconds: 10
          successThreshold: 1
          timeoutSeconds: 5
        readinessProbe:
          failureThreshold: 10
          httpGet:
            path: /login
            port: http
            scheme: HTTP
          initialDelaySeconds: 80
          periodSeconds: 10
          successThreshold: 1
          timeoutSeconds: 1
        resources:
          limits:
            cpu: 1500m
            memory: 3Gi
          requests:
            cpu: "1"
            memory: 500Mi
```

Inside the Dockerfile we already have this `asset.yaml` added, meaning that it can be accessed by the `execute-pipeline.sh` script. Lets now update the `execute-pipeline.sh` script to set the desired name.

Kratix will provide the user's resource request (the `xaasCrd` instance) as an input to the `execute-pipeline.sh` script by placing it at `/input/object.yaml`. The script needs to output the desired resources to `/output/`.

Update the `execute-pipeline.sh` script to contain the following:

```bash jsx title="request-pipeline-image/execute-pipeline.sh"
#!/bin/sh

set -x

# Read users input from the object
export NAME=$(yq eval '.spec.name' /input/object.yaml)

# Replace defaults with user provided values and place the contennts in /output/
cat asset.yaml |  \
  yq eval '.metadata.name = env(NAME)' - \
  > /output/jenkins_instance.yaml

```

You've successfully wired up the pipeline to create a Jenkins custom resource that matches the users desired input.

Before going ahead and shipping this Promise its good to test it works first.

### Test your pipeline image {#test-image}

Test the Docker container image by supplying an input resource and examining the output resource.

You might of noticed earlier the `test-input` and `test-output` directories inside the `request-pipeline-image/` directory.
We can use these to test our pipeline works. Create a sample `object.yaml` Resource Request in the `test-input/` directory with the contents below

```yaml jsx title="request-pipeline-image/test-input/object.yaml"
apiVersion: example.promise.syntasso.io/v1
kind: jenkins
metadata:
  name: example-resource-request
spec:
  name: super-cool-name
```


Run the container, providing this `test-input` directory as the `/input/` directory. We will also mount `/output` to the `test-output` directory.
```bash
docker build --tag kratix-workshop/jenkins-request-pipeline:dev -f request-pipeline-image/Dockerfile request-pipeline-image
docker run -v ${PWD}/request-pipeline-image/test-input:/input -v ${PWD}/request-pipeline-image/test-output:/output kratix-workshop/jenkins-request-pipeline:dev
```
<br />

Verify the contents of the `request-pipeline-image/test-output`/ directory contains the desired `metadata.name`.

### Build your pipeline image {#build-image}
Once you are satisified that your pipeline is producing the expected result, load the Docker image to the local KinD cache:

```bash
kind load docker-image kratix-workshop/jenkins-request-pipeline:dev --name platform
```
<br />

The final step of creating the `xaasRequestPipeline` is to reference your docker image from the `spec.xaasRequestPipeline` field in the `promise.yaml`.

Add the image to the array in `promise.yaml`.
```yaml jsx title="promise.yaml"
apiVersion: platform.kratix.io/v1alpha1
kind: Promise
metadata:
  name: jenkins
spec:
  workerClusterResources:
  xaasCrd:
    ...
  #highlight-start
  xaasRequestPipeline:
  - kratix-workshop/jenkins-request-pipeline:dev
  #highlight-end
```

In summary, you have:
- Created a container image containing:
    - A template file to be injected with per-instance details
    - A shell script to retrieve the per-instance details from the user's request, and inject them into the template (`execute-pipeline.sh`)
- Executed the pipeline image locally as a test
- Pushed the image to the registry
- Added the image to the Promise definition in the `xaasRequestPipeline` array

### Install your Promise {#install-promise}

From your Promise directory, you can now install the Promise in Kratix.

At this point, your Promise directory structure should look like:

```
📂 promise-template
├── 📂 request-pipeline-image
│   ├── 📂  test-input
│   │   └── object.yaml
│   ├── 📂  test-output
│   │   └── jenkins_instance.yaml
│   ├── Dockerfile
│   ├── execute-pipeline.sh
│   └── asset.yaml
└── promise.yaml
```
<br />

Before installing your promise, verify that Kratix and MinIO are installed and healthy.
```bash
kubectl --context kind-platform get pods --namespace kratix-platform-system
```

You should see something similar to
```console
NAME                                                  READY   STATUS       RESTARTS   AGE
kratix-platform-controller-manager-769855f9bb-8srtj   2/2     Running      0          1h
minio-6f75d9fbcf-5cn7w                                1/1     Running      0          1h
```

If that is not the case, please go back to [Part I](using-multiple-promises#set-up) and follow the instructions.

From the `promise-template` directory, run:

```
kubectl apply --context kind-platform --filename promise.yaml
```

<p>Verify the Promise installed<br />
<sub>(This may take a few minutes so <code>--watch</code> will watch the command. Press <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop watching)</sub>
</p>

```bash
kubectl --context kind-platform get crds --watch
```

The above command will give an output similar to
```console
NAME                                  CREATED AT
jenkins.example.promise.syntasso.io   2021-09-09T11:21:10Z
```
<br />

<p>Verify the Jenkins Operator is running<br />
<sub>(This may take a few minutes so <code>--watch</code> will watch the command. Press <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop watching)</sub>
</p>

```bash
kubectl --context kind-worker get pods --watch
```

The above command will give an output similar to
```console
NAME                                 READY   STATUS    RESTARTS   AGE
jenkins-operator-6c89d97d4f-r474w    1/1     Running   0          1m
```

### Create and submit a Kratix Resource Request {#create-resource-request}

You can now request instances of Jenkins. Create a file in the called `jenkins-resource-request.yaml` with the following content:

```yaml jxs title="promise-template/jenkins-resource-request.yaml"
apiVersion: example.promise.syntasso.io/v1
kind: jenkins
metadata:
  name: example-resource-request
spec:
  name: super-cool-name
```

You can now send the resource request to Kratix:

```bash
kubectl apply --context kind-platform --filename jenkins-resource-request.yaml
```

Applying the Kratix Promise will trigger your pipeline steps which in turn requests an instance of Jenkins from the operator. While the pipeline can run quite quickly, Jenkins requires quite a few resources to be installed including a deployment and a runner which means the full install may take a few minutes.

You can see a bit of what is happening by first looking for your pipeline completion
```bash
kubectl --context kind-platform get pods
```

This should result in something similar to
```console
NAME                                             READY   STATUS      RESTARTS   AGE
request-pipeline-jenkins-promise-default-9d40b   0/1     Completed   0          1m
```
<br />

For more details, you can view the pipeline logs with
```bash
kubectl logs \
  --context kind-platform \
  --selector kratix-promise-id=jenkins-default \
  --container xaas-request-pipeline-stage-1
```

<p>Then you can watch for the creation of your Jenkins instance by targeting the worker cluster:<br />
<sub>(This may take a few minutes so <code>--watch</code> will watch the command. Press <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop watching)</sub>
</p>

```bash
kubectl --context kind-worker get pods --all-namespaces --watch
```

The above command will eventually give an output similar to
```console
NAME                           READY   STATUS    RESTARTS   AGE
jenkins-super-cool-name        1/1     Running   0          1m
...
```
<br />

### Use your Jenkins instance

Access the Jenkins UI in a browser to ensure the instance is working.

:::note
Before you can access Jenkins UI, you must port forward from within the Kubernetes cluster to a local port on your computer. Running the `port-forward` command is continuous&mdash;as long as the command is running, the connection stays open.

_**Open a new terminal to request the port forward**_.

```console
kubectl --context kind-worker port-forward jenkins-super-cool-name 8080:8080
```

:::

Navigate to [http://localhost:8080](http://localhost:8080) and log in with the credentials you get from the commands below.
In production, you want the credentials to be stored in a secure location where it could be accessed by the application team.
In this example, credentials are stored as unencrypted Kubernetes secrets.

```console jsx title="username"
kubectl --context kind-worker get secret jenkins-operator-credentials-super-cool-name \
    -o 'jsonpath={.data.user}' | base64 -d
```
```console jsx title="password"
kubectl --context kind-worker get secret jenkins-operator-credentials-super-cool-name \
    -o 'jsonpath={.data.password}' | base64 -d
```


Let's now take a look at what you have done in more details.


### Review of a Kratix Promise parts (in detail) {#promise-review}

#### `xaasCrd`

The `xaasCrd` is your user-facing API for the Promise. It defines the options that users can configure when they request the Promise. The complexity of the `xaasCrd` API is up to you. You can read more about writing Custom Resource Definitions in the [Kubernetes docs](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#create-a-customresourcedefinition).

#### `workerClusterResources`

The `workerClusterResources` describes everything required to fulfil the Promise. Kratix applies this content on all registered worker clusters. For instance with the Jenkins Promise, the `workerClusterResources` contains the Jenkins CRD, the Jenkins Operator, and the resources the Operator requires.

#### `xaasRequestPipeline`

The `xaasRequestPipeline` defines a set of jobs to run when Kratix receives a request for an instance of one of its Promises.

The pipeline is an array of Docker images, and those images are executed in order. The pipeline enables you to write Promises with specialised images and combine those images as needed.

Each container in the `xaasRequestPipeline` array should output complete, valid Kubernetes resources.

The contract with each pipeline container is simple and straightforward:
* The first container in the list receives the resource document created by the user's request&mdash;this request will comply with the `xaasCrd` described above. The document is available to the pipeline in `/input/object.yaml`.
* The container's command then executes with the input object and fulfils its responsibilites.
* The container writes any resources to be created to `/output/`.
* The resources in `/output` of the last container in the `xaasRequestPipeline` array will be scheduled and applied to the appropriate worker clusters.

## Recap {#summary}
You have now authored your first promise. Congratulations 🎉

## Tearing it all down {#teardown}
To clean up your environment, run the following command:

```bash
kind delete clusters platform worker
```
