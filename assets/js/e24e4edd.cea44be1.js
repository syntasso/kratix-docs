"use strict";(self.webpackChunkkratix_docs=self.webpackChunkkratix_docs||[]).push([[8772],{8642:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>d,contentTitle:()=>p,default:()=>x,frontMatter:()=>l,metadata:()=>h,toc:()=>u});var r=t(5893),s=t(1151),i=t(9286);const a='terraform {\n  required_providers {\n    minio = {\n      source = "aminueza/minio"\n      version = "2.0.1"\n    }\n  }\n}\n\nvariable bucket_name {\n  type = string\n}\n\nresource "minio_s3_bucket" "state_terraform_s3" {\n    bucket = "${var.bucket_name}"\n    acl    = "public"\n}\n\noutput "minio_id" {\n    value = "${minio_s3_bucket.state_terraform_s3.id}"\n}\n\noutput "minio_url" {\n    value = "${minio_s3_bucket.state_terraform_s3.bucket_domain_name}"\n}\n',o="#!/usr/bin/env sh\n\nset -euxo pipefail\n\nname=$(yq '.metadata.name' /kratix/input/object.yaml)\nnamespace=$(yq '.metadata.namespace' /kratix/input/object.yaml)\n\ncd resources\nterraform init\nterraform apply -auto-approve --var=\"bucket_name=${name}.${namespace}\"\n",c="#!/usr/bin/env sh\n\nset -euxo pipefail\n\nname=$(yq '.metadata.name' /kratix/input/object.yaml)\nnamespace=$(yq '.metadata.namespace' /kratix/input/object.yaml)\n\ncd resources\nterraform init\n\n# Check if the state exists and retrieve it if so\nif kubectl get configmap ${name}-state; then\n    kubectl get configmap ${name}-state \\\n        --output=jsonpath='{.data.tfstate}' \\\n        > state.tfstate\nfi\n\nterraform apply \\\n    -auto-approve \\\n    --var=\"bucket_name=${name}.${namespace}\" \\\n    -state=state.tfstate\n\n# Store the state in a ConfigMap\nkubectl create configmap ${name}-state \\\n    --from-file=tfstate=state.tfstate \\\n    --dry-run=client \\\n    --output=yaml > configmap.yaml\nkubectl replace --filename configmap.yaml --force\n",l={id:"secrets-and-state",title:"Accessing Secrets and storing state",description:"Learn how you can access Secrets and store state from within a Kratix pipeline"},p=void 0,h={id:"workshop/part-ii/secrets-and-state",title:"Accessing Secrets and storing state",description:"Learn how you can access Secrets and store state from within a Kratix pipeline",source:"@site/docs/workshop/part-ii/03-secrets-and-state.mdx",sourceDirName:"workshop/part-ii",slug:"/workshop/part-ii/secrets-and-state",permalink:"/workshop/part-ii/secrets-and-state",draft:!1,unlisted:!1,editUrl:"https://github.com/syntasso/kratix-docs/tree/main/docs/workshop/part-ii/03-secrets-and-state.mdx",tags:[],version:"current",sidebarPosition:3,frontMatter:{id:"secrets-and-state",title:"Accessing Secrets and storing state",description:"Learn how you can access Secrets and store state from within a Kratix pipeline"},sidebar:"workshopSidebar",previous:{title:"Improving the Workflows",permalink:"/workshop/part-ii/promise-workflows"},next:{title:"Surfacing information via Status",permalink:"/workshop/part-ii/status"}},d={},u=[{value:"Secrets",id:"secrets",level:2},{value:"State",id:"state",level:2},{value:"Bonus Challenge",id:"bonus-challenge",level:2},{value:"\ud83c\udf89 \xa0 Congratulations!",id:"--congratulations",level:2}];function m(e){const n={a:"a",admonition:"admonition",code:"code",h2:"h2",hr:"hr",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...(0,s.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(n.p,{children:["This is Part 3 of ",(0,r.jsx)(n.a,{href:"intro",children:"a series"})," illustrating how to write Kratix Promises."]}),"\n",(0,r.jsxs)(n.p,{children:["\ud83d\udc48\ud83c\udffe Previous: ",(0,r.jsx)(n.a,{href:"./promise-workflows",children:"Improving Promise Workflows"})," ",(0,r.jsx)("br",{}),"\n\ud83d\udc49\ud83c\udffe Next: ",(0,r.jsx)(n.a,{href:"./status",children:"Surfacing information to users"})]}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.p,{children:"In the previous tutorial, you learned about the different lifecycle hooks you can define in your Promise workflows. In this section, you will go over some basic use-cases, like accessing Secrets, from within your Promise workflows."}),"\n",(0,r.jsx)(n.p,{children:"You will:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.a,{href:"#secrets",children:"Learn how to access secrets in your Pipeline"})}),"\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.a,{href:"#state",children:"Learn how to store and reuse state between runs"})}),"\n"]}),"\n",(0,r.jsxs)(n.p,{children:["To illustrate the concepts above, you will be updating your Promise so that it creates a bucket in the MinIO server that's deployed in your Platform cluster. You will create the bucket using ",(0,r.jsx)(n.code,{children:"terraform"}),"."]}),"\n",(0,r.jsx)(n.h2,{id:"secrets",children:"Secrets"}),"\n",(0,r.jsx)(n.p,{children:"A common need for Workflows is to access secrets. In your Promise, you will need access to the MinIO credentials to be able to create a bucket. You could pull the credentials in differnet ways, but the Kratix Pipeline kind provides a convenient way to access secrets, similar to how you would access Secrets in a Kubernetes Pod."}),"\n",(0,r.jsxs)(n.p,{children:["To start, create a new ",(0,r.jsx)(n.code,{children:"Secret"})," in your Platform cluster:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:"cat <<EOF | kubectl --context $PLATFORM apply -f -\napiVersion: v1\nkind: Secret\nmetadata:\n  name: app-promise-minio-creds\n  namespace: default\ntype: Opaque\nstringData:\n  username: minioadmin\n  password: minioadmin\n  endpoint: minio.kratix-platform-system.svc.cluster.local\nEOF\n"})}),"\n",(0,r.jsxs)(n.p,{children:["Next update your Promise with the new ",(0,r.jsx)(n.code,{children:"create-bucket"})," step. From within this step, you will load the secret defined above as an environment variable:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",metastring:'title="app-promise/promise.yaml"',children:"apiVersion: platform.kratix.io/v1alpha1\nkind: Promise\nmetadata:\n  name: app\nspec:\n  api: #...\n  workflows:\n    promise: # ...\n    resource:\n      configure:\n        - apiVersion: platform.kratix.io/v1alpha1\n          kind: Pipeline\n          metadata:\n            name: resource-configure\n          spec:\n            containers:\n              - command:\n                - resource-configure\n                image: kratix-workshop/app-pipeline-image:v1.0.0\n                name: kratix-workshop-app-pipeline-image\n                #highlight-start\n              - name: create-bucket\n                image: kratix-workshop/app-pipeline-image:v1.0.0\n                command: [ create-bucket ]\n                env:\n                  - name: MINIO_ENDPOINT\n                    valueFrom:\n                      secretKeyRef:\n                        name: app-promise-minio-creds\n                        key: endpoint\n                  - name: MINIO_USER\n                    valueFrom:\n                      secretKeyRef:\n                        name: app-promise-minio-creds\n                        key: username\n                  - name: MINIO_PASSWORD\n                    valueFrom:\n                      secretKeyRef:\n                        name: app-promise-minio-creds\n                        key: password\n                #highlight-end\n"})}),"\n",(0,r.jsxs)(n.p,{children:["You can now add the ",(0,r.jsx)(n.code,{children:"create-bucket"})," script to your Resource Worfklow Pipeline image. Create a ",(0,r.jsx)(n.code,{children:"create-bucket"})," script in the ",(0,r.jsx)(n.code,{children:"workflows/resource/configure/mypipeline/kratix-workshop-app-pipeline-image/scripts/"})," directory:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"touch ./workflows/resource/configure/mypipeline/kratix-workshop-app-pipeline-image/scripts/create-bucket\ntouch ./workflows/resource/configure/mypipeline/kratix-workshop-app-pipeline-image/resources/terraform.tf\n"})}),"\n",(0,r.jsxs)(n.p,{children:["Next, create the terraform script that will be executed by the ",(0,r.jsx)(n.code,{children:"create-bucket"})," script:"]}),"\n","\n",(0,r.jsx)(i.Z,{language:"terraform",title:"app-promise/workflows/resource/configure/mypipeline/kratix-workshop-app-pipeline-image/resources/terraform.tf",children:a}),"\n",(0,r.jsxs)(n.p,{children:["Update your ",(0,r.jsx)(n.code,{children:"Dockerfile"})," to include the Terraform CLI:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-diff",metastring:'title="app-promise/workflows/resource/configure/mypipeline/kratix-workshop-app-pipeline-image/Dockerfile"',children:"- RUN apk update && apk add --no-cache yq kubectl\n+ RUN apk update && apk add --no-cache yq kubectl curl\n+ RUN curl https://releases.hashicorp.com/terraform/1.7.1/terraform_1.7.1_linux_amd64.zip -o terraform.zip && \\\n+    unzip terraform.zip && \\\n+    mv terraform /usr/local/bin/terraform && \\\n+    rm terraform.zip\n"})}),"\n",(0,r.jsxs)(n.p,{children:["Finally, create the ",(0,r.jsx)(n.code,{children:"create-bucket"})," script:"]}),"\n","\n",(0,r.jsx)(i.Z,{language:"bash",title:"app-promise/workflows/resource/configure/mypipeline/kratix-workshop-app-pipeline-image/scripts/create-bucket",children:o}),"\n",(0,r.jsxs)(n.p,{children:["With all of that in place, you can test the Workflow. You will need to expose the environment variables defined in the ",(0,r.jsx)(n.code,{children:"create-bucket"})," step before running the test script. Open the ",(0,r.jsx)(n.code,{children:"scripts/test-pipeline"})," script and update the ",(0,r.jsx)(n.code,{children:"docker run"})," command to look like this:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",metastring:'title="scripts/test-pipeline"',children:'docker run \\\n    --rm \\\n    --volume ~/.kube:/root/.kube \\\n    --network=host \\\n    --volume ${outputDir}:/kratix/output \\\n    --volume ${inputDir}:/kratix/input \\\n    --volume ${metadataDir}:/kratix/metadata \\\n#highlight-start\n    --env MINIO_USER=minioadmin \\\n    --env MINIO_PASSWORD=minioadmin \\\n    --env MINIO_ENDPOINT=localhost:31337 \\\n#highlight-end\n    kratix-workshop/app-pipeline-image:v1.0.0 bash -c "$command"\n'})}),"\n",(0,r.jsx)(n.admonition,{type:"warning",children:(0,r.jsxs)(n.p,{children:["If you are running the workshop on a Mac, you may need to update the ",(0,r.jsx)(n.code,{children:"MINIO_ENDPOINT"})," to ",(0,r.jsx)(n.code,{children:"host.docker.internal:31337"}),"."]})}),"\n",(0,r.jsx)(n.p,{children:"You need to ensure kubectl is pointing to the platform cluster before running the test script:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"kubectl config set current-context $PLATFORM\n"})}),"\n",(0,r.jsx)(n.p,{children:"With that change in place, you can run the test script:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"./scripts/test-pipeline create-bucket\n"})}),"\n",(0,r.jsx)(n.p,{children:"If everything works well, you should see a new bucket created in your MinIO server:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"mc ls kind/\n"})}),"\n",(0,r.jsx)(n.p,{children:"The output should look like this:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell-session",children:"[2024-01-26 15:33:03 GMT]     0B kratix/\n[2024-01-31 11:44:55 GMT]     0B my-app.default/\n"})}),"\n",(0,r.jsx)(n.p,{children:"Great! That proves our pipeline stage works end-to-end. But what happens if you try to re-run the tests?"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"./scripts/test-pipeline create-bucket\n"})}),"\n",(0,r.jsx)(n.p,{children:"You should see the following error:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell-session",children:'minio_s3_bucket.state_terraform_s3: Creating...\n\u2577\n\u2502 Error: [FATAL] bucket already exists! (my-app.default): <nil>\n\u2502\n\u2502   with minio_s3_bucket.state_terraform_s3,\n\u2502   on terraform.tf line 14, in resource "minio_s3_bucket" "state_terraform_s3":\n\u2502   14: resource "minio_s3_bucket" "state_terraform_s3" {\n'})}),"\n",(0,r.jsxs)(n.p,{children:["The ",(0,r.jsx)(n.code,{children:"create-bucket"})," step is not idempotent. That means that, when Kratix tries to reconcile the resource again, it will fail because the bucket already exists."]}),"\n",(0,r.jsx)(n.p,{children:"To make it idempotent, you need to store and retrieve the terraform state from the previous run, and use it if it already exists. Hop on to the next section to learn how to do that."}),"\n",(0,r.jsx)(n.h2,{id:"state",children:"State"}),"\n",(0,r.jsx)(n.p,{children:"There are many ways to store and retrieve state from within a pipeline. You could, for example, push the resulting state to a remote repository, rely on third-party services like Terraform Cloud, or use Kubernetes resources like ConfigMaps. For simplicity, we will use ConfigMaps to store and retrieve the state."}),"\n",(0,r.jsxs)(n.p,{children:["To store the terraform state in a ConfigMap, the first step is to give the Kratix Pipeline Service Account the ability to create and retrieve ConfigMaps. There are a few ways\nthat you can ensure the Kratix Pipeline Service Account has the appropriate permissions to access resources, on this occasion we are going to specify the additional permissions required by the Workflow via the ",(0,r.jsx)(n.code,{children:"spec.rbac.permissions"})," in the Pipeline specification."]}),"\n",(0,r.jsxs)(n.p,{children:["In your ",(0,r.jsx)(n.code,{children:"promise.yaml"}),", find the Workflow for the ",(0,r.jsx)(n.code,{children:"resource.configure"})," Pipeline. Edit the Workflow's Pipeline ",(0,r.jsx)(n.code,{children:"spec"})," to have the following:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{children:'  rbac:\n    permissions:\n      - apiGroups: [""]\n        verbs: ["*"]\n        resources: ["configmaps"]\n'})}),"\n",(0,r.jsxs)(n.p,{children:["This updates the permissions of the Kratix Pipeline Service Account to allow it to create and retrieve ConfigMaps. You can read more about how to configure RBAC permission in Pipelines in the ",(0,r.jsx)(n.a,{href:"/main/reference/workflows#rbac",children:"Kratix reference documentation"}),"."]}),"\n",(0,r.jsxs)(n.p,{children:["Next, you need to update the ",(0,r.jsx)(n.code,{children:"create-bucket"})," script to both store the state and retrieve any existing state. Open the ",(0,r.jsx)(n.code,{children:"create-bucket"})," script and update it to look like this:"]}),"\n","\n",(0,r.jsx)(i.Z,{language:"bash",title:"app-promise/workflows/resource/configure/mypipeline/kratix-workshop-app-pipeline-image/scripts/create-bucket",children:c}),"\n",(0,r.jsxs)(n.p,{children:["Before re-running the test, make sure to delete the previous buckets, since the ",(0,r.jsx)(n.code,{children:"create-bucket"})," script will try to create a bucket with the same name:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"mc rb kind/my-app.default\n"})}),"\n",(0,r.jsx)(n.p,{children:"Now you can run the test script again:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"./scripts/test-pipeline create-bucket\n"})}),"\n",(0,r.jsx)(n.p,{children:"You should see from the logs that the bucket got created and that the state got persisted in a ConfigMap. You can validate with the following command:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"mc ls kind/\n"})}),"\n",(0,r.jsx)(n.p,{children:"The above command should show you the buckets, like last time:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell-session",children:"[2024-01-26 15:33:03 GMT]     0B kratix/\n[2024-01-31 11:44:55 GMT]     0B my-app.default/\n"})}),"\n",(0,r.jsx)(n.p,{children:"As for the ConfigMap, you can retrieve it with the following command:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"kubectl --context $PLATFORM get configmap my-app-state --output=jsonpath={.data.tfstate}\n"})}),"\n",(0,r.jsx)(n.p,{children:"The output should look like this:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-json",children:'{\n    "version": "4",\n    ...\n}\n'})}),"\n",(0,r.jsx)(n.p,{children:"Excellent. Now try re-running the test script:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"./scripts/test-pipeline create-bucket\n"})}),"\n",(0,r.jsx)(n.p,{children:"This time it should just work! You can see from the logs (snippet below) that the state got retrieved from the ConfigMap and that no changes were applied. The test log should include the following lines:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell-session",children:"minio_s3_bucket.state_terraform_s3: Refreshing state... [id=my-app.default]\n\nNo changes. Your infrastructure matches the configuration.\n\nTerraform has compared your real infrastructure against your configuration\nand found no differences, so no changes are needed.\n\nApply complete! Resources: 0 added, 0 changed, 0 destroyed.\n"})}),"\n",(0,r.jsx)(n.p,{children:"Awesome! You pipeline stage is now idempotent, so go ahead and apply the promise with the new stage into your Platform:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"kubectl --context $PLATFORM apply --filename promise.yaml\n"})}),"\n",(0,r.jsx)(n.p,{children:"As soon as the Promise is applied, Kratix will trigger an update for the existing application. Once the pipeline completes, you should see a new Bucket on your MinIO server:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"mc ls kind/\n"})}),"\n",(0,r.jsx)(n.p,{children:"The output should look like this:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell-session",children:"[2024-01-26 15:33:03 GMT]     0B kratix/\n[2024-01-31 11:44:55 GMT]     0B my-app.default/\n[2024-01-31 11:44:55 GMT]     0B todo.default/\n"})}),"\n",(0,r.jsx)(n.p,{children:"You should also see the ConfigMap for the todo app:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"kubectl --context $PLATFORM get configmap todo-state --output=jsonpath={.data.tfstate}\n"})}),"\n",(0,r.jsx)(n.p,{children:"The output should look like this:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-json",children:'{\n    "version": "4",\n    ...\n}\n'})}),"\n",(0,r.jsxs)(n.p,{children:["To validate the idempotency, you can force the resource to reconcile by setting the ",(0,r.jsx)(n.code,{children:"kratix.io/manual-reconciliation"})," label to true. Kratix listens to that label and, when it detects it, forces a reconciliation for the resource. Trigger a reconciliation:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"# trigger the reconciliation\nkubectl --context $PLATFORM label apps.workshop.kratix.io todo kratix.io/manual-reconciliation=true\n"})}),"\n",(0,r.jsx)(n.p,{children:"Once the pipeline completes, you can check the logs and verify how it reused the state from the ConfigMap:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:'pod_name=$(kubectl --context $PLATFORM get pods --sort-by=.metadata.creationTimestamp -o jsonpath="{.items[-1:].metadata.name}")\nkubectl --context $PLATFORM logs $pod_name --container create-bucket\n'})}),"\n",(0,r.jsx)(n.p,{children:"If you trigger the reconciliation again, you should see the Pipeline logs indicating that no changes were applied, just as you observed in the test."}),"\n",(0,r.jsx)(n.h2,{id:"bonus-challenge",children:"Bonus Challenge"}),"\n",(0,r.jsxs)(n.p,{children:["You may have noticed that, at this stage, the bucket the Pipeline is created won't be removed when the user deletes their App request. As an extra challenge, try to implement a delete lifecycle hook for your resource, that deletes the bucket. Take a look at the ",(0,r.jsx)(n.a,{href:"/main/reference/workflows",children:"Workflow reference docs"})," to find out more (tip: check the ",(0,r.jsx)(n.code,{children:"workflows.resource.delete"})," property)."]}),"\n",(0,r.jsx)(n.h2,{id:"--congratulations",children:"\ud83c\udf89 \xa0 Congratulations!"}),"\n",(0,r.jsxs)(n.p,{children:["You successfully implemented a stateful Pipeline stage, using ",(0,r.jsx)(n.code,{children:"terraform"})," to create external resources."]}),"\n",(0,r.jsx)(n.p,{children:"To recap what you achieved:"}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsx)(n.li,{children:"\u2705\xa0\xa0Learned how to access Kubernetes secrets from a Pipeline."}),"\n",(0,r.jsx)(n.li,{children:"\u2705\xa0\xa0Implemented a pipeline stage to create a bucket with Terraform."}),"\n",(0,r.jsx)(n.li,{children:"\u2705\xa0\xa0Made your new state idempotent by storing and retrieving  state."}),"\n"]}),"\n",(0,r.jsxs)(n.p,{children:["\ud83d\udc49\ud83c\udffe\xa0\xa0 Next, let's ",(0,r.jsx)(n.a,{href:"./status",children:"explore how to surface information to users"}),"."]})]})}function x(e={}){const{wrapper:n}={...(0,s.a)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(m,{...e})}):m(e)}}}]);