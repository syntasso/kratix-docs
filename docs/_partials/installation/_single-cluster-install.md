Install Kratix and its Dependencies with the command below:

```bash
kubectl apply --filename https://github.com/syntasso/kratix/releases/latest/download/install-all-in-one.yaml
```

The above will install Kratix, MinIO, and a GitOps agent. MinIO will be the [State Store](/main/reference/statestore/intro)
for the Kratix to write to and the GitOps agent will watch the MinIO Bucket for any changes that need to be applied to
the cluster. Kratix supports a variety of [State Stores](/main/reference/statestore/intro)
and multiple different State Stores can be used.

The GitOps agent installed as part of the quick start is FluxCD. However, any GitOps tool that supports reconciling documents from a Git repository can be used, such as ArgoCD. See the [installation](../category/installing-kratix) documentation for more information on setting up ArgoCD.

You can also install Kratix via Helm. For more information, see the [Helm Chart](https://github.com/syntasso/helm-charts) documentation.
