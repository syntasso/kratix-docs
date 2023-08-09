"use strict";(self.webpackChunkkratix_docs=self.webpackChunkkratix_docs||[]).push([[7277],{3905:(e,t,r)=>{r.d(t,{Zo:()=>c,kt:()=>g});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function s(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?s(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):s(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},s=Object.keys(e);for(n=0;n<s.length;n++)r=s[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(n=0;n<s.length;n++)r=s[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var i=n.createContext({}),u=function(e){var t=n.useContext(i),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},c=function(e){var t=u(e.components);return n.createElement(i.Provider,{value:t},e.children)},p="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,s=e.originalType,i=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),p=u(r),d=a,g=p["".concat(i,".").concat(d)]||p[d]||m[d]||s;return r?n.createElement(g,o(o({ref:t},c),{},{components:r})):n.createElement(g,o({ref:t},c))}));function g(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var s=r.length,o=new Array(s);o[0]=d;var l={};for(var i in t)hasOwnProperty.call(t,i)&&(l[i]=t[i]);l.originalType=e,l[p]="string"==typeof e?e:a,o[1]=l;for(var u=2;u<s;u++)o[u]=r[u];return n.createElement.apply(null,o)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},6892:(e,t,r)=>{r.d(t,{ZP:()=>o});var n=r(7462),a=(r(7294),r(3905));const s={toc:[]};function o(e){let{components:t,...r}=e;return(0,a.kt)("wrapper",(0,n.Z)({},s,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Once Kratix is installed, you can register Kubernetes clusters where workloads should run.\nOn single cluster installations, the same cluster performs the role of the Platform and\nthe Worker clusters. The commands below will register the cluster as a Destination, as well as configure\nFluxCD to watch for the cluster's ",(0,a.kt)("a",{parentName:"p",href:"/docs/main/reference/statestore/intro"},"State Store"),":"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"kubectl apply --filename https://raw.githubusercontent.com/syntasso/kratix/main/distribution/single-cluster/config-all-in-one.yaml\n")))}o.isMDXComponent=!0},1755:(e,t,r)=>{r.d(t,{ZP:()=>o});var n=r(7462),a=(r(7294),r(3905));const s={toc:[]};function o(e){let{components:t,...r}=e;return(0,a.kt)("wrapper",(0,n.Z)({},s,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Install Kratix and its Dependencies with the command below:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"kubectl apply --filename https://raw.githubusercontent.com/syntasso/kratix/main/distribution/single-cluster/install-all-in-one.yaml\n")),(0,a.kt)("p",null,"The above will install Kratix, MinIO, and FluxCD. MinIO will be the ",(0,a.kt)("a",{parentName:"p",href:"/docs/main/reference/statestore/intro"},"State Store"),"\nfor the Kratix to write to and FluxCD will watch the MinIO Bucket for any changes that need to be applied to\nthe cluster. Kratix supports a variety of ",(0,a.kt)("a",{parentName:"p",href:"/docs/main/reference/statestore/intro"},"State Stores"),"\nand multiple different State Stores can be used."))}o.isMDXComponent=!0},8545:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>c,contentTitle:()=>i,default:()=>d,frontMatter:()=>l,metadata:()=>u,toc:()=>p});var n=r(7462),a=(r(7294),r(3905)),s=r(1755),o=r(6892);const l={description:"Quickest way to test Kratix",title:"Quick Start",sidebar_label:"Quick Start"},i=void 0,u={unversionedId:"main/quick-start",id:"main/quick-start",title:"Quick Start",description:"Quickest way to test Kratix",source:"@site/docs/main/03-quick-start.md",sourceDirName:"main",slug:"/main/quick-start",permalink:"/docs/main/quick-start",draft:!1,editUrl:"https://github.com/syntasso/kratix-docs/tree/main/docs/main/03-quick-start.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{description:"Quickest way to test Kratix",title:"Quick Start",sidebar_label:"Quick Start"},sidebar:"mainSidebar",previous:{title:"The Value of Kratix",permalink:"/docs/main/value-of-kratix"},next:{title:"Guides",permalink:"/docs/category/guides"}},c={},p=[{value:"Prerequisite: Kubernetes cluster",id:"prerequisite-kubernetes-cluster",level:2},{value:"1. Install Kratix",id:"1-install-kratix",level:2},{value:"Configure",id:"configure",level:3},{value:"2. Provide Postgres-as-a-Service via a Kratix Promise",id:"2-provide-postgres-as-a-service-via-a-kratix-promise",level:2},{value:"3. Self serve a Postgres",id:"3-self-serve-a-postgres",level:2},{value:"Clean up",id:"clean-up",level:2},{value:"\ud83c\udf89 Congratulations!",id:"-congratulations",level:2}],m={toc:p};function d(e){let{components:t,...r}=e;return(0,a.kt)("wrapper",(0,n.Z)({},m,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"One of the most powerful features of Kratix is its ability to handle requests for\nResources, and deploy them to a specific remote location, Kubernetes or otherwise. However, Kratix also works well\nin a single Kubernetes cluster environment. This quick-start guide will walk you through the steps to\ninstall Kratix on a single cluster."),(0,a.kt)("h2",{id:"prerequisite-kubernetes-cluster"},"Prerequisite: Kubernetes cluster"),(0,a.kt)("p",null,"Kratix requires a Kubernetes cluster to run. If you don't already have a cluster, we\nrecommend starting with a local cluster tool like\n",(0,a.kt)("a",{parentName:"p",href:"https://kind.sigs.k8s.io/docs/user/quick-start/"},"KinD")," or\n",(0,a.kt)("a",{parentName:"p",href:"https://minikube.sigs.k8s.io/docs/start/"},"minikube"),"."),(0,a.kt)("h2",{id:"1-install-kratix"},"1. Install Kratix"),(0,a.kt)(s.ZP,{mdxType:"PartialInstall"}),(0,a.kt)("h3",{id:"configure"},"Configure"),(0,a.kt)(o.ZP,{mdxType:"PartialConfigure"}),(0,a.kt)("p",null,"Once the system reconciles, the Kratix resources should now be visible on your\ncluster. You can verify its readiness by observing the ",(0,a.kt)("inlineCode",{parentName:"p"},"kratix-worker-system")," namespace\nappearing in the cluster (it may take a couple of minutes):"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell-session"},"$ kubectl get namespace kratix-worker-system\nNAME                   STATUS   AGE\nkratix-worker-system   Active   1m\n")),(0,a.kt)("h2",{id:"2-provide-postgres-as-a-service-via-a-kratix-promise"},"2. Provide Postgres-as-a-Service via a Kratix Promise"),(0,a.kt)("p",null,"Install the sample Postgres Promise with the command below:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"kubectl apply --filename https://raw.githubusercontent.com/syntasso/promise-postgresql/main/promise.yaml\n")),(0,a.kt)("p",null,"Installing the Promise will eventually start the Postgres Operator on your cluster. You\ncan verify by running:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-console"},"kubectl get pods\n")),(0,a.kt)("p",null,"It may take a few seconds, but you should eventually see something similar to:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-console"},"NAME                                 READY   STATUS    RESTARTS   AGE\npostgres-operator-7dccdbff7c-2hqhc   1/1     Running   0          1m\n")),(0,a.kt)("h2",{id:"3-self-serve-a-postgres"},"3. Self serve a Postgres"),(0,a.kt)("p",null,"Once the Postgres Operator is up and running, you can request a new Postgres Resource with\nthe command below:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-console"},"kubectl apply --filename https://raw.githubusercontent.com/syntasso/promise-postgresql/main/resource-request.yaml\n")),(0,a.kt)("p",null,"You can verify the Pipeline pod by running:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell-session"},"$ kubectl get pods\nNAME                                          READY   STATUS      RESTARTS   AGE\n//highlight-next-line\nconfigure-pipeline-postgresql-default-8f012     0/1     Completed   0          72s\npostgres-operator-6c6dbd4459-pbcjp            1/1     Running     0          6m55s\n")),(0,a.kt)("p",null,"Eventually, the Postgres pods will come up as well:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell-session"},"$ kubectl get pods\nNAME                                         READY   STATUS      RESTARTS   AGE\n//highlight-start\nacid-example-postgresql-0                    1/1     Running     0          113s\n//highlight-end\npostgres-operator-6c6dbd4459-pbcjp           1/1     Running     0          6m55s\nconfigure-pipeline-postgresql-default-8f012    0/1     Completed   0          2m17s\n")),(0,a.kt)("p",null,"You are now ready to use your Postgres Resources! To validate, you can run:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"kubectl exec -it acid-example-postgresql-0 -- sh -c \"\n    PGPASSWORD=$(kubectl get secret postgres.acid-example-postgresql.credentials.postgresql.acid.zalan.do -o 'jsonpath={.data.password}' | base64 -d) \\\n    PGUSER=$(kubectl get secret postgres.acid-example-postgresql.credentials.postgresql.acid.zalan.do -o 'jsonpath={.data.username}' | base64 -d) \\\n    psql bestdb\"\n")),(0,a.kt)("h2",{id:"clean-up"},"Clean up"),(0,a.kt)("p",null,"To clean up the created resources, run:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-console"},"kubectl delete --filename https://raw.githubusercontent.com/syntasso/promise-postgresql/main/promise.yaml\nkubectl delete --filename https://raw.githubusercontent.com/syntasso/kratix/main/distribution/single-cluster/install-all-in-one.yaml\n")),(0,a.kt)("h2",{id:"-congratulations"},"\ud83c\udf89 Congratulations!"),(0,a.kt)("p",null,"You have successfully installed Kratix and used it to deliver Postgres-as-a-Service to\nyour platform. Check out our ",(0,a.kt)("a",{parentName:"p",href:"/docs/category/guides"},"guides")," to learn more about Kratix\ncapabilities."))}d.isMDXComponent=!0}}]);