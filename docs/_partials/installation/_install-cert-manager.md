Kratix requires [cert-manager](https://cert-manager.io/) to be installed in the
Platform cluster. If you already have it installed, skip to the
next section.

To install it, run:

```bash
kubectl --context $PLATFORM apply --filename https://github.com/cert-manager/cert-manager/releases/download/v1.15.0/cert-manager.yaml
```

Make sure that `cert-manager` is ready before installing Kratix:

```shell-session
$ kubectl --context $PLATFORM get pods --namespace cert-manager
NAME                                      READY   STATUS    RESTARTS   AGE
cert-manager-7476c8fcf4-r8cnd             1/1     Running   0          19s
cert-manager-cainjector-bdd866bd4-7d8zp   1/1     Running   0          19s
cert-manager-webhook-5655dcfb4b-54r49     1/1     Running   0          19s
```
