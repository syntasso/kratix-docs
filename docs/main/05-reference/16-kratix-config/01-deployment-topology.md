---
description: Configuring Kratix via the Config
title: Kratix Config
id: config
---

When Kratix starts, it reads the `kratix` `ConfigMap` from the
`kratix-platform-system` namespace. This `ConfigMap` allow you to configure
various parts of Kratix and follows the format outlined below. It is loaded when
the `kratix-platform-controller-manager` pod starts within the same namespace.

If any changes are made to the `ConfigMap`, you will need to restart the
`kratix-platform-controller-manager` pod to apply the updated configuration.



```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: kratix
  namespace: kratix-platform-system
data:
  config: |
    numberOfJobsToKeep: 1 # Number of old succcesful pipeline pods to keep. Default is 5
    workflows:
      defaultContainerSecurityContext:
        # Security context fields, e.g.:
        runAsNonRoot: false
```
