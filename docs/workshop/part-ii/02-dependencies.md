---
description: Extracting shared dependencies across multiple requests
title: Defining the Dependencies
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
👈🏾&nbsp;&nbsp; Previous: [Create your first service API](creating-an-api) <br />
👉🏾&nbsp;&nbsp; Next: [Delivering your service on demand](service-on-demand) <br />

<hr />

**In this tutorial, you will**

- [Understanding Kratix Promise Dependencies](#understanding-dependencies)
- [Splitting out Elastic Cloud Kubernetes (ECK) Dependencies](#splitting-dependencies)
  - [Dependencies](#dependencies)
  - [Remove shared dependencies from the Pipeline](#remove-shared-dependencies-from-the-pipeline)
    - [Remove one-off files (i.e. Dependencies) from Pipeline](#remove-one-off-files-ie-dependencies-from-pipeline)
    - [Run the test suite, see it passing](#run-the-test-suite-see-it-passing)
  - [Add shared dependencies to the Promise](#add-shared-dependencies-to-the-promise)
    - [Download the WorkerResourcesBuilder](#download-the-workerresourcesbuilder)
    - [Add all Dependencies to the Promise](#add-all-dependencies-to-the-promise)
- [Install the Promise](#install-promise)
  - [Prerequisite setup](#prerequisite-setup)
  - [Install the Promise](#install-the-promise)
- [Make multiple requests](#resource-requests)
- [Summary](#summary-summary)
- [Clean up environment](#clean-up-environment-cleanup)
- [🎉   Congratulations](#--congratulations)

## Understanding Kratix Promise Dependencies {#understanding-dependencies}

The ECK Promise needs to bundle all the necessary software that is needed for provisioning a new Elastic Stack. Those are components that are not part of the Elastic Stack itself, but are required to run it. For example, the operator and its CRDs. They are also not specific to a single request, but are prerequisites for all the requests coming into the platform.

In this section we will focus on introducing the Dependencies part of Promises. the dependencies are installed once per cluster and are shared across all requests for a given Promise.

```mdx-code-block
import PromiseWayfinding from "/img/docs/workshop/part-ii-wayfinding-extract-dependencies.svg"
```

<figure class="diagram">
  <PromiseWayfinding className="small"/>

  <figcaption>Promise Dependencies provide a way to install and configure shared resources that enables the platform to provide self-service Resources.</figcaption>
</figure>

## Elastic Cloud Kubernetes (ECK) Dependencies {#eck-deps}

To use ECK, as defined in the [documentation](https://www.elastic.co/guide/en/cloud-on-k8s/2.8/k8s-deploy-eck.html), you need the ECK Operator and its CRDs to be installed in the worker cluster. Any time you have resources that need to be installed only once in a cluster, you can use the `dependencies` section of a Promise.

<img src={useBaseUrl('/img/docs/workshop/operator-as-shared-dependency.png')} />

The desired workflow is to have the ECK Operator and its CRDs installed in the cluster immediately after the Promise gets installed. This way, the Promise can use the Operator to install the Elastic Stack.

<img src={useBaseUrl('/img/docs/workshop/promise-with-dependencies.png')} />

### Download the ECK Operator and CRDs {#dependencies}

The first step is to download the ECK Operator and its CRDs. You can run the following command to create a `dependencies` directory where you can store these files and any others that you may want to depend on for the Promise installation:

```bash
mkdir -p dependencies

curl --silent --location --output dependencies/elastic-crds.yaml https://download.elastic.co/downloads/eck/2.8.0/crds.yaml
curl --silent --location --output dependencies/elastic-operator.yaml https://download.elastic.co/downloads/eck/2.8.0/operator.yaml
```

Once stored locally, you will need to add these Dependencies to the Promise file. The Dependencies are added as a list under `dependencies` which can tricky with formatting and require some subtle white space changes.

#### Download the WorkerResourcesBuilder

:::info

If you are using Instruqt, you can use the binary provided rather than downloading. When prompted, instead of downloading use the following command to move the binary into the right location:

```bash
mkdir -p bin
cp /root/bin/worker-resource-builder ./bin
```

:::

<PartialWcrBinaryDownload />

#### Add all Dependencies to the Promise

Per the usage instructions you have now seen, you can use the provided binary to add Dependencies to an existing Promise. Run the following command to overwrite the current Promise file to add the Dependencies to the existing API and Workflows sections:

:::warning

If you are using Instruqt, please make sure the promise.yaml file is closed in
the editor tab before running the command below. Once you execute the command,
make sure to click the Reload button on the editor tab.

:::

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

## Install the updated Promise {#install-promise}

Go ahead and install the Promise:

```bash
kubectl --context ${PLATFORM} replace --filename promise.yaml --force
```

To validate the Promise has been installed, you can list all Promises by running:

```bash
kubectl --context kind-platform get promises
```

Your output will eventually show the `elastic-cloud` Promise:

```shell-session
NAME            STATUS      KIND            API VERSION                   VERSION
elastic-cloud   Available   elastic-cloud   workshop.kratix.io/v1alpha1
```

In addition, you can now verify that the Dependencies have been installed on the worker cluster:

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

Now that you have installed the operator and CRDs as a part of Promise installation, you are one step closer to being able to request Resources from the Promise. The next step is to define the Configure Pipeline Workflow.

Head to the next section to learn how to do that!

## Summary {#summary}

To recap the steps you took:

1. ✅&nbsp;&nbsp;Evaluated what resources are shared dependencies
1. ✅&nbsp;&nbsp;Defined the dependencies in the Promise file
1. ✅&nbsp;&nbsp;Viewed the dependency set up on Promise install

## 🎉 &nbsp; Congratulations

✅&nbsp;&nbsp;Your Promise dependencies are getting installed!<br />
👉🏾&nbsp;&nbsp;Next you will [learn how to define the Configure Workflow](./service-on-demand).
