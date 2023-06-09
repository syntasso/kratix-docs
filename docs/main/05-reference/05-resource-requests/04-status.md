---
title: Resource Request Status
sidebar_label: Status
description: Documentation on how to expose information from the Pipeline to the Platform user through the Resource Request Status field
---

# Status
As part of your pipeline you can optionally send information about the
Resource Request back to the resource requester by writing information to `/metadata/status.yaml`.
The file can contain arbitrary key values, with the `message` key being a special key that is communicated back
to the user when running `kubectl get <resource-request>`. For example if my pipeline wrote the
following to the `/metadata/status.yaml` file:
 ```yaml
 message: Resource request provisioned with database size 10Gb
 connectionDetails:
   host: example.com
   dbName: root
 ```

Kratix would pickup the status and apply it back to the Resource Request. The
user would see the following when getting the Resource Request:
```shell
kubectl get database
NAME                   STATUS
example                Resource request provisioned with database size 10Gb
```
And if they inspected the full status output `kubectl get database example -o yaml`:
```yaml
apiVersion: example.promise.syntasso.io/v1
kind: Database
...
status:
 message: Resource request provisioned with database size 10Gb
 connectionDetails:
   host: example.com
   dbName: root
```

They will see all the additional key values. Status provides a simple way to
communicate information back to the resource requester. Kratix will automatically
inject the required fields for status into the `xaasCRD`,you do not have to manually
add these fields.

## Conditions
Kratix follows the Kubernetes convention of using [conditions](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#container-states)
to convey the status of a resource and to allow programmatic interactions. When a
Resource Request is created the `PipelineCompleted` condition will be set. The `status`
for the pipeline will be `False` until the pipeline is completed. For example
when a Resource Request is created for the first time the status will look like:
```yaml
status:
  conditions:
  - lastTransitionTime: "2023-03-07T15:50:22Z"
    message: Pipeline has not completed
    reason: PipelineNotCompleted
    status: "False"
    type: PipelineCompleted
```

once the pipeline has been completed it will look like:
```yaml
status:
  conditions:
  - lastTransitionTime: "2023-03-07T15:50:30Z"
    message: Pipeline completed
    reason: PipelineExecutedSuccessfully
    status: "True"
    type: PipelineCompleted
```

Conditions can be used to by external systems to programmatically check when a
Resource Requests pipeline has been completed. Kubectl also has built-in support
for waiting for a condition to be met. For example after creating a resource
request a user can run the following to have the CLI wait for the pipeline to be
completed:
```
kubectl wait redis/example --for=condition=PipelineCompleted --timeout=60s
```

Once the condition is `True` the command will exit.
