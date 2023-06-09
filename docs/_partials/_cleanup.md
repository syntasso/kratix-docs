Before moving on, please clean up your environment by deleting the current Promises and Resource Requests.
Kratix will, by default, clean up any Resource Requests when the parent Promise is deleted.

To delete all the Promises, run:

```bash
kubectl --context $PLATFORM delete promises --all
```

The above command will give an output similar to:

```shell-session
promise.platform.kratix.io/elastic-cloud deleted
```
