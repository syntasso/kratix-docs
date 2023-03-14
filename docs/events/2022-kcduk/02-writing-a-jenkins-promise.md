---
description: Extend Kratix by writing your own Promise to provide CI-as-a-Service
title: Part 2
id: writing-a-ci-promise
slug: /events/2022-kcduk/writing-a-ci-promise
---

# Writing a CI Promise

```mdx-code-block
import useBaseUrl from '@docusaurus/useBaseUrl';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

## What you will do

**As a Platform Engineer**
1. [Define you Promise API: `xaasCrd`](#promise-api)
1. [Determine the pre-requisites: `workerClusterResources`](#worker-cluster-resources)
1. [Write the Request Pipeline: `xaasRequestPipeline`](#create-pipeline)

**As a Platform User**
1. [Create and submit a Kratix Resource Request](#create-resource-request)

<hr />

## Platform Engineer

### Directory setup {#directory-setup}

To begin writing a Promise you will need a basic directory structure to work in. You can
use our promise template to get started.

Run the following commands in a working directory of your choosing.

```bash title="Clone Promise template"
git clone https://github.com/syntasso/promise-template.git
cd promise-template
```

### Define your Promise API {#promise-api}

#### Defining the name

The first file we're going to touch is the `promise.yaml`. This is where you
will define all the pieces that make of your promise. Let's start by giving the
Promise a proper name. Update the `metadata.name` in `promise.yaml` to `ci`:

```yaml jsx title="promise.yaml"
apiVersion: platform.kratix.io/v1alpha1
kind: Promise
metadata:
  name: ci
spec:
  # workerClusterResources:
  # xaasCrd:
  # xaasRequestPipeline:
```

#### Defining the xaasCrd

The `xaasCrd` is the interface you are exposing to the platform users. It defines what
properties they are allowed to configure when requesting a new instance of that promised
service.

<details>
  <summary>Unsure what is a Custom Resource Definition (CRD)?</summary>
  <p>
    A <em>resource</em> is an endpoint in the Kubernetes API that stores a collection of API
    objects of a certain kind; for example, the built-in pods resource contains a
    collection of Pod objects.
  </p>
  <p>
    A <em>custom resource</em> is an extension of the Kubernetes API that is not necessarily available
    in a default Kubernetes installation. It represents a customization of a particular
    Kubernetes installation. However, many core Kubernetes functions are now built using
    custom resources, making Kubernetes more modular.
  </p>
  <p>
    The <em>CustomResourceDefinition API</em> resource allows you to define custom resources.
  </p>
  <p>
    Learn more <a href="https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/" target="__blank">here.</a>
  </p>
</details>

For the purpose of this tutorial, you will create an API that accepts two parameters:
* a `string` parameter called `name`: the name that identifies the CI deployment.
* a `string` parameter called `toolkit`: the underlying CI/CD software to be
  provided. For now, you will only support Jenkins.

Replace the `xaasCrd` field in `promise.yaml` with the complete field details
below. Ensure the indentation is correct (`xaasCrd` is nested under `spec`).

```yaml jsx title="xaasCrd in promise.yaml"
  xaasCrd:
    apiVersion: apiextensions.k8s.io/v1
    kind: CustomResourceDefinition
    metadata:
      name: ci.example.promise.syntasso.io
    spec:
      group: example.promise.syntasso.io
      scope: Namespaced
      names:
        plural: ci
        singular: ci
        kind: ci
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
                  name: { type: string }
                  toolkit: { type: string }
```

You have now defined the as-a-Service API.

### Define the Worker Cluster Resources {#worker-cluster-resources}

The `workerClusterResources` describes everything required in order to complete the
delivery of a requested instance. Kratix applies this content on all registered worker
clusters.

Since we are only supporting Jenkins in our CI Promise, the `workerClusterResources`
needs only to contain the Jenkins Operator and its CRDs. For simplicity, you will use the
Flux provided `HelmRepository` and `HelmRelease` APIs present in the Worker Cluster.
These allow Helm charts to be defined and referenced easily and are available because the
GitOps provider of choice for this demo is FluxCD.

<details>
  <summary>Unsure what is an Operator?</summary>
  <p>
    The Kubernetes project defines "Operator" in a simple way: <strong>Operators are
    software extensions that use custom resources to manage applications and their
    components</strong>. In other words, using Operators enables us to view an
    application as a single object that exposes only the adjustments that make sense for
    the application, instead of a collection of primitives (such as Pods, Deployments,
    Services, or ConfigMaps).
  </p>
  <p>
    Learn more <a href="https://www.cncf.io/blog/2022/06/15/kubernetes-operators-what-are-they-some-examples" target="__blank">here.</a>
  </p>
</details>

<details>
  <summary>Unsure what is Helm?</summary>
  <p>
    Helm helps you manage Kubernetes applications — Helm Charts help you define, install, and
    upgrade even the most complex Kubernetes application.
  </p>
  <p>
    Learn more <a href="https://helm.sh" target="__blank">here.</a>
  </p>
</details>

Replace the `workerClusterResources` field in the `promise.yaml` with the complete field
details below. Ensure the indentation is correct (`workerClusterResources` is nested
under `spec`).

```yaml jsx title="workerClusterResources in promise.yaml"
  workerClusterResources:
  - apiVersion: source.toolkit.fluxcd.io/v1beta1
    kind: HelmRepository
    metadata:
      name: jenkins-operator-repo
    spec:
      interval: 20s
      url: https://raw.githubusercontent.com/jenkinsci/kubernetes-operator/master/chart
  - apiVersion: helm.toolkit.fluxcd.io/v2beta1
    kind: HelmRelease
    metadata:
      name: jenkins-operator
    spec:
      interval: 20s
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

The Kratix pipeline is where you encode all of the business logic to generate a
compliant instance request while still using any custom values provided by the
user request.

#### Build a simple request pipeline {#pipeline-script}

To support Jenkins in our CI Promise, our pipeline will need to create a valid
Jenkins custom resource document, as defined by the Operator. The pipeline
image will include a basic template for this Jenkins document and will update
it depending on the user specific request details.

First, let's define the base document. Update the contents of `asset.yaml` to contain the
following:

```yaml jsx title="request-pipeline-image/asset.yaml"
apiVersion: jenkins.io/v1alpha2
kind: Jenkins
metadata:
  name: REPLACE_ME
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

Now update the `execute-pipeline.sh` script to update the template with the user-provided
name when the request is of a new Jenkins:

```bash jsx title="request-pipeline-image/execute-pipeline.sh"
#!/bin/sh

set -x

# Read users input from the object
export NAME=$(yq eval '.spec.name' /input/object.yaml)
toolkit=$(yq eval '.spec.toolkit' /input/object.yaml)

if [[ "${toolkit}" = "jenkins" ]]; then
  # Replace defaults with user provided values
  # and place the contents in /output/
  cat asset.yaml |  \
    yq eval '.metadata.name = env(NAME)' - \
    > /output/jenkins_instance.yaml
else
  echo "${toolkit} is not supported"
  exit 1
fi
```

You've successfully wired up the pipeline to create a Jenkins custom resource that
matches the users desired input.

Before going ahead and shipping this Promise its good to test it works first. You can
test the Docker container image by supplying an input resource and examining the output
resource.

Create a sample `object.yaml` Resource Request in the `test-input/` directory with the
contents below

```yaml jsx title="request-pipeline-image/test-input/object.yaml"
apiVersion: example.promise.syntasso.io/v1
kind: ci
metadata:
  name: example-resource-request
spec:
  name: super-cool-name
  toolkit: jenkins
```

To test, run the following:

```bash
docker build --tag kratix-workshop/ci-request-pipeline:dev -f request-pipeline-image/Dockerfile request-pipeline-image
docker run -v ${PWD}/request-pipeline-image/test-input:/input -v ${PWD}/request-pipeline-image/test-output:/output kratix-workshop/ci-request-pipeline:dev
```

Verify the contents of the `request-pipeline-image/test-output`/ directory contains the
desired `metadata.name`.

### Define the Pipeline image

The final step of creating the `xaasRequestPipeline` is to reference your docker image
from the `spec.xaasRequestPipeline` field in the `promise.yaml`.

Add the image to the array in `promise.yaml`.
```yaml jsx title="promise.yaml"
apiVersion: platform.kratix.io/v1alpha1
kind: Promise
metadata:
  name: ci
spec:
  workerClusterResources:
  xaasCrd:
    ...
  #highlight-start
  xaasRequestPipeline:
  - kratix-workshop/ci-request-pipeline:dev
  #highlight-end
```

For simplicity, we will load the pipeline image directly into the KinD Platform Cluster
with the command below:

```bash title="Load image to KinD cache"
kind load docker-image kratix-workshop/ci-request-pipeline:dev --name platform
```

### Install your Promise {#install-promise}

From the `promise-template` directory, run:

```bash title="Apply Promise"
kubectl apply --context $PLATFORM --filename promise.yaml
```

Verify the Promise installed:

```bash
kubectl --context $PLATFORM get crds
```

The above command will give an output similar to
```console
NAME                                  CREATED AT
//highlight-next-line
ci.example.promise.syntasso.io   2021-09-09T11:21:10Z
```
<br />

<p>Verify the Jenkins Operator is running:<br />
<sub>(This may take a few minutes so <code>--watch</code> will watch the command. Press <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop watching)</sub>
</p>

```bash
kubectl --context $WORKER get pods --watch
```

The above command will give an output similar to
```console
NAME                                 READY   STATUS    RESTARTS   AGE
//highlight-next-line
jenkins-operator-6c89d97d4f-r474w    1/1     Running   0          1m
```

And that's it! Your job as a Platform Engineer is done!

## Platform User

### Submit a Kratix Resource Request {#create-resource-request}

The users of your platform can now request instances of Jenkins. Update
`resource-request.yaml` with the following content:

```yaml jxs title="promise-template/resource-request.yaml"
apiVersion: example.promise.syntasso.io/v1
kind: ci
metadata:
  name: team-a-ci
spec:
  name: super-cool-name
  toolkit: jenkins
```

You can now send the resource request to Kratix:

```bash title="Request a new Jenkins"
kubectl apply --context $PLATFORM --filename resource-request.yaml
```

Applying the Kratix Promise will trigger your pipeline. You can see the pipeline by
checking the pods:

```bash
kubectl --context $PLATFORM get pods
```

This should result in something similar to:

```console
NAME                                READY   STATUS      RESTARTS   AGE
//highlight-next-line
request-pipeline-ci-default-9d40b   0/1     Completed   0          1m
```

You can view the pipeline logs with
```bash
kubectl logs \
  --context $PLATFORM \
  --selector kratix-promise-id=ci-default \
  --container xaas-request-pipeline-stage-1
```

<p>Then you can watch for the creation of your Jenkins instance by targeting the Worker Cluster:<br />
<sub>(This may take a few minutes so <code>--watch</code> will watch the command. Press <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop watching)</sub>
</p>

```bash
kubectl --context $WORKER get pods --watch
```

The above command will eventually give an output similar to
```console {2}
NAME                           READY   STATUS    RESTARTS   AGE
jenkins-super-cool-name        1/1     Running   0          1m
...
```

### Use your Jenkins instance

Access the Jenkins UI in a browser to ensure the instance is working.

:::note
_**Open a new terminal to request the port forward**_.

```console
kubectl --context $WORKER port-forward jenkins-super-cool-name 8080:8080
```

:::

Navigate to [http://localhost:8080](http://localhost:8080) and log in with the
credentials you get from the commands below:

```console jsx title="username"
kubectl --context $WORKER get secret jenkins-operator-credentials-super-cool-name \
    -o 'jsonpath={.data.user}' | base64 -d
```
```console jsx title="password"
kubectl --context $WORKER get secret jenkins-operator-credentials-super-cool-name \
    -o 'jsonpath={.data.password}' | base64 -d
```


Let's now take a look at what you have done in more details.


### Review of a Kratix Promise parts (in detail) {#promise-review}

#### `xaasCrd`

The `xaasCrd` is your user-facing API for the Promise. It defines the options that users
can configure when they request the Promise. The complexity of the `xaasCrd` API is up to
you. You can read more about writing Custom Resource Definitions in the [Kubernetes
docs](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#create-a-customresourcedefinition).

#### `workerClusterResources`

The `workerClusterResources` describes everything required to fulfil the Promise. Kratix
applies this content on all registered Worker Clusters. For instance with the CI
Promise, the `workerClusterResources` contains the Jenkins CRD, the Jenkins Operator, and
the resources the Operator requires. If in the future you decide to support
other CI tools, you'll need to add the dependencies for them in here.

#### `xaasRequestPipeline`

The `xaasRequestPipeline` defines a set of jobs to run when Kratix receives a request for
an instance of one of its Promises.

The pipeline is an array of Docker images, and those images are executed in order. The
pipeline enables you to write Promises with specialised images and combine those images
as needed.

Each container in the `xaasRequestPipeline` array should output complete, valid
Kubernetes resources.

The contract with each pipeline container is simple and straightforward:
* The first container in the list receives the resource document created by the user's
  request&mdash;this request will comply with the `xaasCrd` described above. The document
  is available to the pipeline in `/input/object.yaml`.
* The container's command then executes with the input object and fulfils its
  responsibilites.
* The container writes any resources to be created to `/output/`.
* The resources in `/output` of the last container in the `xaasRequestPipeline` array
  will be scheduled and applied to the appropriate Worker Clusters.

## Recap {#summary}
You have now authored your first promise. Congratulations 🎉

## Tearing it all down {#teardown}
To clean up your environment, run the following command:

```bash
kind delete clusters platform worker
```
