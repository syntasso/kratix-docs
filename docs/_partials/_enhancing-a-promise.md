import PartialCleanupAllPromises from './_cleanup.md';
import useBaseUrl from '@docusaurus/useBaseUrl';

**In this tutorial, you will**
1. experience the power of leveraging customised Kratix Promises
1. gain confidence with the components of a Promise
1. enhance an sample Postgres Promise

## Using Kratix to support your organisation

As [you've seen](./installing-a-promise), Kratix can support Promises for services like Jenkins, Nginx, and Postgres.

When you think about providing services for things like automation, deployment or data, how often are you able to choose a service (like Postgres) and offer it to your users straight off the shelf?

Probably not very often.

Application teams need to be able to easily run their services in different environments. They'll want specific sizes, particular backup strategies, defined versions, and more. Key stakeholders in other parts of the business also need to easily understand the state of service usage as it applies to them (hello audit, billing, and security!).

Your team works with all of these users to understand the if, when, and how of each of these requests and creates a platform from a prioritised backlog of platform features.

This platform needs to be extensible and flexible&mdash;your users will have new and changing needs, and you'll want to quickly respond to valuable feature requests.

Kratix and Promises make it easier to create a platform paved with golden paths that deliver value easily and quickly.

Now you will create and enhance a Promise as a response to user and business needs.

<br />
<hr />
<br />

## From off-the-shelf to ready for the paved path

### The scenario

In this exercise, you and the platform team are starting development of the next platform feature.

You discussed needs with application teams and you've decided to offer a new service. You'll be adding Postgres to your platform.

The billing team is a key stakeholder for the platform, and they will need a cost centre for each new instance of your Postgres service to charge back to the right team.

For the purposes of this exercise, you know that all of the underlying functionality to get the billing team what it needs is already in place.

_In this guide, you only need create a new Postgres Promise that creates Postgres instances with a `costCentre` label._


**The steps:**

1. [Get a base Promise](#base-promise)
1. [Change the Promise so that _the user who wants an instance_ knows they need to include their `costCentre` name when they make their request to the platform](#api)
1. [Change the Promise so that _the Worker Cluster_ Operator that creates the instance knows to apply your new `costCentre` label `costCentre`](#dependencies)
1. [Change the Promise so that _the pipeline_ knows how to add the user's `costCentre` to the request for the instance](#workflow)
1. [Install the modified Promise on your platform](#install-promise)
1. [Check it works: make a request to your platform for a Postgres instance](#verify-resource)


### Step one: Get a base Promise {#base-promise}

There's a PostgreSQL Promise available on the [Marketplace](http://kratix.io/marketplace). You'll use that as your base. Start by cloning the repository:

```console
git clone https://github.com/syntasso/promise-postgresql.git
```

Take a look
```console
cd promise-postgresql
ls
```

You should see something a structure similar to the one below:

<!-- TODO: (promising future) revisit directory strucutre after promise updates -->

```bash
. 📂 promise-postgresql
#highlight-next-line
  ├── promise.yaml
  ├── resource-request.yaml
  ├── ...
  └── 📂 internal
      ├── 📂 request-pipeline
      │   ├── 📂 resources
      │   │   └── minimal-postgres-manifest.yaml
      │   ├── Dockerfile
      │   ├── execute-pipeline.sh
      ├── 📂 dependencies
      │   ├── operator.yaml
      │   └── ...
      ├── 📂 scripts
      │   ├── test
      │   └── ...
      └── README.md
```


You should see the `promise.yaml` file. This is the Promise definition
that you'll modify and install on your platform. Ignore everything else in the
folder for now.

### Step two: `api` {#api}
> Change the Promise so that _the user who wants an instance_ knows they need to include their `costCentre` name when they make their request to the platform

#### About `api`

<!-- TODO: (promising-future) update image -->

<img
  align="right"
  src={useBaseUrl('/img/docs/api.png')}
  alt="screenshot of a YAML file, highlighting the presence of the api key"
/>

`api` is the CRD exposed to the users of the [Promise](writing-a-promise).
To see `api` in the Promise definition file, open `promise.yaml`
and look under the `spec` section.

`api` is the contract with the user who wants an instance. It's where you get to define the required and optional configuration options exposed to your users.

You can already see a number of properties in this section of the `promise.yaml` file. These properties are defined within a versioned schema and can have different types and validations.

#### Update `api`

To add the required cost centre configuration, add the following to the `promise.yaml`:

```yaml
costCentre:
  pattern: "^[a-zA-Z0-9_.-]*$"
  type: string
```
From the top of the file, navigate to

`spec` > `api` > `spec` > `versions[0]` > `schema` > <br /> `openAPIV3Schema` > `properties` > `spec` > `properties`

Here, add your `costCentre` YAML from above as a sibling to the existing `dbName` property.


<details>
  <summary>👀&nbsp;&nbsp;Click here to view a final version of the extended <code>api</code> which should be indented so as to nest under the <code>spec</code> header</summary>

```yaml
api:
  apiVersion: apiextensions.k8s.io/v1
  kind: CustomResourceDefinition
  metadata:
    name: postgresqls.marketplace.kratix.io
  spec:
    group: marketplace.kratix.io
    names:
      kind: postgresql
      plural: postgresqls
      singular: postgresql
    scope: Namespaced
    versions:
    - name: v1alpha1
      schema:
        openAPIV3Schema:
          properties:
            spec:
              properties:
                #highlight-start
                costCentre:
                  pattern: "^[a-zA-Z0-9_.-]*$"
                  type: string
                #highlight-end
                dbName:
                  default: postgres
                  description: |
                    Database name. A database will be created with this name. The owner of the database will be the teamId.
                  type: string
                env:
                  default: dev
                  description: |
                    Configures and deploys this PostgreSQL with environment specific configuration. Prod PostgreSQL are configured with backups and more resources.
                  pattern: ^(dev|prod)$
                  type: string
                teamId:
                  default: acid
                  description: |
                    Team ID. A superuser role will be created with this name.
                  type: string
              type: object
          type: object
      served: true
      storage: true
```
</details>

### Step three: `dependencies` {#dependencies}

> Change the Promise so that _the Worker Cluster_ Operator that creates the instance knows to apply your new `costCentre` label `costCentre`

#### About `dependencies`

<img
  align="right"
  src={useBaseUrl('/img/docs/dependencies.png')}
  alt="screenshot of a YAML file, highlighting the presence of the dependencies key"
/>

`dependencies` is the description of all of the Kubernetes resources required to create an instance of the Promise, such as CRDs, Operators and Deployments.

In the Promise definition, you divide resources based on the idea of _prerequisite resources_ and _per-instance resources_. Prerequisite resources are resources that we create before any application team requests an instance. This can be helpful for two scenarios:
1. Any CRDs or dependency resources are ready when an instance is requested which speeds up response time to application teams.
1. Resources that can be shared across instances are only deployed once. This can reduce load on the cluster, and it can also allow defining a Kratix Resource Request as a portion of an existing resource (e.g. you could provide a whole database instance on each Resource Request, or you could provide a database within an existing instance on each Resource Request)

The `dependencies` section of the Kratix Promise defines the _prerequisite capabilities_.

These capabilities are:
* created once per cluster.
* complete Kubernetes YAML documents stored in the `dependencies` section of the Promise.

For the Postgres Promise you're defining, the only cluster resources (prerequisite capabilities) you need are conveniently packaged in a [Kubernetes Operator](https://github.com/zalando/postgres-operator) that is maintained by Zalando. The Operator turns the complexities of configuring Postgres into a manageable configuration format.

#### Update `dependencies`

To make sure each Postgres instance includes `costCentre`, you need to make the Operator aware of the label.

To ensure Zalando's Postgres Operator is aware of the label, you need to add configuration when installing the Operator. The configuration the Operator needs will be under a new key: [`inherited_labels`](https://github.com/zalando/postgres-operator/blob/master/docs/reference/operator_parameters.md#kubernetes-resources?:=inherited_labels).


:::info

`inherited_labels` is unique to how Zalando's Postgres Operator works. If you were using a different Operator (or writing your own!), a different change may be required (or no change at all).

:::

Following the Zalando [`docs`](https://github.com/zalando/postgres-operator/blob/master/docs/reference/operator_parameters.md#kubernetes-resources?:=inherited_labels), you need to add `inherited_labels` in a particular spot.

From the top of the file, navigate to

`spec` > `dependencies[7]` > `configuration` > `kubernetes`

To verify you're in the right place, the object should be `kind: OperatorConfiguration` with `name: postgres-operator`.

Under the `kubernetes` key, add `inherited_labels: [costCentre]`.

<details>
  <summary>👀&nbsp;&nbsp;Click here to see the complete <code>OperatorConfiguration</code> resource after this change</summary>

```yaml
# Note, the property was added to the top of the configuration.kubernetes
- apiVersion: acid.zalan.do/v1
  configuration:
    aws_or_gcp:
      aws_region: eu-central-1
      enable_ebs_gp3_migration: false
    connection_pooler:
      connection_pooler_default_cpu_limit: "1"
      connection_pooler_default_cpu_request: 500m
      connection_pooler_default_memory_limit: 100Mi
      connection_pooler_default_memory_request: 100Mi
      connection_pooler_image: registry.opensource.zalan.do/acid/pgbouncer:master-22
      connection_pooler_max_db_connections: 60
      connection_pooler_mode: transaction
      connection_pooler_number_of_instances: 2
      connection_pooler_schema: pooler
      connection_pooler_user: pooler
    crd_categories:
    - all
    debug:
      debug_logging: true
      enable_database_access: true
    docker_image: registry.opensource.zalan.do/acid/spilo-14:2.1-p6
    enable_crd_registration: true
    enable_lazy_spilo_upgrade: false
    enable_pgversion_env_var: true
    enable_shm_volume: true
    enable_spilo_wal_path_compat: false
    etcd_host: ""
    kubernetes:
      #highlight-next-line
      inherited_labels: [costCentre]
      cluster_domain: cluster.local
      cluster_labels:
        application: spilo
      cluster_name_label: cluster-name
      enable_cross_namespace_secret: false
      enable_init_containers: true
      enable_pod_antiaffinity: false
      enable_pod_disruption_budget: true
      enable_sidecars: true
      oauth_token_secret_name: postgres-operator
      pdb_name_format: postgres-{cluster}-pdb
      pod_antiaffinity_topology_key: kubernetes.io/hostname
      pod_management_policy: ordered_ready
      pod_role_label: spilo-role
      pod_service_account_name: postgres-pod
      pod_terminate_grace_period: 5m
      secret_name_template: '{username}.{cluster}.credentials.{tprkind}.{tprgroup}'
      spilo_allow_privilege_escalation: true
      spilo_privileged: false
      storage_resize_mode: pvc
      watched_namespace: '*'
    load_balancer:
      db_hosted_zone: db.example.com
      enable_master_load_balancer: false
      enable_master_pooler_load_balancer: false
      enable_replica_load_balancer: false
      enable_replica_pooler_load_balancer: false
      external_traffic_policy: Cluster
      master_dns_name_format: '{cluster}.{team}.{hostedzone}'
      replica_dns_name_format: '{cluster}-repl.{team}.{hostedzone}'
    logging_rest_api:
      api_port: 8080
      cluster_history_entries: 1000
      ring_log_lines: 100
    logical_backup:
      logical_backup_docker_image: registry.opensource.zalan.do/acid/logical-backup:v1.8.0
      logical_backup_job_prefix: logical-backup-
      logical_backup_provider: s3
      logical_backup_s3_access_key_id: ""
      logical_backup_s3_bucket: my-bucket-url
      logical_backup_s3_endpoint: ""
      logical_backup_s3_region: ""
      logical_backup_s3_retention_time: ""
      logical_backup_s3_secret_access_key: ""
      logical_backup_s3_sse: AES256
      logical_backup_schedule: 30 00 * * *
    major_version_upgrade:
      major_version_upgrade_mode: "off"
      minimal_major_version: "9.6"
      target_major_version: "14"
    max_instances: -1
    min_instances: -1
    postgres_pod_resources:
      default_cpu_limit: "1"
      default_cpu_request: 100m
      default_memory_limit: 500Mi
      default_memory_request: 100Mi
      min_cpu_limit: 250m
      min_memory_limit: 250Mi
    repair_period: 5m
    resync_period: 30m
    teams_api:
      enable_admin_role_for_users: true
      enable_postgres_team_crd: false
      enable_postgres_team_crd_superusers: false
      enable_team_member_deprecation: false
      enable_team_superuser: false
      enable_teams_api: false
      pam_role_name: zalandos
      postgres_superuser_teams:
      - postgres_superusers
      protected_role_names:
      - admin
      - cron_admin
      role_deletion_suffix: _deleted
      team_admin_role: admin
      team_api_role_configuration:
        log_statement: all
    timeouts:
      patroni_api_check_interval: 1s
      patroni_api_check_timeout: 5s
      pod_deletion_wait_timeout: 10m
      pod_label_wait_timeout: 10m
      ready_wait_interval: 3s
      ready_wait_timeout: 30s
      resource_check_interval: 3s
      resource_check_timeout: 10m
    users:
      enable_password_rotation: false
      password_rotation_interval: 90
      password_rotation_user_retention: 180
      replication_username: standby
      super_username: postgres
    workers: 8
  kind: OperatorConfiguration
  metadata:
    labels:
      app.kubernetes.io/instance: postgres-operator
      app.kubernetes.io/managed-by: Helm
      app.kubernetes.io/name: postgres-operator
      helm.sh/chart: postgres-operator-1.8.2
    name: postgres-operator
    namespace: default
```
</details>

### Step four: `workflows` {#workflows}

> Change the Promise `grapefruit.gummybear` workflow so that _the pipeline_ knows how to add the user's `costCentre` to the request for the instance

#### About `workflows`

<!-- TODO: (promising future) update diagram -->

<img
  align="right"
  src={useBaseUrl('img/docs/xaasRequestPipeline.png')}
  alt="screenshot of a YAML file, highlighting the presence of the workflow key"
/>

`workflows.grapefruit.gummybear` contains the pipeline that will take your user's request, apply rules from your organisation (including adding the `costCentre` name), and output valid Kubernetes documents for the Operator to run on a Worker Cluster.

Conceptually, a pipeline is the manipulation of an input value to generate an output value. There are three parts to the PostgreSQL request pipeline.

* `resources/minimal-postgres-manifest.yaml`
* `execute-pipeline.sh`
* `Dockerfile`

<br />

You can see these files in the `internal/request-pipeline` directory. To
connect the new user input label, we will need to make sure the pipelins both
reads it in, and applies it to the right place in the customised resource
outputs. This requires you to change two of files:

1. Resource template: This resource needs to hold reference to the `costCentre` _label_
1. Pipeline script: Inject the user's `costCentre` _actual value_ into the resource template to generate the output

#### Update the `minimal-postgres-manifest.yaml` to add in the property

The `minimal-postgres-manifest.yaml` is the pipeline basic template for the
Postgres instance. This is a valid Kubernetes document that the Postgres
Operator can understand.

You know every Postgres instance needs the `costCentre`. Change the metadata in
`minimal-postgres-manifest.yaml` to include the `costCentre` label. This sets
up a holding spot for the `costCentre` value the user sends in the request.

```yaml jsx title=promise-postgresql/internal/request-pipeline/resources/minimal-postgres-manifest.yaml
labels:
  costCentre: TBD
```

<details>
<summary>👀&nbsp;&nbsp;Click here for the complete metadata section</summary>

```yaml jsx title=promise-postgresql/internal/request-pipeline/resources/minimal-postgres-manifest.yaml
metadata:
  name: acid-minimal-cluster
  labels:
    costCentre: TBD
```
</details>

#### Update the `execute-pipeline.sh` to add in the user's value

The `execute-pipeline.sh` (in `promise-postgresql/internal/request-pipeline`)
runs when Docker builds the image for the pipeline. This script is where the
pipeline logic lives.

You can see that the script is already parsing the Kratix Resource Request to
identify key user variables (`name`, `namespace`, `teamId`, etc). The
script then uses [yq](https://github.com/mikefarah/yq) to add those
user-provided values to the output document. You can do the same to process the
user's `costCentre`.

In the `execute-pipeline.sh`
1. Export another environment variable to store the value
    ```bash
    export COST_CENTRE=$(yq eval '.spec.costCentre' /input/object.yaml)
    ```
1. Add a new line for `yq` process the replacement as a part of the pipeline
    ```bash
    .metadata.labels.costCentre = env(COST_CENTRE) |
    ```

<details>
  <summary>👀&nbsp;&nbsp;Click here to view an example of the final script</summary>

```bash jsx title=promise-postgresql/internal/request-pipeline/execute-pipeline.sh
#!/usr/bin/env sh

set -x

base_instance="/tmp/transfer/minimal-postgres-manifest.yaml"

# Read current values from the provided Resource Request
name="$(yq eval '.metadata.name' /input/object.yaml)"

env_type="$(yq eval '.spec.env // "dev"' /input/object.yaml)"
team="$(yq eval '.spec.teamId // "acid"' /input/object.yaml)"
dbname="$(yq eval '.spec.dbName // "postgres"' /input/object.yaml)"

instance_name="${team}-${name}-postgresql"

backup="false"
size="1Gi"
instances="1"
if [ $env_type = "prod" ]; then
  backup="true"
  size="10Gi"
  instances="3"
fi

#highlight-next-line
export COST_CENTRE=$(yq eval '.spec.costCentre' /input/object.yaml)

# Replace defaults with user provided values
cat ${base_instance} |
  yq eval "
  #highlight-next-line
    .metadata.labels.costCentre = env(COST_CENTRE) |
    .metadata.namespace = \"default\" |
    .metadata.name = \"${instance_name}\" |
    .spec.enableLogicalBackup = ${backup} |
    .spec.teamId = \"${team}\" |
    .spec.volume.size = \"${size}\" |
    .spec.numberOfInstances = ${instances} |
    .spec.users = {\"${team}\": [\"superuser\", \"createdb\"]} |
    .spec.databases = {\"$dbname\": \"$team\"} |
    del(.spec.preparedDatabases)
  " - > /output/postgres-instance.yaml
```
</details>

#### Test the pipeline locally

You can easily validate your pipeline locally by building and running the Docker image with the correct volume mounts.

Check that you are in the `promise-postgresql` directory, and run the block below to:

1. create two directories inside `internal/request-pipeline`: `input` and `output`
1. create expected input file (i.e., the request from your user)

```console
cd internal/request-pipeline
mkdir -p {input,output}
cat > input/object.yaml <<EOF
---
apiVersion: marketplace.kratix.io/v1alpha1
kind: postgresql
metadata:
  name: example
  namespace: default
spec:
  costCentre: "rnd-10002"
  env: dev
  teamId: acid
  dbName: bestdb
EOF
```

Now test the pipeline by doing a Docker build and run. _Check that, per the step above, you are still in the `internal/request-pipeline` directory._

```console
docker build . --tag kratix-workshop/postgres-request-pipeline:dev
docker run -v ${PWD}/input:/input -v ${PWD}/output:/output kratix-workshop/postgres-request-pipeline:dev
```

Now you can validate the `output/postgres-instance.yaml` file.

It should be the base manifest with all the custom values inserted and look like the example below. If your output is different, go back and check the steps from above and the files in the directory. Repeat this process until your output matches the output below.

<details>
    <summary>👀&nbsp;&nbsp;Click here to view an example of expected output YAML</summary>

```yaml jsx title="expected promise-postgresql/internal/request-pipeline/output/postgres-instance.yaml"
apiVersion: "acid.zalan.do/v1"
kind: postgresql
metadata:
  name: acid-example-postgresql
  labels:
    costCentre: "rnd-10002"
spec:
  teamId: "acid"
  volume:
    size: 1Gi
  numberOfInstances: 1
  users:
    acid:
      - superuser
      - createdb
  databases:
    bestdb: acid
  postgresql:
    version: "15"
  enableLogicalBackup: false
```
</details>

#### Give the platform access to your pipeline image

Once you have made and validated all the pipeline image changes, you will need
to make the newly created `kratix-workshop/postgres-request-pipeline:dev` image
accessible.

If you created your clusters with KinD, you can load the image into local cache
by running the command below. This will stop any remote DockerHub calls.

```console
kind load docker-image kratix-workshop/postgres-request-pipeline:dev --name platform
```

<details>
  <summary><strong>Click here</strong> if your clusters were not created with KinD</summary>
  If you have not created your Kubernetes clusters with KinD, you will need to either:
  <ul>
    <li>Push the image to a Image repository (like Dockerhub), or </li>
    <li>Use the appropriate command to load the image (for example, <code>minikube cache add</code> if you are using minikube)</li>
  </ul>
</details>

#### Update the Promise's `workflows` value

The new image is built and available on your Platform Cluster. Update your Promise to use the new image.

Open the Promise definition file (`promise-postgresql/promise.yaml`). From the top of the file, navigate to `spec` > `workflows` > `grapefruit` > `gummybear[0]` > `spec` > `containers[0]` > `image` and replace the current value image with the newly created `kratix-workshop/postgres-request-pipeline:dev` image.

<details>
  <summary>👀&nbsp;&nbsp;Click here to see the resulting workflows section which should be indented under <code>spec</code> in the Promise yaml</summary>

```yaml jsx title="promise-postgresql/promise.yaml"
apiVersion: platform.kratix.io/v1alpha1
kind: Promise
metadata:
  name: postgresql
spec:
  api:
  # ...
  workflows:
    grapefruit:
      gummybear:
        - apiVersion: platform.kratix.io/v1alpha1
          kind: Pipeline
          metadata:
            name: configure-instance
            namespace: default
          spec:
            containers:
              - name: xaas-request-pipeline-stage-0
                #highlight-next-line
                image: kratix-workshop/postgres-request-pipeline:dev
  dependencies:
  # ...
```
</details>

### Step five: Install {#install-promise}
> Install the modified Promise on your platform

You can now install your enhanced Postgres Promise on your platform. Make sure you're in the `promise-postgresql/` directory.

```console
kubectl --context $PLATFORM apply --filename promise.yaml
```
<br />

Check that your Promise's resource is available.
```console
kubectl --context $PLATFORM get crds
```
<br />

You should see something similar to
```console
NAME                                     CREATED AT
clusters.platform.kratix.io              2022-08-09T14:35:54Z
# highlight-next-line
postgresqls.marketplace.kratix.io        2022-08-09T14:54:26Z
promises.platform.kratix.io              2022-08-09T14:35:54Z
workplacements.platform.kratix.io        2022-08-09T14:35:54Z
works.platform.kratix.io                 2022-08-09T14:35:55Z
```
<br />

<p>Check that the `dependencies` have been installed on the
worker:<br/>
<sub>(This may take a few minutes so <code>--watch</code> will watch the command. Press <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop watching)</sub>
</p>

For Postgres, you can see in the Promise file that there are a number of RBAC
resources, as well as a deployment that installs the Postgres Operator in the
Worker Cluster. That means that when the Promise is successfully applied you
will see the `postgres-operator` deployment in the Worker Cluster. That's also
an indication that the Operator is ready to provision a new instance.

```console
kubectl --context $WORKER --namespace default get pods
```
<br />

You should see something similar to
```console
NAME                                 READY   STATUS    RESTARTS   AGE
postgres-operator-6c6dbd4459-hcsg2   1/1     Running   0          1m
```
<br />

You have successfully released a new platform capability! Your users can request a Postgres instance, and that instance will include their `costCentre`.


### Step six: Verify {#verify-resource}
> Check it works: make a request to your platform for a Postgres instance

#### Verifying your Kratix Promise can be fulfiled

Switching hats to test your release, now act as one of your users to make sure the Promise creates working instances.

You need to create a Kratix Resource Request, which is a valid Kubernetes
resource. Like all Kubernetes resources, this  must include all [required
fields](https://kubernetes.io/docs/concepts/overview/working-with-objects/kubernetes-objects/#required-fields):

1. `apiVersion` where the resource can be found. This is `marketplace.kratix.io/v1alpha1` in your Postgres Promise (from `spec.api.spec.group` in `promise.yaml`).
1. `kind`. This is `postgresql` in your Postgres Promise (from `spec.api.spec.name` in `promise.yaml`).
1. Values for required fields. Fields are `teamId`, `env`, `dbName` and `costCentre` in your Postgres Promise (from `spec` > `api` > `spec` > `versions`[0] > `schema` > `openAPIV3Schema` > `properties` > `spec` > `properties` in `promise.yaml`).
1. A unique name and namespace combination.

In the sample Resource Request (`promise-postgresql/resource-request.yaml`) add
the additional `costCentre` field as a sibling to the other fields under `spec`
with any valid input. For example, `costCentre: "rnd-10002"`.

<details>
<summary>👀&nbsp;&nbsp;Click here for the full Postgres Resource Request</summary>

```yaml jsx title="promise-postgresql/resource-request.yaml"
apiVersion: marketplace.kratix.io/v1alpha1
kind: postgresql
metadata:
  name: example
  namespace: default
spec:
  costCentre: "rnd-10002"
  env: dev
  teamId: acid
  dbName: bestdb
```
</details>

Then apply the request file to the Platform Cluster:

```console
kubectl --context $PLATFORM apply --filename resource-request.yaml
```

We will validate the outcomes of this command in the next section.

#### Validating the created Postgres

Back as a platform engineer, you want to ensure that the platform and Promise
behaved as it should when creating the instances and that the instances have
met the reequirements for the feature.

After you applied the Kratix Resource Request in the step above, you should
eventually see a new pod executing the
`execute-pipeline.sh` script you created.

<p>Check by listing the pods on the platform:<br />
<sub>(This may take a few minutes so <code>--watch</code> will watch the command. Press <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop watching)</sub>
</p>

```console
kubectl --context $PLATFORM get pods --watch
```

You should see something similar to
```console
NAME                                          READY   STATUS      RESTARTS   AGE
request-pipeline-postgresql-default-SHA     0/1     Completed   0          1h
```

Then view the pipeline logs by running _(replace SHA with the value from the output of `get pods` above)_:

```console
kubectl --context $PLATFORM logs --container xaas-request-pipeline-stage-0 pods/request-pipeline-postgresql-default-SHA
```

<p>On the Worker Cluster, you will eventually see a Postgres service as a two-pod cluster in the <em>Running</em> state with the name defined in the request (<code>postgres-resource-request.yaml</code>).<br />
<sub>(This may take a few minutes so <code>--watch</code> will watch the command. Press <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop watching)</sub>
</p>

```console
kubectl --context $WORKER get pods --watch
```

You should see something similar to
```
NAME                             READY   STATUS    RESTARTS   AGE
acid-example-postgresql-0        1/1     Running   0          1h
...
```

For the finance team, the pods will provide cost tracking through your new `costCentre` label. This can be confirmed by only selecting pods that contain the provided cost centre value:

```console
kubectl --context $WORKER get pods --selector costCentre=rnd-10002
```

You should see something similar to
```
NAME                          READY   STATUS    RESTARTS   AGE
acid-example-postgresql-0     1/1     Running   0          1h
```

## Summary
Your platform has a new Promise. Your users have access to a new service from
the Promise. Your finance team has the ability to track service usage. Well
done!

To recap the steps we took:
1. ✅&nbsp;&nbsp;Aquired a base Promise
1. ✅&nbsp;&nbsp;Changed the Promise so that _the user who wants an instance_ knows they need to include their `costCentre` name when they make their request to the platform
1. ✅&nbsp;&nbsp;Changed the Promise so that _the Worker Cluster_ Operator that creates the instance knows to apply the new `costCentre` label `costCentre`
1. ✅&nbsp;&nbsp;Changed the Promise so that _the pipeline_ knows how to add the user's `costCentre` to the request for the instance
1. ✅&nbsp;&nbsp;Installed the modified Promise on your platform
1. ✅&nbsp;&nbsp;Checked it works: make a request to your platform for a Postgres instance

<br />

## Clean up environment {#cleanup}
To clean up your environment first delete the Resource Requests for the Postgres instance

```bash
kubectl --context $PLATFORM delete --filename resource-request.yaml
```

Verify the resources belonging to the Resource Requests have been deleted in the Worker Cluster
```console
kubectl --context $WORKER get pods
```

Now the Resource Requests have been deleted you can delete the Promise
```bash
kubectl --context $PLATFORM delete --filename promise.yaml
```

Verify the Worker Cluster Resources are deleted from the Worker Cluster
```console
kubectl --context $WORKER get pods
```
