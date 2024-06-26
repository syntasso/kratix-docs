---
title: Troubleshooting
description: Common issues when installing and running Kratix
---

## Common issues

### Documents are not appearing in my destination

There are many reasons why a document might not appear in a destination. A
document goes from the workflow to the destination in a few steps:

1. The workflow creates a document by placing it in `/kratix/output`
1. Kratix schedules this document to a destination, taking into account any
   scheduling selectors specified in
   `/kratix/metadata/destinaion-selectors.yaml`. If no matching destination
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


### Kratix is not starting
- check pod/pod logs
- check cert manager is installed
- check imagePullSecret

### Something about idempotency


