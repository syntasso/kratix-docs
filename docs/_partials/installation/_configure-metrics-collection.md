## Configuring Metrics Collection

The Kratix Metrics Service emits a [default set of metrics](https://book.kubebuilder.io/reference/metrics-reference.html) which detail the Kratix Controller's performance as a whole. These can be collected via Prometheus-compatible scraping.

Prometheus is not installed with Kratix so you'll first need to install the [Prometheus Operator](https://github.com/prometheus-operator/prometheus-operator) on your cluster. Once installed, you can create a Service Monitor to scrape metrics from the `kratix-platform-controller-manager-metrics-service` Metrics Service:

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  labels:
    control-plane: controller-manager
    release: prometheus
  name: prometheus-kube-kratix-prometheus
  namespace: kratix-platform-system
spec:
  endpoints:
    - path: /metrics
      port: https
      scheme: https
      bearerTokenFile: /var/run/secrets/kubernetes.io/serviceaccount/token
      tlsConfig:
        serverName: kratix-platform-controller-manager-metrics-service.kratix-platform-system.svc
        ca:
          secret:
            name: metrics-server-cert
            key: "tls.crt"
  namespaceSelector:
    matchNames:
      - kratix-platform-system
  selector:
    matchLabels:
      control-plane: controller-manager
```

:::note
The Service Monitor must be created in the same Namespace as the `metrics-server-cert` Secret.
:::
