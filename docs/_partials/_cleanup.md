To clean up your environment you need to delete the Promises and the Resource Requests.
Kratix will automatically cleanup any Resource Requests when the parent Promise is deleted.

To delete all the Promises
```bash
kubectl --context kind-platform delete promises --all
```

Verify all the Promises are deleted
```console
kubectl --context kind-platform get promises
```

Verify all the resources created by the Promise and Resource Requests are gone (this might take a couple minutes)
```console
kubectl --context kind-worker get pods
kubectl --context kind-worker get namespaces
```
