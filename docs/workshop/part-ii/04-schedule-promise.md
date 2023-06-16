---
description: Intentionally schedule where to provision a Promise
title: Schedule Promises
id: schedule-promise
slug: ../schedule-promise
---
```mdx-code-block
import PartialVerifyKratixWithOutPromises from '../../_partials/workshop/_verify-kratix-without-promises.md';
```

This is Part 2 of [a series](intro) illustrating how Kratix works. <br />
👈🏾&nbsp;&nbsp; Previous: [Extract shared dependencies](shared-dependencies)<br />
👉🏾&nbsp;&nbsp; Next: [Update the Resource Request status](update-status)

<hr />

**In this tutorial, you will**
* [Understand Promise scheduling](#understand-scheduling)
* [Schedule Promises to specific clusters](#dependency-scheduling)
* [Schedule Promise Resource Requests to specific clusters](#rr-scheduling)
* [Clean up environment](#cleanup)
* [Summary](#summary)

### Prerequisite setup

<PartialVerifyKratixWithOutPromises />


## Promise scheduling {#understand-scheduling}
So far you have built an ECK Promise that will allow us to deliver ECK instances on-demand to the
application developers.

When developing locally you have been using a single worker cluster, which Kratix has been scheduling
everything to by default. In reality, the likely hood is that an organisation will have multiple worker
clusters, potentially spread out across multiple zones, regions, and cloud-providers. Each individual cluster
might be designed for a particular purpose, e.g. clusters that contain GPUs for AI intensive workloads, or
edge clusters that are designed to run particular applications close the intended consumers. However it is
common to want some software deployed on many of these speciality clusters.

This section will focus on how Kratix has native support for flexible multi-cluster scheduling.

Kratix uses a label-based approach to scheduling what cluster resources go to, similar to how Kubernetes works
when [scheduling pods](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/).
When you create a cluster resource in Kratix you assign a set of labels to it. Kratix also manages additions
to these labels as your platform may evolve.

Use the following command to inspect at what labels the worker cluster currently has:

```bash
kubectl --context $PLATFORM get clusters --show-labels
```

You should see output like:
```
NAME               AGE   LABELS
worker-cluster-1    1h   <none>
```

The cluster currently has no labels applied. So far the Promise you have written has taken no opinion
about what sort of clusters it should schedule work to, meaning that a Cluster with no labels is
acceptable place to schedule work to.

Imagine you have decided that it is not appropriate for ECK resources to be deployed to certain
clusters, so you have decided to restrict the ECK Promise and its Resource Requests to only
development clusters. You have also decided that development clusters will be labelled in
Kratix with the `environment=dev` label. In order to get the ECK Promise to only schedule
to clusters with these labels you need to update the Promise.

## Schedule Promises to specific clusters {#dependency-scheduling}
Inside of a Promise you can define what clusters the Promise should schedule resources
to by specifying the `clusterSelector` field.

This field contains a map of key values that are all the labels that must be matched to
a cluster. Update the Promise to contain the new `clusterSelector` field shown below:

```yaml title=promise.yaml
apiVersion: platform.kratix.io/v1alpha1
kind: Promise
metadata:
  name: elastic-cloud
  namespace: default
spec:
  #highlight-start
  clusterSelector:
    environment: dev
  #highlight-end
  ...
```

### Apply the Promise

The Promise is now setup to only schedule to clusters with the matching label. Create
the Promise in Kubernetes:

```bash
kubectl --context $PLATFORM create --filename promise.yaml
```

### Verify the resource are not scheduled
The cluster as it is right now does not contain the `environment: dev` label, so nothing will get scheduled
to the worker cluster. When you get the pods on the worker, you will not see the requested ECK resources:

```bash
kubectl --context $WORKER get pods -n elastic-system
```

Whats happening is that Kratix is querying what Clusters are available and is
searching for a cluster with the matching labels, because no cluster is found the
resource fails to get scheduled.
```mdx-code-block
import SchedulingPromise from "/img/docs/workshop/scheduling-promise-dependencies.svg"
```
<figure class="diagram">
  <SchedulingPromise className="small"/>
</figure>

### Label the cluster
It is time to update the Kratix cluster to have the matching `environment=dev` label which is required
to receive the ECK resources:

```
kubectl --context $PLATFORM label cluster worker-cluster-1 environment=dev
```

### Verify the worker
Kratix is going to detect this change to the cluster and start to schedule resources
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

You have now successfully updated the Promise to only schedule to clusters with the
`environment=dev` label. If you were to create a new worker cluster that didn't have
the `environment=dev` label the Promise wouldn't schedule any work to it.

## Schedule Resource Requests to specific clusters {#rr-scheduling}

Being able to define inside the Promise what types of clusters the resources can
be scheduled to enables a lot control for operators. But in the event a Promise matches more than
one cluster, it does not enable the Promise author to decide which of the matching Kratix clusters
receives the resources from a user request.

Imagine that you have additional requirements for any Resource Requests that sets
`enableDataCollection: true`. For example, these resources requests require a Kubernetes cluster with
a persistent volume storage of adequate size to handle the data collected. When false you might
want a different type of cluster or might decide that it has no opinion at all on what cluster should
be used.

To achieve this with Kratix, you can optionally set additional labels at request time by
outputting them from the pipeline.

Kratix has a convention of using a [`/metadata`](../../../docs/main/reference/resource-requests/pipelines#metadata)
directory to manage important configurations generated in the pipeline that are independent of
the resources you want stored in a GitOps state store.

To set additional scheduling labels, you can add key:value pairs `/metadata/cluster-selectors.yaml` file.

Any selectors added in this file will be appended to the list provided by the Promise. This means means
that you cannot override the Kratix cluster selectors set in the Promise definition. This enables clear
security controls defined by the Promise author, and also guarantees that a Resource Request
will always be scheduled to a Kratix cluster that has already received the Promise dependencies.

Given the new requirements for a persistent volume, you can update the Resource Request pipeline to add
the `pvCapacity=large` selector when `enableDataCollection` is set to `true`. This will indicate that
Kratix should only schedule these Resource Requests to clusters with a large pool of persistent volumes.

Add the following to the end of the `pipeline/run` script:

```bash title=pipeline/run -- add to the end
if ${enableDataCollection}; then
  echo "Setting additional cluster selectors: pvCapacity=large"
  echo "pvCapacity: large" > /metadata/cluster-selectors.yaml
fi
```

### Build the image

Since the pipeline script has changed you need to rebuild and load the docker
image. Run:

```bash
./scripts/build-pipeline
```

### Send a Resource Request
Finally, make a Resource Request with the `enableDataCollection` set to `true`.
Open the `resource-request.yaml` and update the config.

```bash
kubectl --context $PLATFORM apply --filename resource-request.yaml
```

You can see that Kratix accepts this request and triggers the pipeline:

```bash
kubectl --context $PLATFORM get pods -w
```

### Verify the pipeline
Once the pipeline has complete take a look at the logs for the request:

```bash
kubectl --context $PLATFORM logs \
  --selector kratix-promise-id=elastic-cloud-default \
  --container xaas-request-pipeline-stage-0
```

You should see the following at the end of the output:
```
...
Setting additional cluster selectors: pvCapacity=large
```

### Verify the Resource Request has not been scheduled
You can see that Kratix has successfully handle the incoming request in the pipeline.

But looking deeper, the worker cluster does not have the expected ECK pods:

```bash
kubectl --context $WORKER get pods
```

Next inspect the Kratix controller logs. This query will surface that Kratix was not
able to find a matching cluster to schedule the request:
```yaml
kubectl --context $PLATFORM --namespace kratix-platform-system \
  logs deployment/kratix-platform-controller-manager \
  --container manager | grep "Reconciler error"
```

The above command will give an output similar to:
```shell-session
# output formatted for readability
ERROR	Reconciler error {
    "Work": {"name":"eck-default","namespace":"default"},
    "error": "no Clusters can be selected for clusterSelector"
}
```

Just as with the original `environment` label, Kratix queryed what Clusters matched _all_
provided label selectors. Since no cluster was found the resource fails to schedule until
a Kratix cluster does match.

```mdx-code-block
import SchedulingRR from "/img/docs/workshop/scheduling-resource-requests.svg"
```
<figure class="diagram">
  <SchedulingRR className="small"/>
</figure>


### Label the cluster
Next add the `pvCapacity=large` label to the cluster:

```
kubectl --context $PLATFORM label cluster worker-cluster-1 pvCapacity=large
```


### Verify the Resource Request is scheduled
Kratix detects this change to the cluster labels and identifies that the Resource
Request matches a Kratix Cluster so begins the scheduling process:
```bash
kubectl --context $WORKER get pods -w
```

The above command will give an output similar to (it may take a few minutes):
```shell-session
NAME                            READY   STATUS    RESTARTS   AGE
elastic-instance-es-default-0   1/1     Running   0          5m
```

Once you verify the scheduling has started, press <kbd>Ctrl</kbd>+<kbd>C</kbd> to
exit the watch mode.

## Summary {#summary}

And with that, you have successfully managed the scheduling of both Promises and
their Resource Requests!

To recap what you achieved:
1. ✅&nbsp;&nbsp; Your Promise is scheduled to desired clusters
1. ✅&nbsp;&nbsp; Resource requests are dynamically scheduled depending on user input

## Clean up environment {#cleanup}

Before moving on, please remove the ECK Promise from your cluster.

To delete all the Promises:
```bash
kubectl --context $PLATFORM delete promises --all
```

## 🎉 &nbsp; Congratulations!
✅&nbsp;&nbsp;Your Promise can now schedule to a multi-cluster infrastructure. <br />
👉🏾&nbsp;&nbsp;Next you will [update the Resource Request status](update-status) with useful information.
