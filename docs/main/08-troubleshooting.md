---
title: Troubleshooting
description: Common issues when installing and running Kratix
---

## Common issues

### Documents are not appearing in my destination

There are many reasons why a document might not appear in a destination. A
document goes from the workflow to the destination in a few steps:

1. The workflow schedules a document by placing it in `/kratix/output`
1. Kratix schedules this document to a destination, taking into account any
   scheduling selectors specified in
   `/kratix/metadata/destinaion-selectors.yaml` or the Promises static
   `.spec.destinationSelectors`. If no matching destination
   exists it will not be scheduled until one is created.
1. Once scheduled it writes the document to the destination, using the
   destination's auth credentials.
1. The system at the destination must be healthy and able to accept the document
   for them to appear (e.g. Kubernetes resources or terraform files)

Lets first check:
1. Did the workflow output the documents correctly?
   - Check the workflow logs for any errors that might not being handled
     correctly.
     You can find the pod name by running

     ```
     kubectl get pods --selector kratix.io/resource-name=<request-name>
     ```
     Then inspect the logs for your container

     ```
     kubectl logs <workflow-pod-name> -c <container-name>
     ```

   - Check the `Work` resource (a internal Kratix resource that gets created to
     contain the outputs of a workflow) to see if the document is listed inside
     it.

     ```

     kubectl get work --selector kratix.io/resource-name=<request-name>
     ```

     Inspect the works `.spec` to see if your documents are listed

     ```
     kubectl get work <work-name> -o yaml
     ```

1. Did Kratix schedule the documents to the correct destination?
   - Check the `WorkPlacement` resource (a internal Kratix resource that gets
     created from the `Work` resource, representing the scheduling of a `Work`)
     to see if the document is listed inside it.

     ```
     kubectl get workplacement --selector kratix.io/resource-name=<request-name>
     ```

     Inspect the works `.spec.targetDestinationName` its scheduled to the
     correct destination

     ```
     kubectl get workplacement <workplacement-name> -o yaml | grep targetDestinationName
     ```

1. Did Kratix write the document to the destination?
   - Check the destination statestore and see if it contains the desired files.
     By default the files for a workplacement will be in the directory structure
     of:

     - Promise: `<destination-name>/dependencies/<promise-name>/<workflow-name>/<files>`

     - Resource: `<destination-name>/resources/<namespace>/<promise-name>/<request-name>/<workflow-name>/<files>`

     If your Destination is of type `.spec.filepath.mode=none` then the files
     will appear in the top-level directory of the destination.

1. Is the system at the Destination healthy and able to accept the document?
   - Check the Destination is healthy and able to accept the document. For
     example a Destination that is a Kubernetes cluster should have the a
     healthy GitOps installation that can successfully pull from the statestore
   - Check the destination's logs for any errors that might be preventing the
     document from being written.


### Documents are being scheduled to the wrong destination
Kratix uses label selectors to match documents to destinations. If a document is
being scheduled to the wrong destination, it is likely that the label selectors
are not matching correctly.

1. Check the labels are correctly applied to the destinations:

   ```
   kubectl get destinations --show-labels
   ```

1. Check the selectors are correctly specified to the documents. Fetch the
   Work for the workflow and inspect the `.spec.workloadGroups[*].destinationSelectors` field.

   ```
   kubectl get work --selector kratix.io/resource-name=<request-name>
   kubectl get work <work-name> -o jsonpath='{.spec.workloadGroups[*].destinationSelectors}'
   ```

   If this doesn't match the labels on the destination, the document will not be
   scheduled to the destination. See the [scheduling](./05-reference/07-multidestination-management.md) documentation
   on how to specify destination selectors.

### Kratix is not starting
Kratix is a Kubernetes operator and uses cert-manager to generate certificates
for the webhooks.

1. Check the Kratix operator status
   ```
   kubectl -n kratix-platform-system get pods
   ```

   If the pod is in a `Pending` state or the pod doesn't exist at all inspect
   the deployment for any errors
   ```
   kubectl -n kratix-platform-system describe deployment kratix-platform-controller-manager
   ```

   If the pod is in a `CrashLoopBackOff` or `Errored` state inspect the logs for any errors
   ```
   kubectl -n kratix-platform-system logs <pod-name> -c manager
   ```

   If the pod is in a `ErrImagePull` state check the Kubernetes has the correct
   network settings to pull from the container registry, and that if the image
   is being hosted in a private registry that [`imagePullSecrets` are correctly
   configured](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/)
   ```
   kubectl -n kratix-platform-system get deployment kratix-platform-controller-manager -o yaml | grep imagePullSecrets
   ```


1. If cert manager is not installed or is not working correctly
   Kratix will not start. Check cert-manager is installed and working correctly.
   ```
   kubectl -n cert-manager get pods
   ```

### Resource request is not being deleted

When a resource request is deleted, Kratix will run any delete pipelines
associated and cleanup any documents that were created. Kratix uses a Kubernetes
concept called
[finalizers](https://kubernetes.io/docs/concepts/overview/working-with-objects/finalizers/)
to ensure that all cleanup is done before the resource request is deleted
completely from the system. While a resource is being deleted you will see the
resource in a deletion state by the presence of a `.metadata.deletionTimestamp`
field on the resource.

1. Check the resource request is in a deletion state
   ```
   kubectl get <resource-kind> <resource-request> -o jsonpath='{.metadata.deletionTimestamp}'
   ```

When deleting Kratix completes 3 actions as part of cleanup in order, once an
action has been finished it no longer appears in the `.metadata.finalizer`
field. The cleanup steps Kratix completes are:
1. `kratix.io/delete-workflows` for running the delete pipelines associated with
   the resource request (if any)
1. `kratix.io/work-cleanup` for cleaning up the Work/WorkPlacement resources
   created by the resource request
1. `kratix.io/workflows-cleanup` for cleaning up the workflows created by the
   resource request

Kratix completes these actions in order, so if a resource request is stuck in
deletion it is likely that one of the finalizers is not being removed correctly.

Check what finalizers are left
```
kubectl get <resource-kind> <resource-request> -o jsonpath='{.metadata.finalizers}'
```

Check what finalizer is failing (since they run in order only one is failing)
and try to resolve the issue. If you are able to resolve the issue you can
manually remove the finalizer from the resource by editing the resource and
removing the finalizer from the `.metadata.finalizers`. Kratix will then
continue to delete and work its way through the remaining finalizers.

1. If the `kratix.io/delete-workflows` finalizer is not being removed, check to
   see if the delete workflow is failing

   ```
   kubectl get pods --selector kratix.io/resource-name=<resource-request>
   ```

1. If the `kratix.io/work-cleanup` finalizer is not being removed, check to see
   if the `Work`/`WorkPlacement` resources are failing to be deleted

   ```
   kubectl get work --selector kratix.io/resource-name=<resource-request>
   kubectl get workplacement --selector kratix.io/resource-name=<resource-request>
   ```

1. If the `kratix.io/workflows-cleanup` finalizer is not being removed, check to
   see if the workflows are failing to be deleted

   ```
   kubectl get jobs --selector kratix.io/resource-name=<resource-request>
   ```

### Promise is not being deleted

When a Promise is deleted, Kratix will run any delete pipelines associated and
cleanup any documents that were created, as well as any resource requests.
Kratix uses a Kubernetes concept called
[finalizers](https://kubernetes.io/docs/concepts/overview/working-with-objects/finalizers/)
to ensure that all cleanup is done before the Promise is deleted
completely from the system. While a Promise is being deleted you will see the
resource in a deletion state by the presence of a `.metadata.deletionTimestamp`
field on the resource.

1. Check the Promise is in a deletion state
   ```
   kubectl get promise <promise-name> -o jsonpath='{.metadata.deletionTimestamp}'
   ```

When deleting Kratix completes 6 actions as part of cleanup in order, once an
action has been finished it no longer appears in the `.metadata.finalizer`
field. The cleanup steps Kratix completes are:
1. `kratix.io/"delete-workflows"` for running the delete pipelines associated
   with the Promise (if any)
1. `kratix.io/workflows-cleanup` for cleaning up the workflows created by the
   Promise
1. `kratix.io/resource-request-cleanup` for cleaning up the resource requests
   created
1. `kratix.io/dynamic-controller-dependant-resources-cleanup` for cleaning up
   Kubernetes resources created to manage the Promise
1. `kratix.io/dependencies-cleanup` for cleaning up the dependencies created by
   the Promise
1. `kratix.io/api-crd-cleanup` for cleaning up the CRDs created by the Promise


Kratix completes these actions in order, so if a resource request is stuck in
deletion it is likely that one of the finalizers is not being removed correctly.

Check what finalizers are left
```
kubectl get <resource-kind> <resource-request> -o jsonpath='{.metadata.finalizers}'
```

Check what finalizer is failing (since they run in order only one is failing)
and try to resolve the issue. If you are able to resolve the issue you can
manually remove the finalizer from the resource by editing the resource and
removing the finalizer from the `.metadata.finalizers`. Kratix will then
continue to delete and work its way through the remaining finalizers.

When investigating a Promise deletion issue its worth having the logs of the
Kratix operator open to see if there are any errors being logged
```
kubectl -n kratix-platform-system logs <pod-name> -c manager | grep "controllers\.promise"
```

1. If the `kratix.io/delete-workflows` finalizer is not being removed, check to
   see if the delete workflow is failing and fix any issues preventing it from
   completing.

   ```
   kubectl -n kratix-platform-system get pods --selector kratix.io/promise-name=<promise-name> --selector kratix.io/work-action=delete
   ```

1. If the `kratix.io/workflows-cleanup` finalizer is not being removed, check to
   see if the workflows are failing to be deleted and manually cleanup any that
   are.

   ```
   kubectl -n kratix-platform-system get jobs --selector kratix.io/promise-name=<promise-name>
   ```

1. If the `kratix.io/resource-request-cleanup` finalizer is not being removed,
   check to see if the resource requests are failing to be deleted and [resource
   requests are not delete](#resource-request-is-not-being-deleted) for how to
   troubleshoot a resource request deletion failing

   ```
   kubectl get <resource-kind> -A
   ```

1. If the `kratix.io/dynamic-controller-dependant-resources-cleanup` finalizer
   is not being removed, check to see if the Kubernetes resources are failing to
   be deleted and try to manually clean up any left.

   ```
   kubectl get configmaps,roles,rolebindings,clusterroles,clusterrolebindings -A --selector kratix.io/promise-name=<promise-name>
   ```
1. If the `kratix.io/api-crd-cleanup` finalizer is not being removed, check to
   see if the CRD is failing to be deleted and try to manually delete.

   ```
   kubectl get crd --selector kratix.io/promise-name=<promise-name>
   ```

### Workflow Pod isn't appearing (Promise/Resource)

When a workflow is scheduled, Kratix will create a pod to run the workflow. If
the specification for the workflow is invalid, Kratix will fail to create the
Pod. Check the logs of the Kratix operator to see if there are any errors and
fix the relating issues in the workflow.

```
kubectl -n kratix-platform-system logs <pod-name> -c manager | grep <promise/resource name>
```

### Workflow Pod stuck in CrashLoopBackOff

When a workflow is scheduled, Kratix will create a pod to run the workflow. If
the Pod fails Kubernetes will restart the pod. If the pod is failing multiple
times the pod will eventually go into `CrashLoopBackoff`. In this scenario
Kratix will not try to reschedule the pod. You can force kratix to reschedule a
new pod by trigger a [manual
reconcilation](./reference/resources/workflows#manual-reconciliation)
