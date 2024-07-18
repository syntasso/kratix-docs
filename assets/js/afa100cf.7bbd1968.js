"use strict";(self.webpackChunkkratix_docs=self.webpackChunkkratix_docs||[]).push([[1608],{1010:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>o,contentTitle:()=>l,default:()=>h,frontMatter:()=>i,metadata:()=>a,toc:()=>c});var r=n(5893),s=n(1151);const i={title:"Uninstalling Kratix",sidebar_position:100,sidebar_label:"Uninstalling Kratix",description:"Learn more about how to uninstall Kratix"},l=void 0,a={id:"main/reference/deleting-kratix",title:"Uninstalling Kratix",description:"Learn more about how to uninstall Kratix",source:"@site/docs/main/05-reference/100-deleting-kratix.md",sourceDirName:"main/05-reference",slug:"/main/reference/deleting-kratix",permalink:"/main/reference/deleting-kratix",draft:!1,unlisted:!1,editUrl:"https://github.com/syntasso/kratix-docs/tree/main/docs/main/05-reference/100-deleting-kratix.md",tags:[],version:"current",sidebarPosition:100,frontMatter:{title:"Uninstalling Kratix",sidebar_position:100,sidebar_label:"Uninstalling Kratix",description:"Learn more about how to uninstall Kratix"},sidebar:"mainSidebar",previous:{title:"Updates",permalink:"/main/reference/resources/updates"},next:{title:"Frequently Asked Questions",permalink:"/main/faq"}},o={},c=[{value:"platform cluster",id:"platform-cluster",level:2},{value:"Worker Destination",id:"worker-destination",level:2},{value:"State Store",id:"state-store",level:2}];function d(e){const t={a:"a",code:"code",h2:"h2",li:"li",ol:"ol",p:"p",pre:"pre",...(0,s.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.h2,{id:"platform-cluster",children:"platform cluster"}),"\n",(0,r.jsx)(t.p,{children:"To uninstall Kratix you need to run through the following steps:"}),"\n",(0,r.jsxs)(t.ol,{children:["\n",(0,r.jsx)(t.li,{children:"Delete all installed Promises:"}),"\n"]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-bash",children:"kubectl --context $PLATFORM delete promises --all -A\n"})}),"\n",(0,r.jsxs)(t.p,{children:["This will remove all of the Resource workloads from your ",(0,r.jsx)(t.a,{href:"./statestore/intro",children:"State Store"}),"."]}),"\n",(0,r.jsxs)(t.ol,{children:["\n",(0,r.jsx)(t.li,{children:"Delete all other Kratix resources:"}),"\n"]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-bash",children:"kubectl --context $PLATFORM delete destinations --all -A\nkubectl --context $PLATFORM delete bucketstatestores --all -A\nkubectl --context $PLATFORM delete gitstatestores --all -A\n"})}),"\n",(0,r.jsxs)(t.ol,{children:["\n",(0,r.jsx)(t.li,{children:"Kratix can now be uninstalled:"}),"\n"]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-bash",children:"kubectl delete -f https://github.com/syntasso/kratix/releases/latest/download/kratix.yaml\n"})}),"\n",(0,r.jsx)(t.h2,{id:"worker-destination",children:"Worker Destination"}),"\n",(0,r.jsx)(t.p,{children:"In the previous steps Kratix will have deleted all the Resource workloads from the State Store,\nwhich will result in them being deleting from the worker Destination. The only changes\nthat need to be made on the worker is deleting Flux (if installed just for Kratix)\nand the Flux resources that sync down from the State Store."}),"\n",(0,r.jsxs)(t.ol,{children:["\n",(0,r.jsxs)(t.li,{children:["Find the relevant ",(0,r.jsx)(t.code,{children:"Kustomization"})," resource:"]}),"\n"]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-bash",children:"kubectl --context $WORKER get kustomizations -A\n"})}),"\n",(0,r.jsxs)(t.ol,{children:["\n",(0,r.jsx)(t.li,{children:"Delete the Kustomizations that are for Kratix."}),"\n"]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-bash",children:"kubectl --context $WORKER delete kustomization <name>\n"})}),"\n",(0,r.jsxs)(t.ol,{children:["\n",(0,r.jsxs)(t.li,{children:["Find the relevant ",(0,r.jsx)(t.code,{children:"Bucket"})," or ",(0,r.jsx)(t.code,{children:"GitRepository"})," resource:"]}),"\n"]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-bash",children:"kubectl --context $WORKER get buckets,gitrepositories -A\n"})}),"\n",(0,r.jsxs)(t.ol,{children:["\n",(0,r.jsx)(t.li,{children:"Delete the ones that are for Kratix."}),"\n"]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-bash",children:"kubectl --context $WORKER delete bucket/gitrepositories <name>\n"})}),"\n",(0,r.jsx)(t.h2,{id:"state-store",children:"State Store"}),"\n",(0,r.jsxs)(t.p,{children:["The ",(0,r.jsx)(t.a,{href:"./statestore/intro",children:"State Store"})," should now be empty, verify\nthis manually. In the event any files are left behind they can manually be deleted."]})]})}function h(e={}){const{wrapper:t}={...(0,s.a)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(d,{...e})}):d(e)}},1151:(e,t,n)=>{n.d(t,{Z:()=>a,a:()=>l});var r=n(7294);const s={},i=r.createContext(s);function l(e){const t=r.useContext(i);return r.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:l(e.components),r.createElement(i.Provider,{value:t},e.children)}}}]);