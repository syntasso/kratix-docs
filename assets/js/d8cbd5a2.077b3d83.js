"use strict";(self.webpackChunkkratix_docs=self.webpackChunkkratix_docs||[]).push([[425],{6617:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>l,contentTitle:()=>o,default:()=>h,frontMatter:()=>t,metadata:()=>a,toc:()=>d});var i=s(5893),r=s(1151);const t={title:"Updates",sidebar_label:"Updates",description:"Documentation on how updates behave for Promises"},o=void 0,a={id:"main/reference/promises/updates",title:"Updates",description:"Documentation on how updates behave for Promises",source:"@site/docs/main/05-reference/04-promises/03-updates.md",sourceDirName:"main/05-reference/04-promises",slug:"/main/reference/promises/updates",permalink:"/main/reference/promises/updates",draft:!1,unlisted:!1,editUrl:"https://github.com/syntasso/kratix-docs/tree/main/docs/main/05-reference/04-promises/03-updates.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{title:"Updates",sidebar_label:"Updates",description:"Documentation on how updates behave for Promises"},sidebar:"mainSidebar",previous:{title:"Deleting",permalink:"/main/reference/promises/delete"},next:{title:"Workflows",permalink:"/main/reference/promises/workflows"}},l={},d=[{value:"Workflows",id:"workflows",level:2},{value:"Scheduling",id:"scheduling",level:2},{value:"Misscheduled workloads",id:"misscheduled-workloads",level:3},{value:"Example",id:"example",level:4}];function c(e){const n={a:"a",code:"code",h2:"h2",h3:"h3",h4:"h4",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,r.a)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.p,{children:"Kratix supports updating Promises with new specifications."}),"\n",(0,i.jsx)(n.p,{children:"An update to a Promise will cause Kratix to reconcile on the new Promise definition,\nand any changes will be rolled out during this reconciliation."}),"\n",(0,i.jsx)(n.p,{children:"This may include:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"Updating the Promise API, which rolls out an update to the underlying CRD for the\nResources managed by the Promise."}),"\n",(0,i.jsx)(n.li,{children:"Updating the Promise or Resource workflows."}),"\n",(0,i.jsx)(n.li,{children:"Updating the Promise scheduling."}),"\n",(0,i.jsxs)(n.li,{children:["Updating the Promise's static dependencies (the ",(0,i.jsx)(n.code,{children:"dependencies"})," field in the Promise\nspec)."]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"workflows",children:"Workflows"}),"\n",(0,i.jsxs)(n.p,{children:["Any update to the Promise ",(0,i.jsx)(n.code,{children:"spec"})," will result in Kratix re-running the Promise Configure\nworkflow, as well as re-running the Resource Configure workflow for all existing Resource\nRequests."]}),"\n",(0,i.jsx)(n.p,{children:"For example, if you bump an image version for a Pipeline container in a Resource Configure\nworkflow, Kratix will ensure that all Resources are re-reconciled, including re-running\nthe Resource Configure workflow using the new image for every existing Resource."}),"\n",(0,i.jsxs)(n.p,{children:["See ",(0,i.jsx)(n.a,{href:"/main/reference/promises/workflows#configure-workflows",children:"Promise Workflows"})," and\n",(0,i.jsx)(n.a,{href:"/main/reference/resources/workflows#configure-workflows",children:"Resource Workflows"})," for\nmore details."]}),"\n",(0,i.jsx)(n.h2,{id:"scheduling",children:"Scheduling"}),"\n",(0,i.jsx)(n.p,{children:"The scheduling for a Promise may be changed by modifying either:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:".spec.destinationSelectors"})," in the Promise; or"]}),"\n",(0,i.jsxs)(n.li,{children:["the contents of ",(0,i.jsx)(n.code,{children:"/kratix/metadata/destination-selectors.yaml"})," at the end of a Workflow."]}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["See ",(0,i.jsx)(n.a,{href:"/main/reference/multidestination-management",children:"Managing Multiple Destinations"})," for more\ndetails on scheduling."]}),"\n",(0,i.jsx)(n.h3,{id:"misscheduled-workloads",children:"Misscheduled workloads"}),"\n",(0,i.jsx)(n.p,{children:"An update to the Promise's scheduling may result in a set of Destinations previously\ntargeted from old version of the Promise no longer being targeted."}),"\n",(0,i.jsxs)(n.p,{children:["When this happens, existing files written to the Destination ",(0,i.jsx)(n.strong,{children:"are not removed"}),", but are\nmarked as ",(0,i.jsx)(n.code,{children:"misscheduled"})," by Kratix and are ",(0,i.jsx)(n.strong,{children:"not updated any more"}),"."]}),"\n",(0,i.jsxs)(n.p,{children:["It's up to the platform team to manually delete these resources by deleting all\n",(0,i.jsx)(n.code,{children:"WorkPlacement"})," resources marked with the ",(0,i.jsx)(n.code,{children:"kratix.io/misscheduled"})," label."]}),"\n",(0,i.jsx)(n.h4,{id:"example",children:"Example"}),"\n",(0,i.jsxs)(n.p,{children:["Take a simple Promise which creates a namespace on the scheduled Destinations, with\nscheduling to ",(0,i.jsx)(n.code,{children:"environment: dev"})," as follows:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:"apiVersion: platform.kratix.io/v1alpha1\nkind: Promise\nmetadata:\n  name: promise-name\nspec:\n  destinationSelectors:\n    - matchLabels:\n        #highlight-next-line\n        environment: dev\n  dependencies:\n    - apiVersion: v1\n      kind: Namespace\n      metadata:\n        #highlight-next-line\n        name: foo\n"})}),"\n",(0,i.jsxs)(n.p,{children:["Kratix will schedule the ",(0,i.jsx)(n.code,{children:"foo"})," namespace resource to all Destinations with the label\n",(0,i.jsx)(n.code,{children:"environment: dev"})," as expected."]}),"\n",(0,i.jsx)(n.p,{children:"If you later update the Promise to instead have the following spec:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:"apiVersion: platform.kratix.io/v1alpha1\nkind: Promise\nmetadata:\n  name: promise-name\nspec:\n  destinationSelectors:\n    - matchLabels:\n        #highlight-next-line\n        environment: prod\n  dependencies:\n    - apiVersion: v1\n      kind: Namespace\n      metadata:\n        #highlight-next-line\n        name: bar\n"})}),"\n",(0,i.jsxs)(n.p,{children:["Kratix will schedule the ",(0,i.jsx)(n.code,{children:"bar"})," namespace to all Destinations with the label\n",(0,i.jsx)(n.code,{children:"environment: prod"})," and leave all the ",(0,i.jsx)(n.code,{children:"environment: dev"})," Destinations with the old\n",(0,i.jsx)(n.code,{children:"foo"})," namespace."]}),"\n",(0,i.jsxs)(n.p,{children:["The misscheduled ",(0,i.jsx)(n.code,{children:"WorkPlacement"})," resources can be identified by the ",(0,i.jsx)(n.code,{children:"misscheduled"})," label:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"> kubectl --context kind-platform -n kratix-platform-system get workplacements.platform.kratix.io --show-labels\nNAME                       AGE   LABELS\nnamespace.dev-cluster-1    40s   kratix.io/misscheduled=true,kratix.io/work=namespace\nnamespace.prod-cluster-1   26s   kratix.io/work=namespace\n"})}),"\n",(0,i.jsx)(n.p,{children:"Cleaning them up:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:'> kubectl --context kind-platform -n kratix-platform-system delete workplacements.platform.kratix.io --selector kratix.io/misscheduled=true\nworkplacements.platform.kratix.io "namespace.dev-cluster-1" deleted\n'})})]})}function h(e={}){const{wrapper:n}={...(0,r.a)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(c,{...e})}):c(e)}},1151:(e,n,s)=>{s.d(n,{Z:()=>a,a:()=>o});var i=s(7294);const r={},t=i.createContext(r);function o(e){const n=i.useContext(t);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:o(e.components),i.createElement(t.Provider,{value:n},e.children)}}}]);