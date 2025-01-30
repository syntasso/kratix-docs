---
description: Documentation for the Health Record Custom Resources
title: Health Record
sidebar_label: Health Records
id: healthrecord
---

# Health Records

A HealthRecord contains health information for a particular resource. When a Health Record is created or updated for a given Resource, Kratix will update the referenced resource status to reflect the data in the HealthRecord. It has the following format:

```yaml
apiVersion: platform.kratix.io/v1alpha1
kind: HealthRecord
metadata:
  name: healthrecord-example
data:
  promiseRef:
    name: promise-name
  # A reference to the Resource Request the Health Check should be performed against
  resourceRef:
    name: request-name
    namespace: default
  # The condition of the Health Check
  # Can be unknown, ready, unhealthy, healthy or degraded
  state: ready
  # The timestamp of the last time the Heath Check was executed
  lastRun: 1531958400
  # Optional: any additional details
  details:
    example: data
```

Check the [Surfacing health information guide](/main/guides/resource-health) for more information about how to use this CRD.
