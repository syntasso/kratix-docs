"use strict";(self.webpackChunkkratix_docs=self.webpackChunkkratix_docs||[]).push([[7494],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>k});var a=n(7294);function l(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){l(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,a,l=function(e,t){if(null==e)return{};var n,a,l={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(l[n]=e[n]);return l}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(l[n]=e[n])}return l}var s=a.createContext({}),p=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},u=function(e){var t=p(e.components);return a.createElement(s.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,l=e.mdxType,r=e.originalType,s=e.parentName,u=o(e,["components","mdxType","originalType","parentName"]),m=p(n),k=l,d=m["".concat(s,".").concat(k)]||m[k]||c[k]||r;return n?a.createElement(d,i(i({ref:t},u),{},{components:n})):a.createElement(d,i({ref:t},u))}));function k(e,t){var n=arguments,l=t&&t.mdxType;if("string"==typeof e||l){var r=n.length,i=new Array(r);i[0]=m;var o={};for(var s in t)hasOwnProperty.call(t,s)&&(o[s]=t[s]);o.originalType=e,o.mdxType="string"==typeof e?e:l,i[1]=o;for(var p=2;p<r;p++)i[p]=n[p];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},2431:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>i,default:()=>c,frontMatter:()=>r,metadata:()=>o,toc:()=>p});var a=n(7462),l=(n(7294),n(3905));const r={description:"Install Kratix and multiple Promises",title:"Part 1",id:"using-multiple-promises",slug:"/events/2022-kcduk/using-multiple-promises"},i="Use Kratix Promises to build a paved path",o={unversionedId:"events/kcduk/using-multiple-promises",id:"events/kcduk/using-multiple-promises",title:"Part 1",description:"Install Kratix and multiple Promises",source:"@site/docs/events/2022-kcduk/01-using-multiple-promises.md",sourceDirName:"events/2022-kcduk",slug:"/events/2022-kcduk/using-multiple-promises",permalink:"/docs/events/2022-kcduk/using-multiple-promises",draft:!1,editUrl:"https://github.com/syntasso/kratix-docs/tree/main/docs/events/2022-kcduk/01-using-multiple-promises.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{description:"Install Kratix and multiple Promises",title:"Part 1",id:"using-multiple-promises",slug:"/events/2022-kcduk/using-multiple-promises"},sidebar:"events",previous:{title:"KCD UK 2022 Workshop",permalink:"/docs/category/kcd-uk-2022-workshop"},next:{title:"Part 2",permalink:"/docs/events/2022-kcduk/writing-a-ci-promise"}},s={},p=[{value:"What you will do",id:"what-you-will-do",level:2},{value:"Platform Engineer",id:"platform-engineer",level:2},{value:"Bootstrap a local cluster with Kratix",id:"set-up",level:3},{value:"System setup",id:"pre-requisites",level:4},{value:"Update your Docker resource allocations",id:"docker-config",level:5},{value:"Quick Start Kratix",id:"quick-start-kratix",level:4},{value:"Install multiple promises",id:"install-promises",level:3},{value:"Install all required Promises",id:"install-all-promises",level:4},{value:"Platform User",id:"platform-user",level:2},{value:"Request resources for a dev environment",id:"request-instance",level:3},{value:"Run the application",id:"run-the-application",level:4},{value:"Validate the deployment",id:"validate-deployment",level:4},{value:"Test the deployed application",id:"test-app",level:4},{value:"Summary",id:"summary",level:3},{value:"\ud83c\udf89 \xa0 Congratulations!",id:"--congratulations",level:2}],u={toc:p};function c(e){let{components:t,...r}=e;return(0,l.kt)("wrapper",(0,a.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("h1",{id:"use-kratix-promises-to-build-a-paved-path"},"Use Kratix Promises to build a paved path"),(0,l.kt)("h2",{id:"what-you-will-do"},"What you will do"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"As a Platform Engineer")),(0,l.kt)("ol",null,(0,l.kt)("li",{parentName:"ol"},(0,l.kt)("a",{parentName:"li",href:"#set-up"},"Bootstrap a local cluster with Kratix")),(0,l.kt)("li",{parentName:"ol"},(0,l.kt)("a",{parentName:"li",href:"#install-promises"},"Install multiple promises as a platform engineer"))),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"As a Platform User")),(0,l.kt)("ol",null,(0,l.kt)("li",{parentName:"ol"},(0,l.kt)("a",{parentName:"li",href:"#request-instance"},"Request an instance as a application developer"))),(0,l.kt)("hr",null),(0,l.kt)("h2",{id:"platform-engineer"},"Platform Engineer"),(0,l.kt)("h3",{id:"set-up"},"Bootstrap a local cluster with Kratix"),(0,l.kt)("h4",{id:"pre-requisites"},"System setup"),(0,l.kt)("p",null,"For this workshop, we'll use Kratix on two local Kubernetes clusters. Install the prerequisites listed below if they aren't already on your system."),(0,l.kt)("ol",null,(0,l.kt)("li",{parentName:"ol"},(0,l.kt)("p",{parentName:"li"},(0,l.kt)("inlineCode",{parentName:"p"},"kind")," CLI / ",(0,l.kt)("strong",{parentName:"p"},"Kubernetes-in-Docker(KinD)"),": ",(0,l.kt)("br",null),"\nUsed to create and manage local Kubernetes clusters in Docker. ",(0,l.kt)("br",null),"\nSee ",(0,l.kt)("a",{parentName:"p",href:"https://kind.sigs.k8s.io/docs/user/quick-start/"},"the quick start guide")," to install.")),(0,l.kt)("li",{parentName:"ol"},(0,l.kt)("p",{parentName:"li"},(0,l.kt)("inlineCode",{parentName:"p"},"docker")," CLI / ",(0,l.kt)("strong",{parentName:"p"},"Docker"),": ",(0,l.kt)("br",null),"\nUsed to orchestrate containers. ",(0,l.kt)("inlineCode",{parentName:"p"},"kind")," (above) requires that you have Docker installed and configured. ",(0,l.kt)("br",null),"\nSee ",(0,l.kt)("a",{parentName:"p",href:"https://docs.docker.com/get-docker/"},"Get Docker")," to install."),(0,l.kt)("admonition",{parentName:"li",type:"caution"},(0,l.kt)("p",{parentName:"admonition"},"Docker Desktop (For Mac) v4.13.0 has a ",(0,l.kt)("a",{parentName:"p",href:"https://github.com/docker/for-mac/issues/6530"},"known issue")," that crashes Docker Daemon on specific situations. Please ensure you are using an earlier or later version of Docker."))),(0,l.kt)("li",{parentName:"ol"},(0,l.kt)("p",{parentName:"li"},(0,l.kt)("inlineCode",{parentName:"p"},"kubectl")," / ",(0,l.kt)("strong",{parentName:"p"},"Kubernetes command-line tool"),": ",(0,l.kt)("br",null),"\nThe CLI for Kubernetes","\u2014","allows you to run commands against Kubernetes clusters.",(0,l.kt)("br",null),"\nSee ",(0,l.kt)("a",{parentName:"p",href:"https://kubernetes.io/docs/tasks/tools/#kubectl"},"the install guide"),"."))),(0,l.kt)("h5",{id:"docker-config"},"Update your Docker resource allocations"),(0,l.kt)("p",null,"In order to complete all tutorials in this series, you must allocate enough resources to Docker. Docker requires:"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"5 CPU"),(0,l.kt)("li",{parentName:"ul"},"12GB Memory"),(0,l.kt)("li",{parentName:"ul"},"4GB swap")),(0,l.kt)("p",null,"This can be managed through your tool of choice (e.g. Docker Desktop, Rancher, etc)."),(0,l.kt)("h4",{id:"quick-start-kratix"},"Quick Start Kratix"),(0,l.kt)("p",null,"You need a fresh installation of Kratix for this workshop. The simplest way to bootstrap your environment is running the quick-start script from within the Kratix directory."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"git clone https://github.com/syntasso/kratix.git\ncd kratix\n./scripts/quick-start.sh --recreate\n")),(0,l.kt)("br",null),(0,l.kt)("br",null),(0,l.kt)("p",null,(0,l.kt)("img",{alt:"Environment setup",src:n(5621).Z,width:"5106",height:"3133"})),(0,l.kt)("h3",{id:"install-promises"},"Install multiple promises"),(0,l.kt)("h4",{id:"install-all-promises"},"Install all required Promises"),(0,l.kt)("p",null,"Promises are the building blocks that enable teams to design platforms that specifically meet their customer needs in a self-service way. To deliver a dev environment for a new application, with Kratix install Promises for knative serving and Postgres on your platform cluster:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash",metastring:'title="Install knative and Postgres promises"',title:'"Install',knative:!0,and:!0,Postgres:!0,'promises"':!0},"kubectl --context kind-platform apply --filename https://raw.githubusercontent.com/syntasso/kratix/main/samples/postgres/postgres-promise.yaml\nkubectl --context kind-platform apply --filename https://raw.githubusercontent.com/syntasso/kratix/main/samples/knative-serving/knative-serving-promise.yaml\n")),(0,l.kt)("p",null,"When a Promise is installed into the cluster, it will do two visible things:"),(0,l.kt)("ol",null,(0,l.kt)("li",{parentName:"ol"},"Teach Kratix how to accept requests for an instance of the service"),(0,l.kt)("li",{parentName:"ol"},"Set up any prerequisite infrastructure that is required to create an instance")),(0,l.kt)("br",null),(0,l.kt)("br",null),(0,l.kt)("p",null,(0,l.kt)("img",{alt:"Installing a promise",src:n(5354).Z,width:"5106",height:"3133"})),(0,l.kt)("br",null),(0,l.kt)("p",null,"Verify the Promises are all installed on your platform cluster"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-console"},"kubectl --context kind-platform get promises\n")),(0,l.kt)("p",null,"The above command will give an output similar to"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-console"},"NAME                      AGE\n#highlight-start\nha-postgres-promise       1m\nknative-serving-promise   1m\n#highlight-end\n")),(0,l.kt)("br",null),(0,l.kt)("p",null,"Verify the CRDs that let a customer request an instance have been installed"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-console"},"kubectl --context kind-platform get crds\n")),(0,l.kt)("p",null,"The above command will give an output similar to"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-console"},"NAME                                          CREATED AT\nclusters.platform.kratix.io                   2022-09-23T14:37:20Z\n#highlight-start\nknativeservings.example.promise.syntasso.io   2022-09-23T14:38:48Z\npostgreses.example.promise.syntasso.io        2022-09-23T14:38:51Z\n#highlight-end\npromises.platform.kratix.io                   2022-09-23T14:37:20Z\nworkplacements.platform.kratix.io             2022-09-23T14:37:20Z\nworks.platform.kratix.io                      2022-09-23T14:37:20Z\n")),(0,l.kt)("br",null),(0,l.kt)("p",null,"Finally, verify the prerequisite infrastructure for delivering Postgres on demand have been installed on the worker cluster"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-console"},"kubectl --context kind-worker get pods\n")),(0,l.kt)("p",null,"The above command will give an output similar to"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-console"},"NAME                                 READY   STATUS    RESTARTS   AGE\n#highlight-start\npostgres-operator-7dccdbff7c-2hqhc   1/1     Running   0          1m\n#highlight-end\n")),(0,l.kt)("p",null,"and for knative"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"kubectl --context kind-worker get crds\n")),(0,l.kt)("p",null,"The above command will give an output similar to"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-console"},"NAME                                                  CREATED AT\nalerts.notification.toolkit.fluxcd.io                 2022-11-17T12:00:00Z\nbuckets.source.toolkit.fluxcd.io                      2022-11-17T12:00:00Z\n#highlight-start\ncertificates.networking.internal.knative.dev          2022-11-17T12:11:00Z\nclusterdomainclaims.networking.internal.knative.dev   2022-11-17T12:11:00Z\nconfigurations.serving.knative.dev                    2022-11-17T12:11:00Z\ndomainmappings.serving.knative.dev                    2022-11-17T12:11:00Z\n#highlight-end\ngitrepositories.source.toolkit.fluxcd.io              2022-11-17T12:00:00Z\n...\n")),(0,l.kt)("br",null),(0,l.kt)("h2",{id:"platform-user"},"Platform User"),(0,l.kt)("h3",{id:"request-instance"},"Request resources for a dev environment"),(0,l.kt)("p",null,"As an application dev, you have a new app you want to deploy along with a new database. To do this, you can make a request for the resources you need providing only the details that are required."),(0,l.kt)("p",null,(0,l.kt)("img",{alt:"Requesting resources",src:n(7137).Z,width:"4688",height:"3412"})),(0,l.kt)("p",null,"Submit a set of Kratix Resource Requests to get a Knative Serving component and a Postgres database."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-console"},"kubectl --context kind-platform apply --filename https://raw.githubusercontent.com/syntasso/kratix/main/samples/postgres/postgres-resource-request.yaml\nkubectl --context kind-platform apply --filename https://raw.githubusercontent.com/syntasso/kratix/main/samples/knative-serving/knative-serving-resource-request.yaml\n")),(0,l.kt)("br",null),(0,l.kt)("p",null,"Verify that the Kratix Resource Request was issued on the platform cluster."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-console"},"kubectl --context kind-platform get postgreses.example.promise.syntasso.io\n")),(0,l.kt)("br",null),(0,l.kt)("p",null,"The above command will give an output similar to"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-console"},"NAME                    AGE\n#highlight-start\nacid-minimal-cluster    1m\n#highlight-end\n")),(0,l.kt)("p",null,"Each request needs to be delivered through the pipeline defined by the platform team. If you want to peak at what is happening, you can use the following command"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-console"},"kubectl --context kind-platform get pods --watch\n")),(0,l.kt)("p",null,"This will result in a similar output to below:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-console"},"NAME                                                     READY   STATUS      RESTARTS   AGE\n#highlight-start\nrequest-pipeline-ha-postgres-promise-default-266c2       0/1     Completed   0          1m\nrequest-pipeline-knative-serving-promise-default-4ffed   0/1     Completed   0          1m\n#highlight-end\n")),(0,l.kt)("br",null),(0,l.kt)("p",null,"These pipelines configure your resources in an opinionated way. Including setting the replicas for postgres to two. To verify your Postgres cluster (named per the Resource Request name, ",(0,l.kt)("code",null,"acid-minimal"),") is up and running you can use the following command.",(0,l.kt)("br",null)),":::note This may take a few minutes so ",(0,l.kt)("code",null,"--watch")," will watch the command. Press ",(0,l.kt)("kbd",null,"Ctrl"),"+",(0,l.kt)("kbd",null,"C")," to stop watching :::",(0,l.kt)("br",null),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-console"},"kubectl --context kind-worker get pods --watch\n")),(0,l.kt)("p",null,"The above command will give an output similar to"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-console"},"NAME                                      READY   STATUS    RESTARTS         AGE\n#highlight-start\nacid-minimal-cluster-0                    1/1     Running   0                5m\nacid-minimal-cluster-1                    1/1     Running   0                5m\n#highlight-end\npostgres-operator-6c6dbd4459-4jf5h        1/1     Running   0                10m\n")),(0,l.kt)("br",null),(0,l.kt)("p",null,"Verify that knative has also installed its networking resources into two new namespaces"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-console"},"kubectl --context kind-worker get namespaces\n")),(0,l.kt)("br",null),(0,l.kt)("p",null,"The above command will give an output similar to"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-console"},"NAME                   STATUS   AGE\ndefault                Active   5m\nflux-system            Active   5m\n#highlight-start\nknative-serving        Active   1m\nkourier-system         Active   1m\n#highlight-end\nkratix-worker-system   Active   3m\nkube-node-lease        Active   5m\nkube-public            Active   5m\nkube-system            Active   5m\nlocal-path-storage     Active   5m\n")),(0,l.kt)("br",null),(0,l.kt)("h4",{id:"run-the-application"},"Run the application"),(0,l.kt)("p",null,"With all the necessary resources available, you can now run your app using the just created services. In this step, you will deploy a ",(0,l.kt)("a",{parentName:"p",href:"https://github.com/syntasso/sample-golang-app"},"sample application")," that uses Postgres for persistence and knative for serving the application."),(0,l.kt)("p",null,"To deploy the app, run:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-console"},"kubectl --context kind-worker apply --filename https://raw.githubusercontent.com/syntasso/sample-golang-app/main/k8s/serving.yaml\n")),(0,l.kt)("admonition",{type:"note"},(0,l.kt)("p",{parentName:"admonition"},"It takes some time for Knative to get up and running. If you get a webhook-related error wait a few minutes\nbefore trying the command again.")),(0,l.kt)("h4",{id:"validate-deployment"},"Validate the deployment"),(0,l.kt)("p",null,"Verify that the Knative Service for the application is ready:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-console"},"kubectl --context kind-worker get services.serving.knative.dev\n")),(0,l.kt)("p",null,"The above command will give an output similar to"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-console"},"NAME   URL                             LATESTCREATED   LATESTREADY   READY   REASON\n#highlight-start\ntodo   http://todo.default.local.gd    todo-00001      todo-00001    True\n#highlight-end\n")),(0,l.kt)("br",null),(0,l.kt)("h4",{id:"test-app"},"Test the deployed application"),(0,l.kt)("p",null,"Now test the app."),(0,l.kt)("p",null,"On a separate terminal, you'll need to open access to the app by port-forwarding the kourier service:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-console"},"kubectl --context kind-worker --namespace kourier-system port-forward svc/kourier 8081:80\n")),(0,l.kt)("br",null),(0,l.kt)("p",null,"Now go to ",(0,l.kt)("a",{parentName:"p",href:"http://todo.default.local.gd:8081"},"http://todo.default.local.gd:8081")," to see the app running."),(0,l.kt)("h3",{id:"summary"},"Summary"),(0,l.kt)("p",null,"Your platform has pieced together two different Promises to provide a solution for an application team to deploy a new service using Knative and Postgres. Well done!"),(0,l.kt)("p",null,"To recap the steps we took:"),(0,l.kt)("ol",null,(0,l.kt)("li",{parentName:"ol"},"\u2705","\xa0","\xa0","Installed two Kratix Promises"),(0,l.kt)("li",{parentName:"ol"},"\u2705","\xa0","\xa0","Requested an instance of each Kratix Promise"),(0,l.kt)("li",{parentName:"ol"},"\u2705","\xa0","\xa0","Pushed an application to Knative that integrates with the instance of Postgres"),(0,l.kt)("li",{parentName:"ol"},"\u2705","\xa0","\xa0","Viewed our successfully running application!")),(0,l.kt)("p",null,"This is only the beginning of working with Promises. Next you will learn how to write a Promise."),(0,l.kt)("h2",{id:"--congratulations"},"\ud83c\udf89 ","\xa0"," Congratulations!"),(0,l.kt)("p",null,"\u2705","\xa0","\xa0"," You have deployed a web app that uses multiple Kratix Promises. ",(0,l.kt)("br",null),"\n\ud83d\udc49\ud83c\udffe","\xa0","\xa0"," Now you will ",(0,l.kt)("a",{parentName:"p",href:"writing-a-ci-promise"},"write your own Promise to provide CI-as-a-Service")))}c.isMDXComponent=!0},7137:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/kratix_diagrams-AppDev_Request-instances-a160c4ef58c315e303e05745c0b89f2e.jpg"},5354:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/kratix_diagrams-PlatformDev-Install_promises-453fe43880dbbe41de3be7f8ecf62a0c.jpg"},5621:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/kratix_diagrams-PlatformDev-Setup_environment-6270f5ad159d8ab3c459ff0c774f8c23.jpg"}}]);