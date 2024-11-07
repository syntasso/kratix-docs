"use strict";(self.webpackChunkkratix_docs=self.webpackChunkkratix_docs||[]).push([[5202],{3992:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>c,contentTitle:()=>o,default:()=>h,frontMatter:()=>r,metadata:()=>a,toc:()=>l});var s=i(5893),t=i(1151);const r={title:"Workflows",sidebar_position:12,sidebar_label:"Workflows",description:"Learn more about conventions in workflows",id:"workflows"},o=void 0,a={id:"main/reference/workflows",title:"Workflows",description:"Learn more about conventions in workflows",source:"@site/docs/main/05-reference/12-workflows.md",sourceDirName:"main/05-reference",slug:"/main/reference/workflows",permalink:"/main/reference/workflows",draft:!1,unlisted:!1,editUrl:"https://github.com/syntasso/kratix-docs/tree/main/docs/main/05-reference/12-workflows.md",tags:[],version:"current",sidebarPosition:12,frontMatter:{title:"Workflows",sidebar_position:12,sidebar_label:"Workflows",description:"Learn more about conventions in workflows",id:"workflows"},sidebar:"mainSidebar",previous:{title:"Versioning",permalink:"/main/reference/promises/releases"},next:{title:"Destinations",permalink:"/main/reference/destinations/intro"}},c={},l=[{value:"Summary",id:"summary",level:2},{value:"Pipelines",id:"pipelines",level:2},{value:"RBAC",id:"rbac",level:3},{value:"RBAC Permissions",id:"rbac-permissions",level:4},{value:"Cross Namespace RBAC Permissions",id:"cross-namespace-rbac-permissions",level:5},{value:"Service Account",id:"service-account",level:4},{value:"Custom Service Account",id:"custom-service-account",level:4},{value:"Secrets",id:"secrets",level:3},{value:"Volumes",id:"volumes",level:2},{value:"Input",id:"input",level:3},{value:"<code>object.yaml</code>",id:"objectyaml",level:4},{value:"Output",id:"output",level:3},{value:"Metadata",id:"metadata",level:3},{value:"Passing data between containers",id:"passing-data-between-containers",level:4},{value:"Environment Variables",id:"environment-variables",level:2},{value:"Security Context",id:"security-context",level:2}];function d(e){const n={a:"a",admonition:"admonition",code:"code",h2:"h2",h3:"h3",h4:"h4",h5:"h5",li:"li",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,t.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(n.p,{children:["A ",(0,s.jsx)(n.a,{href:"./promises/intro",children:"Kratix Promise"})," can be configured with a series of ",(0,s.jsx)(n.strong,{children:"workflows"}),"\nfor both Promises and Resources, defined within the Promise ",(0,s.jsx)(n.code,{children:"workflows"})," field."]}),"\n",(0,s.jsx)(n.p,{children:"Within the workflows, Promise writers can define a series of actions that will be executed\nwhen certain conditions are met in the system."}),"\n",(0,s.jsx)(n.h2,{id:"summary",children:"Summary"}),"\n",(0,s.jsx)(n.p,{children:"The supported workflows are summarised in the table below. See the other sections on this\npage for details."}),"\n",(0,s.jsxs)(n.table,{children:[(0,s.jsx)(n.thead,{children:(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.th,{}),(0,s.jsx)(n.th,{children:"Trigger(s)"}),(0,s.jsx)(n.th,{children:"Supported Pipelines"})]})}),(0,s.jsxs)(n.tbody,{children:[(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:(0,s.jsx)(n.strong,{children:"Promise Configure"})}),(0,s.jsx)(n.td,{children:"The Promise is created, updated, or reconciled"}),(0,s.jsx)(n.td,{children:"Multiple, executed serially"})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:(0,s.jsx)(n.strong,{children:"Promise Delete"})}),(0,s.jsx)(n.td,{children:"The Promise is deleted"}),(0,s.jsx)(n.td,{children:"Single"})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:(0,s.jsx)(n.strong,{children:"Resource Configure"})}),(0,s.jsx)(n.td,{children:"The Resource is created, updated or reconciled, or the parent Promise is updated"}),(0,s.jsx)(n.td,{children:"Multiple, executed serially"})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:(0,s.jsx)(n.strong,{children:"Resource Delete"})}),(0,s.jsx)(n.td,{children:"The Resource is deleted"}),(0,s.jsx)(n.td,{children:"Single"})]})]})]}),"\n",(0,s.jsxs)(n.p,{children:["An example of how ",(0,s.jsx)(n.code,{children:"workflows"})," are defined within the Promise is shown below."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:"platform: platform.kratix.io/v1alpha1\nkind: Promise\nmetadata:\n  ...\nspec:\n  ...\n  workflows:\n    resource:\n      configure:\n        - # Pipeline definitions (multiple)\n      delete:\n        - # Pipeline definition (single)\n    promise:\n      configure:\n        - # Pipeline definitions (multiple)\n      delete:\n        - # Pipeline definition (single)\n"})}),"\n",(0,s.jsxs)(n.p,{children:["A particular workflow (e.g. ",(0,s.jsx)(n.code,{children:"resource.configure"}),") is an array of Kratix Pipeline objects\nthat will be executed in order."]}),"\n",(0,s.jsx)(n.p,{children:"See the next section to learn how to define a Pipeline."}),"\n",(0,s.jsx)(n.h2,{id:"pipelines",children:"Pipelines"}),"\n",(0,s.jsxs)(n.p,{children:["A Kratix ",(0,s.jsx)(n.code,{children:"Pipeline"})," kind is a simple wrapper around a Kubernetes Pod."]}),"\n",(0,s.jsxs)(n.p,{children:["Pipelines will automatically mount the necessary ",(0,s.jsx)(n.a,{href:"#volumes",children:"Kratix Volumes"})," and set\n",(0,s.jsx)(n.a,{href:"#environment-variables",children:"Environment Variables"})," for the provided containers."]}),"\n",(0,s.jsxs)(n.p,{children:["Any ",(0,s.jsx)(n.code,{children:"labels"})," and ",(0,s.jsx)(n.code,{children:"annotations"})," provided in the Pipeline spec will be passed\nthrough to the underlying Pod spec."]}),"\n",(0,s.jsx)(n.p,{children:"An example Pipeline is shown below."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:"apiVersion: platform.kratix.io/v1alpha1\nkind: Pipeline\nmetadata:\n  name: # Name (must be unique within the Promise)\n  namespace: # Namespace (optional)\n  labels: # Labels (optional)\n  annotations: # Annotations (optional)\nspec:\n  volumes:\n    - # Volume definitions, in addition to `/kratix` volumes (optional)\n  containers:\n    - name: # Container name (must be unique within the Pipeline)\n      image: # Container image to run\n      # Supported fields passed through to underlying Pod spec (all optional):\n      command: []\n      args: []\n      env: []\n      envFrom: []\n      volumeMounts: []\n      imagePullPolicy: # Either Always, IfNotPresent or Never\n      securityContext: # Optional. Can be configured directly or via kratix config\n  imagePullSecrets: []\n"})}),"\n",(0,s.jsxs)(n.p,{children:["Refer to the ",(0,s.jsx)(n.a,{href:"https://kubernetes.io/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec",children:"Kubernetes Pod Spec\ndocumentation"}),"\nfor more information on the fields above."]}),"\n",(0,s.jsx)(n.admonition,{type:"note",children:(0,s.jsx)(n.p,{children:"Not all fields from the Pod spec are supported. We will add support for more fields in\nthe future."})}),"\n",(0,s.jsx)(n.h3,{id:"rbac",children:"RBAC"}),"\n",(0,s.jsxs)(n.p,{children:["Each pipeline runs with its own service account and a default set of restrictive\nRBAC permissions. By default the service account is automatically created by\nKratix and the name is deterministic. You have three options for providing\nadditional ",(0,s.jsx)(n.a,{href:"https://kubernetes.io/docs/reference/access-authn-authz/rbac/",children:"RBAC\npermissions"})," to\nthe pipeline:"]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["Specify additional ",(0,s.jsx)(n.a,{href:"#rbac-permissions",children:"RBAC permissions"})," in your pipeline spec.\nKratix will automatically create the required Role/ClusterRole and\nRoleBinding/ClusterRoleBinding"]}),"\n",(0,s.jsxs)(n.li,{children:["Use the ",(0,s.jsx)(n.a,{href:"#service-account",children:"default service account"})," Kratix creates and\nmanually create the Role/ClusterRole and RoleBinding/ClusterRoleBinding"]}),"\n",(0,s.jsxs)(n.li,{children:["Specify a ",(0,s.jsx)(n.a,{href:"#custom-service-account",children:"custom service account"})," in your pipeline\nspec, and manage the lifecycle of the service account yourself, including\ncreating the required Role/ClusterRole and RoleBinding/ClusterRoleBinding"]}),"\n"]}),"\n",(0,s.jsx)(n.admonition,{type:"note",children:(0,s.jsxs)(n.p,{children:["The namespace a resource request pipeline runs in is the same as the namespace as the resource\nrequest. Promise pipelines run in the ",(0,s.jsx)(n.code,{children:"kratix-platform-system"})," namespace."]})}),"\n",(0,s.jsx)(n.h4,{id:"rbac-permissions",children:"RBAC Permissions"}),"\n",(0,s.jsxs)(n.p,{children:["In the pipeline spec, you can provide additional ",(0,s.jsx)(n.a,{href:"https://kubernetes.io/docs/reference/access-authn-authz/rbac/",children:"RBAC permissions"})," to the\npipeline pod by specifying additional\n",(0,s.jsx)(n.a,{href:"https://kubernetes.io/docs/reference/access-authn-authz/rbac/#role-example",children:"rules"}),"\nin the ",(0,s.jsx)(n.code,{children:".spec.rbac.permissions"}),":"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:'platform: platform.kratix.io/v1alpha1\nkind: Promise\nmetadata:\n  name: env\nspec:\n  ...\n  workflows:\n    resource:\n      configure:\n      - apiVersion: platform.kratix.io/v1alpha1\n        kind: Pipeline\n        metadata:\n          name: slack-notify\n        spec:\n          rbac:\n            permissions:\n              - apiGroups: [""]\n                verbs: ["*"]\n                resources: ["secrets"]\n              - apiGroups: ["batch"]\n                verbs: ["get"]\n                resources: ["jobs"]\n                resourceName: ["my-job"]\n        ...\n'})}),"\n",(0,s.jsxs)(n.p,{children:["The above example provides the pipeline pod with the ability in its own\nnamespace to have full control over the secrets, and the ability to ",(0,s.jsx)(n.code,{children:"get"})," a Job\ncalled ",(0,s.jsx)(n.code,{children:"my-job"}),"."]}),"\n",(0,s.jsx)(n.h5,{id:"cross-namespace-rbac-permissions",children:"Cross Namespace RBAC Permissions"}),"\n",(0,s.jsxs)(n.p,{children:["You can also provide RBAC permissions across namespaces by specifying the\n",(0,s.jsx)(n.code,{children:"resourceNamespace"})," field in the RBAC permissions. This field is optional and if\nnot set it defaults to the namespace of the pipeline. If set to ",(0,s.jsx)(n.code,{children:"*"}),", the\nunderlying ClusterRole is bound to a ClusterRoleBinding instead of a\nRoleBinding, giving the pipeline permissions across all namespaces."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:'platform: platform.kratix.io/v1alpha1\nkind: Promise\nmetadata:\n  name: env\nspec:\n  ...\n  workflows:\n    resource:\n      configure:\n      - apiVersion: platform.kratix.io/v1alpha1\n        kind: Pipeline\n        metadata:\n          name: slack-notify\n        spec:\n          rbac:\n            permissions:\n              - apiGroups: [""]\n                verbs: ["get"]\n                resources: ["secrets"]\n                resourceNamespace: "ns-of-my-secrets"\n              - apiGroups: ["batch"]\n                verbs: ["get", "list"]\n                resources: ["jobs"]\n                resourceNamespace: "*"\n        ...\n'})}),"\n",(0,s.jsxs)(n.p,{children:["The above example provides the pipeline pod with the ability get the secrets in\nthe ",(0,s.jsx)(n.code,{children:"ns-of-my-secrets"})," namespace regardless of what namespace the pipeline runs\nin. The pipeline also has the ability to ",(0,s.jsx)(n.code,{children:"get"})," and ",(0,s.jsx)(n.code,{children:"list"})," Jobs across all namespaces."]}),"\n",(0,s.jsx)(n.h4,{id:"service-account",children:"Service Account"}),"\n",(0,s.jsxs)(n.p,{children:["Each pipelines runs with a ",(0,s.jsx)(n.a,{href:"https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/",children:"service\naccount"}),"\nunique to that namespace, which is automatically created by Kratix when the\npipeline is triggered for the first time. The service account following the\nnaming convention of\n",(0,s.jsx)(n.code,{children:"<promise-name>-<workflow-type>-<workflow-action>-<pipeline-name>"}),". For example\nthe below Promise would create two service accounts:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml:",children:"platform: platform.kratix.io/v1alpha1\nkind: Promise\nmetadata:\n  name: env\nspec:\n  ...\n  workflows:\n    resource:\n      delete:\n      - apiVersion: platform.kratix.io/v1alpha1\n        kind: Pipeline\n        metadata:\n          name: slack-notify\n    promise:\n      configure:\n      - apiVersion: platform.kratix.io/v1alpha1\n        kind: Pipeline\n        metadata:\n          name: tf-workspace\n"})}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"env-resource-delete-slack-notify"})," would be created in each namespace where\nthe resource request is made"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"env-promise-configure-tf-workspace"})," would be created in the\n",(0,s.jsx)(n.code,{children:"kratix-platform-system"})," namespace"]}),"\n"]}),"\n",(0,s.jsx)(n.h4,{id:"custom-service-account",children:"Custom Service Account"}),"\n",(0,s.jsxs)(n.p,{children:["You can provide a custom service account for the pipeline by providing the ",(0,s.jsx)(n.code,{children:".rbac.serviceAccount"})," field in the pipeline spec."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:"platform: platform.kratix.io/v1alpha1\nkind: Promise\nmetadata:\n  name: env\nspec:\n  ...\n  workflows:\n    resource:\n      configure:\n      - apiVersion: platform.kratix.io/v1alpha1\n        kind: Pipeline\n        metadata:\n            name: slack-notify\n          spec:\n            rbac:\n              serviceAccount: my-service-account\n"})}),"\n",(0,s.jsx)(n.p,{children:"Kratix will use this service account for the pipeline instead of the standard\none. If it does not exist, Kratix will create it and manage its lifecycle. If it\ndoes exist, Kratix will not modify or delete the service account."}),"\n",(0,s.jsx)(n.h3,{id:"secrets",children:"Secrets"}),"\n",(0,s.jsxs)(n.p,{children:["To access Secrets in the Pipeline, you can either ",(0,s.jsx)(n.a,{href:"#rbac",children:"provide additional\nRBAC"})," so that the pipeline can ",(0,s.jsx)(n.code,{children:"kubectl get secret"}),"  secret or pass in a\nreference to the Pipeline container's ",(0,s.jsx)(n.code,{children:"env"})," using ",(0,s.jsx)(n.code,{children:"valueFrom.secretKeyRef"})," in\nthe standard Kubernetes way."]}),"\n",(0,s.jsx)(n.admonition,{type:"note",children:(0,s.jsx)(n.p,{children:"The Secret must be accessible within the Pipeline's namespace."})}),"\n",(0,s.jsxs)(n.p,{children:["Refer to the ",(0,s.jsx)(n.a,{href:"https://kubernetes.io/docs/concepts/configuration/secret/",children:"Kubernetes documentation"}),"\nfor more details on Secrets in Kubernetes."]}),"\n",(0,s.jsx)(n.h2,{id:"volumes",children:"Volumes"}),"\n",(0,s.jsxs)(n.p,{children:["Kratix will run each container in the ",(0,s.jsx)(n.code,{children:"spec.containers"})," list in order,\nproviding a set of common volumes, as defined below."]}),"\n",(0,s.jsx)(n.h3,{id:"input",children:"Input"}),"\n",(0,s.jsxs)(n.p,{children:["Kratix provides an ",(0,s.jsx)(n.strong,{children:"input directory"})," to the container, mounted at ",(0,s.jsx)(n.code,{children:"/kratix/input"}),". This\ndirectory is populated with different files depending on the type of workflow."]}),"\n",(0,s.jsx)(n.h4,{id:"objectyaml",children:(0,s.jsx)(n.code,{children:"object.yaml"})}),"\n",(0,s.jsxs)(n.p,{children:["In all workflows, all Pipeline containers will have access to an ",(0,s.jsx)(n.code,{children:"object.yaml"})," file\nwithin the ",(0,s.jsx)(n.code,{children:"/kratix/input"})," directory."]}),"\n",(0,s.jsx)(n.p,{children:"The contents of this file vary as follows:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Promise workflows"}),": The ",(0,s.jsx)(n.code,{children:"object.yaml"})," file contains the full Promise definition."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Resource workflows"}),": The ",(0,s.jsx)(n.code,{children:"object.yaml"})," file contains the Resource Request definition\nwhich was submitted to the Kratix platform."]}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["This is a useful way to find out information about the Kubernetes Object the Pipeline is\nbeing invoked for. For example, you could read the latest ",(0,s.jsx)(n.code,{children:"status"})," from this input Object\nand modify the behaviour of the Pipeline accordingly."]}),"\n",(0,s.jsxs)(n.p,{children:["If your workflow contains multiple Pipelines, then the ",(0,s.jsx)(n.code,{children:"object.yaml"})," is the only way to\ncommunicate between the Pipelines (e.g. via status updates)."]}),"\n",(0,s.jsx)(n.h3,{id:"output",children:"Output"}),"\n",(0,s.jsxs)(n.p,{children:["At the end of a Pipeline, all files present in the ",(0,s.jsx)(n.strong,{children:"output directory"})," mounted at\n",(0,s.jsx)(n.code,{children:"/kratix/output"})," will be written to the ",(0,s.jsx)(n.a,{href:"./statestore/intro",children:"State Store"}),"."]}),"\n",(0,s.jsx)(n.p,{children:"All containers in the Pipeline can write to this volume, and any container can add, update, or remove\ndocuments from this directory."}),"\n",(0,s.jsx)(n.admonition,{type:"note",children:(0,s.jsxs)(n.p,{children:["Files written to ",(0,s.jsx)(n.code,{children:"/kratix/output"})," in ",(0,s.jsx)(n.code,{children:"delete"})," Pipelines will be ignored."]})}),"\n",(0,s.jsx)(n.h3,{id:"metadata",children:"Metadata"}),"\n",(0,s.jsxs)(n.p,{children:["All containers in a ",(0,s.jsx)(n.code,{children:"configure"})," Pipeline have access a shared ",(0,s.jsx)(n.strong,{children:"metadata directory"}),"\nmounted at ",(0,s.jsx)(n.code,{children:"/kratix/metadata"}),"."]}),"\n",(0,s.jsx)(n.p,{children:"Pipeline containers can control aspects of how Kratix behaves by creating special files in\nthis directory:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"destination-selectors.yaml"})," can be added to any Promise to further refine where the\nresources in ",(0,s.jsx)(n.code,{children:"/kratix/output"})," will be ",(0,s.jsx)(n.a,{href:"./destinations/multidestination-management",children:"scheduled"}),"."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"status.yaml"})," allows the Pipeline to communicate information about the resource back to\nthe requester. See the ",(0,s.jsx)(n.a,{href:"./resources/status",children:"status documentation for more information"}),"."]}),"\n"]}),"\n",(0,s.jsx)(n.h4,{id:"passing-data-between-containers",children:"Passing data between containers"}),"\n",(0,s.jsxs)(n.p,{children:["Kratix scans for these files and ignores all other files in the ",(0,s.jsx)(n.code,{children:"/kratix/metadata"}),"\ndirectory. If you need to pass additional information to the next container in\nthe Pipeline, you can safely write to the ",(0,s.jsx)(n.code,{children:"/kratix/metadata"})," directory."]}),"\n",(0,s.jsx)(n.h2,{id:"environment-variables",children:"Environment Variables"}),"\n",(0,s.jsx)(n.p,{children:"Kratix will set the following environment variables for all containers in the\nworkflow:"}),"\n",(0,s.jsxs)(n.table,{children:[(0,s.jsx)(n.thead,{children:(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.th,{children:"Variable"}),(0,s.jsx)(n.th,{children:"Description"})]})}),(0,s.jsxs)(n.tbody,{children:[(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:(0,s.jsx)(n.code,{children:"KRATIX_WORKFLOW_ACTION"})}),(0,s.jsxs)(n.td,{children:["The action that triggered the workflow. Either ",(0,s.jsx)(n.code,{children:"configure"})," or ",(0,s.jsx)(n.code,{children:"delete"}),"."]})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:(0,s.jsx)(n.code,{children:"KRATIX_WORKFLOW_TYPE"})}),(0,s.jsxs)(n.td,{children:["The type of workflow. Either ",(0,s.jsx)(n.code,{children:"resource"})," or ",(0,s.jsx)(n.code,{children:"promise"}),"."]})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:(0,s.jsx)(n.code,{children:"KRATIX_PROMISE_NAME"})}),(0,s.jsx)(n.td,{children:"The name of the Promise."})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:(0,s.jsx)(n.code,{children:"KRATIX_PIPELINE_NAME"})}),(0,s.jsx)(n.td,{children:"The name of the Pipeline."})]})]})]}),"\n",(0,s.jsxs)(n.p,{children:["By checking the ",(0,s.jsx)(n.code,{children:"KRATIX_WORKFLOW_ACTION"})," and ",(0,s.jsx)(n.code,{children:"KRATIX_WORKFLOW_TYPE"})," environment variables,\na container is able to discover the ",(0,s.jsx)(n.strong,{children:"context"})," in which it's being invoked (e.g. \"I'm\nrunning as part of a Promise Configure workflow\")."]}),"\n",(0,s.jsxs)(n.p,{children:["This means that you could write a ",(0,s.jsx)(n.strong,{children:"single"})," container image to be used in all four\nworkflows (",(0,s.jsx)(n.code,{children:"promise.configure"}),", ",(0,s.jsx)(n.code,{children:"promise.delete"}),", ",(0,s.jsx)(n.code,{children:"resource.configure"}),", and\n",(0,s.jsx)(n.code,{children:"resource.delete"}),"), and switch the container's mode of operation based on the context."]}),"\n",(0,s.jsx)(n.h2,{id:"security-context",children:"Security Context"}),"\n",(0,s.jsxs)(n.p,{children:["A Pipeline consists of containers provided in the Promise, and 3 Kratix specific\ncontainers. Kratix configures its own containers in the pipeline to run with the\nfollowing ",(0,s.jsx)(n.a,{href:"https://kubernetes.io/docs/tasks/configure-pod-container/security-context/",children:"security\ncontext"}),":"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"securityContext:\n  allowPrivilegeEscalation: false\n  capabilities:\n    drop:\n    - ALL\n  privileged: false\n  runAsNonRoot: true\n  seccompProfile:\n    type: RuntimeDefault\n"})}),"\n",(0,s.jsx)(n.p,{children:"A Pod level security context is not set and cannot currently be configured."}),"\n",(0,s.jsx)(n.p,{children:"Any containers provided in the Promise will by default not have any security\ncontext set. You can set the security context for the Promise specific\ncontainers (not Kratix containers) by either:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(n.p,{children:"Specifying the security context in the container spec, e.g.:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:"apiVersion: platform.kratix.io/v1alpha1\nkind: Pipeline\nmetadata:\n  name: # Name (must be unique within the Promise)\n  namespace: # Namespace (optional)\nspec:\n  containers:\n    - name: # Container name (must be unique within the Pipeline)\n      image: # Container image to run\n      securityContext:\n        # Security context fields, e.g.:\n        runAsNonRoot: false\n"})}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:["Specifying a global default security context in the ",(0,s.jsx)(n.code,{children:"kratix"})," ConfigMap in the\n",(0,s.jsx)(n.code,{children:"kratix-platform-system"}),". See the ",(0,s.jsx)(n.a,{href:"./kratix-config/config",children:"Kratix Config documentation"})," for more information."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:"apiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: kratix\n  namespace: kratix-platform-system\ndata:\n  config: |\n    workflows:\n      defaultContainerSecurityContext:\n        # Security context fields, e.g.:\n        runAsNonRoot: false\n"})}),"\n"]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"Any security context set in the container spec will override the global default\nsecurity context."})]})}function h(e={}){const{wrapper:n}={...(0,t.a)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}},1151:(e,n,i)=>{i.d(n,{Z:()=>a,a:()=>o});var s=i(7294);const t={},r=s.createContext(t);function o(e){const n=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:o(e.components),s.createElement(r.Provider,{value:n},e.children)}}}]);