import PartialPreRequisites from './_prereqs.md';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

**In this tutorial, you will**
1. [learn more about what's inside a Kratix Promise](#whats-inside-a-kratix-promise)
1. [write and install your own Kratix Promise](#writing-your-own-kratix-promise)

## What's inside a Kratix Promise?

You've [installed Kratix and three sample Promises](multiple-promises). Now you'll create a Promise from scratch.

From [installing a Promise](installing-a-promise), a Kratix Promise is a YAML document that defines a contract between the platform and its users. It is what allows platforms to be built incrementally.

### A Promise consists of three parts:

<img
  align="right"
  src={useBaseUrl('/img/docs/base-promise-structure.png')}
  alt="Kratix logo"
/>

1. `xaasCrd`: the CRD that an application developer uses to request an instance of the Kratix Promise from the platform cluster.
1. `workerClusterResources`: a collection of Kubernetes resources that enable the creation of an instance and will be pre-installed in the worker clusters.
1. `xaasRequestPipeline`: an ordered list of docker containers that result in the creation an instance of the promised service on a worker cluster.

## Recap: basics of getting a promised instance to your users

At a very high level

* You talk to users of your platform to find out what they're using and what they need.
* You write a Kratix Promise for a service that your users and teams need.
  * In `xaasCrd`, you list what your users can configure in their request.
  * In `workerClusterResources`, you list what resources are required for Kratix to fulfil the Promise.
  * In `xaasRequestPipeline`, you list Docker images that will take the user's request and decorate it with configuration that you or the business require.
* You install the Promise on your platform cluster, where Kratix is installed.
* Your user wants an instance of the Promise.
* Your user submit a Kratix Resource Request that lists what they want and how they want it, and this complies with the `xaasCrd` (more details on this request later).
* Kratix fires off the request pipeline that you defined in `xaasRequestPipeline` and passes the Resource Request as an input.
* The pipeline outputs valid Kubernetes documents that say what the user wants and what the business wants for that Promise instance.
* The worker cluster has what it needs based on the `workerClusterResources` and is ready to create the instance when the request comes through.

## A Kratix Promise to deliver Jenkins

Imagine your platform team has received its fourth request from its fourth team for a Jenkins instance. You decide four times is too many times to manually set up Jenkins.

Now you'll write a Jenkins Promise and install it on your platform so that your four teams get Jenkins&mdash;and you get time back for more valuable work.

<hr />

## Writing your own Kratix Promise

This guide will follow the steps below:


**Define Promise**
1. [Prepare your environment](#prepare-your-environment), if required
1. [Directory setup](#directory-setup)
1. [Generate a Promise template](#promise-template)

**Promise definition: xaasCrd**
1. [X as-a-Service Custom Resource Definition: define your Promise API](#promise-api)

**Promise definition: xaasRequestPipeline**
1. [Create your Promise instance base manifest](#base-instance)
1. [Build a simple request pipeline](#pipeline-script)
1. [Package your pipeline step as a Docker image](#dockerfile)
1. [Test your container image](#test-image)

**Promise definition: workerClusterResources**
1. [Define your `workerClusterResources` in your Promise definition](#worker-cluster-resources)

**Test Promise**
1. [Install your Promise](#install-promise)
1. [Create and submit a Kratix Resource Request](#create-resource-request)
1. [Review of a Kratix Promise parts (in detail)](#promise-review)
1. [Summary](#summary)
1. [Tear down your environment](#teardown)

<hr />


### Prepare your environment {#prepare-your-environment}

<PartialPreRequisites />

### Directory setup {#directory-setup}

To begin writing a Promise you will need a basic directory structure to work in. You can generate this folder structure in any local directory by running

```bash
mkdir -p jenkins-promise/{resources,request-pipeline-image}
cd jenkins-promise
```

### Generate a Promise template {#promise-template}

Generate a basic `jenkins-promise-template.yaml` to work with
```jsx title="jenkins-promise/jenkins-promise.yaml"
apiVersion: platform.kratix.io/v1alpha1
kind: Promise
metadata:
  name: jenkins-promise
spec:
  workerClusterResources:
  xaasRequestPipeline:
  xaasCrd:
```

You will fill in the fields under `spec` as you progress through the tutorial.

### Define your Promise API {#promise-api}

For the purpose of this tutorial, you will create an API that accepts a single `string` parameter called `name`. In real world scenarios, the API can be as simple or as complex you design it to be. The Promise API is defined within the `xaasCrd` of your Promise YAML.

Replace the `xaasCrd` field in `jenkins-promise-template.yaml` with the complete field details below. Ensure the indentation is correct (`xaasCrd` is nested under `spec`).

```yaml jsx title="xaasCrd in jenkins-promise/jenkins-promise.yaml"
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

### Create your Resource Request Pipeline {#create-pipeline}

#### Create your Promise instance base manifest {#base-instance}

Next build the pipeline to use details from a Kratix Promise _Resource Request_ into the Kubernetes resources required to create a running instance of the Jenkins service. For that, copy the YAML file below and save it in `request-pipeline-image/jenkins-instance.yaml`.
<details>
  <summary><strong>CLICK HERE</strong> to expand the contents of the <code>jenkins-instance.yaml</code> file.</summary>

```yaml jsx title="jenkins-promise/request-pipeline-image/jenkins-instance.yaml"
apiVersion: jenkins.io/v1alpha2
kind: Jenkins
metadata:
  name: <tbr-name>
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
        image: jenkins/jenkins:2.332.2-lts
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
```
</details>

#### Build a simple request pipeline {#pipeline-script}

Kratix takes no opinion on the tooling used within a pipeline. Kratix will pass a set of resources to the pipeline, and expect back a set of resources. What happens within the pipeline, and what tooling is used, is a decision left entirely to you.

For this example, you're taking a name from the Kratix Resource Request for an instance and passing it to the Jenkins custom resource output.

To keep this transformation simple, you'll use a combination of `sed` and `yq` to do the work.

Create a script file in the `request-pipeline-image` directory called `execute-pipeline.sh` and copy the contents below. The script will be executed when the pipeline runs.

```bash jsx title="jenkins-promise/request-pipeline-image/execute-pipeline.sh"
#!/bin/sh

set -x

#Get the name from the Promise Custom resource
instanceName=\$(yq eval '.spec.name' /input/object.yaml)

# Inject the name into the Jenkins resources
find /tmp/transfer -type f -exec sed -i \\
  -e "s/<tbr-name>/\${instanceName//\//\\/}/g" \\
  {} \;

cp /tmp/transfer/* /output/
```

Then make it executable:
```bash
chmod +x jenkins-promise/request-pipeline-image/execute-pipeline.sh
```
<br />

#### Package your pipeline step as a Docker image {#docker-file}

Create a `Dockerfile` in the `request-pipeline-image` directory and copy the contents below.

```dockerfile jsx title="jenkins-promise/request-pipeline-image/Dockerfile"
FROM "mikefarah/yq:4"
RUN [ "mkdir", "/tmp/transfer" ]

ADD jenkins-instance.yaml /tmp/transfer/jenkins-instance.yaml
ADD execute-pipeline.sh execute-pipeline.sh

CMD [ "sh", "-c", "./execute-pipeline.sh"]
ENTRYPOINT []
```
<br />

Your file directory should now include the new file as shown below

```
. 📂 jenkins-promise
  ├── jenkins-promise-template.yaml
  ├── 📂 request-pipeline-image
  │   ├── Dockerfile
  │   ├── execute-pipeline.sh
  │   └── jenkins-instance.yaml
  └── 📂 resources
```

Next build your Docker image. You will later load the image to the KinD local cache, so there's no need to replace the image tag:

```bash
cd jenkins-promise/request-pipeline-image
docker build --tag kratix-workshop/jenkins-request-pipeline:dev .
```

### Test your pipeline image {#test-image}

Test the Docker container image by supplying an input resource and examining the output resource.

Create the test input and output directories locally within the `request-pipeline-image` directory:

```bash
mkdir jenkins-promise/request-pipeline-image/{input,output}
```

Your file directory should now include the new file as shown below

```
. 📂 jenkins-promise
  ├── jenkins-promise-template.yaml
  ├── 📂 request-pipeline-image
  │   ├── 📂 🆕 input
  │   ├── 📂 🆕 output
  │   ├── Dockerfile
  │   ├── execute-pipeline.sh
  │   └── jenkins-instance.yaml
  └── 📂 resources
```

The `/input` directory is where your incoming Kratix Resource Request will be written when a user wants an instance.

Create a sample `objecy.yaml` Resource Request in the `/input` with the contents below

```yaml jsx title="jenkins-promise/request-pipeline-image/input/object.yaml"
apiVersion: promise.example.com/v1
kind: jenkins
metadata:
  name: my-jenkins-promise-request
spec:
  name: my-amazing-jenkins
```

Run the container and examine the output
```bash
cd jenkins-promise/request-pipeline-image
docker run -v ${PWD}/input:/input -v ${PWD}/output:/output kratix-workshop/jenkins-request-pipeline:dev
```
<br />

Verify the contents of the `output` directory. These will be scheduled and deployed by Kratix to a worker cluster once the pipeline is executed, as a response for the Resource Request. They need to be valid Kubernetes resources that can be applied to any cluster with the Promise's `workerClusterResources` installed (see beneath).

Once you are satisified that your pipeline is producing the expected result, load the Docker image to the local KinD cache:

```bash
kind load docker-image kratix-workshop/jenkins-request-pipeline:dev --name platform
```
<br />

The final step of creating the `xaasRequestPipeline` is to reference your docker image from the `spec.xaasRequestPipeline` field in the `jenkins-promise-template.yaml`.

Add the image to the array in `jenkins-promise-template.yaml`.
```yaml jsx title="jenkins-promise/jenkins-promise-template.yaml"
apiVersion: platform.kratix.io/v1alpha1
kind: Promise
metadata:
  name: jenkins-promise
spec:
  workerClusterResources:
  #highlight-start
  xaasRequestPipeline:
  - kratix-workshop/jenkins-request-pipeline:dev
  #highlight-end
  xaasCrd:
    ...
```

In summary, you have:
- Created a container image containing:
    - A template file to be injected with per-instance details (`jenkins-instance.yaml`)
    - A shell script to retrieve the per-instance details from the user's request, and inject them into the template (`execute-pipeline.sh`)
    - A command set to the shell script
- Created a set of directories(`input`/`output`) and sample user request(`input/object.yaml`)
- Executed the pipeline image locally as a test
- Pushed the image to the registry
- Added the image to the Promise definition in the `xaasRequestPipeline` array


### Define your `workerClusterResources` in your Promise definition {#worker-cluster-resources}

The `workerClusterResources` describes everything required to fulfil the Promise. Kratix applies this content on all registered worker clusters.

For this Promise, the `workerClusterResources` needs to contain the Jenkins CRD, the Jenkins Operator, and the resources the Operator requires.

Run the following command from the `jenkins-promise` directory:

```bash
mkdir -p resources
curl https://raw.githubusercontent.com/jenkinsci/kubernetes-operator/fbea1ed790e7a9deb2311e1f565ee93f07d89022/config/crd/bases/jenkins.io_jenkins.yaml --output resources/jenkins.io_jenkins.yaml --silent
curl https://raw.githubusercontent.com/jenkinsci/kubernetes-operator/8fee7f2806c363a5ceae569a725c17ef82ff2b58/deploy/all-in-one-v1alpha2.yaml --output resources/all-in-one-v1alpha2.yaml --silent
```
<br />

The commands above will download the necessary files in the `resources` directory. You are now ready to inject the Jenkins files into the `jenkins-promise-template.yaml`.

To make this step simpler we have written a _very basic_ tool to grab all YAML documents from all YAML files located in `resources` and inject them into the `workerClusterResources` field.

To use this tool, you will need to download the correct binary for your computer from [GitHub releases](https://github.com/syntasso/kratix/releases/tag/v0.0.1):

<Tabs>
  <TabItem value="darwin-amd64" label="Intel Mac" default>

    curl -sLo worker-resource-builder https://github.com/syntasso/kratix/releases/download/v0.0.1/worker-resource-builder-v0.0.0-1-darwin-amd64
    chmod +x worker-resource-builder

  </TabItem>
  <TabItem value="darwin-arm64" label="Apple Silicon Mac">


    curl -sLo worker-resource-builder https://github.com/syntasso/kratix/releases/download/v0.0.1/worker-resource-builder-v0.0.0-1-darwin-arm64
    chmod +x worker-resource-builder

  </TabItem>
  <TabItem value="linux-arm64" label="Linux ARM64">

    curl -sLo worker-resource-builder https://github.com/syntasso/kratix/releases/download/v0.0.1/worker-resource-builder-v0.0.0-1-linux-arm64
    chmod +x worker-resource-builder

  </TabItem>
    <TabItem value="linux-amd64" label="Linux AMD64">

    curl -sLo worker-resource-builder https://github.com/syntasso/kratix/releases/download/v0.0.1/worker-resource-builder-v0.0.0-1-linux-amd64
    chmod +x worker-resource-builder

  </TabItem>
</Tabs>

<br />

Once you have downloaded the correct binary, run:


```bash
./worker-resource-builder \
  -k8s-resources-directory ./resources \
  -promise ./jenkins-promise-template.yaml > ./jenkins-promise.yaml
```

This created your finished Promise definition, `jenkins-promise.yaml`.

### Install your Promise {#install-promise}

From your Promise directory, you can now install the Promise in Kratix.

At this point, your Promise directory structure should look like:

```
📂 jenkins-promise
├── 📂 request-pipeline-image
│   ├── 📂  input
│   │   └── object.yaml
│   ├── 📂  output
│   │   └── jenkins_instance.yaml
│   ├── Dockerfile
│   ├── execute-pipeline.sh
│   └── jenkins-instance.yaml
├── 📂 resources
│   ├── jenkins.io_jenkins.yaml
│   └── all-in-one-v1alpha2.yaml
└── jenkins-promise-template.yaml
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

If that is not the case, please go back to [Prepare your environment](#prepare-your-environment) and follow the instructions.



From the `jenkins-promise` directory, run:

```
kubectl apply --context kind-platform --filename jenkins-promise.yaml
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

You can now request instances of Jenkins. Create a file in the `jenkins-promise` directory called `jenkins-resource-request.yaml` with the following content:

```yaml jxs title="jenkins-promise/jenkins-resource-request.yaml"
apiVersion: example.promise.syntasso.io/v1
kind: jenkins
metadata:
  name: my-jenkins-promise-request
spec:
  name: my-amazing-jenkins
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
  --selector kratix-promise-id=jenkins-promise-default \
  --container xaas-request-pipeline-stage-1
```

This should result in something like
```console
+ yq eval .spec.name /input/object.yaml
+ instanceName=my-amazing-jenkins
+ find /tmp/transfer -type f -exec sed -i -e 's/<tbr-name>/my-amazing-jenkins/g' '{}' ';'
+ cp /tmp/transfer/jenkins-instance.yaml /output/
```

<p>Then you can watch for the creation of your Jenkins instance by targeting the worker cluster:<br />
<sub>(This may take a few minutes so <code>--watch</code> will watch the command. Press <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop watching)</sub>
</p>

```bash
kubectl --context kind-worker get pods --all-namespaces --watch
```

The above command will eventually give an output similar to
```console
NAME                                READY   STATUS    RESTARTS   AGE
jenkins-my-amazing-jenkins          1/1     Running   0          1m
...
```
<br />

For verification, access the Jenkins UI in a browser, as in [previous steps](./installing-a-promise#use-your-jenkins-instance).


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
You have now authored your firs promise. Congratulations 🎉

To recap the steps we took:
1. ✅&nbsp;&nbsp;Generated a Kratix Promise template
1. ✅&nbsp;&nbsp;`xaasCrd`: Defined your Promise API with a X as-a-Service Custom Resource Definition
1. ✅&nbsp;&nbsp;Created your Promise instance base manifest
1. ✅&nbsp;&nbsp;`xaasRequestPipeline`: Built a simple request pipeline
1. ✅&nbsp;&nbsp;Packaged the pipeline as a Docker image
1. ✅&nbsp;&nbsp;Tested the pipeline Docker image
1. ✅&nbsp;&nbsp;`workerClusterResources`: Defined what needs to be present on your worker clusters to fulfil this Promise
1. ✅&nbsp;&nbsp;Installed your Kratix Promise
1. ✅&nbsp;&nbsp;Created and submitted a Kratix Resource Request
1. ✅&nbsp;&nbsp;Reviewed the components of a Promise

## Tearing it all down {#teardown}
To clean up your environment, run the following command:

```bash
kind delete clusters platform worker
```

---

## 🎉 &nbsp; Congratulations!
✅&nbsp;&nbsp; You have written a Kratix Promise. <br />
👉🏾&nbsp;&nbsp; Let's [see how to tailor Kratix Promises based on organisational context](./enhancing-a-promise).
