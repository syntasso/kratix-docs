Kratix requires a set of certificates in order to deploy its internal
[Validating and Mutating Kubernetes
webhooks](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/).
By default Kratix is configured to use [cert-manager](https://cert-manager.io/) to
generate the certificates, therefore we need to install cert-manager. If you already
have it installed, skip to the next section.

<details>

 <summary> Don't want to use cert-manager? Manually provide the required certificates </summary>

Cert-manager is used to generate CA certificates and key/cert pairs for the Kratix webhook
and Metrics Services.

#### Webhook Service

You will need to generate a CA Certificate and key/cert pair for the following DNS names:
- `kratix-platform-webhook-service.kratix-platform-system.svc.cluster.local`
- `kratix-platform-webhook-service.kratix-platform-system.svc`

To manually provide the required certificates, you need to create the
`webhook-server-cert` secret in the `kratix-platform-system` namespace with the
following keys:

```yaml
apiVersion: v1
data:
  ca.crt: # Base64 CA certificate
  tls.crt: # Base64 encoded Server certificate
  tls.key: # Base64 encoded Server private key
kind: Secret
metadata:
  name: webhook-server-cert
  namespace: kratix-platform-system
type: kubernetes.io/tls
```

As part of installing Kratix we create a few resources that require the CA
certificate. You will have to manually add the CA certificate to the resources
mentioned below, and manually remove the cert-manager `Certificate` and `Issuer`
resources. The following resources need to be updated to contain the Base64
encoded CA certificate:

- `MutatingWebhookConfiguration/kratix-platform-mutating-webhook-configuration`
  ```
  apiVersion: admissionregistration.k8s.io/v1
  kind: MutatingWebhookConfiguration
  metadata:
    name: kratix-platform-mutating-webhook-configuration
  webhooks:
  - admissionReviewVersions:
    - v1
    clientConfig:
      caBundle: .... #  there might be multiple admissionReviewVersions, ensure you update all of them
  ```

- `ValidatingWebhookConfiguration/kratix-platform-validating-webhook-configuration`
  ```
  apiVersion: admissionregistration.k8s.io/v1
  kind: ValidatingWebhookConfiguration
  metadata:
    name: kratix-platform-validating-webhook-configuration
  webhooks:
  - admissionReviewVersions:
    - v1
    clientConfig:
      caBundle: .... #  there might be multiple admissionReviewVersions, ensure you update all of them
  ```
- `CustomResourceDefinition/promises.platform.kratix.io`
  ```
  apiVersion: apiextensions.k8s.io/v1
  kind: CustomResourceDefinition
  metadata:
    name: promises.platform.kratix.io
  spec:
    conversion:
      strategy: Webhook
      webhook:
        clientConfig:
          caBundle: ....
  ```

Lastly, you need to remove the following cert-manager Issuer and Certificate from Kratix release manifest:

```yaml
---
...
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: kratix-platform-serving-cert
  namespace: kratix-platform-system
spec:
...
---
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: kratix-platform-selfsigned-issuer
  namespace: kratix-platform-system
spec:
...
```

#### Metrics Service

You will need to generate a CA Certificate and key/cert pair for the following DNS names:
- `kratix-platform-controller-manager-metrics-service.kratix-platform-system.svc`
- `kratix-platform-controller-manager-metrics-service.kratix-platform-system.svc.cluster.local`

To manually provide the required certificates, you need to create the
`metrics-server-cert` secret in the `kratix-platform-system` namespace with the
following keys:

```yaml
apiVersion: v1
data:
  ca.crt: # Base64 CA certificate
  tls.crt: # Base64 encoded Server certificate
  tls.key: # Base64 encoded Server private key
kind: Secret
metadata:
  name: metrics-server-cert
  namespace: kratix-platform-system
type: kubernetes.io/tls
```

This secret is referenced in the `kratix-platform-controller-manager` Deployment.

Lastly, you need to remove the following cert-manager Certificate from Kratix release manifest:

```yaml
---
...
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: kratix-platform-metrics-server-cert
  namespace: kratix-platform-system
spec:
...
```

</details>

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
