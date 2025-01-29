---
title: Resource Status
sidebar_label: Status
description: Documentation on how to expose information from the Pipeline to the Platform user through the Resource Status field
---

import StatusUpdateFlowDiagram from "/img/docs/workshop/part-ii-status-update-flow.svg"

# Status

As part of a Configure Pipeline you can optionally send information about the Resource
back to the resource requester by writing information to
`/kratix/metadata/status.yaml`. The file can contain arbitrary key values, with the
`message` key being a special key that is communicated back to the user when
running `kubectl get <resource-request>`. For example if the Pipeline container wrote the
following to the `/kratix/metadata/status.yaml` file:

```yaml
message: Resource provisioned with database size 10Gb
connectionDetails:
  host: example.com
  dbName: root
```

Kratix would pick up the status and apply it back to the Resource. The
user would see the following when using `kubectl` to `get` the Resource details:

```shell
kubectl get database
NAME                   STATUS
example                Resource provisioned with database size 10Gb
```

And if the requester inspected the full status output using
`kubectl get database example -o yaml`, they would see all additional status keys:

```yaml
apiVersion: example.promise.syntasso.io/v1
kind: Database
# ...
status:
  message: Resource provisioned with database size 10Gb
  connectionDetails:
    host: example.com
    dbName: root
```

Status provides a simple way to communicate information back to the resource
requester. Kratix will automatically inject the required fields for status into
the `api`, you do not have to manually add these fields.

Your Configure Pipeline can retrieve the existing status of a Resource by
querying the resource provided in the input dir `/kratix/input/object.yaml`. This helps to
ensure that updating the status is idempotent within your [workflows](workflows).

Let's take the example of a Promise that provisions S3 buckets and surfaces the
name and creation time of the bucket in the Resource. The first time the
Configure workflow ran, it would output the name of the bucket to the
`status.yaml`. The next time the workflow ran, assuming there were no changes
to the Resource, it would retrieve the name and creation time of the bucket from the
Resource and output these to the `status.yaml` again.

<figure className="diagram">
  <StatusUpdateFlowDiagram className="large"/>

  <figcaption>Flow of the Status update for the app Promise</figcaption>
</figure>

Status can also be used as a method of communicating information back to the
Delete workflow, such as the name of any external resources imperatively
created in the pipeline that need to be deleted as part of the cleanup.

## Multiple Pipelines

The status is written at the end of **each pipeline**. If you have multiple Pipelines in
a Configure workflow, the status will be updated at the end of each
Pipeline. This means that the status will be updated multiple times, and the
final status will be the one written by the last Pipeline.

Each Pipeline has access to the current status of the Resource, populated in
the `/kratix/input/object.yaml` file. This allows you to read the current status
to make decisions on what to write to the status file.

For example, if you had two Configure Pipelines:

```yaml
apiVersion: platform.kratix.io/v1alpha1
kind: Promise
metadata:
  name: iam
spec:
  workflows:
    resource:
      configure:
      - apiVersion: platform.kratix.io/v1alpha1
        kind: Pipeline
        metadata:
          name: create-user
          namespace: default
        spec:
          containers:
          - image: create-db:v0.1.0
      - apiVersion: platform.kratix.io/v1alpha1
        kind: Pipeline
        metadata:
          name: populate-vault
          namespace: default
        spec:
          containers:
          - image: populate-vault:v0.1.0

```

And the first pipeline wrote the following to `/kratix/metadata/status.yaml`:

```yaml
iam:
  user: admin
message: User created, next step is to create vault secret for user
```

Then the second pipeline would see the following in the `/kratix/input/object.yaml`:

```yaml
apiVersion: ...
kind: ...
metadata:
  ...
spec:
  ...
status:
  conditions: # this is being automatically set by Kratix
  - lastTransitionTime: "2024-08-21T10:27:45Z"
    message: Pipelines are still in progress
    reason: PipelinesInProgress
    status: "False"
    type: ConfigureWorkflowCompleted
  iam:
    user: admin
  message: User created, next step is to create vault secret for user
```

The second pipeline could then read the status and write the following to
`/kratix/metadata/status.yaml`:

```yaml
message: User created and vault secret created
iam:
  password: <vault-ref>
```

The end status would be:

```yaml
status:
  conditions:
  - lastTransitionTime: "2024-08-21T10:30:51Z"
    message: Pipelines completed
    reason: PipelinesExecutedSuccessfully
    status: "True"
    type: ConfigureWorkflowCompleted
  iam:
    password: <vault-ref>
    user: admin
  message: User created, next step is to create vault secret for user

```

The status is always merged, with the last Pipeline prioritised in case of
conflicts. In this example the `iam` key was updated with the additional
`password` key, and the `message` key was overwritten.

The next time the Configure workflow runs from the beginning, for example if a
user updated the request, the status set in `/kratix/input/object.yaml` would be
the same as the final status from the previous run of the Configure workflow.

## Conditions

Kratix follows the Kubernetes convention of using
[conditions](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#container-states)
to convey the status of a Resource and to allow programmatic interactions. When
a Resource is requested, the `ConfigureWorkflowCompleted` condition will be set. The
`status` for the workflow will be `False` until the workflow is completed. For
example, when a Resource is requested for the first time, the status will look like:

```yaml
status:
  conditions:
    - lastTransitionTime: "2023-03-07T15:50:22Z"
      message: Pipelines are still in progress
      reason: PipelinesInProgress
      status: "False"
      type: ConfigureWorkflowCompleted
```

Once the Configure workflow has been completed, it will look like:

```yaml
status:
  conditions:
    - lastTransitionTime: "2023-03-07T15:50:30Z"
      message: Pipelines completed
      reason: PipelinesExecutedSuccessfully
      status: "True"
      type: ConfigureWorkflowCompleted
```

Conditions can be used by external systems to programmatically check when a
Configure workflow has completed. `kubectl` also has built-in support for waiting for a
condition to be met. For example, after requesting a Resource, a user can run the
following to have the CLI wait for the Workflow to be completed:

```bash
kubectl wait redis/example --for=condition=ConfigureWorkflowCompleted --timeout=60s
```

Once the condition is `True` the command will exit.

# Health Checks

When configured for a Resource, [Health Checks](../healthdefinition) provide
an indication of Resource Health and communicate this to the user via the `status` of
the Resource.

When a Health Record exists for a given Resource, detailing the result of a Health Check
for that resource, Kratix updates the Resource to reflect this result. Let's use the example
of a Health Check for Resource Requests of a Psql Promise. Following the completion of a
Health Check, a `HealthRecord` detailing the result is created:

```yaml
apiVersion: platform.kratix.io/v1alpha1
kind: HealthRecord
metadata:
  name: dev-psql-health
data:
  promiseRef:
    name: psql
  resourceRef:
    name: dev-psql
    namespace: default
  state: ready
  lastRun: 1531958400
  details:
    acceptingConnection: true
```

Eventually the `status` of the corresponding request is updated with the information in
the Health Record.

```yaml
apiVersion: example.promise.syntasso.io/v1
kind: Psql
metadata:
  name: dev-psql
  namespace: default
# ...
status:
  healthRecord:
    state: ready
    lastRun: 1531958400
    details:
      acceptingConnections: true
```
