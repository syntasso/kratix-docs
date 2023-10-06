---
description: Customising a Promise
title: Customising a Promise
id: customising-promise
slug: customising-promise
---

```mdx-code-block
import useBaseUrl from '@docusaurus/useBaseUrl';
import PartialPromise from '../../_partials/_promise-architecture.md';
```

This is Part 3 of [a series](intro) illustrating how Kratix works.

👉🏾 Next: [Delivering your service on demand](service-on-demand)

<hr />

## Customising a Promise
As seen in Part II of the workshop Kratix provides an easy way to provide
anything anything as-a-Service. In that example we provisioned a Jenkins, with
minimal configuration. In this part of the workshop we're going to dive deeper
into how you can customise a Promise for your organisations needs.

## Postgres Promise

[Here](https://github.com/syntasso/workshop/blob/main/promises/postgres-full/promise.yaml)
you will find an example Promise that provides Postgres-as-a-Service using the
[Zalando Postgres Operator for
Kubernetes](https://github.com/zalando/postgres-operator). 

### Installing Postgres Promise
Lets install the Promise

```bash
kubectl --context $PLATFORM \
  apply \
  --filename https://raw.githubusercontent.com/syntasso/kratix-marketplace/main/postgres/promise.yaml
```

Verify that the Postgres Operator starts in the worker cluster:

```shell-session
kubectl --context $WORKER get deployments --watch
```

The above command will give an output similar to (it may take a couple of
minutes):

```shell-session
NAME               READY   UP-TO-DATE   AVAILABLE   AGE
postgres-operator   0/1     0            0           0s
postgres-operator   0/1     0            0           0s
postgres-operator   0/1     0            0           0s
postgres-operator   0/1     1            0           0s
postgres-operator   1/1     1            1           11s
```

Once the postgres-operator deployment is ready, press <kbd>Ctrl</kbd>+<kbd>C</kbd>
to exit the watch mode.

### Requesting a complex Postgres

This Promise contains a complex API, which exposes every configuration the
Zalandao Postgres operator exposes as configuration. For example a user could
request a Postgres with the following configuration:

```yaml
apiVersion: workshop.kratix.io/v1
kind: postgresql
metadata:
  name: example
  namespace: default
spec:
  dockerImage: ghcr.io/zalando/spilo-15:3.0-p1
  teamId: "acid"
  numberOfInstances: 1
  users: # Application/Robot users
    zalando:
      - superuser
      - createdb
    foo_user: []
  enableMasterLoadBalancer: false
  enableReplicaLoadBalancer: false
  enableConnectionPooler: false # enable/disable connection pooler deployment
  enableReplicaConnectionPooler: false # set to enable connectionPooler for replica service
  enableMasterPoolerLoadBalancer: false
  enableReplicaPoolerLoadBalancer: false
  allowedSourceRanges: # load balancers' source ranges for both master and replica services
    - 127.0.0.1/32
  databases:
    foo: zalando
  preparedDatabases:
    bar:
      defaultUsers: true
      extensions:
        pg_partman: public
        pgcrypto: public
      schemas:
        data: {}
        history:
          defaultRoles: true
          defaultUsers: false
  postgresql:
    version: "15"
    parameters: # Expert section
      shared_buffers: "32MB"
      max_connections: "10"
      log_statement: "all"
  volume:
    size: 1Gi
  #    storageClass: my-sc
  #    iops: 1000  # for EBS gp3
  #    throughput: 250  # in MB/s for EBS gp3
  #    selector:
  #      matchExpressions:
  #        - { key: flavour, operator: In, values: [ "banana", "chocolate" ] }
  #      matchLabels:
  #        environment: dev
  #        service: postgres
  additionalVolumes:
    - name: empty
      mountPath: /opt/empty
      targetContainers:
        - all
      volumeSource:
        emptyDir: {}
  #    - name: data
  #      mountPath: /home/postgres/pgdata/partitions
  #      targetContainers:
  #        - postgres
  #      volumeSource:
  #        PersistentVolumeClaim:
  #          claimName: pvc-postgresql-data-partitions
  #          readyOnly: false
  #    - name: conf
  #      mountPath: /etc/telegraf
  #      subPath: telegraf.conf
  #      targetContainers:
  #        - telegraf-sidecar
  #      volumeSource:
  #        configMap:
  #          name: my-config-map

  enableShmVolume: true
  #  spiloRunAsUser: 101
  #  spiloRunAsGroup: 103
  #  spiloFSGroup: 103
  #  podAnnotations:
  #    annotation.key: value
  #  serviceAnnotations:
  #    annotation.key: value
  #  podPriorityClassName: "spilo-pod-priority"
  #  tolerations:
  #  - key: postgres
  #    operator: Exists
  #    effect: NoSchedule
  resources:
    requests:
      cpu: 10m
      memory: 100Mi
    limits:
      cpu: 500m
      memory: 500Mi
  patroni:
    failsafe_mode: false
    initdb:
      encoding: "UTF8"
      locale: "en_US.UTF-8"
      data-checksums: "true"
    #    pg_hba:
    #      - hostssl all all 0.0.0.0/0 md5
    #      - host    all all 0.0.0.0/0 md5
    #    slots:
    #      permanent_physical_1:
    #        type: physical
    #      permanent_logical_1:
    #        type: logical
    #        database: foo
    #        plugin: pgoutput
    ttl: 30
    loop_wait: 10
    retry_timeout: 10
    synchronous_mode: false
    synchronous_mode_strict: false
    synchronous_node_count: 1
    maximum_lag_on_failover: 33554432

  # restore a Postgres DB with point-in-time-recovery
  # with a non-empty timestamp, clone from an S3 bucket using the latest backup before the timestamp
  # with an empty/absent timestamp, clone from an existing alive cluster using pg_basebackup
  #  clone:
  #    uid: "efd12e58-5786-11e8-b5a7-06148230260c"
  #    cluster: "acid-minimal-cluster"
  #    timestamp: "2017-12-19T12:40:33+01:00"  # timezone required (offset relative to UTC, see RFC 3339 section 5.6)
  #    s3_wal_path: "s3://custom/path/to/bucket"

  # run periodic backups with k8s cron jobs
  #  enableLogicalBackup: true
  #  logicalBackupSchedule: "30 00 * * *"

  #  maintenanceWindows:
  #  - 01:00-06:00  #UTC
  #  - Sat:00:00-04:00

  # overwrite custom properties for connection pooler deployments
  #  connectionPooler:
  #    numberOfInstances: 2
  #    mode: "transaction"
  #    schema: "pooler"
  #    user: "pooler"
  #    maxDBConnections: 60
  #    resources:
  #      requests:
  #        cpu: 300m
  #        memory: 100Mi
  #      limits:
  #        cpu: "1"
  #        memory: 100Mi

  initContainers:
    - name: date
      image: busybox
      command: ["/bin/date"]
  #  sidecars:
  #   - name: "telegraf-sidecar"
  #     image: "telegraf:latest"
  #     ports:
  #     - name: metrics
  #       containerPort: 8094
  #       protocol: TCP
  #     resources:
  #       limits:
  #         cpu: 500m
  #         memory: 500Mi
  #       requests:
  #         cpu: 100m
  #         memory: 100Mi
  #     env:
  #       - name: "USEFUL_VAR"
  #         value: "perhaps-true"

  # Custom TLS certificate. Disabled unless tls.secretName has a value.
  tls:
    secretName: "" # should correspond to a Kubernetes Secret resource to load
    certificateFile: "tls.crt"
    privateKeyFile: "tls.key"
    caFile: "" # optionally configure Postgres with a CA certificate
    caSecretName: "" # optionally the ca.crt can come from this secret instead.
```

Lets create the above request. Copy the contents above into a file called
`resource.yaml` and apply the request to Kratix

```bash
kubectl --context $PLATFORM apply --filename resource.yaml
```

The above command will give an output similar to:

```shell-session
postgres.workshop.kratix.io/example created
```

Verify Postgres is booting up:

```bash
kubectl --context $WORKER get pods --watch
```

The above command will give an output similar to:

:::note

It will take a couple of minutes for Postgres to start, and it may cycle through
a few states, including _Terminating_, before it eventually succeeds.

:::

```shell-session
NAME                                READY   STATUS    RESTARTS   AGE
//highlight-next-line
postgres-dev-example                 0/1     Running   0          1m
postgres-operator-7f58798d5c-sr825   1/1     Running   0          1h
```

When the `Ready` column reports `1/1` for `postgres-dev-example`, your Postgres
is fully deployed and ready to be accessed! Press <kbd>Ctrl</kbd>+<kbd>C</kbd> to
exit the watch mode.

If you inspect what has been deployed you will see it mirrors the configuration
specified in the request, for example inspect the volume provisioned for the
Postgres and see it matches the desired 1Gb.

```bash
kubectl --context $WORKER get persistentvolume
```

## Changing the complexity of the Promise API

Having this level of configuration exposed by the Promise API might allow
developers to get exactly what they need via the Promise, but has a few trade
offs:

- The user requesting it needs to deeply understand Postgres and its various
  configurations, including those that are specific to the Zalando Operator
- The organisation can't easily limit or enforce standards without granularly
  checking each individual field

An API that exposes all of the configuration would be called a low-level API, a
more generic, easier to consume API would be high-level. For example the
Promise API could be reimagined like:

```yaml
apiVersion: workshop.kratix.io/v1
kind: postgresql
metadata:
  name: example
  namespace: default
spec:
  size: small
  dbName: bestdb
  requester: requester-name
```

The user now has a much small surface area for configuration, and no longer
needs to be an expert on Postgres to get started. This approach provides a lot
of value:

- Simplify complex details for easier understanding
- Let user spend less time worrying about the details
- Organisation can incaspulate its opinions and standards on how a Postgres
  should be configured
- Reduces user error and potentially dangerous configurations

[Here](https://github.com/syntasso/workshop/blob/main/promises/promise-clean/promise.yaml)
is a version of the Promise with the modified simpler API. What we need to do is
modify the pipeline that runs in this Promise so that it knows how to read the
three inputs `size`, `dbName` and `requester`, and generate the corresponding
Postgres instance. The Image has already been written and the logic inside it
can be viewed
[here](https://github.com/syntasso/workshop/blob/main/promises/promise-clean/internal/configure-pipeline/execute-pipeline).
All you need to do is modify the image in the Pipeline specified in the Promise
to be the new image
`ghcr.io/syntasso/workshop/postgresql-configure-pipeline:v0.2.0`. Copy the
contents of the [Promise](here) and modify the following section:

```yaml
  workflows:
    resource:
      configure:
        - apiVersion: platform.kratix.io/v1alpha1
          kind: Pipeline
          metadata:
            name: instance-configure
            namespace: default
          spec:
            containers:
//highlight-next-line
              - image: ghcr.io/syntasso/workshop/postgresql-configure-pipeline:v0.2.0
                name: postgresql-configure-pipeline
```

The Promise is now setup to handle our new high-level API. Before testing this
lets delete the old Promise first:

```shell-session
kubectl --context $PLATFORM delete promise postgresql
```

Now lets install the latest version of the Promise
```shell-session
kubectl --context $PLATFORM apply -f promise.yaml
```

And make a request using our new API:
```yaml
cat <<EOF | kubectl --context $PLATFORM apply --filename -
apiVersion: workshop.kratix.io/v1
kind: postgresql
metadata:
  name: example
  namespace: default
spec:
  size: small
  dbName: bestdb
  requester: requester-name
EOF
```

Verify Postgres is booting up:

```bash
kubectl --context $WORKER get pods --watch
```

The above command will give an output similar to:

:::note

It will take a couple of minutes for Postgres to start, and it may cycle through
a few states, including _Terminating_, before it eventually succeeds.

:::

```shell-session
NAME                                READY   STATUS    RESTARTS   AGE
//highlight-next-line
postgres-dev-example                 0/1     Running   0          1m
postgres-operator-7f58798d5c-sr825   1/1     Running   0          1h
```

When the `Ready` column reports `1/1` for `postgres-dev-example`, your Postgres
is fully deployed and ready to be accessed! Press <kbd>Ctrl</kbd>+<kbd>C</kbd> to
exit the watch mode.

In our container image we decided that `size: small` should provision a "1Gi"
volume. Lets check that was respected:

```bash
kubectl --context $WORKER get persistentvolume
```

### Extending the Pipeline
In the previous section we showed how you can configure business logic into the
pipeline, in this case encodifying the organisations opinions on how a Postgres
should be configured.

The pipeline can be extended to perform more actions, for example it could:

- Notify the requester via a slack message or email
- Scan the Postgres images for security issues
- Calling an internal billing API
- Provisioning external resources, e.g. an S3 bucket in AWS using terraform

To show this we've written two images for you:

- `https://ghcr.io/syntasso/workshop/security-scanner:v0.1.0` that finds all images refencered in
  the manifests and scans them for vulnerabilities
- `syntasso/external-something-example.com` that calls some external API

Lets update the Promise to use these new images. Extend the Promise to have the
following:

```yaml
  workflows:
    resource:
      configure:
        - apiVersion: platform.kratix.io/v1alpha1
          kind: Pipeline
          metadata:
            name: instance-configure
            namespace: default
          spec:
            containers:
              - image: ghcr.io/syntasso/workshop/postgresql-configure-pipeline:v0.2.0
                name: postgresql-configure-pipeline
//highlight-next-line
              - image: https://ghcr.io/syntasso/workshop/security-scanner:v0.1.0
//highlight-next-line
                name: security-scanner
//highlight-next-line
              - image: syntasso/external-something-example.com
//highlight-next-line
                name: external-something
```

Lets delete the old version and install the new version
```shell-session
kubectl --context $PLATFORM delete promise postgresql
kubectl --context $PLATFORM apply -f promise.yaml
```

Lets make the request again:
```shell-session
kubectl --context $PLATFORM apply -f resource.yaml
```

We can observe the pipeline pod running:
```bash
kubectl --context $PLATFORM get pods
```

The above command will give an output similar to:

```shell-session
NAME                               READY   STATUS      RESTARTS   AGE
configure-pipeline-postgres-d22dr   0/1     Completed   0          10s
```

If we inspect the logs of our latest run we can see the output of the security
scanner:

```bash
kubectl --context $PLATFORM logs --container security-scanner pods/configure-pipeline-postgresql-<SHA>

Found follow images:
- registry.opensource.zalan.do/acid/postgres-operator:v1.8.2-43-g3e148ea5

Scanning images for vulnerabilities
...
...
...
0 vulnerabilities found
```

# Observe some external thing
We can also see that the `syntasso/external-something-example.com` ran as X has
been created [here](example.com)


## Summary {#summary}


To recap the steps you took:

1. ✅&nbsp;&nbsp;Identify a service to provide on demand
1. ✅&nbsp;&nbsp;Design a user experience for requesting the service
1. ✅&nbsp;&nbsp;Define an API to match the user experience
1. ✅&nbsp;&nbsp;Install a Kratix Promise with that API definition
1. ✅&nbsp;&nbsp;Request an on-demand Resource from a Promise

## Clean up environment {#cleanup}

Before moving on, please remove the ECK Promise from your cluster.

To delete all the Promises:

```bash
kubectl --context $PLATFORM delete promises --all
```

## 🎉 &nbsp; Congratulations

✅&nbsp;&nbsp;Your Promise has an API. <br />
👉🏾&nbsp;&nbsp;Next you will [deliver a service on each user request](service-on-demand).
