---
id: upgrade-fleet
title: Upgrading a fleet of resources
description: Some description
---

**In this tutorial, you will**

- [learn about how Kratix schedules workloads](#scheduling)
- [execute an automatic upgrade across the fleet](#upgrading)

Following the [customising a Promise](../part-iii/customising-promise) tutorial,
you should currently have a couple of Kubernetes clusters running, with Kratix
correctly wired up. You can validate the current state of your installation
running the following commands:

```bash
kubectl --context $PLATFORM get deployments --namespace kratix-platform-system
```

The above command will give an output similar to:

```shell-session
NAME                                 READY   UP-TO-DATE   AVAILABLE   AGE
kratix-platform-controller-manager   1/1     1            1           1h
minio                                1/1     1            1           1h
```

## Kratix Scheduling Architecture

Kratix is built from the ground up to manage and deploy resources across multiple worker
nodes. A worker node, using Kratix terminology, is a _Destination_.

You can check the current registered destinations in the platform cluster using:

```bash
kubectl --context $PLATFORM get destinations.platform.kratix.io
```

The above command will give an output similar to:

```shell-session
NAME               AGE
platform-cluster   1h
worker-1           1h
```

Each destination is backed by a GitOps toolkit. When a _Promise_ is installed,
or a Resource is requested, Kratix will automatically schedule the workload to one (or
more) of the available destinations, by writing the deployment manifests to the
_State Store_ attached to the Destination. Kratix supports both S3-compatible buckets
and Git repositories as types State Stores.

You can check the current registered State Stores in the platform cluster using:

```bash
kubectl --context $PLATFORM get bucketstatestores.platform.kratix.io
```

The above command will give an output similar to:

```shell-session
NAME      AGE
default   1h
```

Note that a Destination is not necessarily a Kubernetes cluster: it can be any system
that's configured to react on the documents being written to the State Store.

Kratix provides many hooks to configure where workloads can be scheduled to, using well
known Kubernetes constructs like `labels` and `selectors`. If you are curious, check the
[Kratix Multi-cluster Management](/docs/main/reference/multicluster-management)
documentation.

Once your resources are deployed across the worker nodes, the question becomes how to
manage those resources for day-2 operations. Kratix gives you full control of the fleet,
and lift all the heavy load Platform teams need to manage when dealing with large
fleets of resources.

Let's explore how an upgrade can happen across the fleet.

## Preparing the environment

Before we start, lets install a MongoDB Promise and send a few requests to create a few
MongoDB instances.

### Install the MongoDB promise

To install the MongoDB promise, first download the promise and then install it:

Copy the [Promise
contents](https://raw.githubusercontent.com/syntasso/kratix-marketplace/main/mongodb/promise.yaml)
into a `promise.yaml` file. Then install it to the platform cluster:

```bash
kubectl --context $PLATFORM apply --filename promise.yaml
```

Verify that the MongoDB operator is running on the worker cluster:

```
kubectl --context $WORKER get deployments --watch
```

The above command will eventually give an output similar to:

```shell-session
NAME                          READY   UP-TO-DATE   AVAILABLE   AGE
mongodb-kubernetes-operator   1/1     1            1           1h
```

When the operator is ready, press <kbd>Ctrl</kbd>+<kbd>C</kbd> to exit the watch mode.

### Create a few instances

To see the upgrade in action, create a few MongoDB instances by sending resource
requests to the Promise:

```bash
cat <<EOF | kubectl --context $PLATFORM apply -f -
---
apiVersion: promise.kratix.io/v1alpha1
kind: MongoDB
metadata:
  name: mongo-v4
spec:
  majorVersion: "4"
EOF

cat <<EOF | kubectl --context $PLATFORM apply -f -
---
apiVersion: promise.kratix.io/v1alpha1
kind: MongoDB
metadata:
  name: mongo-v5
spec:
  majorVersion: "5"
EOF

cat <<EOF | kubectl --context $PLATFORM apply -f -
---
apiVersion: promise.kratix.io/v1alpha1
kind: MongoDB
metadata:
  name: mongo-v6
spec:
  majorVersion: "6"
EOF
```

<details>
    <summary>🤨 cat &lt;&lt;EOF | kubectl -f - ??? </summary>

The command above is making use of _[here
documents](https://tldp.org/LDP/abs/html/here-docs.html)_ to create the resource
requests. It will, in a nutshell, send the contents between the `<<EOF` and `EOF` to the
`kubectl` CLI, in the _stdin_.

The `-` value as the `-f` argument tells the kubectl CLI to read from _stdin_ instead of
from a file.

</details>

Once the platform receives the requests, Kratix will trigger the Workflows:

```bash
kubectl --context $PLATFORM get pods -w
```

The above command will give an output similar to:

```shell-session
NAME                                           READY   STATUS      RESTARTS   AGE
configure-pipeline-mongodb-541c7-dgg6s         0/1     Completed   0          1h
configure-pipeline-mongodb-78977-jwnph         0/1     Completed   0          1h
configure-pipeline-mongodb-ec8d1-c2bqd         0/1     Completed   0          1h
```

When the pods are completed, press <kbd>Ctrl</kbd>+<kbd>C</kbd> to exit the watch mode.

Verify that the MongoDB instaces are running on the worker cluster:

```bash
kubectl --context $WORKER get pods --watch
```

The above command will give an output similar to:

```shell-session
NAMESPACE            NAME                                           READY   STATUS    RESTARTS   AGE
default              mongodb-kubernetes-operator-688bb4f998-45f9x   1/1     Running   0          94s
default              mongodb-mongo-v4-0                             2/2     Running   0          1h
default              mongodb-mongo-v5-0                             2/2     Running   0          1h
default              mongodb-mongo-v6-0                             2/2     Running   0          1h
```

When the pods are completed, press <kbd>Ctrl</kbd>+<kbd>C</kbd> to exit the watch mode.

Verify the versions deployed. On the platform cluster, run:

```bash
kubectl --context $PLATFORM get mongodbs.promise.kratix.io
```

The above command will give an output similar to:

```
NAME       STATUS
mongo-v4   mongodb version: 4.4.23
mongo-v5   mongodb version: 5.0.14
mongo-v6   mongodb version: 6.0.10
```

To validate the version deployed on the worker cluster, you can run:

```bash
kubectl --context $WORKER exec mongodb-mongo-v4-0 -c mongod -- "mongo" | grep "MongoDB server"
kubectl --context $WORKER exec mongodb-mongo-v5-0 -c mongod -- "mongo" | grep "MongoDB server"
kubectl --context $WORKER exec mongodb-mongo-v6-0 -c mongod -- "mongosh" | grep "MongoDB:"
```

The above command will give an output similar to:

```shell-session
MongoDB server version: 4.4.23
MongoDB server version: 5.0.14
Using MongoDB:          6.0.10
```

With that, you are ready to upgrade the fleet.

## Upgrading the fleet

### Prepare the new version of the Promise

When a new version of the Promise is installed, Kratix will automatically re-run the
workflow for every resource current in the fleet.

You may have noticed that in our Promise API, we were specifying only the major version
of the MongoDB. In the workflow, the Promise translates the major version into a specific
version.

Let's update the pipeline image so that:

- If the `majorVersion` requested is `4`, it deploys MongoDB 4.4.24
- If the `majorVersion` requested is `5`, it deploys MongoDB 5.0.15
- If the `majorVersion` requested is `6`, it continues to deploy MongoDB 6.0.10

To do that, clone the `syntasso/workshop` repository and go to the `mongodb` directory:

```bash
git clone git@github.com:syntasso/workshop
cd workshop/promises/mongodb/pipeline/
```

You will find the following files in this directory:

```
.
├── pipeline
│   ├── Dockerfile
│   ├── execute-pipeline
│   ├── bundle
│   └── resources
│       ├── mongodb-instance.yaml
│       └── secret.yaml
```

Open the `execute-pipeline` script and update it accordingly:

```bash
vim execute-pipeline
# edit lines 14 and 18 with the version of MongoDB we defined above
```

[Save and quit vim](https://stackoverflow.com/questions/11828270/how-do-i-exit-vim).

You would, at this stage, build and push the new container image to a registry. For the
purpose of this tutorial, we will build the image and load it directly to the platform
cluster cache.

Build a new version of the image and load it:

```bash
docker build --tag ghcr.io/syntasso/kratix-marketplace/mongodb-configure-pipeline:v0.2.0 ./pipeline

kind load docker-image ghcr.io/syntasso/kratix-marketplace/mongodb-configure-pipeline:v0.2.0 --name platform
```

Since you bumped the image version, let's update the `promise.yaml` file to use the new
version:

```bash
vim promise.yaml
```

Update the workflow to use the new version:

```yaml
# ...
spec:
  workflows:
    resource:
      configure:
      - apiVersion: platform.kratix.io/v1alpha1
        kind: Pipeline
        metadata:
          name: configure-workflow
        spec:
          containers:
          //highlight-next-line
          - image: ghcr.io/syntasso/kratix-marketplace/mongodb-configure-pipeline:v0.2.0
            name: create-instance
```

Save and quit vim.

You are now ready to trigger the upgrade!

### Trigger the upgrade

To trigger the upgrade, install the updated promise:

```bash
kubectl --context $PLATFORM apply --filename promise.yaml
```

Observe that Kratix will immediatly trigger the upgrade:

```bash
kubectl --context $PLATFORM get pods --watch
```

The above command will give an output similar to:

```shell-session
NAME                                     READY   STATUS      RESTARTS   AGE
configure-pipeline-mongodb-2778d-6c5hf   0/1     Completed   0          1s
configure-pipeline-mongodb-4354a-4pvkj   0/1     Completed   0          1h
configure-pipeline-mongodb-45ac5-scgr9   0/1     Completed   0          1h
configure-pipeline-mongodb-7bf30-cgnpk   0/1     Completed   0          1h
configure-pipeline-mongodb-e2aa1-hnhw4   0/1     Completed   0          1s
configure-pipeline-mongodb-f2965-bfd27   0/1     Completed   0          1s
```

Note how 3 new pipelines got triggered (check the `AGE` column).
Once they complete, press <kbd>Ctrl</kbd>+<kbd>C</kbd> to exit the watch mode.

You can now verify the version of the MongoDB that got requested:

```bash
kubectl --context $PLATFORM get mongodbs.promise.kratix.io
```

The above command will give an output similar to:

```shell-session
NAME       STATUS
mongo-v4   mongodb version: 4.4.24
mongo-v5   mongodb version: 5.0.15
mongo-v6   mongodb version: 6.0.10
```

Note how the versions now reflect the changes we made in the pipeline.

The MongoDB instances running on the worker will eventually be upgraded. This process may
take a couple of minutes, and the instances will be restarted. Run the following command
and wait for the instances to get back to `Running`:

```bash
kubectl --context $WORKER get pods --watch
```

The above command will eventually output something similar to:

```shell-session
NAME                                           READY   STATUS    RESTARTS   AGE
mongodb-kubernetes-operator-688bb4f998-45f9x   1/1     Running   0          1h
mongodb-mongo-v4-0                             2/2     Running   0          10s
mongodb-mongo-v5-0                             2/2     Running   0          10s
mongodb-mongo-v6-0                             2/2     Running   0          1h
```

You can see by the `AGE` column that the v4 and v5 got upgraded. Since we haven't touched
v6, it remains unchanged.

Once again, verify the versions actually running on the instances:

```bash
kubectl --context $WORKER exec mongodb-mongo-v4-0 -c mongod -- "mongo" | grep "MongoDB server"
kubectl --context $WORKER exec mongodb-mongo-v5-0 -c mongod -- "mongo" | grep "MongoDB server"
kubectl --context $WORKER exec mongodb-mongo-v6-0 -c mongod -- "mongosh" | grep "MongoDB:"
```

As expected, the above command will give an output similar to:

```shell-session
MongoDB server version: 4.4.24
MongoDB server version: 5.0.15
Using MongoDB:          6.0.10
```

Congratulations! You have successfully upgraded your fleet of MongoDB instances!

## Conclusion

In this part of the workshop you can see how Kratix can be utilised to manage a
fleet of services across multiple clusters.

