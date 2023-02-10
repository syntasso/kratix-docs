Once Kratix is installed, you can register Kubernetes clusters where workloads should run.
On single cluster installations, the same cluster performs the role of the Platform and
the Worker clusters. The commands below will register the cluster, as well as configure
FluxCD to watch for the cluster's repository:

```bash
kubectl apply --filename https://raw.githubusercontent.com/syntasso/kratix/main/distribution/single-cluster/config-all-in-one.yaml
```

