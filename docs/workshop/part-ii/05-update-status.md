---
description: Update the Resource Request status
title: Update the Resource Request status
id: update-status
slug: ../update-status
---
```mdx-code-block
import PartialVerifyKratixWithOutPromises from '../../_partials/workshop/_verify-kratix-without-promises.md';
```

This is Part 2 of [a series](intro) illustrating how Kratix works. <br />
👈🏾&nbsp;&nbsp; Previous: [Intentionally schedule Promise resources](schedule-promise))<br />
👉🏾&nbsp;&nbsp; Next: [What's next](whats-next)

<hr />

**In this tutorial, you will**
* [Revisit pipeline metadata](#understand-metadata)
* [Customise the Resource Request status](#customise-status)
* [Request a resource and check its status](#rr-status)
* [Summary](#summary)

## Conveying information back to the application developers {#understand-metadata}

Kratix Promises are a great way to encapsulate business logic and complexity of provisioning services, hiding it from the application developers. However, the application developer is still the consumer of the output from a Promise. Therefore, you need some way to communicate back to the application developers information about their request.

One approach to this would be to make API calls from within the pipeline to your internal systems like Slack or Microsoft Teams. This approach is good but introduces a separation between the place where the user makes the request and where they get feedback about it.

Kratix provides built-in support for providing feedback back to the application developers directly from within Kubernetes by allowing the pipeline to write information back to the status of the resource request.

In the context of your Promise, an example of what you might want to convey back is the configuration of the resource (e.g. default configuration), and how to access the running instance (e.g. a URL or connection string).

## Status

Similar to how the pipeline orchestrated scheduling by writing configuration code to `/metadata/cluster-selectors.yaml` Kratix exposes a `/metadata/status.yaml` file.

The `status.yaml` file can contain arbitrary key values, with the `message` key being a special key that is communicated back to the user when running `kubectl get elastic-cloud`. The rest of the key values can be viewed by inspecting the full document. For example you could convey a brief description of the ECK instance back to the user in the `message` key, and provide more programmatic information like the location of credentials to access the instance in other fields.

### Picking a status for your ECK promise

The ECK promise provides an option to pre-configure Beats with modules. In the event a user selects to enable metrics collection, you may want to validate this for them as a part of the message field. E.g. "message: "Instance ${name} provisioned with preconfigured system metrics".

In addition, you are providing Kibana as a user interface. Your users need a way to securely access this UI so you may want to provide the initial username and password.

Putting these two things together, you can add the following to the end of the `pipeline/run` script:

```bash title=pipeline/run -- add to the end
cat <<EOF > /metadata/status.yaml
message: "Instance ${name} provisioned with preconfigured system metrics"
initialLoginDetails:
    username: "elastic"
    passwordSecretName: "${name}-es-elastic-user"
EOF
```

## Request a resource and check its status {#rr-status}

In order to see these changes in the pipeline you need to rebuild the image and load it into the cluster. Run the following script to build, load and test the pipeline:
```bash
./scripts/test-pipeline
```

Before installing and making a resource request, you can verify the local test by checking that the test output directory contains the correct status:

```shell-session
📂 test
├── input
│   └── object.yaml
├── metadata
│   └── cluster-selectors.yaml
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

And finally, you can put on the Application Developer hat and make a request for an instance of Elastic Cloud:

```bash
kubectl --context $PLATFORM apply --filename resource-request.yaml
```

Once this Resource Request is made, you will be able to check its status. This will start as `pending` which is the Kratix default before a pipeline runs. Once the pipeline has complete the status will be updated.

To check the complete status, listing the requested ECK instance:

```bash
kubectl --context $PLATFORM get elastic-clouds
```

The above command will return something close to the following:
```
NAME      STATUS
example   Instance example provisioned with preconfigured system metrics
```

As you can see, the `message` field appears in the output. To see the other keys request the full status document from Kubernetes:

```bash
kubectl --context $PLATFORM get elastic-clouds example -o yaml | yq .status
```

```
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

### The conditions field
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

This same logic can be applied to resource requests, Kratix automatically sets the `PipelineCompleted` condition. For example, a user (or some CI/Automation) could wait for a request to finish by running:

```bash
kubectl --context $PLATFORM wait elastic-cloud/example \
  --for=condition=PipelineCompleted --timeout=60s
```

Kratix supports this by default for all Resource Requests.
</details>



## Summary {#summary}

And with that, you have successfully improved the Promise, allowing the author to provide useful details to the Application Developers who will be your platform users.

To recap what you achieved:
1. ✅&nbsp;&nbsp; Use metadata to set a custom Resource Request status

✅&nbsp;&nbsp;This tutorial concludes an Introduction to writing a Promise. <br />
👉🏾&nbsp;&nbsp;You can go check [what's next](whats-next) to learn about
what else you can achieve with Kratix.
