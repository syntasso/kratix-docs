import PartialCleanupAllPromises from './_cleanup.md';

**In this tutorial, you will**
1. [learn more about the power of Promises](#power-of-promises)
1. [use Kratix Promises to build a paved path](#deploy)

# The power of Promises {#power-of-promises}

As covered previously, Promises are the building blocks that enable teams to design
platforms that specifically meet their customer needs. Through writing and extending
Promises, Platform teams can raise the value line of the platform they provide.
They can use multiple simpler, low-level Promises to provide an experience tailored
to their users needs.

Consider the task of setting up development environments for application teams.
This task is usually repetitive and requires many cookie-cutter steps. It may
involve wiring up Git repos, spinning up a CI/CD server, creating a PaaS to run
the applications, instructing CI/CD to listen to the Git repos and push successful
builds into the PaaS, and finally wiring applications to their required data services.

A Promise can encapsulate all the required steps and handle the toil of running
those low-level tasks. It can be designed as a single Promise that does it all,
or it can be a collection of Promises that, combined, deliver the desired functionality.

Now you will see the power of Kratix Promises by deploying a web app that uses multiple Promises.

<br />
<hr />
<br />

## Building a paved path using multiple Kratix Promises {#deploy}

![Overview](/img/docs/Treasure_Trove-Install_Multiple_Promises.jpeg)

### Steps
1. [Install Promises](#install-all-promises)
1. [Request instances](#request-instances)
1. [Run the deploy pipeline](#deploy-pipeline)
1. [Test the application](#test-app)
1. [Summary](#summary)
1. [Cleanup environment](#cleanup)

### Install all required Promises {#install-all-promises}

In order for an application team to deploy an application to a dev environment
they require a relational datastore (postgres), networking for user traffic (Nginx Ingress),
and a CI/CD service for ongoing improvements (Jenkins). To deliver this functionality
on-demand with Kratix install the required Promises on your Platform Cluster:

```console
kubectl --context $PLATFORM apply --filename https://raw.githubusercontent.com/syntasso/promise-postgresql/main/promise.yaml
kubectl --context $PLATFORM apply --filename https://raw.githubusercontent.com/syntasso/kratix-marketplace/main/nginx-ingress/promise.yaml
kubectl --context $PLATFORM apply --filename https://raw.githubusercontent.com/syntasso/kratix-marketplace/main/jenkins/promise.yaml
```
<br />

Verify the Promises are all installed on your Platform Cluster
```console
kubectl --context $PLATFORM get promises
```

The above command will give an output similar to
```console
NAME           AGE
jenkins        1m
nginx-ingress  1m
postgresql     1m
```
<br />

Verify the CRDs are all installed on your Platform Cluster. Note that you know
have `jenkins`, and `postgres` available (notice no Nginx CRD! We will get to that later).

```console
kubectl --context $PLATFORM get crds
```

The above command will give an output similar to
```console
NAME                                CREATED AT
clusters.platform.kratix.io         2023-01-24T17:00:37Z
#highlight-start
jenkins.marketplace.kratix.io       2023-01-24T17:22:50Z
postgresqls.marketplace.kratix.io   2023-01-24T17:23:51Z
#highlight-end
promises.platform.kratix.io         2023-01-24T17:00:37Z
workplacements.platform.kratix.io   2023-01-24T17:00:37Z
works.platform.kratix.io            2023-01-24T17:00:37Z
```
<br />

<p>Verify the <code>workerClusterResources</code> (more details in future steps)
are installed on your Worker Cluster<br /> <sub>(This may take a few minutes so
<code>--watch</code> will watch the command. Press <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop watching)</sub>
</p>

```console
kubectl --context $WORKER get pods --watch
```

The above command will give an output similar to
```console
NAME                                 READY   STATUS    RESTARTS   AGE
jenkins-operator-6c89d97d4f-r474w    1/1     running   0          1m
nginx-nginx-ingress-58c4dcb47d-tws   1/1     running   0          1m
postgres-operator-7dccdbff7c-2hqhc   1/1     Running   0          1m
```

As mentioned above, there is no CRD for the Nginx Ingress Promise. This Promise
only contains Worker Cluster Resources, it has no `xaasCrd` or `xaasRequestPipeine`.
For any software that you want installed by-default on your clusters and that don't
require any per-instance requests you can just fill in only the `workerClusterResources`
fields. Other good examples of this might be running Observability stacks, e.g.
Prometheus or a Service Mesh, e.g. Istio.
<br />

### Request instances {#request-instances}

![Overview-instances](/img/docs/Treasure_Trove-Get_instances_of_multiple_Promises.jpeg)

Submit a set of Kratix Resource Requests to get a
Jenkins instance and a Postgres database.
```console
kubectl --context $PLATFORM apply --filename https://raw.githubusercontent.com/syntasso/promise-postgresql/main/resource-request.yaml
kubectl --context $PLATFORM apply --filename https://raw.githubusercontent.com/syntasso/kratix-marketplace/main/jenkins/resource-request.yaml
```
<br />

<p>By requesting these two resources, you will start two pods, one for the
Jenkins server (named <code>jenkins-dev-example</code>), and another which create a
Postgres cluster (named per the Resource Request name,
<code>acid-example-postgresql</code>). To verify you have all the necessary resources up
and running<br /> <sub>(This may take a few minutes so <code>--watch</code>
will watch the command. Press <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop
watching)</sub>
</p>

```console
kubectl --context $WORKER get pods --watch
```

The above command will give an output similar to
```console
NAME                                READY   STATUS      RESTARTS   AGE
acid-example-postgresql-0           1/1     Running     0          5m
jenkins-dev-example                 1/1     Running     0          5m
...
```
<br />

Verify that the Kratix Resource Request was issued on the Platform Cluster.
```console
kubectl --context $PLATFORM get jenkins.marketplace.kratix.io
```
<br />

The above command will give an output similar to
```console
NAME          AGE
example       1m
```
<br />

#### Run the application deploy pipeline {#deploy-pipeline}

With all the necessary resources available, you will now change hats to be a
part of the application team who can now design and run their own CI/CD
pipeline using the provided Jenkins service. In this step, you will deploy a
[sample application](https://github.com/syntasso/sample-golang-app) through a
Jenkins pipeline, that uses Postgres for persistence and Nginx for serving
the application.

First, create a service account on the Worker cluster, so Jenkins can create
Deployments from the pipeline:

```
kubectl --context $WORKER apply -f \
    https://raw.githubusercontent.com/syntasso/sample-golang-app/main/k8s/service-account.yaml
```

<br />

Access the Jenkins UI in a browser, as in the [previous
step](installing-a-promise). Port forward for browser access to the Jenkins UI:

```console
kubectl --context $WORKER port-forward jenkins-dev-example 8080:8080
```
<br />

Navigate to [http://localhost:8080](http://localhost:8080) and log in with the credentials you get from the commands below:

```console jsx title="username"
kubectl --context $WORKER get secret jenkins-operator-credentials-dev-example \
    -o 'jsonpath={.data.user}' | base64 -d
```
```console jsx title="password"
kubectl --context $WORKER get secret jenkins-operator-credentials-dev-example \
    -o 'jsonpath={.data.password}' | base64 -d
```
<br />

In the Jenkins UI, create a new pipeline using this
[Jenkinsfile](https://raw.githubusercontent.com/syntasso/sample-golang-app/main/ci/Jenkinsfile)
and execute it.

For those that are less familiar with Jenkins, you can either expand the instructions
below or watch the video to see how to navigate the UI for this task.


<details>
<summary>Configuring a Jenkins Pipeline</summary>

1. From the _Dashboard_ page, click _New Item_ in the left menu
2. Enter a name for the pipeline, e.g. `todo-app-pipeline`
3. Select _Pipeline_ from the _Select item type_ dropdown
4. Click _OK_
5. In the _Pipeline_ section, paste the contents of the [Jenkinsfile](https://raw.githubusercontent.com/syntasso/sample-golang-app/main/ci/Jenkinsfile) in the _Script_ field
6. Click _Save_
7. Click _Build Now_ in the left menu
8. Click on the running build
9. Click _Console Output_ to see the pipeline progress

</details>

<div style={{"text-align":"center"}}>
<video src="https://user-images.githubusercontent.com/201163/175933452-853af525-7fff-4dca-9ba9-032c07c8c393.mov" data-canonical-src="https://user-images.githubusercontent.com/201163/175933452-853af525-7fff-4dca-9ba9-032c07c8c393.mov" controls="controls" muted="muted" style={{"max-height":"500px"}}>
</video>
</div>


### Validate the deployment {#validate-deployment}

Verify that the `todo` deployment is ready:

```console
kubectl --context $WORKER get pods
```

The above command will give an output similar to
```console
NAME                                   READY   STATUS    RESTARTS   AGE
acid-example-postgresql-0              1/1     Running   0          158m
jenkins-dev-example                    1/1     Running   0          157m
jenkins-operator-7f58798d5c-ph9dh      1/1     Running   0          3h
nginx-nginx-ingress-58c4dcb47d-twwqs   1/1     Running   0          3h
postgres-operator-79754946d-pn45n      1/1     Running   0          3h
#highlight-start
todo-58896c88d5-5txdl                  1/1     Running   0          2m55s
#highlight-end
```
<br />

### Test the deployed application {#test-app}

Now test the app. Navigate to [http://todo.default.local.gd:8081](http://todo.default.local.gd:8081)
to see the app running. 

<details>
  <summary> If you have setup your clusters not using KinD then <strong>Click here </strong>
  for instructions on how to access the app </summary>

    1. Setup a port-forward to Nginx:
       ```console
        kubectl port-forward svc/nginx-nginx-ingress 8081:80
       ```
    1. Curl the endpoint with the Host header set
       ```console
        curl -s -H "host: todo.local.gd" localhost:8081
       ```
       Alternatively navigate to localhost:8081 in the browser and use a plugin (e.g.
       [ModHeader](https://chrome.google.com/webstore/detail/modheader-modify-http-hea/idgpnmonknjnojddfkpgkljpfnnfcklj))
       to set the Host header.
</details>



## Summary {#summary}
Your platform has pieced together three different Promises to provide a complete
solution for an application team to deploy a new service to dev using your suggested
CI/CD and hosting solutions. Well done!

To recap the steps we took:
1. ✅&nbsp;&nbsp;Installed all three Kratix Promises
1. ✅&nbsp;&nbsp;Requested an instance of each Kratix Promise
1. ✅&nbsp;&nbsp;Created and run a CI/CD pipeline for a new application
1. ✅&nbsp;&nbsp;Viewed an endpoint from a newly deployed and networked application

This is only the beginning of working with Promises. Next you will learn how to
write and update Promises, and in the final thoughts we will showcase the composability
of Promises to further optimise this workflow from three requests down to one.

## Cleanup environment {#cleanup}
To clean up your environment first delete the Resource Requests for the Jenkins, Nginx and Postgres Promises.

```bash
kubectl --context $PLATFORM delete jenkins,nginx-ingress,postgresqls --all
```

Verify the resources belonging to the Resource Requests have been deleted in the Worker Cluster
```console
kubectl --context $WORKER get pods,namespaces
```

Now all the Resource Requests have been deleted you can delete the Promises
```bash
kubectl --context $PLATFORM delete promises --all
```

Verify the Worker Cluster resources are deleted from the Worker Cluster
```console
kubectl --context $WORKER get pods
```

<br />

## 🎉 &nbsp; Congratulations!
✅&nbsp;&nbsp; You have deployed a web app that uses multiple Kratix Promises. <br />
👉🏾&nbsp;&nbsp; Now you will [write your own Jenkins Promise to learn more about how Kratix Promises work](writing-a-promise).
