Once Kratix is installed, you can register Kubernetes clusters where workloads should run.
On single cluster installations, the same cluster performs the role of the Platform and
the worker clusters. The commands below will register the cluster as a Destination, as well as configure
FluxCD to watch for the cluster's [State Store](/main/reference/statestore/intro):

```bash
kubectl apply --filename https://github.com/syntasso/kratix/releases/latest/download/config-all-in-one.yaml
```
