"use strict";(self.webpackChunkkratix_docs=self.webpackChunkkratix_docs||[]).push([[9644],{5152:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>r,default:()=>d,frontMatter:()=>s,metadata:()=>o,toc:()=>c});var i=t(5893),a=t(1151);const s={title:"Terraform Enterprise",description:"Documentation for the Terraform Enterprise/Cloud integration",sidebar_label:"Terraform Enterprise"},r=void 0,o={id:"ske/integrations/tfe",title:"Terraform Enterprise",description:"Documentation for the Terraform Enterprise/Cloud integration",source:"@site/docs/ske/03-integrations/01-tfe.mdx",sourceDirName:"ske/03-integrations",slug:"/ske/integrations/tfe",permalink:"/ske/integrations/tfe",draft:!1,unlisted:!1,editUrl:"https://github.com/syntasso/kratix-docs/tree/main/docs/ske/03-integrations/01-tfe.mdx",tags:[],version:"current",sidebarPosition:1,frontMatter:{title:"Terraform Enterprise",description:"Documentation for the Terraform Enterprise/Cloud integration",sidebar_label:"Terraform Enterprise"},sidebar:"skeSidebar",previous:{title:"Introduction",permalink:"/ske/integrations/intro"}},l={},c=[{value:"Configuring the Destination",id:"configuring-the-destination",level:2},{value:"Writing a Promise",id:"writing-a-promise",level:2},{value:"Adding the SKE TF State Finder Aspect",id:"adding-the-ske-tf-state-finder-aspect",level:2},{value:"Pipeline Permissions",id:"pipeline-permissions",level:4},{value:"Writing Resource-specific outputs to the Resource Status",id:"writing-resource-specific-outputs-to-the-resource-status",level:3},{value:"Accessing outputs in the Pipeline",id:"accessing-outputs-in-the-pipeline",level:3}];function u(e){const n={a:"a",admonition:"admonition",code:"code",h2:"h2",h3:"h3",h4:"h4",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...(0,a.a)(),...e.components},{Details:t}=n;return t||function(e,n){throw new Error("Expected "+(n?"component":"object")+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}("Details",!0),(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.p,{children:"Kratix supports scheduling workloads via Promises to run on HCP Terraform (Terraform\nCloud) or Terraform Enterprise."}),"\n",(0,i.jsx)(n.p,{children:"This page provides information on how to:"}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsx)(n.li,{children:"Configure TFE as a Kratix Destination."}),"\n",(0,i.jsx)(n.li,{children:"Write a Promise that can schedule workloads to TFE."}),"\n",(0,i.jsx)(n.li,{children:"Use the SKE Aspect to pull information out of TFE."}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["This documentation assumes the existence of a Terraform Workspace that's configured to\napply Terraform configurations from a Git repository. Please refer to the ",(0,i.jsx)(n.a,{href:"https://developer.hashicorp.com/terraform/cloud-docs/workspaces/creating",children:"TFE\ndocumentation"}),"\nfor more information on how to create and configure the Workspace."]}),"\n",(0,i.jsx)(n.h2,{id:"configuring-the-destination",children:"Configuring the Destination"}),"\n",(0,i.jsx)(n.p,{children:"Once you have a a Workspace configured to listen to a Git repository, you can\nconfigure Kratix to be able to send workloads to it. To do this, you will first\nneed to create a GitStateStore pointing to the same Git repository you're using\nfor your TFE Workspace."}),"\n",(0,i.jsx)(n.p,{children:"Create the GitStateStore, replacing the placeholders with your own values:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:"apiVersion: platform.kratix.io/v1alpha1\nkind: GitStateStore\nmetadata:\n  name: workspace-repo\nspec:\n  authMethod: <AUTH METHOD>\n  branch: <BRANCH>\n  secretRef:\n    name: <SECRET NAME>\n    namespace: <NAMESPACE>\n  url: <MY WORKSPACE REPOSITORY>\n"})}),"\n",(0,i.jsxs)(n.p,{children:["Refer to the ",(0,i.jsx)(n.a,{href:"/main/reference/statestore/gitstatestore",children:"GitStateStore documentation"}),"\nfor more information on how to configure the GitStateStore."]}),"\n",(0,i.jsx)(n.p,{children:"Next, create a Secret with the credentials needed to access your TFE Workspace:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:"apiVersion: v1\nkind: Secret\nmetadata:\n  name: tf-credentials\n  namespace: default\nstringData:\n  organization: <TFE ORG NAME>\n  token: <TFE TOKEN>\n  workspace: <TFE WORKSPACE NAME>\n"})}),"\n",(0,i.jsxs)(n.p,{children:["To generate a token, refer to the ",(0,i.jsx)(n.a,{href:"https://www.terraform.io/docs/cloud/users-teams-organizations/api-tokens.html",children:"TFE\ndocumentation"}),"."]}),"\n",(0,i.jsx)(n.p,{children:"You can now create a Destination, tying everything together:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:'apiVersion: platform.kratix.io/v1alpha1\nkind: Destination\nmetadata:\n  name: tfe\n  annotations:\n    kratix.io/tf-credentials: \'{"namespace": "default", "name": "tf-credentials"}\'\n  labels:\n    environment: terraform\nspec:\n  filepath:\n    mode: none\n  stateStoreRef:\n    kind: GitStateStore\n    name: workspace-repo\n'})}),"\n",(0,i.jsxs)(t,{children:[(0,i.jsx)("summary",{children:"Destination in detail"}),(0,i.jsx)(n.p,{children:"There are a few important things to note about the Destination above."}),(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["The ",(0,i.jsx)(n.code,{children:"spec.stateStoreRef"})," is pointing to the GitStateStore you created earlier."]}),"\n",(0,i.jsxs)(n.li,{children:["The ",(0,i.jsx)(n.code,{children:"spec.filepath.mode"})," is set to ",(0,i.jsx)(n.code,{children:"none"}),". That's because TFE does not support\nnested directories, which is how Kratix writes to the State Store by default.\nIt also means your Promise needs to output unique files as part of the\nPipeline, otherwise multiple requests will overwrite the same file."]}),"\n",(0,i.jsxs)(n.li,{children:["The ",(0,i.jsx)(n.code,{children:"metadata.annotations.kratix.io/tf-credentials"})," is a JSON object that\ncontains the reference to the Secret you created earlier. This is used by the\nSKE Aspect to pull information out of TFE."]}),"\n",(0,i.jsxs)(n.li,{children:["The ",(0,i.jsx)(n.code,{children:"metadata.labels.environment"})," is set to ",(0,i.jsx)(n.code,{children:"terraform"}),". This is not required.\nYou will use that label later when writing your Promise."]}),"\n"]})]}),"\n",(0,i.jsx)(n.p,{children:"With all the resources created, you can now write a Promise that schedules workloads to TFE."}),"\n",(0,i.jsx)(n.h2,{id:"writing-a-promise",children:"Writing a Promise"}),"\n",(0,i.jsx)(n.p,{children:"TFE does not support nested directories in the State Store, so your promise\nneeds to ensure the uniqueness of the files it writes."}),"\n",(0,i.jsx)(n.p,{children:"Here's an example Promise that schedules a workload to TFE:"}),"\n",(0,i.jsxs)(t,{children:[(0,i.jsx)("summary",{children:"Example: Promise which schedules to TFE"}),(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:'apiVersion: platform.kratix.io/v1alpha1\nkind: Promise\nmetadata:\n  name: example-tf-promise\nspec:\n  destinationSelectors:\n    - matchLabels:\n        environment: terraform\n  api:\n    apiVersion: apiextensions.k8s.io/v1\n    kind: CustomResourceDefinition\n    metadata:\n      name: terraforms.tfe.ske.io\n    spec:\n      group: tfe.ske.io\n      names:\n        kind: Terraform\n        plural: terraforms\n        singular: terraform\n      scope: Namespaced\n      versions:\n        - name: v1alpha1\n          schema:\n            openAPIV3Schema:\n              type: object\n              properties:\n                spec:\n                  type: object\n                  x-kubernetes-preserve-unknown-fields: true\n          served: true\n          storage: true\n  workflows:\n    promise:\n      configure:\n        - apiVersion: platform.kratix.io/v1alpha1\n          kind: Pipeline\n          metadata:\n            name: promise\n            namespace: default\n          spec:\n            containers:\n              - image: ghcr.io/syntasso/kratix-pipeline-utility:v0.0.1\n                name: generate-output\n                command: [ "sh" ]\n                args:\n                  - -c\n                  - |\n                    cat <<EOF > /kratix/output/main.tf\n                    output "promise-configure" {\n                      value = "some-value"\n                    }\n                    EOF\n    resource:\n      configure:\n        - apiVersion: platform.kratix.io/v1alpha1\n          kind: Pipeline\n          metadata:\n            name: resource\n            namespace: default\n          spec:\n            containers:\n              - image: ghcr.io/syntasso/kratix-pipeline-utility:v0.0.1\n                name: generate-output\n                command: [ "sh" ]\n                args:\n                  - -c\n                  - |\n                    name=$(yq \'.metadata.name\' /kratix/input/object.yaml)\n                    name=$(yq \'.metadata.namespace\' /kratix/input/object.yaml)\n                    cat <<EOF > /kratix/output/${name}-${namespace}.tf\n                    output "${name}-${namespace}-resource-configure" {\n                      value = "some-value"\n                    }\n                    EOF\n'})})]}),"\n",(0,i.jsxs)(n.p,{children:["Let's break down the Promise above. It starts with the ",(0,i.jsx)(n.code,{children:"destinationSelectors"}),":"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:"spec:\n  destinationSelectors:\n    - matchLabels:\n        environment: terraform\n"})}),"\n",(0,i.jsxs)(n.p,{children:["This Promise will only run on Destinations that have the label ",(0,i.jsx)(n.code,{children:"environment: terraform"}),". This is the label we set on the Destination earlier. The value of\nthe label is not important, as long as it's the same on the Destination and the\nPromise. Please refer to ",(0,i.jsx)(n.a,{href:"/main/reference/multidestination-management",children:"Managing Multiple\nDestinations"})," for more information."]}),"\n",(0,i.jsxs)(n.p,{children:["Next, check the ",(0,i.jsx)(n.code,{children:"spec.promise.configure"})," workflow. You will find the following\nin the pipeline:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:'cat <<EOF > /kratix/output/main.tf\noutput "promise-configure" {\n  value = "some-value"\n}\nEOF\n'})}),"\n",(0,i.jsx)(n.p,{children:"Since the Promise workflow will run only once per Destination, the outputs it\ngenerates need only be unique within a single Destination. Your Terraform code will\nlikely to be more complex, but this is a simple example to get you started."}),"\n",(0,i.jsxs)(n.p,{children:["Finally, check the ",(0,i.jsx)(n.code,{children:"spec.resource.configure"})," workflow. You will find the\nfollowing:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"name=$(yq '.metadata.name' /kratix/input/object.yaml)\nname=$(yq '.metadata.namespace' /kratix/input/object.yaml)\ncat <<EOF > /kratix/output/${name}-${namespace}.tf\noutput \"${name}-${namespace}-resource-configure\" {\n  value = \"some-value\"\n}\nEOF\n"})}),"\n",(0,i.jsx)(n.p,{children:"Since the Promise workflow will run once per resource, the outputs it generates\nneed to be unique. The example above uses the resource's name and namespace to\ngenerate a unique filename and output name. You may need to adapt your code to follow the\nsame pattern."}),"\n",(0,i.jsx)(n.h2,{id:"adding-the-ske-tf-state-finder-aspect",children:"Adding the SKE TF State Finder Aspect"}),"\n",(0,i.jsx)(n.p,{children:"If you followed the steps above, you should now have a Promise that schedules\nworkloads to TFE. However, given that the Terraform code will be planned and\nexecuted by TFE, the users of your Platform won't have access to the Terraform\noutputs directly."}),"\n",(0,i.jsx)(n.p,{children:"To solve this, you can use the SKE TF State Finder Aspect. This Aspect will pull the\nTerraform outputs from TFE and make them available in the Resource's status."}),"\n",(0,i.jsxs)(n.p,{children:["To use the Aspect, you need to add it to your Promise as a second Pipeline in\nthe ",(0,i.jsx)(n.code,{children:"spec.resource.configure"})," workflow:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:'apiVersion: platform.kratix.io/v1alpha1\nkind: Promise\n# ...\nspec:\n  workflows:\n    resource:\n      configure:\n        - apiVersion: platform.kratix.io/v1alpha1\n          kind: Pipeline\n          # ... workflow that generates the Terraform configuration files\n\n        - apiVersion: platform.kratix.io/v1alpha1\n          kind: Pipeline\n          metadata:\n            name: output-writer\n            namespace: default\n          spec:\n            containers:\n              - image: ghcr.io/syntasso/ske-tfstate-finder:v0.1.0\n                name: fetch-output\n                env:\n                - name: TIMEOUT\n                  value: "30m"\n'})}),"\n",(0,i.jsxs)(n.p,{children:["The ",(0,i.jsx)(n.code,{children:"TIMEOUT"})," environment variable can be configured to match the amount of\ntime you expect the Terraform plan and apply to take. The Aspect will keep\ntrying to fetch the outputs until the timeout is reached."]}),"\n",(0,i.jsxs)(n.p,{children:["If ",(0,i.jsx)(n.code,{children:"TIMEOUT"})," is not set, the default timeout is 5 minutes."]}),"\n",(0,i.jsxs)(t,{children:[(0,i.jsx)("summary",{children:"Example: Promise with the SKE Aspect included"}),(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:'apiVersion: platform.kratix.io/v1alpha1\nkind: Promise\nmetadata:\n  name: example-tf-promise\nspec:\n  destinationSelectors:\n    - matchLabels:\n        environment: terraform\n  api:\n    apiVersion: apiextensions.k8s.io/v1\n    kind: CustomResourceDefinition\n    metadata:\n      name: terraforms.tfe.ske.io\n    spec:\n      group: tfe.ske.io\n      names:\n        kind: Terraform\n        plural: terraforms\n        singular: terraform\n      scope: Namespaced\n      versions:\n        - name: v1alpha1\n          schema:\n            openAPIV3Schema:\n              type: object\n              properties:\n                spec:\n                  type: object\n                  x-kubernetes-preserve-unknown-fields: true\n          served: true\n          storage: true\n  workflows:\n    promise:\n      configure:\n        - apiVersion: platform.kratix.io/v1alpha1\n          kind: Pipeline\n          metadata:\n            name: promise\n            namespace: default\n          spec:\n            containers:\n              - image: ghcr.io/syntasso/kratix-pipeline-utility:v0.0.1\n                name: generate-output\n                command: [ "sh" ]\n                args:\n                  - -c\n                  - |\n                    cat <<EOF > /kratix/output/main.tf\n                    output "promise-configure" {\n                      value = "some-value"\n                    }\n                    EOF\n    resource:\n      configure:\n        - apiVersion: platform.kratix.io/v1alpha1\n          kind: Pipeline\n          metadata:\n            name: resource\n            namespace: default\n          spec:\n            containers:\n              - image: ghcr.io/syntasso/kratix-pipeline-utility:v0.0.1\n                name: generate-output\n                command: [ "sh" ]\n                args:\n                  - -c\n                  - |\n                    name=$(yq \'.metadata.name\' /kratix/input/object.yaml)\n                    name=$(yq \'.metadata.namespace\' /kratix/input/object.yaml)\n                    cat <<EOF > /kratix/output/${name}-${namespace}.tf\n                    output "${name}-${namespace}-resource-configure" {\n                      value = "some-value"\n                    }\n                    EOF\n        - apiVersion: platform.kratix.io/v1alpha1\n          kind: Pipeline\n          metadata:\n            name: output-writer\n            namespace: default\n          spec:\n            containers:\n              - image: ghcr.io/syntasso/ske-tfstate-finder:v0.1.0\n                name: fetch-output\n                env:\n                - name: TIMEOUT\n                  value: "300s"\n'})})]}),"\n",(0,i.jsxs)(n.admonition,{type:"info",children:[(0,i.jsxs)(n.p,{children:["The ",(0,i.jsx)(n.code,{children:"ske-tfstate-finder"})," image is hosted in a private registry. To access the\nimage, you will need to use the access token provided by Syntasso and your\nKubernetes cluster must have the permissions to pull images from the registry."]}),(0,i.jsxs)(n.p,{children:["You can also set ",(0,i.jsx)(n.code,{children:"imagePullSecrets"})," in the ",(0,i.jsx)(n.a,{href:"/main/reference/workflows#pipelines",children:"Pipeline\nspec"}),"."]})]}),"\n",(0,i.jsx)(n.h4,{id:"pipeline-permissions",children:"Pipeline Permissions"}),"\n",(0,i.jsx)(n.p,{children:"The SKE TF State Finder requires permission to list Kratix Destinations and WorkPlacements,\nand get Secrets. These permissions are bound to the Service Accounts for the Promise\nPipeline and Resource Pipeline."}),"\n",(0,i.jsx)(n.p,{children:"To allow this, you should create the following RBAC resources:"}),"\n",(0,i.jsxs)(t,{children:[(0,i.jsx)("summary",{children:"RBAC for Kratix Pipelines"}),(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:'apiVersion: rbac.authorization.k8s.io/v1\nkind: ClusterRole\nmetadata:\n  name: ske-tfstate-finder\nrules:\n  - apiGroups:\n      - ""\n    resources:\n      - secrets\n    verbs:\n      - get\n  - apiGroups:\n      - platform.kratix.io\n    resources:\n      - workplacements\n      - destinations\n    verbs:\n      - list\n---\napiVersion: rbac.authorization.k8s.io/v1\nkind: ClusterRoleBinding\nmetadata:\n  name: ske-tfstate-finder-promise-pipeline\nroleRef:\n  apiGroup: rbac.authorization.k8s.io\n  kind: ClusterRole\n  name: ske-tfstate-finder\nsubjects:\n  - kind: ServiceAccount\n    name: example-tf-promise-promise-pipeline # <promise-name>-promise-pipeline\n    namespace: kratix-platform-system\n---\napiVersion: rbac.authorization.k8s.io/v1\nkind: ClusterRoleBinding\nmetadata:\n  name: ske-tfstate-finder-resource-pipeline\n  namespace: default\nroleRef:\n  apiGroup: rbac.authorization.k8s.io\n  kind: ClusterRole\n  name: ske-tfstate-finder\nsubjects:\n  - kind: ServiceAccount\n    name: example-tf-promise-resource-pipeline # <promise-name>-resource-pipeline\n    namespace: default\n'})})]}),"\n",(0,i.jsx)(n.h3,{id:"writing-resource-specific-outputs-to-the-resource-status",children:"Writing Resource-specific outputs to the Resource Status"}),"\n",(0,i.jsxs)(n.p,{children:["By default, the Aspect will add the Terraform outputs from any ",(0,i.jsx)(n.code,{children:".tf"})," files in the\nResource's scheduled workloads to the Resource's ",(0,i.jsx)(n.code,{children:"status.outputs"}),". For example, in the\n",(0,i.jsx)(n.code,{children:"spec.resource.configure"})," workflow above, and assuming the name ",(0,i.jsx)(n.code,{children:"my-resource"})," in the\ndefault namespace, the following would be added to the Resource status:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:'outputs:\n  tfe: # Destination name\n    my-resource-default-resource-configure: "some-value" # TFE output name/value\n'})}),"\n",(0,i.jsxs)(n.p,{children:["If you want to customise what gets persisted to the status, you can skip this step by\nsetting the ",(0,i.jsx)(n.code,{children:"SKIP_STATUS"})," environment variable in the Aspect's container to ",(0,i.jsx)(n.code,{children:'"true"'}),".\nIn this case, the ",(0,i.jsx)(n.code,{children:"*-output.yaml"})," files in ",(0,i.jsx)(n.code,{children:"/kratix/metadata"})," will still be written, so\nthat you can access the outputs in the Pipeline."]}),"\n",(0,i.jsx)(n.h3,{id:"accessing-outputs-in-the-pipeline",children:"Accessing outputs in the Pipeline"}),"\n",(0,i.jsxs)(n.p,{children:["The Aspect will also write a set of ",(0,i.jsx)(n.code,{children:"*-output.yaml"})," files to\n",(0,i.jsx)(n.code,{children:"/kratix/metadata"})," containing all of the Terraform workspace outputs present at the time\nthe Resource or Promise workloads were written to the State Store."]}),"\n",(0,i.jsxs)(n.p,{children:["To ensure uniqueness, the naming convention for the output files is\n",(0,i.jsx)(n.code,{children:"<destinationName>-<commitSha>-output.yaml"}),", where ",(0,i.jsx)(n.code,{children:"destinationName"})," is the name of the\nTerraform Destination from which the outputs were read, and ",(0,i.jsx)(n.code,{children:"commitSha"})," is the SHA of the\ncommit in which the workloads were written to the State Store."]}),"\n",(0,i.jsxs)(n.p,{children:["In the most common case, the ",(0,i.jsx)(n.code,{children:".tf"})," files are scheduled to a single Terraform Destination\nin a single previous Pipeline (as in the example above). When this is the case, you can\nfind the output file within the Pipeline as follows:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"file=$(find /kratix/metadata -type f -name '*-output.yaml' | head -n 1)\n"})}),"\n",(0,i.jsx)(n.p,{children:"If there were multiple files, you could narrow your search by Destination name:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"file=$(find /kratix/metadata -type f -name '<destinationName>*-output.yaml' | head -n 1)\n"})}),"\n",(0,i.jsx)(n.p,{children:"The output files will look similar to the following:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:"- id: wsout-usr3cvFTLCepr4CL\n  name: promise-configure\n  sensitive: false\n  type: string\n  value: some-value\n  detailedtype: string\n- id: wsout-YbSiFpvauuVTeQbV\n  name: resource-configure\n  sensitive: false\n  type: string\n  value: some-value\n  detailedtype: string\n- id: wsout-AIGhavgdsiHVnaHP\n  name: other-output\n  sensitive: false\n  type: string\n  value: some-value\n  detailedtype: string\n"})}),"\n",(0,i.jsxs)(t,{children:[(0,i.jsx)("summary",{children:"Example: Accessing an output and writing it to a custom Resource status field"}),(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:'apiVersion: platform.kratix.io/v1alpha1\nkind: Promise\n# ...\nspec:\n  workflows:\n    resource:\n      configure:\n        - apiVersion: platform.kratix.io/v1alpha1\n          kind: Pipeline\n          # ... workflow that generates the Terraform configuration files\n\n        - apiVersion: platform.kratix.io/v1alpha1\n          kind: Pipeline\n          metadata:\n            name: output-writer\n            namespace: default\n          spec:\n            containers:\n              - image: ghcr.io/syntasso/ske-tfstate-finder:v0.1.0\n                name: fetch-output\n# highlight-start\n              - image: ghcr.io/syntasso/kratix-pipeline-utility:v0.0.1\n                name: custom-status\n                command: [ "sh" ]\n                args:\n                  - -c\n                  - |\n                    file=$(find /kratix/metadata -type f -name \'*-output.yaml\' | head -n 1)\n                    value=$(yq e \'.[] | select(.name == "promise-configure") | .value\' "${file}")\n                    echo "customStatusField: ${value}" >> /kratix/metadata/status.yaml\n# highlight-end\n'})}),(0,i.jsxs)(n.p,{children:["This example uses the ",(0,i.jsx)(n.code,{children:"kratix-pipeline-utility"})," image, which comes with ",(0,i.jsx)(n.code,{children:"yq"})," pre-installed.\nIt also assumes a single output file for simplicity."]})]})]})}function d(e={}){const{wrapper:n}={...(0,a.a)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(u,{...e})}):u(e)}},1151:(e,n,t)=>{t.d(n,{Z:()=>o,a:()=>r});var i=t(7294);const a={},s=i.createContext(a);function r(e){const n=i.useContext(s);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:r(e.components),i.createElement(s.Provider,{value:n},e.children)}}}]);