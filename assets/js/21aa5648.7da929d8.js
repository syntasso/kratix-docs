"use strict";(self.webpackChunkkratix_docs=self.webpackChunkkratix_docs||[]).push([[7277],{9666:(e,s,t)=>{t.d(s,{ZP:()=>i});var n=t(5893),r=t(1151);function a(e){const s={a:"a",code:"code",p:"p",pre:"pre",...(0,r.a)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)(s.p,{children:["Once Kratix is installed, you can register Kubernetes clusters where workloads should run.\nOn single cluster installations, the same cluster performs the role of the Platform and\nthe worker clusters. The commands below will register the cluster as a Destination, as well as configure\nFluxCD to watch for the cluster's ",(0,n.jsx)(s.a,{href:"/docs/main/reference/statestore/intro",children:"State Store"}),":"]}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-bash",children:"kubectl apply --filename https://github.com/syntasso/kratix/releases/latest/download/config-all-in-one.yaml\n"})})]})}function i(e={}){const{wrapper:s}={...(0,r.a)(),...e.components};return s?(0,n.jsx)(s,{...e,children:(0,n.jsx)(a,{...e})}):a(e)}},6261:(e,s,t)=>{t.d(s,{ZP:()=>i});var n=t(5893),r=t(1151);function a(e){const s={a:"a",code:"code",p:"p",pre:"pre",...(0,r.a)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(s.p,{children:"Install Kratix and its Dependencies with the command below:"}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-bash",children:"kubectl apply --filename https://github.com/syntasso/kratix/releases/latest/download/install-all-in-one.yaml\n"})}),"\n",(0,n.jsxs)(s.p,{children:["The above will install Kratix, MinIO, and FluxCD. MinIO will be the ",(0,n.jsx)(s.a,{href:"/docs/main/reference/statestore/intro",children:"State Store"}),"\nfor the Kratix to write to and FluxCD will watch the MinIO Bucket for any changes that need to be applied to\nthe cluster. Kratix supports a variety of ",(0,n.jsx)(s.a,{href:"/docs/main/reference/statestore/intro",children:"State Stores"}),"\nand multiple different State Stores can be used."]}),"\n",(0,n.jsxs)(s.p,{children:["You can also install Kratix via Helm. For more information, see the ",(0,n.jsx)(s.a,{href:"https://github.com/syntasso/helm-charts",children:"Helm Chart"})," documentation."]})]})}function i(e={}){const{wrapper:s}={...(0,r.a)(),...e.components};return s?(0,n.jsx)(s,{...e,children:(0,n.jsx)(a,{...e})}):a(e)}},1909:(e,s,t)=>{t.r(s),t.d(s,{assets:()=>d,contentTitle:()=>o,default:()=>p,frontMatter:()=>l,metadata:()=>c,toc:()=>u});var n=t(5893),r=t(1151),a=t(6261),i=t(9666);const l={description:"Quickest way to test Kratix",title:"Quick Start",sidebar_label:"Quick Start"},o=void 0,c={id:"main/quick-start",title:"Quick Start",description:"Quickest way to test Kratix",source:"@site/docs/main/03-quick-start.md",sourceDirName:"main",slug:"/main/quick-start",permalink:"/docs/main/quick-start",draft:!1,unlisted:!1,editUrl:"https://github.com/syntasso/kratix-docs/tree/main/docs/main/03-quick-start.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{description:"Quickest way to test Kratix",title:"Quick Start",sidebar_label:"Quick Start"},sidebar:"mainSidebar",previous:{title:"The Value of Kratix",permalink:"/docs/main/value-of-kratix"},next:{title:"Guides",permalink:"/docs/category/guides"}},d={},u=[{value:"Prerequisite: Kubernetes cluster",id:"prerequisite-kubernetes-cluster",level:2},{value:"cert-manager",id:"cert-manager",level:3},{value:"1. Install Kratix",id:"1-install-kratix",level:2},{value:"Configure",id:"configure",level:3},{value:"2. Provide Postgres-as-a-Service via a Kratix Promise",id:"2-provide-postgres-as-a-service-via-a-kratix-promise",level:2},{value:"3. Self serve a Postgres",id:"3-self-serve-a-postgres",level:2},{value:"Clean up",id:"clean-up",level:2},{value:"\ud83c\udf89 Congratulations!",id:"-congratulations",level:2}];function h(e){const s={a:"a",code:"code",h2:"h2",h3:"h3",p:"p",pre:"pre",...(0,r.a)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(s.p,{children:"One of the most powerful features of Kratix is its ability to handle requests for\nResources, and deploy them to a specific remote location, Kubernetes or otherwise. However, Kratix also works well\nin a single Kubernetes cluster environment. This quick-start guide will walk you through the steps to\ninstall Kratix on a single cluster."}),"\n",(0,n.jsx)(s.h2,{id:"prerequisite-kubernetes-cluster",children:"Prerequisite: Kubernetes cluster"}),"\n",(0,n.jsxs)(s.p,{children:["Kratix requires a Kubernetes cluster to run. If you don't already have a cluster, we\nrecommend starting with a local cluster tool like\n",(0,n.jsx)(s.a,{href:"https://kind.sigs.k8s.io/docs/user/quick-start/",children:"KinD"})," or\n",(0,n.jsx)(s.a,{href:"https://minikube.sigs.k8s.io/docs/start/",children:"minikube"}),"."]}),"\n",(0,n.jsx)(s.h3,{id:"cert-manager",children:"cert-manager"}),"\n",(0,n.jsxs)(s.p,{children:["Kratix requires ",(0,n.jsx)(s.a,{href:"https://cert-manager.io/",children:"cert-manager"})," to be installed in the\ncluster."]}),"\n",(0,n.jsx)(s.p,{children:"To install it, run:"}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-bash",children:"kubectl apply --filename https://github.com/cert-manager/cert-manager/releases/download/v1.12.0/cert-manager.yaml\n"})}),"\n",(0,n.jsxs)(s.p,{children:["Make sure that ",(0,n.jsx)(s.code,{children:"cert-manager"})," is ready before installing Kratix:"]}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-shell-session",children:"$ kubectl get pods --namespace cert-manager\nNAME                                      READY   STATUS    RESTARTS   AGE\ncert-manager-7476c8fcf4-r8cnd             1/1     Running   0          19s\ncert-manager-cainjector-bdd866bd4-7d8zp   1/1     Running   0          19s\ncert-manager-webhook-5655dcfb4b-54r49     1/1     Running   0          19s\n"})}),"\n",(0,n.jsx)(s.h2,{id:"1-install-kratix",children:"1. Install Kratix"}),"\n",(0,n.jsx)(a.ZP,{}),"\n",(0,n.jsx)(s.h3,{id:"configure",children:"Configure"}),"\n",(0,n.jsx)(i.ZP,{}),"\n",(0,n.jsxs)(s.p,{children:["Once the system reconciles, the Kratix resources should now be visible on your\ncluster. You can verify its readiness by observing the ",(0,n.jsx)(s.code,{children:"kratix-worker-system"})," namespace\nappearing in the cluster (it may take a couple of minutes):"]}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-shell-session",children:"$ kubectl get namespace kratix-worker-system\nNAME                   STATUS   AGE\nkratix-worker-system   Active   1m\n"})}),"\n",(0,n.jsx)(s.h2,{id:"2-provide-postgres-as-a-service-via-a-kratix-promise",children:"2. Provide Postgres-as-a-Service via a Kratix Promise"}),"\n",(0,n.jsx)(s.p,{children:"Install the sample Postgres Promise with the command below:"}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-bash",children:"kubectl apply --filename https://raw.githubusercontent.com/syntasso/promise-postgresql/main/promise.yaml\n"})}),"\n",(0,n.jsx)(s.p,{children:"Installing the Promise will eventually start the Postgres Operator on your cluster. You\ncan verify by running:"}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-console",children:"kubectl get pods\n"})}),"\n",(0,n.jsx)(s.p,{children:"It may take a few seconds, but you should eventually see something similar to:"}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-console",children:"NAME                                 READY   STATUS    RESTARTS   AGE\npostgres-operator-7dccdbff7c-2hqhc   1/1     Running   0          1m\n"})}),"\n",(0,n.jsx)(s.h2,{id:"3-self-serve-a-postgres",children:"3. Self serve a Postgres"}),"\n",(0,n.jsx)(s.p,{children:"Once the Postgres Operator is up and running, you can request a new Postgres Resource with\nthe command below:"}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-console",children:"kubectl apply --filename https://raw.githubusercontent.com/syntasso/promise-postgresql/main/resource-request.yaml\n"})}),"\n",(0,n.jsx)(s.p,{children:"You can verify the Pipeline pod by running:"}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-shell-session",children:"$ kubectl get pods\nNAME                                          READY   STATUS      RESTARTS   AGE\n//highlight-next-line\nconfigure-pipeline-postgresql-default-8f012     0/1     Completed   0          72s\npostgres-operator-6c6dbd4459-pbcjp            1/1     Running     0          6m55s\n"})}),"\n",(0,n.jsx)(s.p,{children:"Eventually, the Postgres pods will come up as well:"}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-shell-session",children:"$ kubectl get pods\nNAME                                         READY   STATUS      RESTARTS   AGE\n//highlight-start\nacid-example-postgresql-0                    1/1     Running     0          113s\n//highlight-end\npostgres-operator-6c6dbd4459-pbcjp           1/1     Running     0          6m55s\nconfigure-pipeline-postgresql-default-8f012    0/1     Completed   0          2m17s\n"})}),"\n",(0,n.jsx)(s.p,{children:"You are now ready to use your Postgres Resources! To validate, you can run:"}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{children:"kubectl exec -it acid-example-postgresql-0 -- sh -c \"\n    PGPASSWORD=$(kubectl get secret postgres.acid-example-postgresql.credentials.postgresql.acid.zalan.do -o 'jsonpath={.data.password}' | base64 -d) \\\n    PGUSER=$(kubectl get secret postgres.acid-example-postgresql.credentials.postgresql.acid.zalan.do -o 'jsonpath={.data.username}' | base64 -d) \\\n    psql bestdb\"\n"})}),"\n",(0,n.jsx)(s.h2,{id:"clean-up",children:"Clean up"}),"\n",(0,n.jsx)(s.p,{children:"To clean up the created resources, run:"}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-console",children:"kubectl delete --filename https://raw.githubusercontent.com/syntasso/promise-postgresql/main/promise.yaml\nkubectl delete --filename https://github.com/syntasso/kratix/releases/latest/download/install-all-in-one.yaml\n"})}),"\n",(0,n.jsx)(s.h2,{id:"-congratulations",children:"\ud83c\udf89 Congratulations!"}),"\n",(0,n.jsxs)(s.p,{children:["You have successfully installed Kratix and used it to deliver Postgres-as-a-Service to\nyour platform. Check out our ",(0,n.jsx)(s.a,{href:"/docs/category/guides",children:"guides"})," to learn more about Kratix\ncapabilities."]})]})}function p(e={}){const{wrapper:s}={...(0,r.a)(),...e.components};return s?(0,n.jsx)(s,{...e,children:(0,n.jsx)(h,{...e})}):h(e)}},1151:(e,s,t)=>{t.d(s,{Z:()=>l,a:()=>i});var n=t(7294);const r={},a=n.createContext(r);function i(e){const s=n.useContext(a);return n.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function l(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:i(e.components),n.createElement(a.Provider,{value:s},e.children)}}}]);