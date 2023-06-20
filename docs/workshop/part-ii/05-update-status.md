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

Kratix Promises are a great way to encapsulate business logic and complexity of
provisioning services, hiding it from the application developers. However the
end consumer of the output of the Promise is still the application developers
so we need someway to communicate back to them information about their request.
One approach to this would be to make API calls from within the pipeline to
your internal systems like Slack or Microsoft Teams. This approach is good but
introduces a separation between the place the where the user makes the request
and where they get feedback about it. Kratix provides built-in support for
providing feedback back to the application developers directly from within
Kubernetes by allowing the pipeline to write information back to the status of
the resource request.

In the context of your Promise an example of what we might want to convey back
is about what the configuration of the resource is (e.g. defaults we've
configured), and how to access the running instance.

## Status

Similar to how the pipeline orchestrated scheduling by writing to
`/metadata/cluster-selectors.yaml` Kratix exposes a `/metadata/status.yaml`
file. The file can contain arbitrary key values, with the `message` key being a
special key that is communicated back to the user when running `kubectl get
elastic-cloud`, the rest of the key values can be viewed by inspecting the full
document. For example you could convey a brief description of the ECK instance
back to the user in the `message` key, and provide more programmatic
information like the location of credentials to access the instance in other
fields.

In our Promise we know that we are pre-configuring Beats with modules, and we
know the username and the name of the secret containing the password. Add the
following to the end of the `pipeline/run` script:

```bash title=pipeline/run -- add to the end
cat <<EOF > /metadata/status.yaml
message: "Instance ${name} provisioned with preconfigured system metrics"
username: "elastic"
passwordSecretName: "${name}-es-elastic-user"
EOF
```

## Request a resource and check its status {#rr-status}

Since we've made changes to the pipeline you need to rebuild the image and load it
into the pipeline. Run the following script to build and test the pipeline:
```bash
./scripts/test-pipeline
```

Before installing and making a resource request you can verify that the output
contains the correct status:

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

Next you can install the Promise before you can make a request:
```bash
kubectl --context $PLATFORM create --filename promise.yaml
```

Finally, you can act like an Application Developer and make a request for an
instance of Elastic Cloud:

```bash
kubectl --context $PLATFORM apply --filename resource-request.yaml
```

Once this Resource Request is made, you will be able to check its status which
will start as `pending` as that is what Kratix sets before the pipeline runs,
but once the pipeline has complete you should see your additional fields.

You can check the status by listing the requested ECK instance.

```bash
kubectl --context $PLATFORM get elastic-clouds
```

```
NAME      STATUS
example   Instance example provisioned with preconfigured system metrics
```

The `message` field appears in the output. To see the other keys request the full
status document from Kubernetes:

```bash
kubectl --context $PLATFORM get elastic-clouds example -o yaml | yq .status
```

```
conditions:
  - lastTransitionTime: "2023-06-20T15:00:41Z"
    message: Pipeline completed
    reason: PipelineExecutedSuccessfully
    status: "True"
    type: PipelineCompleted
message: Instance example provisioned with preconfigured system metrics
passwordSecretName: example-es-elastic-user
username: elastic
```

<details>
  <summary>Whats curious what conditions are?</summary>

### The conditions field
[Conditions](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#typical-status-properties)
are a core Kubernetes concept and standard to convey information about a
resources status. For example Pods report back various conditions:

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

Conditions are also powerful for enabling you to wait for an occurrence. For
example, you can wait for the health of a pod by running something like this:

```bash
kubectl --context $PLATFORM \
    wait pods \
    --namespace kratix-platform-system \
    --selector control-plane=controller-manager \
    --for condition=Ready \
    --timeout=90s
```

This same logic can be applied to resource requests, Kratix automatically sets
the `PipelineCompleted` condition. For example a user, or some CI/Automation
could wait for a request to finish by running:

```bash
kubectl --context $PLATFORM wait elastic-cloud/example \
  --for=condition=PipelineCompleted --timeout=60s
```

Kratix supports this by default for all Resource Requests.
</details>



## Summary {#summary}

And with that, you have successfully improved the Promise, allowing the
author to provide useful details to the Application Developers who will be your
platform users.

To recap what you achieved:
1. ✅&nbsp;&nbsp; Use metadata to set a custom Resource Request status

✅&nbsp;&nbsp;This tutorial concludes an Introduction to writing a Promise. <br />
👉🏾&nbsp;&nbsp;You can go check [what's next](whats-next) to learn about
what else you can achieve with Kratix.
