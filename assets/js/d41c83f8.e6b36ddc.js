"use strict";(self.webpackChunkkratix_docs=self.webpackChunkkratix_docs||[]).push([[1900],{909:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>i,default:()=>h,frontMatter:()=>r,metadata:()=>o,toc:()=>c});var s=t(5893),a=t(1151);const r={title:"Installation via Helm",description:"Installing Syntasso Kratix Enterprise",sidebar_label:"Installation via Helm"},i=void 0,o={id:"ske/kratix/helm-installation",title:"Installation via Helm",description:"Installing Syntasso Kratix Enterprise",source:"@site/docs/ske/01-kratix/02-helm-installation.mdx",sourceDirName:"ske/01-kratix",slug:"/ske/kratix/helm-installation",permalink:"/ske/kratix/helm-installation",draft:!1,unlisted:!1,editUrl:"https://github.com/syntasso/kratix-docs/tree/main/docs/ske/01-kratix/02-helm-installation.mdx",tags:[],version:"current",sidebarPosition:2,frontMatter:{title:"Installation via Helm",description:"Installing Syntasso Kratix Enterprise",sidebar_label:"Installation via Helm"},sidebar:"skeSidebar",previous:{title:"Installation via SKE CLI",permalink:"/ske/kratix/ske-cli-installation"},next:{title:"ske-cli-introduction",permalink:"/ske/ske-cli/ske-cli-intro"}},l={},c=[{value:"Install SKE operator",id:"install-ske-operator",level:2},{value:"Verify the installation",id:"verify-the-installation",level:3},{value:"Upgrades",id:"upgrades",level:2},{value:"Upgrading the Operator",id:"upgrading-the-operator",level:3},{value:"Upgrading the SKE Instance",id:"upgrading-the-ske-instance",level:3},{value:"Deletes",id:"deletes",level:2},{value:"Deleting the SKE Operator",id:"deleting-the-ske-operator",level:3},{value:"Deleting the SKE Instance",id:"deleting-the-ske-instance",level:3},{value:"Air-gapped installations",id:"air-gapped-installations",level:2},{value:"Image Registry",id:"image-registry",level:3},{value:"SKE Manifests",id:"ske-manifests",level:3},{value:"Setting up your Platform cluster",id:"setting-up-your-platform-cluster",level:3},{value:"Deploying the SKE Operator",id:"deploying-the-ske-operator",level:3}];function d(e){const n={a:"a",admonition:"admonition",code:"code",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",ul:"ul",...(0,a.a)(),...e.components},{Details:t}=n;return t||function(e,n){throw new Error("Expected "+(n?"component":"object")+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}("Details",!0),(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.p,{children:"Syntasso Kratix Enterprise images are distributed through a private image registry. To\ninstall SKE on your Kubernetes cluster, follow the steps below."}),"\n",(0,s.jsx)(n.h2,{id:"install-ske-operator",children:"Install SKE operator"}),"\n",(0,s.jsx)(n.admonition,{type:"info",children:(0,s.jsxs)(n.p,{children:["Syntasso Kratix Enterprise requires cert-manager to be installed on the cluster. Please\nrefer to ",(0,s.jsx)(n.a,{href:"https://cert-manager.io/",children:"its documentation for installation instructions"}),"."]})}),"\n",(0,s.jsx)(n.p,{children:"To install SKE operator using the Helm chart, start by adding the Syntasso Helm\nrepository:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"helm repo add syntasso https://syntasso.github.io/helm-charts\nhelm repo update\n"})}),"\n",(0,s.jsx)(n.p,{children:"Next, install the SKE Operator:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"helm install ske-operator syntasso/ske-operator \\\n  --namespace kratix-platform-system \\\n  --create-namespace \\\n  --set skeDeployment.enabled=true \\\n  --set skeDeployment.version=v0.3.0\n"})}),"\n",(0,s.jsxs)(t,{children:[(0,s.jsx)("summary",{children:"Alternative installation method"}),(0,s.jsx)(n.p,{children:"If you prefer not to use Helm, you can install the SKE operator by applying the\nmanifests directly."}),(0,s.jsx)(n.p,{children:"First, create the namespace where the SKE operator will be installed:"}),(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"kubectl create namespace kratix-platform-system\n"})}),(0,s.jsx)(n.p,{children:"Then, create a secret with your license token:"}),(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"kubectl create secret docker-registry syntasso-registry \\\n  --namespace=kratix-platform-system \\\n  --docker-server=ghcr.io \\\n  --docker-username=syntasso-pkg \\\n  --docker-password=<YOUR TOKEN>\n"})}),(0,s.jsxs)(n.p,{children:["The manifests are available in the ",(0,s.jsx)(n.a,{href:"http://syntasso-enterprise-releases.s3-website.eu-west-2.amazonaws.com/#ske-operator/",children:"Syntasso Releases\nPage"}),".\nFind the latest release and apply it with ",(0,s.jsx)(n.code,{children:"kubectl"}),":"]}),(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"kubectl apply -f http://s3.eu-west-2.amazonaws.com/syntasso-enterprise-releases/ske-operator/v0.1.6/ske-operator-distribution.yaml\n"})}),(0,s.jsx)(n.p,{children:"With the Operator in place, you can now install Kratix Enterprise by creating a\n'Kratix' instance. Below is an example 'Kratix' instance definition:"}),(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:"apiVersion: platform.syntasso.io/v1alpha1\nkind: Kratix\nmetadata:\n  name: kratix-example\nspec:\n  releasesBucket:\n    name: # name of the bucket containing Kratix Enterprise releases; optional\n    region: # region of the bucket; optional\n    path: # subpath within the bucket; optional\n  version: v0.3.0 # version of Kratix Enterprise to install; default to the latest release found in release bucket\n"})}),(0,s.jsx)(n.p,{children:"You can save the 'Kratix' instance definition to a local file and apply with kubectl.\nSKE operator will then install Kratix Enterprise and its necessary configurations."}),(0,s.jsxs)(n.p,{children:["By default, when ",(0,s.jsx)(n.code,{children:"spec.releasesBucket"})," is not set, SKE operator will use the Syntasso Enterprise releases bucket.\nNote that 'Kratix' is a cluster scoped and singleton resource."]}),(0,s.jsx)(n.p,{children:"Only one instance of Kratix can be installed in a cluster."})]}),"\n",(0,s.jsx)(n.h3,{id:"verify-the-installation",children:"Verify the installation"}),"\n",(0,s.jsx)(n.p,{children:"To verify that Kratix Enterprise has been installed successfully, run the following command:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"kubectl get deployments.apps --namespace kratix-platform-system\n"})}),"\n",(0,s.jsx)(n.p,{children:"You should see the following output:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-shell-session",children:"NAME                                 READY   UP-TO-DATE   AVAILABLE   AGE\nkratix-platform-controller-manager   1/1     1            1           1h\nske-operator-controller-manager      1/1     1            1           1h\n"})}),"\n",(0,s.jsx)(n.p,{children:"You can now proceed with the configuration of Kratix (i.e. registering destinations or\ninstalling promises). For that, refer to the Open-Source Kratix documentation."}),"\n",(0,s.jsx)(n.h2,{id:"upgrades",children:"Upgrades"}),"\n",(0,s.jsx)(n.h3,{id:"upgrading-the-operator",children:"Upgrading the Operator"}),"\n",(0,s.jsx)(n.p,{children:"To verify the version of the Operator installed, run the following command:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"helm list\n"})}),"\n",(0,s.jsx)(n.p,{children:"You should see the following output:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-shell-session",children:"NAME            NAMESPACE    [...]    CHART                   APP VERSION\nske-operator    default      [...]    ske-operator-0.8.0      v0.1.1\n"})}),"\n",(0,s.jsx)(n.p,{children:"To check the available versions of the Operator, run the following command:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"helm search repo syntasso/ske-operator --versions\n"})}),"\n",(0,s.jsx)(n.p,{children:"To upgrade, run:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"helm upgrade ske-operator syntasso/ske-operator # --version <VERSION>\n"})}),"\n",(0,s.jsx)(n.admonition,{title:"Not using Helm?",type:"info",children:(0,s.jsx)(n.p,{children:"Refer to the alternative installation method summary box above to upgrade the operator without Helm."})}),"\n",(0,s.jsx)(n.h3,{id:"upgrading-the-ske-instance",children:"Upgrading the SKE Instance"}),"\n",(0,s.jsxs)(n.p,{children:["To upgrade the version of SKE being deployed by the operator, you can edit your\nKratix instance definition and change the ",(0,s.jsx)(n.code,{children:"version"})," field to the desired\nversion."]}),"\n",(0,s.jsx)(n.p,{children:"Upgrades from a version vX.Y.Z to vX.Y+2.Z are not supported. You must upgrade to\nvX.Y+1.Z first."}),"\n",(0,s.jsx)(n.h2,{id:"deletes",children:"Deletes"}),"\n",(0,s.jsx)(n.h3,{id:"deleting-the-ske-operator",children:"Deleting the SKE Operator"}),"\n",(0,s.jsx)(n.p,{children:"To delete the SKE operator (and any deployed SKE instance), run the following command:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"helm uninstall ske-operator\n"})}),"\n",(0,s.jsx)(n.h3,{id:"deleting-the-ske-instance",children:"Deleting the SKE Instance"}),"\n",(0,s.jsx)(n.p,{children:"To delete the SKE instance, run:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"kubectl -n kratix-platform-system delete kratix <INSTANCE_NAME>\n"})}),"\n",(0,s.jsx)(n.h2,{id:"air-gapped-installations",children:"Air-gapped installations"}),"\n",(0,s.jsx)(n.p,{children:"To deploy the SKE Operator in air-gapped environments, you need to ensure that\nyour Platform cluster has access to the following resources:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"An image registry containing both the SKE Operator and the SKE images"}),"\n",(0,s.jsx)(n.li,{children:"A location where the SKE Distribution manifests can be found"}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"The following sections detail how both resources can be set up."}),"\n",(0,s.jsx)(n.h3,{id:"image-registry",children:"Image Registry"}),"\n",(0,s.jsx)(n.p,{children:"The SKE Operator and SKE images are stored in the GitHub Container Registry (GHCR). To\ndeploy SKE in an air-gapped environment, you need to mirror the images to a private\nregistry."}),"\n",(0,s.jsx)(n.p,{children:"You must ensure that the following images are mirrored and tagged according to\nthe version."}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.code,{children:"ghcr.io/syntasso/ske-operator"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.code,{children:"ghcr.io/syntasso/ske-platform"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.code,{children:"ghcr.io/syntasso/ske-platform-pipeline-adapter"})}),"\n"]}),"\n",(0,s.jsx)(n.admonition,{title:"Platform and Pipeline Adapter tags",type:"warning",children:(0,s.jsxs)(n.p,{children:["The tags for the ",(0,s.jsx)(n.code,{children:"ske-platform"})," and the ",(0,s.jsx)(n.code,{children:"ske-platform-pipeline-adapter"})," images are\nthe same and must match the version of the SKE deployment you wish to install."]})}),"\n",(0,s.jsxs)(n.p,{children:["You can find the available versions of the images in the ",(0,s.jsx)(n.a,{href:"http://syntasso-enterprise-releases.s3-website.eu-west-2.amazonaws.com/",children:"Syntasso Enterprise\nReleases page"}),"."]}),"\n",(0,s.jsx)(n.admonition,{type:"tip",children:(0,s.jsxs)(n.p,{children:["You can use a tool like ",(0,s.jsx)(n.a,{href:"https://github.com/containers/skopeo",children:"Skopeo"})," to simplify the\nprocess of mirroring images."]})}),"\n",(0,s.jsx)(n.h3,{id:"ske-manifests",children:"SKE Manifests"}),"\n",(0,s.jsxs)(n.p,{children:["The manifests for SKE deployments are available in the ",(0,s.jsx)(n.a,{href:"http://syntasso-enterprise-releases.s3-website.eu-west-2.amazonaws.com/",children:"Syntasso Enterprise\nReleases page"}),"."]}),"\n",(0,s.jsx)(n.p,{children:"If you are deploying SKE in an air-gapped environment, you need to download the\nmanifests and make them available to the SKE Operator in a S3-compatible bucket\nthat's accessible from the Platform cluster."}),"\n",(0,s.jsx)(n.h3,{id:"setting-up-your-platform-cluster",children:"Setting up your Platform cluster"}),"\n",(0,s.jsxs)(n.p,{children:["Depending on your environment configuration, you may need to create the\nsecrets the Operator will use to access both the Image Registry and the\nBucket. Those credentials must exist in the ",(0,s.jsx)(n.code,{children:"kratix-platform-system"})," namespace."]}),"\n",(0,s.jsxs)(n.admonition,{type:"tip",children:[(0,s.jsx)(n.p,{children:"You may need to, first, create the namespace:"}),(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"kubectl create namespace kratix-platform-system\n"})})]}),"\n",(0,s.jsx)(n.p,{children:"To create the Image Registry secret, run:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:'kubectl create secret docker-registry <PULL SECRET NAME> \\\n    --namespace "kratix-platform-system" \\\n    --docker-username="yourusername" \\\n    --docker-password="yourpassword" \\\n    --docker-server="your.registry.address"\n'})}),"\n",(0,s.jsx)(n.p,{children:"To create the Bucket secret, run:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:'kubectl create secret generic <BUCKET SECRET NAME> \\\n    --namespace kratix-platform-system \\\n    --from-literal=accessKeyID="youraccesskey" \\\n    --from-literal=secretAccessKey="yoursecretkey"\n'})}),"\n",(0,s.jsx)(n.h3,{id:"deploying-the-ske-operator",children:"Deploying the SKE Operator"}),"\n",(0,s.jsxs)(n.p,{children:["Once you have the images mirrored and the manifests available, you can deploy\nthe SKE Operator with Helm by providing the necessary configuration. Please\ncheck the ",(0,s.jsx)(n.a,{href:"https://github.com/syntasso/helm-charts/blob/main/ske-operator/values.yaml",children:"Helm chart values\nfile"}),"\nfor a complete list of configuration options."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"helm install ske-operator syntasso/ske-operator \\\n  --namespace kratix-platform-system \\\n  --set skeLicense=<YOUR LICENSE TOKEN> \\\n  --set imageRegistry.host=<YOUR REGISTRY> \\\n  --set imageRegistry.imagePullSecret=<PULL SECRET NAME> \\\n  --set imageRegistry.skeOperatorImage.name=<OPERATOR IMAGE NAME> \\\n  --set imageRegistry.skeOperatorImage.tag=<OPERATOR IMAGE TAG> \\\n  --set imageRegistry.skePlatformImage.name=<SKE PLATFORM IMAGE NAME> \\\n  --set imageRegistry.skePlatformPipelineAdapterImage.name=<SKE PLATFORM PIPELINE ADAPTER IMAGE NAME> \\\n  --set releasesBucket.name=<BUCKET NAME> \\\n  --set releasesBucket.path=<BUCKET PATH> \\\n  --set releasesBucket.region=<BUCKET REGION> \\\n  --set releasesBucket.endpoint=<BUCKET ENDPOINT> \\\n  --set releasesBucket.secretName=<BUCKET SECRET NAME> \\\n  --set skeDeployment.enabled=true \\\n  --set skeDeployment.version=v0.3.0\n"})}),"\n",(0,s.jsx)(n.admonition,{type:"tip",children:(0,s.jsx)(n.p,{children:"Most of the configuration options are optional. You only need to provide the\nones that you have customised to your environment."})})]})}function h(e={}){const{wrapper:n}={...(0,a.a)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}},1151:(e,n,t)=>{t.d(n,{Z:()=>o,a:()=>i});var s=t(7294);const a={},r=s.createContext(a);function i(e){const n=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:i(e.components),s.createElement(r.Provider,{value:n},e.children)}}}]);