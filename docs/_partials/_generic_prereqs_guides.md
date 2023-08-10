#### Pre-requisites

<details>
  <summary>You need an installation of Kratix for this section. <strong>Click here</strong> for instructions</summary>

The simplest way to do so is by running the quick-start script from within the
Kratix directory. The script will create two KinD clusters, install, and
configure Kratix.

```bash
./scripts/quick-start.sh --recreate
```

You can run Kratix either with a multi-cluster or a single-cluster setup. The
commands on the remainder of this document assume that two environment variables
are set:

1. `PLATFORM` representing the platform cluster Kubernetes context
2. `WORKER` representing the worker cluster Kubernetes context

If you ran the quick-start script above, do:

```
export PLATFORM="kind-platform"
export WORKER="kind-worker"
```

For single cluster setups, the two variables should be set to the same value.
You can find your cluster context by running:

```
kubectl config get-contexts
```

Refer back to [Installing Kratix](../../category/installing-kratix) for more
details.
</details>
