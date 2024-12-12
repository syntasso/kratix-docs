"use strict";(self.webpackChunkkratix_docs=self.webpackChunkkratix_docs||[]).push([[404],{9176:(e,s,r)=>{r.r(s),r.d(s,{assets:()=>l,contentTitle:()=>i,default:()=>d,frontMatter:()=>a,metadata:()=>o,toc:()=>h});var t=r(5893),n=r(1151);const a={title:"SKE-Operator",description:"Release information about SKE-Operator",sidebar_label:"SKE-Operator"},i=void 0,o={id:"ske/releases/ske-operator",title:"SKE-Operator",description:"Release information about SKE-Operator",source:"@site/docs/ske/50-releases/20-ske-operator.mdx",sourceDirName:"ske/50-releases",slug:"/ske/releases/ske-operator",permalink:"/ske/releases/ske-operator",draft:!1,unlisted:!1,editUrl:"https://github.com/syntasso/kratix-docs/tree/main/docs/ske/50-releases/20-ske-operator.mdx",tags:[],version:"current",sidebarPosition:20,frontMatter:{title:"SKE-Operator",description:"Release information about SKE-Operator",sidebar_label:"SKE-Operator"},sidebar:"skeSidebar",previous:{title:"SKE",permalink:"/ske/releases/ske"},next:{title:"Aspects",permalink:"/category/aspects"}},l={},h=[{value:"Overview",id:"overview",level:2},{value:"Release Notes",id:"release-notes",level:2},{value:"0.9.0 (2024-12-12)",id:"090-2024-12-12",level:3},{value:"Features",id:"features",level:4},{value:"SKE Operator Helm Chart 0.26.0 (2024-11-26)",id:"ske-operator-helm-chart-0260-2024-11-26",level:3},{value:"Features",id:"features-1",level:4},{value:"0.6.0 (2024-11-21)",id:"060-2024-11-21",level:3},{value:"Bug Fixes",id:"bug-fixes",level:4},{value:"0.5.0 (2024-11-12)",id:"050-2024-11-12",level:3},{value:"0.4.1 (2024-10-21)",id:"041-2024-10-21",level:3},{value:"0.4.0 (2024-10-17)",id:"040-2024-10-17",level:3},{value:"Bug Fixes",id:"bug-fixes-1",level:4},{value:"0.3.1 (2024-10-15)",id:"031-2024-10-15",level:3},{value:"Bug Fixes",id:"bug-fixes-2",level:4},{value:"0.3.0 (2024-10-10)",id:"030-2024-10-10",level:3},{value:"Features",id:"features-2",level:4},{value:"Bug Fixes",id:"bug-fixes-3",level:4}];function c(e){const s={a:"a",admonition:"admonition",code:"code",h2:"h2",h3:"h3",h4:"h4",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,n.a)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(s.h2,{id:"overview",children:"Overview"}),"\n",(0,t.jsxs)(s.p,{children:["The SKE-Operator is the operator for managing the installation and upgrading of\nSKE. For installation documentation see ",(0,t.jsx)(s.a,{href:"/ske/kratix/intro",children:"here"}),"."]}),"\n",(0,t.jsx)(s.p,{children:"The release manifest is available at:"}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{children:"http://syntasso-enterprise-releases.s3-website.eu-west-2.amazonaws.com/#ske-operator/\n"})}),"\n",(0,t.jsx)(s.p,{children:"The helm chart is available at:"}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{children:"http://syntasso-enterprise-releases.s3-website.eu-west-2.amazonaws.com/#ske-operator-helm-chart/\n"})}),"\n",(0,t.jsx)(s.p,{children:"To see which version of the helm chart corresponds to which version of the\nSKE-Operator, please refer to the release notes below."}),"\n",(0,t.jsx)(s.h2,{id:"release-notes",children:"Release Notes"}),"\n",(0,t.jsxs)(s.h3,{id:"090-2024-12-12",children:[(0,t.jsx)(s.a,{href:"http://syntasso-enterprise-releases.s3-website.eu-west-2.amazonaws.com/#ske-operator/v0.9.0/",children:"0.9.0"})," (2024-12-12)"]}),"\n",(0,t.jsxs)(s.p,{children:["Released in Helm Chart version ",(0,t.jsx)(s.a,{href:"http://syntasso-enterprise-releases.s3-website.eu-west-2.amazonaws.com/#ske-operator-helm-chart/0.29.0/",children:"version 0.29.0"})]}),"\n",(0,t.jsxs)(s.p,{children:[(0,t.jsx)(s.strong,{children:"Note:"})," This version of the SKE Operator is only compatible with SKE versions ",(0,t.jsx)(s.code,{children:"v0.8.0"})," or above."]}),"\n",(0,t.jsx)(s.h4,{id:"features",children:"Features"}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsx)(s.li,{children:"Enhanced support for Kratix upgrades, including post-upgrade checks written to the Kratix status"}),"\n"]}),"\n",(0,t.jsxs)(s.h3,{id:"ske-operator-helm-chart-0260-2024-11-26",children:[(0,t.jsx)(s.a,{href:"http://syntasso-enterprise-releases.s3-website.eu-west-2.amazonaws.com/#ske-operator-helm-chart/0.26.0/",children:"SKE Operator Helm Chart 0.26.0"})," (2024-11-26)"]}),"\n",(0,t.jsxs)(s.p,{children:["Deploys SKE Operator version ",(0,t.jsx)(s.a,{href:"http://syntasso-enterprise-releases.s3-website.eu-west-2.amazonaws.com/#ske-operator/v0.6.0/",children:"0.6.0"})]}),"\n",(0,t.jsx)(s.h4,{id:"features-1",children:"Features"}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsxs)(s.li,{children:["This chart provides support for provisioning additional SKE and Kubernetes resources alongside the SKE Operator and SKE Deployment. With the\n",(0,t.jsx)(s.code,{children:"skeDeployment.additionalResources"}),", property, users can specify any additional resources that rely on the existence of a SKE Deployment\n(e.g. Destinations, BucketStateStore) whilst the higher level ",(0,t.jsx)(s.code,{children:"additionalResources"})," property can be used to specify any other Kubernetes resources\nrequired (e.g. Secrets)."]}),"\n"]}),"\n",(0,t.jsxs)(s.h3,{id:"060-2024-11-21",children:[(0,t.jsx)(s.a,{href:"http://syntasso-enterprise-releases.s3-website.eu-west-2.amazonaws.com/#ske-operator/v0.6.0/",children:"0.6.0"})," (2024-11-21)"]}),"\n",(0,t.jsxs)(s.p,{children:["Released in Helm Chart ",(0,t.jsx)(s.a,{href:"http://syntasso-enterprise-releases.s3-website.eu-west-2.amazonaws.com/#ske-operator-helm-chart/0.25.0/",children:"version 0.25.0"})]}),"\n",(0,t.jsx)(s.h4,{id:"bug-fixes",children:"Bug Fixes"}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsx)(s.li,{children:"Fix bug to ensure Kratix Deployment readiness is properly checked before being marked as Available"}),"\n"]}),"\n",(0,t.jsxs)(s.h3,{id:"050-2024-11-12",children:[(0,t.jsx)(s.a,{href:"http://syntasso-enterprise-releases.s3-website.eu-west-2.amazonaws.com/#ske-operator/v0.5.0/",children:"0.5.0"})," (2024-11-12)"]}),"\n",(0,t.jsxs)(s.p,{children:["Released in Helm Chart ",(0,t.jsx)(s.a,{href:"http://syntasso-enterprise-releases.s3-website.eu-west-2.amazonaws.com/#ske-operator-helm-chart/0.22.0/",children:"version 0.22.0"})]}),"\n",(0,t.jsxs)(s.admonition,{type:"warning",children:[(0,t.jsxs)(s.p,{children:["This version of the Helm chart introduces a ",(0,t.jsx)(s.strong,{children:"breaking change"})," in how it manages\nthe Kratix CRD. To ensure a smooth upgrade, you must run the following manual\ncommands before upgrading:"]}),(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-bash",children:"kubectl --context=$PLATFORM label crd kratixes.platform.syntasso.io app.kubernetes.io/managed-by=Helm\nkubectl --context=$PLATFORM annotate crd kratixes.platform.syntasso.io meta.helm.sh/release-name=ske-operator meta.helm.sh/release-namespace=kratix-platform-system\n"})}),(0,t.jsx)(s.p,{children:"These steps are required to align the CRD management with the new Helm chart\nstructure. Failing to perform this migration will result in upgrade failures."})]}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsx)(s.li,{children:"Support installing SKE Operator and SKE without cert-manager"}),"\n"]}),"\n",(0,t.jsxs)(s.h3,{id:"041-2024-10-21",children:[(0,t.jsx)(s.a,{href:"http://syntasso-enterprise-releases.s3-website.eu-west-2.amazonaws.com/#ske-operator/v0.4.1/",children:"0.4.1"})," (2024-10-21)"]}),"\n",(0,t.jsxs)(s.p,{children:["Released in Helm Chart ",(0,t.jsx)(s.a,{href:"http://syntasso-enterprise-releases.s3-website.eu-west-2.amazonaws.com/#ske-operator-helm-chart/0.21.0/",children:"version 0.21.0"})]}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsxs)(s.li,{children:["Update default image host to ",(0,t.jsx)(s.code,{children:"registry.syntasso.io"})]}),"\n"]}),"\n",(0,t.jsxs)(s.h3,{id:"040-2024-10-17",children:[(0,t.jsx)(s.a,{href:"http://syntasso-enterprise-releases.s3-website.eu-west-2.amazonaws.com/#ske-operator/v0.4.0/",children:"0.4.0"})," (2024-10-17)"]}),"\n",(0,t.jsxs)(s.p,{children:["Released in Helm Chart ",(0,t.jsx)(s.a,{href:"http://syntasso-enterprise-releases.s3-website.eu-west-2.amazonaws.com/#ske-operator-helm-chart/0.19.0/",children:"version 0.19.0"})]}),"\n",(0,t.jsx)(s.h4,{id:"bug-fixes-1",children:"Bug Fixes"}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsx)(s.li,{children:"Fix bug that made the Operator version configurable as this resulted in errors during upgrades"}),"\n"]}),"\n",(0,t.jsxs)(s.h3,{id:"031-2024-10-15",children:[(0,t.jsx)(s.a,{href:"http://syntasso-enterprise-releases.s3-website.eu-west-2.amazonaws.com/#ske-operator/v0.3.1/",children:"0.3.1"})," (2024-10-15)"]}),"\n",(0,t.jsxs)(s.p,{children:["Released in Helm Chart ",(0,t.jsx)(s.a,{href:"http://syntasso-enterprise-releases.s3-website.eu-west-2.amazonaws.com/#ske-operator-helm-chart/0.17.0/",children:"version 0.17.0"})]}),"\n",(0,t.jsx)(s.h4,{id:"bug-fixes-2",children:"Bug Fixes"}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsx)(s.li,{children:"Fix bug preventing Kratix resources from being updated gracefully"}),"\n"]}),"\n",(0,t.jsxs)(s.h3,{id:"030-2024-10-10",children:[(0,t.jsx)(s.a,{href:"http://syntasso-enterprise-releases.s3-website.eu-west-2.amazonaws.com/#ske-operator/v0.3.0/",children:"0.3.0"})," (2024-10-10)"]}),"\n",(0,t.jsxs)(s.p,{children:["Released in Helm Chart ",(0,t.jsx)(s.a,{href:"http://syntasso-enterprise-releases.s3-website.eu-west-2.amazonaws.com/#ske-operator-helm-chart/0.16.0/",children:"version 0.16.0"})]}),"\n",(0,t.jsx)(s.h4,{id:"features-2",children:"Features"}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsx)(s.li,{children:"Support pulling releases from a Git Repo for air-gapped environments"}),"\n"]}),"\n",(0,t.jsx)(s.h4,{id:"bug-fixes-3",children:"Bug Fixes"}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsx)(s.li,{children:"Fix bug preventing correct version of SKE being returned from the Operator"}),"\n"]})]})}function d(e={}){const{wrapper:s}={...(0,n.a)(),...e.components};return s?(0,t.jsx)(s,{...e,children:(0,t.jsx)(c,{...e})}):c(e)}},1151:(e,s,r)=>{r.d(s,{Z:()=>o,a:()=>i});var t=r(7294);const n={},a=t.createContext(n);function i(e){const s=t.useContext(a);return t.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function o(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:i(e.components),t.createElement(a.Provider,{value:s},e.children)}}}]);