"use strict";(self.webpackChunkkratix_docs=self.webpackChunkkratix_docs||[]).push([[5352],{2720:(e,s,n)=>{n.r(s),n.d(s,{assets:()=>l,contentTitle:()=>i,default:()=>d,frontMatter:()=>o,metadata:()=>r,toc:()=>c});const r=JSON.parse('{"id":"main/how-kratix-complements/crossplane","title":"Kratix and Crossplane","description":"Learn more about how Kratix works with Crossplane","source":"@site/docs/main/06-how-kratix-complements/03-kratix-and-crossplane.md","sourceDirName":"main/06-how-kratix-complements","slug":"/main/how-kratix-complements/crossplane","permalink":"/main/how-kratix-complements/crossplane","draft":false,"unlisted":false,"editUrl":"https://github.com/syntasso/kratix-docs/tree/main/docs/main/06-how-kratix-complements/03-kratix-and-crossplane.md","tags":[],"version":"current","sidebarPosition":3,"frontMatter":{"description":"Learn more about how Kratix works with Crossplane","title":"Kratix and Crossplane","id":"crossplane"},"sidebar":"mainSidebar","previous":{"title":"Kratix and Terraform","permalink":"/main/how-kratix-complements/terraform"},"next":{"title":"Kratix and Backstage","permalink":"/main/how-kratix-complements/backstage"}}');var t=n(4848),a=n(8453);const o={description:"Learn more about how Kratix works with Crossplane",title:"Kratix and Crossplane",id:"crossplane"},i=void 0,l={},c=[];function p(e){const s={a:"a",em:"em",li:"li",p:"p",strong:"strong",ul:"ul",...(0,a.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(s.p,{children:(0,t.jsxs)(s.em,{children:[(0,t.jsx)(s.strong,{children:(0,t.jsx)(s.a,{href:"https://www.crossplane.io/",children:"Crossplane"})})," is an open-source multi-cloud control plane that allows you to extend Kubernetes to connect to and from external sources like databases, the cloud and the edge."]})}),"\n",(0,t.jsx)("img",{src:n(5131).A,alt:"Sample architecture with Kratix and Crossplane",style:{float:"right",width:"400px",margin:"20px 0 40px 40px"}}),"\n",(0,t.jsx)(s.p,{children:(0,t.jsxs)(s.em,{children:["We have written a tremendous ",(0,t.jsx)(s.a,{href:"https://www.syntasso.io/post/kratix-and-crossplane",children:"blog"})," about how Kratix and Crossplane complement each other."]})}),"\n",(0,t.jsxs)(s.p,{children:[(0,t.jsx)(s.a,{href:"../reference/promises/intro",children:"Kratix Promises"})," and ",(0,t.jsx)(s.a,{href:"https://docs.crossplane.io/v1.13/concepts/compositions/",children:"Crossplane Compositions"})," are similar in that they both provide declarative APIs and a facade into more complicated underlying platform orchestration."]}),"\n",(0,t.jsx)(s.p,{children:"Kratix does not aim to compete with Crossplane on cloud orchestration and it can help a platform builder already using Crossplane."}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsxs)(s.li,{children:["Creating a ",(0,t.jsx)(s.a,{href:"../reference/promises/intro",children:"Promise"})," for\nCrossplane simplifies the Crossplane installation experience."]}),"\n",(0,t.jsx)(s.li,{children:"Kratix provides multi-cluster\nsupport for\nfree. Where Crossplane users are managing several Crossplane provider\nclusters, Kratix complements by providing the cross-cluster management of\nresources."}),"\n",(0,t.jsxs)(s.li,{children:["A Promise can abstract away Crossplane. If a Platform needs to provide a\nPostgres as a Service with a production version managed by Crossplane ",(0,t.jsx)(s.em,{children:"and"}),"\nand they also need to provide an inexpensive dev version that is run on a\ndensified development cluster then this can be handled for free with Kratix\nvia Promises. See the\n",(0,t.jsx)(s.a,{href:"https://www.syntasso.io/post/building-your-platform-your-way-with-crossplane-and-kratix",children:"blog"}),"\nfor more detail on this pattern."]}),"\n",(0,t.jsxs)(s.li,{children:[(0,t.jsx)(s.a,{href:"../reference/promises/intro",children:"Kratix Promises"})," can offer the\nbenefits of Workflows. Tasks such as billing checks, security scans, audits,\nresource decoration etc can all happen in the Promise before a delegation to\nCrossplane is made."]}),"\n",(0,t.jsx)(s.li,{children:"Kratix provides GitOps out of the box so the state of Crossplane resources is\nall managed for free."}),"\n"]})]})}function d(e={}){const{wrapper:s}={...(0,a.R)(),...e.components};return s?(0,t.jsx)(s,{...e,children:(0,t.jsx)(p,{...e})}):p(e)}},5131:(e,s,n)=>{n.d(s,{A:()=>r});const r=n.p+"assets/images/k+crossplane_arch-30d69051d4ae9dbd196b58d62e3f4484.png"},8453:(e,s,n)=>{n.d(s,{R:()=>o,x:()=>i});var r=n(6540);const t={},a=r.createContext(t);function o(e){const s=r.useContext(a);return r.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function i(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:o(e.components),r.createElement(a.Provider,{value:s},e.children)}}}]);