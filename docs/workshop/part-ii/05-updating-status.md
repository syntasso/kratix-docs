---
description: Updating the Resource status
title: Updating the Resource status
id: updating-status
slug: ../updating-status
---

```mdx-code-block
import PartialVerifyKratixWithOutPromises from '../../_partials/workshop/_verify-kratix-without-promises.md';
```

This is Part 2 of [a series](intro) illustrating how Kratix works. <br />
👈🏾&nbsp;&nbsp; Previous: [Intentionally schedule Promise resources](scheduling-promise))<br />
👉🏾&nbsp;&nbsp; Next: [What's next](whats-next)

<hr />

**In this tutorial, you will**

- [Conveying information back to the application developers](#understand-metadata)
- [Status](#status)
  - [Picking a status for your ECK Promise](#picking-a-status-for-your-eck-promise)
- [Request a resource and check its status](#request-a-resource-and-check-its-status)
- [Summary](#summary)

## Conveying information back to the application developers {#understand-metadata}

What we've focused on so far is how to define a Kratix Promise in a compelling way so that platform users choose to use the platform. A Kratix-powered platform enables users to ask for the services they need, on-demand, without having to know unnecessary business and service lifecycle requirements.

What platform users need, though, is the end-to-end experience of making a simple request, understanding what's happening with the request, then ultimately making use of the service created by the request. So how do you communicate back to platform users information about their request, and how do users use the services that the platform creates?

There are actually a number of ways you can communicate the status of a service to the platform, and the choice comes down to the Promise and Promise Workflow author.

One approach is to generate notifications for internal systems like Slack or Teams from the Promise Workflow's Pipeline container.

Another approach, which is what we'll choose today, is to follow convention and leverage the `status` field on Kubernetes resources. The Kratix Workflow's Pipeline has the ability to write information back to the status of the Resource.

In the context of your Promise, an example of what you might want to convey back is the configuration of the Resource (e.g. default configuration), and how to access the running Resources (e.g. a URL or connection string).

## Status

As we saw in [scheduling](./04-scheduling-promise.md), within the Pipeline container file system, Kratix mounts a [`/kratix/metadata`](../main/reference/resources/workflows#metadata) directory to manage important configuration that is independent of the Resources definitions for your State Store.

Similar to writing destination selector rules to `/kratix/metadata/destination-selectors.yaml`, you will write changes to the Resource status to the `/kratix/metadata/status.yaml` file.

- The `status.yaml` file can contain arbitrary key values, with the `message` key being a special key that is communicated back to the user when running `kubectl get elastic-cloud`.
- All other key-value pairs are viewable by getting the full Resource definition.

### Picking a status for your ECK Promise

You want to achieve two things with the ECK Promise Resource status:

- The Promise provides an option to pre-configure Beats with modules. Broadcast the existence of these modules as part of the `message` field.
- You are providing Kibana as a user interface, and your users need a way to access the Kibana UI. Provide the initial username and password as additional `status` values.

Update the `pipeline/run` script:

```bash title=pipeline/run -- add to the end
cat <<EOF > /kratix/metadata/status.yaml
message: "Instance ${name} provisioned with preconfigured system metrics"
initialLoginDetails:
    username: "elastic"
    passwordSecretName: "${name}-es-elastic-user"
EOF
```

## Request a resource and check its status

The `run` script is included in the Pipeline's container image, so to have these destination selector changes take effect, you need to rebuild and re-load the Docker image.

The `test-pipeline` script builds, loads, and runs the Docker image.

```bash
./scripts/test-pipeline
```

Verify that the test output directory contains the correct status:

```shell-session
📂 test
├── input
│   └── object.yaml
├── metadata
│   └── destination-selectors.yaml
#highlight-next-line
    └── status.yaml
└── output
    ├── beats.yaml
    ├── elasticsearch.yaml
    └── kibana.yaml
```

Next, install the Promise:

```bash
kubectl --context $PLATFORM create --filename promise.yaml
```

And finally, put on the Application Developer hat and make a request for a Elastic Cloud Resource:

```bash
kubectl --context $PLATFORM apply --filename resource-request.yaml
```

The status of the request for the Resource will start as `pending`, which is the Kratix default before a Workflow runs. Once the Workflow has completed, the status will be updated.

Check the status of the Resource:

```bash
kubectl --context $PLATFORM get elastic-clouds
```

The above command will return something close to the following:

```
NAME      STATUS
example   Instance example provisioned with preconfigured system metrics
```

As you can see, the `message` field appears in the output. To see the other keys, get the full `status` value from Kubernetes:

```bash
kubectl --context $PLATFORM get elastic-clouds example -o yaml | yq .status
```

```bash
conditions:
  - lastTransitionTime: "2023-01-01T12:00:00Z"
    message: Pipeline completed
    reason: PipelineExecutedSuccessfully
    status: "True"
    type: PipelineCompleted
message: Instance example provisioned with preconfigured system metrics
initialLoginDetails:
    username: elastic
    passwordSecretName: example-es-elastic-user
```

<details>
  <summary>🤔 Curious about the conditions fields?</summary>

### The conditions field {#the-conditions-field}

[Conditions](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#typical-status-properties) are a core Kubernetes concept and standard to convey information about a resources status. For example, Pods report back various conditions:

```
- lastProbeTime: null
  lastTransitionTime: "2023-06-20T15:02:20Z"
  status: "True"
  type: Ready
- lastProbeTime: null
  lastTransitionTime: "2023-06-20T15:02:20Z"
  status: "True"
  type: ContainersReady
- lastProbeTime: null
  lastTransitionTime: "2023-06-20T15:00:49Z"
  status: "True"
  type: PodScheduled

```

Conditions are also powerful for enabling you to wait for an occurrence. For example, you can wait for the health of a pod by running something like this:

```bash
kubectl --context $PLATFORM \
    wait pods \
    --namespace kratix-platform-system \
    --selector control-plane=controller-manager \
    --for condition=Ready \
    --timeout=90s
```

This same logic can be applied to Resources. Kratix sets the `PipelineCompleted` condition. For example, a user (or CI/Automation) could wait for a request to finish by running:

```bash
kubectl --context $PLATFORM wait elastic-cloud/example \
  --for=condition=PipelineCompleted --timeout=60s
```

Kratix supports this by default for all Resources.

</details>

## Summary

To recap what you achieved:

1. ✅&nbsp;&nbsp; Use metadata to set a custom Resource status

✅&nbsp;&nbsp;This tutorial concludes an Introduction to writing a Promise. <br />
👉🏾&nbsp;&nbsp;You can go check [what's next](whats-next) to learn about
what else you can achieve with Kratix.
