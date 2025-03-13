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
    # Number of old successful pipeline pods to keep. Default is 5
    numberOfJobsToKeep: 1  
    workflows:
      defaultImagePullPolicy: # can be `IfNotPresent`, `Always`, or `Never`
      defaultContainerSecurityContext:
        # Security context fields, e.g.:
        runAsNonRoot: false
```

## Kratix Pipeline Adapter Config

When Kratix schedules work as part of either Promise or Resource workflows,
by default, it uses the `WC_IMG` image specified in the
`kratix-platform-wc-img-config` configmap in the `kratix-platform-system` namespace. To
override this image, which is necessary when deploying Kratix in an air-gapped
environment, you can update this configmap to point to an internally hosted
version of the image.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: kratix-platform-wc-img-config
  namespace: kratix-platform-system
...
//highlight-start
data:
  WC_IMG: org-registry.org/team/kratix-platform-pipeline-adapter:v0.2.0
//highlight-end
```