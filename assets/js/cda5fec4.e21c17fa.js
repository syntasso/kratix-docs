"use strict";(self.webpackChunkkratix_docs=self.webpackChunkkratix_docs||[]).push([[1082],{1829:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>a,default:()=>l,frontMatter:()=>r,metadata:()=>o,toc:()=>d});const o=JSON.parse('{"id":"main/guides/installing-gitops-agent/other","title":"Others","description":"Using Custom GitOps Agent","source":"@site/docs/main/04-guides/05-installing-gitops-agent/03-other.mdx","sourceDirName":"main/04-guides/05-installing-gitops-agent","slug":"/main/guides/custom-gitops-agent","permalink":"/main/guides/custom-gitops-agent","draft":false,"unlisted":false,"editUrl":"https://github.com/syntasso/kratix-docs/tree/main/docs/main/04-guides/05-installing-gitops-agent/03-other.mdx","tags":[],"version":"current","sidebarPosition":3,"frontMatter":{"description":"Using Custom GitOps Agent","slug":"/main/guides/custom-gitops-agent","title":"Others"},"sidebar":"mainSidebar","previous":{"title":"ArgoCD","permalink":"/main/guides/installing-argocd"},"next":{"title":"Compound Promises","permalink":"/main/guides/compound-promises"}}');var s=n(4848),i=n(8453);const r={description:"Using Custom GitOps Agent",slug:"/main/guides/custom-gitops-agent",title:"Others"},a=void 0,c={},d=[];function u(e){const t={a:"a",code:"code",p:"p",...(0,i.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(t.p,{children:["If you do not wish to use Flux or ArgoCD, you can use any tool that can apply\nKubernetes manifests declared in the state store to your cluster. Kratix will\npopulate two separate directories, ",(0,s.jsx)(t.code,{children:"dependencies/"})," and ",(0,s.jsx)(t.code,{children:"resources/"})," within the\ndirectory of the Destination in the state store. The two directories should be\nreconciled independently."]}),"\n",(0,s.jsxs)(t.p,{children:["The two directories are responsible for different sets of Kubernetes resources.\nDocuments scheduled from the Promise Dependencies or Promise Configure Workflow\nget written to the ",(0,s.jsx)(t.code,{children:"dependencies/"})," directory. Documents scheduled from the\nResource Configure Workflows get written to the ",(0,s.jsx)(t.code,{children:"resources/"})," directory. It's\ncommon for a dependency to occur, where something in the ",(0,s.jsx)(t.code,{children:"dependencies/"}),"\ndirectory needs to be applied before something in the ",(0,s.jsx)(t.code,{children:"resources/"})," directory.\nThis is why reconciling the directories independently is important."]}),"\n",(0,s.jsx)(t.p,{children:"An example of a custom GitOps approach would be to configure two separate CI\npipeline to watch separate directories in the state store repository for changes\nand apply the manifests to the cluster. This approach loses some of the benefits\nof using a dedicated GitOps tool, such as automatic drift detection and\nreconciliation, but may be a good fit for when you already have a CI pipeline in\nplace or where more established GitOps tools are not applicable."}),"\n",(0,s.jsxs)(t.p,{children:["If you choose to use a custom GitOps agent with Kratix, we'd love to hear about\nit! Please reach out to us via the ",(0,s.jsx)(t.a,{href:"/main/community",children:"contact us\npage"})," to share your experience and help us improve Kratix."]})]})}function l(e={}){const{wrapper:t}={...(0,i.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(u,{...e})}):u(e)}},8453:(e,t,n)=>{n.d(t,{R:()=>r,x:()=>a});var o=n(6540);const s={},i=o.createContext(s);function r(e){const t=o.useContext(i);return o.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:r(e.components),o.createElement(i.Provider,{value:t},e.children)}}}]);