Install Kratix and its Dependencies with the command below:

```bash
kubectl apply --filename https://raw.githubusercontent.com/syntasso/kratix/main/distribution/single-cluster/install-all-in-one.yaml
```

The above will install Kratix, MinIO, and FluxCD. MinIO will be the [State Store](/docs/main/05-reference/06-statestore/01-statestore.md)
for the Kratix to write to and FluxCD will watch the MinIO Bucket for any changes that need to be applied to
the cluster. Kratix supports a variety of [State Stores](/docs/main/05-reference/06-statestore/01-statestore.md)
and multiple different State Stores can be used.
