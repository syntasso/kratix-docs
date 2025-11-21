---
title: Troubleshooting
description: Common issues when installing and running Kratix and how to debug them
keywords: [debugging, debug, troubleshoot, error, logs, works, logs, logging, log levels]
---

## Common issues

### Documents are not appearing in my Destination

There are many reasons why a document might not appear in a Destination. A
document goes from the Workflow to the Destination in a few steps:

1. The Workflow schedules a document by placing it in `/kratix/output`
1. Kratix schedules this document to a Destination, taking into account any
   scheduling selectors specified in
   `/kratix/metadata/destination-selectors.yaml` or the Promise's static
   `.spec.destinationSelectors`. If no matching Destination
   exists it will not be scheduled until one is created. See the [scheduling
   documentation for more info](./reference/destinations/multidestination-management)
1. Once scheduled it writes the document to the Destination, using the
   Destination's auth credentials.
1. The system at the Destination must be healthy and able to accept the documents
   for them to appear (e.g. Kubernetes resources or terraform files)

Let's first check:

1. The workflow outputted the documents
   - Check the Workflow logs for any errors that might not be being handled
     correctly.
     You can query the workflow pods by running:

     ```bash
     kubectl get pods --selector kratix.io/promise-name=<name of the promise>, \
      kratix.io/workflow-type=<promise or resource>, \
      kratix.io/workflow-action=<configure or delete>, \
      kratix.io/pipeline-name=<name of pipeline>, \
      kratix.io/resource-name=<name of resource>
     ```

     You can use as any combination of these labels depending on the workflow you
     are querying.

     You can find the name of a _specific_ Pipeline pod by running

     ```bash
     kubectl get pods --selector kratix.io/resource-name=<request-name>
     ```

     Then inspect the logs for your container, this will be the container name of
     the workflow Pipeline in your Promise specification

     ```bash
     kubectl logs <workflow-pod-name> -c <container-name>
     ```

   - Check the `Work` resource (an internal Kratix resource that is created to
     contain the outputs of a Workflow) to see if the document is listed inside
     it.

     ```bash
     kubectl get work --selector kratix.io/resource-name=<request-name>
     ```

     Inspect the Work's `.spec` to see if your documents are listed

     ```bash
     kubectl get work <work-name> -o yaml
     ```

     Please note that the `workload.content` is compressed to reduce the size of the Work, to inspect
     the raw content of the document you can decode and decompress with `gzip` you can do the following:

      ```bash
      // Get the filepath of the first scheduled document
      kubectl get work <work-name> -o=jsonpath='{.spec.workloadGroups[0].workloads[0].filepath}'

      // Get, decode and decompress the content of the first scheduled document
      kubectl get work <work-name> -o=jsonpath='{.spec.workloadGroups[0].workloads[0].content}' | base64 -d | gzip -d
      ```

1. Check the document is scheduled to the correct Destination
   - Check the `WorkPlacement` resource (an internal Kratix resource that is
     created from the `Work` resource, representing the scheduling of a `Work`)
     to see if the document is listed inside it.

     ```bash
     kubectl get workplacement --selector kratix.io/work=<work-name>
     ```

     As with the `Work`, the `workload.content` in a WorkPlacement is compressed to reduce the size of the WorkPlacement, to inspect the raw content of the document you can decode and decompress with `gzip` you can do the following:

      ```bash
      // Get the filepath of the first scheduled document
      kubectl get workplacement <workplacement-name> -o=jsonpath='{.spec.workloads[0].filepath}'

      // Get, decode and decompress the content of the first scheduled document
      kubectl get workplacement <workplacement-name> -o=jsonpath='{.spec.workloads[0].content}' | base64 -d | gzip -d
      ```

     If the `WorkPlacement` doesn't exist, this means that no Destination was found
     that matches the required scheduling selectors. Kratix has been unable to
     schedule the `Work`. See [below for further steps to
     investigate](#documents-are-being-scheduled-to-the-wrong-destination)

     Inspect the Work's `.spec.targetDestinationName` to verify that it is scheduled to the
     correct Destination

     ```
     kubectl get workplacement <workplacement-name> -o yaml | grep targetDestinationName
     ```

1. The document was successfully written to the Destination
   - Check the Destination statestore and see if it contains the desired files.
     By default the files for a workplacement will be in the directory structure
     of:

     - Promise: `<destination-name>/dependencies/<promise-name>/<workflow-name>/<files>`

     - Resource: `<destination-name>/resources/<namespace>/<promise-name>/<request-name>/<workflow-name>/<files>`

     If your Destination is of type `.spec.filepath.mode=none` then the files
     will appear in the top-level directory of the Destination.

     If it is not appearing, check the logs of the Kratix operator to see if there
     are any errors connecting to the Destination

     ```
     kubectl -n kratix-platform-system logs <pod-name> -c manager
     ```

1. The system reconciling the Destination is healthy (e.g. Flux/Argo)
   - Check the Destination is healthy and able to accept the document. For
     example, a Destination that is a Kubernetes cluster should have a
     healthy GitOps installation that can successfully pull from the Destination


### Documents are being scheduled to the wrong Destination

Kratix uses [label
selectors](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/)
to match documents to Destinations. If a document is being scheduled to the
wrong Destination or no Destination at all, it is likely that the label selectors do not match.

1. Check the labels are correctly applied to the Destinations:

   ```
   kubectl get destinations --show-labels
   ```

1. Check the selectors are correctly specified to the documents. Fetch the
   Work for the Workflow and inspect the `.spec.workloadGroups[*].destinationSelectors` field.

   ```
   kubectl get work --selector kratix.io/resource-name=<request-name>
   kubectl get work <work-name> -o jsonpath='{.spec.workloadGroups[*].destinationSelectors}'
   ```

   If this doesn't match the labels on the Destination, the document will not be
   scheduled to the Destination. See the [scheduling](./reference/destinations/multidestination-management) documentation
   on how to specify Destination selectors.

### Kratix is not starting

Kratix is a Kubernetes operator and uses cert-manager to generate certificates
for the webhooks.

1. Check the Kratix operator status
   ```
   kubectl -n kratix-platform-system get pods
   ```

   If the pod is in a `Pending` state or the pod doesn't exist at all, inspect
   the deployment for any errors
   ```
   kubectl -n kratix-platform-system describe deployment kratix-platform-controller-manager
   ```

   If the pod is in a `CrashLoopBackOff` or `Errored` state, inspect the logs for any errors
   ```
   kubectl -n kratix-platform-system logs <pod-name> -c manager
   ```

   If the pod is in a `ErrImagePull` state check the Kubernetes cluster has the correct
   network settings to pull from the container registry, and that if the image
   is being hosted in a private registry that [`imagePullSecrets` are correctly
   configured](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/)
   ```
   kubectl -n kratix-platform-system get deployment kratix-platform-controller-manager -o yaml | grep imagePullSecrets
   ```


1. If cert manager is not installed or is not working correctly
   Kratix will not start. Check cert-manager is installed and working correctly:
   ```
   kubectl -n cert-manager get pods
   ```

### Resource request is not being deleted

When a resource request is deleted, Kratix will run any delete pipelines
associated with the request and clean up any documents that were created. Kratix uses a Kubernetes
concept called
[finalizers](https://kubernetes.io/docs/concepts/overview/working-with-objects/finalizers/)
to ensure that all cleanup is done before the resource request is deleted
completely from the system. While a resource is being deleted you will see the
resource in a deletion state with the presence of a `.metadata.deletionTimestamp`
field on the resource.

1. Check the resource request is in a deletion state
   ```
   kubectl get <resource-kind> <resource-request> -o jsonpath='{.metadata.deletionTimestamp}'
   ```

When deleting, Kratix completes three actions as part of cleanup in order. Once an
action has completed it no longer appears in the `.metadata.finalizer`
field. The cleanup steps Kratix completes are:
1. `kratix.io/delete-workflows` for running the delete pipelines associated with
   the resource request (if any)
1. `kratix.io/work-cleanup` for cleaning up the Work/WorkPlacement resources
   created by the resource request
1. `kratix.io/workflows-cleanup` for cleaning up the Workflows created by the
   resource request

As Kratix completes these actions in order, if a resource request is stuck in
deletion it is likely that one of the finalizers is not being removed correctly.

Check which finalizers are remaining

```
kubectl get <resource-kind> <resource-request> -o jsonpath='{.metadata.finalizers}'
```

Check which finalizer is failing (as they run in order, only one will be failing)
and try to resolve the issue. If you are able to resolve the issue you can
manually remove the finalizer from the resource by editing the resource and
removing the finalizer from the `.metadata.finalizers`. Kratix will then
continue to delete and work its way through the remaining finalizers.

1. If the `kratix.io/delete-workflows` finalizer is not being removed, check to
   see whether the delete Workflow is failing and fix any issues preventing it from
   completing.

   ```
   kubectl get pods --selector kratix.io/resource-name=<resource-request>
   ```

   Once the issue is fixed, you can trigger the delete Workflow to re-run by triggering a
   [manual reconciliation](/main/learn-more/controlling-with-labels).

1. If the `kratix.io/work-cleanup` finalizer is not being removed, check to see
   whether the `Work`/`WorkPlacement` resources are failing to be deleted

   ```
   kubectl get work --selector kratix.io/resource-name=<resource-request>
   kubectl get workplacement --selector kratix.io/work=<work-name>
   ```

1. If the `kratix.io/workflows-cleanup` finalizer is not being removed, check to
   see if the Workflows are failing to be deleted

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

When deleting Kratix completes six actions as part of cleanup in order, once an
action has completed it no longer appears in the `.metadata.finalizer`
field. The cleanup steps Kratix completes are:
1. `kratix.io/"delete-workflows"` for running the delete pipelines associated
   with the Promise (if any)
1. `kratix.io/workflows-cleanup` for cleaning up the Workflows created by the
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

Check which finalizers are remaining

```
kubectl get <resource-kind> <resource-request> -o jsonpath='{.metadata.finalizers}'
```

Check what finalizer is failing (as they run in order only one will be failing)
and try to resolve the issue. If you are able to resolve the issue you can
manually remove the finalizer from the resource by editing the resource and
removing the finalizer from the `.metadata.finalizers`. Kratix will then
continue to delete and work its way through the remaining finalizers.

When investigating a Promise deletion issue it beneficial to have the logs of the
Kratix operator open to see if any errors are being logged

```bash
kubectl -n kratix-platform-system logs <pod-name> -c manager | grep "controllers\.promise"
```

1. If the `kratix.io/delete-workflows` finalizer is not being removed, check to
   see whether the delete Workflow is failing and fix any issues preventing it from
   completing.

   ```bash
   kubectl -n kratix-platform-system get pods --selector kratix.io/promise-name=<promise-name> --selector kratix.io/work-action=delete
   ```

   Once the issue is fixed, you can trigger the delete Workflow to re-run by triggering a
   [manual reconciliation](/main/learn-more/controlling-with-labels).

1. If the `kratix.io/workflows-cleanup` finalizer is not being removed, check to
   see whether the Workflows are failing to be deleted and manually cleanup any that
   are.

   ```bash
   kubectl -n kratix-platform-system get jobs --selector kratix.io/promise-name=<promise-name>
   ```

1. If the `kratix.io/resource-request-cleanup` finalizer is not being removed,
   check to see if the resource requests are failing to be deleted and [resource
   requests are not delete](#resource-request-is-not-being-deleted) for how to
   troubleshoot a resource request deletion failing

   ```bash
   kubectl get <resource-kind> -A
   ```

1. If the `kratix.io/dynamic-controller-dependant-resources-cleanup` finalizer
   is not being removed, check to see if any Kubernetes resources are failing to
   be deleted and try to manually clean up any remaining.

   ```bash
   kubectl get configmaps,roles,rolebindings,clusterroles,clusterrolebindings -A --selector kratix.io/promise-name=<promise-name>
   ```

1. If the `kratix.io/api-crd-cleanup` finalizer is not being removed, check to
   see whether the CRD is failing to be deleted and try to manually delete it.

   ```bash
   kubectl get crd --selector kratix.io/promise-name=<promise-name>
   ```

### Workflow Pod isn't appearing

When a Workflow is scheduled, Kratix will create a pod to run the Workflow. If
the specification for the Workflow is invalid, Kratix will fail to create the
Pod. Check the logs of the Kratix operator to see if there are any errors and
fix the relating issues in the Workflow.

```bash
kubectl -n kratix-platform-system logs <pod-name> -c manager | grep <promise/resource name>
```

### Workflow Pod stuck in CrashLoopBackOff

When a Workflow is scheduled, Kratix will create a pod to run the Workflow. If
the Pod fails Kubernetes will restart the pod. If the pod is failing multiple
times the pod will eventually go into `CrashLoopBackoff`. In this scenario
Kratix will not try to reschedule the pod. You can force Kratix to reschedule a
new pod by triggering a [manual
reconciliation](/main/learn-more/controlling-with-labels)

### Workflow Pod doesn't have Kubernetes API access

A Workflow is, by default, given limited access to the Kubernetes API. You will
see errors in the logs of the Workflow if it is trying to access the API without
the correct permissions. To give the Workflow more access you need to create
additional
[RBAC permissions](https://kubernetes.io/docs/reference/access-authn-authz/rbac/). [Check the
documentation](/main/reference/workflows#role-based-access-control-rbac) for how you can configure permissions for Workflows
alongside some examples.
