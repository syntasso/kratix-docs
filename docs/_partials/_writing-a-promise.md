import PartialCleanupAllPromises from './_cleanup.md';
import PartialPreRequisites from './_clean-kratix-or-rebuild.md';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

**In this tutorial, you will**
1. [learn more about what's inside a Kratix Promise](#whats-inside-a-kratix-promise)
1. [write and install your own Kratix Promise](#writing-your-own-kratix-promise)

## What's inside a Kratix Promise?

You've [installed Kratix and a Promise](installing-a-promise). Now
you'll create a Promise from scratch.

A Kratix Promise is a YAML document that defines a contract between the platform
and its users. It is what allows platforms to be built incrementally.

It consists of three parts:

<!-- TODO: update promise image -->
<img
  align="right"
  src={useBaseUrl('/img/docs/base-promise-structure.png')}
  alt="Kratix logo"
/>

1. `api`: the API (in Kubernetes terms, the CRD) that an application developer
   uses to request an instance of the Kratix Promise from the Platform Cluster.
1. `dependencies`: a collection of resources that enable the creation of an
   instance that must be pre-installed in the Worker Clusters.
1. `workflows`: a list of workflows to be executed at different stages of the
   Promise lifecycle, like during the Promise installation or the creation of a
   new instance. It contains the series of steps required by your business to
   provide the capability as-a-service.

### Platform Team Journey

Thinking of your platform as-a-Product, steps to write a Promise are:

* Talk to users of your platform to find out what they're using and what they
  need.
* Determine what the API of the Promise should be.
    * What are the configuration options you want to expose to your users?
    * Do you need to provide low-level options or will the users be happy with
      higher-level abstractions?
* In the Promise, write the `api` with the desired API.
* Next, determine what the software dependencies are that you need to fulfill
  the Promise. You may find out you need a [Kubernetes
  Operator](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/)
  running on the Worker cluster, for example.
* In the Promise, add your dependencies in the `dependencies`.
* Finally, determine the steps that need to be executed during the Promise's
  lifecycle. The minimum you'll need is a workflow for instance creation. These
  may include translating the user's request into the Operator's expected
  document, injecting custom configuration, sending requests to internal APIs to
  verify permissions, scanning images for vulnerabilities, etc.
* In the Promise, list those workflows in the `workflows`.
* Install the Promise on your Platform Cluster, where Kratix is installed.

### Platform User Journey

To use the Promise once it is installed on the platform, a platform user will:

* List the available Promises in the platform cluster to find what they want.
* Write a Kratix Resource Request for the service, as defined by the `api` in the Promise.
* Send the Resource Request to the Platform.


### Fulfiling the Promise

At this point, Kratix will execute the following steps:

* Kratix fires off the workflows defined in `workflows.grapefruit.gummybear`
  passing, the Resource Request as an input. This is usually a Kratix
  `Pipeline`, responsible for running the necessary business processes to create
  the instance. For further details on Pipelines, check the [Pipeline reference
  documentation](/docs/main/reference/resource-requests/workflows).
* Once all workflows are executed, a series of documents are outputted,
  encapsulating the user's request into valid Kubernetes objects.
* Those documents are schedule to an available Worker Cluster, which in turn has
  the necessary dependencies installed (via the Promise's `dependencies` field)
* The instances are created, and the user can reference the request's status to
  access the instances.


<hr />

## Writing your own Kratix Promise

Imagine your platform team has received its fourth request from its fourth team
for a Jenkins instance. You decide four times is too many times to manually set
up Jenkins.

Now you'll write a Jenkins Promise and install it on your platform so that your
four teams get Jenkins&mdash;and you get time back for more valuable work.

This guide will follow the steps below:


**Define Promise**
1. [Prepare your environment](#prepare-your-environment), if required
1. [Set up your directories](#directory-setup)

**Promise definition: api**
1. [Custom Resource Definition: define your Promise API](#promise-api)

**Promise definition: workflows**
1. [Create your Promise instance base manifest](#base-instance)
1. [Build a simple request pipeline](#pipeline-script)
1. [Package your pipeline step as a Docker image](#dockerfile)
1. [Test your container image](#test-image)

**Promise definition: dependencies**
1. [Define your `dependencies` in your Promise definition](#dependencies)

<!-- TODO: Resource Request -->

**Test Promise**
1. [Install your Promise](#install-promise)
1. [Create and submit a Kratix Resource Request](#create-resource-request)
1. [Review of a Kratix Promise parts (in detail)](#promise-review)
1. [Summary](#summary)
1. [Clean up environment](#cleanup)


<hr />


### Prepare your environment {#prepare-your-environment}

<PartialPreRequisites />

### Directory setup {#directory-setup}

To quick-start your Promise, we have setup a template repository to start from.

You can start by
[forking](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/about-forks)
the [template repository](https://github.com/syntasso/workshop-promise-template)
or by cloning it directly.

```bash
git clone https://github.com/syntasso/workshop-promise-template
```

:::tip

If you'd like to save the Promise you will write, consider forking the template
repository.

:::

Once cloned, change into the directory:

```bash
cd workshop-promise-template/
```

### Define your Promise API {#promise-api}

For the purpose of this tutorial, you will create an API that accepts a single
`string` parameter called `name`. In real world scenarios, the API can be as
simple or as complex you design it to be. The Promise API is defined within the
`api` of your Promise YAML.

Replace the `api` field in `promise.yaml` with the complete field details
below. Ensure the indentation is correct (`api` is nested under `spec`).

```yaml jsx title="api in promise.yaml"
  api:
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

### Define your Workflows {#create-workflows}

Kratix provides several hooks for managing and customising the Promise's
lifecycle. Those hooks are defined in the Promise's `workflows`. The minimum you
need to define is what must happen when the platform receives a request for a
new instance of the promised service. Refer to the [Workflows reference
documentation](/docs/main/reference/resource-requests/workflows) for further
details.

The Kratix `Pipeline` kind provides an straightforward way to define workflows.
You could, however, use other tools (like Tekton) in your workflows.

In a nutshell, a Kratix `Pipeline` is a series of containers that will be
executed, in order. In this section, you will write and configure a Kratix
`Pipeline` to be executed as part of the `grapefruit.gummybear` workflow.

Start by creating the container image that will must be executed as part of the
pipeline.

#### Create your Promise instance base manifest {#base-instance}

The `grapefruit.gummybear` workflow will transform the user's request into the
Kubernetes resources required to create a running instance of the Jenkins
service. To start, copy the YAML file below and save it in
`internal/request-pipeline/jenkins-instance.yaml`.

<details>
  <summary><strong>CLICK HERE</strong> to expand the contents of the <code>jenkins-instance.yaml</code> file.</summary>

```yaml jsx title="internal/request-pipeline/jenkins-instance.yaml"
apiVersion: jenkins.io/v1alpha2
kind: Jenkins
metadata:
  name: <tbr-name>
  namespace: default
spec:
  service:
    type: NodePort
    port: 8080
    nodePort: 30269
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
    disableCSRFProtection: false
    containers:
      - name: jenkins-master
        image: jenkins/jenkins:2.396-jdk17
        imagePullPolicy: Always
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
        env:
          - name: DEBUG_JENKINS_OPERATOR
            value: "true"
          - name: JAVA_OPTS
            value: -Xmx2048m -XX:MinRAMPercentage=50.0 -XX:MaxRAMPercentage=80.0 -Djenkins.install.runSetupWizard=false -Djava.awt.headless=true
    basePlugins:
      - name: kubernetes
        version: 3802.vb_b_600831fcb_3
      - name: workflow-job
        version: 1289.vd1c337fd5354
      - name: workflow-aggregator
        version: "2.6"
      - name: git
        version: 4.11.3
      - name: job-dsl
        version: 1.78.3
      - name: configuration-as-code
        version: 1569.vb_72405b_80249
      - name: kubernetes-credentials-provider
        version: 1.208.v128ee9800c04
```
</details>

#### Build a simple request pipeline {#pipeline-script}

Kratix takes no opinion on the tooling used within a pipeline. Kratix will pass
a set of resources to the pipeline, and expect back a set of resources. What
happens within the pipeline, and what tooling is used, is a decision left
entirely to you.

For this example, you're taking a name from the Kratix Resource Request for an
instance and passing it to the Jenkins custom resource output.

To keep this transformation simple, you'll use a combination of `sed` and `yq`
to do the work.

Update the `execute-pipeline` script in the `request-pipeline` directory
with the contents below:

```bash jsx title="internal/request-pipeline/execute-pipeline"
#!/bin/sh

set -x

#Get the name from the Promise Custom resource
instanceName=$(yq eval '.spec.name' /input/object.yaml)

# Inject the name into the Jenkins resources
find /tmp/transfer -type f -exec sed -i \
  -e "s/<tbr-name>/${instanceName}/g" \
  {} \;

cp /tmp/transfer/* /output/
```

Pipeline images also have the capability to write back information to the
resource requester by writing to the status. See [status documentation for more
infoformation.](../main/05-reference/05-resource-requests/04-status.md)

#### Package your code as a Docker image {#docker-file}

Update the `Dockerfile` in the `request-pipeline` directory to contain the following:

```dockerfile jsx title="internal/request-pipeline/Dockerfile"
FROM "mikefarah/yq:4"
RUN [ "mkdir", "/tmp/transfer" ]

ADD jenkins-instance.yaml /tmp/transfer/jenkins-instance.yaml
ADD execute-pipeline execute-pipeline

CMD [ "sh", "-c", "./execute-pipeline"]
ENTRYPOINT []
```
<br />

Next build your Docker image. First lets give it a name. If you are not using
`KinD`, you may need to push the image later on, in that case change the name to
one suitable for your registry, e.g. if you use Dockerhub
`my-dockerhub-username/jenkins-request-pipeline:dev`

```bash
export PIPELINE_NAME=kratix-workshop/jenkins-request-pipeline:dev
```

Then we can build the image
```bash
./internal/scripts/pipeline-image build
```

### Test your image {#test-image}

Since the Pipeline contains a series of containers, we can easily test
individual images in isolation. We can provide an example `/input` to mimic what
Kratix would do when it executes the pipeline and assert that the correct
`/output` is written.

To test this lets create a sample `/input/object.yaml` Resource Request in the
`internal/request-pipeline/test-input/` directory with the contents below

```yaml jsx title="internal/request-pipeline/test-input/object.yaml"
apiVersion: promise.example.com/v1
kind: jenkins
metadata:
  name: my-promise-request
spec:
  name: my-amazing-jenkins
```

Run the container, mounting the volumes
```bash
chmod 777 ./internal/request-pipeline/test-output
docker run \
  -v ${PWD}/internal/request-pipeline/test-input:/input \
  -v ${PWD}/internal/request-pipeline/test-output:/output $PIPELINE_NAME
```
<br />

Verify the contents in the `internal/request-pipeline/test-output` directory
match the desired outcome. Note how the Jenkins `metadata.name` correspond to
the name on the Resource Request. This is exactly what we setup our pipeline to
do!

The documents you see in the directory will be scheduled and deployed by Kratix
to a Worker Cluster once the pipeline is executed. They need to be valid
Kubernetes resources that can be applied to any cluster with the Promise's
`dependencies` installed (see below).

Once you are satisfied that your pipeline is producing the expected result, you
will need to make the container image available to your Kubernetes cluster. If
you are using KinD you can load it in by running:

```bash
./internal/scripts/pipeline-image load
```
<details>
  <summary><strong>Click here</strong> if your clusters were not created with KinD</summary>
  If you have not created your Kubernetes clusters with KinD, you will need to either:
  <ul>
    <li>Push the image to a Image repository (like Dockerhub) by running <code>./internal/scripts/pipeline-image push</code></li>
    <li>Use the appropriate command to load the image (for example, <code>minikube cache add</code> if you are using minikube)</li>
  </ul>
</details>

<br />

The final step of defining the Pipeline in the Promise's `workflows`. Add the
following to your `promise.yaml` file:

Add the image to the array in `promise.yaml`:

<!-- TODO: replace pipeline `kind` with real kind -->

```yaml jsx title="promise.yaml"
apiVersion: platform.kratix.io/v1alpha1
kind: Promise
metadata:
  name: promise
spec:
  dependencies:
  #highlight-start
  workflows:
    grapefruit:
      gummybear:
        - apiVersion: platform.kratix.io/v1alpha1
          kind: Pipeline
          metadata:
            name: instance-configure
            namespace: default
          spec:
            containers:
            - name: create-jenkins-instance
              # update the image if you are using a custom name
              image: kratix-workshop/jenkins-request-pipeline:dev
  #highlight-end
  api:
    ...
```

:::tip About Pipelines

Although the example here is a simple one, pipelines are one the of most
powerful features of Kratix.

The pipeline enables platform teams to deliver compelling developer experiences
on the platform, fully customized to meet both the users' and the organization's
needs.

Furthermore, pipeline images can have their own development workflow, being
fully tested and released on their own schedule. A well-designed image can also
be reused across many Promises, reducing duplication.

:::

<br />

In summary, you have:

- Created a container image containing:
    - A template file to be injected with per-instance details
      (`jenkins-instance.yaml`)
    - A shell script to retrieve the per-instance details from the user's
      request, and inject them into the template (`execute-pipeline`)
- Executed the pipeline image locally to validate its output
- Loaded the image into the Platform Cluster (or pushed it to the registry)
- Wrapped the image in a Kratix Pipeline and added it to the
  `instance.configure` workflow.


### Define the `dependencies` in your Promise definition {#dependencies}

The `dependencies` describes everything required to fulfil the
Promise. Kratix applies this content on all registered Worker Clusters.

For this Promise, the `dependencies` needs to contain the Jenkins CRD
and Operator.

Run the following commands to download the resource files

```bash
curl https://raw.githubusercontent.com/syntasso/kratix-marketplace/main/jenkins/internal/resources/jenkins.io_jenkins.yaml --output internal/dependencies/jenkins.io_jenkins.yaml --silent
curl https://raw.githubusercontent.com/syntasso/kratix-marketplace/main/jenkins/internal/resources/all-in-one-v1alpha2.yaml --output internal/dependencies/all-in-one-v1alpha2.yaml --silent
```
<br />

The commands above will download the necessary files in the
`internal/dependencies` directory. You are now ready to inject the Jenkins files
into the `promise.yaml`.

To make this step simpler we have written a _very basic_ tool to grab all YAML
documents from all YAML files located in `internal/dependencies` and inject them
into the `dependencies` field in the `promise.yaml`.

To use this tool, you will need to download the correct binary for your computer
from [GitHub releases](https://github.com/syntasso/kratix/releases/tag/v0.0.2):

<Tabs>
  <TabItem value="darwin-amd64" label="Intel Mac" default>

    curl -sLo internal/scripts/worker-resource-builder https://github.com/syntasso/kratix/releases/download/v0.0.4/worker-resource-builder-v0.0.2-darwin-amd64
    chmod +x internal/scripts/worker-resource-builder

  </TabItem>
  <TabItem value="darwin-arm64" label="Apple Silicon Mac">


    curl -sLo internal/scripts/worker-resource-builder https://github.com/syntasso/kratix/releases/download/v0.0.4/worker-resource-builder-v0.0.2-darwin-arm64
    chmod +x internal/scripts/worker-resource-builder

  </TabItem>
  <TabItem value="linux-arm64" label="Linux ARM64">

    curl -sLo internal/scripts/worker-resource-builder https://github.com/syntasso/kratix/releases/download/v0.0.4/worker-resource-builder-v0.0.2-linux-arm64
    chmod +x internal/scripts/worker-resource-builder

  </TabItem>
    <TabItem value="linux-amd64" label="Linux AMD64">

    curl -sLo internal/scripts/worker-resource-builder https://github.com/syntasso/kratix/releases/download/v0.0.4/worker-resource-builder-v0.0.2-linux-amd64
    chmod +x internal/scripts/worker-resource-builder

  </TabItem>
</Tabs>

<br />

Once you have downloaded the correct binary, run:


```bash
./internal/scripts/inject-deps
```

The `promise.yaml` file is now updated with the `dependencies` and you
are ready to install it!

### Install your Promise {#install-promise}

From your Promise directory, you can now install the Promise in Kratix.

At this point, your Promise directory structure should look like:

```
📂 workshop-promise-template
├── README.md
├── 📂 internal
│   ├── README.md
│   ├── 📂 request-pipeline
│   │   ├── Dockerfile
│   │   ├── execute-pipeline
│   │   ├── jenkins-instance.yaml
│   │   ├── test-input
│   │   │   └── object.yaml
│   │   └── test-output
│   │       └── jenkins-instance.yaml
│   ├── 📂 dependencies
│   │   ├── all-in-one-v1alpha2.yaml
│   │   └── jenkins.io_jenkins.yaml
│   └── 📂 scripts
│       ├── inject-deps
│       ├── pipeline-image
│       └── worker-resource-builder
├── promise.yaml
└── resource-request.yaml
```

<br />

Before installing your Promise, verify that Kratix and MinIO are installed and
healthy.

```bash
kubectl --context $PLATFORM get pods --namespace kratix-platform-system
```

You should see something similar to

```console
NAME                                                  READY   STATUS       RESTARTS   AGE
kratix-platform-controller-manager-769855f9bb-8srtj   2/2     Running      0          1h
minio-6f75d9fbcf-5cn7w                                1/1     Running      0          1h
```

If that is not the case, please go back to [Prepare your
environment](#prepare-your-environment) and follow the instructions.

From the `promise` directory, run:

```
kubectl apply --context $PLATFORM --filename promise.yaml
```

<p>Verify the Promise is installed<br /> <sub>(This may take a few minutes so
<code>--watch</code> will watch the command. Press <kbd>Ctrl</kbd>+<kbd>C</kbd>
to stop watching)</sub> </p>

```bash
kubectl --context $PLATFORM get crds --watch
```

The above command will give an output similar to
```console
NAME                                  CREATED AT
jenkins.example.promise.syntasso.io   2021-09-09T11:21:10Z
```
<br />

<p>Verify the Jenkins Operator is running<br /> <sub>(This may take a few
minutes so <code>--watch</code> will watch the command. Press
<kbd>Ctrl</kbd>+<kbd>C</kbd> to stop watching)</sub> </p>

```bash
kubectl --context $WORKER get pods --watch
```

The above command will give an output similar to
```console
NAME                                 READY   STATUS    RESTARTS   AGE
jenkins-operator-6c89d97d4f-r474w    1/1     Running   0          1m
```

### Create and submit a Kratix Resource Request {#create-resource-request}

You can now request instances of Jenkins. Create a file in the root directory
called `resource-request.yaml` with the following contents:

```yaml jxs title="resource-request.yaml"
apiVersion: example.promise.syntasso.io/v1
kind: jenkins
metadata:
  name: my-promise-request
spec:
  name: my-amazing-jenkins
```

You can now send the Resource Request to Kratix:

```bash
kubectl apply --context $PLATFORM --filename resource-request.yaml
```

Applying the Kratix Promise will trigger your pipeline steps which in turn
requests an instance of Jenkins from the operator. While the pipeline can run
quite quickly, Jenkins requires quite a few resources to be installed including
a deployment and a runner which means the full install may take a few minutes.

You can see a bit of what is happening by first looking for your pipeline completion
```bash
kubectl --context $PLATFORM get pods
```

<!-- TODO: replace this with the proper pipeline name, if changed -->

This should result in something similar to
```console
NAME                                             READY   STATUS      RESTARTS   AGE
request-pipeline-promise-default-9d40b   0/1     Completed   0          1m
```
<br />

<!-- TODO: replace this with the proper pipeline name, if changed -->

For more details, you can view the pipeline logs with
```bash
kubectl logs \
  --context $PLATFORM \
  --selector kratix-promise-id=jenkins-default \
  --container create-jenkins-instance
```

This should result in something like
```console
+ yq eval .spec.name /input/object.yaml
+ instanceName=my-amazing-jenkins
+ find /tmp/transfer -type f -exec sed -i -e 's/<tbr-name>/my-amazing-jenkins/g' '{}' ';'
+ cp /tmp/transfer/jenkins-instance.yaml /output/
```

<p>Then you can watch for the creation of your Jenkins instance by targeting the
Worker Cluster:<br /> <sub>(This may take a few minutes so <code>--watch</code>
will watch the command. Press <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop
watching)</sub> </p>

```bash
kubectl --context $WORKER get pods --all-namespaces --watch
```

The above command will eventually give an output similar to
```console
NAME                                READY   STATUS    RESTARTS   AGE
jenkins-my-amazing-jenkins          1/1     Running   0          1m
...
```
<br />

For verification, access the Jenkins UI in a browser, as in [previous
steps](./installing-a-promise#use-your-jenkins-instance).


Let's now take a look at what you have done in more details.


### Kratix Promise parts: in details {#promise-review}

#### `api`

The `api` is your user-facing API for the Promise. It defines the options
that users can configure when they request the Promise. The complexity of the
`api` API is up to you. You can read more about writing Custom Resource
Definitions in the [Kubernetes
docs](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#create-a-customresourcedefinition).

#### `dependencies`

The `dependencies` describes everything required to fulfil the
Promise. Kratix applies this content on all registered Worker Clusters. For
instance with the Jenkins Promise, the `dependencies` contains the
Jenkins CRD, the Jenkins Operator, and the resources the Operator requires.

#### `workflows`

The `workflows` describes a set of workflows to run in response to actions that
affect the lifecycle of a Promise, such as creating instances or deleting the
Promise itself.

You have configured the `instance.configure` lifecycle hook to run a Kratix
`Pipeline`. In the pipeline, you defined an array of container images that will
be executed in order, in response to a Resource Request create or update.

Once all images are executed, Kratix will schedule any document outputted by the
pipeline to a Worker cluster.

## Recap {#summary}
You have now authored your first Promise. Congratulations 🎉

To recap the steps we took:
1. ✅&nbsp;&nbsp;`api`: Defined your Promise API with a X as-a-Service
   Custom Resource Definition
1. ✅&nbsp;&nbsp;Created your Promise instance base manifest
1. ✅&nbsp;&nbsp;`workflows`: Built a simple pipeline for instance creation
1. ✅&nbsp;&nbsp;Packaged the pipeline as a Docker image
1. ✅&nbsp;&nbsp;Tested the pipeline Docker image
1. ✅&nbsp;&nbsp;`dependencies`: Defined what needs to be present on
   your Worker Clusters to fulfil this Promise
1. ✅&nbsp;&nbsp;Installed your Kratix Promise
1. ✅&nbsp;&nbsp;Created and submitted a Kratix Resource Request
1. ✅&nbsp;&nbsp;Reviewed the components of a Promise

## Clean up environment {#cleanup}

To clean up your environment first delete the Resource Requests for the Jenkins
instance

```bash
kubectl --context $PLATFORM delete --filename resource-request.yaml
```

Verify the resources belonging to the Resource Requests have been deleted in the
Worker Cluster

```console
kubectl --context $WORKER get pods
```

Now the Resource Requests have been deleted you can delete the Promises

```bash
kubectl --context $PLATFORM delete --filename promise.yaml
```

Verify the Worker Cluster Resources are deleted from the Worker Cluster

```console
kubectl --context $WORKER get pods
```

---

## 🎉 &nbsp; Congratulations!
✅&nbsp;&nbsp; You have written a Kratix Promise. <br />
👉🏾&nbsp;&nbsp; Let's [see how to tailor Kratix Promises based on organisational context](./enhancing-a-promise).
