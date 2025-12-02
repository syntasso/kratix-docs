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