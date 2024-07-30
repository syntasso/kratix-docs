---
title: Introduction
description: Introduction to Kratix and how to get started with the Kratix CLI
sidebar_label: Introduction
id: intro
---

The Kratix CLI is a tool designed to help you build promises and manage your Kratix
installation.

## Installation

To install the Kratix CLI, go to the [releases
page](https://github.com/syntasso/kratix-cli/releases), download the latest release of
the binary for your platform.

Once you have downloaded the binary, you can install it by moving it to a directory in
your PATH.

To verify your installation, run:

```shell-session
kratix --version
```

### Enable shell autocompletion

To configure your shell to load the CLI completions, add the completion script
to your shell profile, replacing `SHELL` with the name of your shell:

```shell-session
. <(kratix completion SHELL)
```

For a list of supported shells, run:

```shell-session
kratix completion --help
```

## Writing Promises with the Kratix CLI

The CLI provides a set of commands to help you quickly iterate through the process of
writing a Promise. It supports building promises from scratch, or initialising it from a
Helm chart or from an existing Operator.

The examples below will walk you through building a promise for each of the three
supported scenarios.

### From Scratch

#### Initialising a new Promise

To initialise a new Promise from scratch, run the [kratix init promise](./reference/kratix-init-promise) command:

```shell-session
kratix init promise mysql \
  --group mygroup.org \
  --kind Database \
  --version v1alpha1
```

Where:

- `mysql` is the name of the Promise
- `mygroup.org` is the Group of the Promised API resource
- `Database` is the Kind provided by the Promise
- `v1alpha1` is the Version of the Promised API resource

:::tip Splitting files

By default, the CLI will create a single file for the Promise definition. If you want to
split the definition into multiple files, you can use the `--split` flag:

```shell-session
kratix init promise mysql [flags] --split
```

The command above will create the following files:

- `api.yaml` containing the CRD definition of the Promise API.
- `dependencies.yaml` containing the dependencies of the Promise. This file will be empty by default.
- `workflows.yaml` containing the Workflows of the Promise. This file will be
  created once you execute the [kratix add
  container](./reference/kratix-add-container) command.
:::

The above command creates a `promise.yaml` in the current directly, filling the Promise
API with the basic information provided.

#### Extending the API

You can add more fields to the API by running the [kratix update api](./reference/kratix-update-api) command:

```shell-session
kratix update api --property size:string --property replicas:number
```

:::tip Removing fields

You can remove API fields by appending a `-` to the desired property name:

```shell-session
kratix update api --property replicas-
```

:::

#### Adding dependencies

You can add dependencies to the Promise by running the [kratix add
dependency](./reference/kratix-update-dependencies) command. For example, to add a Namespace
as a dependency to the MySQL Promise, create a directory with your dependency files:

```shell-session
mkdir dependencies
kubectl create namespace mynamespace --dry-run=client -o yaml > dependencies/namespace.yaml
```

Then, add the dependency to the Promise:

```shell-session
kratix update dependencies dependencies/
```

:::tip Adding dependencies as Workflows

Use the `--image` flag to add a dependency as a Workflow:

```shell-session
kratix update dependencies dependencies/ --image myorg/mysql-dependencies:v1.0.0
```

:::

:::note Namespaces

The `update dependencies` command will automatically set the
`metadata.namespace` to `default` if the resource itself does not have a
namespace.

:::

#### Adding Workflows

To add a Workflow to the Promise, run the [kratix add container](./reference/kratix-add-container) command:

```shell-session
kratix add container resource/configure/mypipeline --image myorg/mysql-pipeline:v1.0.0
```

The command above will create a `workflows` directory with some basic files for your
Pipeline stage. You can then edit the files to add your custom logic.

### From Helm

You can build promises straight from Helm charts. To do so, run the [kratix init
helm-promise](./reference/kratix-init-helm-promise) command, providing the Chart
URL. The CLI will auto-generate the Promise API based on the Helm chart values.

For example, consider the [bitnami/mysql Helm
chart](https://github.com/bitnami/charts/tree/main/bitnami/mysql). To create a
Promise from this chart, run:

```shell-session
kratix init helm-promise mysql \
  --group mygroup.org \
  --kind Database \
  --version v1alpha1 \
  --chart-url oci://registry-1.docker.io/bitnamicharts/mysql
```

The above command should create a `promise.yaml` file in the current directory that's
ready to be installed. You can further customise it by adding dependencies and workflows.
See the [Writing a Promise from Scratch](#from-scratch) section for more details.

### From Operator

You can also build promises from existing Operators. To do so, run the [kratix
init operator-promise](./reference/kratix-init-operator-promise) command.

For example, consider the [Percona Operator for
MySQL](https://docs.percona.com/percona-operator-for-mysql/pxc/index.html). To transform
it into a Promise, first download the Operator manifest bundle to your local machine:

```shell-session
curl -L https://raw.githubusercontent.com/percona/percona-xtradb-cluster-operator/v1.14.0/deploy/bundle.yaml -o operator-bundle.yaml
```

Oftentimes, Operators include multiple CRDs. You will need to specify which CRD you want
to build a Promise from. The Percona Operator comes with a `perconaxtradbclusters.pxc.percona.com` CRD,
which is used to deploy a MySQL cluster.

:::tip

To find the CustomResourceDefinition (CRD) included in the Operator manifest
bundle, you can run:

```shell-session
cat operator-bundle.yaml| grep "CustomResourceDefinition" -A 5 | grep name
```

:::

Then, run the following command:

```shell-session
kratix init operator-promise mysql \
  --group mygroup.org \
  --kind Database \
  --version v1alpha1 \
  --operator-manifests operator-bundle.yaml \
  --api-schema-from perconaxtradbclusters.pxc.percona.com
```

:::tip

The `--operator-manifests` flag can be a single file or a directory containing the Operator manifests.

:::

By default, the CLI will create a `promise.yaml` file and embed the Operator
bundle in the `dependencies` of the Promise, which will usually make the Promise
very large. Dependending on the size of the resulting Promise, you may get the
following error when trying to `kubectl apply` it:

```
The Promise "mypromise" is invalid: metadata.annotations: Too long: must have at most 262144 bytes
```

:::note Create vs Apply

You can use the `kubectl create` command to install your Promise, even if it's
too large to be applied. To understand the difference between `create` and
`apply`, refer to the [Kubernetes
documentation](https://kubernetes.io/docs/tasks/manage-kubernetes-objects/).

:::

To avoid this, you can move the Operator bundle to a Workflow by running:

```shell-session
kratix update dependencies operator-bundle.yaml --image yourorg/your-image:tag
```
