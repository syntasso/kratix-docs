---
description: Documentation for the Health Definition Custom Resources
title: Health Record
sidebar_label: Health Record
id: healthrecord
---

A Health Record details the result of a Health Check that has run on a given Destination. When a Health Record exists for a given Resource Request, Kratix will update the Resource Request to reflect the details in the Health Record.

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
  # Can be unknown, ready, unhealthy, healthy or degraded
  state: ready
  # The timestamp of the last time the Heath Check was executed
  lastRun: "2025-01-13T09:29:37+00:00"
  # Optional: any additional details
  details:
    example: data
```
