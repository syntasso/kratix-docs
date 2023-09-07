"use strict";(self.webpackChunkkratix_docs=self.webpackChunkkratix_docs||[]).push([[8799],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>g});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},l=Object.keys(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var o=a.createContext({}),c=function(e){var t=a.useContext(o),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},u=function(e){var t=c(e.components);return a.createElement(o.Provider,{value:t},e.children)},p="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,l=e.originalType,o=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),p=c(n),d=r,g=p["".concat(o,".").concat(d)]||p[d]||m[d]||l;return n?a.createElement(g,i(i({ref:t},u),{},{components:n})):a.createElement(g,i({ref:t},u))}));function g(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=n.length,i=new Array(l);i[0]=d;var s={};for(var o in t)hasOwnProperty.call(t,o)&&(s[o]=t[o]);s.originalType=e,s[p]="string"==typeof e?e:r,i[1]=s;for(var c=2;c<l;c++)i[c]=n[c];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},9654:(e,t,n)=>{n.d(t,{ZP:()=>i});var a=n(7462),r=(n(7294),n(3905));const l={toc:[]};function i(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},l,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"Kratix requires ",(0,r.kt)("a",{parentName:"p",href:"https://cert-manager.io/"},"cert-manager")," to be installed in the\nPlatform cluster. If you already have it installed, skip to the\nnext section."),(0,r.kt)("p",null,"To install it, run:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"kubectl --context $PLATFORM apply --filename https://github.com/cert-manager/cert-manager/releases/download/v1.12.0/cert-manager.yaml\n")),(0,r.kt)("p",null,"Make sure that ",(0,r.kt)("inlineCode",{parentName:"p"},"cert-manager")," is ready before installing Kratix:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell-session"},"$ kubectl --context $PLATFORM get pods --namespace cert-manager\nNAME                                      READY   STATUS    RESTARTS   AGE\ncert-manager-7476c8fcf4-r8cnd             1/1     Running   0          19s\ncert-manager-cainjector-bdd866bd4-7d8zp   1/1     Running   0          19s\ncert-manager-webhook-5655dcfb4b-54r49     1/1     Running   0          19s\n")))}i.isMDXComponent=!0},6892:(e,t,n)=>{n.d(t,{ZP:()=>i});var a=n(7462),r=(n(7294),n(3905));const l={toc:[]};function i(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},l,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"Once Kratix is installed, you can register Kubernetes clusters where workloads should run.\nOn single cluster installations, the same cluster performs the role of the Platform and\nthe worker clusters. The commands below will register the cluster as a Destination, as well as configure\nFluxCD to watch for the cluster's ",(0,r.kt)("a",{parentName:"p",href:"/docs/main/reference/statestore/intro"},"State Store"),":"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"kubectl apply --filename https://raw.githubusercontent.com/syntasso/kratix/main/distribution/single-cluster/config-all-in-one.yaml\n")))}i.isMDXComponent=!0},1755:(e,t,n)=>{n.d(t,{ZP:()=>i});var a=n(7462),r=(n(7294),n(3905));const l={toc:[]};function i(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},l,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"Install Kratix and its Dependencies with the command below:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"kubectl apply --filename https://raw.githubusercontent.com/syntasso/kratix/main/distribution/single-cluster/install-all-in-one.yaml\n")),(0,r.kt)("p",null,"The above will install Kratix, MinIO, and FluxCD. MinIO will be the ",(0,r.kt)("a",{parentName:"p",href:"/docs/main/reference/statestore/intro"},"State Store"),"\nfor the Kratix to write to and FluxCD will watch the MinIO Bucket for any changes that need to be applied to\nthe cluster. Kratix supports a variety of ",(0,r.kt)("a",{parentName:"p",href:"/docs/main/reference/statestore/intro"},"State Stores"),"\nand multiple different State Stores can be used."))}i.isMDXComponent=!0},3951:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>c,default:()=>g,frontMatter:()=>o,metadata:()=>u,toc:()=>m});var a=n(7462),r=(n(7294),n(3905)),l=n(1755),i=n(6892),s=n(9654);const o={description:"Run Kratix on a Single cluster setup",title:"Single cluster"},c=void 0,u={unversionedId:"main/guides/installing-kratix/single-cluster",id:"main/guides/installing-kratix/single-cluster",title:"Single cluster",description:"Run Kratix on a Single cluster setup",source:"@site/docs/main/04-guides/01-installing-kratix/02-single-cluster.md",sourceDirName:"main/04-guides/01-installing-kratix",slug:"/main/guides/installing-kratix/single-cluster",permalink:"/docs/main/guides/installing-kratix/single-cluster",draft:!1,editUrl:"https://github.com/syntasso/kratix-docs/tree/main/docs/main/04-guides/01-installing-kratix/02-single-cluster.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{description:"Run Kratix on a Single cluster setup",title:"Single cluster"},sidebar:"mainSidebar",previous:{title:"Multi cluster",permalink:"/docs/main/guides/installing-kratix"},next:{title:"Installing and using a Promise",permalink:"/docs/main/guides/installing-a-promise"}},p={},m=[{value:"Bootstrap the cluster",id:"bootstrap-the-cluster",level:2},{value:"Install cert-manager",id:"install-cert-manager",level:2},{value:"Install Kratix",id:"install-kratix",level:2},{value:"Configure the Platform",id:"configure-the-platform",level:3}],d={toc:m};function g(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"One of the most powerful features of Kratix is its ability to handle requests\nfor Resources, and deploy them to a remote specific cluster. However, Kratix\nalso works well in a single cluster environment. This guide will walk you\nthrough the steps to install Kratix on a single cluster."),(0,r.kt)("h2",{id:"bootstrap-the-cluster"},"Bootstrap the cluster"),(0,r.kt)("p",null,"You will need access to a Kubernetes cluster to deploy Kratix. If you'd like to test Kratix in your local machine, you can create a cluster with ",(0,r.kt)("a",{parentName:"p",href:"https://minikube.sigs.k8s.io/docs/start/"},"minikube"),"."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"minikube start\n")),(0,r.kt)("h2",{id:"install-cert-manager"},"Install cert-manager"),(0,r.kt)(s.ZP,{mdxType:"PartialInstallCertManager"}),(0,r.kt)("h2",{id:"install-kratix"},"Install Kratix"),(0,r.kt)(l.ZP,{mdxType:"PartialInstall"}),(0,r.kt)("details",null,(0,r.kt)("summary",null,"Alternative install instructions"),(0,r.kt)("p",null,"To install Kratix and MinIO separately, run the commands below:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"# Install Kratix\nkubectl apply --filename https://raw.githubusercontent.com/syntasso/kratix/main/distribution/kratix.yaml\n\n# Install MinIO\nkubectl apply --filename https://raw.githubusercontent.com/syntasso/kratix/main/hack/platform/minio-install.yaml\n\n# Install Flux\nkubectl apply --filename https://raw.githubusercontent.com/syntasso/kratix/main/hack/destination/gitops-tk-install.yaml\n"))),(0,r.kt)("h3",{id:"configure-the-platform"},"Configure the Platform"),(0,r.kt)(i.ZP,{mdxType:"PartialConfigure"}),(0,r.kt)("details",null,(0,r.kt)("summary",null,"Alternative install instructions"),(0,r.kt)("p",null,"To register the minikube cluster as a Kratix Destination, run the command below:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"kubectl apply --filename https://raw.githubusercontent.com/syntasso/kratix/main/config/samples/platform_v1alpha1_bucketstatestore.yaml\nkubectl apply --filename https://raw.githubusercontent.com/syntasso/kratix/main/config/samples/platform_v1alpha1_worker.yaml\n")),(0,r.kt)("p",null,"You can then install and configure Flux with the commands below:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"# Install the GitOps toolkit\nkubectl apply --filename https://raw.githubusercontent.com/syntasso/kratix/main/hack/destination/gitops-tk-resources-single-cluster.yaml\n"))),(0,r.kt)("p",null,"Once Flux is installed and running (this may take a few minutes), the Kratix resources should now be visible on the your cluster. You can verify its readiness by observing the ",(0,r.kt)("inlineCode",{parentName:"p"},"kratix-worker-system")," namespace appearing in the cluster:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"$ kubectl get namespace kratix-worker-system\nNAME                   STATUS   AGE\nkratix-worker-system   Active   1m\n")),(0,r.kt)("p",null,"\ud83c\udf89   ",(0,r.kt)("strong",{parentName:"p"},"Congratulations!")," Kratix is now ready to receive Promises requests for Resources. Jump to ",(0,r.kt)("a",{parentName:"p",href:"../installing-a-promise"},"Installing and using a Promise")," to spin up your first as-a-service offering."))}g.isMDXComponent=!0}}]);