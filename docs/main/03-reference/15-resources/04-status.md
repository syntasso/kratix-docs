---
title: Resource Status
sidebar_label: Status
description: Documentation on how to expose information from the Pipeline to the Platform user through the Resource Status field
---

import StatusUpdateFlowDiagram from "/img/docs/workshop/part-ii-status-update-flow.svg"

# Status

As part of a Configure or Delete Pipeline you can optionally send information about the
Resource back to the resource requester by writing information to
`/kratix/metadata/status.yaml`.

:::info

Status is also available in Delete Pipelines, but only if you are using the suspend
functionality. On an immediate delete the resource will not update status as the
resource will be removed before status would be written.

:::

The file can contain arbitrary key values, with the `message` key being a special
key that is communicated back to the user when running `kubectl get
<resource-request>`. For example if the Pipeline container wrote the following to
the `/kratix/metadata/status.yaml` file:

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

The Delete Pipeline can also write its own `/kratix/metadata/status.yaml` directly,
the same way a Configure Pipeline does. This is particularly useful together with
[suspending a Delete Pipeline](workflows#suspending-or-retrying-a-delete-workflow): writing a
`message` key to `status.yaml` surfaces that message via `kubectl get`, rather than
only via `kubectl describe`.

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
        spec:
          containers:
          - image: create-db:v0.1.0
      - apiVersion: platform.kratix.io/v1alpha1
        kind: Pipeline
        metadata:
          name: populate-vault
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
  message: User created and vault secret created

```

The status is always merged, with the last Pipeline prioritised in case of
conflicts. In this example the `iam` key was updated with the additional
`password` key, and the `message` key was overwritten.

Nested maps are merged key by key, while lists and other values are replaced.
To remove a key, set it to `null` in `/kratix/metadata/status.yaml`. For
example, the following removes `iam.password` and leaves `iam.user` untouched:

```yaml
iam:
  password: null
```

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
    - lastTransitionTime: "2025-06-23T14:07:29Z"
      message: Pipelines completed
      reason: PipelinesExecutedSuccessfully
      status: "True"
      type: ConfigureWorkflowCompleted
...
```

Conditions can be used by external systems to programmatically check when a
Configure workflow has completed. `kubectl` also has built-in support for waiting for a
condition to be met. For example, after requesting a Resource, a user can run the
following to have the CLI wait for the Workflow to be completed:

```bash
kubectl wait redis/example --for=condition=ConfigureWorkflowCompleted --timeout=60s
```

Once the condition is `True` the command will exit. Inspect all conditions and
events with:

```bash
kubectl describe <resource> <name>
```

For a deeper discussion see the
[Resource Status and Events](/main/reference/resources/resource-status-events)
documentation.

## Health Checks

When configured for a Resource, Health checks provide an indication of Resource
Health and communicate this to the user via the `status` of the Resource.

When a [Health Record](../healthrecord) exists for a given Resource, detailing
the result of a Health Check for that resource, Kratix updates the Resource to
reflect this result. Let's use the example of a Health Check for Resource
Requests of a `Postgresql` Promise. Following the completion of a Health Check,
a `HealthRecord` detailing the result is created:

```yaml
apiVersion: platform.kratix.io/v1alpha1
kind: HealthRecord
metadata:
  name: dev-postgresql-health
  namespace: default
data:
  promiseVersion: v2.0.0
  promiseRef:
    name: postgresql
  resourceRef:
    name: dev-postgresql
    namespace: default
  state: ready
  lastRun: 1531958400
  details:
    acceptingConnection: true
```

Eventually the `status.healthStatus` of the corresponding request is updated
with the information in the Health Record:

```yaml
apiVersion: example.promise.syntasso.io/v1
kind: postgresql
metadata:
  name: dev-postgresql
  namespace: default
# ...
status:
  healthStatus:
    state: healthy
    expectedPromiseVersion: v2.0.0
    healthDefinitions: 1
    expectedRecords: 1
    healthRecords:
      - source:
          name: dev-postgresql-health
          namespace: default
        state: healthy
        lastRun: 1531958400
        details:
          acceptingConnections: true
        promiseVersion: v2.0.0
```

If more than one `HealthRecord` for a single resource exists, they will each appear
as an individual record under `status.healthStatus.healthRecords`.

Kratix only reads Health Records in the same namespace as the Resource. A
record in any other namespace is ignored, even if its `resourceRef` names the
Resource.

In the `status.healthStatus`:

* `state` is the worst state across all records received, regardless of version.
* `expectedPromiseVersion` is the Promise version that Kratix currently expects
  health results for on the resource.
* `expectedRecords` is the number of HealthDefinitions created by the Promise.
* `healthRecords` is a list of the heath records for the resource.

### The HealthChecksSucceeded condition

For a Resource of a versioned Promise, Kratix sets the `HealthChecksSucceeded`
condition detailing how many records have reported and whether they had passed.
The condition considers only the Health Records whose `promiseVersion` equals 
`status.healthStatus.expectedPromiseVersion`. 

```yaml
  conditions:
    - type: HealthChecksSucceeded
      status: "Unknown"
      reason: WaitingForRecords
      message: 1 of 2 records have reported at v2.0.0
      lastTransitionTime: "2026-09-24T10:15:00Z"
```

The below table illustrates the statuses the condition can report and why.

| Status  | Reason              | When                                                                                              |
| ------- | ------------------- | ------------------------------------------------------------------------------------------------- |
| True    | `AllRecordsHealthy` | Every expected record has reported at the expected version, and all of them are healthy or ready. |
| True    | `NoHealthChecks`    | `healthDefinitions` is `0`. This version of the Promise ships no health check.                    |
| False   | `Unhealthy`         | At least one record at the expected version is unhealthy.                                         |
| False   | `Degraded`          | Every expected record has reported, none is unhealthy, and at least one is degraded.              |
| Unknown | `WaitingForRecords` | Fewer records than expected have reported at the expected version, and none of them is unhealthy. |

A Resource of an unversioned Promise has no expectedPromiseVersion and no
HealthChecksSucceeded condition.

To wait until a Resource's current version passes its health checks, wait on
the HealthChecksSucceeded condition, not on state `state`:

```bash
kubectl wait <kind>/<name> --for=condition=HealthChecksSucceeded
```
