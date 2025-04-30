---
title: Workflows
sidebar_position: 12
sidebar_label: Workflows
description: Learn more about conventions in workflows
id: workflows
---

A [Kratix Promise](./promises/intro) can be configured with a series of **workflows**
for both Promises and Resources, defined within the Promise `workflows` field.

Within the workflows, Promise writers can define a series of actions that will be executed
when certain conditions are met in the system.

## Summary

The supported workflows are summarised in the table below. See the other sections on this
page for details.

|                        | Trigger(s)                                                                       | Supported Pipelines         |
|------------------------|----------------------------------------------------------------------------------|-----------------------------|
| **Promise Configure**  | The Promise is created, updated, or reconciled                                   | Multiple, executed serially |
| **Promise Delete**     | The Promise is deleted                                                           | Single                      |
| **Resource Configure** | The Resource is created, updated or reconciled, or the parent Promise is updated | Multiple, executed serially |
| **Resource Delete**    | The Resource is deleted                                                          | Single                      |

An example of how `workflows` are defined within the Promise is shown below.

```yaml
platform: platform.kratix.io/v1alpha1
kind: Promise
metadata:
  ...
spec:
  ...
  workflows:
    resource:
      configure:
        - # Pipeline definitions (multiple)
      delete:
        - # Pipeline definition (single)
    promise:
      configure:
        - # Pipeline definitions (multiple)
      delete:
        - # Pipeline definition (single)
```

A particular workflow (e.g. `resource.configure`) is an array of Kratix Pipeline objects
that will be executed in order.

See the next section to learn how to define a Pipeline.

## Pipelines

A Kratix `Pipeline` kind is a simple wrapper around a Kubernetes Pod.

Pipelines will automatically mount the necessary [Kratix Volumes](#volumes) and set
[Environment Variables](#environment-variables) for the provided containers.

Any `labels` and `annotations` provided in the Pipeline spec will be passed
through to the underlying Pod spec.

An example Pipeline is shown below.

```yaml
apiVersion: platform.kratix.io/v1alpha1
kind: Pipeline
metadata:
  name: # Name (must be unique within the Promise)
  namespace: # Namespace (optional)
  labels: # Labels (optional)
  annotations: # Annotations (optional)
spec:
  volumes:
    - # Volume definitions, in addition to `/kratix` volumes (optional)
  containers:
    - name: # Container name (must be unique within the Pipeline)
      image: # Container image to run
      # Supported fields passed through to underlying Pod spec (all optional):
      command: []
      args: []
      env: []
      envFrom: []
      volumeMounts: []
      imagePullPolicy: # Either Always, IfNotPresent or Never
      securityContext: # Optional. Can be configured directly or via kratix config
  imagePullSecrets: []
```

Refer to the [Kubernetes Pod Spec
documentation](https://kubernetes.io/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec)
for more information on the fields above.

:::note

Not all fields from the Pod spec are supported. We will add support for more fields in
the future.

:::

### RBAC

Each pipeline runs with its own service account and a default set of restrictive
RBAC permissions. By default the service account is automatically created by
Kratix and the name is deterministic. You have three options for providing
additional [RBAC
permissions](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) to
the pipeline:
- Specify additional [RBAC permissions](#rbac-permissions) in your pipeline spec.
  Kratix will automatically create the required Role/ClusterRole and
  RoleBinding/ClusterRoleBinding
- Use the [default service account](#service-account) Kratix creates and
  manually create the Role/ClusterRole and RoleBinding/ClusterRoleBinding
- Specify a [custom service account](#custom-service-account) in your pipeline
  spec, and manage the lifecycle of the service account yourself, including
  creating the required Role/ClusterRole and RoleBinding/ClusterRoleBinding


:::note

The namespace a resource request pipeline runs in is the same as the namespace as the resource
request. Promise pipelines run in the `kratix-platform-system` namespace.

:::

#### RBAC Permissions

In the pipeline spec, you can provide additional [RBAC permissions](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) to the
pipeline pod by specifying additional
[rules](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#role-example)
in the `.spec.rbac.permissions`:

```
platform: platform.kratix.io/v1alpha1
kind: Promise
metadata:
  name: env
spec:
  ...
  workflows:
    resource:
      configure:
      - apiVersion: platform.kratix.io/v1alpha1
        kind: Pipeline
        metadata:
          name: slack-notify
        spec:
          rbac:
            permissions:
              - apiGroups: [""]
                verbs: ["*"]
                resources: ["secrets"]
              - apiGroups: ["batch"]
                verbs: ["get"]
                resources: ["jobs"]
                resourceNames: ["my-job"]
        ...
```

The above example provides the pipeline pod with the ability in its own
namespace to have full control over the secrets, and the ability to `get` a Job
called `my-job`.

##### Cross Namespace RBAC Permissions
You can also provide RBAC permissions across namespaces by specifying the
`resourceNamespace` field in the RBAC permissions. This field is optional and if
not set it defaults to the namespace of the pipeline. If set to `*`, the
underlying ClusterRole is bound to a ClusterRoleBinding instead of a
RoleBinding, giving the pipeline permissions across all namespaces.

```
platform: platform.kratix.io/v1alpha1
kind: Promise
metadata:
  name: env
spec:
  ...
  workflows:
    resource:
      configure:
      - apiVersion: platform.kratix.io/v1alpha1
        kind: Pipeline
        metadata:
          name: slack-notify
        spec:
          rbac:
            permissions:
              - apiGroups: [""]
                verbs: ["get"]
                resources: ["secrets"]
                resourceNamespace: "ns-of-my-secrets"
              - apiGroups: ["batch"]
                verbs: ["get", "list"]
                resources: ["jobs"]
                resourceNamespace: "*"
        ...
```

The above example provides the pipeline pod with the ability get the secrets in
the `ns-of-my-secrets` namespace regardless of what namespace the pipeline runs
in. The pipeline also has the ability to `get` and `list` Jobs across all namespaces.

#### Service Account

Each pipelines runs with a [service
account](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/)
unique to that namespace, which is automatically created by Kratix when the
pipeline is triggered for the first time. The service account following the
naming convention of
`<promise-name>-<workflow-type>-<workflow-action>-<pipeline-name>`. For example
the below Promise would create two service accounts:


```yaml:
platform: platform.kratix.io/v1alpha1
kind: Promise
metadata:
  name: env
spec:
  ...
  workflows:
    resource:
      delete:
      - apiVersion: platform.kratix.io/v1alpha1
        kind: Pipeline
        metadata:
          name: slack-notify
    promise:
      configure:
      - apiVersion: platform.kratix.io/v1alpha1
        kind: Pipeline
        metadata:
          name: tf-workspace
```

- `env-resource-delete-slack-notify` would be created in each namespace where
  the resource request is made
- `env-promise-configure-tf-workspace` would be created in the
  `kratix-platform-system` namespace

#### Custom Service Account
You can provide a custom service account for the pipeline by providing the `.rbac.serviceAccount` field in the pipeline spec.

```yaml
platform: platform.kratix.io/v1alpha1
kind: Promise
metadata:
  name: env
spec:
  ...
  workflows:
    resource:
      configure:
      - apiVersion: platform.kratix.io/v1alpha1
        kind: Pipeline
        metadata:
            name: slack-notify
          spec:
            rbac:
              serviceAccount: my-service-account
```

Kratix will use this service account for the pipeline instead of the standard
one. If it does not exist, Kratix will create it and manage its lifecycle. If it
does exist, Kratix will not modify or delete the service account.

### Secrets

To access Secrets in the Pipeline, you can either [provide additional
RBAC](#rbac) so that the pipeline can `kubectl get secret`  secret or pass in a
reference to the Pipeline container's `env` using `valueFrom.secretKeyRef` in
the standard Kubernetes way.

:::note

The Secret must be accessible within the Pipeline's namespace.

:::

Refer to the [Kubernetes documentation](https://kubernetes.io/docs/concepts/configuration/secret/)
for more details on Secrets in Kubernetes.

Example:
```
spec:
  workflows:
    resource/promise:
      configure:
        - apiVersion: platform.kratix.io/v1alpha1
          kind: Pipeline
          metadata:
            name: promise
            namespace: default
          spec:
            containers:
              - image: <image>
                name: <name>
                env:
                  # example static env var
                  - name: SLACK_CHANNEL
                    value: network-team
                  # example secret env var
                  - name: SLACK_WEBHOOK_URL
                    valueFrom:
                      secretKeyRef:
                        # this secret needs to exists
                        name: slack-webhook
                        key: url
                  # example configmap env var
                  - name: SLACK_MSG
                    valueFrom:
                      configMapKeyRef:
                        name: slack-msg
                        key: url
```

## Volumes {#volumes}

Kratix will run each container in the `spec.containers` list in order,
providing a set of common volumes, as defined below.

### Input

Kratix provides an **input directory** to the container, mounted at `/kratix/input`. This
directory is populated with different files depending on the type of workflow.

#### `object.yaml`

In all workflows, all Pipeline containers will have access to an `object.yaml` file
within the `/kratix/input` directory.

The contents of this file vary as follows:
- **Promise workflows**: The `object.yaml` file contains the full Promise definition.
- **Resource workflows**: The `object.yaml` file contains the Resource Request definition
which was submitted to the Kratix platform.

This is a useful way to find out information about the Kubernetes Object the Pipeline is
being invoked for. For example, you could read the latest `status` from this input Object
and modify the behaviour of the Pipeline accordingly.

If your workflow contains multiple Pipelines, then the `object.yaml` is the only way to
communicate between the Pipelines (e.g. via status updates).

### Output

At the end of a Pipeline, all files present in the **output directory** mounted at
`/kratix/output` will be written to the [State Store](./statestore/intro).

All containers in the Pipeline can write to this volume, and any container can add, update, or remove
documents from this directory.

:::note

Files written to `/kratix/output` in `delete` Pipelines will be ignored.

:::

### Metadata

All containers in a `configure` Pipeline have access a shared **metadata directory**
mounted at `/kratix/metadata`.

Pipeline containers can control aspects of how Kratix behaves by creating special files in
this directory:

- `destination-selectors.yaml` can be added to any Promise to further refine where the
  resources in `/kratix/output` will be [scheduled](./destinations/multidestination-management).
- `status.yaml` allows the Pipeline to communicate information about the resource back to
  the requester. See the [status documentation for more information](./resources/status).

#### Passing data between containers

Kratix scans for these files and ignores all other files in the `/kratix/metadata`
directory. If you need to pass additional information to the next container in
the Pipeline, you can safely write to the `/kratix/metadata` directory.

## Environment Variables {#environment-variables}

Kratix will set the following environment variables for all containers in the
workflow:


| Variable                  | Description     |
| ------------------------- | --------------- |
| `KRATIX_WORKFLOW_ACTION`  | The action that triggered the workflow. Either `configure` or `delete`. |
| `KRATIX_WORKFLOW_TYPE`    | The type of workflow. Either `resource` or `promise`. |
| `KRATIX_PROMISE_NAME`     | The name of the Promise. |
| `KRATIX_PIPELINE_NAME`    | The name of the Pipeline. |
| `KRATIX_OBJECT_KIND`      | The kind of the object in `/kratix/input/object.yaml`. |
| `KRATIX_OBJECT_GROUP`     | The group of the object in `/kratix/input/object.yaml`. |
| `KRATIX_OBJECT_VERSION`   | The version of the object in `/kratix/input/object.yaml`. |
| `KRATIX_OBJECT_NAME`      | The name of the object in `/kratix/input/object.yaml`. |
| `KRATIX_OBJECT_NAMESPACE` | The namespace of the object in `/kratix/input/object.yaml`. |
| `KRATIX_CRD_PLURAL`       | The plural for the API defined in the Promise. |
| `KRATIX_CLUSTER_SCOPED`   | A boolean for if the Promise API is cluster scoped. |

By checking the `KRATIX_WORKFLOW_ACTION` and `KRATIX_WORKFLOW_TYPE` environment variables,
a container is able to discover the **context** in which it's being invoked (e.g. "I'm
running as part of a Promise Configure workflow").

This means that you could write a **single** container image to be used in all four
workflows (`promise.configure`, `promise.delete`, `resource.configure`, and
`resource.delete`), and switch the container's mode of operation based on the context.

## Security Context

A Pipeline consists of containers provided in the Promise, and 3 Kratix specific
containers. Kratix configures its own containers in the pipeline to run with the
following [security
context](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/):

```
securityContext:
  allowPrivilegeEscalation: false
  capabilities:
    drop:
    - ALL
  privileged: false
  runAsNonRoot: true
  seccompProfile:
    type: RuntimeDefault
```

A Pod level security context is not set and cannot currently be configured.

Any containers provided in the Promise will by default not have any security
context set. You can set the security context for the Promise specific
containers (not Kratix containers) by either:

- Specifying the security context in the container spec, e.g.:
  ```yaml
  apiVersion: platform.kratix.io/v1alpha1
  kind: Pipeline
  metadata:
    name: # Name (must be unique within the Promise)
    namespace: # Namespace (optional)
  spec:
    containers:
      - name: # Container name (must be unique within the Pipeline)
        image: # Container image to run
        securityContext:
          # Security context fields, e.g.:
          runAsNonRoot: false
  ```

- Specifying a global default security context in the `kratix` ConfigMap in the
  `kratix-platform-system`. See the [Kratix Config documentation](./kratix-config/config) for more information.

  ```yaml
  apiVersion: v1
  kind: ConfigMap
  metadata:
    name: kratix
    namespace: kratix-platform-system
  data:
    config: |
      workflows:
        defaultContainerSecurityContext:
          # Security context fields, e.g.:
          runAsNonRoot: false
  ```

Any security context set in the container spec will override the global default
security context.
