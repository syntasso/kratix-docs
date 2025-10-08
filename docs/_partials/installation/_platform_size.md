Kratix has a very lightweight footprint, defaulting to `100m` CPU and `256Mi`
memory within Kubernetes. The sizing of the underlying platform cluster is
primarily driven by the level of concurrency you need to support, as each
resource reconciliation runs its own Pod and consumes approximately `200m` CPU and
`256Mi` memory.

For proof-of-value or initial deployments, we generally recommend starting with
a cluster of at least 4 vCPUs and `16GiB` of memory. This configuration provides
sufficient headroom for Kratix to manage workloads effectively while allowing
for meaningful parallelisation. As your usage grows, you can scale the cluster
vertically to accommodate increased demand.
