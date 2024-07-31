"use strict";(self.webpackChunkkratix_docs=self.webpackChunkkratix_docs||[]).push([[5530],{6899:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>o,default:()=>h,frontMatter:()=>s,metadata:()=>r,toc:()=>l});var a=n(5893),i=n(1151);const s={title:"Configuring Backstage",description:"Documentation for how to configure Backstage",sidebar_label:"Configuring Backstage",slug:"configuring-backstage"},o=void 0,r={id:"ske/integrations/backstage/backstage",title:"Configuring Backstage",description:"Documentation for how to configure Backstage",source:"@site/docs/ske/10-integrations/10-backstage/01-backstage.mdx",sourceDirName:"ske/10-integrations/10-backstage",slug:"/ske/integrations/backstage/configuring-backstage",permalink:"/ske/integrations/backstage/configuring-backstage",draft:!1,unlisted:!1,editUrl:"https://github.com/syntasso/kratix-docs/tree/main/docs/ske/10-integrations/10-backstage/01-backstage.mdx",tags:[],version:"current",sidebarPosition:1,frontMatter:{title:"Configuring Backstage",description:"Documentation for how to configure Backstage",sidebar_label:"Configuring Backstage",slug:"configuring-backstage"},sidebar:"skeSidebar",previous:{title:"Introduction",permalink:"/ske/integrations/backstage/intro"},next:{title:"Configuring the Plugins",permalink:"/ske/integrations/backstage/plugins"}},c={},l=[{value:"Creating a new Backstage app",id:"creating-a-new-backstage-app",level:2},{value:"Catalog Discovery",id:"catalog-discovery",level:2},{value:"Configure the Integration",id:"configure-the-integration",level:3},{value:"Configure the Discovery",id:"configure-the-discovery",level:3},{value:"Configuring Kratix",id:"configuring-kratix",level:2},{value:"Configure the State Store",id:"configure-the-state-store",level:3},{value:"Configure a Destination for Backstage",id:"configure-a-destination-for-backstage",level:3},{value:"Next",id:"next",level:2}];function d(e){const t={a:"a",admonition:"admonition",code:"code",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",ul:"ul",...(0,i.a)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(t.p,{children:"To integrate Kratix with Backstage, you need to configure both Backstage and Kratix so\nthat they can communicate with each other."}),"\n",(0,a.jsx)(t.p,{children:"This document covers the steps to configure Backstage to be able to read its catalog from\nan S3-compatible Bucket or Git repository."}),"\n",(0,a.jsx)(t.p,{children:"This document will cover:"}),"\n",(0,a.jsxs)(t.ul,{children:["\n",(0,a.jsx)(t.li,{children:"Creating a new Backstage app"}),"\n",(0,a.jsx)(t.li,{children:"Configuring catalog discovery from a state store"}),"\n"]}),"\n",(0,a.jsx)(t.h2,{id:"creating-a-new-backstage-app",children:"Creating a new Backstage app"}),"\n",(0,a.jsx)(t.admonition,{type:"info",children:(0,a.jsx)(t.p,{children:"If you already have a Backstage app, you can skip this step."})}),"\n",(0,a.jsxs)(t.p,{children:["Following ",(0,a.jsx)(t.a,{href:"https://backstage.io/docs/getting-started/",children:"Backstage's official documentation"}),", you can bootstrap a new Backstage app by running the following command:"]}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-bash",children:"npx @backstage/create-app@latest\n"})}),"\n",(0,a.jsx)(t.p,{children:"Once the command completes, you should have a new directory with a Backstage app. You can navigate to the directory and start the app by running:"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-bash",children:"cd backstage\nyarn dev\n"})}),"\n",(0,a.jsxs)(t.p,{children:["At this point, you should see the Backstage app running at ",(0,a.jsx)(t.a,{href:"http://localhost:3000",children:"http://localhost:3000"})," with some example data."]}),"\n",(0,a.jsxs)(t.p,{children:["For further information or for troubleshooting, please refer to the ",(0,a.jsx)(t.a,{href:"https://backstage.io/docs/getting-started/",children:"official documentation"}),"."]}),"\n",(0,a.jsx)(t.h2,{id:"catalog-discovery",children:"Catalog Discovery"}),"\n",(0,a.jsxs)(t.p,{children:["For Backstage to get its ",(0,a.jsx)(t.a,{href:"https://backstage.io/docs/features/software-catalog/",children:"catalog"})," automatically populated from Kratix Promises, you need to configure your instance to read its catalog from the same state store that Kratix will be later configured to write to."]}),"\n",(0,a.jsxs)(t.p,{children:["You can follow the ",(0,a.jsx)(t.a,{href:"https://backstage.io/docs/integrations/",children:"official Backstage documentation"})," for details on how to configure the integration according to your state store:"]}),"\n",(0,a.jsxs)(t.ul,{children:["\n",(0,a.jsxs)(t.li,{children:["For S3-Compatible buckets, check ",(0,a.jsx)(t.a,{href:"https://backstage.io/docs/integrations/aws-s3/locations",children:"this page"}),"."]}),"\n",(0,a.jsxs)(t.li,{children:["For Git repositories, the configuration depends on the specific provider. For GitHub integration, for example, check ",(0,a.jsx)(t.a,{href:"https://backstage.io/docs/integrations/github/locations",children:"this page"}),"."]}),"\n"]}),"\n",(0,a.jsxs)(t.p,{children:["The following steps will guide you through the process of configuring Backstage to read its catalog from a S3-compatible bucket, and will assume you have deployed Kratix following the ",(0,a.jsx)(t.a,{href:"/main/quick-start",children:"quick start guide"}),"."]}),"\n",(0,a.jsx)(t.h3,{id:"configure-the-integration",children:"Configure the Integration"}),"\n",(0,a.jsx)(t.p,{children:"Following the Quick Start guide, you should have a Kratix instance running alongside with a MinIO instance. You can validate the setup by running the following command:"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-bash",children:"kubectl get pods -n kratix-platform-system\n"})}),"\n",(0,a.jsx)(t.p,{children:"You should see the following pods running:"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-shell-session",children:"NAME                                                  READY   STATUS    RESTARTS   AGE\nkratix-platform-controller-manager-6599cb4456-gc9zz   2/2     Running   0          109s\nminio-587dd4c7c4-f294z                                1/1     Running   0          108s\n"})}),"\n",(0,a.jsx)(t.p,{children:"You will configure your Backstage to fetch the catalog from the MinIO instance."}),"\n",(0,a.jsxs)(t.p,{children:["Following the ",(0,a.jsx)(t.a,{href:"https://backstage.io/docs/integrations/aws-s3/locations",children:"AWS S3 Locations"})," documentation, open the ",(0,a.jsx)(t.code,{children:"app-config.yaml"})," file and, under the ",(0,a.jsx)(t.code,{children:"integrations"})," key, add the ",(0,a.jsx)(t.code,{children:"awsS3"})," configuration as follows:"]}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-yaml",children:'integrations:\n  awsS3:\n    - endpoint: "http://MINIO_ADDRESS"\n      s3ForcePathStyle: true\n      accessKeyId: ${AWS_ACCESS_KEY_ID}\n      secretAccessKey: ${AWS_SECRET_ACCESS_KEY}\n'})}),"\n",(0,a.jsxs)(t.p,{children:["Before starting your Backstage, make sure to set the ",(0,a.jsx)(t.code,{children:"AWS_ACCESS_KEY_ID"})," and ",(0,a.jsx)(t.code,{children:"AWS_SECRET_ACCESS_KEY"})," environment variables to ",(0,a.jsx)(t.code,{children:"minioadmin"})," and ",(0,a.jsx)(t.code,{children:"minioadmin"}),"."]}),"\n",(0,a.jsxs)(t.p,{children:["Replace ",(0,a.jsx)(t.code,{children:"MINIO_ADDRESS"})," with the address of your MinIO instance. If you are running Kratix with minikube, you can get the address by running:"]}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-bash",children:"minikube service minio -n kratix-platform-system --url\n"})}),"\n",(0,a.jsx)(t.p,{children:"For other environments, you can open a port-forward to the MinIO service:"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-bash",children:"kubectl port-forward -n kratix-platform-system svc/minio 31337:80\n"})}),"\n",(0,a.jsxs)(t.p,{children:["and use ",(0,a.jsx)(t.code,{children:"http://localhost:31337"})," as the endpoint."]}),"\n",(0,a.jsx)(t.admonition,{type:"warning",children:(0,a.jsx)(t.p,{children:"Unless you can access the MinIO instance without port-forwarding, you must leave the terminal running the minikube service/port-forward command open for the duration of the Backstage app."})}),"\n",(0,a.jsx)(t.h3,{id:"configure-the-discovery",children:"Configure the Discovery"}),"\n",(0,a.jsxs)(t.p,{children:["Next, configure the AWS S3 Catalog Discovery. First, open the ",(0,a.jsx)(t.code,{children:"app-config.yaml"})," and add the following under the ",(0,a.jsx)(t.code,{children:"catalog"})," key:"]}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-yaml",children:'catalog:\n  rules:\n    - allow: [Component, Template] # Make sure to allow at least "component" and "template" entities\n  providers:\n    awsS3:\n      kratix-minio:\n        bucketName: kratix\n        prefix: backstage/\n        region: us-east-2\n        schedule:\n          frequency: { seconds: 10 }\n          timeout: { seconds: 30 }\n    rules:\n    - allow: [Component, Template] # Make sure to allow at least "component" and "template" entities\n'})}),"\n",(0,a.jsx)(t.p,{children:"Since the AWS provider is not one of the default Backstage providers, you will need to install the AWS Catalog plugin."}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-bash",children:"# From your Backstage root directory\nyarn --cwd packages/backend add @backstage/plugin-catalog-backend-module-aws\n"})}),"\n",(0,a.jsxs)(t.p,{children:["Once you've done that, you'll also need to register the package in ",(0,a.jsx)(t.code,{children:"packages/backend/src/index.ts"}),":"]}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-typescript",children:"backend.add(import('@backstage/plugin-catalog-backend-module-aws/alpha'));\n"})}),"\n",(0,a.jsx)(t.h2,{id:"configuring-kratix",children:"Configuring Kratix"}),"\n",(0,a.jsx)(t.p,{children:"At this moment you have Backstage configured to read its catalog from an external state store. Next, you must configure Kratix so it can write Backstage entity data to the same state store."}),"\n",(0,a.jsxs)(t.p,{children:["The steps below will build from the previous section and assume you have a Kratix instance running as described in the ",(0,a.jsx)(t.a,{href:"/main/quick-start",children:"quick start guide"}),". If your Kratix is deployed differently, please adjust the steps accordingly."]}),"\n",(0,a.jsx)(t.h3,{id:"configure-the-state-store",children:"Configure the State Store"}),"\n",(0,a.jsxs)(t.p,{children:["The quick start guide already configures a ",(0,a.jsx)(t.a,{href:"/main/reference/statestore/intro",children:"Kratix State Store"})," pointing to a bucket in the MinIO instance. You can validate the setup by running the following command:"]}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-bash",children:"kubectl get bucketstatestores.platform.kratix.io\n"})}),"\n",(0,a.jsx)(t.p,{children:"The output should look like this:"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-shell-session",children:"NAME      AGE\ndefault   1m\n"})}),"\n",(0,a.jsx)(t.p,{children:"If you inspect the state store definition:"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-bash",children:"kubectl get bucketstatestores.platform.kratix.io default -o yaml\n"})}),"\n",(0,a.jsx)(t.p,{children:"You should see something similar to the following:"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-yaml",children:"apiVersion: platform.kratix.io/v1alpha1\nkind: BucketStateStore\nmetadata:\n  name: default\nspec:\n  authMethod: accessKey\n  #highlight-next-line\n  bucketName: kratix\n  endpoint: minio.kratix-platform-system.svc.cluster.local\n  insecure: true\n  secretRef:\n    name: minio-credentials\n    namespace: default\n"})}),"\n",(0,a.jsxs)(t.p,{children:["Note how the ",(0,a.jsx)(t.code,{children:"bucketName"})," field matches the ",(0,a.jsx)(t.code,{children:"bucketName"})," you configured in the Backstage ",(0,a.jsx)(t.code,{children:"app-config.yaml"})," file. If you are using a different deployment setup, make sure to update the configurations accordingly"]}),"\n",(0,a.jsx)(t.h3,{id:"configure-a-destination-for-backstage",children:"Configure a Destination for Backstage"}),"\n",(0,a.jsxs)(t.p,{children:["Next, you must configure a destination for the Backstage entities. This is done by creating a ",(0,a.jsx)(t.code,{children:"Destination"})," resource in Kratix. The ",(0,a.jsx)(t.code,{children:"Destination"})," resource will point to the state store you configured in the previous step, writing to the directory where Backstage expects to find its entities."]}),"\n",(0,a.jsxs)(t.p,{children:["Create the ",(0,a.jsx)(t.code,{children:"Destination"})," resource by running the following command:"]}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-yaml",children:"cat <<EOF | kubectl apply -f -\napiVersion: platform.kratix.io/v1alpha1\nkind: Destination\nmetadata:\n  name: backstage\n  labels:\n    environment: backstage\nspec:\n  stateStoreRef:\n    kind: BucketStateStore\n    name: default\n  path: backstage\n  strictMatchLabels: true\nEOF\n"})}),"\n",(0,a.jsx)(t.admonition,{type:"info",children:(0,a.jsxs)(t.p,{children:["The ",(0,a.jsx)(t.code,{children:"path"})," field should match the ",(0,a.jsx)(t.code,{children:"path"})," you configured in the Backstage ",(0,a.jsx)(t.code,{children:"app-config.yaml"})," file, under the ",(0,a.jsx)(t.code,{children:"catalog"}),". If you are using a different deployment setup, make sure to update the configurations accordingly."]})}),"\n",(0,a.jsx)(t.h2,{id:"next",children:"Next"}),"\n",(0,a.jsx)(t.p,{children:"Great! Kratix is now configured to write to the same state store that Backstage is configured to read its catalog from. At the moment, that's a one-way communication."}),"\n",(0,a.jsxs)(t.p,{children:[(0,a.jsx)(t.a,{href:"./plugins",children:"In the next guide"})," you will configure Backstage to write to a state store, and configure Kratix to read from it."]}),"\n",(0,a.jsx)("img",{referrerpolicy:"no-referrer-when-downgrade",src:"https://static.scarf.sh/a.png?x-pxid=815401eb-b7c5-4413-a7db-e5c87479b310"})]})}function h(e={}){const{wrapper:t}={...(0,i.a)(),...e.components};return t?(0,a.jsx)(t,{...e,children:(0,a.jsx)(d,{...e})}):d(e)}},1151:(e,t,n)=>{n.d(t,{Z:()=>r,a:()=>o});var a=n(7294);const i={},s=a.createContext(i);function o(e){const t=a.useContext(s);return a.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function r(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:o(e.components),a.createElement(s.Provider,{value:t},e.children)}}}]);