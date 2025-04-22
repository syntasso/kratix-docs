## Configuring Metrics Collection

The Kratix Metrics Service emits a default set of metrics which detail the controller's performance as a whole. These can be collected via Prometheus-compatible scraping.

Prometheus is not installed with Kratix so you'll first need to install the [Prometheus Operator](https://github.com/prometheus-operator/prometheus-operator) on your cluster. Once installed, you can create a Service Monitor to scrape metrics from the `kratix-platform-controller-manager-metrics-service` Metrics Service:

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  labels:
    control-plane: controller-manager
    release: prometheus
  name: prometheus-kube-kratix-prometheus
  namespace: default
spec:
  endpoints:
  - path: /metrics
    port: https
    tlsConfig:
      ca:
        secret:
          key: ca.crt
          name: metrics-server-cert
      cert:
        secret:
          key: tls.crt
          name: metrics-server-cert
      insecureSkipVerify: false
      keySecret:
        key: tls.key
        name: metrics-server-cert
      serverName: kratix-platform-controller-manager-metrics-service.kratix-platform-system.svc
  namespaceSelector:
    matchNames:
    - kratix-platform-system
  selector:
    matchLabels:
      control-plane: controller-manager
```
