"use strict";(self.webpackChunkkratix_docs=self.webpackChunkkratix_docs||[]).push([[8620],{9060:(e,n,t)=>{t.d(n,{ZP:()=>o,d$:()=>s});var r=t(5893),a=t(1151);const s=[];function i(e){const n={a:"a",code:"code",li:"li",p:"p",pre:"pre",ul:"ul",...(0,a.a)(),...e.components},{Details:t}=n;return t||function(e,n){throw new Error("Expected "+(n?"component":"object")+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}("Details",!0),(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(n.p,{children:["Kratix requires a set of certificates in order to deploy its internal\n",(0,r.jsx)(n.a,{href:"https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/",children:"Validating and Mutating Kubernetes\nwebhooks"}),".\nBy default Kratix is configured to use ",(0,r.jsx)(n.a,{href:"https://cert-manager.io/",children:"cert-manager"})," to\ngenerate the certificates, therefore we need to install cert-manager. If you already\nhave it installed, skip to the next section."]}),"\n",(0,r.jsxs)(t,{children:[(0,r.jsx)("summary",{children:" Don't want to use cert-manager? Manually provide the required\ncertificates "}),(0,r.jsx)(n.p,{children:"Cert-manager is used to generate a CA, and a key/cert pair which is\nconfigured for the following DNS names:"}),(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.code,{children:"kratix-platform-webhook-service.kratix-platform-system.svc.cluster.local"})}),"\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.code,{children:"kratix-platform-webhook-service.kratix-platform-system.svc"})}),"\n"]}),(0,r.jsxs)(n.p,{children:["To manually provide the required certificates, you need to create the\n",(0,r.jsx)(n.code,{children:"webhook-server-cert"})," secret in the ",(0,r.jsx)(n.code,{children:"kratix-platform-system"})," namespace with the\nfollowing keys:"]}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:"apiVersion: v1\ndata:\n  ca.crt: # Base64 CA certificate\n  tls.crt: # Base64 encoded Server certificate\n  tls.key: # Base64 encoded Server private key\nkind: Secret\nmetadata:\n  name: webhook-server-cert\n  namespace: kratix-platform-system\ntype: kubernetes.io/tls\n"})}),(0,r.jsxs)(n.p,{children:["As part of installing Kratix we create a few resources that require the CA\ncertificate. You will have to manually add the CA certificate to the resources\nmentioned below, and manually remove the cert-manager ",(0,r.jsx)(n.code,{children:"Certificate"})," and ",(0,r.jsx)(n.code,{children:"Issuer"}),"\nresources. The following resources need to be updated to contain the Base64\nencoded CA certificate:"]}),(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.code,{children:"MutatingWebhookConfiguration/kratix-platform-mutating-webhook-configuration"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{children:"apiVersion: admissionregistration.k8s.io/v1\nkind: MutatingWebhookConfiguration\nmetadata:\n  name: kratix-platform-mutating-webhook-configuration\nwebhooks:\n- admissionReviewVersions:\n  - v1\n  clientConfig:\n    caBundle: .... #  there might be multiple admissionReviewVersions, ensure you update all of them\n"})}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.code,{children:"ValidatingWebhookConfiguration/kratix-platform-validating-webhook-configuration"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{children:"apiVersion: admissionregistration.k8s.io/v1\nkind: ValidatingWebhookConfiguration\nmetadata:\n  name: kratix-platform-validating-webhook-configuration\nwebhooks:\n- admissionReviewVersions:\n  - v1\n  clientConfig:\n    caBundle: .... #  there might be multiple admissionReviewVersions, ensure you update all of them\n"})}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.code,{children:"CustomResourceDefinition/promises.platform.kratix.io"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{children:"apiVersion: apiextensions.k8s.io/v1\nkind: CustomResourceDefinition\nmetadata:\n  name: promises.platform.kratix.io\nspec:\n  conversion:\n    strategy: Webhook\n    webhook:\n      clientConfig:\n        caBundle: ....\n"})}),"\n"]}),"\n"]}),(0,r.jsx)(n.p,{children:"Lastly, you need to remove the following cert-manager Issuer and Certificate from Kratix release manifest:"}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:"---\n...\napiVersion: cert-manager.io/v1\nkind: Certificate\nmetadata:\n  name: kratix-platform-serving-cert\n  namespace: kratix-platform-system\nspec:\n...\n---\napiVersion: cert-manager.io/v1\nkind: Issuer\nmetadata:\n  name: kratix-platform-selfsigned-issuer\n  namespace: kratix-platform-system\nspec:\n...\n"})})]}),"\n",(0,r.jsx)(n.p,{children:"To install it, run:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"kubectl --context $PLATFORM apply --filename https://github.com/cert-manager/cert-manager/releases/download/v1.15.0/cert-manager.yaml\n"})}),"\n",(0,r.jsxs)(n.p,{children:["Make sure that ",(0,r.jsx)(n.code,{children:"cert-manager"})," is ready before installing Kratix:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell-session",children:"$ kubectl --context $PLATFORM get pods --namespace cert-manager\nNAME                                      READY   STATUS    RESTARTS   AGE\ncert-manager-7476c8fcf4-r8cnd             1/1     Running   0          19s\ncert-manager-cainjector-bdd866bd4-7d8zp   1/1     Running   0          19s\ncert-manager-webhook-5655dcfb4b-54r49     1/1     Running   0          19s\n"})})]})}function o(e={}){const{wrapper:n}={...(0,a.a)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(i,{...e})}):i(e)}},5340:(e,n,t)=>{t.d(n,{ZP:()=>o,d$:()=>s});var r=t(5893),a=t(1151);const s=[];function i(e){const n={a:"a",code:"code",p:"p",pre:"pre",strong:"strong",...(0,a.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(n.p,{children:["Flux will eventually reconcile the cluster's state, making the ",(0,r.jsx)(n.code,{children:"worker"})," cluster ready\nto receive workloads. You can verify its readiness by observing the ",(0,r.jsx)(n.code,{children:"kratix-worker-system"}),"\nnamespace appearing in the ",(0,r.jsx)(n.code,{children:"worker"})," cluster:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell-session",children:"$ kubectl --context $WORKER get namespace kratix-worker-system\nNAME                   STATUS   AGE\nkratix-worker-system   Active   1m\n"})}),"\n",(0,r.jsxs)(n.p,{children:["\ud83c\udf89   ",(0,r.jsx)(n.strong,{children:"Congratulations!"})," Kratix is now installed! Jump to ",(0,r.jsx)(n.a,{href:"installing-a-promise",children:"Installing and using a Promise"})," to spin up your first as-a-service offering."]})]})}function o(e={}){const{wrapper:n}={...(0,a.a)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(i,{...e})}):i(e)}},8968:(e,n,t)=>{t.d(n,{ZP:()=>o,d$:()=>s});var r=t(5893),a=t(1151);const s=[{value:"Configure Flux",id:"configure-flux",level:3}];function i(e){const n={a:"a",code:"code",h3:"h3",li:"li",p:"p",pre:"pre",ul:"ul",...(0,a.a)(),...e.components},{Details:t}=n;return t||function(e,n){throw new Error("Expected "+(n?"component":"object")+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}("Details",!0),(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.h3,{id:"configure-flux",children:"Configure Flux"}),"\n",(0,r.jsxs)(n.p,{children:["Configure ",(0,r.jsx)(n.a,{href:"https://fluxcd.io",children:"Flux"})," to use the state store you created earlier:"]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["If you are using a Git repository as your state store, follow the steps in the\n",(0,r.jsx)(n.a,{href:"https://fluxcd.io/flux/components/source/gitrepositories/",children:"FluxCD docs"})," for\ncreating a ",(0,r.jsx)(n.code,{children:"GitRepository"})," resource"]}),"\n",(0,r.jsxs)(n.li,{children:["If you are using a Bucket as your state store, follow the steps in the\n",(0,r.jsx)(n.a,{href:"https://fluxcd.io/flux/components/source/buckets/",children:"FluxCD docs"})," for\ncreating a ",(0,r.jsx)(n.code,{children:"Bucket"})," resource"]}),"\n"]}),"\n",(0,r.jsxs)(n.p,{children:["Then create two ",(0,r.jsx)(n.code,{children:"Kustomization"})," resources, one for the workload resources and\none for the dependencies, using the template below:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:"---\napiVersion: kustomize.toolkit.fluxcd.io/v1beta1\nkind: Kustomization\nmetadata:\n  name: kratix-workload-resources\n  namespace: <Same namespace as the Bucket/GitRepository>\nspec:\n  interval: 3s\n  prune: true\n  dependsOn:\n    - name: kratix-workload-dependencies\n  sourceRef:\n    kind: <Bucket or GitRepository>\n    name: <Name of Bucket/GitRepository>\n  path: ./worker/resources\n  validation: client\n---\napiVersion: kustomize.toolkit.fluxcd.io/v1beta1\nkind: Kustomization\nmetadata:\n  name: kratix-workload-dependencies\n  namespace: <Same namespace as the Bucket/GitRepository>\nspec:\n  interval: 8s\n  prune: true\n  sourceRef:\n    kind: <Bucket or GitRepository>\n    name: <Name of Bucket/GitRepository>\n  path: ./worker/dependencies\n  validation: client\n"})}),"\n",(0,r.jsxs)(t,{children:[(0,r.jsx)("summary",{children:"Example complete set of Flux resources"}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:"---\napiVersion: source.toolkit.fluxcd.io/v1beta1\nkind: Bucket\nmetadata:\n  name: kratix-bucket\n  namespace: flux-system\nspec:\n  interval: 10s\n  provider: generic\n  bucketName: kratix\n  endpoint: 172.18.0.2:31337\n  insecure: true\n  secretRef:\n    name: minio-credentials\n---\napiVersion: v1\nkind: Secret\nmetadata:\n  name: minio-credentials\n  namespace: flux-system\ntype: Opaque\ndata:\n  accesskey: bWluaW9hZG1pbg==\n  secretkey: bWluaW9hZG1pbg==\n---\napiVersion: kustomize.toolkit.fluxcd.io/v1beta1\nkind: Kustomization\nmetadata:\n  name: kratix-workload-resources\n  namespace: flux-system\nspec:\n  interval: 3s\n  prune: true\n  dependsOn:\n    - name: kratix-workload-dependencies\n  sourceRef:\n    kind: Bucket\n    name: kratix-bucket\n  path: ./worker/resources\n  validation: client\n---\napiVersion: kustomize.toolkit.fluxcd.io/v1beta1\nkind: Kustomization\nmetadata:\n  name: kratix-workload-dependencies\n  namespace: flux-system\nspec:\n  interval: 8s\n  prune: true\n  sourceRef:\n    kind: Bucket\n    name: kratix-bucket\n  path: ./worker/dependencies\n  validation: client\n"})})]}),"\n",(0,r.jsx)(n.p,{children:"Once filled in with the correct values, apply the resource to the platform cluster:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"kubectl apply --context $WORKER --filename <path-to-git-or-bucket-resource>\nkubectl apply --context $WORKER --filename <path-to-kustomization-resource>\n"})})]})}function o(e={}){const{wrapper:n}={...(0,a.a)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(i,{...e})}):i(e)}},491:(e,n,t)=>{t.d(n,{ZP:()=>o,d$:()=>s});var r=t(5893),a=t(1151);const s=[{value:"Install Flux",id:"install-flux",level:3}];function i(e){const n={a:"a",code:"code",h3:"h3",p:"p",pre:"pre",strong:"strong",...(0,a.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.h3,{id:"install-flux",children:"Install Flux"}),"\n",(0,r.jsxs)(n.p,{children:["Follow the ",(0,r.jsx)(n.a,{href:"https://fluxcd.io/flux/installation/",children:"Flux installation guide"})," to\ninstall Flux, or if you are just using this cluster for testing you can use the\nfollowing manifest (",(0,r.jsx)(n.strong,{children:"NOT to be used for production"}),"). Other GitOps tools are\navailable, such as ArgoCD."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"kubectl apply --context $WORKER --filename https://raw.githubusercontent.com/syntasso/kratix/main/hack/destination/gitops-tk-install.yaml\n"})}),"\n",(0,r.jsxs)(n.p,{children:["Make sure that ",(0,r.jsx)(n.code,{children:"flux"})," is ready before proceeding:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell-session",children:"$ kubectl --context $WORKER get pods --namespace flux-system\nNAME                                       READY   STATUS    RESTARTS   AGE\nhelm-controller-5f7457c9dd-s5qzt           1/1     Running   0          18s\nkustomize-controller-5f58d55f76-hwm5w      1/1     Running   0          19s\nnotification-controller-685bdc466d-5xmk8   1/1     Running   0          16s\nsource-controller-86b8b57796-t6xgg         1/1     Running   0          20s\n"})})]})}function o(e={}){const{wrapper:n}={...(0,a.a)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(i,{...e})}):i(e)}},6609:(e,n,t)=>{t.d(n,{ZP:()=>l,d$:()=>i});var r=t(5893),a=t(1151),s=t(9060);const i=[{value:"Install cert-manager",id:"install-cert-manager",level:2},...s.d$,{value:"Install Kratix",id:"install-kratix",level:2}];function o(e){const n={a:"a",code:"code",h2:"h2",p:"p",pre:"pre",...(0,a.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.h2,{id:"install-cert-manager",children:"Install cert-manager"}),"\n",(0,r.jsx)(s.ZP,{}),"\n",(0,r.jsx)(n.h2,{id:"install-kratix",children:"Install Kratix"}),"\n",(0,r.jsx)(n.p,{children:"Install Kratix on the Platform Cluster."}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"kubectl apply --context $PLATFORM --filename https://github.com/syntasso/kratix/releases/latest/download/kratix.yaml\n"})}),"\n",(0,r.jsxs)(n.p,{children:["You can also install and configure Kratix with Helm. For more information, see\nthe ",(0,r.jsx)(n.a,{href:"https://github.com/syntasso/helm-charts",children:"Helm Chart"})," documentation."]}),"\n",(0,r.jsxs)(n.p,{children:["Make sure that ",(0,r.jsx)(n.code,{children:"kratix"})," is ready before proceeding:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell-session",children:"$ kubectl --context $PLATFORM get pods --namespace kratix-platform-system\nNAME                                                 READY   STATUS    RESTARTS   AGE\nkratix-platform-controller-manager-78d57569b-bn4t4   2/2     Running   0          25s\n"})})]})}function l(e={}){const{wrapper:n}={...(0,a.a)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(o,{...e})}):o(e)}},433:(e,n,t)=>{t.d(n,{ZP:()=>o,d$:()=>s});var r=t(5893),a=t(1151);const s=[{value:"Register cluster as a Destination with Kratix",id:"register-cluster-as-a-destination-with-kratix",level:3}];function i(e){const n={a:"a",code:"code",h3:"h3",p:"p",pre:"pre",...(0,a.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.h3,{id:"register-cluster-as-a-destination-with-kratix",children:"Register cluster as a Destination with Kratix"}),"\n",(0,r.jsxs)(n.p,{children:["We need to register the cluster with Kratix so that it can be used as a\ndestination for deploying to. Use the template below to create a\n",(0,r.jsx)(n.code,{children:"Worker"})," ",(0,r.jsx)(n.a,{href:"/main/reference/destinations/intro",children:"Destination"})," resource:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:"apiVersion: platform.kratix.io/v1alpha1\nkind: Destination\nmetadata:\n  name: worker\n  labels:\n    environment: dev\nspec:\n  stateStoreRef:\n    name: default\n    kind: <BucketStateStore or GitStateStore>\n"})}),"\n",(0,r.jsx)(n.p,{children:"Once filled in with the correct values, apply the resource to the platform cluster:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"kubectl apply --context $PLATFORM --filename <path-to-worker-destination-resource>\n"})})]})}function o(e={}){const{wrapper:n}={...(0,a.a)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(i,{...e})}):i(e)}},911:(e,n,t)=>{t.d(n,{ZP:()=>o,d$:()=>s});var r=t(5893),a=t(1151);const s=[{value:"Set up State Store",id:"set-up-state-store",level:2}];function i(e){const n={a:"a",h2:"h2",p:"p",...(0,a.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.h2,{id:"set-up-state-store",children:"Set up State Store"}),"\n",(0,r.jsxs)(n.p,{children:["Kratix uses GitOps to provision resources on the worker clusters. You can\nconfigure Kratix with multiple GitOps repositories by creating ",(0,r.jsx)(n.a,{href:"/main/reference/statestore/intro",children:"State\nStores"}),". Kratix supports ",(0,r.jsx)(n.a,{href:"/main/reference/statestore/bucketstatestore",children:"Bucket State\nStore"})," and ",(0,r.jsx)(n.a,{href:"/main/reference/statestore/gitstatestore",children:"Git State\nStore"}),"."]}),"\n",(0,r.jsx)(n.p,{children:"Using a Git State Store is recommended for production environments as it provides\nbetter security and version control. However, for development and testing\npurposes, you can also use the Bucket State Store."})]})}function o(e={}){const{wrapper:n}={...(0,a.a)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(i,{...e})}):i(e)}},7786:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>m,contentTitle:()=>p,default:()=>g,frontMatter:()=>d,metadata:()=>h,toc:()=>x});var r=t(5893),a=t(1151),s=(t(4866),t(5162),t(6609)),i=t(491),o=t(5340),l=t(911),c=t(8968),u=t(433);const d={description:"Run Kratix",slug:"/main/guides/installing-kratix-GKE",title:"Google Kubernetes Engine (GKE)"},p=void 0,h={id:"main/guides/installing-kratix/gcp",title:"Google Kubernetes Engine (GKE)",description:"Run Kratix",source:"@site/docs/main/04-guides/01-installing-kratix/03-gcp.mdx",sourceDirName:"main/04-guides/01-installing-kratix",slug:"/main/guides/installing-kratix-GKE",permalink:"/main/guides/installing-kratix-GKE",draft:!1,unlisted:!1,editUrl:"https://github.com/syntasso/kratix-docs/tree/main/docs/main/04-guides/01-installing-kratix/03-gcp.mdx",tags:[],version:"current",sidebarPosition:3,frontMatter:{description:"Run Kratix",slug:"/main/guides/installing-kratix-GKE",title:"Google Kubernetes Engine (GKE)"},sidebar:"mainSidebar",previous:{title:"Amazon Elastic Kubernetes Service (EKS)",permalink:"/main/guides/installing-kratix-EKS"},next:{title:"Others (KinD etc)",permalink:"/main/guides/installing-kratix-others"}},m={},x=[{value:"Set up Platform Cluster",id:"platform-setup",level:2},...s.d$,...l.d$,...u.d$,{value:"Set up Worker Cluster",id:"worker-setup",level:2},...i.d$,...c.d$,...o.d$];function f(e){const n={a:"a",code:"code",h2:"h2",li:"li",p:"p",pre:"pre",ul:"ul",...(0,a.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("div",{style:{"text-align":"center"},children:(0,r.jsx)("iframe",{width:"560",height:"315",src:"https://www.youtube.com/embed/Zkh3FIGMsds?si=omdR7K0HTuvbw60P",title:"YouTube video player",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",allowfullscreen:!0})}),"\n",(0,r.jsx)(n.h2,{id:"platform-setup",children:"Set up Platform Cluster"}),"\n",(0,r.jsxs)(n.p,{children:["If you are not using a pre-existing cluster, create your Platform Cluster by\nfollowing the ",(0,r.jsx)(n.a,{href:"https://cloud.google.com/kubernetes-engine/docs/concepts/kubernetes-engine-overview",children:"GKE getting started docs"})]}),"\n",(0,r.jsxs)(n.p,{children:["Once completed, log in to your cluster using the ",(0,r.jsx)(n.code,{children:"gcloud"})," cli and set the ",(0,r.jsx)(n.code,{children:"PLATFORM"})," environment\nvariable:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"gcloud container clusters get-credentials <cluster-name> --zone <zone> --project <project-name>\nkubectl config current-context\nexport PLATFORM=<platform-context-name>\n"})}),"\n",(0,r.jsx)(s.ZP,{}),"\n",(0,r.jsx)(l.ZP,{}),"\n",(0,r.jsx)(n.p,{children:"If you have a pre-existing Git repository or S3-Compatible Bucket you can use that as your\nstate store. If not you can either:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["Create a new Git repository on your Git provider of choice and use it as your state\nstore. See ",(0,r.jsx)(n.a,{href:"/main/reference/statestore/gitstatestore",children:"Git State Store"})," for\nmore information."]}),"\n",(0,r.jsxs)(n.li,{children:["Create a ",(0,r.jsx)(n.a,{href:"https://cloud.google.com/storage/docs/creating-buckets",children:"GCP Bucket"}),"\n(anything that implements the S3 API will work) and then use it as your state\nstore. See ",(0,r.jsx)(n.a,{href:"/main/reference/statestore/bucketstatestore",children:"Bucket State Store"}),"\nfor more information. You will have to create a set of ",(0,r.jsx)(n.a,{href:"https://cloud.google.com/storage/docs/interoperability",children:"S3-Compatible\ncredentials"})," for\nKratix to use."]}),"\n"]}),"\n",(0,r.jsx)(u.ZP,{}),"\n",(0,r.jsx)(n.h2,{id:"worker-setup",children:"Set up Worker Cluster"}),"\n",(0,r.jsxs)(n.p,{children:["If you are not using a pre-existing cluster, create a Worker Cluster following\nthe same steps as the ",(0,r.jsx)(n.a,{href:"#platform-setup",children:"Platform Cluster setup"}),"."]}),"\n",(0,r.jsxs)(n.p,{children:["Once completed, log in to your cluster using the ",(0,r.jsx)(n.code,{children:"gcloud"})," cli and set the ",(0,r.jsx)(n.code,{children:"WORKER"})," environment\nvariable:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"gcloud container clusters get-credentials <cluster-name> --zone <zone> --project <project-name>\nkubectl config current-context\nexport WORKER=<worker-context-name>\n"})}),"\n",(0,r.jsx)(i.ZP,{}),"\n",(0,r.jsx)(c.ZP,{}),"\n",(0,r.jsx)(o.ZP,{})]})}function g(e={}){const{wrapper:n}={...(0,a.a)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(f,{...e})}):f(e)}},5162:(e,n,t)=>{t.d(n,{Z:()=>i});t(7294);var r=t(6905);const a={tabItem:"tabItem_Ymn6"};var s=t(5893);function i(e){let{children:n,hidden:t,className:i}=e;return(0,s.jsx)("div",{role:"tabpanel",className:(0,r.Z)(a.tabItem,i),hidden:t,children:n})}},4866:(e,n,t)=>{t.d(n,{Z:()=>y});var r=t(7294),a=t(6905),s=t(2466),i=t(6550),o=t(469),l=t(1980),c=t(7392),u=t(812);function d(e){return r.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,r.isValidElement)(e)&&function(e){const{props:n}=e;return!!n&&"object"==typeof n&&"value"in n}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function p(e){const{values:n,children:t}=e;return(0,r.useMemo)((()=>{const e=n??function(e){return d(e).map((e=>{let{props:{value:n,label:t,attributes:r,default:a}}=e;return{value:n,label:t,attributes:r,default:a}}))}(t);return function(e){const n=(0,c.l)(e,((e,n)=>e.value===n.value));if(n.length>0)throw new Error(`Docusaurus error: Duplicate values "${n.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[n,t])}function h(e){let{value:n,tabValues:t}=e;return t.some((e=>e.value===n))}function m(e){let{queryString:n=!1,groupId:t}=e;const a=(0,i.k6)(),s=function(e){let{queryString:n=!1,groupId:t}=e;if("string"==typeof n)return n;if(!1===n)return null;if(!0===n&&!t)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return t??null}({queryString:n,groupId:t});return[(0,l._X)(s),(0,r.useCallback)((e=>{if(!s)return;const n=new URLSearchParams(a.location.search);n.set(s,e),a.replace({...a.location,search:n.toString()})}),[s,a])]}function x(e){const{defaultValue:n,queryString:t=!1,groupId:a}=e,s=p(e),[i,l]=(0,r.useState)((()=>function(e){let{defaultValue:n,tabValues:t}=e;if(0===t.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(n){if(!h({value:n,tabValues:t}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${n}" but none of its children has the corresponding value. Available values are: ${t.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return n}const r=t.find((e=>e.default))??t[0];if(!r)throw new Error("Unexpected error: 0 tabValues");return r.value}({defaultValue:n,tabValues:s}))),[c,d]=m({queryString:t,groupId:a}),[x,f]=function(e){let{groupId:n}=e;const t=function(e){return e?`docusaurus.tab.${e}`:null}(n),[a,s]=(0,u.Nk)(t);return[a,(0,r.useCallback)((e=>{t&&s.set(e)}),[t,s])]}({groupId:a}),g=(()=>{const e=c??x;return h({value:e,tabValues:s})?e:null})();(0,o.Z)((()=>{g&&l(g)}),[g]);return{selectedValue:i,selectValue:(0,r.useCallback)((e=>{if(!h({value:e,tabValues:s}))throw new Error(`Can't select invalid tab value=${e}`);l(e),d(e),f(e)}),[d,f,s]),tabValues:s}}var f=t(2389);const g={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var k=t(5893);function j(e){let{className:n,block:t,selectedValue:r,selectValue:i,tabValues:o}=e;const l=[],{blockElementScrollPositionUntilNextRender:c}=(0,s.o5)(),u=e=>{const n=e.currentTarget,t=l.indexOf(n),a=o[t].value;a!==r&&(c(n),i(a))},d=e=>{let n=null;switch(e.key){case"Enter":u(e);break;case"ArrowRight":{const t=l.indexOf(e.currentTarget)+1;n=l[t]??l[0];break}case"ArrowLeft":{const t=l.indexOf(e.currentTarget)-1;n=l[t]??l[l.length-1];break}}n?.focus()};return(0,k.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,a.Z)("tabs",{"tabs--block":t},n),children:o.map((e=>{let{value:n,label:t,attributes:s}=e;return(0,k.jsx)("li",{role:"tab",tabIndex:r===n?0:-1,"aria-selected":r===n,ref:e=>l.push(e),onKeyDown:d,onClick:u,...s,className:(0,a.Z)("tabs__item",g.tabItem,s?.className,{"tabs__item--active":r===n}),children:t??n},n)}))})}function b(e){let{lazy:n,children:t,selectedValue:a}=e;const s=(Array.isArray(t)?t:[t]).filter(Boolean);if(n){const e=s.find((e=>e.props.value===a));return e?(0,r.cloneElement)(e,{className:"margin-top--md"}):null}return(0,k.jsx)("div",{className:"margin-top--md",children:s.map(((e,n)=>(0,r.cloneElement)(e,{key:n,hidden:e.props.value!==a})))})}function v(e){const n=x(e);return(0,k.jsxs)("div",{className:(0,a.Z)("tabs-container",g.tabList),children:[(0,k.jsx)(j,{...n,...e}),(0,k.jsx)(b,{...n,...e})]})}function y(e){const n=(0,f.Z)();return(0,k.jsx)(v,{...e,children:d(e.children)},String(n))}},1151:(e,n,t)=>{t.d(n,{Z:()=>o,a:()=>i});var r=t(7294);const a={},s=r.createContext(a);function i(e){const n=r.useContext(s);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:i(e.components),r.createElement(s.Provider,{value:n},e.children)}}}]);