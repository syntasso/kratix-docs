"use strict";(self.webpackChunkkratix_docs=self.webpackChunkkratix_docs||[]).push([[7241],{2947:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>l,contentTitle:()=>s,default:()=>h,frontMatter:()=>t,metadata:()=>a,toc:()=>d});var r=i(5893),o=i(1151);const t={title:"Introduction",description:"Introduction to Kratix and how to get started with the Kratix CLI",sidebar_label:"Introduction",id:"intro"},s=void 0,a={id:"main/kratix-cli/intro",title:"Introduction",description:"Introduction to Kratix and how to get started with the Kratix CLI",source:"@site/docs/main/05-kratix-cli/00_intro.md",sourceDirName:"main/05-kratix-cli",slug:"/main/kratix-cli/intro",permalink:"/main/kratix-cli/intro",draft:!1,unlisted:!1,editUrl:"https://github.com/syntasso/kratix-docs/tree/main/docs/main/05-kratix-cli/00_intro.md",tags:[],version:"current",sidebarPosition:0,frontMatter:{title:"Introduction",description:"Introduction to Kratix and how to get started with the Kratix CLI",sidebar_label:"Introduction",id:"intro"},sidebar:"mainSidebar",previous:{title:"What's next?",permalink:"/main/guides/whats-next"},next:{title:"Reference",permalink:"/category/reference-1"}},l={},d=[{value:"Installation",id:"installation",level:2},{value:"Enable shell autocompletion",id:"enable-shell-autocompletion",level:3},{value:"Writing Promises with the Kratix CLI",id:"writing-promises-with-the-kratix-cli",level:2},{value:"From Scratch",id:"from-scratch",level:3},{value:"Initialising a new Promise",id:"initialising-a-new-promise",level:4},{value:"Extending the API",id:"extending-the-api",level:4},{value:"Adding dependencies",id:"adding-dependencies",level:4},{value:"Adding Workflows",id:"adding-workflows",level:4},{value:"From Helm",id:"from-helm",level:3},{value:"From Operator",id:"from-operator",level:3},{value:"Building Workflow Containers",id:"building-workflow-containers",level:4}];function c(e){const n={a:"a",admonition:"admonition",code:"code",h2:"h2",h3:"h3",h4:"h4",li:"li",p:"p",pre:"pre",ul:"ul",...(0,o.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.p,{children:"The Kratix CLI is a tool designed to help you build promises and manage your Kratix\ninstallation."}),"\n",(0,r.jsx)(n.h2,{id:"installation",children:"Installation"}),"\n",(0,r.jsxs)(n.p,{children:["To install the Kratix CLI, go to the ",(0,r.jsx)(n.a,{href:"https://github.com/syntasso/kratix-cli/releases",children:"releases\npage"}),", download the latest release of\nthe binary for your platform."]}),"\n",(0,r.jsx)(n.p,{children:"Once you have downloaded the binary, you can install it by moving it to a directory in\nyour PATH."}),"\n",(0,r.jsx)(n.p,{children:"To verify your installation, run:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell-session",children:"kratix --version\n"})}),"\n",(0,r.jsx)(n.h3,{id:"enable-shell-autocompletion",children:"Enable shell autocompletion"}),"\n",(0,r.jsxs)(n.p,{children:["To configure your shell to load the CLI completions, add the completion script\nto your shell profile, replacing ",(0,r.jsx)(n.code,{children:"SHELL"})," with the name of your shell:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell-session",children:". <(kratix completion SHELL)\n"})}),"\n",(0,r.jsx)(n.p,{children:"For a list of supported shells, run:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell-session",children:"kratix completion --help\n"})}),"\n",(0,r.jsx)(n.h2,{id:"writing-promises-with-the-kratix-cli",children:"Writing Promises with the Kratix CLI"}),"\n",(0,r.jsx)(n.p,{children:"The CLI provides a set of commands to help you quickly iterate through the process of\nwriting a Promise. It supports building promises from scratch, or initialising it from a\nHelm chart or from an existing Operator."}),"\n",(0,r.jsx)(n.p,{children:"The examples below will walk you through building a promise for each of the three\nsupported scenarios."}),"\n",(0,r.jsx)(n.h3,{id:"from-scratch",children:"From Scratch"}),"\n",(0,r.jsx)(n.h4,{id:"initialising-a-new-promise",children:"Initialising a new Promise"}),"\n",(0,r.jsxs)(n.p,{children:["To initialise a new Promise from scratch, run the ",(0,r.jsx)(n.a,{href:"./reference/kratix-init-promise",children:"kratix init promise"})," command:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell-session",children:"kratix init promise mysql \\\n  --group mygroup.org \\\n  --kind Database \\\n  --version v1alpha1\n"})}),"\n",(0,r.jsx)(n.p,{children:"Where:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"mysql"})," is the name of the Promise"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"mygroup.org"})," is the Group of the Promised API resource"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"Database"})," is the Kind provided by the Promise"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"v1alpha1"})," is the Version of the Promised API resource"]}),"\n"]}),"\n",(0,r.jsxs)(n.admonition,{title:"Splitting files",type:"tip",children:[(0,r.jsxs)(n.p,{children:["By default, the CLI will create a single file for the Promise definition. If you want to\nsplit the definition into multiple files, you can use the ",(0,r.jsx)(n.code,{children:"--split"})," flag:"]}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell-session",children:"kratix init promise mysql [flags] --split\n"})}),(0,r.jsx)(n.p,{children:"The command above will create the following files:"}),(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"api.yaml"})," containing the CRD definition of the Promise API."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"dependencies.yaml"})," containing the dependencies of the Promise. This file will be empty by default."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"workflows.yaml"})," containing the Workflows of the Promise. This file will be\ncreated once you execute the ",(0,r.jsx)(n.a,{href:"./reference/kratix-add-container",children:"kratix add\ncontainer"})," command."]}),"\n"]})]}),"\n",(0,r.jsxs)(n.p,{children:["The above command creates a ",(0,r.jsx)(n.code,{children:"promise.yaml"})," in the current directly, filling the Promise\nAPI with the basic information provided."]}),"\n",(0,r.jsx)(n.h4,{id:"extending-the-api",children:"Extending the API"}),"\n",(0,r.jsxs)(n.p,{children:["You can add more fields to the API by running the ",(0,r.jsx)(n.a,{href:"./reference/kratix-update-api",children:"kratix update api"})," command:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell-session",children:"kratix update api --property size:string --property replicas:number\n"})}),"\n",(0,r.jsxs)(n.admonition,{title:"Removing fields",type:"tip",children:[(0,r.jsxs)(n.p,{children:["You can remove API fields by appending a ",(0,r.jsx)(n.code,{children:"-"})," to the desired property name:"]}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell-session",children:"kratix update api --property replicas-\n"})})]}),"\n",(0,r.jsx)(n.h4,{id:"adding-dependencies",children:"Adding dependencies"}),"\n",(0,r.jsxs)(n.p,{children:["You can add dependencies to the Promise by running the ",(0,r.jsx)(n.a,{href:"./reference/kratix-update-dependencies",children:"kratix add\ndependency"})," command. For example, to add a Namespace\nas a dependency to the MySQL Promise, create a directory with your dependency files:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell-session",children:"mkdir dependencies\nkubectl create namespace mynamespace --dry-run=client -o yaml > dependencies/namespace.yaml\n"})}),"\n",(0,r.jsx)(n.p,{children:"Then, add the dependency to the Promise:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell-session",children:"kratix update dependencies dependencies/\n"})}),"\n",(0,r.jsxs)(n.admonition,{title:"Adding dependencies as Workflows",type:"tip",children:[(0,r.jsxs)(n.p,{children:["Use the ",(0,r.jsx)(n.code,{children:"--image"})," flag to add a dependency as a Workflow:"]}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell-session",children:"kratix update dependencies dependencies/ --image myorg/mysql-dependencies:v1.0.0\n"})})]}),"\n",(0,r.jsx)(n.admonition,{title:"Namespaces",type:"note",children:(0,r.jsxs)(n.p,{children:["The ",(0,r.jsx)(n.code,{children:"update dependencies"})," command will automatically set the\n",(0,r.jsx)(n.code,{children:"metadata.namespace"})," to ",(0,r.jsx)(n.code,{children:"default"})," if the resource itself does not have a\nnamespace."]})}),"\n",(0,r.jsx)(n.h4,{id:"adding-workflows",children:"Adding Workflows"}),"\n",(0,r.jsxs)(n.p,{children:["To add a Workflow to the Promise, run the ",(0,r.jsx)(n.a,{href:"./reference/kratix-add-container",children:"kratix add container"})," command:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell-session",children:"kratix add container resource/configure/mypipeline --image myorg/mysql-pipeline:v1.0.0\n"})}),"\n",(0,r.jsxs)(n.p,{children:["The command above will create a ",(0,r.jsx)(n.code,{children:"workflows"})," directory with some basic files for your\nPipeline stage. You can then edit the files to add your custom logic."]}),"\n",(0,r.jsx)(n.h3,{id:"from-helm",children:"From Helm"}),"\n",(0,r.jsxs)(n.p,{children:["You can build promises straight from Helm charts. To do so, run the ",(0,r.jsx)(n.a,{href:"./reference/kratix-init-helm-promise",children:"kratix init\nhelm-promise"})," command, providing the Chart\nURL. The CLI will auto-generate the Promise API based on the Helm chart values."]}),"\n",(0,r.jsxs)(n.p,{children:["For example, consider the ",(0,r.jsx)(n.a,{href:"https://github.com/bitnami/charts/tree/main/bitnami/mysql",children:"bitnami/mysql Helm\nchart"}),". To create a\nPromise from this chart, run:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell-session",children:"kratix init helm-promise mysql \\\n  --group mygroup.org \\\n  --kind Database \\\n  --version v1alpha1 \\\n  --chart-url oci://registry-1.docker.io/bitnamicharts/mysql\n"})}),"\n",(0,r.jsxs)(n.p,{children:["The above command should create a ",(0,r.jsx)(n.code,{children:"promise.yaml"})," file in the current directory that's\nready to be installed. You can further customise it by adding dependencies and workflows.\nSee the ",(0,r.jsx)(n.a,{href:"#from-scratch",children:"Writing a Promise from Scratch"})," section for more details."]}),"\n",(0,r.jsx)(n.h3,{id:"from-operator",children:"From Operator"}),"\n",(0,r.jsxs)(n.p,{children:["You can also build promises from existing Operators. To do so, run the ",(0,r.jsx)(n.a,{href:"./reference/kratix-init-operator-promise",children:"kratix\ninit operator-promise"})," command."]}),"\n",(0,r.jsxs)(n.p,{children:["For example, consider the ",(0,r.jsx)(n.a,{href:"https://docs.percona.com/percona-operator-for-mysql/pxc/index.html",children:"Percona Operator for\nMySQL"}),". To transform\nit into a Promise, first download the Operator manifest bundle to your local machine:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell-session",children:"curl -L https://raw.githubusercontent.com/percona/percona-xtradb-cluster-operator/v1.14.0/deploy/bundle.yaml -o operator-bundle.yaml\n"})}),"\n",(0,r.jsxs)(n.p,{children:["Oftentimes, Operators include multiple CRDs. You will need to specify which CRD you want\nto build a Promise from. The Percona Operator comes with a ",(0,r.jsx)(n.code,{children:"perconaxtradbclusters.pxc.percona.com"})," CRD,\nwhich is used to deploy a MySQL cluster."]}),"\n",(0,r.jsxs)(n.admonition,{type:"tip",children:[(0,r.jsx)(n.p,{children:"To find the CustomResourceDefinition (CRD) included in the Operator manifest\nbundle, you can run:"}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell-session",children:'cat operator-bundle.yaml| grep "CustomResourceDefinition" -A 5 | grep name\n'})})]}),"\n",(0,r.jsx)(n.p,{children:"Then, run the following command:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell-session",children:"kratix init operator-promise mysql \\\n  --group mygroup.org \\\n  --kind Database \\\n  --version v1alpha1 \\\n  --operator-manifests operator-bundle.yaml \\\n  --api-schema-from perconaxtradbclusters.pxc.percona.com\n"})}),"\n",(0,r.jsx)(n.admonition,{type:"tip",children:(0,r.jsxs)(n.p,{children:["The ",(0,r.jsx)(n.code,{children:"--operator-manifests"})," flag can be a single file or a directory containing the Operator manifests."]})}),"\n",(0,r.jsxs)(n.p,{children:["By default, the CLI will create a ",(0,r.jsx)(n.code,{children:"promise.yaml"})," file and embed the Operator\nbundle in the ",(0,r.jsx)(n.code,{children:"dependencies"})," of the Promise, which will usually make the Promise\nvery large. Dependending on the size of the resulting Promise, you may get the\nfollowing error when trying to ",(0,r.jsx)(n.code,{children:"kubectl apply"})," it:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{children:'The Promise "mypromise" is invalid: metadata.annotations: Too long: must have at most 262144 bytes\n'})}),"\n",(0,r.jsx)(n.admonition,{title:"Create vs Apply",type:"note",children:(0,r.jsxs)(n.p,{children:["You can use the ",(0,r.jsx)(n.code,{children:"kubectl create"})," command to install your Promise, even if it's\ntoo large to be applied. To understand the difference between ",(0,r.jsx)(n.code,{children:"create"})," and\n",(0,r.jsx)(n.code,{children:"apply"}),", refer to the ",(0,r.jsx)(n.a,{href:"https://kubernetes.io/docs/tasks/manage-kubernetes-objects/",children:"Kubernetes\ndocumentation"}),"."]})}),"\n",(0,r.jsx)(n.p,{children:"To avoid this, you can move the Operator bundle to a Workflow by running:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell-session",children:"kratix update dependencies operator-bundle.yaml --image yourorg/your-image:tag\n"})}),"\n",(0,r.jsx)(n.h4,{id:"building-workflow-containers",children:"Building Workflow Containers"}),"\n",(0,r.jsxs)(n.p,{children:["To build a Workflow container generated with the ",(0,r.jsx)(n.code,{children:"add container"})," command, run the ",(0,r.jsx)(n.a,{href:"./reference/kratix-build-container",children:"kratix build container"})," command:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell-session",children:"kratix build container resource/configure/mypipeline\n"})}),"\n",(0,r.jsxs)(n.p,{children:["This command will build a container for the specified Workflow from the files in the ",(0,r.jsx)(n.code,{children:"workflows"})," directory."]}),"\n",(0,r.jsx)(n.admonition,{title:"Multiple Containers",type:"note",children:(0,r.jsxs)(n.p,{children:["If more than one container exists for the specified Workflow, specify the container with the ",(0,r.jsx)(n.code,{children:"--name"})," flag`"]})}),"\n",(0,r.jsx)(n.admonition,{type:"tip",children:(0,r.jsxs)(n.p,{children:["If you have added a number of containers, you can build all of them with the ",(0,r.jsx)(n.code,{children:"--all"})," flag"]})})]})}function h(e={}){const{wrapper:n}={...(0,o.a)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(c,{...e})}):c(e)}},1151:(e,n,i)=>{i.d(n,{Z:()=>a,a:()=>s});var r=i(7294);const o={},t=r.createContext(o);function s(e){const n=r.useContext(t);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:s(e.components),r.createElement(t.Provider,{value:n},e.children)}}}]);