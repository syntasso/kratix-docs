"use strict";(self.webpackChunkkratix_docs=self.webpackChunkkratix_docs||[]).push([[5036],{4439:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>o,contentTitle:()=>l,default:()=>h,frontMatter:()=>a,metadata:()=>r,toc:()=>c});var i=t(5893),s=t(1151);const a={title:"Installation via SKE CLI",description:"Installing Syntasso Kratix Enterprise",sidebar_label:"Installation via SKE CLI"},l=void 0,r={id:"ske/kratix/ske-cli-installation",title:"Installation via SKE CLI",description:"Installing Syntasso Kratix Enterprise",source:"@site/docs/ske/01-kratix/01-ske-cli-installation.mdx",sourceDirName:"ske/01-kratix",slug:"/ske/kratix/ske-cli-installation",permalink:"/ske/kratix/ske-cli-installation",draft:!1,unlisted:!1,editUrl:"https://github.com/syntasso/kratix-docs/tree/main/docs/ske/01-kratix/01-ske-cli-installation.mdx",tags:[],version:"current",sidebarPosition:1,frontMatter:{title:"Installation via SKE CLI",description:"Installing Syntasso Kratix Enterprise",sidebar_label:"Installation via SKE CLI"},sidebar:"skeSidebar",previous:{title:"Introduction",permalink:"/ske/kratix/intro"},next:{title:"Installation via Helm",permalink:"/ske/kratix/helm-installation"}},o={},c=[{value:"Install",id:"install",level:2},{value:"Verify the installation",id:"verify-the-installation",level:3},{value:"Upgrades",id:"upgrades",level:2},{value:"Air-gapped installations",id:"air-gapped-installations",level:2}];function d(e){const n={a:"a",admonition:"admonition",code:"code",h2:"h2",h3:"h3",p:"p",pre:"pre",...(0,s.a)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.p,{children:"Syntasso Kratix Enterprise images are distributed through a private image registry. To\ninstall SKE on your Kubernetes cluster, follow the steps below."}),"\n",(0,i.jsx)(n.h2,{id:"install",children:"Install"}),"\n",(0,i.jsx)(n.admonition,{type:"info",children:(0,i.jsxs)(n.p,{children:["Syntasso Kratix Enterprise requires cert-manager to be installed on the cluster. Please\nrefer to ",(0,i.jsx)(n.a,{href:"https://cert-manager.io/",children:"its documentation for installation instructions"}),"."]})}),"\n",(0,i.jsxs)(n.p,{children:["The easiest way to install SKE is using the ",(0,i.jsx)(n.a,{href:"/ske/releases/ske-cli",children:"SKE\nCLI"}),". The CLI will install the SKE Operator and\nconfigure it to deploy SKE on your cluster. To install run:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"ske install --access-token $SKE_LICENCE_TOKEN\n"})}),"\n",(0,i.jsx)(n.h3,{id:"verify-the-installation",children:"Verify the installation"}),"\n",(0,i.jsx)(n.p,{children:"Once installation is complete you can verify what has been installed by running:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"ske get version\n"})}),"\n",(0,i.jsx)(n.p,{children:"You should see the following output (or similar):"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-shell-session",children:"Latest Available:\nSKE Operator: v0.2.0; SKE Deployment: v0.3.0\n\nDeployed:\nSKE Operator: v0.2.0; SKE Deployment: v0.3.0\n"})}),"\n",(0,i.jsx)(n.p,{children:"To verify that the Operator and SKE are healthy, run the following command:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"kubectl get deployments.apps --namespace kratix-platform-system\n"})}),"\n",(0,i.jsx)(n.p,{children:"You should see the following output:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-shell-session",children:"NAME                                 READY   UP-TO-DATE   AVAILABLE   AGE\nkratix-platform-controller-manager   1/1     1            1           1h\nske-operator-controller-manager      1/1     1            1           1h\n"})}),"\n",(0,i.jsx)(n.p,{children:"You can now proceed with the configuration of Kratix (i.e. registering destinations or\ninstalling promises). For that, refer to the Open-Source Kratix documentation."}),"\n",(0,i.jsx)(n.h2,{id:"upgrades",children:"Upgrades"}),"\n",(0,i.jsxs)(n.p,{children:["Support for upgrading SKE using the SKE CLI is coming soon. In the meantime, you can\nfollow the ",(0,i.jsx)(n.a,{href:"/ske/kratix/helm-installation",children:"helm upgrade"})," instructions for upgrading SKE."]}),"\n",(0,i.jsx)(n.h2,{id:"air-gapped-installations",children:"Air-gapped installations"}),"\n",(0,i.jsxs)(n.p,{children:["Support for installing SKE in air-gapped environments using the SKE CLI is coming\nsoon. In the meantime, you can follow the ",(0,i.jsx)(n.a,{href:"/ske/kratix/helm-installation",children:"helm\ninstallation"})," instructions for air-gapped environments."]})]})}function h(e={}){const{wrapper:n}={...(0,s.a)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},1151:(e,n,t)=>{t.d(n,{Z:()=>r,a:()=>l});var i=t(7294);const s={},a=i.createContext(s);function l(e){const n=i.useContext(a);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:l(e.components),i.createElement(a.Provider,{value:n},e.children)}}}]);