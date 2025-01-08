"use strict";(self.webpackChunkkratix_docs=self.webpackChunkkratix_docs||[]).push([[4812],{9599:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>o,default:()=>p,frontMatter:()=>s,metadata:()=>a,toc:()=>c});const a=JSON.parse('{"id":"ske/kratix/configuring-ske/via-manifest","title":"Via Manifests","description":"Documentation on how to install the SKE-Operator via the operator manifest directly","source":"@site/docs/ske/01-kratix/10-configuring-ske/12-via-manifest.mdx","sourceDirName":"ske/01-kratix/10-configuring-ske","slug":"/ske/kratix/configuring-ske/via-manifest","permalink":"/ske/kratix/configuring-ske/via-manifest","draft":false,"unlisted":false,"editUrl":"https://github.com/syntasso/kratix-docs/tree/main/docs/ske/01-kratix/10-configuring-ske/12-via-manifest.mdx","tags":[],"version":"current","sidebarPosition":12,"frontMatter":{"title":"Via Manifests","description":"Documentation on how to install the SKE-Operator via the operator manifest directly"},"sidebar":"skeSidebar","previous":{"title":"Via Helm","permalink":"/ske/kratix/configuring-ske/via-helm"},"next":{"title":"Setup for Air-Gapped Environments","permalink":"/ske/kratix/configuring-ske/air-gapped"}}');var r=t(4848),i=t(8453);const s={title:"Via Manifests",description:"Documentation on how to install the SKE-Operator via the operator manifest directly"},o=void 0,l={},c=[{value:"Prerequisites",id:"prerequisites",level:2},{value:"Create the namespace",id:"create-the-namespace",level:3},{value:"Create the Operator configuration",id:"create-the-operator-configuration",level:3},{value:"Deploying the SKE Operator",id:"deploying-the-ske-operator",level:2},{value:"Deploying SKE",id:"deploying-ske",level:2},{value:"Upgrading SKE Operator",id:"upgrading-ske-operator",level:2},{value:"Upgrading SKE",id:"upgrading-ske",level:2},{value:"Upgrade checks",id:"upgrade-checks",level:3},{value:"Handling failures",id:"handling-failures",level:3},{value:"Deleting SKE Operator",id:"deleting-ske-operator",level:2},{value:"Deleting SKE Instance",id:"deleting-ske-instance",level:2}];function d(e){const n={a:"a",admonition:"admonition",code:"code",h2:"h2",h3:"h3",p:"p",pre:"pre",...(0,i.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.h2,{id:"prerequisites",children:"Prerequisites"}),"\n",(0,r.jsx)(n.h3,{id:"create-the-namespace",children:"Create the namespace"}),"\n",(0,r.jsxs)(n.p,{children:["To install the SKE Operator via the ",(0,r.jsx)(n.a,{href:"../../releases/ske-operator",children:"distribution manifest"}),",\nyou will first need to create the ",(0,r.jsx)(n.code,{children:"kratix-platform-system"})," namespace. This is where the\nSKE operator will be installed:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"kubectl create namespace kratix-platform-system\n"})}),"\n",(0,r.jsx)(n.h3,{id:"create-the-operator-configuration",children:"Create the Operator configuration"}),"\n",(0,r.jsx)(n.p,{children:"If you are not running SKE in an air-gapped environment, all you need to do is create a secret with your license token:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"kubectl create secret docker-registry syntasso-registry \\\n  --namespace=kratix-platform-system \\\n  --docker-server=ghcr.io \\\n  --docker-username=syntasso-pkg \\\n  --docker-password=<YOUR TOKEN>\n"})}),"\n",(0,r.jsx)(n.p,{children:"For air-gapped environments, you will need to create a ConfigMap with the following structure:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:"apiVersion: v1\nkind: ConfigMap\nmetadata:\n  creationTimestamp: null\n  name: ske-operator\n  namespace: kratix-platform-system\ndata:\n  config: |\n    releaseStorage:\n      path: # path within the git repository or bucket to look for releases\n      # one of: git or bucket\n      git:\n        secretName: # the name of the secret containing the git credentials\n        repo: # the git repository to look for releases\n        branch: # the branch to look for releases\n      bucket:\n        name: # the name of the bucket to look for releases\n        endpoint: # the endpoint of the bucket\n        region: # the region of the bucket\n        secretName: # optional: the name of the secret containing the credentials to access the bucket\n    imageRegistry:\n      host: # the host of the image registry\n      pullSecret: # optional: the name of the secret containing the image registry credentials\n      platformImage: # the image of the platform\n      pipelineImage: # the image of the pipeline adapter\n"})}),"\n",(0,r.jsxs)(n.p,{children:["Refer to the ",(0,r.jsx)(n.a,{href:"./air-gapped",children:"air-gapped installations"})," section for more\ninformation on how to configure the underlying storage and image registry, as\nwell as the expected structure of the referenced secrets."]}),"\n",(0,r.jsx)(n.h2,{id:"deploying-the-ske-operator",children:"Deploying the SKE Operator"}),"\n",(0,r.jsxs)(n.p,{children:["With all of the prerequisites in place, the platform is now ready to deploy the\nSKE Operator. Locate the desired release of the SKE-Operator and apply its\nmanifest with ",(0,r.jsx)(n.code,{children:"kubectl"}),":"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"kubectl apply -f http://s3.eu-west-2.amazonaws.com/syntasso-enterprise-releases/ske-operator/<VERSION>/ske-operator-distribution.yaml\n"})}),"\n",(0,r.jsxs)(n.p,{children:["Applying the manifest will install the SKE Operator in the\n",(0,r.jsx)(n.code,{children:"kratix-platform-system"})," namespace, together with a Kratix Custom Resource\nDefinition (CRD) that allows you to manage the Syntasso Kratix Enterprise installation."]}),"\n",(0,r.jsx)(n.h2,{id:"deploying-ske",children:"Deploying SKE"}),"\n",(0,r.jsx)(n.p,{children:"The SKE Operator includes a custom resource definition (CRD) for managing\nSKE. Only one instance of SKE can be created by the SKE Operator in a\ngiven cluster."}),"\n",(0,r.jsxs)(n.p,{children:["To deploy SKE, create a file named ",(0,r.jsx)(n.code,{children:"ske-instance.yaml"})," with the following contents:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:"apiVersion: platform.syntasso.io/v1alpha1\nkind: Kratix\nmetadata:\n  name: my-kratix\nspec:\n  version: v0.99.0 # The desired version of SKE\n"})}),"\n",(0,r.jsxs)(n.p,{children:["Apply the file with ",(0,r.jsx)(n.code,{children:"kubectl"}),":"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"kubectl apply --filename ske-instance.yaml\n"})}),"\n",(0,r.jsxs)(n.p,{children:["The operator will then install SKE and its necessary configurations. For more\ninformation about the Kratix CRD, see the ",(0,r.jsx)(n.a,{href:"../ske-operator",children:"SKE Operator"}),"\ndocumentation."]}),"\n",(0,r.jsx)(n.h2,{id:"upgrading-ske-operator",children:"Upgrading SKE Operator"}),"\n",(0,r.jsx)(n.p,{children:"To upgrade the SKE Operator, you can apply the new manifest directly:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"kubectl apply -f http://s3.eu-west-2.amazonaws.com/syntasso-enterprise-releases/ske-operator/<NEW-VERSION>/ske-operator-distribution.yaml\n"})}),"\n",(0,r.jsx)(n.h2,{id:"upgrading-ske",children:"Upgrading SKE"}),"\n",(0,r.jsx)(n.p,{children:"To upgrade the SKE instance, you can apply a new version of the Kratix CRD:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:"apiVersion: platform.syntasso.io/v1alpha1\nkind: Kratix\nmetadata:\n  name: my-kratix\nspec:\n  version: v0.100.0 # New desired version\n"})}),"\n",(0,r.jsx)(n.h3,{id:"upgrade-checks",children:"Upgrade checks"}),"\n",(0,r.jsxs)(n.p,{children:["The SKE Operator will perform ",(0,r.jsx)(n.a,{href:"../ske-operator#pre-upgrade-checks",children:"pre-upgrade checks"}),"\nand ",(0,r.jsx)(n.a,{href:"../ske-operator#post-upgrade-checks",children:"post-upgrade checks"})," as part of the upgrade flow."]}),"\n",(0,r.jsxs)(n.p,{children:["To skip these checks, you can add the\n",(0,r.jsx)(n.code,{children:"ske.syntasso.io/skip-all-upgrade-checks"})," label when updating your ",(0,r.jsx)(n.code,{children:".spec.version"}),":"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:'apiVersion: platform.syntasso.io/v1alpha1\nkind: Kratix\nmetadata:\n  name: my-kratix\n  #highlight-start\n  labels:\n    ske.syntasso.io/skip-all-upgrade-checks: "true"\n  #highlight-end\nspec:\n  version: v0.100.0 # New desired version\n'})}),"\n",(0,r.jsx)(n.admonition,{type:"tip",children:(0,r.jsx)(n.p,{children:"Skipping checks can be useful when you need to upgrade SKE while its current state is\nunhealthy."})}),"\n",(0,r.jsx)(n.h3,{id:"handling-failures",children:"Handling failures"}),"\n",(0,r.jsxs)(n.p,{children:["If any upgrade step fails, the SKE Operator will continue looping its reconciliation of\nthe Kratix resource to pick up any manual fixes. See the section on ",(0,r.jsx)(n.a,{href:"../ske-operator#handling-failures",children:"handling\nfailures"})," for more details."]}),"\n",(0,r.jsx)(n.h2,{id:"deleting-ske-operator",children:"Deleting SKE Operator"}),"\n",(0,r.jsx)(n.p,{children:"To delete the SKE Operator (and any deployed SKE instance), run the following command:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"kubectl delete -f http://s3.eu-west-2.amazonaws.com/syntasso-enterprise-releases/ske-operator/<VERSION>/ske-operator-distribution.yaml\n"})}),"\n",(0,r.jsx)(n.admonition,{type:"warning",children:(0,r.jsx)(n.p,{children:"This will delete the SKE Operator and any deployed SKE instance, including all Promises\nand Resource Requests."})}),"\n",(0,r.jsx)(n.h2,{id:"deleting-ske-instance",children:"Deleting SKE Instance"}),"\n",(0,r.jsx)(n.p,{children:"To delete the SKE instance, run the following command:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"kubectl delete kratixes my-kratix\n"})})]})}function p(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(d,{...e})}):d(e)}},8453:(e,n,t)=>{t.d(n,{R:()=>s,x:()=>o});var a=t(6540);const r={},i=a.createContext(r);function s(e){const n=a.useContext(i);return a.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:s(e.components),a.createElement(i.Provider,{value:n},e.children)}}}]);