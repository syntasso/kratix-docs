"use strict";(self.webpackChunkkratix_docs=self.webpackChunkkratix_docs||[]).push([[2468],{9814:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>o,default:()=>l,frontMatter:()=>i,metadata:()=>a,toc:()=>d});var s=n(5893),r=n(1151);const i={title:"Updates",sidebar_label:"Updates",description:"Documentation on how updates behave for Resources"},o="Updates",a={id:"main/reference/resources/updates",title:"Updates",description:"Documentation on how updates behave for Resources",source:"@site/docs/main/03-reference/15-resources/05-updates.md",sourceDirName:"main/03-reference/15-resources",slug:"/main/reference/resources/updates",permalink:"/main/reference/resources/updates",draft:!1,unlisted:!1,editUrl:"https://github.com/syntasso/kratix-docs/tree/main/docs/main/03-reference/15-resources/05-updates.md",tags:[],version:"current",sidebarPosition:5,frontMatter:{title:"Updates",sidebar_label:"Updates",description:"Documentation on how updates behave for Resources"},sidebar:"mainSidebar",previous:{title:"Status",permalink:"/main/reference/resources/status"},next:{title:"Kratix Config",permalink:"/main/reference/kratix-config/config"}},c={},d=[{value:"Workflows",id:"workflows",level:2},{value:"Scheduling",id:"scheduling",level:2}];function u(e){const t={a:"a",code:"code",h1:"h1",h2:"h2",p:"p",strong:"strong",...(0,r.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.h1,{id:"updates",children:"Updates"}),"\n",(0,s.jsx)(t.p,{children:"Kratix supports updating Resource Requests with new specifications."}),"\n",(0,s.jsxs)(t.p,{children:["Given that the Resource workflows are defined within the parent Promise, updates to a\nResource Request are limited to updating the request parameters in the ",(0,s.jsx)(t.code,{children:"spec"}),"."]}),"\n",(0,s.jsx)(t.h2,{id:"workflows",children:"Workflows"}),"\n",(0,s.jsxs)(t.p,{children:["Any update to the Resource will result in Kratix re-running the\n",(0,s.jsx)(t.a,{href:"./workflows#configure-workflows",children:"Resource Configure"})," workflow."]}),"\n",(0,s.jsxs)(t.p,{children:["Any files which are output by this workflow will replace all existing files associated\nwith this Resource in the ",(0,s.jsx)(t.a,{href:"../statestore/intro",children:"StateStore"}),"."]}),"\n",(0,s.jsx)(t.h2,{id:"scheduling",children:"Scheduling"}),"\n",(0,s.jsxs)(t.p,{children:["If an update to a Resource changes its scheduling, the change will be ",(0,s.jsx)(t.strong,{children:"ignored"}),"."]}),"\n",(0,s.jsx)(t.p,{children:"The Destination selected at the first the Workflow run is always used. To move a Resource\nfrom one Destination to another, you can delete and create it again."}),"\n",(0,s.jsxs)(t.p,{children:["See ",(0,s.jsx)(t.a,{href:"../destinations/multidestination-management#resources",children:"Managing Multiple Destinations"})," for\nmore details on scheduling."]})]})}function l(e={}){const{wrapper:t}={...(0,r.a)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(u,{...e})}):u(e)}},1151:(e,t,n)=>{n.d(t,{Z:()=>a,a:()=>o});var s=n(7294);const r={},i=s.createContext(r);function o(e){const t=s.useContext(i);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:o(e.components),s.createElement(i.Provider,{value:t},e.children)}}}]);