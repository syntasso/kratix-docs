"use strict";(self.webpackChunkkratix_docs=self.webpackChunkkratix_docs||[]).push([[3049],{2481:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>d,contentTitle:()=>o,default:()=>h,frontMatter:()=>l,metadata:()=>i,toc:()=>a});const i=JSON.parse('{"id":"main/reference/destinations/multidestination-management","title":"Managing Multiple Destinations","description":"Learn more about how Kratix schedules Promises and Resources, and how you can control the scheduling process.","source":"@site/docs/main/03-reference/13-destinations/02-multidestination-management.md","sourceDirName":"main/03-reference/13-destinations","slug":"/main/reference/destinations/multidestination-management","permalink":"/main/reference/destinations/multidestination-management","draft":false,"unlisted":false,"editUrl":"https://github.com/syntasso/kratix-docs/tree/main/docs/main/03-reference/13-destinations/02-multidestination-management.md","tags":[],"version":"current","sidebarPosition":2,"frontMatter":{"title":"Managing Multiple Destinations","sidebar_label":"Managing Multiple Destinations","description":"Learn more about how Kratix schedules Promises and Resources, and how you can control the scheduling process."},"sidebar":"mainSidebar","previous":{"title":"Destinations","permalink":"/main/reference/destinations/intro"},"next":{"title":"State Stores","permalink":"/main/reference/statestore/intro"}}');var t=s(4848),r=s(8453);const l={title:"Managing Multiple Destinations",sidebar_label:"Managing Multiple Destinations",description:"Learn more about how Kratix schedules Promises and Resources, and how you can control the scheduling process."},o=void 0,d={},a=[{value:"Scheduling Promises",id:"promises",level:2},{value:"Scheduling Resources",id:"resources",level:2},{value:"Dynamic scheduling",id:"dynamic",level:2},{value:"Directory-based scheduling",id:"directory",level:3},{value:"Default scheduling",id:"default",level:3},{value:"Compound Promises",id:"compound-promises",level:2}];function c(e){const n={a:"a",admonition:"admonition",code:"code",em:"em",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,r.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.p,{children:"One of the most powerful features of Kratix is having full control over the\nscheduling of work across extensive and diverse infrastructure."}),"\n",(0,t.jsx)(n.p,{children:"For example, this could be determining which Kubernetes cluster or Terraform Enterprise\ninstance a certain workload should be scheduled to."}),"\n",(0,t.jsx)(n.p,{children:"In Kratix, scheduling happens in two stages:"}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsxs)(n.li,{children:["Determining Destinations that should be available to a given Promise (",(0,t.jsx)(n.a,{href:"#promises",children:"Scheduling\nPromises"}),")"]}),"\n",(0,t.jsxs)(n.li,{children:["Determining where the Resources will run following a request for a Promise Resource\n(",(0,t.jsx)(n.a,{href:"#resources",children:"Scheduling Workloads"}),")"]}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:["The following sections on this page document those stages. For hands-on scheduling guides,\ncheck the ",(0,t.jsx)(n.a,{href:"../../guides/new-destination",children:"Adding a new Destination"})," and ",(0,t.jsx)(n.a,{href:"../../guides/compound-promises",children:"Compound\nPromises"})," pages."]}),"\n",(0,t.jsx)(n.h2,{id:"promises",children:"Scheduling Promises"}),"\n",(0,t.jsx)(n.p,{children:"When a Promise is installed, by default Kratix will schedule the Promise Dependencies onto\nall Destinations registered with the Platform. When a new Destination is registered,\nKratix will also schedule all Promise Dependencies onto this new Destination."}),"\n",(0,t.jsx)(n.p,{children:"Platform teams can, however, control which Destinations receive which Promises by\nusing a combination of Destination labels and Promise Destination selectors."}),"\n",(0,t.jsxs)(n.p,{children:["The ",(0,t.jsx)(n.code,{children:"labels"})," in the Destination document are the standard Kubernetes\n",(0,t.jsx)(n.a,{href:"https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/",children:"labels"}),":\nsimple, arbitrary, key/value pairs. In the example below, the Destination object is\nbeing created with a label ",(0,t.jsx)(n.code,{children:"environment"})," with value ",(0,t.jsx)(n.code,{children:"dev"}),":"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",metastring:'title="worker-2.yaml"',children:"apiVersion: platform.kratix.io/v1alpha1\nkind: Destination\nmetadata:\n  # highlight-start\n  labels:\n    environment: dev\n  # highlight-end\n  # ...\n"})}),"\n",(0,t.jsxs)(n.p,{children:["In the Promise document, the scheduling is controlled via the ",(0,t.jsx)(n.code,{children:"spec.destinationSelectors"}),"\nkey, following the format below:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:"apiVersion: platform.kratix.io/v1alpha1\nkind: Promise\nmetadata: #...\nspec:\n  destinationSelectors:\n    - matchLabels:\n      key: value\n"})}),"\n",(0,t.jsxs)(n.p,{children:["By setting ",(0,t.jsx)(n.code,{children:"matchLabels"})," with a ",(0,t.jsx)(n.code,{children:"key: value"})," pair, Platform teams can\ncontrol which Destinations the Promise's Dependencies should be\nscheduled to."]}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:"matchLabels"})," is an ",(0,t.jsx)(n.em,{children:"equality-based"})," selector. This means it will only match Destinations\nthat have keys/values that match. You can add multiple key/value pairs to the\n",(0,t.jsx)(n.code,{children:"matchLabels"}),", but note that it will only match when the Destination has a matching label\nfor ",(0,t.jsx)(n.em,{children:"all"})," the selectors."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",metastring:"title=jenkins-promise.yaml",children:"apiVersion: platform.kratix.io/v1alpha1\nkind: Promise\nmetadata:\n  name: jenkins-promise\nspec:\n  #highlight-start\n  destinationSelectors:\n    - matchLabels:\n        environment: dev\n  #highlight-end\n  dependencies:\n  # ...\n"})}),"\n",(0,t.jsxs)(n.p,{children:["If a Promise has no ",(0,t.jsx)(n.code,{children:"destinationSelectors"}),", it will be applied to all\nDestinations (unless the Destination has ",(0,t.jsx)(n.code,{children:"strictMatchLabels"})," set). If a\nDestination has no ",(0,t.jsx)(n.code,{children:"labels"}),", only Promises with no ",(0,t.jsx)(n.code,{children:"destinationSelectors"})," set\nwill be applied."]}),"\n",(0,t.jsx)(n.p,{children:"The table below contains a few examples:"}),"\n",(0,t.jsxs)(n.table,{children:[(0,t.jsx)(n.thead,{children:(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.th,{children:"Destination Label"}),(0,t.jsx)(n.th,{children:"Promise Selector"}),(0,t.jsx)(n.th,{children:"Match?"})]})}),(0,t.jsxs)(n.tbody,{children:[(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:(0,t.jsx)(n.em,{children:"no label"})}),(0,t.jsx)(n.td,{children:(0,t.jsx)(n.em,{children:"no selector"})}),(0,t.jsx)(n.td,{children:"\u2705"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"env: dev"})}),(0,t.jsx)(n.td,{children:(0,t.jsx)(n.em,{children:"no selector"})}),(0,t.jsx)(n.td,{children:"\u2705"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"env: dev"})}),(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"env: dev"})}),(0,t.jsx)(n.td,{children:"\u2705"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsxs)(n.td,{children:[(0,t.jsx)(n.code,{children:"env: dev"})," ",(0,t.jsx)("br",{})," ",(0,t.jsx)(n.code,{children:"zone:eu"})]}),(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"env: dev"})}),(0,t.jsx)(n.td,{children:"\u2705"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsxs)(n.td,{children:[(0,t.jsx)(n.code,{children:"env: dev"})," ",(0,t.jsx)("br",{})," ",(0,t.jsx)(n.code,{children:"zone:eu"})]}),(0,t.jsxs)(n.td,{children:[(0,t.jsx)(n.code,{children:"env: dev"})," ",(0,t.jsx)("br",{})," ",(0,t.jsx)(n.code,{children:"zone:eu"})]}),(0,t.jsx)(n.td,{children:"\u2705"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"env: dev"})}),(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"env: prod"})}),(0,t.jsx)(n.td,{children:"\u26d4\ufe0f"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"env: dev"})}),(0,t.jsxs)(n.td,{children:[(0,t.jsx)(n.code,{children:"env: dev"})," ",(0,t.jsx)("br",{})," ",(0,t.jsx)(n.code,{children:"zone:eu"})]}),(0,t.jsx)(n.td,{children:"\u26d4\ufe0f"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:(0,t.jsx)(n.em,{children:"no label"})}),(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"env: dev"})}),(0,t.jsx)(n.td,{children:"\u26d4\ufe0f"})]})]})]}),"\n",(0,t.jsxs)(n.p,{children:["It is possible to ",(0,t.jsx)(n.em,{children:"dynamically"})," determine where the Promise dependencies should go during\nthe Promise workflow. Check the ",(0,t.jsx)(n.a,{href:"#dynamic",children:"dynamic scheduling"})," section for more details."]}),"\n",(0,t.jsx)(n.h2,{id:"resources",children:"Scheduling Resources"}),"\n",(0,t.jsxs)(n.p,{children:["When a new request for a Resource comes in, Kratix reacts by triggering the\n",(0,t.jsx)(n.code,{children:"resource.configure"})," Workflow, as defined in the Promise ",(0,t.jsx)(n.code,{children:"spec.workflows"}),". If the Workflow\ncontains a Kratix Pipeline, the outputs of the Pipeline will then use the labels to\nidentify a matching Kratix Destination as the target Destination."]}),"\n",(0,t.jsxs)(n.p,{children:["When multiple Destinations match, Kratix will by default randomly select a registered\nDestination to schedule the Resource. If the Promise has ",(0,t.jsx)(n.code,{children:"spec.destinationSelectors"})," set,\nthe workload can only be scheduled to a Destination that has matching labels for the\nPromise."]}),"\n",(0,t.jsxs)(n.p,{children:["It is possible to ",(0,t.jsx)(n.em,{children:"dynamically"})," determine where Resources will go during the Workflow.\nCheck the ",(0,t.jsx)(n.a,{href:"#dynamic",children:"dynamic scheduling"})," section below for more details."]}),"\n",(0,t.jsx)(n.h2,{id:"dynamic",children:"Dynamic scheduling"}),"\n",(0,t.jsxs)(n.p,{children:["For both the ",(0,t.jsx)(n.a,{href:"../promises/workflows",children:"promise"})," and the ",(0,t.jsx)(n.a,{href:"../resources/workflows",children:"resource"}),"\nworkflows, Kratix mounts a metadata directory under ",(0,t.jsx)(n.code,{children:"/kratix/metadata"}),". At scheduling\ntime, Kratix will look for a ",(0,t.jsx)(n.code,{children:"destination-selectors.yaml"})," file in that directory with the\nfollowing format:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:"- directory: dir # Optional\n  matchLabels:\n    key: value\n"})}),"\n",(0,t.jsxs)(n.p,{children:["The next two sections will explain how the ",(0,t.jsx)(n.code,{children:"directory"})," key is used to determine how the\nlabels in that array item are used during scheduling."]}),"\n",(0,t.jsx)(n.h3,{id:"directory",children:"Directory-based scheduling"}),"\n",(0,t.jsxs)(n.p,{children:["If the ",(0,t.jsx)(n.code,{children:"directory"})," key is present, Kratix will ",(0,t.jsx)(n.strong,{children:"ignore"})," the Promise\n",(0,t.jsx)(n.code,{children:"spec.destinationSelectors"})," entirely, and use the matchers defined in the workflow. The\n",(0,t.jsx)(n.code,{children:"directory"})," represents a directory in ",(0,t.jsx)(n.code,{children:"/kratix/output"}),", where any files to be deployed as\npart of that specific workload must be placed."]}),"\n",(0,t.jsx)(n.p,{children:"For example, given the following Promise:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",metastring:"title=promise.yaml",children:"apiVersion: platform.kratix.io/v1alpha1\nkind: Promise\nmetadata: #...\nspec:\n  destinationSelectors:\n    - matchLabels:\n        promise: label\n"})}),"\n",(0,t.jsx)(n.p,{children:"And a Workflow that outputs the following files:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:"/kratix/output\n\u251c\u2500\u2500 document-0.yaml\n\u251c\u2500\u2500 some-dir/\n\u2502   \u2514\u2500\u2500 document-1.yaml\n\u2514\u2500\u2500 scheduled-dir/\n    \u251c\u2500\u2500 document-2.yaml\n    \u2514\u2500\u2500 document-3.yaml\n"})}),"\n",(0,t.jsxs)(n.p,{children:["With the following ",(0,t.jsx)(n.code,{children:"/kratix/metadata/destination-selectors.yaml"}),":"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",metastring:'title="workflow /kratix/metadata/destination-selectors.yaml"',children:"- directory: scheduled-dir # matches /kratix/output/scheduled-dir/\n  matchLabels:\n    workflow: subdir\n"})}),"\n",(0,t.jsx)(n.p,{children:"Kratix will schedule the documents as follows:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"document-2.yaml"}),", ",(0,t.jsx)(n.code,{children:"document-3.yaml"})," are scheduled to destinations with the\n",(0,t.jsx)(n.code,{children:"workflow=subdir"})," label.","\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["The scheduling config in ",(0,t.jsx)(n.code,{children:"destination-selectors.yaml"})," has specifically scheduled this\ndirectory."]}),"\n"]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"document-0.yaml"}),", ",(0,t.jsx)(n.code,{children:"some-dir/document-1.yaml"})," are scheduled to destinations with\nthe ",(0,t.jsx)(n.code,{children:"promise=label"})," label.","\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["They are not contained within a directory associated with a specific scheduling, so\nrevert to the ",(0,t.jsx)(n.a,{href:"#default",children:"default scheduling"}),"."]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"default",children:"Default scheduling"}),"\n",(0,t.jsxs)(n.p,{children:["If the ",(0,t.jsx)(n.code,{children:"directory"})," key is not present, Kratix will then ",(0,t.jsx)(n.strong,{children:"add"})," those to what is already\npresent in the Promise ",(0,t.jsx)(n.code,{children:"spec.destinationSelectors"})," field when identifying a target\nDestination."]}),"\n",(0,t.jsx)(n.p,{children:"For example, given the following Promise:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",metastring:"title=promise.yaml",children:"apiVersion: platform.kratix.io/v1alpha1\nkind: Promise\nmetadata: #...\nspec:\n  destinationSelectors:\n    - matchLabels:\n        promise: label\n"})}),"\n",(0,t.jsxs)(n.p,{children:["And a Workflow that outputs the following ",(0,t.jsx)(n.code,{children:"/kratix/metadata/destination-selectors.yaml"}),":"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",metastring:'title="workflow /kratix/metadata/destination-selectors.yaml"',children:"- matchLabels:\n    workflow: another-label\n"})}),"\n",(0,t.jsxs)(n.p,{children:["All resources will only be scheduled to destinations containing ",(0,t.jsx)(n.em,{children:"both"})," ",(0,t.jsx)(n.code,{children:"promise=label"})," and\n",(0,t.jsx)(n.code,{children:"workflow=another-label"})," labels."]}),"\n",(0,t.jsxs)(n.admonition,{type:"important",children:[(0,t.jsxs)(n.p,{children:["In the event of a label conflict, the Promise ",(0,t.jsx)(n.code,{children:"spec.destinationSelectors"})," take precedence\nover any dynamic scheduling."]}),(0,t.jsx)(n.p,{children:"The order of precedence is as follows:"}),(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsxs)(n.li,{children:["Promise ",(0,t.jsx)(n.code,{children:"spec.destinationSelectors"})]}),"\n",(0,t.jsxs)(n.li,{children:["Promise workflow ",(0,t.jsx)(n.code,{children:"destination-selectors.yaml"})]}),"\n",(0,t.jsxs)(n.li,{children:["Resource workflow ",(0,t.jsx)(n.code,{children:"destination-selectors.yaml"})]}),"\n"]})]}),"\n",(0,t.jsxs)(n.admonition,{type:"important",children:[(0,t.jsxs)(n.p,{children:["If the Promise Configure workflow creates the ",(0,t.jsx)(n.code,{children:"/kratix/metadata/destination-selectors.yaml"}),"\nwith an element ",(0,t.jsx)(n.strong,{children:"without"})," ",(0,t.jsx)(n.code,{children:"directory"}),", any subsequent Resource requests will use the\nresulting combination of labels as the default scheduling policy."]}),(0,t.jsxs)(n.p,{children:["In the example above, if that was the output of a Promise Configure workflow, any\nsubsequent resource requests for that Promise would be scheduled to Destinations with\n",(0,t.jsx)(n.code,{children:"promise=label"})," and ",(0,t.jsx)(n.code,{children:"workflow=another-label"})," labels."]})]}),"\n",(0,t.jsx)(n.h2,{id:"compound-promises",children:"Compound Promises"}),"\n",(0,t.jsx)(n.p,{children:"Compound Promises are Promises that, in their Dependencies, contain other\nPromises. That ability allows Platform teams to deliver entire stacks on demand,\ninstead of simple databases or services."}),"\n",(0,t.jsx)(n.p,{children:"To enable this functionality, the following needs to be true:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"The platform cluster must register itself as a worker cluster"}),"\n",(0,t.jsx)(n.li,{children:"The GitOps toolkit must be installed in the platform cluster"}),"\n",(0,t.jsx)(n.li,{children:"The Compound Promise must instruct Kratix to install its Dependencies (i.e. the other\nPromises) in the platform cluster"}),"\n",(0,t.jsx)(n.li,{children:"Optionally, the sub-Promises may instruct Kratix to install their Dependencies outside\nthe platform cluster"}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:["For detailed instructions on the above, please check the ",(0,t.jsx)(n.a,{href:"../../guides/compound-promises",children:"Compound\nPromises"})," guide."]})]})}function h(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(c,{...e})}):c(e)}},8453:(e,n,s)=>{s.d(n,{R:()=>l,x:()=>o});var i=s(6540);const t={},r=i.createContext(t);function l(e){const n=i.useContext(r);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:l(e.components),i.createElement(r.Provider,{value:n},e.children)}}}]);