"use strict";(self.webpackChunkkratix_docs=self.webpackChunkkratix_docs||[]).push([[4056],{378:(e,i,r)=>{r.r(i),r.d(i,{assets:()=>l,contentTitle:()=>o,default:()=>m,frontMatter:()=>s,metadata:()=>t,toc:()=>c});const t=JSON.parse('{"id":"main/kratix-cli/reference/kratix-init-helm-promise","title":"kratix init helm-promise","description":"Initialize a new Promise from a Helm chart","source":"@site/docs/main/05-kratix-cli/20-reference/08_kratix-init-helm-promise.md","sourceDirName":"main/05-kratix-cli/20-reference","slug":"/main/kratix-cli/reference/kratix-init-helm-promise","permalink":"/main/kratix-cli/reference/kratix-init-helm-promise","draft":false,"unlisted":false,"editUrl":"https://github.com/syntasso/kratix-docs/tree/main/docs/main/05-kratix-cli/20-reference/08_kratix-init-helm-promise.md","tags":[],"version":"current","sidebarPosition":8,"frontMatter":{},"sidebar":"mainSidebar","previous":{"title":"kratix init crossplane-promise","permalink":"/main/kratix-cli/reference/kratix-init-crossplane-promise"},"next":{"title":"kratix init operator-promise","permalink":"/main/kratix-cli/reference/kratix-init-operator-promise"}}');var n=r(4848),a=r(8453);const s={},o="kratix init helm-promise",l={},c=[{value:"Description",id:"description",level:2},{value:"Usage",id:"usage",level:2},{value:"Examples",id:"examples",level:2},{value:"Flags",id:"flags",level:2},{value:"Global",id:"global",level:2},{value:"See Also",id:"see-also",level:2}];function h(e){const i={a:"a",code:"code",h1:"h1",h2:"h2",header:"header",li:"li",p:"p",pre:"pre",ul:"ul",...(0,a.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(i.header,{children:(0,n.jsx)(i.h1,{id:"kratix-init-helm-promise",children:"kratix init helm-promise"})}),"\n",(0,n.jsx)(i.p,{children:"Initialize a new Promise from a Helm chart"}),"\n",(0,n.jsx)(i.h2,{id:"description",children:"Description"}),"\n",(0,n.jsx)(i.p,{children:"Initialize a new Promise from a Helm Chart"}),"\n",(0,n.jsx)(i.h2,{id:"usage",children:"Usage"}),"\n",(0,n.jsx)(i.pre,{children:(0,n.jsx)(i.code,{children:"kratix init helm-promise PROMISE-NAME --chart-url HELM-CHART-URL --group PROMISE-API-GROUP --kind PROMISE-API-KIND [--chart-version] [flags]\n"})}),"\n",(0,n.jsx)(i.h2,{id:"examples",children:"Examples"}),"\n",(0,n.jsx)(i.pre,{children:(0,n.jsx)(i.code,{children:"# initialize a new promise from an OCI Helm Chart\nkratix init helm-promise postgresql --chart-url oci://registry-1.docker.io/bitnamicharts/postgresql [--chart-version] --group syntasso.io --kind database\n\n# initialize a new promise from a Helm Chart repository\nkratix init helm-promise postgresql --chart-url https://fluxcd-community.github.io/helm-charts --chart-name flux2 [--chart-version] --group syntasso.io --kind database\n\n# initialize a new promise from a Helm Chart tar URL\nkratix init helm-promise postgresql --chart-url https://github.com/stefanprodan/podinfo/raw/gh-pages/podinfo-0.2.1.tgz --group syntasso.io --kind database\n"})}),"\n",(0,n.jsx)(i.h2,{id:"flags",children:"Flags"}),"\n",(0,n.jsx)(i.pre,{children:(0,n.jsx)(i.code,{children:"--chart-name string      The Helm chart name. Required when using Helm repository\n--chart-url string       The URL (supports OCI and tarball) of the Helm chart\n--chart-version string   The Helm chart version. Default to latest\n-h, --help                   help for helm-promise\n"})}),"\n",(0,n.jsx)(i.h2,{id:"global",children:"Global"}),"\n",(0,n.jsx)(i.pre,{children:(0,n.jsx)(i.code,{children:"-d, --dir string       The output directory to write the Promise structure to; defaults to '.' (default \".\")\n-g, --group string     The API group for the Promise\n-k, --kind string      The kind to be provided by the Promise\n--plural string    The plural form of the kind. Defaults to the kind name with an additional 's' at the end.\n--split            Split promise.yaml file into multiple files.\n"})}),"\n",(0,n.jsx)(i.h2,{id:"see-also",children:"See Also"}),"\n",(0,n.jsxs)(i.ul,{children:["\n",(0,n.jsxs)(i.li,{children:[(0,n.jsx)(i.a,{href:"/main/kratix-cli/reference/kratix-init",children:"kratix init"}),": Command used to initialize Kratix resources"]}),"\n"]})]})}function m(e={}){const{wrapper:i}={...(0,a.R)(),...e.components};return i?(0,n.jsx)(i,{...e,children:(0,n.jsx)(h,{...e})}):h(e)}},8453:(e,i,r)=>{r.d(i,{R:()=>s,x:()=>o});var t=r(6540);const n={},a=t.createContext(n);function s(e){const i=t.useContext(a);return t.useMemo((function(){return"function"==typeof e?e(i):{...i,...e}}),[i,e])}function o(e){let i;return i=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:s(e.components),t.createElement(a.Provider,{value:i},e.children)}}}]);