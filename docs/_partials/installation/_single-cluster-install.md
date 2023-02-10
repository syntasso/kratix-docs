Install Kratix and its dependencies with the command below:

```bash
kubectl apply --filename https://raw.githubusercontent.com/syntasso/kratix/main/distribution/single-cluster/install-all-in-one.yaml
```

The above will install Kratix, MinIO, and FluxCD. MinIO will be the repository for the
GitOps, while FluxCD will watch the repository for any changes that need to be applied to
the cluster. For production installations, both can be replaced with other tools and
technologies depending on your preference.

