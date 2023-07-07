---
description: Extracting shared dependencies across multiple requests
title: Extracting shared dependencies
id: shared-dependencies
slug: ../shared-dependencies
---
```mdx-code-block
import useBaseUrl from '@docusaurus/useBaseUrl';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import PartialVerifyKratixWithOutPromises from '../../_partials/workshop/_verify-kratix-without-promises.md';
import PartialWcrBinaryDownload from '../../_partials/_wcr-binary-download.md';
```

This is Part 2 of [a series](intro) illustrating how Kratix works. <br />
👈🏾&nbsp;&nbsp; Previous: [Delivering your service on demand](service-on-demand) <br />
👉🏾&nbsp;&nbsp; Next: [Intentionally schedule Promise resources](schedule-promise)

<hr />

**In this tutorial, you will**
* [Understanding Kratix Promise dependencies](#understanding-dependencies)
* [Splitting out Elastic Cloud Kubernetes (ECK) dependencies](#splitting-dependencies)
* [Install the Promise with separate dependencies](#install-promise)
* [Make multiple requests](#resource-requests)
* [Summary](#summary)
* [Clean up environment](#cleanup)

## Understanding Kratix Promise dependencies {#understanding-dependencies}

After the previous tutorial step, the ECK Promise bundled all necessary provisioning
steps into the Resource Workflow. This made it possible to only do a single request because of duplication across the requests.

In this section we will focus on introducing the dependencies part of Promises to manage many requests from a single Promise.

```mdx-code-block
import PromiseWayfinding from "/img/docs/workshop/part-ii-wayfinding-extract-dependencies.svg"
```
<figure class="diagram">
  <PromiseWayfinding className="small"/>

  <figcaption>Promise dependencies provide a way to install and configure shared resources that enables the platform to provide self-service Resources.</figcaption>
</figure>

## Splitting out Elastic Cloud Kubernetes (ECK) dependencies {#splitting-dependencies}

The Pipeline `run` script currently follows the installation instructions in the ECK
documentation [here](https://www.elastic.co/guide/en/cloud-on-k8s/2.8/k8s-deploy-eck.html).
Namely, the two separate files downloaded, the CRDs and the operator. Then creating
the required Resources from the CRDs.

The operator and its CRDs are a set of resources that only need and can be
installed once in a cluster. After they are installed they can serve as many
Resources as needed. Therefore, if you want to support provisioning multiple
Resources you will need to change how the CRDs and operator resources are installed
into the cluster so that there is not a conflict.

<img src={useBaseUrl('/img/docs/workshop/operator-as-shared-dependency.png')} />

### Dependencies

Currently, both the operator and the request for an Resource from the operator
are generated in the Workflow. Kratix has the concept of `dependencies` which
can be useful to manage different types of resources. While a Configure Workflow runs on
every request for a resource, the dependencies are a set of resources that only
need to be installed once per cluster for the given Promise.

A simple use cases may be to create a shared namespace that all subsequent
Resources get scheduled to. In the case of this ECK Promise, you can
install the Operator and CRDs as a dependencies.

### Remove shared dependencies from the Pipeline

The following steps will refactor this Promise to instead separate shared dependencies from individual request resources:

<img src={useBaseUrl('/img/docs/workshop/promise-with-dependencies.png')} />

#### Remove one-off files (i.e. dependencies) from Pipeline

First you will need to remove the Operator and CRD files from the Pipeline `run` script in order in order to stop them from being created on each request for a Resource.

Open the `pipeline/run` file and remove lines 9-16. This will remove both curl commands which download the CRDs and controller resources.

<details>
  <summary> 👉🏾 Prefer to copy the whole working pipeline/run file? 👈🏾 </summary>

```bash title="Complete pipeline/run"
#!/usr/bin/env bash

set -eu -o pipefail

mkdir -p to-deploy
export name="$(yq eval '.metadata.name' /input/object.yaml)"
export enableDataCollection="$(yq eval '.spec.enableDataCollection' /input/object.yaml)"

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

</details>

#### Run the test suite, see it passing

With the downloads removed, you can re-run the test suite and see that the resulting files no long include the Operator or the CRDs.
```bash
scripts/test-pipeline
```

Once the execution completes, use the following command to check the files generated by the Pipeline:

```bash
tree test
```

Verify that the output shows only the following files:

```shell-session
📂 test
├── input
│   └── object.yaml
├── metadata
└── output
    ├── beats.yaml
    ├── elasticsearch.yaml
    └── kibana.yaml
```

### Add shared dependencies to the Promise

Removing the files from the Pipeline is not enough. You must now also add them to the Promise as dependencies.

Run the following command to create a `dependencies` directory where you can store these files and any others that you may want to depend on for the Promise installation:
```bash
mkdir -p dependencies

curl --silent --location --output dependencies/elastic-crds.yaml https://download.elastic.co/downloads/eck/2.8.0/crds.yaml
curl --silent --location --output dependencies/elastic-operator.yaml https://download.elastic.co/downloads/eck/2.8.0/operator.yaml
```

Once stored locally, you will need to add these dependencies to the Promise file. The dependencies are added as a list under `dependencies` which can tricky with formatting and require some subtle white space changes.

#### Download the WorkerResourcesBuilder

:::info

If you are using Instruqt, you can use the binary provided rather than downloading. When prompted, instead of downloading use the following command to move the binary into the right location:

```bash
mkdir -p bin
cp /root/bin/worker-resource-builder ./bin
```

:::

<PartialWcrBinaryDownload />

#### Add all dependencies to the Promise

Per the usage instructions you have now seen, you can use the provided binary to add dependencies to an existing Promise. Run the following command to overwrite the current Promise file to add the dependencies to the existing API and Workflows sections:

```bash
echo "current Promise length is: $(wc -l promise.yaml)"
./bin/worker-resource-builder -resources-dir ./dependencies -promise promise.yaml | tee tmp-promise.yaml  >/dev/null; mv tmp-promise.yaml promise.yaml
echo "new Promise length is: $(wc -l promise.yaml)"
```


The above command will give an output similar to:
```shell-session
current Promise length is: 35 promise.yaml
new Promise length is: 11398 promise.yaml
```

In this output, you can see that the the files in the `dependencies` directory have now been added to the `promise.yaml` file. You can also check the top of the newly edited `promise.yaml` and see that these resources have been added as list items under the `dependencies` key.

:::info

You may notice that the length of the files in `dependencies` is shorter than what was added to the `promise.yaml` file. This is because the `worker-resources-builder` binary reformatted long lines into more readable lines with a max length of 90.

If you have [yq](https://mikefarah.gitbook.io/yq/) installed you can verify the total number of documents in both matches with the following command:
```bash
diff <(yq ea '[.] | length' dependencies/*) <(yq '.spec.dependencies | length' promise.yaml)
```

No difference in number of YAML resources will result in no output.
:::

## Install the Promise {#install-promise}

### Prerequisite setup

<PartialVerifyKratixWithOutPromises />

### Install the Promise

With the Pipeline image available, you can now install the updated Promise:

```bash
kubectl --context ${PLATFORM} create --filename promise.yaml
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

In addition, you can now verify that the dependencies have been installed on the worker cluster:

```bash
kubectl --context ${WORKER} get crds | grep elastic
kubectl --context ${WORKER} get pods -n elastic-system
```

The above command will give an output similar to:
```shell-session
agents.agent.k8s.elastic.co                            2023-02-01T12:00:00Z
apmservers.apm.k8s.elastic.co                          2023-02-01T12:00:00Z
beats.beat.k8s.elastic.co                              2023-02-01T12:00:00Z
elasticmapsservers.maps.k8s.elastic.co                 2023-02-01T12:00:00Z
elasticsearchautoscalers.autoscaling.k8s.elastic.co    2023-02-01T12:00:00Z
elasticsearches.elasticsearch.k8s.elastic.co           2023-02-01T12:00:00Z
enterprisesearches.enterprisesearch.k8s.elastic.co     2023-02-01T12:00:00Z
kibanas.kibana.k8s.elastic.co                          2023-02-01T12:00:00Z
logstashes.logstash.k8s.elastic.co                     2023-02-01T12:00:00Z
stackconfigpolicies.stackconfigpolicy.k8s.elastic.co   2023-02-01T12:00:00Z

NAME                 READY   STATUS    RESTARTS   AGE
elastic-operator-0   1/1     Running   0          1m
```

## Make multiple requests {#resource-requests}

Now that you have installed the operator and CRDs as a part of Promise installation,
you can once again don the Application Engineer hat and return to the original goal of
requesting more than one Resource from the single ECK Promise.

Just as you did in the last step, you will need to make two requests with
two different resource names:

```bash
kubectl --context $PLATFORM apply --filename resource-request.yaml
cat resource-request.yaml | \
  sed 's/name: example/name: second-request/' | \
  kubectl --context $PLATFORM apply --filename -
```

With these two requests made, you can see both Workflows running simultaneously:

```bash
kubectl --context $PLATFORM get pods
```

The above command will give an output similar to:
```shell-session
NAME                                           READY   STATUS      RESTARTS   AGE
configure-pipeline-elastic-cloud-default-01650   0/1     Completed   0          106s
configure-pipeline-elastic-cloud-default-99684   0/1     Completed   0          11s
```

And once completed you will be able to watch for two sets of ECK resources being deployed to the Worker cluster:
```bash
kubectl --context $WORKER get pods --watch
```

Once you see all 6 pods in the output similar to below, you can use <kbd>Ctrl</kbd>+<kbd>C</kbd> to exit the watch mode:
```shell-session
NAME                                 READY   STATUS    RESTARTS   AGE
example-es-default-0                 1/1     Running   0          2m21s
example-kb-d97b489b-9twhq            1/1     Running   0          2m21s
example-beat-metricbeat-frpv7        1/1     Running   0          2m21s
second-request-es-default-0          1/1     Running   0          42s
second-request-kb-6cdc9594ff-7dnnm   1/1     Running   0          42s
```

<details>
  <summary>🤔 Want to see these Kibana's in the browser? </summary>

The first Kibana has been set up with a unique node port which has been configured to be exposed as a part of the workshop cluster setup.

You can visit http://localhost:30269 and check it out, and you can even login by using the default username `elastic` and retrieving the password from the worker cluster with the following command:

```bash
kubectl --context $WORKER \
  get secret example-es-elastic-user \
  --output go-template='{{.data.elastic | base64decode}}'
```

Any additional Kibana's will be given a random other port so you will need to use the following port forward command:

```bash
kubectl --context kind-worker port-forward deploy/second-request-kb :5601
```

This command will then give you the following output:
```shell-session
Forwarding from 127.0.0.1:51207 -> 5601
Forwarding from [::1]:51207 -> 5601
```

The local port will be randomly generated, but in this output you would use the port 51207.

This Kibana would need a different password which you can get from it's secret with this command:

```bash
kubectl --context $WORKER \
  get secret second-request-es-elastic-user \
  --output go-template='{{.data.elastic | base64decode}}'
```

:::caution
If you gave your ECK Resource a different name, you will nee to substitute the name in the above commands for the correct ones. For example, to port forward you would replace `NAME` with the name of your Resource:

kubectl --context $WORKER port-forward deploy/NAME-kb :5601
:::

</details>

## Summary {#summary}

And with that, you have reduced duplication by delivering shared dependencies separately from the on-demand service! While this workshop only showcases two Resources both deployed to the same cluster, this architecture can easily be used to support an unlimited number of Resources across an unlimited number of clusters.

To recap the steps you took:
1. ✅&nbsp;&nbsp;Evaluated what resources are shared dependencies
1. ✅&nbsp;&nbsp;Moved any shared dependencies from Workflows to the dependencies
1. ✅&nbsp;&nbsp;Viewed the dependency set up on Promise install
1. ✅&nbsp;&nbsp;Successfully request more than one ECK Resources

## Clean up environment {#cleanup}

Before moving on, please remove the ECK Promise from your cluster.

To delete all the Promises:
```bash
kubectl --context $PLATFORM delete promises --all
```

## 🎉 &nbsp; Congratulations!
✅&nbsp;&nbsp;Your Promise can deliver on-demand services that have shared dependencies.<br />
👉🏾&nbsp;&nbsp;Next you will [Intentionally schedule Promise resources](schedule-promise).
