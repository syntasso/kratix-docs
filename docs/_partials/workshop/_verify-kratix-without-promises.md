Following the previous step of this tutorial, you should now
have a deployment of both Kratix and MinIO running on your Platform cluster
with no installed Promises.

You should also have two environment variables, `PLATFORM` and `WORKER`.

<details>
   <summary>Verify the current state of your installation</summary>
Run:

```bash
kubectl --context $PLATFORM get deployments --namespace kratix-platform-system
```

The above command will give an output similar to:

```shell-session
NAME                                 READY   UP-TO-DATE   AVAILABLE   AGE
kratix-platform-controller-manager   1/1     1            1           1h
minio                                1/1     1            1           1h
```

You should also have a State Store created and configured to point to the
`kratix` bucket on MinIO. Verify the `bucketstatestores`:

```bash
kubectl --context $PLATFORM get bucketstatestores.platform.kratix.io
```

The above command will give an output similar to:
```shell-session
NAME          AGE
minio-store   1h
```

Verify there are no existing Promises:
```bash
kubectl --context $PLATFORM get promises
```

Verify your cluster environment variables are set:
```bash
env | grep 'PLATFORM\|WORKER'
```

which should result in:
```shell-session
WORKER=kind-worker
PLATFORM=kind-platform
```

</details>

If you are are not continuing from the previous section, or your outputs do not align with the validation, please refer back to
[Installing Kratix](installing-kratix).
