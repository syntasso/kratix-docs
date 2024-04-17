"use strict";(self.webpackChunkkratix_docs=self.webpackChunkkratix_docs||[]).push([[2035],{3862:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>d,contentTitle:()=>o,default:()=>h,frontMatter:()=>s,metadata:()=>l,toc:()=>a});var t=i(5893),r=i(1151);const s={title:"Workflows",sidebar_label:"Workflows",description:"Learn more about conventions in workflows",id:"workflows"},o=void 0,l={id:"main/reference/workflows",title:"Workflows",description:"Learn more about conventions in workflows",source:"@site/docs/main/05-reference/06-workflows.md",sourceDirName:"main/05-reference",slug:"/main/reference/workflows",permalink:"/main/reference/workflows",draft:!1,unlisted:!1,editUrl:"https://github.com/syntasso/kratix-docs/tree/main/docs/main/05-reference/06-workflows.md",tags:[],version:"current",sidebarPosition:6,frontMatter:{title:"Workflows",sidebar_label:"Workflows",description:"Learn more about conventions in workflows",id:"workflows"},sidebar:"mainSidebar",previous:{title:"Updates",permalink:"/main/reference/resources/updates"},next:{title:"Managing Multiple Destinations",permalink:"/main/reference/multidestination-management"}},d={},a=[{value:"Summary",id:"summary",level:2},{value:"Pipelines",id:"pipelines",level:2},{value:"Secrets",id:"secrets",level:3},{value:"Volumes",id:"volumes",level:2},{value:"Input",id:"input",level:3},{value:"<code>object.yaml</code>",id:"objectyaml",level:4},{value:"Output",id:"output",level:3},{value:"Metadata",id:"metadata",level:3},{value:"Passing data between containers",id:"passing-data-between-containers",level:4},{value:"Environment Variables",id:"environment-variables",level:2}];function c(e){const n={a:"a",admonition:"admonition",code:"code",h2:"h2",h3:"h3",h4:"h4",li:"li",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,r.a)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(n.p,{children:["A ",(0,t.jsx)(n.a,{href:"./promises/intro",children:"Kratix Promise"})," can be configured with a series of ",(0,t.jsx)(n.strong,{children:"workflows"}),"\nfor both Promises and Resources, defined within the Promise ",(0,t.jsx)(n.code,{children:"workflows"})," field."]}),"\n",(0,t.jsx)(n.p,{children:"Within the workflows, Promise writers can define a series of actions that will be executed\nwhen certain conditions are met in the system."}),"\n",(0,t.jsx)(n.h2,{id:"summary",children:"Summary"}),"\n",(0,t.jsx)(n.p,{children:"The supported workflows are summarised in the table below. See the other sections on this\npage for details."}),"\n",(0,t.jsxs)(n.table,{children:[(0,t.jsx)(n.thead,{children:(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.th,{}),(0,t.jsx)(n.th,{children:"Trigger(s)"}),(0,t.jsx)(n.th,{children:"Supported Pipelines"})]})}),(0,t.jsxs)(n.tbody,{children:[(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:(0,t.jsx)(n.strong,{children:"Promise Configure"})}),(0,t.jsx)(n.td,{children:"The Promise is created, updated, or reconciled"}),(0,t.jsx)(n.td,{children:"Multiple, executed serially"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:(0,t.jsx)(n.strong,{children:"Promise Delete"})}),(0,t.jsx)(n.td,{children:"The Promise is deleted"}),(0,t.jsx)(n.td,{children:"Single"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:(0,t.jsx)(n.strong,{children:"Resource Configure"})}),(0,t.jsx)(n.td,{children:"The Resource is created, updated or reconciled, or the parent Promise is updated"}),(0,t.jsx)(n.td,{children:"Multiple, executed serially"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:(0,t.jsx)(n.strong,{children:"Resource Delete"})}),(0,t.jsx)(n.td,{children:"The Resource is deleted"}),(0,t.jsx)(n.td,{children:"Single"})]})]})]}),"\n",(0,t.jsxs)(n.p,{children:["An example of how ",(0,t.jsx)(n.code,{children:"workflows"})," are defined within the Promise is shown below."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:"platform: platform.kratix.io/v1alpha1\nkind: Promise\nmetadata:\n  ...\nspec:\n  ...\n  workflows:\n    resource:\n      configure:\n        - # Pipeline definitions (multiple)\n      delete:\n        - # Pipeline definition (single)\n    promise:\n      configure:\n        - # Pipeline definitions (multiple)\n      delete:\n        - # Pipeline definition (single)\n"})}),"\n",(0,t.jsxs)(n.p,{children:["A particular workflow (e.g. ",(0,t.jsx)(n.code,{children:"resource.configure"}),") is an array of Kratix Pipeline objects\nthat will be executed in order."]}),"\n",(0,t.jsx)(n.p,{children:"See the next section to learn how to define a Pipeline."}),"\n",(0,t.jsx)(n.h2,{id:"pipelines",children:"Pipelines"}),"\n",(0,t.jsxs)(n.p,{children:["A Kratix ",(0,t.jsx)(n.code,{children:"Pipeline"})," kind is a simple wrapper around a Kubernetes Pod."]}),"\n",(0,t.jsxs)(n.p,{children:["Pipelines will automatically mount the necessary ",(0,t.jsx)(n.a,{href:"#volumes",children:"Kratix Volumes"})," and set\n",(0,t.jsx)(n.a,{href:"#environment-variables",children:"Environment Variables"})," for the provided containers."]}),"\n",(0,t.jsx)(n.p,{children:"An example Pipeline is shown below."}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:"apiVersion: platform.kratix.io/v1alpha1\nkind: Pipeline\nmetadata:\n  name: # Name (must be unique within the Promise)\n  namespace: # Namespace (optional)\nspec:\n  volumes:\n    - # Volume definitions, in addition to `/kratix` volumes (optional)\n  containers:\n    - name: # Container name (must be unique within the Pipeline)\n      image: # Container image to run\n      # Supported fields passed through to underlying Pod spec (all optional):\n      command: []\n      args: []\n      env: []\n      envFrom: []\n      volumeMounts: []\n      imagePullPolicy: # Either Always, IfNotPresent or Never\n  imagePullSecrets: []\n"})}),"\n",(0,t.jsxs)(n.p,{children:["Refer to the ",(0,t.jsx)(n.a,{href:"https://kubernetes.io/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec",children:"Kubernetes Pod Spec\ndocumentation"}),"\nfor more information on the fields above."]}),"\n",(0,t.jsx)(n.admonition,{type:"note",children:(0,t.jsx)(n.p,{children:"Not all fields from the Pod spec are supported. We will add support for more fields in\nthe future."})}),"\n",(0,t.jsx)(n.h3,{id:"secrets",children:"Secrets"}),"\n",(0,t.jsxs)(n.p,{children:["To access Secrets in the Pipeline, you can pass in a reference to the Pipeline container's\n",(0,t.jsx)(n.code,{children:"env"})," using ",(0,t.jsx)(n.code,{children:"valueFrom.secretKeyRef"})," in the standard Kubernetes way."]}),"\n",(0,t.jsx)(n.admonition,{type:"note",children:(0,t.jsx)(n.p,{children:"The Secret must be accessible within the Pipeline's namespace."})}),"\n",(0,t.jsxs)(n.p,{children:["Refer to the ",(0,t.jsx)(n.a,{href:"https://kubernetes.io/docs/concepts/configuration/secret/",children:"Kubernetes documentation"}),"\nfor more details on Secrets in Kubernetes."]}),"\n",(0,t.jsx)(n.h2,{id:"volumes",children:"Volumes"}),"\n",(0,t.jsxs)(n.p,{children:["Kratix will run each container in the ",(0,t.jsx)(n.code,{children:"spec.containers"})," list in order,\nproviding a set of common volumes, as defined below."]}),"\n",(0,t.jsx)(n.h3,{id:"input",children:"Input"}),"\n",(0,t.jsxs)(n.p,{children:["Kratix provides an ",(0,t.jsx)(n.strong,{children:"input directory"})," to the container, mounted at ",(0,t.jsx)(n.code,{children:"/kratix/input"}),". This\ndirectory is populated with different files depending on the type of workflow."]}),"\n",(0,t.jsx)(n.h4,{id:"objectyaml",children:(0,t.jsx)(n.code,{children:"object.yaml"})}),"\n",(0,t.jsxs)(n.p,{children:["In all workflows, all Pipeline containers will have access to an ",(0,t.jsx)(n.code,{children:"object.yaml"})," file\nwithin the ",(0,t.jsx)(n.code,{children:"/kratix/input"})," directory."]}),"\n",(0,t.jsx)(n.p,{children:"The contents of this file vary as follows:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"Promise workflows"}),": The ",(0,t.jsx)(n.code,{children:"object.yaml"})," file contains the full Promise definition."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"Resource workflows"}),": The ",(0,t.jsx)(n.code,{children:"object.yaml"})," file contains the Resource Request definition\nwhich was submitted to the Kratix platform."]}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:["This is a useful way to find out information about the Kubernetes Object the Pipeline is\nbeing invoked for. For example, you could read the latest ",(0,t.jsx)(n.code,{children:"status"})," from this input Object\nand modify the behaviour of the Pipeline accordingly."]}),"\n",(0,t.jsxs)(n.p,{children:["If your workflow contains multiple Pipelines, then the ",(0,t.jsx)(n.code,{children:"object.yaml"})," is the only way to\ncommunicate between the Pipelines (e.g. via status updates)."]}),"\n",(0,t.jsx)(n.h3,{id:"output",children:"Output"}),"\n",(0,t.jsxs)(n.p,{children:["At the end of a Pipeline, all files present in the ",(0,t.jsx)(n.strong,{children:"output directory"})," mounted at\n",(0,t.jsx)(n.code,{children:"/kratix/output"})," will be written to the ",(0,t.jsx)(n.a,{href:"/main/reference/statestore/intro",children:"State Store"}),"."]}),"\n",(0,t.jsx)(n.p,{children:"All containers in the Pipeline can write to this volume, and any container can add, update, or remove\ndocuments from this directory."}),"\n",(0,t.jsx)(n.admonition,{type:"note",children:(0,t.jsxs)(n.p,{children:["Files written to ",(0,t.jsx)(n.code,{children:"/kratix/output"})," in ",(0,t.jsx)(n.code,{children:"delete"})," Pipelines will be ignored."]})}),"\n",(0,t.jsx)(n.h3,{id:"metadata",children:"Metadata"}),"\n",(0,t.jsxs)(n.p,{children:["All containers in a ",(0,t.jsx)(n.code,{children:"configure"})," Pipeline have access a shared ",(0,t.jsx)(n.strong,{children:"metadata directory"}),"\nmounted at ",(0,t.jsx)(n.code,{children:"/kratix/metadata"}),"."]}),"\n",(0,t.jsx)(n.p,{children:"Pipeline containers can control aspects of how Kratix behaves by creating special files in\nthis directory:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"destination-selectors.yaml"})," can be added to any Promise to further refine where the\nresources in ",(0,t.jsx)(n.code,{children:"/kratix/output"})," will be ",(0,t.jsx)(n.a,{href:"./multidestination-management",children:"scheduled"}),"."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"status.yaml"})," allows the Pipeline to communicate information about the resource back to\nthe requester. See the ",(0,t.jsx)(n.a,{href:"./resources/status",children:"status documentation for more information"}),"."]}),"\n"]}),"\n",(0,t.jsx)(n.h4,{id:"passing-data-between-containers",children:"Passing data between containers"}),"\n",(0,t.jsxs)(n.p,{children:["Kratix scans for these files and ignores all other files in the ",(0,t.jsx)(n.code,{children:"/kratix/metadata"}),"\ndirectory. If you need to pass additional information to the next container in\nthe Pipeline, you can safely write to the ",(0,t.jsx)(n.code,{children:"/kratix/metadata"})," directory."]}),"\n",(0,t.jsx)(n.h2,{id:"environment-variables",children:"Environment Variables"}),"\n",(0,t.jsx)(n.p,{children:"Kratix will set the following environment variables for all containers in the\nworkflow:"}),"\n",(0,t.jsxs)(n.table,{children:[(0,t.jsx)(n.thead,{children:(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.th,{children:"Variable"}),(0,t.jsx)(n.th,{children:"Description"})]})}),(0,t.jsxs)(n.tbody,{children:[(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"KRATIX_WORKFLOW_ACTION"})}),(0,t.jsxs)(n.td,{children:["The action that triggered the workflow. Either ",(0,t.jsx)(n.code,{children:"configure"})," or ",(0,t.jsx)(n.code,{children:"delete"}),"."]})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"KRATIX_WORKFLOW_TYPE"})}),(0,t.jsxs)(n.td,{children:["The type of workflow. Either ",(0,t.jsx)(n.code,{children:"resource"})," or ",(0,t.jsx)(n.code,{children:"promise"}),"."]})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"KRATIX_PROMISE_NAME"})}),(0,t.jsx)(n.td,{children:"The name of the Promise."})]})]})]}),"\n",(0,t.jsxs)(n.p,{children:["By checking the ",(0,t.jsx)(n.code,{children:"KRATIX_WORKFLOW_ACTION"})," and ",(0,t.jsx)(n.code,{children:"KRATIX_WORKFLOW_TYPE"})," environment variables,\na container is able to discover the ",(0,t.jsx)(n.strong,{children:"context"})," in which it's being invoked (e.g. \"I'm\nrunning as part of a Promise Configure workflow\")."]}),"\n",(0,t.jsxs)(n.p,{children:["This means that you could write a ",(0,t.jsx)(n.strong,{children:"single"})," container image to be used in all four\nworkflows (",(0,t.jsx)(n.code,{children:"promise.configure"}),", ",(0,t.jsx)(n.code,{children:"promise.delete"}),", ",(0,t.jsx)(n.code,{children:"resource.configure"}),", and\n",(0,t.jsx)(n.code,{children:"resource.delete"}),"), and switch the container's mode of operation based on the context."]})]})}function h(e={}){const{wrapper:n}={...(0,r.a)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(c,{...e})}):c(e)}},1151:(e,n,i)=>{i.d(n,{Z:()=>l,a:()=>o});var t=i(7294);const r={},s=t.createContext(r);function o(e){const n=t.useContext(s);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:o(e.components),t.createElement(s.Provider,{value:n},e.children)}}}]);