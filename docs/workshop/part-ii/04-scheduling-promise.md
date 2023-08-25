---
description: Intentionally schedule where to provision a Promise
title: Scheduling Promises
id: scheduling-promise
slug: ../scheduling-promise
---

```mdx-code-block
import PartialVerifyKratixWithOutPromises from '../../_partials/workshop/_verify-kratix-without-promises.md';
```

This is Part 2 of [a series](intro) illustrating how Kratix works. <br />
👈🏾&nbsp;&nbsp; Previous: [Extract shared dependencies](shared-dependencies)<br />
👉🏾&nbsp;&nbsp; Next: [Update the Resource status](updating-status)

<hr />

**In this tutorial, you will**

- [Understand Promise scheduling](#understand-scheduling)
- [Schedule Promises to specific destinations](#dependency-scheduling)
- [Schedule Promise Resource to specific destinations](#rr-scheduling)
- [Clean up environment](#cleanup)
- [Summary](#summary)

### Prerequisite setup

<PartialVerifyKratixWithOutPromises />

## Promise scheduling {#understand-scheduling}

So far you have built an ECK Promise that will allow us to deliver ECK Resources on-demand to the
application developers.

When developing locally you have been deploying to a single worker Kubernetes cluster, which Kratix has been scheduling everything to by default. In reality, the likelihood is that an organisation will have multiple destinations for its workloads, potentially spread out across infrastructure types, zones, regions, and cloud-providers. Each individual destination might be designed for a particular purpose, e.g. destinations that contain GPUs for AI intensive workloads, or edge destinations that are designed to run particular applications close the intended consumers. However it is common to want some software deployed on many of these speciality clusters.

This section will focus on how Kratix has native support for flexible multi-destination scheduling.

```mdx-code-block
import PromiseWayfinding from "/img/docs/workshop/part-ii-wayfinding-scheduling.svg"
```

<figure class="diagram">
  <PromiseWayfinding className="small"/>

  <figcaption>Using destination selectors, you can either support either global or limited access to Promise resources.</figcaption>
</figure>

Kratix uses the Kubernetes-native label-based approach to scheduling where resources go, similar to how Kubernetes works when [scheduling pods](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/). When you create a Destination resource in Kratix you assign a set of labels to it. Kratix also manages additions to these labels as your platform evolves.

For your platform, use the following command to inspect what labels the worker cluster (your platform's only registered Destination) currently has:

```bash
kubectl --context $PLATFORM get destinations --show-labels
```

You should see output like:

```
NAME        AGE   LABELS
worker-1    1h   <none>
```

The cluster currently has no labels applied. So far the Promise you have written has taken no opinion about what sort of destinations it should schedule work to, meaning that a Destination with no labels is acceptable.

Imagine you have decided that it is not appropriate for ECK resources to be deployed to certain
Kubernetes clusters. You have decided to restrict deploying workloads from the ECK Promise and its Resources to only development clusters. You have also decided that development clusters will be labelled in Kratix with the `environment=dev` label. In order to get the ECK Promise to only schedule to clusters with these labels you need to update the Promise.

## Schedule Promises to specific clusters {#dependency-scheduling}

Inside of a Promise you can define what destinations the Promise should schedule resources
to via the `destinationSelectors` field.

This field contains a map of key values that are all the labels that must be matched to
a cluster. Update the Promise to contain the new `destinationSelectors` field shown below:

```yaml title=promise.yaml
apiVersion: platform.kratix.io/v1alpha1
kind: Promise
metadata:
  name: elastic-cloud
spec:
  #highlight-start
  destinationSelectors:
    - matchLabels:
        environment: dev
  #highlight-end
  #...
```

### Apply the Promise

The Promise is now set up to only schedule to clusters with the matching label. Create
the Promise in Kubernetes:

```bash
kubectl --context $PLATFORM create --filename promise.yaml
```

### Verify the resource are not scheduled

The cluster as it is right now does not contain the `environment: dev` label, so nothing will get scheduled to the worker cluster. When you get the pods on the worker, you will not see the requested ECK resources:

```bash
kubectl --context $WORKER get pods -n elastic-system
```

Kratix is querying what Destinations are available and is searching for a cluster with the matching labels. No cluster is found, and the resource fails to get scheduled.

```mdx-code-block
import SchedulingPromise from "/img/docs/workshop/scheduling-promise-dependencies.svg"
```

<figure class="diagram">
  <SchedulingPromise className="small"/>
</figure>

You can see this in the Kratix controller logs as well. This query will show that Kratix was not
able to find a matching cluster to schedule the request:

```bash
kubectl --context $PLATFORM --namespace kratix-platform-system \
  logs deployment/kratix-platform-controller-manager \
  --container manager | grep --max-count 1 "no Destinations can be selected for scheduling"
```

The above command will give an output similar to:

```shell-session
# output formatted for readability
INFO no Destinations can be selected for scheduling
{
  "destinationSelectors":
    {
      "promise":[{"target":{"matchLabels":{"environment":"dev"}}}]
    }
}
```

### Label the cluster

Update the worker cluster Destination definition to have the matching `environment=dev` so that it will receive the ECK resources:

```
kubectl --context $PLATFORM label destination worker-1 environment=dev
```

### Verify the worker

Kratix is going to detect this change to the Destination and start to schedule resources
to it:

```bash
kubectl --context $WORKER get pods -n elastic-system -w
```

You should eventually see the following output:

```shell-session
NAME                 READY   STATUS    RESTARTS   AGE
elastic-operator-0   1/1     Running   0          1m
```

With all the necessary CRDs installed:

```bash
kubectl --context $WORKER get crds | grep elastic
```

You have now successfully updated the Promise to only schedule to destinations with the
`environment=dev` label. If you were to create a new worker cluster that didn't have
the `environment=dev` label, the Promise wouldn't schedule any work to it.

## Schedule Resource to specific destinations {#rr-scheduling}

In the previous section, you updated the Promise definition with `destinationSelectors` properties to control where Resources are provisioned (only to Destinations that match the label `environment=dev`).

Imagine that some Resources need to be able to collect data. On the platform team you know what implications that feature has. In your platform, Resources that collect data require a Kubernetes cluster with a persistent volume storage of adequate size to handle the data collected. If they don't collect data, you don't mind on which cluster Kratix schedules the workloads.

To enable users to specify when they're collecting data, you've added `enableDataCollection: true` to the Promise API. Now you need a way to schedule Resources that are collecting data to the right Kratix Dstination.

To do this, you need to update the Promise's Workflow's internal Pipeline functionality. In addition to the other features already covered (in a [previous section](./02-service-on-demand.md)), the Workflow for a Promise offers another hook for adjusting where a Resource is deployed.

Within the Pipeline container file system, Kratix mounts a [`/kratix/metadata`](../main/reference/resources/workflows#metadata) directory to manage important configuration that is independent of the Resources definitions for your State Store.

To set additional destination selector labels, you can add a `destination-selectors.yaml` document to `/kratix/metadata` that follows the same structure as the Promise's `destinationSelectors` field. Any selectors added in this file will be added to the list provided by the Promise. By design, _you cannot override the Kratix Destination selectors set in the Promise definition_. This is to ensure clear security controls to the Promise author, and it guarantees that a Resource will always be scheduled to a Kratix cluster that has already received the Promise Dependencies.

For scheduling Resources to Destinations that support data collection, you can update the Resource Configure Workflow to add a `pvCapacity=large` selector when `enableDataCollection` is set to `true`.
This will mean Resources that collect data will be scheduled to a Destination that has the labels `environment=dev` _and_ `pvCapacity=large`.

Add the following to the end of the Promise Workflow's Pipeline's `run` script (`pipeline/run`):

```bash title=pipeline/run -- add to the end
if ${enableDataCollection}; then
  echo "Setting additional cluster selectors: pvCapacity=large"
  echo "[{matchLabels: { pvCapacity: large }}]" > /kratix/metadata/destination-selectors.yaml
fi
```

### Build and test the image

The `run` script is included in the Pipeline's container image, so to have these Destination Selector changes take effect, you need to rebuild and re-load the Docker image.

The `test-pipeline` script builds, loads, and runs the Docker image.

```bash
./scripts/test-pipeline
```

Verify that the output now shows the `destination-selectors` file with the correct properties.

```shell-session
📂 test
├── input
│   └── object.yaml
├── metadata
#highlight-next-line
│   └── destination-selectors.yaml
└── output
    ├── beats.yaml
    ├── elasticsearch.yaml
    └── kibana.yaml
```

### Send a request for a Resource

Your original Resource request has `enableDataCollection` set to `true`. Submit this request again.

```bash
kubectl --context $PLATFORM apply --filename resource-request.yaml
```

You can see that Kratix accepts this request and triggers the Workflow:

```bash
kubectl --context $PLATFORM get pods -w
```

### Verify the Workflow Pipeline

Once the Pipeline has complete take a look at the logs for the request:

```bash
kubectl --context $PLATFORM logs \
  --selector kratix-promise-id=elastic-cloud \
  --container pipeline-stage-0
```

You should see the following at the end of the output:

```
...
Setting additional cluster selectors: pvCapacity=large
```

### Verify the Resource has not been scheduled

You can see that Kratix has successfully handled the incoming request in the Workflow.

However, the worker cluster does not have the expected ECK pods:

```bash
kubectl --context $WORKER get pods
```

The Kratix controller logs tell you that Kratix was not able to find a matching cluster to schedule the request:

```bash
kubectl --context $PLATFORM --namespace kratix-platform-system \
  logs deployment/kratix-platform-controller-manager \
  --container manager | tac | grep --max-count 1 "no Destinations can be selected for scheduling"
```

The above command will give an output similar to:

```shell-session
# output formatted for readability
INFO no Destinations can be selected for scheduling
{"destinationSelectors":
  {
    "promise":[{"target":{"matchLabels":{"environment":"dev"}}}],
    "resource":[{"target":{"matchLabels":{"pvCapacity":"large"}}}]}
  }
```

Just as with the original `environment` label, Kratix queried what Destinations matched _all_
provided label selectors. Since no cluster was found the resource fails to schedule until
a Kratix Destination does match.

```mdx-code-block
import SchedulingRR from "/img/docs/workshop/scheduling-resource-requests.svg"
```

<figure class="diagram">
  <SchedulingRR className="small"/>
</figure>

### Label the cluster

Next add the `pvCapacity=large` label to the cluster:

```
kubectl --context $PLATFORM label destination worker-1 pvCapacity=large
```

### Verify the Resource is scheduled

Kratix detects this change to the Destination labels, identifies that the Resource now matches a Kratix Destination, and schedules the Resource:

```bash
kubectl --context $WORKER get pods -w
```

The above command will give an output similar to (it may take a few minutes):

```shell-session
NAME                   READY   STATUS    RESTARTS   AGE
elastic-es-default-0   1/1     Running   0          5m
```

Once you verify the resource has begun deployment in the worker, press <kbd>Ctrl</kbd>+<kbd>C</kbd> to exit the watch mode.

## Summary {#summary}

And with that, you have successfully managed the scheduling of both Promises and
their Resources!

To recap what you achieved:

1. ✅&nbsp;&nbsp; Your Promise is scheduled to desired Destinations
1. ✅&nbsp;&nbsp; Requests for Resource are dynamically scheduled depending on user input

## Clean up environment {#cleanup}

Before moving on, please remove the ECK Promise from your cluster.

To delete all the Promises:

```bash
kubectl --context $PLATFORM delete promises --all
```

## 🎉 &nbsp; Congratulations

✅&nbsp;&nbsp;Your Promise can now schedule to a multi-cluster infrastructure. <br />
👉🏾&nbsp;&nbsp;Next you will [update the Resource status](updating-status) with useful information.
