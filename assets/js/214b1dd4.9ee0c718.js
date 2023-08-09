"use strict";(self.webpackChunkkratix_docs=self.webpackChunkkratix_docs||[]).push([[3795],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>h});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),c=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},u=function(e){var t=c(e.components);return r.createElement(l.Provider,{value:t},e.children)},p="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,l=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),p=c(n),m=a,h=p["".concat(l,".").concat(m)]||p[m]||d[m]||i;return n?r.createElement(h,o(o({ref:t},u),{},{components:n})):r.createElement(h,o({ref:t},u))}));function h(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=m;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[p]="string"==typeof e?e:a,o[1]=s;for(var c=2;c<i;c++)o[c]=n[c];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},9627:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>o,default:()=>p,frontMatter:()=>i,metadata:()=>s,toc:()=>c});var r=n(7462),a=(n(7294),n(3905));const i={description:"Guide on how to register a new Worker with Kratix",title:"Adding a new Worker"},o=void 0,s={unversionedId:"main/guides/scheduling",id:"main/guides/scheduling",title:"Adding a new Worker",description:"Guide on how to register a new Worker with Kratix",source:"@site/docs/main/04-guides/07-scheduling.md",sourceDirName:"main/04-guides",slug:"/main/guides/scheduling",permalink:"/docs/main/guides/scheduling",draft:!1,editUrl:"https://github.com/syntasso/kratix-docs/tree/main/docs/main/04-guides/07-scheduling.md",tags:[],version:"current",sidebarPosition:7,frontMatter:{description:"Guide on how to register a new Worker with Kratix",title:"Adding a new Worker"},sidebar:"mainSidebar",previous:{title:"Enhancing a Promise",permalink:"/docs/main/guides/enhancing-a-promise"},next:{title:"Compound Promise",permalink:"/docs/main/guides/compound-promises"}},l={},c=[{value:"Pre-requisites",id:"pre-requisites",level:2},{value:"Preparing the new cluster",id:"preparing-the-new-cluster",level:2},{value:"Registering the Destination",id:"registering-the-destination",level:2},{value:"\ud83c\udf89 Congratulations",id:"-congratulations",level:2}],u={toc:c};function p(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"One of the most powerful features of Kratix is its ability to react when new Workers are added to the platform. By default, any Promise installed into Kratix will schedule it's Dependencies to new clusters joining the platform."),(0,a.kt)("h2",{id:"pre-requisites"},"Pre-requisites"),(0,a.kt)("p",null,"In this section, we will register a new Kubernetes cluster as a Destination with Kratix, and\nverify its multi-cluster capabilities. Before continuing, you will need a Platform\nKubernetes cluster running Kratix, and a second worker Kubernetes cluster to\nregister with the Platform. You also need at least one Promise installed on\nthe Platform."),(0,a.kt)("p",null,"For the context of this guide, we will assume the setup from ",(0,a.kt)("a",{parentName:"p",href:"./installing-kratix"},"Installing Kratix\nwith KinD")," and that the following environment variables are\nset:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},'export PLATFORM="kind-platform"\nexport WORKER="kind-worker"\n')),(0,a.kt)("p",null,"We will also use the ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/syntasso/kratix-marketplace/tree/main/jenkins"},"Jenkins\nPromise")," as an\nexample. Follow ",(0,a.kt)("a",{parentName:"p",href:"./installing-a-promise"},"Installing a Promise")," to get Jenkins\ninstalled, if needed."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell-session"},"$ kubectl --context $PLATFORM get destinations.platform.kratix.io\nNAME               AGE\nworker-cluster-1   1h\n\n$ kubectl --context $PLATFORM get promises.platform.kratix.io\nNAME              AGE\njenkins-promise   1h\n")),(0,a.kt)("p",null,"On the worker, you should see the Jenkins Operator running:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell-session"},"$ kubectl --context $WORKER get pods\nNAME                                READY   STATUS    RESTARTS   AGE\njenkins-operator-778d6fc487-gczpb   1/1     Running   0          1h\n")),(0,a.kt)("p",null,"If your setup is different, update the commands accordingly."),(0,a.kt)("h2",{id:"preparing-the-new-cluster"},"Preparing the new cluster"),(0,a.kt)("p",null,"You will now add a new cluster to the Platform as a Destination and watch Kratix reconcile the\nsystem. For that, you need to first create the new Kubernetes cluster:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},'kind create destination --image kindest/node:v1.24.0 --name worker-cluster-2\nexport WORKER_2="kind-worker-cluster-2"\n')),(0,a.kt)("p",null,"Next, install the GitOps toolkit and create the necessary GitOps resources on the new worker cluster. The quickest\nway to do that is to run the ",(0,a.kt)("inlineCode",{parentName:"p"},"./scripts/install-gitops")," script from the Kratix root\ndirectory:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"cd /path/to/kratix\n./scripts/install-gitops --context ${WORKER_2} --path worker-cluster-2\n")),(0,a.kt)("h2",{id:"registering-the-destination"},"Registering the Destination"),(0,a.kt)("p",null,"You can now register your cluster with Kratix as a Destination. Create a file called ",(0,a.kt)("inlineCode",{parentName:"p"},"worker-cluster-2.yaml")," with the\nfollowing contents:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-yaml",metastring:'title="worker-cluster-2.yaml"',title:'"worker-cluster-2.yaml"'},"apiVersion: platform.kratix.io/v1alpha1\nkind: Destination\nmetadata:\n  name: worker-cluster-2\n  labels:\n    environment: dev\nspec:\n  stateStoreRef:\n    name: default\n    kind: BucketStateStore\n")),(0,a.kt)("p",null,"The Destination will using the pre-existing MinIO ",(0,a.kt)("a",{parentName:"p",href:"/docs/main/reference/statestore/intro"},"State Store"),".\nApply the Destination document to the Platform cluster:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"kubectl --context $PLATFORM apply --filename worker-cluster-2.yaml\n")),(0,a.kt)("p",null,"Check the Destination was created:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell-session",metastring:"{4}","{4}":!0},"$ kubectl --context $PLATFORM get destinations.platform.kratix.io\nNAME               AGE\nworker-cluster-1   1h\nworker-cluster-2   1h\n")),(0,a.kt)("p",null,"Kratix will react to the new Destination by scheduling the installation of the Jenkins Promise\nto the the correct bucket. After a couple of minutes, you should see the Jenkins Operator\nrunning on the new worker cluster:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell-session",metastring:"{3}","{3}":!0},"$ kubectl --context ${WORKER_2} get pods\nNAME                                READY   STATUS    RESTARTS   AGE\njenkins-operator-778d6fc487-c9w8f   1/1     Running   0          1h\n")),(0,a.kt)("p",null,"When you request a new Jenkins, the Resources will be created in one of the available Destinations, by default this is selected in a non-deterministic way."),(0,a.kt)("p",null,"For further documentation on Destination Scheduling, check the ",(0,a.kt)("a",{parentName:"p",href:"../reference/destinations/intro"},"Destination Reference\ndocumentation")),(0,a.kt)("admonition",{type:"info"},(0,a.kt)("p",{parentName:"admonition"},"If you are specifically interested in making a Resource location deterministic, you can check out the ",(0,a.kt)("a",{parentName:"p",href:"/docs/main/reference/multicluster-management#workloads"},"scheduling workloads")," reference.")),(0,a.kt)("h2",{id:"-congratulations"},"\ud83c\udf89 Congratulations"),(0,a.kt)("p",null,"\u2705","\xa0","\xa0"," You have created and registered a new Destination and watched the system react to it.",(0,a.kt)("br",null),"\n\ud83d\udc49\ud83c\udffe","\xa0","\xa0"," Let's ",(0,a.kt)("a",{parentName:"p",href:"./compound-promises"},"write compound Promises"),"."))}p.isMDXComponent=!0}}]);