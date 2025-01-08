"use strict";(self.webpackChunkkratix_docs=self.webpackChunkkratix_docs||[]).push([[8517],{4269:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>u,contentTitle:()=>d,default:()=>g,frontMatter:()=>h,metadata:()=>o,toc:()=>m});var o=n(5239),s=n(4848),r=n(8453),i=n(3270),a=n(829),l=n(7796),c=n(7707);const h={slug:"from-platform-to-destination",title:"How your Resources get from Promise to Destination",description:"The journey of a document from the Platform Cluster to a Destination",authors:["derik"],tags:["kratix","kratix internals","debugging"]},d=void 0,u={authorsImageUrls:[void 0]},m=[{value:"A Dive into Kratix Internals",id:"a-dive-into-kratix-internals",level:2},{value:"Reaching etcd limits",id:"reaching-etcd-limits",level:2},{value:"Conclusion",id:"conclusion",level:2}];function p(e){const t={a:"a",admonition:"admonition",code:"code",h2:"h2",hr:"hr",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,r.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.p,{children:"Ever wondered how Kratix actually gets your documents from the Platform Cluster\nto the correct Destination?"}),"\n",(0,s.jsxs)(t.p,{children:["The Syntasso Team has recently introduced a\n",(0,s.jsx)(t.a,{href:"https://github.com/syntasso/kratix/pull/243",children:"change"})," to\nKratix to reduce the size of the Work object. While this change is mostly\ninternal, we wanted to share how the innards of Kratix work."]}),"\n",(0,s.jsx)(t.p,{children:"So brace yourself to learn:"}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsx)(t.li,{children:"how Kratix moves documents from Platform to Destinations"}),"\n",(0,s.jsx)(t.li,{children:"what works and workplacements are"}),"\n",(0,s.jsx)(t.li,{children:"how to inspect works to debug your Promises"}),"\n"]}),"\n",(0,s.jsx)(t.p,{children:"You are probably already familiar with how Kratix works at a high level and with\nthe diagram below:"}),"\n",(0,s.jsxs)("figure",{className:"diagram",children:[(0,s.jsx)("img",{className:"large",src:i.A,alt:"High level diagram explaining how\nKratix processes requests"}),(0,s.jsx)("figcaption",{children:"How Kratix processes a request to a Kubernetes Destination"})]}),"\n",(0,s.jsx)(t.p,{children:"As illustrated above:"}),"\n",(0,s.jsxs)(t.ol,{children:["\n",(0,s.jsxs)(t.li,{children:["The user sends a new ",(0,s.jsx)(t.strong,{children:"App Request"})," to the Platform Cluster."]}),"\n",(0,s.jsxs)(t.li,{children:["The ",(0,s.jsx)(t.strong,{children:"Promise"})," reacts to that request and triggers the ",(0,s.jsx)(t.strong,{children:"Resource Configure\nWorkflows"}),"."]}),"\n",(0,s.jsxs)(t.li,{children:["The Workflow completes and outputs a ",(0,s.jsx)(t.strong,{children:"series of documents"})," to be scheduled\nto a ",(0,s.jsx)(t.strong,{children:"Destination"}),"."]}),"\n",(0,s.jsxs)(t.li,{children:["These documents are written to a specific directory in the ",(0,s.jsx)(t.strong,{children:"State Store"}),"."]}),"\n",(0,s.jsxs)(t.li,{children:["In the diagram, the documents are scheduled to a Kubernetes ",(0,s.jsx)(t.strong,{children:"Destination"}),".\nThese type of Destination usually have Flux (or ArgoCD, or another GitOps\ntool) watching the State Store. The tool picks up the new documents."]}),"\n",(0,s.jsx)(t.li,{children:"The documents are then processed and applied to the Destination."}),"\n",(0,s.jsxs)(t.li,{children:["The ",(0,s.jsx)(t.strong,{children:"App"})," becomes operational on the Destination."]}),"\n"]}),"\n",(0,s.jsx)(t.p,{children:"In this post, I'm going to expand on points (3) and (4): what happens at the end\nof the Workflow? How is the document written to the State Store? And how does\nthe change linked above affect this process?"}),"\n",(0,s.jsx)(t.hr,{}),"\n","\n",(0,s.jsx)(t.admonition,{type:"tip",children:(0,s.jsxs)(t.p,{children:["If the diagram is new to you, I recommend checking out the ",(0,s.jsx)(t.a,{href:"http://localhost:3000/workshop/part-i/intro",children:"Part I of the\nKratix Workshop"})," for an overview of\nKratix."]})}),"\n",(0,s.jsx)(t.h2,{id:"a-dive-into-kratix-internals",children:"A Dive into Kratix Internals"}),"\n",(0,s.jsxs)(t.p,{children:["The casual observers among you may have noticed that, when installing Kratix, a\ncouple of CRDs are also created but not prominently mentioned in the guides\nor workshops: the ",(0,s.jsx)(t.strong,{children:"Work"})," and the ",(0,s.jsx)(t.strong,{children:"WorkPlacement"}),"."]}),"\n",(0,s.jsxs)(t.p,{children:["The ",(0,s.jsx)(t.strong,{children:"Work"})," CRD contains the definition of, well, a Work. All the documents\noutput by a workflow are captured in the Work Object as ",(0,s.jsx)(t.strong,{children:"workloads"}),". Each\ndocument corresponds to a workload entry in the Work object. These workloads are\ngrouped by the ",(0,s.jsx)(t.strong,{children:"destination selectors"})," specified by both the Workflow and the\nPromise."]}),"\n",(0,s.jsx)(t.p,{children:"In other words, the Work object encapsulates everything needed to schedule the\nworkloads to the Destinations."}),"\n",(0,s.jsx)(t.admonition,{title:"How does the Work gets created?",type:"info",children:(0,s.jsxs)(t.p,{children:["Keen observers may have notice the few extra containers that are included in the\nWorkflow Job. One of these containers is called ",(0,s.jsx)(t.code,{children:"work-writer"}),". As the name\nsuggests, it handles creating the Work object at the end of the Workflow. \ud83d\ude09"]})}),"\n",(0,s.jsxs)(t.p,{children:["One of the controllers bundled with Kratix is the ",(0,s.jsx)(t.strong,{children:"Work Controller"}),". This\ncontroller is responsible for finding out all the available Destinations and\nselecting the right one for each workload in a Work. It achieves this by\nmonitoring Work objects and creating a ",(0,s.jsx)(t.strong,{children:"WorkPlacement"})," object for each\nworkload."]}),"\n",(0,s.jsxs)(t.admonition,{title:"What if there's no Destination to schedule a workload?",type:"tip",children:[(0,s.jsxs)(t.p,{children:["The Work Controller marks the Work as ",(0,s.jsx)(t.strong,{children:"Unscheduled"}),". You can verify this by\nchecking the ",(0,s.jsx)(t.code,{children:"Scheduled"})," condition in the ",(0,s.jsx)(t.code,{children:"status"})," field of the Work Object."]}),(0,s.jsx)(t.p,{children:"Once a Destination becomes available, the system will automatically try to\nschedule any unscheduled Work."})]}),"\n",(0,s.jsxs)(t.p,{children:["The ",(0,s.jsx)(t.strong,{children:"WorkPlacement"})," object serves as a link between a Work (or specifically, a\nworkload group within the Work) and a Destination. It contains a copy of the\nWorkloads and information about the Destination it is scheduled to."]}),"\n",(0,s.jsx)(t.p,{children:"The WorkPlacement controller reacts to WorkPlacements and ensures the workloads\nare written to the State Store associated with the Destination."}),"\n",(0,s.jsx)(t.p,{children:"The diagram below illustrates the Work and WorkPlacement objects in details:"}),"\n",(0,s.jsxs)("figure",{className:"diagram",children:[(0,s.jsx)("img",{className:"large",src:a.A,alt:"A Work with two workloads, from\nwhich two WorkPlacements are generated"}),(0,s.jsx)("figcaption",{children:"A Work generating two WorkPlacements"})]}),"\n",(0,s.jsx)(t.p,{children:"In summary:"}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsxs)(t.li,{children:["The contents of a Workflow output are combined into a single Work object. Each\ndocument has an associated ",(0,s.jsx)(t.code,{children:"workload"})," entry in the Work."]}),"\n",(0,s.jsx)(t.li,{children:"Workloads are grouped by the destination selectors specified by the Workflow\nand the Promise."}),"\n",(0,s.jsx)(t.li,{children:"From the Work object, a WorkPlacement is created for each Workload group."}),"\n",(0,s.jsx)(t.li,{children:"The WorkPlacement controller writes the Workloads to the State Store\nassociated with the Destination."}),"\n",(0,s.jsx)(t.li,{children:"\ud83c\udf89"}),"\n"]}),"\n",(0,s.jsx)(t.p,{children:"That means the Work object can get quite large, since it's combining all the\ndocuments into a single object. But how large is too large?"}),"\n",(0,s.jsx)(t.h2,{id:"reaching-etcd-limits",children:"Reaching etcd limits"}),"\n",(0,s.jsx)(t.p,{children:"The answer is about 1.5MB. While the Kubernetes API accepts up to 3MB of data in\na single request, etcd only persist keys up to 1.5MB (by default). Although this\nis configurable, it's fair to assume that most clusters where Kratix is deployed\nwill use the default settings."}),"\n",(0,s.jsxs)(t.p,{children:["So what happens if a Work object exceeds 1.5MB? The Configure Workflow fails at\nthe ",(0,s.jsx)(t.code,{children:"work-writer"})," container, and the error message isn't particularly helpful:"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-shell-session",children:"etcdserver: request is too large\n"})}),"\n",(0,s.jsx)(t.admonition,{type:"tip",children:(0,s.jsxs)(t.p,{children:["You may see an error message like ",(0,s.jsx)(t.code,{children:"Request entity too large: limit is 3145728"}),"; that means you are hitting the Kubernetes API limit, not the etcd\none."]})}),"\n",(0,s.jsxs)(t.p,{children:["While it takes a lot of YAML to be over 1.5MB, you can easily reach such a limit\nin your Promise. The ",(0,s.jsx)(t.a,{href:"https://github.com/prometheus-operator/prometheus-operator",children:"Prometheus\nOperator"}),", for\nexample, includes 3.7MB of YAML!"]}),"\n",(0,s.jsxs)(t.p,{children:["This brings us back to the ",(0,s.jsx)(t.a,{href:"https://github.com/syntasso/kratix/pull/243",children:"change introduced by\n243"}),". In this update, we introduced\ngzip compression for the Workload contents before persisting the Work into etcd.\nThis significantly reduces the size of the Work object (gzip documentation\nmentions an average of ",(0,s.jsx)(t.a,{href:"https://www.gnu.org/software/gzip/manual/gzip.html",children:"70% reduction in\nsize"}),"). For the Prometheus\nOperator, for example, the size of the Work object went from 3.7MB to about\n490KB\u2014an 87% reduction \ud83c\udf89!"]}),"\n",(0,s.jsx)(t.p,{children:"The downside? If you inspect the Work object, you\u2019ll see base64-encoded binary\ndata instead of some nice to read YAML."}),"\n",(0,s.jsxs)("figure",{className:"diagram",children:[(0,s.jsx)("img",{className:"large",src:l.A,alt:"Screenshot of a terminal showing\nthe Work object with binary data in the contents of a Workload"}),(0,s.jsx)("figcaption",{children:"A compressed Work Object"})]}),"\n",(0,s.jsx)(t.p,{children:"You can still read it though. To inspect a workload\u2019s contents, decode the\nbase64 data, then unzip it using this command:"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-shell-session",children:"kubectl get work <work-name> \\\n  -o jsonpath='{.spec.workloadGroups[0].workloads[0].content}' \\\n  | base64 -d \\\n  | gzip -d\n"})}),"\n",(0,s.jsxs)("figure",{className:"diagram",children:[(0,s.jsx)("img",{className:"large",src:c.A,alt:"Screenshot of a terminal showing\nthe decompressed contents of a workload from a Work object"}),(0,s.jsx)("figcaption",{children:"A decompressed workload"})]}),"\n",(0,s.jsx)(t.admonition,{type:"tip",children:(0,s.jsxs)(t.p,{children:["Check our ",(0,s.jsx)(t.a,{href:"/main/troubleshooting",children:"Troubleshooting guide"})," for more information on\nhow to debug Kratix, including inspecting Works and WorkPlacements."]})}),"\n",(0,s.jsx)(t.p,{children:"Despite compression, large Work objects may still pose challenges. While this\nupdate provides temporary relief, we\u2019ll need to revisit the structure to allow\nusers to have unbounded fun with their Promises. But that\u2019s a story for another\nday."}),"\n",(0,s.jsx)(t.h2,{id:"conclusion",children:"Conclusion"}),"\n",(0,s.jsx)(t.p,{children:"In this post, we dived into the internals of Kratix to understand how a\ndocument moves from the Platform Cluster to a Destination. We saw how the\nWork and WorkPlacement objects are used to schedule and write documents to the\nState Store. We also saw how the recent change to compress the Workload\ncontents has helped reduce the size of the Work object."}),"\n",(0,s.jsxs)(t.p,{children:["We hope this post has given you a better understanding of how Kratix works under\nthe hood. If you have any questions or feedback (or want to see more blog posts\nlike this) please don't hesitate to reach out to us on\n",(0,s.jsx)(t.a,{href:"https://kratixworkspace.slack.com/",children:"Slack"})," or\n",(0,s.jsx)(t.a,{href:"https://github.com/syntasso/kratix",children:"GitHub"}),"."]})]})}function g(e={}){const{wrapper:t}={...(0,r.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(p,{...e})}):p(e)}},3270:(e,t,n)=>{n.d(t,{A:()=>o});const o=n.p+"assets/images/figure01-92cbe3bb6fd370c414771a72acf70c3c.png"},829:(e,t,n)=>{n.d(t,{A:()=>o});const o=n.p+"assets/images/figure02-e8156b88651cd0ac3bec1b7d33b0ebc4.png"},7796:(e,t,n)=>{n.d(t,{A:()=>o});const o=n.p+"assets/images/figure03-920c2f30b0883bc82d0dc0c63992fe44.png"},7707:(e,t,n)=>{n.d(t,{A:()=>o});const o=n.p+"assets/images/figure04-c7827bda962629f0dea66bca80fc4968.png"},8453:(e,t,n)=>{n.d(t,{R:()=>i,x:()=>a});var o=n(6540);const s={},r=o.createContext(s);function i(e){const t=o.useContext(r);return o.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:i(e.components),o.createElement(r.Provider,{value:t},e.children)}},5239:e=>{e.exports=JSON.parse('{"permalink":"/blog/from-platform-to-destination","source":"@site/blog/2024-11-20-decompressing-work/index.mdx","title":"How your Resources get from Promise to Destination","description":"The journey of a document from the Platform Cluster to a Destination","date":"2024-11-20T00:00:00.000Z","tags":[{"inline":true,"label":"kratix","permalink":"/blog/tags/kratix"},{"inline":true,"label":"kratix internals","permalink":"/blog/tags/kratix-internals"},{"inline":true,"label":"debugging","permalink":"/blog/tags/debugging"}],"readingTime":6.235,"hasTruncateMarker":true,"authors":[{"name":"Derik Evangelista","title":"Engineer @ Syntasso","url":"https://github.com/kirederik","imageURL":"https://2.gravatar.com/avatar/7ac63fbda18c97f6a7fab8af157021367793187f4c5830eb722ff565c5a767e9?size=256","key":"derik","page":null}],"frontMatter":{"slug":"from-platform-to-destination","title":"How your Resources get from Promise to Destination","description":"The journey of a document from the Platform Cluster to a Destination","authors":["derik"],"tags":["kratix","kratix internals","debugging"]},"unlisted":false,"nextItem":{"title":"September Product Update","permalink":"/blog/sept-2024-product-update"}}')}}]);