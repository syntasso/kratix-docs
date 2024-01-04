Install Kratix and its Dependencies with the command below:

```bash
kubectl apply --filename https://github.com/syntasso/kratix/releases/latest/download/install-all-in-one.yaml
```

The above will install Kratix, MinIO, and FluxCD. MinIO will be the [State Store](/main/reference/statestore/intro)
for the Kratix to write to and FluxCD will watch the MinIO Bucket for any changes that need to be applied to
the cluster. Kratix supports a variety of [State Stores](/main/reference/statestore/intro)
and multiple different State Stores can be used.

You can also install Kratix via Helm. For more information, see the [Helm Chart](https://github.com/syntasso/helm-charts) documentation.
