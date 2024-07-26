"use strict";(self.webpackChunkkratix_docs=self.webpackChunkkratix_docs||[]).push([[5879],{9060:(e,t,n)=>{n.d(t,{ZP:()=>o,d$:()=>a});var r=n(5893),s=n(1151);const a=[];function i(e){const t={a:"a",code:"code",li:"li",p:"p",pre:"pre",ul:"ul",...(0,s.a)(),...e.components},{Details:n}=t;return n||function(e,t){throw new Error("Expected "+(t?"component":"object")+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}("Details",!0),(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(t.p,{children:["Kratix requires a set of certificates in order to deploy its internal\n",(0,r.jsx)(t.a,{href:"https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/",children:"Validating and Mutating Kubernetes\nwebhooks"}),".\nBy default Kratix is configured to use ",(0,r.jsx)(t.a,{href:"https://cert-manager.io/",children:"cert-manager"})," to\ngenerate the certificates, therefore we need to install cert-manager. If you already\nhave it installed, skip to the next section."]}),"\n",(0,r.jsxs)(n,{children:[(0,r.jsx)("summary",{children:" Don't want to use cert-manager? Manually provide the required\ncertificates "}),(0,r.jsx)(t.p,{children:"Cert-manager is used to generate a CA, and a key/cert pair which is\nconfigured for the following DNS names:"}),(0,r.jsxs)(t.ul,{children:["\n",(0,r.jsx)(t.li,{children:(0,r.jsx)(t.code,{children:"kratix-platform-webhook-service.kratix-platform-system.svc.cluster.local"})}),"\n",(0,r.jsx)(t.li,{children:(0,r.jsx)(t.code,{children:"kratix-platform-webhook-service.kratix-platform-system.svc"})}),"\n"]}),(0,r.jsxs)(t.p,{children:["To manually provide the required certificates, you need to create the\n",(0,r.jsx)(t.code,{children:"webhook-server-cert"})," secret in the ",(0,r.jsx)(t.code,{children:"kratix-platform-system"})," namespace with the\nfollowing keys:"]}),(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-yaml",children:"apiVersion: v1\ndata:\n  ca.crt: # Base64 CA certificate\n  tls.crt: # Base64 encoded Server certificate\n  tls.key: # Base64 encoded Server private key\nkind: Secret\nmetadata:\n  name: webhook-server-cert\n  namespace: kratix-platform-system\ntype: kubernetes.io/tls\n"})}),(0,r.jsxs)(t.p,{children:["As part of installing Kratix we create a few resources that require the CA\ncertificate. You will have to manually add the CA certificate to the resources\nmentioned below, and manually remove the cert-manager ",(0,r.jsx)(t.code,{children:"Certificate"})," and ",(0,r.jsx)(t.code,{children:"Issuer"}),"\nresources. The following resources need to be updated to contain the Base64\nencoded CA certificate:"]}),(0,r.jsxs)(t.ul,{children:["\n",(0,r.jsxs)(t.li,{children:["\n",(0,r.jsx)(t.p,{children:(0,r.jsx)(t.code,{children:"MutatingWebhookConfiguration/kratix-platform-mutating-webhook-configuration"})}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{children:"apiVersion: admissionregistration.k8s.io/v1\nkind: MutatingWebhookConfiguration\nmetadata:\n  name: kratix-platform-mutating-webhook-configuration\nwebhooks:\n- admissionReviewVersions:\n  - v1\n  clientConfig:\n    caBundle: .... #  there might be multiple admissionReviewVersions, ensure you update all of them\n"})}),"\n"]}),"\n",(0,r.jsxs)(t.li,{children:["\n",(0,r.jsx)(t.p,{children:(0,r.jsx)(t.code,{children:"ValidatingWebhookConfiguration/kratix-platform-validating-webhook-configuration"})}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{children:"apiVersion: admissionregistration.k8s.io/v1\nkind: ValidatingWebhookConfiguration\nmetadata:\n  name: kratix-platform-validating-webhook-configuration\nwebhooks:\n- admissionReviewVersions:\n  - v1\n  clientConfig:\n    caBundle: .... #  there might be multiple admissionReviewVersions, ensure you update all of them\n"})}),"\n"]}),"\n",(0,r.jsxs)(t.li,{children:["\n",(0,r.jsx)(t.p,{children:(0,r.jsx)(t.code,{children:"CustomResourceDefinition/promises.platform.kratix.io"})}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{children:"apiVersion: apiextensions.k8s.io/v1\nkind: CustomResourceDefinition\nmetadata:\n  name: promises.platform.kratix.io\nspec:\n  conversion:\n    strategy: Webhook\n    webhook:\n      clientConfig:\n        caBundle: ....\n"})}),"\n"]}),"\n"]}),(0,r.jsx)(t.p,{children:"Lastly, you need to remove the following cert-manager Issuer and Certificate from Kratix release manifest:"}),(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-yaml",children:"---\n...\napiVersion: cert-manager.io/v1\nkind: Certificate\nmetadata:\n  name: kratix-platform-serving-cert\n  namespace: kratix-platform-system\nspec:\n...\n---\napiVersion: cert-manager.io/v1\nkind: Issuer\nmetadata:\n  name: kratix-platform-selfsigned-issuer\n  namespace: kratix-platform-system\nspec:\n...\n"})})]}),"\n",(0,r.jsx)(t.p,{children:"To install it, run:"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-bash",children:"kubectl --context $PLATFORM apply --filename https://github.com/cert-manager/cert-manager/releases/download/v1.15.0/cert-manager.yaml\n"})}),"\n",(0,r.jsxs)(t.p,{children:["Make sure that ",(0,r.jsx)(t.code,{children:"cert-manager"})," is ready before installing Kratix:"]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-shell-session",children:"$ kubectl --context $PLATFORM get pods --namespace cert-manager\nNAME                                      READY   STATUS    RESTARTS   AGE\ncert-manager-7476c8fcf4-r8cnd             1/1     Running   0          19s\ncert-manager-cainjector-bdd866bd4-7d8zp   1/1     Running   0          19s\ncert-manager-webhook-5655dcfb4b-54r49     1/1     Running   0          19s\n"})})]})}function o(e={}){const{wrapper:t}={...(0,s.a)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(i,{...e})}):i(e)}},5340:(e,t,n)=>{n.d(t,{ZP:()=>o,d$:()=>a});var r=n(5893),s=n(1151);const a=[];function i(e){const t={a:"a",code:"code",p:"p",pre:"pre",strong:"strong",...(0,s.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(t.p,{children:["Flux will eventually reconcile the cluster's state, making the ",(0,r.jsx)(t.code,{children:"worker"})," cluster ready\nto receive workloads. You can verify its readiness by observing the ",(0,r.jsx)(t.code,{children:"kratix-worker-system"}),"\nnamespace appearing in the ",(0,r.jsx)(t.code,{children:"worker"})," cluster:"]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-shell-session",children:"$ kubectl --context $WORKER get namespaces\nNAME                   STATUS   AGE\n...\nkratix-worker-system   Active   1m\n...\n"})}),"\n",(0,r.jsxs)(t.p,{children:["\ud83c\udf89   ",(0,r.jsx)(t.strong,{children:"Congratulations!"})," Kratix is now installed! Jump to ",(0,r.jsx)(t.a,{href:"installing-a-promise",children:"Installing and using a Promise"})," to spin up your first as-a-service offering."]})]})}function o(e={}){const{wrapper:t}={...(0,s.a)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(i,{...e})}):i(e)}},491:(e,t,n)=>{n.d(t,{ZP:()=>o,d$:()=>a});var r=n(5893),s=n(1151);const a=[{value:"Install Flux",id:"install-flux",level:3}];function i(e){const t={a:"a",code:"code",h3:"h3",p:"p",pre:"pre",strong:"strong",...(0,s.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.h3,{id:"install-flux",children:"Install Flux"}),"\n",(0,r.jsxs)(t.p,{children:["Follow the ",(0,r.jsx)(t.a,{href:"https://fluxcd.io/flux/installation/",children:"Flux installation guide"})," to\ninstall Flux, or if you are just using this cluster for testing you can use the\nfollowing manifest (",(0,r.jsx)(t.strong,{children:"NOT to be used for production"}),"). Other GitOps tools are\navailable, such as ArgoCD."]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-bash",children:"kubectl apply --context $WORKER --filename https://raw.githubusercontent.com/syntasso/kratix/main/hack/destination/gitops-tk-install.yaml\n"})}),"\n",(0,r.jsxs)(t.p,{children:["Make sure that ",(0,r.jsx)(t.code,{children:"flux"})," is ready before proceeding:"]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-shell-session",children:"$ kubectl --context $WORKER get pods --namespace flux-system\nNAME                                       READY   STATUS    RESTARTS   AGE\nhelm-controller-5f7457c9dd-s5qzt           1/1     Running   0          18s\nkustomize-controller-5f58d55f76-hwm5w      1/1     Running   0          19s\nnotification-controller-685bdc466d-5xmk8   1/1     Running   0          16s\nsource-controller-86b8b57796-t6xgg         1/1     Running   0          20s\n"})})]})}function o(e={}){const{wrapper:t}={...(0,s.a)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(i,{...e})}):i(e)}},6609:(e,t,n)=>{n.d(t,{ZP:()=>l,d$:()=>i});var r=n(5893),s=n(1151),a=n(9060);const i=[{value:"Install cert-manager",id:"install-cert-manager",level:2},...a.d$,{value:"Install Kratix",id:"install-kratix",level:2}];function o(e){const t={a:"a",code:"code",h2:"h2",p:"p",pre:"pre",...(0,s.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.h2,{id:"install-cert-manager",children:"Install cert-manager"}),"\n",(0,r.jsx)(a.ZP,{}),"\n",(0,r.jsx)(t.h2,{id:"install-kratix",children:"Install Kratix"}),"\n",(0,r.jsx)(t.p,{children:"Install Kratix on the Platform Cluster."}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-bash",children:"kubectl apply --context $PLATFORM --filename https://github.com/syntasso/kratix/releases/latest/download/kratix.yaml\n"})}),"\n",(0,r.jsxs)(t.p,{children:["You can also install and configure Kratix with Helm. For more information, see\nthe ",(0,r.jsx)(t.a,{href:"https://github.com/syntasso/helm-charts",children:"Helm Chart"})," documentation."]}),"\n",(0,r.jsxs)(t.p,{children:["Make sure that ",(0,r.jsx)(t.code,{children:"kratix"})," is ready before proceeding:"]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-shell-session",children:"$ kubectl --context $PLATFORM get pods --namespace kratix-platform-system\nNAME                                                 READY   STATUS    RESTARTS   AGE\nkratix-platform-controller-manager-78d57569b-bn4t4   2/2     Running   0          25s\n"})})]})}function l(e={}){const{wrapper:t}={...(0,s.a)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(o,{...e})}):o(e)}},911:(e,t,n)=>{n.d(t,{ZP:()=>o,d$:()=>a});var r=n(5893),s=n(1151);const a=[{value:"Set up State Store",id:"set-up-state-store",level:2}];function i(e){const t={a:"a",h2:"h2",p:"p",...(0,s.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.h2,{id:"set-up-state-store",children:"Set up State Store"}),"\n",(0,r.jsxs)(t.p,{children:["Kratix uses GitOps to provision resources on the worker clusters. You can\nconfigure Kratix with multiple GitOps repositories by creating ",(0,r.jsx)(t.a,{href:"/main/reference/statestore/intro",children:"State\nStores"}),". Kratix supports ",(0,r.jsx)(t.a,{href:"/main/reference/statestore/bucketstatestore",children:"Bucket State\nStore"})," and ",(0,r.jsx)(t.a,{href:"/main/reference/statestore/gitstatestore",children:"Git State\nStore"}),"."]}),"\n",(0,r.jsx)(t.p,{children:"Using a Git State Store is recommended for production environments as it provides\nbetter security and version control. However, for development and testing\npurposes, you can also use the Bucket State Store."})]})}function o(e={}){const{wrapper:t}={...(0,s.a)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(i,{...e})}):i(e)}},7947:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>m,contentTitle:()=>h,default:()=>f,frontMatter:()=>d,metadata:()=>p,toc:()=>x});var r=n(5893),s=n(1151),a=n(4866),i=n(5162),o=n(6609),l=n(491),c=n(5340),u=n(911);const d={description:"Run Kratix",slug:"/main/guides/installing-kratix-others",title:"Others (KinD etc)"},h=void 0,p={id:"main/guides/installing-kratix/others",title:"Others (KinD etc)",description:"Run Kratix",source:"@site/docs/main/04-guides/01-installing-kratix/04-others.mdx",sourceDirName:"main/04-guides/01-installing-kratix",slug:"/main/guides/installing-kratix-others",permalink:"/main/guides/installing-kratix-others",draft:!1,unlisted:!1,editUrl:"https://github.com/syntasso/kratix-docs/tree/main/docs/main/04-guides/01-installing-kratix/04-others.mdx",tags:[],version:"current",sidebarPosition:4,frontMatter:{description:"Run Kratix",slug:"/main/guides/installing-kratix-others",title:"Others (KinD etc)"},sidebar:"mainSidebar",previous:{title:"Google Kubernetes Engine (GKE)",permalink:"/main/guides/installing-kratix-GKE"},next:{title:"Installing and using a Promise",permalink:"/main/guides/installing-a-promise"}},m={},x=[{value:"System setup",id:"system-setup",level:2},{value:"Set up platform cluster",id:"platform-setup",level:2},...o.d$,...u.d$,{value:"Set up a worker cluster",id:"worker-setup",level:2},{value:"Create worker cluster",id:"create-worker-cluster",level:3},...l.d$,{value:"Configure Flux",id:"configure-flux",level:3},{value:"Register cluster as a Destination with Kratix",id:"register-cluster-as-a-destination-with-kratix",level:3},...c.d$];function g(e){const t={a:"a",admonition:"admonition",code:"code",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,s.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.h2,{id:"system-setup",children:"System setup"}),"\n",(0,r.jsx)(t.p,{children:"This guide will show how to use Kratix on two Kubernetes clusters. Install the prerequisites\nlisted below if they aren't already on your system. If you are using pre-existing clusters\nor want to use a different tool to provision your clusters, skip requirements 1 and 2."}),"\n",(0,r.jsxs)(t.ol,{children:["\n",(0,r.jsxs)(t.li,{children:[(0,r.jsx)(t.code,{children:"kind"})," CLI / ",(0,r.jsx)(t.strong,{children:"Kubernetes-in-Docker (KinD)"}),":\nUsed to create and manage local Kubernetes clusters in Docker. See ",(0,r.jsx)(t.a,{href:"https://kind.sigs.k8s.io/docs/user/quick-start/",children:"the quick start guide"})," to install."]}),"\n",(0,r.jsxs)(t.li,{children:[(0,r.jsx)(t.code,{children:"docker"})," CLI / ",(0,r.jsx)(t.strong,{children:"Docker"}),":\nUsed to orchestrate containers. ",(0,r.jsx)(t.code,{children:"kind"})," (above) requires that you have Docker installed and configured. See ",(0,r.jsx)(t.a,{href:"https://docs.docker.com/get-docker/",children:"Get Docker"})," to install."]}),"\n",(0,r.jsxs)(t.li,{children:[(0,r.jsx)(t.code,{children:"kubectl"})," / ",(0,r.jsx)(t.strong,{children:"Kubernetes command-line tool"}),":\nThe CLI for Kubernetes \u2014 allows you to run commands against Kubernetes clusters. See ",(0,r.jsx)(t.a,{href:"https://kubernetes.io/docs/tasks/tools/#kubectl",children:"the install guide"}),"."]}),"\n"]}),"\n",(0,r.jsx)(t.admonition,{type:"tip",children:(0,r.jsxs)(t.p,{children:["To get setup locally quickly with KinD clusters you can use the ",(0,r.jsx)(t.code,{children:"./scripts/quick-start.sh"}),"\nfrom the root of the ",(0,r.jsx)(t.a,{href:"https://github.com/syntasso/kratix",children:"Kratix repository"}),". This provisions\nan in-cluster ",(0,r.jsx)(t.code,{children:"MinIO"})," to use as the backing ",(0,r.jsx)(t.a,{href:"/main/reference/statestore/intro",children:"State Store"}),".\nAlternatively you can provide the ",(0,r.jsx)(t.code,{children:"--git"})," flag to create it with an in-cluster Gitea\ninstance instead."]})}),"\n",(0,r.jsx)(t.h2,{id:"platform-setup",children:"Set up platform cluster"}),"\n",(0,r.jsx)(t.p,{children:"If you are not using a pre-existing cluster, create your platform cluster locally using KinD:"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-bash",children:'kind create cluster --image kindest/node:v1.27.3 --name platform\n# set PLATFORM to point to the platform cluster context\nexport PLATFORM="kind-platform"\n'})}),"\n",(0,r.jsx)(o.ZP,{}),"\n",(0,r.jsx)(u.ZP,{}),"\n",(0,r.jsx)(t.p,{children:"If your are using local KinD clusters you can install MinIO or Gitea as an in-cluster State Store"}),"\n",(0,r.jsxs)(a.Z,{className:"boxedTabs",groupId:"stateStore",children:[(0,r.jsx)(i.Z,{value:"minio",label:"Bucket (on KinD)",children:(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-bash",children:"# Install MinIO and register it as a BucketStateStore\nkubectl apply --context $PLATFORM --filename https://raw.githubusercontent.com/syntasso/kratix/main/config/samples/minio-install.yaml\nkubectl apply --context $PLATFORM --filename https://raw.githubusercontent.com/syntasso/kratix/main/config/samples/platform_v1alpha1_bucketstatestore.yaml\n"})})}),(0,r.jsx)(i.Z,{value:"gitea",label:"Git (on KinD)",children:(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-bash",children:"# Install Gitea and register it as a Git State Store\nkubectl apply --context $PLATFORM --filename https://raw.githubusercontent.com/syntasso/kratix/main/hack/platform/gitea-install.yaml\nkubectl apply --context $PLATFORM --filename https://raw.githubusercontent.com/syntasso/kratix/main/config/samples/platform_v1alpha1_gitstatestore.yaml\n"})})}),(0,r.jsx)(i.Z,{value:"custom",label:"Custom",children:(0,r.jsxs)(t.p,{children:["If your aren't using KinD clusters you will need to create your own State\nStore that is accessible by the platform and worker cluster. Follow the ",(0,r.jsx)(t.a,{href:"/main/reference/statestore/intro",children:"docs\nfor creating State Stores"}),"."]})})]}),"\n",(0,r.jsx)(t.h2,{id:"worker-setup",children:"Set up a worker cluster"}),"\n",(0,r.jsx)(t.h3,{id:"create-worker-cluster",children:"Create worker cluster"}),"\n",(0,r.jsx)(t.p,{children:"If you are not using a pre-existing cluster, create your platform cluster locally using KinD:"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-bash",children:'kind create cluster --image kindest/node:v1.27.3 --name worker\n\n# set WORKER to point to the worker cluster context\nexport WORKER="kind-worker"\n'})}),"\n",(0,r.jsxs)(t.p,{children:["If you are using your own pre-existing cluster, set the ",(0,r.jsx)(t.code,{children:"WORKER"})," environment\nvariable to the name of the kubectl context used to communicate to it."]}),"\n",(0,r.jsx)(l.ZP,{}),"\n",(0,r.jsx)(t.h3,{id:"configure-flux",children:"Configure Flux"}),"\n",(0,r.jsx)(t.p,{children:"Now that Flux is installed, we need to configure it to pull down from the Kratix State Store.\nFollow the steps below that match the State Store you created previously:"}),"\n",(0,r.jsxs)(a.Z,{className:"boxedTabs",groupId:"stateStore",children:[(0,r.jsx)(i.Z,{value:"minio",label:"Bucket (on KinD)",children:(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-bash",children:"# Configure Flux to pull down from MinIO\nkubectl apply --context $WORKER --filename https://raw.githubusercontent.com/syntasso/kratix/main/hack/destination/gitops-tk-resources.yaml\n"})})}),(0,r.jsx)(i.Z,{value:"gitea",label:"Git (on KinD)",children:(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-bash",children:"# Configure Flux to pull down from Gitea\nkubectl apply --context $WORKER --filename https://raw.githubusercontent.com/syntasso/kratix/main/hack/destination/gitops-tk-resources-git.yaml\n"})})}),(0,r.jsxs)(i.Z,{value:"custom",label:"Custom",children:[(0,r.jsx)(t.p,{children:"You will need to manual configure the Flux resources to use the Git/Bucket created."}),(0,r.jsxs)(t.ul,{children:["\n",(0,r.jsxs)(t.li,{children:["Bucket: Download and modify this ",(0,r.jsx)(t.a,{href:"https://raw.githubusercontent.com/syntasso/kratix/main/hack/destination/gitops-tk-resources.yaml",children:"example configuration"}),"\nto use the endpoint, bucket and credentials for your Bucket."]}),"\n",(0,r.jsxs)(t.li,{children:["Git: Download and modify this ",(0,r.jsx)(t.a,{href:"https://raw.githubusercontent.com/syntasso/kratix/main/hack/destination/gitops-tk-resources-git.yaml",children:"example configuration"}),"\nto use the url, branch, and credentials for your Git Repository."]}),"\n"]})]})]}),"\n",(0,r.jsx)(t.h3,{id:"register-cluster-as-a-destination-with-kratix",children:"Register cluster as a Destination with Kratix"}),"\n",(0,r.jsx)(t.p,{children:"The final step is to tell Kratix that the cluster is ready to receive workloads.\nFollow the steps below that match the State Store you created previously:"}),"\n",(0,r.jsxs)(a.Z,{className:"boxedTabs",groupId:"stateStore",children:[(0,r.jsx)(i.Z,{value:"minio",label:"Bucket (on KinD)",children:(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-bash",children:"# Configure Flux to pull down from MinIO\nkubectl apply --context $PLATFORM --filename https://raw.githubusercontent.com/syntasso/kratix/main/config/samples/platform_v1alpha1_worker.yaml\n"})})}),(0,r.jsx)(i.Z,{value:"gitea",label:"Git (on KinD)",children:(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-bash",children:'# Install flux on the worker and configure it to pull down from MinIO\ncurl https://raw.githubusercontent.com/syntasso/kratix/main/config/samples/platform_v1alpha1_worker.yaml | \\\n  sed "s_BucketStateStore_GitStateStore_g" | \\\n  kubectl apply --context $PLATFORM --filename -\n'})})}),(0,r.jsx)(i.Z,{value:"custom",label:"Custom",children:(0,r.jsxs)(t.p,{children:["You will need to manual configure the Destination resources to use created State Store.\nDownload and modify this ",(0,r.jsx)(t.a,{href:"https://raw.githubusercontent.com/syntasso/kratix/main/config/samples/platform_v1alpha1_worker.yaml",children:"example configuration"}),",\nreplacing the ",(0,r.jsx)(t.code,{children:"spec.StateStoreRef.name"}),", ",(0,r.jsx)(t.code,{children:"spec.StateStoreRef.namespace"})," and ",(0,r.jsx)(t.code,{children:"spec.StateStoreRef.kind"}),"\nto match the previously created State Store"]})})]}),"\n",(0,r.jsx)(c.ZP,{})]})}function f(e={}){const{wrapper:t}={...(0,s.a)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(g,{...e})}):g(e)}},5162:(e,t,n)=>{n.d(t,{Z:()=>i});n(7294);var r=n(6905);const s={tabItem:"tabItem_Ymn6"};var a=n(5893);function i(e){let{children:t,hidden:n,className:i}=e;return(0,a.jsx)("div",{role:"tabpanel",className:(0,r.Z)(s.tabItem,i),hidden:n,children:t})}},4866:(e,t,n)=>{n.d(t,{Z:()=>v});var r=n(7294),s=n(6905),a=n(2466),i=n(6550),o=n(469),l=n(1980),c=n(7392),u=n(812);function d(e){return r.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,r.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function h(e){const{values:t,children:n}=e;return(0,r.useMemo)((()=>{const e=t??function(e){return d(e).map((e=>{let{props:{value:t,label:n,attributes:r,default:s}}=e;return{value:t,label:n,attributes:r,default:s}}))}(n);return function(e){const t=(0,c.l)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,n])}function p(e){let{value:t,tabValues:n}=e;return n.some((e=>e.value===t))}function m(e){let{queryString:t=!1,groupId:n}=e;const s=(0,i.k6)(),a=function(e){let{queryString:t=!1,groupId:n}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!n)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return n??null}({queryString:t,groupId:n});return[(0,l._X)(a),(0,r.useCallback)((e=>{if(!a)return;const t=new URLSearchParams(s.location.search);t.set(a,e),s.replace({...s.location,search:t.toString()})}),[a,s])]}function x(e){const{defaultValue:t,queryString:n=!1,groupId:s}=e,a=h(e),[i,l]=(0,r.useState)((()=>function(e){let{defaultValue:t,tabValues:n}=e;if(0===n.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!p({value:t,tabValues:n}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${n.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const r=n.find((e=>e.default))??n[0];if(!r)throw new Error("Unexpected error: 0 tabValues");return r.value}({defaultValue:t,tabValues:a}))),[c,d]=m({queryString:n,groupId:s}),[x,g]=function(e){let{groupId:t}=e;const n=function(e){return e?`docusaurus.tab.${e}`:null}(t),[s,a]=(0,u.Nk)(n);return[s,(0,r.useCallback)((e=>{n&&a.set(e)}),[n,a])]}({groupId:s}),f=(()=>{const e=c??x;return p({value:e,tabValues:a})?e:null})();(0,o.Z)((()=>{f&&l(f)}),[f]);return{selectedValue:i,selectValue:(0,r.useCallback)((e=>{if(!p({value:e,tabValues:a}))throw new Error(`Can't select invalid tab value=${e}`);l(e),d(e),g(e)}),[d,g,a]),tabValues:a}}var g=n(2389);const f={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var k=n(5893);function j(e){let{className:t,block:n,selectedValue:r,selectValue:i,tabValues:o}=e;const l=[],{blockElementScrollPositionUntilNextRender:c}=(0,a.o5)(),u=e=>{const t=e.currentTarget,n=l.indexOf(t),s=o[n].value;s!==r&&(c(t),i(s))},d=e=>{let t=null;switch(e.key){case"Enter":u(e);break;case"ArrowRight":{const n=l.indexOf(e.currentTarget)+1;t=l[n]??l[0];break}case"ArrowLeft":{const n=l.indexOf(e.currentTarget)-1;t=l[n]??l[l.length-1];break}}t?.focus()};return(0,k.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.Z)("tabs",{"tabs--block":n},t),children:o.map((e=>{let{value:t,label:n,attributes:a}=e;return(0,k.jsx)("li",{role:"tab",tabIndex:r===t?0:-1,"aria-selected":r===t,ref:e=>l.push(e),onKeyDown:d,onClick:u,...a,className:(0,s.Z)("tabs__item",f.tabItem,a?.className,{"tabs__item--active":r===t}),children:n??t},t)}))})}function b(e){let{lazy:t,children:n,selectedValue:s}=e;const a=(Array.isArray(n)?n:[n]).filter(Boolean);if(t){const e=a.find((e=>e.props.value===s));return e?(0,r.cloneElement)(e,{className:"margin-top--md"}):null}return(0,k.jsx)("div",{className:"margin-top--md",children:a.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==s})))})}function y(e){const t=x(e);return(0,k.jsxs)("div",{className:(0,s.Z)("tabs-container",f.tabList),children:[(0,k.jsx)(j,{...t,...e}),(0,k.jsx)(b,{...t,...e})]})}function v(e){const t=(0,g.Z)();return(0,k.jsx)(y,{...e,children:d(e.children)},String(t))}},1151:(e,t,n)=>{n.d(t,{Z:()=>o,a:()=>i});var r=n(7294);const s={},a=r.createContext(s);function i(e){const t=r.useContext(a);return r.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function o(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:i(e.components),r.createElement(a.Provider,{value:t},e.children)}}}]);