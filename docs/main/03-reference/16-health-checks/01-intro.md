---
description: Documentation for the lifecycle of Health Checks
title: Promise Resources
sidebar_label: Introduction
---

# Defining a Healthcheck

A [Kratix Promise](../promises/intro) can define a Health Check to ensure a provisioned resource meets the definition of healthy for the Promised Service. This can be configured via the `healthChecks` key in the Promise specification.

When making something available as-a-service to users via a promise, through the use of Health Checks the Platform team can provide users with confidence that the service they have requested is working.

## Use Case

Imagine you have written a Promise that provisions a service that users can access via a http endpoint. For each request, you want to ensure that a user can verify that their service is up.

Within a Promise specification, you can define a Health Check that runs on a schedule, continuously validating that the endpoint for the user's instance is available and reachable.

```yaml showLineNumbers
apiVersion: platform.kratix.io/v1alpha1
kind: Promise
metadata:
  name: promise-name
spec:
...
  healthChecks:
    resource:
      schedule: "* * * * *"
      workflow:
        apiVersion: platform.kratix.io/v1alpha1
        kind: Pipeline
        metadata:
          name: health
        spec:
          containers:
            - image: ghcr.io/myorg/endpoint-checker
              name: health
```

### Workflow

Kratix Health Check Workflows consist of a single Pipeline. Refer to the [Workflows documentation](../workflows) for detailed information about how to write Kratix Pipelines.

### Schedule

The Schedule for a Health Check defines the time or the frequency at which the check should run. Similar to a `CronJob`, this can follow Cron syntax or a macro such as @daily or @hourly.
