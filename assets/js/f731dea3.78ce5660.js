"use strict";(self.webpackChunkkratix_docs=self.webpackChunkkratix_docs||[]).push([[8831],{3495:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>d,contentTitle:()=>a,default:()=>h,frontMatter:()=>s,metadata:()=>o,toc:()=>c});var i=n(5893),r=n(1151);const s={description:"Documentation for the Kratix Destination Custom Resource",title:"Destination",sidebar_label:"Destinations",id:"intro"},a=void 0,o={id:"main/reference/destinations/intro",title:"Destination",description:"Documentation for the Kratix Destination Custom Resource",source:"@site/docs/main/05-reference/03-destinations/01-destinations.md",sourceDirName:"main/05-reference/03-destinations",slug:"/main/reference/destinations/intro",permalink:"/main/reference/destinations/intro",draft:!1,unlisted:!1,editUrl:"https://github.com/syntasso/kratix-docs/tree/main/docs/main/05-reference/03-destinations/01-destinations.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{description:"Documentation for the Kratix Destination Custom Resource",title:"Destination",sidebar_label:"Destinations",id:"intro"},sidebar:"mainSidebar",previous:{title:"BucketStateStore",permalink:"/main/reference/statestore/bucketstatestore"},next:{title:"Introduction",permalink:"/main/reference/promises/intro"}},d={},c=[];function l(e){const t={a:"a",admonition:"admonition",code:"code",li:"li",p:"p",pre:"pre",ul:"ul",...(0,r.a)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(t.p,{children:"The Kratix Destination Custom Resource Definition (CRD) is the representation of\na system that Kratix can write documents to. These documents are then\nreconciled by an external tool."}),"\n",(0,i.jsx)(t.p,{children:"Some example use cases:"}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.a,{href:"https://kubernetes.io/",children:"Kubernetes cluster"}),": Kratix will scheduled documents (Kubernets manifests) to\nthe Destination, and then a GitOps tool running on the Kubernetes cluster,\nsuch as Flux or ArgoCD with pull down the documents and deploy them."]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.a,{href:"https://www.terraform.io/",children:"Terraform"}),": There are many toolings that exist to trigger Terraform applys\nwhen a new Terraform file is committed to a Git repository. For example\n",(0,i.jsx)(t.a,{href:"https://www.hashicorp.com/resources/gitops-and-terraform-enterprise-a-match-made-in-heaven-at-state-farm",children:"Terraform\nEnterprise"}),"\nhas built in support for GitOps workflows."]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.a,{href:"https://www.ansible.com/",children:"Ansible"}),", where an Ansible Tower can be configured to reconcile from a Git\nrepository."]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.a,{href:"https://backstage.io/",children:"Backstage"}),", where a Backstage instance can be configured have its ",(0,i.jsx)(t.a,{href:"https://backstage.io/docs/integrations/github/discovery",children:"Catalog\nfilled from a Git\nrepository"}),"."]}),"\n"]}),"\n",(0,i.jsx)(t.p,{children:"Below is the full Spec for the Destination CRD:"}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-yaml",children:"apiVersion: platform.kratix.io/v1alpha1\nkind: Destination\nmetadata:\n  # The Destination name is an arbitrary name that represent where workloads will be scheduled by the platform\n  name: destination-name\n  # The Destination labels are arbitrary key/value pairs that can be used for scheduling\n  #   the installation of Promises and the Resources\n  labels:\n    environment: dev\nspec:\n  # Destination identifier: optional, appended path to be used within the State Store\n  path: path/in/statestore\n\n  # Optional, defaults to false\n\n  # By default, Kratix will schedule workloads for Promises without\n  #   `destinationSelectors` to all available Destinations.\n  # If this property is set to true, Kratix will only schedule Workloads\n  #   to this Destination if the Promise `destinationSelectors` match\n  #   this Destination's labels\n  strictMatchLabels: false\n\n  # Optional, defaults to `nestedByMetadata`\n  # The mode to use when writing to the State Store, valid options are:\n  #   - nestedByMetadata: Writes to the State Store in a nested structure\n  #   - none: Writes to the State Store in a flat structure\n  filepath:\n    mode: nestedByMetadata | none\n\n  # Required\n  stateStoreRef:\n    # The name of the State Store to use: required\n    name: default\n    # The kind of the State Store to use: required, valid options: GitStateStore, BucketStateStore\n    kind: BucketStateStore\n"})}),"\n",(0,i.jsxs)(t.p,{children:["When a new Destination is registered in the platform cluster (i.e., a new Destination resource is\ncreated), Kratix will write to two paths in the ",(0,i.jsx)(t.a,{href:"../statestore/intro",children:"State\nStore"}),":\none for ",(0,i.jsx)(t.code,{children:"resources"}),", one for ",(0,i.jsx)(t.code,{children:"dependencies"}),". The path within the ",(0,i.jsx)(t.code,{children:"State Store"})," follows the following pattern:"]}),"\n",(0,i.jsxs)(t.p,{children:["For ",(0,i.jsx)(t.code,{children:"dependencies"}),":"]}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{children:"statestore.Spec.Path/\n    destination.Spec.Path/\n        destination.Name/\n            dependencies/\n                promise.Name/\n"})}),"\n",(0,i.jsxs)(t.p,{children:["For ",(0,i.jsx)(t.code,{children:"resources"}),":"]}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{children:"statestore.Spec.Path/\n    destination.Spec.Path/\n        destination.Name/\n            resources/\n                resource.Namespace/\n                    promise.Name/\n                        resource.Namespace/\n"})}),"\n",(0,i.jsxs)(t.p,{children:["For example installing and requesting from a Promise that provides ",(0,i.jsx)(t.code,{children:"Redis"})," as a service you would get:"]}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{children:"worker-cluster/dependencies/redis/static/dependencies.yaml\nworker-cluster/resources/default/redis/my-request/redis.yaml\n"})}),"\n",(0,i.jsx)(t.p,{children:"For example:"}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-yaml",children:"---\napiVersion: platform.kratix.io/v1alpha1\nkind: BucketStateStore\nmetadata:\n  name: default\n  namespace: default\nspec:\n  path: destinations\n  endpoint: s3.amazonaws.com\n  insecure: true\n  bucketName: kratix\n  secretRef:\n    name: aws-credentials\n---\napiVersion: platform.kratix.io/v1alpha1\nkind: Destination\nmetadata:\n  name: worker-1\n  labels:\n    environment: dev\nspec:\n  path: dev\n  stateStoreRef:\n    name: default\n    kind: BucketStateStore\n"})}),"\n",(0,i.jsx)(t.p,{children:"The above configuration would result in the following paths being written to:"}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsx)(t.li,{children:(0,i.jsx)(t.code,{children:"destinations/dev/default/worker-1/dependencies/"})}),"\n",(0,i.jsx)(t.li,{children:(0,i.jsx)(t.code,{children:"destinations/dev/default/worker-1/resources/"})}),"\n"]}),"\n",(0,i.jsx)("br",{}),"\n",(0,i.jsxs)(t.p,{children:["The paths should be used when setting up the workers to pull\ndown from the ",(0,i.jsx)(t.code,{children:"StateStore"}),"."]}),"\n",(0,i.jsx)(t.admonition,{type:"info",children:(0,i.jsx)(t.p,{children:"The reason for two directories is that GitOps applies require any prerequisite workloads like CRDs to be ready before any dependent workloads are applied. By dividing the two directories you can configure your GitOps tool to manage this for you."})})]})}function h(e={}){const{wrapper:t}={...(0,r.a)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(l,{...e})}):l(e)}},1151:(e,t,n)=>{n.d(t,{Z:()=>o,a:()=>a});var i=n(7294);const r={},s=i.createContext(r);function a(e){const t=i.useContext(s);return i.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function o(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:a(e.components),i.createElement(s.Provider,{value:t},e.children)}}}]);