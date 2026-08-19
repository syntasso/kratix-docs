---
title: Compound Promises
sidebar_label: Compound Promises
description: Reference documentation on Compound Promises
---

A Compound Promise is a Promise that depends on other Promises to deliver its
services. This feature allows Platform teams to simplify the build and deliver
of Golden Paths, composing many lower level Promises into higher-level
abstractions.

For details on how to use a Compound Promise, check [this
guide](/main/guides/compound-promises). If you are looking to write a compound
promise, [check the Writing a Promise workshop.](/workshop/writing-a-promise/compound-promise)

This page contains reference documentation for building better Compound Promises.

## How required Promises are resolved

A Compound Promise declares its dependencies in `spec.requiredPromises`:

```yaml
spec:
  requiredPromises:
    - name: postgresql
      version: v1.0.0-beta.5
```

Kratix satisfies each entry against the
[Promise Revisions](./promise-upgrade/promise-revisions) of the required Promise. Because Kratix
creates a Revision for every version a Promise has been installed at, the
requirement stays satisfied after the required Promise is upgraded.

For example, if `postgresql` is installed at `v1.0.0-beta.5` and later upgraded to
`v1.1.0`, a Compound Promise requiring `v1.0.0-beta.5` remains Available, as long as
the revision for `v1.0.0-beta.5` still exists.

### Requirement states

`status.requiredPromises[].state` reports how each entry resolved:

| State | Meaning |
| --- | --- |
| `Requirement installed` | A Revision exists at the required version and the Promise is Available. |
| `Requirement not installed` | The required Promise is not installed. |
| `Requirement not installed at the specified version` | The Promise is installed, but has no Revision at the required version. |
| `Requirement not available` | A Revision exists at the required version, but the required Promise is not yet Available — for example its own dependencies are still installing. |
| `Requirement state unknown` | Kratix could not determine the state. |

The `RequirementsFulfilled` condition is `True` only when every entry reports
`Requirement installed`. While it is `False`, the Compound Promise is marked
Unavailable and will not serve Resource Requests.

For example, a Compound Promise requiring `postgresql` at `v1.0.0-beta.5`, where `postgresql` is
installed but has no Revision at that version, reports:

```yaml
status:
  status: Unavailable
  requiredPromises:
    - name: postgresql
      version: v1.0.0-beta.5
      state: Requirement not installed at the specified version
  conditions:
    - type: RequirementsFulfilled
      status: "False"
      reason: RequirementsNotInstalled
      message: Requirements not fulfilled
```

The condition `reason` is `RequirementsNotAvailable` when the requirement is in the
`Requirement not available` state, and `RequirementsNotInstalled` for the remaining states.

## Requesting Component Promise Resources at a specific version

By default Resource Requests output by a Compound Promise workflow are served by the component
Promise's `latest` Promise Revision, not by the version in `spec.requiredPromises`.
To pin one to a specific version, create its
[Resource Binding](./promise-upgrade/resource-bindings#pinning-a-resource-request-when-it-is-created)
before the Resource Request.

### The Compound Promise owns its component versions

A Resource Binding output by your workflow is workflow output like any other: it is
delivered to the Platform through the state store and applied by the GitOps agent. The
agent restores whatever version the Compound Promise emitted, so a change made to the
Binding outside the workflow does not survive the agent's next sync.

The version of a component Resource is therefore a property of the Compound Promise, not
of the component Resource. To move a component to a new version, change the version your
Compound Promise workflow emits and upgrade the Compound Promise. Do not edit the
By default, Resource Requests produced by a Compound Promise workflow are served by the component
Promise's `latest` Promise Revision, not by the version in `spec.requiredPromises`.
To pin one to a specific version, create its
[Resource Binding](./promise-upgrade/resource-bindings#pinning-a-resource-request-when-it-is-created) before the Resource Request.

Note that the Resource Binding defined in a workflow is an output like any other: it will be 
delivered to the Platform through the state store and applied by the GitOps agent. The
agent restores whatever version the Compound Promise emitted, so a change made to the
Binding outside the workflow does not survive the agent's next sync.

In other words, the version of the component Resource is owned by the Compound Promise, not
of the component Resource itself. To move a component to a new version, change the version your
Compound Promise workflow emits and upgrade the Compound Promise. Do not edit the
component's Resource Binding directly.

:::warning

This applies to automated upgrades too. If you use SKE [Upgrade Plans and Upgrade
Runs](/ske/reference/promise-upgrades/intro), exclude component Resources from your rollout
groups — see [Excluding Compound Promise
components](/ske/reference/promise-upgrades/upgrade-plans#excluding-compound-promise-components).
An Upgrade Run patches the Binding and reports the Resource as upgraded, because
`lastAppliedVersion` genuinely does reach the target. The GitOps agent then reverts it.

:::

## Recommended ownership labels

A typical Compound Promise will execute a Resource Configure workflow that will
output Resource Requests for other Promises deployed in the Platform. In order
to highlight that these Resources belong to a Request made to a Compound
Promise, we recommend adding the following labels to each sub-Promise Request in
your Workflow:

```yaml
kratix.io/component-of-promise-name: <The name of the Compound Promise>
kratix.io/component-of-resource-name: <The name of the Compount Promise Request>
kratix.io/component-of-resource-namespace: <The namespace of the Compound Promise Reqeust>
```

Both the [Kratix CLI](/main/kratix-cli/intro) and the 
[SKE GUI](/ske/installing-ske/ske-gui)  provide ways to visualise the tree 
of Resource Requests created out of a Compound Promise request. For more details, check 
the [Kratix CLI platform command](/main/kratix-cli/reference/kratix-platform) and
the [SKE GUI documentation](/ske/guides/ske-gui).