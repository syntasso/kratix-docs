### Configure Flux

Configure [Flux](https://fluxcd.io) to use the state store you created earlier:
- If you are using a Git repository as your state store, follow the steps in the
  [FluxCD docs](https://fluxcd.io/flux/components/source/gitrepositories/) for
  creating a `GitRepository` resource
- If you are using a Bucket as your state store, follow the steps in the
  [FluxCD docs](https://fluxcd.io/flux/components/source/buckets/) for
  creating a `Bucket` resource

Then create two `Kustomization` resources, one for the workload resources and
one for the dependencies, using the template below:

```yaml
---
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: kratix-workload-resources
  namespace: <Same namespace as the Bucket/GitRepository>
spec:
  interval: 3s
  prune: true
  dependsOn:
    - name: kratix-workload-dependencies
  sourceRef:
    kind: <Bucket or GitRepository>
    name: <Name of Bucket/GitRepository>
  path: ./worker/resources
  validation: client
---
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: kratix-workload-dependencies
  namespace: <Same namespace as the Bucket/GitRepository>
spec:
  interval: 8s
  prune: true
  sourceRef:
    kind: <Bucket or GitRepository>
    name: <Name of Bucket/GitRepository>
  path: ./worker/dependencies
  validation: client
```

<details>
<summary>Example complete set of Flux resources</summary>

```yaml
---
apiVersion: source.toolkit.fluxcd.io/v1beta1
kind: Bucket
metadata:
  name: kratix-bucket
  namespace: flux-system
spec:
  interval: 10s
  provider: generic
  bucketName: kratix
  endpoint: 172.18.0.2:31337
  insecure: true
  secretRef:
    name: minio-credentials
---
apiVersion: v1
kind: Secret
metadata:
  name: minio-credentials
  namespace: flux-system
type: Opaque
data:
  accesskey: bWluaW9hZG1pbg==
  secretkey: bWluaW9hZG1pbg==
---
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: kratix-workload-resources
  namespace: flux-system
spec:
  interval: 3s
  prune: true
  dependsOn:
    - name: kratix-workload-dependencies
  sourceRef:
    kind: Bucket
    name: kratix-bucket
  path: ./worker/resources
  validation: client
---
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: kratix-workload-dependencies
  namespace: flux-system
spec:
  interval: 8s
  prune: true
  sourceRef:
    kind: Bucket
    name: kratix-bucket
  path: ./worker/dependencies
  validation: client
```
</details>

Once filled in with the correct values, apply the resource to the platform cluster:

```bash
kubectl apply --context $WORKER --filename <path-to-git-or-bucket-resource>
kubectl apply --context $WORKER --filename <path-to-kustomization-resource>
```
