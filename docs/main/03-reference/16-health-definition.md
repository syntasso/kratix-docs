---
description: Documentation for the Health Definition Custom Resources
title: Health Definition
sidebar_label: Health Definition
id: healthdefinition
---

# Health Definition

The Health Definition Custom Resource Definition (CRD) is the outline of a task that will be performed on a
Destination to verify the health of a Resource Request.

Check the [Surfacing health information guide](/main/guides/resource-health) for more information about how to use this CRD.

```yaml
apiVersion: platform.kratix.io/v1alpha1
kind: HealthDefinition
metadata:
  name: healthdefinition
  namespace: default
spec:
  # A reference to the Resource Request the Health Check should be performed against
  resourceRef:
    name: request-name
    namespace: default
  # A reference the Promise the Health Check should be performed against
  promiseRef:
    name: promise-name
  # The time or interval the check should run against
  # This can follow Cron syntax or macros such as @hourly
  schedule: "* * * * *"
  # The definition of the Resource the check will be performed against
  input: |
    apiVersion: mypromise.org/v1
    kind: someservice
    metadata:
        name: someservice
        namespace: default
    spec:
        example: data
    status:
        url: test.com
  # The task to be performed on the destination
  workflow:
    # A Pipeline that runs an ordered set of OCI compliant images to perform health checks
    apiVersion: platform.kratix.io/v1alpha1
    kind: Pipeline
    metadata:
      name: health
    spec:
      containers:
        - image: ghcr.io/myorg/health-check
          name: health
```
