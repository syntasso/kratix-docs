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

## Revisit pipeline metadata {#understand-metadata}

In the last section of this workshop you used the `/metadata/cluster-selectors.yaml` file
in the Promise pipeline to extend and further refine scheduling selectors.

Now it is time to use the `/metadata/status.yaml` file to manage the information 
returned to an Application Developer after then make a Resource Request.

This file must be a valid yaml document, but otherwise has very few limitations.
All of the information stored in this document will be set on the Resource Request
in the status section.

The status field can hold a number of keys which can be programmatically seen when
describing a Resource Request, or programmatically read for use in scripts or other
tools.

There are two special keys when it comes to status in Kubernetes:

1. `message`
2. `conditions`

### The message field

The message field is used as the text visible when a user uses `kubectl get` to list
a set of resources. The intention of this field is to be a snapshot of the state of the
resource and to be human readable.

By default, Kratix will use this space to indicate pipeline completion. Starting by saying
a request is `pending` and then later updating it to `Resource requested` when the pipeline
is complete.

You are welcome to overwrite this value with information that would be more helpful for your
users. For example you may want to provide a custom URL with something like `URL: https://custom.url.com`.

### The conditions field

When resources implement the conditions field Kubernetes provides the ability to take action
based on the status of that resource. For example, you can check wait for the health of a pod
by running something like this:

```bash
kubectl --context $PLATFORM \
    wait pods \
    --namespace kratix-platform-system \
    --selector control-plane=controller-manager \
    --for condition=Ready \
    --timeout=90s
```

Kratix supports this by default for all Resource Requests.


## Customise the Resource Request status {#customise-status}

At this point in the workshop you have built a repeatable process for updating the Promise
and have also used the `/metadata` directory already.

Therefore, this is a good chance for you to test your comfort with the process of
extending the Promise.

You should take some time to try and do one of the following:
1. Update the message field to be more user friendly
1. Extend the provided status to include more details

<details>
    <summary>🤔 Not sure how to get started?</summary>

The goal for this is to create a file called `status.yaml` and make sure it is saved
to the `/metadata` directory during the pipeline execution.

This can be done as simply as adding the following to the bottom of your current 
`run` script:

```bash
cat <<EOF > /metadata/status.yaml
message: a new message
additional-data:
    provided-name: $name
EOF
```

</details>

## Request a resource and check its status {#rr-status}

### Prerequisite setup

<PartialVerifyKratixWithOutPromises />

<hr />

Given this setup, you should now be able to follow the same installation
steps used in previous workshop steps.

<details>
    <summary>🤔 Not sure how to install the Promise and make a request?</summary>

Don't forget to get started with a build, load and test of the pipeline image:

```bash
./scripts/test-pipeline
```

Verify that the output shows only the following files:

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

Finally, you can act like an Application Developer and make a request for an instance of Elastic Cloud:
```bash
kubectl --context $PLATFORM apply --filename resource-request.yaml
```

</details>

Once this Resource Request is made, you will be able to check its status which 
will start as `pending` as that is what Kratix sets before the pipeline runs, 
but once the pipeline has complete you should see your additional fields.

<details>
    <summary>🤔 Not sure how to check the status?</summary>

You can check the status by describing the requested ECK instance.

```bash
kubectl --context $PLATFORM describe elastic-clouds
```

</details>


## Summary {#summary}

And with that, you have successfully made a Promise improvement on your own. This
improvement has introduced how you as the Promise author can provide useful details
to the Application Developers who will be your platform users.

To recap what you achieved:
1. ✅&nbsp;&nbsp; Use metadata to set a custom Resource Request status
1. ✅&nbsp;&nbsp; Use the convenience scripts from this workshop to iterate on the Promise

✅&nbsp;&nbsp;This tutorial concludes an Introduction to writing a Promise. <br />
👉🏾&nbsp;&nbsp;You can go check [what's next](whats-next) to learn about
what else you can achieve with Kratix.
