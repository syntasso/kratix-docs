### Register cluster as a Destination with Kratix

We need to register the cluster with Kratix so that it can be used as a
destination for deploying to. Use the template below to create a
`Worker` [Destination](/main/reference/destination/intro) resource:

```yaml
apiVersion: platform.kratix.io/v1alpha1
kind: Destination
metadata:
  name: worker
  labels:
    environment: dev
spec:
  stateStoreRef:
    name: default
    kind: <BucketStateStore or GitStateStore>
```

Once filled in with the correct values, apply the resource to the platform cluster:

```bash
kubectl apply --context $PLATFORM --filename <path-to-worker-destination-resource>
```
