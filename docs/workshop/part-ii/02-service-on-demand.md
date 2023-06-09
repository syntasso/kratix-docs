---
description: Delivering your service on demand
title: Delivering your service on demand
id: service-on-demand
slug: ../service-on-demand
---
```mdx-code-block
import PartialVerifyKratixWithOutPromises from '../../_partials/workshop/_verify-kratix-without-promises.md';
import PartialCleanup from '../../_partials/_cleanup.md';
```

This is Part 2 of [a series](intro) illustrating how Kratix works. <br />
👈🏾&nbsp;&nbsp; Previous: [Create your first service API](creating-an-api) <br />
👉🏾&nbsp;&nbsp; Next: [Extracting shared dependencies](shared-dependencies)

<hr />


**In this tutorial, you will**
* [Learn about a Promise pipeline](#what-is-a-pipeline)
* [Write a Docker container to codify the delivery process](#write-docker-container)
* [Test the pipeline](#test-the-pipeline)
* [Include this container in your Promise pipeline](#add-container-to-pipeline)
* [Install the Promise](#install-promise)
* [Request an on-demand instance of your Promise](#request-instance)
* [Summary](#summary)
* [Clean up environment](#cleanup)

## What is a Promise pipeline? {#what-is-a-pipeline}

A [Kratix Promise](../main/reference/promises/intro) is configured with a Request
Pipeline, defined as `xaasRequestPipeline` in the Promise definition.

This pipeline is an ordered list of OCI-compliant images. Each image runs as an
init container within a single Kubernetes pod.

This pipeline is run whenever a user makes a request to your Promise API. The
pipeline is limited only by what actions you can take inside a Pod in Kubernetes.
This means you can download software, run imperative commands, wait for manual
approvals and more.

<figure class="diagram">
  <PipelineDiagram className="large"/>
  <figcaption>An example multi-stage Pipeline</figcaption>
</figure>

In addition to running commands within the images, Kratix will manage a few key
files when the defined pipeline completes:
* `/output`: The files in this directory should be Kubernetes valid YAML as they
  will be scheduled to a matching Kratix Cluster.
* `/metadata/cluster-selectors.yaml`: Any YAML key:value pairs in this file will
  be appended to the `selector` values in the Promise before deciding where the
  output files are scheduled.
* `metadata/status.yaml`: A YAML document that will be written to the Resource
  Request status section on pipeline completion.

This step of the workshop will focus on the script run in an image and the output
directory. Both cluster-selectors and status will be explored in an upcoming
section of this workshop.

### Design principles

While the pipeline enables flexibility, you will benefit from keeping in mind
a few key principles while writing your pipeline images.

#### Reusability

Pipelines are a great place to validate and enforce common requirements. For
example, if you write an image that can check for necessary compliance
requirements, that image can be used by all applicable pipelines. In addition,
you can write images to check for excess costs, labeling conventions, security
risks, and more.

While most pipelines will have at least one image with unique logic, building these
images with reusability in mind is a great way to make your platform extensible.

#### Idempotency

An idempotent container guarantees that running the same command multiple times
will result in the same outcome. This is an important feature of these containers
because they will be auto-reconciled on an on going basis.

<!---
do we want to talk to this now? We don't actually handle this at all atm, but we
aspire to in the future.
-->

Kubernetes controllers reconcile their objects in three scenarios:
* Object change
* Controller restart
* Default cadence

This means that yes, on every Resource Request the pipeline will run. But also, it
will run any time the controller is reset, as well as every 10 hours.

This means you will need to write your pipeline images to make sure that rerunning
them will not result in any adverse side effects.

<hr />

Now that you understand what you can do in a pipeline and some design principles
for writing images, it is time to write your own pipeline to deliver on-demand
Elastic Clouds!

## Codify your delivery process in a Container {#write-docker-container}

To provision Elastic Cloud Kubernetes (ECK) you will need to both install the
operator and use the ECK-stack Helm chart to make requests to the operator. By
encapsulating the process in a Container you are able to manage quite complex
actions while also having access to a testable interface.

### Write the pipeline script

The pipeline requires a number of files and scripts. For that reason it is
best to create a subfolder to organise these specific items.

More specifically, the first two files you will need are:

* `run`: a script containing the code that will be executed when the pipeline
  runs.
* `default-config.yaml`: a values document containing configuration options for the
  default ElasticSearch and Kibana.
* `beats-values.yaml`: a values document containing configuration options for when the
  Data Collection is enabled.

To create the subfolder and these two executable files, you can run the following command:
```bash
mkdir -p pipeline
touch pipeline/{run,default-config.yaml,beats-values.yaml}
chmod +x pipeline/run
```

Next you will write the code that manages the provisioning process in the `run`
script. Paste the contents below in the `pipeline/run` script:

```bash title="pipeline/run"
#!/usr/bin/env bash

set -eu -o pipefail

mkdir -p to-deploy
export name="$(yq eval '.metadata.name' /input/object.yaml)"
export enableDataCollection="$(yq eval '.spec.enableDataCollection' /input/object.yaml)"

echo "Downloading CRDS..."
curl --silent --location --output to-deploy/elastic-crds.yaml \
    https://download.elastic.co/downloads/eck/2.8.0/crds.yaml

echo "Downloading Operator..."
curl --silent --location --output to-deploy/elastic-operator.yaml \
    https://download.elastic.co/downloads/eck/2.8.0/operator.yaml

echo "Generate ECK requests..."
# Only set the beats value file if data collection is enabled
valuesFile=''
if $enableDataCollection; then
  sed "s/NAME/${name}/g" beats-values.yaml > beats-final-values.yaml
  valuesFile='--values beats-final-values.yaml'
fi

nodePort="$(echo "${name}" | md5sum | grep -Eo "[[:digit:]]{3}" | head -n1)"
nodePort=$(( 30000 + nodePort ))
sed "s/NODEPORT/${nodePort}/g" default-config.yaml | sed "s/NAME/${name}/g" > default-config-final-values.yaml

helm template $name eck-stack \
  $valuesFile \
  --values default-config-final-values.yaml \
  --repo https://helm.elastic.co \
  --output-dir to-deploy

echo "Adding namespaces to all helm output files..."
find /pipeline/to-deploy/eck-stack -name \*.yaml   -exec yq -i 'select(.metadata | has("namespace") | not).metadata.namespace |= "default"' {} \;

echo "Removing enterprise annotation..."
find /pipeline/to-deploy/eck-stack -name \*.yaml   -exec yq -i 'del(.metadata.annotations["eck.k8s.elastic.co/license"])' {} \;

echo "Copying files to /output..."
find /pipeline/to-deploy -name \*.yaml -exec cp {} /output \;

echo "Done"
```

Next, populate the `default-config.yaml` document. This is file contains default
configuration for the Kibana deployment. The NodePort will be injected by the
pipeline:

```yaml title=pipeline/default-config.yaml
eck-elasticsearch:
  fullnameOverride: NAME
eck-kibana:
  fullnameOverride: NAME
  spec:
    config:
      csp:
        strict: false
    count: 1
    elasticsearchRef:
      name: NAME
    http:
      tls:
        selfSignedCertificate:
          disabled: true
      service:
        spec:
          type: NodePort
          ports: [{nodePort: NODEPORT, port: 5601}]
```

Next, populate the `beats-values.yaml` document. Paste the following into the
`pipeline/beats-values.yaml` file:

```yaml title="pipeline/beats-values.yaml"
eck-beats:
  enabled: true
  fullnameOverride: NAME
  spec:
    type: metricbeat
    version: 8.9.0-SNAPSHOT
    elasticsearchRef:
      name: NAME
    kibanaRef:
      name: NAME
    daemonSet:
      podTemplate:
        spec:
          containers:
            - args:
                - -e
                - -c
                - /etc/beat.yml
                - -system.hostfs=/hostfs
              name: metricbeat
```

<details>
<summary>🤔 How does the run script work?</summary>
Take a look at the file you have just created and see how the principles and structures introduced above are applied.

On line 11 and 15 the script is downloading a specific version of ECK rather than using a mutable tag like `latest`. This means that no matter how frequently this image runs, it will always generate the same output.

In addition, on line 34 the files that should be deployed to the cluster are copied to `/output`. You may wonder why these files were not downloaded and created directly to the `output` directory. This is an good practice that allows you to use a temporary directory to download and possibly manipulate files before finalising them in the `output` directory.

Finally, you can see that on lines 6 and 7 the script is capturing values from the Resource Request and using those values to customise the outputs. Specifically, it is using the Resource Request name to make sure that the resources have unique names, and using the user provided API value to decide on line 45 if Beats should be installed.
</details>

Your shell script is nearly testable as is. However one complication is the manipulation of the root file system. Therefore, the next step will be to package this script into a Dockerfile which will enable testing and also make it ready for use in your Kratix pipeline.

:::tip

Remember there is no limitation to the languages you use in this script. You may prefer more complete programming and scripting languages like Golang, Python, or Elixir as your logic becomes more robust.

:::

### Write the Dockerfile

A [Dockerfile](https://docs.docker.com/engine/reference/builder/) manages both build and runtime requirements for your container.

To create your Dockerfile in the pipeline directory run the following command:

```bash
touch pipeline/Dockerfile
```


Next, paste the contents below into the newly created `pipeline/Dockerfile`:

```docker
FROM "alpine"
WORKDIR /pipeline

RUN apk update && apk add --no-cache bash curl openssl yq
RUN curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 \
    && chmod +x get_helm.sh && ./get_helm.sh

ADD run /pipeline/run
ADD beats-values.yaml /pipeline/beats-values.yaml
ADD default-config.yaml /pipeline/default-config.yaml

RUN chmod +x /pipeline/run

CMD [ "sh", "-c", "/pipeline/run" ]
ENTRYPOINT []
```

At this stage, your `elastic-cloud-promise` directory should look like this:

```
📂 elastic-cloud-promise
├── pipeline
│   ├── Dockerfile
│   ├── beats-values.yaml
│   ├── default-config.yaml
│   └── run
├── promise.yaml
└── resource-request.yaml
```


<details>
<summary>🤔 How does the Dockerfile work?</summary>

Take a look at the created file and you can see on line 1 that this is an Alpine
Linux container that requires `bash`, `curl` and `yq` to be installed on line 4.
This allows you to install Helm on line 5 before calling your `run` script on
each run via the `CMD` declaration on line 14 after adding to the image on line
9.

</details>

## Test the pipeline {#test-the-pipeline}

Now that the script is packaged as a Dockerfile, you are able to run the script without impacting your local root directory.

In order run a test you will need to:
* Mimic the `/output` directory locally
* Provide the expected input files (the Resource Request)
* Build the image
* Run the container
* Validate the files in the `output` directory

Start by creating the files and test structure:

```
mkdir -p test/{input,output}
```

As an example input, copy the Resource Request as `object.yaml` into the `input`
directory:

```bash
cp resource-request.yaml test/input/object.yaml
```

At this stage, your direcory structure should look like this:

```
📂 elastic-cloud-promise
├── pipeline
│   ├── Dockerfile
│   ├── beats-values.yaml
│   ├── default-config.yaml
│   └── run
├── promise.yaml
├── resource-request.yaml
└── test
    ├── input
    │   └── object.yaml
    └── output
```

### Create simple test suite

Now that you have your local directories all set up, it is time to actually
build, run and validate the image outputs.

Here is where another convenience script can be helpful. By creating a build
and test script you will be able to consistently run the necessary commands
and expand on them as you may want to automate more of your testing.

Use the following command to once again set up the necessary local file structure:

```bash
mkdir -p scripts
touch scripts/{build-pipeline,test-pipeline}
chmod +x scripts/*
```

Paste the following in `scripts/build-pipeline`:

```bash title="scripts/build-pipeline"
#!/usr/bin/env bash

set -eu -o pipefail

testdir=$(cd "$(dirname "$0")"/../test; pwd)

docker build --tag kratix-workshop/elastic-pipeline:dev $testdir/../pipeline
kind load docker-image --name platform kratix-workshop/elastic-pipeline:dev
```

Paste the following in `scripts/test-pipeline`

```bash title="scripts/test-pipeline"
#!/usr/bin/env bash

scriptsdir=$(cd "$(dirname "$0")"; pwd)
testdir=$(cd "$(dirname "$0")"/../test; pwd)
inputDir="$testdir/input"
outputDir="$testdir/output"

$scriptsdir/build-pipeline
rm $outputDir/*

docker run --rm --volume ${outputDir}:/output --volume ${inputDir}:/input kratix-workshop/elastic-pipeline:dev
```

These scripts do the following:

* `build-pipeline` codifies the dev tag for the image and how to build it. It
  will also load the container image on the KinD cluster.
* `test-pipeline` calls build-pipeline and also runs the pipeline image,
  allowing you to verify the created files in the `test/output` directory.

At this stage, your directory structure should look like this:

```
📂 elastic-cloud-promise
├── pipeline
│   ├── Dockerfile
│   ├── beats-values.yaml
│   ├── default-config.yaml
│   └── run
├── promise.yaml
├── resource-request.yaml
├── scripts
│   ├── build-pipeline
│   └── test-pipeline
└── test
    ├── input
    │   └── object.yaml
    └── output
```

### Run the test

To execute the test, run the script with the following command:

```bash
./scripts/test-pipeline
```

Which should build and run the Pipeline image. Once the execution completes,
verify the `test/output` directory. You should see the following files:

```
📂 elastic-cloud-promise
├── ...
└── test
    ├── input
    │   └── object.yaml
    └── output
        ├── beats.yaml
        ├── elastic-crds.yaml
        ├── elastic-operator.yaml
        ├── elasticsearch.yaml
        └── kibana.yaml
```

You can take a look at the files and verify their contents. If everything looks
good, your pipeline image is ready to be included in your promise.


:::tip Testing pipeline images

As you just experience, testing pipeline images is really simple. You can
quickly validate that the pipeline is outputting exactly what you want, without
even touching Kubernetes.

The ability to treat pipeline image as independent pieces of software that can
have their own development lifecycle (fully testable, easy to execute locally,
release independent) allows platform teams to move faster, sharing and reusing
images across their Promises.

:::

## Include this container in your Promise pipeline {#add-container-to-pipeline}

With your pipeline tested you are ready to add it to your Promise. To do this,
you will add a new top level key in the Promise `spec` as a sibling to the
`xaasCrd` key you created in the last section.

The key should be `xaasRequestPipeline` and should contain a list of your
pipelines containers which will be just one for now:

```yaml title="promise.yaml -- include it under the 'spec' key"
  xaasRequestPipeline:
  - kratix-workshop/elastic-pipeline:dev
```

## Install the Promise {#install-promise}

### Prerequisite setup

<PartialVerifyKratixWithOutPromises />

### Install the Promise

You can now install the updated Promise:

```bash
kubectl --context $PLATFORM create --filename promise.yaml
```

To validate the Promise has been installed, you can list all Promises by running:
```bash
kubectl --context kind-platform get promises
```

Your output will show the `elastic-cloud` Promise:
```shell-session
NAME            AGE
elastic-cloud   10s
```

## Request an on-demand instance of your Promise {#request-instance}

Now that the Promise is installed and includes a pipeline to provision the ECK resources, you can switch hats to act like an application engineer who wants to request an instance of a monitoring stack.

The request will result in the pipeline's output being installed on the worker cluster:

```mdx-code-block
import PipelineDiagram from "/img/docs/workshop/install-a-promise-pipeline.svg"
```
<figure class="diagram">
  <PipelineDiagram className="large"/>
  <figcaption>An example multi-stage Pipeline</figcaption>
</figure>

### Send a Resource Request

You can use the same Resource Request as in the last section by running:

```bash
kubectl --context $PLATFORM apply --filename resource-request.yaml
```

You can once again see this request by listing all the request for elastic clouds using the following command:
```bash
kubectl --context $PLATFORM get elastic-cloud
```

The above command will give an output similar to:
```shell-session
NAME      STATUS
example   Pending
```

As an application engineer, you can see the Status as either `Pending` meaning that the provisioning is not yet complete, or `Resource requested` which indicates that the pipeline is complete. This is the basic status provided by Kratix, but you will be able to enhance this experience at a later step in this workshop.

### Verify the pipeline

As a platform engineer you can continue on to verify some of the processes behind the scenes. First of all, you can verify that the pipeline has been triggered by the creation of a Resource Request. To see the pod run:
```bash
kubectl --context $PLATFORM get pods --show-labels
```

The output should look something like this:
```shell-session
NAME                                           READY   STATUS      RESTARTS   AGE     LABELS
request-pipeline-elastic-cloud-default-33029   0/1     Completed   0          1m   kratix-promise-id=elastic-cloud-default...
```

Within this pod there will be a number of containers including Kratix utility actions and the list of images you provided in the Promise.

To see the list of these containers in order of execution you can run:
```bash
kubectl --context $PLATFORM \
  get pods \
  --selector kratix-promise-id=elastic-cloud-default \
  --output jsonpath="{range .items[*].spec.initContainers[*]}{.name}{'\n'}{end}{range .items[*].spec.containers[*]}{.name}{'\n'}{end}"
```

Each container is listed in a row, in order that they occur so you should see:
```shell-session
reader
xaas-request-pipeline-stage-0
work-writer
status-writer
```

While you only provided a single image, you can see that there are four listed. Each has a job as follows:
* `reader` makes sure that the Resource Request is available to the pipeline
* `xaas-request-pipeline-stage-*` images are an ordered list from the provided containers in the Promise
* `work-writer` schedules the files in the `output` directory based on the labels provided
* `status-writer` updates the Resource Request status

The most interesting container for you will be the one you created, the `xaas-request-pipeline-stage-0` container. To see the logs from this specific container you can run:

```bash
kubectl --context $PLATFORM logs \
  --selector kratix-promise-id=elastic-cloud-default \
  --container xaas-request-pipeline-stage-0
```

The logs will look something like this:
```shell-session
Downloading Operator...
Generate ECK requests...
wrote to-deploy/eck-stack/charts/eck-beats/templates/beats.yaml
wrote to-deploy/eck-stack/charts/eck-elasticsearch/templates/elasticsearch.yaml
wrote to-deploy/eck-stack/charts/eck-kibana/templates/kibana.yaml

Adding namespaces to all helm output files...
Removing enterprise annotation...
Copying files to /output...
Done
```

### Verify the worker

While it is useful to verify the container has run by viewing the logs, the outcome you most want to verify is the scheduling and creation of an ECK instance.

To see this you will need to check the worker cluster where the ECK server was scheduled. First you may want to verify that the operator is running:

```bash
kubectl --context $WORKER get pods -n elastic-system
```

With the following output:
```shell-session
NAME                 READY   STATUS    RESTARTS   AGE
elastic-operator-0   1/1     Running   0          1m
```

With all the necessary CRDs installed:
```bash
kubectl --context $WORKER get crds | grep elastic
```

which will result in something like:
```shell-session
agents.agent.k8s.elastic.co                            2023-01-01T12:00:00Z
apmservers.apm.k8s.elastic.co                          2023-01-01T12:00:00Z
beats.beat.k8s.elastic.co                              2023-01-01T12:00:00Z
elasticmapsservers.maps.k8s.elastic.co                 2023-01-01T12:00:00Z
elasticsearchautoscalers.autoscaling.k8s.elastic.co    2023-01-01T12:00:00Z
elasticsearches.elasticsearch.k8s.elastic.co           2023-01-01T12:00:00Z
enterprisesearches.enterprisesearch.k8s.elastic.co     2023-01-01T12:00:00Z
kibanas.kibana.k8s.elastic.co                          2023-01-01T12:00:00Z
logstashes.logstash.k8s.elastic.co                     2023-01-01T12:00:00Z
stackconfigpolicies.stackconfigpolicy.k8s.elastic.co   2023-01-01T12:00:00Z
```

Finally, you will want to see the provisioned instance by running:
```bash
kubectl --context $WORKER get pods --watch
```

The above command will give an output similar to (it may take a while for the
pods to be ready):
```shell-session
NAME                                     READY   STATUS    RESTARTS   AGE
elasticsearch-es-default-0               1/1     Running   0          5m
example-eck-kibana-kb-6f4f95b787-4fqsr   1/1     Running   0          5m
```

Once the Ready column reports `1/1`, press <kbd>Ctrl</kbd>+<kbd>C</kbd> to
exit the watch mode.

### Trying to request a second instance

The power of Kratix is the scalability of self-service, on-demand instances.
Therefore, it is expected that any Promise will have more than one Resource Request made to it.

To see how the current Promise responds to a second request, you will need to
make a second request with the a new name:
```bash
cat resource-request.yaml | \
  sed 's/name: example/name: second-request/' | \
  kubectl --context $PLATFORM apply --filename -
```

Once again, you can verify this request by listing elastic-clouds:
```bash
kubectl --context $PLATFORM get elastic-clouds
```

Which should now show a second instance in the list:
```shell-session
NAME             STATUS
example          Resource requested
second-request   Resource requested
```

You can also see that a second pipeline has run by checking the pods:
```bash
kubectl --context $PLATFORM get pods
```

However, when you go to check the status on the worker cluster, you will not see a second elastic cloud instance:
```bash
kubectl --context $WORKER get pods
```

This is because the GitOps reconciliation has failed due to a duplication of documents across the two requests. You can see this failure by running:
```bash
kubectl --context $WORKER get kustomizations -n flux-system
```

The above command will give an output similar to:
```shell-session
NAME                        AGE     READY   STATUS
kratix-workload-crds        9m15s   False   kustomize build failed: accumulating resources: accumulation err='merging resources from './00-default-elastic-cloud-default-default-second-request-crds.yaml': may not add resource with an already registered id: CustomResourceDefinition.v1.apiextensions.k8s.io/agents.agent.k8s.elastic.co.[noNs]': must build at directory: '/tmp/kustomization-1131766306/default/worker-cluster-1/crds/00-default-elastic-cloud-default-default-second-request-crds.yaml': file is not directory
kratix-workload-resources   9m15s   False   dependency 'flux-system/kratix-workload-crds' is not ready
```

This is because the current Promise pipeline consists of both the instance specific resources, but also the shared dependencies like the ECK Operator. The next step in this workshop will showcase how to separate shared dependencies from instance specific provisioning.

## Summary {#summary}

And with that, you have transformed Elastic Cloud into an on-demand service!

To recap the steps you took:
1. ✅&nbsp;&nbsp;Codified the steps to provision an ECK instance
1. ✅&nbsp;&nbsp;Packaged this script into a Docker container
1. ✅&nbsp;&nbsp;Validated the containers behaviour with a reusable test script
1. ✅&nbsp;&nbsp;Added the container to the Kratix Promise pipeline
1. ✅&nbsp;&nbsp;Installed the Promise and validated the created instance
1. ✅&nbsp;&nbsp;Explored the limitations of all logic living in the pipeline

## Clean up environment {#cleanup}

<PartialCleanup />

## 🎉 &nbsp; Congratulations!
✅&nbsp;&nbsp;Your Promise can deliver on-demand services. <br />
👉🏾&nbsp;&nbsp;Next you will [Extract shared dependencies](shared-dependencies).
