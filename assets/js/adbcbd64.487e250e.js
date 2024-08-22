"use strict";(self.webpackChunkkratix_docs=self.webpackChunkkratix_docs||[]).push([[5253],{8076:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>i,default:()=>h,frontMatter:()=>o,metadata:()=>l,toc:()=>a});var s=n(5893),r=n(1151);const o={id:"setup",title:"Installing the tools",description:"Find out what you need in installed before starting the workshop"},i=void 0,l={id:"workshop/part-0/setup",title:"Installing the tools",description:"Find out what you need in installed before starting the workshop",source:"@site/docs/workshop/part-0/01-setup.mdx",sourceDirName:"workshop/part-0",slug:"/workshop/part-0/setup",permalink:"/workshop/part-0/setup",draft:!1,unlisted:!1,editUrl:"https://github.com/syntasso/kratix-docs/tree/main/docs/workshop/part-0/01-setup.mdx",tags:[],version:"current",sidebarPosition:1,frontMatter:{id:"setup",title:"Installing the tools",description:"Find out what you need in installed before starting the workshop"},sidebar:"workshopSidebar",previous:{title:"Preparing for the Workshop",permalink:"/workshop/part-0/intro"},next:{title:"Creating the clusters",permalink:"/workshop/part-0/create-clusters"}},c={},a=[{value:"Install cli tools",id:"install-cli-tools",level:2},{value:"Docker Resources",id:"docker-config",level:2}];function d(e){const t={a:"a",admonition:"admonition",code:"code",h2:"h2",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...(0,r.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.h2,{id:"install-cli-tools",children:"Install cli tools"}),"\n",(0,s.jsx)(t.p,{children:"In this workshop, you will deploy Kratix on a local Kubernetes cluster, and deploy\nKratix workloads on another Kubernetes cluster. You will need the following\ntools:"}),"\n",(0,s.jsxs)(t.ol,{children:["\n",(0,s.jsxs)(t.li,{children:["\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.code,{children:"kratix"})," CLI / ",(0,s.jsx)(t.strong,{children:"Kratix Command-line Tool"}),": ",(0,s.jsx)("br",{}),"\nUsed to build the Promise in Part II. ",(0,s.jsx)("br",{}),"\nSee ",(0,s.jsx)(t.a,{href:"/main/kratix-cli/intro",children:"Kratix CLI documentation page"}),"\nfor installation instructions."]}),"\n"]}),"\n",(0,s.jsxs)(t.li,{children:["\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.code,{children:"kind"})," CLI / ",(0,s.jsx)(t.strong,{children:"Kubernetes-in-Docker (KinD)"}),": ",(0,s.jsx)("br",{}),"\nUsed to create and manage local Kubernetes clusters in Docker. ",(0,s.jsx)("br",{}),"\nSee ",(0,s.jsx)(t.a,{href:"https://kind.sigs.k8s.io/docs/user/quick-start/",children:"the quick start guide"})," to install."]}),"\n"]}),"\n",(0,s.jsxs)(t.li,{children:["\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.code,{children:"docker"})," CLI / ",(0,s.jsx)(t.strong,{children:"Docker"}),": ",(0,s.jsx)("br",{})," Used to orchestrate containers. ",(0,s.jsx)(t.code,{children:"kind"}),"\nrequires that you have Docker installed and configured. ",(0,s.jsx)("br",{})," See ",(0,s.jsx)(t.a,{href:"https://docs.docker.com/get-docker/",children:"Get\nDocker"})," to install."]}),"\n"]}),"\n",(0,s.jsxs)(t.li,{children:["\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.code,{children:"kubectl"})," / ",(0,s.jsx)(t.strong,{children:"Kubernetes command-line tool"}),": ",(0,s.jsx)("br",{})," The CLI for\nKubernetes\u2014allows you to run commands against Kubernetes clusters. ",(0,s.jsx)("br",{})," See ",(0,s.jsx)(t.a,{href:"https://kubernetes.io/docs/tasks/tools/#kubectl",children:"the install guide"}),"."]}),"\n"]}),"\n",(0,s.jsxs)(t.li,{children:["\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.code,{children:"yq"})," / ",(0,s.jsx)(t.strong,{children:"YAML parsing command-line tool"}),": ",(0,s.jsx)("br",{})," The CLI for\nKubernetes\u2014allows you to run parse and transform YAML files. This is only used in Part II. ",(0,s.jsx)("br",{})," See ",(0,s.jsx)(t.a,{href:"https://github.com/mikefarah/yq#install",children:"the install guide"}),"."]}),"\n"]}),"\n",(0,s.jsxs)(t.li,{children:["\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.code,{children:"mc"})," / ",(0,s.jsx)(t.strong,{children:"MinIO Client"}),": ",(0,s.jsx)("br",{})," The CLI for MinIO\u2014allows you to run commands against MinIO clusters. ",(0,s.jsx)("br",{})," See ",(0,s.jsx)(t.a,{href:"https://docs.min.io/docs/minio-client-quickstart-guide.html",children:"the install guide"}),"."]}),"\n"]}),"\n",(0,s.jsxs)(t.li,{children:["\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.code,{children:"git"})," / ",(0,s.jsx)(t.strong,{children:"Git"}),": ",(0,s.jsx)("br",{})," The CLI for Git\u2014allows you to clone the Kratix repository. ",(0,s.jsx)("br",{})," See ",(0,s.jsx)(t.a,{href:"https://git-scm.com/book/en/v2/Getting-Started-Installing-Git",children:"the install guide"}),"."]}),"\n"]}),"\n"]}),"\n",(0,s.jsxs)(t.admonition,{type:"info",children:[(0,s.jsx)(t.p,{children:"You can run the workshop without KinD. Ideally, you will have access to two\nKubernetes clusters."}),(0,s.jsxs)(t.p,{children:["One cluster will be the Platform cluster, where Kratix will be installed.\nWhenever you see ",(0,s.jsx)(t.code,{children:"--context kind-platform"}),", replace it with the context of your\nplatform cluster."]}),(0,s.jsxs)(t.p,{children:["The other worker will be the Worker cluster. Whenever you see ",(0,s.jsx)(t.code,{children:"--context kind-worker"}),", replace it with the context of your worker cluster."]}),(0,s.jsxs)(t.p,{children:["If you want to try it on a single cluster, you can omit the ",(0,s.jsx)(t.code,{children:"--context"})," flag and\nargument entirely."]})]}),"\n",(0,s.jsx)(t.h2,{id:"docker-config",children:"Docker Resources"}),"\n",(0,s.jsx)(t.p,{children:"In order to complete all tutorials in this series, you must allocate enough\nresources to Docker. Ensure you allocate at least:"}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsx)(t.li,{children:"5 CPU"}),"\n",(0,s.jsx)(t.li,{children:"12GB Memory"}),"\n",(0,s.jsx)(t.li,{children:"4GB swap"}),"\n"]}),"\n",(0,s.jsx)(t.p,{children:"This can be managed through your tool of choice (e.g. Docker Desktop, Rancher, etc)."}),"\n",(0,s.jsxs)(t.p,{children:["You are now ready to ",(0,s.jsx)(t.a,{href:"./create-clusters",children:"create the clusters"})," for the workshop!"]})]})}function h(e={}){const{wrapper:t}={...(0,r.a)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}},1151:(e,t,n)=>{n.d(t,{Z:()=>l,a:()=>i});var s=n(7294);const r={},o=s.createContext(r);function i(e){const t=s.useContext(o);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function l(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:i(e.components),s.createElement(o.Provider,{value:t},e.children)}}}]);