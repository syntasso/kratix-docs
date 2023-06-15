"use strict";(self.webpackChunkkratix_docs=self.webpackChunkkratix_docs||[]).push([[5849],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>k});var a=n(7294);function l(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){l(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,l=function(e,t){if(null==e)return{};var n,a,l={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(l[n]=e[n]);return l}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(l[n]=e[n])}return l}var i=a.createContext({}),p=function(e){var t=a.useContext(i),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},u=function(e){var t=p(e.components);return a.createElement(i.Provider,{value:t},e.children)},c="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var n=e.components,l=e.mdxType,r=e.originalType,i=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),c=p(n),d=l,k=c["".concat(i,".").concat(d)]||c[d]||m[d]||r;return n?a.createElement(k,o(o({ref:t},u),{},{components:n})):a.createElement(k,o({ref:t},u))}));function k(e,t){var n=arguments,l=t&&t.mdxType;if("string"==typeof e||l){var r=n.length,o=new Array(r);o[0]=d;var s={};for(var i in t)hasOwnProperty.call(t,i)&&(s[i]=t[i]);s.originalType=e,s[c]="string"==typeof e?e:l,o[1]=s;for(var p=2;p<r;p++)o[p]=n[p];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},4205:(e,t,n)=>{n.d(t,{ZP:()=>o});var a=n(7462),l=(n(7294),n(3905));const r={toc:[]};function o(e){let{components:t,...n}=e;return(0,l.kt)("wrapper",(0,a.Z)({},r,n,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("p",null,"Before moving on, please clean up your environment by deleting the current Promises and Resource Requests.\nKratix will, by default, clean up any Resource Requests when the parent Promise is deleted."),(0,l.kt)("p",null,"To delete all the Promises, run:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"kubectl --context $PLATFORM delete promises --all\n")),(0,l.kt)("p",null,"The above command will give an output similar to:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-shell-session"},"promise.platform.kratix.io/elastic-cloud deleted\n")))}o.isMDXComponent=!0},4051:(e,t,n)=>{n.d(t,{ZP:()=>o});var a=n(7462),l=(n(7294),n(3905));const r={toc:[{value:"Pre-requisites",id:"pre-requisites",level:4}]};function o(e){let{components:t,...n}=e;return(0,l.kt)("wrapper",(0,a.Z)({},r,n,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("h4",{id:"pre-requisites"},"Pre-requisites"),(0,l.kt)("details",null,(0,l.kt)("summary",null,"You need an installation of Kratix for this section. ",(0,l.kt)("strong",null,"Click here")," for instructions"),(0,l.kt)("p",null,"The simplest way to do so is by running the quick-start script from within the\nKratix directory. The script will create two KinD clusters, install, and\nconfigure Kratix."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"./scripts/quick-start.sh --recreate\n")),(0,l.kt)("p",null,"You can run Kratix either with a multi-cluster or a single-cluster setup. The\ncommands on the remainder of this document assume that two environment variables\nare set:"),(0,l.kt)("ol",null,(0,l.kt)("li",{parentName:"ol"},(0,l.kt)("inlineCode",{parentName:"li"},"PLATFORM")," representing the Platform cluster Kubernetes context"),(0,l.kt)("li",{parentName:"ol"},(0,l.kt)("inlineCode",{parentName:"li"},"WORKER")," representing the Worker cluster Kubernetes context")),(0,l.kt)("p",null,"If you ran the quick-start script above, do:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},'export PLATFORM="kind-platform"\nexport WORKER="kind-worker"\n')),(0,l.kt)("p",null,"For single cluster setups, the two variables should be set to the same value.\nYou can find your cluster context by running:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"kubectl config get-contexts\n")),(0,l.kt)("p",null,"Refer back to ",(0,l.kt)("a",{parentName:"p",href:"../../category/installing-kratix"},"Installing Kratix")," for more\ndetails.")))}o.isMDXComponent=!0},837:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>m,contentTitle:()=>u,default:()=>h,frontMatter:()=>p,metadata:()=>c,toc:()=>d});var a=n(7462),l=(n(7294),n(3905)),r=n(4051);n(4205);const o=[{value:"Building a paved path using multiple Kratix Promises",id:"deploy",level:2},{value:"Steps",id:"steps",level:3},{value:"Install all required Promises",id:"install-all-promises",level:3},{value:"Request instances",id:"request-instances",level:3},{value:"Run the application deploy pipeline",id:"deploy-pipeline",level:4},{value:"Validate the deployment",id:"validate-deployment",level:3},{value:"Test the deployed application",id:"test-app",level:3},{value:"Summary",id:"summary",level:2},{value:"Clean up environment",id:"cleanup",level:2},{value:"\ud83c\udf89 \xa0 Congratulations!",id:"--congratulations",level:2}],s={toc:o};function i(e){let{components:t,...r}=e;return(0,l.kt)("wrapper",(0,a.Z)({},s,r,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"In this tutorial, you will")),(0,l.kt)("ol",null,(0,l.kt)("li",{parentName:"ol"},(0,l.kt)("a",{parentName:"li",href:"#power-of-promises"},"learn more about the power of Promises")),(0,l.kt)("li",{parentName:"ol"},(0,l.kt)("a",{parentName:"li",href:"#deploy"},"use Kratix Promises to build a paved path"))),(0,l.kt)("h1",{id:"power-of-promises"},"The power of Promises"),(0,l.kt)("p",null,"As covered previously, Promises are the building blocks that enable teams to design\nplatforms that specifically meet their customer needs. Through writing and extending\nPromises, Platform teams can raise the value line of the platform they provide.\nThey can use multiple simpler, low-level Promises to provide an experience tailored\nto their users needs."),(0,l.kt)("p",null,"Consider the task of setting up development environments for application teams.\nThis task is usually repetitive and requires many cookie-cutter steps. It may\ninvolve wiring up Git repos, spinning up a CI/CD server, creating a PaaS to run\nthe applications, instructing CI/CD to listen to the Git repos and push successful\nbuilds into the PaaS, and finally wiring applications to their required data services."),(0,l.kt)("p",null,"A Promise can encapsulate all the required steps and handle the toil of running\nthose low-level tasks. It can be designed as a single Promise that does it all,\nor it can be a collection of Promises that, combined, deliver the desired functionality."),(0,l.kt)("p",null,"Now you will see the power of Kratix Promises by deploying a web app that uses multiple Promises."),(0,l.kt)("br",null),(0,l.kt)("hr",null),(0,l.kt)("br",null),(0,l.kt)("h2",{id:"deploy"},"Building a paved path using multiple Kratix Promises"),(0,l.kt)("p",null,(0,l.kt)("img",{alt:"Overview",src:n(6711).Z,width:"8936",height:"5482"})),(0,l.kt)("h3",{id:"steps"},"Steps"),(0,l.kt)("ol",null,(0,l.kt)("li",{parentName:"ol"},(0,l.kt)("a",{parentName:"li",href:"#install-all-promises"},"Install Promises")),(0,l.kt)("li",{parentName:"ol"},(0,l.kt)("a",{parentName:"li",href:"#request-instances"},"Request instances")),(0,l.kt)("li",{parentName:"ol"},(0,l.kt)("a",{parentName:"li",href:"#deploy-pipeline"},"Run the deploy pipeline")),(0,l.kt)("li",{parentName:"ol"},(0,l.kt)("a",{parentName:"li",href:"#test-app"},"Test the application")),(0,l.kt)("li",{parentName:"ol"},(0,l.kt)("a",{parentName:"li",href:"#summary"},"Summary")),(0,l.kt)("li",{parentName:"ol"},(0,l.kt)("a",{parentName:"li",href:"#cleanup"},"Clean up environment"))),(0,l.kt)("h3",{id:"install-all-promises"},"Install all required Promises"),(0,l.kt)("p",null,"In order for an application team to deploy an application to a dev environment\nthey require a relational datastore (postgres), networking for user traffic (Nginx Ingress),\nand a CI/CD service for ongoing improvements (Jenkins). To deliver this functionality\non demand with Kratix install the required Promises on your Platform Cluster:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-console"},"kubectl --context $PLATFORM apply --filename https://raw.githubusercontent.com/syntasso/promise-postgresql/main/promise.yaml\nkubectl --context $PLATFORM apply --filename https://raw.githubusercontent.com/syntasso/kratix-marketplace/main/nginx-ingress/promise.yaml\nkubectl --context $PLATFORM apply --filename https://raw.githubusercontent.com/syntasso/kratix-marketplace/main/jenkins/promise.yaml\n")),(0,l.kt)("br",null),(0,l.kt)("p",null,"Verify the Promises are all installed on your Platform Cluster"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-console"},"kubectl --context $PLATFORM get promises\n")),(0,l.kt)("p",null,"The above command will give an output similar to"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-console"},"NAME           AGE\njenkins        1m\nnginx-ingress  1m\npostgresql     1m\n")),(0,l.kt)("br",null),(0,l.kt)("p",null,"Verify the CRDs are all installed on your Platform Cluster. Note that you now\nhave ",(0,l.kt)("inlineCode",{parentName:"p"},"jenkins")," and ",(0,l.kt)("inlineCode",{parentName:"p"},"postgres")," available (and no Nginx CRD; we will get to that later)."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-console"},"kubectl --context $PLATFORM get crds\n")),(0,l.kt)("p",null,"The above command will give an output similar to"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-console"},"NAME                                CREATED AT\nclusters.platform.kratix.io         2023-01-24T17:00:37Z\n#highlight-start\njenkins.marketplace.kratix.io       2023-01-24T17:22:50Z\npostgresqls.marketplace.kratix.io   2023-01-24T17:23:51Z\n#highlight-end\npromises.platform.kratix.io         2023-01-24T17:00:37Z\nworkplacements.platform.kratix.io   2023-01-24T17:00:37Z\nworks.platform.kratix.io            2023-01-24T17:00:37Z\n")),(0,l.kt)("br",null),(0,l.kt)("p",null,"Verify the ",(0,l.kt)("code",null,"workerClusterResources")," (more details in future steps) are installed on your Worker Cluster",(0,l.kt)("br",null)," ",(0,l.kt)("sub",null,"(This may take a few minutes so",(0,l.kt)("code",null,"--watch")," will watch the command. Press ",(0,l.kt)("kbd",null,"Ctrl"),"+",(0,l.kt)("kbd",null,"C")," to stop watching)")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-console"},"kubectl --context $WORKER get pods --watch\n")),(0,l.kt)("p",null,"The above command will give an output similar to"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-console"},"NAME                                 READY   STATUS    RESTARTS   AGE\njenkins-operator-6c89d97d4f-r474w    1/1     running   0          1m\nnginx-nginx-ingress-58c4dcb47d-tws   1/1     running   0          1m\npostgres-operator-7dccdbff7c-2hqhc   1/1     Running   0          1m\n")),(0,l.kt)("p",null,"As mentioned above, there is no CRD for the Nginx Ingress Promise. This Promise\nonly contains Worker Cluster Resources, it has no ",(0,l.kt)("inlineCode",{parentName:"p"},"xaasCrd")," or ",(0,l.kt)("inlineCode",{parentName:"p"},"xaasRequestPipeine"),".\nFor any software that you want installed by-default on your clusters and that don't\nrequire any per-instance requests you can just fill in only the ",(0,l.kt)("inlineCode",{parentName:"p"},"workerClusterResources"),"\nfields. Other good examples of this might be running Observability stacks, e.g.\nPrometheus or a Service Mesh, e.g. Istio."),(0,l.kt)("br",null),(0,l.kt)("h3",{id:"request-instances"},"Request instances"),(0,l.kt)("p",null,(0,l.kt)("img",{alt:"Overview-instances",src:n(1666).Z,width:"8292",height:"5908"})),(0,l.kt)("p",null,"Submit a set of Kratix Resource Requests to get a\nJenkins instance and a Postgres database."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-console"},"kubectl --context $PLATFORM apply --filename https://raw.githubusercontent.com/syntasso/promise-postgresql/main/resource-request.yaml\nkubectl --context $PLATFORM apply --filename https://raw.githubusercontent.com/syntasso/kratix-marketplace/main/jenkins/resource-request.yaml\n")),(0,l.kt)("br",null),(0,l.kt)("p",null,"By requesting these two resources, you will start two pods, one for the Jenkins server (named ",(0,l.kt)("code",null,"jenkins-dev-example"),"), and another which create a Postgres cluster (named per the Resource Request name,",(0,l.kt)("code",null,"acid-example-postgresql"),"). To verify you have all the necessary resources up and running",(0,l.kt)("br",null)," ",(0,l.kt)("sub",null,"(This may take a few minutes so ",(0,l.kt)("code",null,"--watch"),"will watch the command. Press ",(0,l.kt)("kbd",null,"Ctrl"),"+",(0,l.kt)("kbd",null,"C")," to stop watching)")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-console"},"kubectl --context $WORKER get pods --watch\n")),(0,l.kt)("p",null,"The above command will give an output similar to"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-console"},"NAME                                READY   STATUS      RESTARTS   AGE\nacid-example-postgresql-0           1/1     Running     0          5m\njenkins-dev-example                 1/1     Running     0          5m\n...\n")),(0,l.kt)("br",null),(0,l.kt)("p",null,"Verify that the Kratix Resource Request was issued on the Platform Cluster."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-console"},"kubectl --context $PLATFORM get jenkins.marketplace.kratix.io\n")),(0,l.kt)("br",null),(0,l.kt)("p",null,"The above command will give an output similar to"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-console"},"NAME          Status\nexample       Resource Requested\n")),(0,l.kt)("br",null),(0,l.kt)("h4",{id:"deploy-pipeline"},"Run the application deploy pipeline"),(0,l.kt)("p",null,"With all the necessary resources available, you will now change hats to be a\npart of the application team who can now design and run their own CI/CD\npipeline using the provided Jenkins service. In this step, you will deploy a\n",(0,l.kt)("a",{parentName:"p",href:"https://github.com/syntasso/sample-golang-app"},"sample application")," through a\nJenkins pipeline, that uses Postgres for persistence and Nginx for serving\nthe application."),(0,l.kt)("p",null,"First, create a service account on the Worker cluster, so Jenkins can create\nDeployments from the pipeline:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"kubectl --context $WORKER apply -f \\\n    https://raw.githubusercontent.com/syntasso/sample-golang-app/main/k8s/service-account.yaml\n")),(0,l.kt)("br",null),(0,l.kt)("p",null,"To access the Jenkins UI in the browser, first take note of the credentials by\nrunning the commands below:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-console",metastring:'jsx title="username"',jsx:!0,title:'"username"'},"kubectl --context $WORKER get secret jenkins-operator-credentials-dev-example \\\n    -o 'jsonpath={.data.user}' | base64 -d\n")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-console",metastring:'jsx title="password"',jsx:!0,title:'"password"'},"kubectl --context $WORKER get secret jenkins-operator-credentials-dev-example \\\n    -o 'jsonpath={.data.password}' | base64 -d\n")),(0,l.kt)("br",null),(0,l.kt)("p",null,"Port forward for browser access to the Jenkins UI:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-console"},"kubectl --context $WORKER port-forward jenkins-dev-example 8080:8080\n")),(0,l.kt)("br",null),(0,l.kt)("p",null,"Navigate to ",(0,l.kt)("a",{parentName:"p",href:"http://localhost:8080"},"http://localhost:8080")," and log in with the credentials."),(0,l.kt)("p",null,"In the Jenkins UI, create a new pipeline using this\n",(0,l.kt)("a",{parentName:"p",href:"https://raw.githubusercontent.com/syntasso/sample-golang-app/main/ci/Jenkinsfile"},"Jenkinsfile"),"\nand execute it."),(0,l.kt)("p",null,"For those that are less familiar with Jenkins, you can either expand the instructions\nbelow or watch the video to see how to navigate the UI for this task."),(0,l.kt)("details",null,(0,l.kt)("summary",null,"Configuring a Jenkins Pipeline"),(0,l.kt)("ol",null,(0,l.kt)("li",{parentName:"ol"},"From the ",(0,l.kt)("em",{parentName:"li"},"Dashboard")," page, click ",(0,l.kt)("em",{parentName:"li"},"New Item")," in the left menu"),(0,l.kt)("li",{parentName:"ol"},"Enter a name for the pipeline, e.g. ",(0,l.kt)("inlineCode",{parentName:"li"},"todo-app-pipeline")),(0,l.kt)("li",{parentName:"ol"},"Select ",(0,l.kt)("em",{parentName:"li"},"Pipeline")," from the ",(0,l.kt)("em",{parentName:"li"},"Select item type")," dropdown"),(0,l.kt)("li",{parentName:"ol"},"Click ",(0,l.kt)("em",{parentName:"li"},"OK")),(0,l.kt)("li",{parentName:"ol"},"Scroll to the ",(0,l.kt)("em",{parentName:"li"},"Pipeline")," section"),(0,l.kt)("li",{parentName:"ol"},"Paste the contents of the ",(0,l.kt)("a",{parentName:"li",href:"https://raw.githubusercontent.com/syntasso/sample-golang-app/main/ci/Jenkinsfile"},"Jenkinsfile")," in the ",(0,l.kt)("em",{parentName:"li"},"Script")," field"),(0,l.kt)("li",{parentName:"ol"},"Click ",(0,l.kt)("em",{parentName:"li"},"Save")),(0,l.kt)("li",{parentName:"ol"},"Click ",(0,l.kt)("em",{parentName:"li"},"Build Now")," in the left menu"),(0,l.kt)("li",{parentName:"ol"},"Click on the running build"),(0,l.kt)("li",{parentName:"ol"},"Click ",(0,l.kt)("em",{parentName:"li"},"Console Output")," to see the pipeline progress"))),(0,l.kt)("div",{style:{"text-align":"center"}},(0,l.kt)("video",{src:"https://user-images.githubusercontent.com/201163/175933452-853af525-7fff-4dca-9ba9-032c07c8c393.mov","data-canonical-src":"https://user-images.githubusercontent.com/201163/175933452-853af525-7fff-4dca-9ba9-032c07c8c393.mov",controls:"controls",muted:"muted",style:{"max-height":"500px"}})),(0,l.kt)("h3",{id:"validate-deployment"},"Validate the deployment"),(0,l.kt)("p",null,"Verify that the ",(0,l.kt)("inlineCode",{parentName:"p"},"todo")," deployment is ready:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-console"},"kubectl --context $WORKER get pods\n")),(0,l.kt)("p",null,"The above command will give an output similar to"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-console"},"NAME                                   READY   STATUS    RESTARTS   AGE\nacid-example-postgresql-0              1/1     Running   0          158m\njenkins-dev-example                    1/1     Running   0          157m\njenkins-operator-7f58798d5c-ph9dh      1/1     Running   0          3h\nnginx-nginx-ingress-58c4dcb47d-twwqs   1/1     Running   0          3h\npostgres-operator-79754946d-pn45n      1/1     Running   0          3h\n#highlight-start\ntodo-58896c88d5-5txdl                  1/1     Running   0          2m55s\n#highlight-end\n")),(0,l.kt)("br",null),(0,l.kt)("h3",{id:"test-app"},"Test the deployed application"),(0,l.kt)("p",null,"Now test the app. Navigate to ",(0,l.kt)("a",{parentName:"p",href:"http://todo.local.gd:31338"},"http://todo.local.gd:31338"),"\nto see the app running. "),(0,l.kt)("details",null,(0,l.kt)("summary",null," If you have setup your clusters not using KinD then ",(0,l.kt)("strong",null,"Click here "),"for instructions on how to access the app "),(0,l.kt)("ol",null,(0,l.kt)("li",{parentName:"ol"},"Setup a port-forward to Nginx:",(0,l.kt)("pre",{parentName:"li"},(0,l.kt)("code",{parentName:"pre",className:"language-console"}," kubectl --context $WORKER port-forward svc/nginx-nginx-ingress 31338:80\n"))),(0,l.kt)("li",{parentName:"ol"},"Curl the endpoint with the Host header set",(0,l.kt)("pre",{parentName:"li"},(0,l.kt)("code",{parentName:"pre",className:"language-console"},' curl -s -H "host: todo.local.gd" localhost:31338\n')),"Alternatively navigate to localhost:31338 in the browser and use a plugin (e.g.\n",(0,l.kt)("a",{parentName:"li",href:"https://chrome.google.com/webstore/detail/modheader-modify-http-hea/idgpnmonknjnojddfkpgkljpfnnfcklj"},"ModHeader"),')\nto set the Host header to "todo.local.gd"'))),(0,l.kt)("h2",{id:"summary"},"Summary"),(0,l.kt)("p",null,"Your platform has pieced together three different Promises to provide a complete\nsolution for an application team to deploy a new service to dev using your suggested\nCI/CD and hosting solutions. Well done!"),(0,l.kt)("p",null,"To recap the steps we took:"),(0,l.kt)("ol",null,(0,l.kt)("li",{parentName:"ol"},"\u2705","\xa0","\xa0","Installed all three Kratix Promises"),(0,l.kt)("li",{parentName:"ol"},"\u2705","\xa0","\xa0","Requested an instance of each Kratix Promise"),(0,l.kt)("li",{parentName:"ol"},"\u2705","\xa0","\xa0","Created and run a CI/CD pipeline for a new application"),(0,l.kt)("li",{parentName:"ol"},"\u2705","\xa0","\xa0","Viewed an endpoint from a newly deployed and networked application")),(0,l.kt)("p",null,"This is only the beginning of working with Promises. Next you will learn how to\nwrite and update Promises, and in the final thoughts we will showcase the composability\nof Promises to further optimise this workflow from three requests down to one."),(0,l.kt)("h2",{id:"cleanup"},"Clean up environment"),(0,l.kt)("p",null,"To clean up your environment first delete the Resource Requests for the Jenkins, Nginx and Postgres Promises."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-console"},"kubectl --context $PLATFORM delete jenkins,postgresqls --all\n")),(0,l.kt)("p",null,"Verify the resources belonging to the Resource Requests have been deleted in the Worker Cluster"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-console"},"kubectl --context $WORKER get pods,namespaces\n")),(0,l.kt)("p",null,"Now all the Resource Requests have been deleted you can delete the Promises"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-console"},"kubectl --context $PLATFORM delete promises --all\n")),(0,l.kt)("p",null,"Verify the Worker Cluster resources are deleted from the Worker Cluster"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-console"},"kubectl --context $WORKER get pods\n")),(0,l.kt)("p",null,"Finally, remove the app artefacts"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-console"},"kubectl --context $WORKER delete -f https://raw.githubusercontent.com/syntasso/sample-golang-app/workshop-refactor/k8s/service-account.yaml\nkubectl --context $WORKER delete -f https://raw.githubusercontent.com/syntasso/sample-golang-app/workshop-refactor/k8s/app.yaml\n")),(0,l.kt)("br",null),(0,l.kt)("h2",{id:"--congratulations"},"\ud83c\udf89 ","\xa0"," Congratulations!"),(0,l.kt)("p",null,"\u2705","\xa0","\xa0"," You have deployed a web app that uses multiple Kratix Promises. ",(0,l.kt)("br",null),"\n\ud83d\udc49\ud83c\udffe","\xa0","\xa0"," Now you will ",(0,l.kt)("a",{parentName:"p",href:"writing-a-promise"},"write your own Jenkins Promise to learn more about how Kratix Promises work"),"."))}i.isMDXComponent=!0;const p={description:"Guide on how one can use multiple Promises to deliver developer experiences",title:"Using Multiple Promises"},u=void 0,c={unversionedId:"main/guides/multiple-promises",id:"main/guides/multiple-promises",title:"Using Multiple Promises",description:"Guide on how one can use multiple Promises to deliver developer experiences",source:"@site/docs/main/04-guides/03-multiple-promises.md",sourceDirName:"main/04-guides",slug:"/main/guides/multiple-promises",permalink:"/docs/main/guides/multiple-promises",draft:!1,editUrl:"https://github.com/syntasso/kratix-docs/tree/main/docs/main/04-guides/03-multiple-promises.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{description:"Guide on how one can use multiple Promises to deliver developer experiences",title:"Using Multiple Promises"},sidebar:"mainSidebar",previous:{title:"Installing and using a Promise",permalink:"/docs/main/guides/installing-a-promise"},next:{title:"Writing a Promise",permalink:"/docs/main/guides/writing-a-promise"}},m={},d=[...o],k={toc:d};function h(e){let{components:t,...n}=e;return(0,l.kt)("wrapper",(0,a.Z)({},k,n,{components:t,mdxType:"MDXLayout"}),(0,l.kt)(r.ZP,{mdxType:"PartialPreRequisites"}),(0,l.kt)(i,{mdxType:"UsingMultiplePromise"}))}h.isMDXComponent=!0},1666:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/Treasure_Trove-Get_instances_of_multiple_Promises-b5cd6456c130d09e85a5933c392438e6.jpeg"},6711:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/Treasure_Trove-Install_Multiple_Promises-2dc0bec6cf2877f5e29cac47c1c65d04.jpeg"}}]);