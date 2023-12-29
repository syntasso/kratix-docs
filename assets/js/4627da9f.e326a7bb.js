"use strict";(self.webpackChunkkratix_docs=self.webpackChunkkratix_docs||[]).push([[9273],{3900:(e,t,n)=>{n.d(t,{ZP:()=>i});var s=n(5893),a=n(1151);function r(e){const t={a:"a",code:"code",p:"p",pre:"pre",...(0,a.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(t.p,{children:["Kratix requires ",(0,s.jsx)(t.a,{href:"https://cert-manager.io/",children:"cert-manager"})," to be installed in the\nPlatform cluster. If you already have it installed, skip to the\nnext section."]}),"\n",(0,s.jsx)(t.p,{children:"To install it, run:"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-bash",children:"kubectl --context $PLATFORM apply --filename https://github.com/cert-manager/cert-manager/releases/download/v1.12.0/cert-manager.yaml\n"})}),"\n",(0,s.jsxs)(t.p,{children:["Make sure that ",(0,s.jsx)(t.code,{children:"cert-manager"})," is ready before installing Kratix:"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-shell-session",children:"$ kubectl --context $PLATFORM get pods --namespace cert-manager\nNAME                                      READY   STATUS    RESTARTS   AGE\ncert-manager-7476c8fcf4-r8cnd             1/1     Running   0          19s\ncert-manager-cainjector-bdd866bd4-7d8zp   1/1     Running   0          19s\ncert-manager-webhook-5655dcfb4b-54r49     1/1     Running   0          19s\n"})})]})}function i(e={}){const{wrapper:t}={...(0,a.a)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(r,{...e})}):r(e)}},9666:(e,t,n)=>{n.d(t,{ZP:()=>i});var s=n(5893),a=n(1151);function r(e){const t={a:"a",code:"code",p:"p",pre:"pre",...(0,a.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(t.p,{children:["Once Kratix is installed, you can register Kubernetes clusters where workloads should run.\nOn single cluster installations, the same cluster performs the role of the Platform and\nthe worker clusters. The commands below will register the cluster as a Destination, as well as configure\nFluxCD to watch for the cluster's ",(0,s.jsx)(t.a,{href:"/docs/main/reference/statestore/intro",children:"State Store"}),":"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-bash",children:"kubectl apply --filename https://github.com/syntasso/kratix/releases/latest/download/config-all-in-one.yaml\n"})})]})}function i(e={}){const{wrapper:t}={...(0,a.a)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(r,{...e})}):r(e)}},6261:(e,t,n)=>{n.d(t,{ZP:()=>i});var s=n(5893),a=n(1151);function r(e){const t={a:"a",code:"code",p:"p",pre:"pre",...(0,a.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.p,{children:"Install Kratix and its Dependencies with the command below:"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-bash",children:"kubectl apply --filename https://github.com/syntasso/kratix/releases/latest/download/install-all-in-one.yaml\n"})}),"\n",(0,s.jsxs)(t.p,{children:["The above will install Kratix, MinIO, and FluxCD. MinIO will be the ",(0,s.jsx)(t.a,{href:"/docs/main/reference/statestore/intro",children:"State Store"}),"\nfor the Kratix to write to and FluxCD will watch the MinIO Bucket for any changes that need to be applied to\nthe cluster. Kratix supports a variety of ",(0,s.jsx)(t.a,{href:"/docs/main/reference/statestore/intro",children:"State Stores"}),"\nand multiple different State Stores can be used."]}),"\n",(0,s.jsxs)(t.p,{children:["You can also install Kratix via Helm. For more information, see the ",(0,s.jsx)(t.a,{href:"https://github.com/syntasso/helm-charts",children:"Helm Chart"})," documentation."]})]})}function i(e={}){const{wrapper:t}={...(0,a.a)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(r,{...e})}):r(e)}},943:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>d,contentTitle:()=>c,default:()=>p,frontMatter:()=>o,metadata:()=>u,toc:()=>h});var s=n(5893),a=n(1151),r=n(6261),i=n(9666),l=n(3900);const o={description:"Run Kratix on a Single cluster setup",title:"Single cluster"},c=void 0,u={id:"main/guides/installing-kratix/single-cluster",title:"Single cluster",description:"Run Kratix on a Single cluster setup",source:"@site/docs/main/04-guides/01-installing-kratix/02-single-cluster.mdx",sourceDirName:"main/04-guides/01-installing-kratix",slug:"/main/guides/installing-kratix/single-cluster",permalink:"/docs/main/guides/installing-kratix/single-cluster",draft:!1,unlisted:!1,editUrl:"https://github.com/syntasso/kratix-docs/tree/main/docs/main/04-guides/01-installing-kratix/02-single-cluster.mdx",tags:[],version:"current",sidebarPosition:2,frontMatter:{description:"Run Kratix on a Single cluster setup",title:"Single cluster"},sidebar:"mainSidebar",previous:{title:"Multi cluster",permalink:"/docs/main/guides/installing-kratix"},next:{title:"Installing and using a Promise",permalink:"/docs/main/guides/installing-a-promise"}},d={},h=[{value:"Bootstrap the cluster",id:"bootstrap-the-cluster",level:2},{value:"Install cert-manager",id:"install-cert-manager",level:2},{value:"Install Kratix",id:"install-kratix",level:2},{value:"Configure the Platform",id:"configure-the-platform",level:3}];function m(e){const t={a:"a",code:"code",h2:"h2",h3:"h3",p:"p",pre:"pre",strong:"strong",...(0,a.a)(),...e.components},{Details:n}=t;return n||function(e,t){throw new Error("Expected "+(t?"component":"object")+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}("Details",!0),(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.p,{children:"One of the most powerful features of Kratix is its ability to handle requests\nfor Resources, and deploy them to a remote specific cluster. However, Kratix\nalso works well in a single cluster environment. This guide will walk you\nthrough the steps to install Kratix on a single cluster."}),"\n",(0,s.jsx)(t.h2,{id:"bootstrap-the-cluster",children:"Bootstrap the cluster"}),"\n",(0,s.jsxs)(t.p,{children:["You will need access to a Kubernetes cluster to deploy Kratix. If you'd like to test Kratix in your local machine, you can create a cluster with ",(0,s.jsx)(t.a,{href:"https://minikube.sigs.k8s.io/docs/start/",children:"minikube"}),"."]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{children:"minikube start\n"})}),"\n",(0,s.jsx)(t.h2,{id:"install-cert-manager",children:"Install cert-manager"}),"\n",(0,s.jsx)(l.ZP,{}),"\n",(0,s.jsx)(t.h2,{id:"install-kratix",children:"Install Kratix"}),"\n",(0,s.jsx)(r.ZP,{}),"\n",(0,s.jsxs)(n,{children:[(0,s.jsx)("summary",{children:"Alternative install instructions"}),(0,s.jsx)(t.p,{children:"To install Kratix and MinIO separately, run the commands below:"}),(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-bash",children:"# Install Kratix\nkubectl apply --filename https://github.com/syntasso/kratix/releases/latest/download/kratix.yaml\n\n# Install MinIO\nkubectl apply --filename https://raw.githubusercontent.com/syntasso/kratix/main/hack/platform/minio-install.yaml\n\n# Install Flux\nkubectl apply --filename https://raw.githubusercontent.com/syntasso/kratix/main/hack/destination/gitops-tk-install.yaml\n"})})]}),"\n",(0,s.jsx)(t.h3,{id:"configure-the-platform",children:"Configure the Platform"}),"\n",(0,s.jsx)(i.ZP,{}),"\n",(0,s.jsxs)(n,{children:[(0,s.jsx)("summary",{children:"Alternative install instructions"}),(0,s.jsx)(t.p,{children:"To register the minikube cluster as a Kratix Destination, run the command below:"}),(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-bash",children:"kubectl apply --filename https://raw.githubusercontent.com/syntasso/kratix/main/config/samples/platform_v1alpha1_bucketstatestore.yaml\nkubectl apply --filename https://raw.githubusercontent.com/syntasso/kratix/main/config/samples/platform_v1alpha1_worker.yaml\n"})}),(0,s.jsx)(t.p,{children:"You can then install and configure Flux with the commands below:"}),(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-bash",children:"# Install the GitOps toolkit\nkubectl apply --filename https://raw.githubusercontent.com/syntasso/kratix/main/hack/destination/gitops-tk-resources-single-cluster.yaml\n"})})]}),"\n",(0,s.jsxs)(t.p,{children:["Once Flux is installed and running (this may take a few minutes), the Kratix resources should now be visible on the your cluster. You can verify its readiness by observing the ",(0,s.jsx)(t.code,{children:"kratix-worker-system"})," namespace appearing in the cluster:"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-bash",children:"$ kubectl get namespace kratix-worker-system\nNAME                   STATUS   AGE\nkratix-worker-system   Active   1m\n"})}),"\n",(0,s.jsxs)(t.p,{children:["\ud83c\udf89   ",(0,s.jsx)(t.strong,{children:"Congratulations!"})," Kratix is now ready to receive Promises requests for Resources. Jump to ",(0,s.jsx)(t.a,{href:"../installing-a-promise",children:"Installing and using a Promise"})," to spin up your first as-a-service offering."]})]})}function p(e={}){const{wrapper:t}={...(0,a.a)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(m,{...e})}):m(e)}},1151:(e,t,n)=>{n.d(t,{Z:()=>l,a:()=>i});var s=n(7294);const a={},r=s.createContext(a);function i(e){const t=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function l(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:i(e.components),s.createElement(r.Provider,{value:t},e.children)}}}]);