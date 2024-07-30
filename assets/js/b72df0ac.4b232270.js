"use strict";(self.webpackChunkkratix_docs=self.webpackChunkkratix_docs||[]).push([[3368],{520:(e,i,r)=>{r.r(i),r.d(i,{assets:()=>o,contentTitle:()=>s,default:()=>h,frontMatter:()=>a,metadata:()=>l,toc:()=>c});var t=r(5893),n=r(1151);const a={},s="kratix init helm-promise",l={id:"main/kratix-cli/reference/kratix-init-helm-promise",title:"kratix init helm-promise",description:"Initialize a new Promise from a Helm chart",source:"@site/docs/main/06-kratix-cli/20-reference/06_kratix-init-helm-promise.md",sourceDirName:"main/06-kratix-cli/20-reference",slug:"/main/kratix-cli/reference/kratix-init-helm-promise",permalink:"/main/kratix-cli/reference/kratix-init-helm-promise",draft:!1,unlisted:!1,editUrl:"https://github.com/syntasso/kratix-docs/tree/main/docs/main/06-kratix-cli/20-reference/06_kratix-init-helm-promise.md",tags:[],version:"current",sidebarPosition:6,frontMatter:{},sidebar:"mainSidebar",previous:{title:"kratix init",permalink:"/main/kratix-cli/reference/kratix-init"},next:{title:"kratix init operator-promise",permalink:"/main/kratix-cli/reference/kratix-init-operator-promise"}},o={},c=[{value:"Description",id:"description",level:2},{value:"Usage",id:"usage",level:2},{value:"Examples",id:"examples",level:2},{value:"Flags",id:"flags",level:2},{value:"Global",id:"global",level:2},{value:"See Also",id:"see-also",level:2}];function m(e){const i={a:"a",code:"code",h1:"h1",h2:"h2",li:"li",p:"p",pre:"pre",ul:"ul",...(0,n.a)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(i.h1,{id:"kratix-init-helm-promise",children:"kratix init helm-promise"}),"\n",(0,t.jsx)(i.p,{children:"Initialize a new Promise from a Helm chart"}),"\n",(0,t.jsx)(i.h2,{id:"description",children:"Description"}),"\n",(0,t.jsx)(i.p,{children:"Initialize a new Promise from a Helm Chart"}),"\n",(0,t.jsx)(i.h2,{id:"usage",children:"Usage"}),"\n",(0,t.jsx)(i.pre,{children:(0,t.jsx)(i.code,{children:"kratix init helm-promise PROMISE-NAME --chart-url HELM-CHART-URL --group PROMISE-API-GROUP --kind PROMISE-API-KIND [--chart-version] [flags]\n"})}),"\n",(0,t.jsx)(i.h2,{id:"examples",children:"Examples"}),"\n",(0,t.jsx)(i.pre,{children:(0,t.jsx)(i.code,{children:"# initialize a new promise from an OCI Helm Chart\nkratix init helm-promise postgresql --chart-url oci://registry-1.docker.io/bitnamicharts/postgresql [--chart-version]\n\n# initialize a new promise from a Helm Chart repository\nkratix init helm-promise postgresql --chart-url https://fluxcd-community.github.io/helm-charts --chart-name flux2 [--chart-version]\n\n# initialize a new promise from a Helm Chart tar URL\nkratix init helm-promise postgresql --chart-url https://github.com/stefanprodan/podinfo/raw/gh-pages/podinfo-0.2.1.tgz\n"})}),"\n",(0,t.jsx)(i.h2,{id:"flags",children:"Flags"}),"\n",(0,t.jsx)(i.pre,{children:(0,t.jsx)(i.code,{children:"--chart-name string      The Helm chart name. Required when using Helm repository\n--chart-url string       The URL (supports OCI and tarball) of the Helm chart\n--chart-version string   The Helm chart version. Default to latest\n-h, --help                   help for helm-promise\n"})}),"\n",(0,t.jsx)(i.h2,{id:"global",children:"Global"}),"\n",(0,t.jsx)(i.pre,{children:(0,t.jsx)(i.code,{children:"-d, --dir string       The output directory to write the Promise structure to; defaults to '.' (default \".\")\n-g, --group string     The API group for the Promise\n-k, --kind string      The kind to be provided by the Promise\n--plural string    The plural form of the kind. Defaults to the kind name with an additional 's' at the end.\n--split            Split promise.yaml file into multiple files.\n"})}),"\n",(0,t.jsx)(i.h2,{id:"see-also",children:"See Also"}),"\n",(0,t.jsxs)(i.ul,{children:["\n",(0,t.jsxs)(i.li,{children:[(0,t.jsx)(i.a,{href:"/main/kratix-cli/reference/kratix-init",children:"kratix init"}),": Command used to initialize Kratix resources"]}),"\n"]})]})}function h(e={}){const{wrapper:i}={...(0,n.a)(),...e.components};return i?(0,t.jsx)(i,{...e,children:(0,t.jsx)(m,{...e})}):m(e)}},1151:(e,i,r)=>{r.d(i,{Z:()=>l,a:()=>s});var t=r(7294);const n={},a=t.createContext(n);function s(e){const i=t.useContext(a);return t.useMemo((function(){return"function"==typeof e?e(i):{...i,...e}}),[i,e])}function l(e){let i;return i=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:s(e.components),t.createElement(a.Provider,{value:i},e.children)}}}]);