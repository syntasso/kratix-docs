"use strict";(self.webpackChunkkratix_docs=self.webpackChunkkratix_docs||[]).push([[5284],{667:(e,s,n)=>{n.r(s),n.d(s,{assets:()=>d,contentTitle:()=>r,default:()=>h,frontMatter:()=>o,metadata:()=>l,toc:()=>c});var t=n(5893),i=n(1151);n(9286);const a=n.p+"assets/images/part-ii-compound-promise-flow-fa7a6142719ac1a48db20a1f775472f3.png",o={id:"compound-promise",title:"Making a Compound Promise",description:"Extend the app promise with a database option, making it a compound promise"},r=void 0,l={id:"workshop/part-ii/compound-promise",title:"Making a Compound Promise",description:"Extend the app promise with a database option, making it a compound promise",source:"@site/docs/workshop/part-ii/06-compound-promise.mdx",sourceDirName:"workshop/part-ii",slug:"/workshop/part-ii/compound-promise",permalink:"/workshop/part-ii/compound-promise",draft:!1,unlisted:!1,editUrl:"https://github.com/syntasso/kratix-docs/tree/main/docs/workshop/part-ii/06-compound-promise.mdx",tags:[],version:"current",sidebarPosition:6,frontMatter:{id:"compound-promise",title:"Making a Compound Promise",description:"Extend the app promise with a database option, making it a compound promise"},sidebar:"workshopSidebar",previous:{title:"Surfacing information via Status",permalink:"/workshop/part-ii/status"},next:{title:"What's next?",permalink:"/workshop/whats-next"}},d={},c=[{value:"Delivering Developer Experiences",id:"delivering-developer-experiences",level:2},{value:"Writing a Compound Promise",id:"writing-a-compound-promise",level:2},{value:"Updating the API",id:"updating-the-api",level:3},{value:"Configuring a Compound Promise",id:"configuring",level:3},{value:"Defining Promises as Required Promises",id:"defining-promises-as-required-promises",level:4},{value:"Updating the Pipelines",id:"updating-the-pipelines",level:3},{value:"Requesting a Database with your App",id:"requesting-a-database-with-your-app",level:2},{value:"\ud83c\udf89 Congratulations",id:"-congratulations",level:2}];function p(e){const s={a:"a",admonition:"admonition",code:"code",h2:"h2",h3:"h3",h4:"h4",li:"li",p:"p",pre:"pre",ul:"ul",...(0,i.a)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(s.p,{children:["This is Part 5 of ",(0,t.jsx)(s.a,{href:"intro",children:"a series"})," illustrating how to write Kratix Promises."]}),"\n",(0,t.jsxs)(s.p,{children:["\ud83d\udc48\ud83c\udffe Previous: ",(0,t.jsx)(s.a,{href:"status",children:"Surfacing information via Status"}),(0,t.jsx)("br",{}),"\n\ud83d\udc49\ud83c\udffe Next: ",(0,t.jsx)(s.a,{href:"../whats-next",children:"What's next"})]}),"\n",(0,t.jsx)("hr",{}),"\n",(0,t.jsx)(s.p,{children:"In the previous section, you learned how the update the status of a resource request. This allowed you to equip the user with relevant information about their request, in this case, the url of their todo app."}),"\n",(0,t.jsx)(s.p,{children:"In this section, you will gain an understanding of Compound Promises. You will:"}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsx)(s.li,{children:(0,t.jsx)(s.a,{href:"#configuring",children:"Learn how to Configure a Compound Promises"})}),"\n"]}),"\n",(0,t.jsx)(s.h2,{id:"delivering-developer-experiences",children:"Delivering Developer Experiences"}),"\n",(0,t.jsxs)(s.p,{children:["At present, users can self-serve their own App-as-a-Service but we know that eventually users will need a way to persist the state of their applications. In fact, if you go to the Application (at ",(0,t.jsx)(s.a,{href:"http://todo.local.gd:31338/",children:"http://todo.local.gd:31338/"}),") and add some Todos, then delete it:"]}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-bash",children:"kubectl --context $WORKER delete deployment todo\n"})}),"\n",(0,t.jsx)(s.p,{children:"You should notice that the App is brought back online, which is great! However, all the Todos you added are gone. This is because the state of the App is not persisted anywhere. We can solve this by providing a database service alongside the App-as-a-Service. As the need for a database is tied to the functionality of the App-as-a-Service, we can make the Database platform offering something that can requested alongside the App-as-a-service."}),"\n",(0,t.jsx)(s.p,{children:"To achieve this, we will make it possible for users to request a PostgreSQL service alongside their App."}),"\n",(0,t.jsx)(s.h2,{id:"writing-a-compound-promise",children:"Writing a Compound Promise"}),"\n",(0,t.jsx)(s.p,{children:"As mentioned in Part I, Compound Promises are Promises that contain or use other Promises. That ability allows Platform teams to deliver entire developer experiences on-demand, providing more than just components but entire software stacks."}),"\n",(0,t.jsx)(s.p,{children:"To create a compound promise, you generally need three updates:"}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsx)(s.li,{children:"Update the Promise to include the required Promise"}),"\n",(0,t.jsx)(s.li,{children:"Update the API to expose the configuration options for the required Promise"}),"\n",(0,t.jsx)(s.li,{children:"Update the Pipeline to create requests to the required Promise"}),"\n"]}),"\n",(0,t.jsx)(s.h3,{id:"updating-the-api",children:"Updating the API"}),"\n",(0,t.jsxs)(s.p,{children:["You want users to have control over whether their app deployment should include a database or not. You decide to expose that option via a new field on the Promise API called ",(0,t.jsx)(s.code,{children:"dbDriver"}),". This field will allow users to specify the database they want to use. In this tutorial, we will only build support for PostgreSQL, but the process to extend that to many other DBs would be very similar."]}),"\n",(0,t.jsxs)(s.p,{children:["As covered previously, the ",(0,t.jsx)(s.code,{children:"spec.api"})," field is where you define the API for your Promise. You will need to add a new field called ",(0,t.jsx)(s.code,{children:"dbDriver"})," to the ",(0,t.jsx)(s.code,{children:"spec.api.openAPIV3Schema"})," field. Locate the ",(0,t.jsx)(s.code,{children:"schema"})," field in your ",(0,t.jsx)(s.code,{children:"promise.yaml"})," and add the following:"]}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-yaml",metastring:'title="promise.yaml"',children:"# ...\nschema:\n  openAPIV3Schema:\n    type: object\n    properties:\n      spec:\n        type: object\n        properties:\n          service:\n            type: object\n            properties:\n              port:\n                type: integer\n        image:\n          type: string\n#highlight-start\n        dbDriver:\n          type: string\n#highlight-end\n"})}),"\n",(0,t.jsx)(s.p,{children:"Great! Users now have a way to specify the database they want to use. Next, you need to tell Kratix that this Promise is dependent on the PostgreSQL Promise."}),"\n",(0,t.jsx)(s.h3,{id:"configuring",children:"Configuring a Compound Promise"}),"\n",(0,t.jsxs)(s.p,{children:["We are going to make PostgreSQL available to the App-as-a-Service Promise via the PostgreSQL Promise available in the ",(0,t.jsx)(s.a,{href:"https://docs.kratix.io/marketplace",children:"Kratix Marketplace"}),". In the Marketplace, you will find many other Promises you could integrate with your Promises."]}),"\n",(0,t.jsx)(s.p,{children:"There are multiple ways to define a Compound Promise:"}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsxs)(s.li,{children:["You can add the Promise as part of the ",(0,t.jsx)(s.code,{children:"dependencies"})," field in the Promise"]}),"\n",(0,t.jsx)(s.li,{children:"You can update the Promise Configure Workflow to output the PostgreSQL Promise as part of the dependencies"}),"\n",(0,t.jsxs)(s.li,{children:["You can use the ",(0,t.jsx)(s.code,{children:"requiredPromises"})," field in the Promise"]}),"\n"]}),"\n",(0,t.jsxs)(s.p,{children:["This tutorial will cover only the last method: using the ",(0,t.jsx)(s.code,{children:"requiredPromises"})," field. The EasyApp Promise you used in the previous section uses the first method, in case you want to explore how to do that."]}),"\n",(0,t.jsx)(s.h4,{id:"defining-promises-as-required-promises",children:"Defining Promises as Required Promises"}),"\n",(0,t.jsxs)(s.p,{children:["The ",(0,t.jsx)(s.code,{children:"requiredPromises"})," field is a list of required Promises that the Promise needs to be installed in the Platform."]}),"\n",(0,t.jsxs)(s.p,{children:["Add the following to the ",(0,t.jsx)(s.code,{children:"spec"})," of your ",(0,t.jsx)(s.code,{children:"promise.yaml"}),"."]}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-yaml",children:"apiVersion: platform.kratix.io/v1alpha1\nkind: Promise\nmetadata:\n  name: app\nspec:\n  #highlight-start\n  requiredPromises:\n  - name: postgresql\n    version: v1.0.0-beta.2\n  #highlight-end\n  # ...\n"})}),"\n",(0,t.jsxs)(s.p,{children:["This states that the App-as-a-Promise needs the PostgreSQL Promise to be installed at version ",(0,t.jsx)(s.code,{children:"v1.0.0-beta.2"}),". You can read more about Promise versioning ",(0,t.jsx)(s.a,{href:"/main/reference/promises/releases#promise-release",children:"in the reference documentation"}),"."]}),"\n",(0,t.jsx)(s.p,{children:"Apply your newly updated promise:"}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-bash",children:"kubectl --context $PLATFORM apply --filename promise.yaml\n"})}),"\n",(0,t.jsx)(s.p,{children:"You should have observed a warning similar to the following:"}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-shell-session",children:'Warning: Requirement Promise "postgresql" at version "v1.0.0-beta.2" not installed\nWarning: Promise will not be available until the above issue(s) is resolved\n'})}),"\n",(0,t.jsx)(s.p,{children:"This is because the PostgreSQL promise is not currently installed. If you query the list of Promises:"}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-bash",children:"kubectl --context $PLATFORM get promises\n"})}),"\n",(0,t.jsx)(s.p,{children:'You should see the App promise as "Unavailable":'}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-shell-session",children:"NAME   STATUS        KIND   API VERSION             VERSION\napp    Unavailable   App    workshop.kratix.io/v1\n"})}),"\n",(0,t.jsx)(s.p,{children:"To fix that, run the following to install the PostgreSQL Promise:"}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-bash",children:"kubectl --context $PLATFORM apply --filename https://raw.githubusercontent.com/syntasso/promise-postgresql/main/promise-release.yaml\n"})}),"\n",(0,t.jsx)(s.admonition,{type:"info",children:(0,t.jsxs)(s.p,{children:["You might have noticed that the above command uses a Promise Release to install the PostgreSQL Promise, we will not be exploring this in depth but you can look at the ",(0,t.jsx)(s.a,{href:"/main/reference/promises/releases",children:"documentation"})," for more information"]})}),"\n",(0,t.jsx)(s.p,{children:"Kratix should automatically detect that the App Promise should now be available, since its requirements are now met. If you query the list of Promises again:"}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-bash",children:"kubectl --context $PLATFORM get promises\n"})}),"\n",(0,t.jsx)(s.p,{children:'You should see, after a few seconds, that both promises are marked as "Available":'}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-shell-session",children:"NAME         STATUS      KIND         API VERSION                      VERSION\napp          Available   App          workshop.kratix.io/v1\npostgresql   Available   postgresql   marketplace.kratix.io/v1alpha1   v1.0.0-beta.2\n"})}),"\n",(0,t.jsx)(s.p,{children:"Excellent. You have now configured the App-as-a-Service Promise to be a Compound Promise that requires a PostgreSQL Promise. Next, you will need to update the Resource Workflow to actually use the new promise."}),"\n",(0,t.jsx)(s.h3,{id:"updating-the-pipelines",children:"Updating the Pipelines"}),"\n",(0,t.jsx)(s.p,{children:"We'll need to define an additional step in the pipeline that makes a request for a PostgreSQL service when making or updating a request for an app. We'll start by defining the pipeline stage that will run when a user wants the request a PostgreSQL service with their app."}),"\n",(0,t.jsxs)(s.p,{children:["Create a ",(0,t.jsx)(s.code,{children:"database-configure"})," file in the ",(0,t.jsx)(s.code,{children:"workflows"})," directory and make it executable. Next, copy the contents of ",(0,t.jsx)(s.a,{href:"https://gist.githubusercontent.com/syntassodev/7cfae7b53bc54615cf351760a8377ba2/raw/34b37a7af95bd24293cc7ea3a3456cd4d58361a0/gistfile1.txt",children:"this file"})," into it:"]}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-bash",children:"touch workflows/database-configure\nchmod +x workflows/database-configure\ncurl -o workflows/database-configure --silent https://gist.githubusercontent.com/syntassodev/7cfae7b53bc54615cf351760a8377ba2/raw/34b37a7af95bd24293cc7ea3a3456cd4d58361a0/gistfile1.txt\n"})}),"\n",(0,t.jsxs)(s.p,{children:["Take a closer look at the script. Unlike the Ingress configured via the NGINX Controller, we will not always want to provision a PostgreSQL service with each app. The script will only provision a PostgreSQL if the resource request ",(0,t.jsx)(s.code,{children:"spec"})," specifies a ",(0,t.jsx)(s.code,{children:"dbDriver"})," key a value of ",(0,t.jsx)(s.code,{children:"postgresql"}),":"]}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-ruby",children:'if dbDriver != \'postgresql\' then\n  puts "Unsupported db driver: #{dbDriver}"\n  puts "Supported drivers: postgresql"\n  exit 1\nend\n'})}),"\n",(0,t.jsx)(s.p,{children:"It then creates a Resource Request for the PostgreSQL promise:"}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-ruby",children:"postgresqlRequest = {\n  'apiVersion' => \"marketplace.kratix.io/v1alpha1\",\n  'kind' => 'postgresql',\n  'metadata' => {\n    'name' => \"#{dbName}\",\n    'namespace' => \"#{namespace}\"\n  },\n  'spec' => {\n    'teamId' => \"#{teamId}\",\n    'dbName' => \"#{dbName}\"\n  }\n}\n"})}),"\n",(0,t.jsxs)(s.p,{children:["As the the contents of ",(0,t.jsx)(s.code,{children:"/kratix/output/platform"})," need to go to the Platform cluster, it explicitly states that the output needs to be directed to the Platform:"]}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-ruby",children:"destinationSelectorsRequest = [{\n  'directory' => 'platform',\n  'matchLabels' => {\n    'environment' => 'platform'\n  }\n}]\n"})}),"\n",(0,t.jsx)(s.p,{children:"It then updates the app deployment with the details of the database:"}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-ruby",children:"env = [{\n  'name' => 'PGPASSWORD',\n  'valueFrom' => {\n    'secretKeyRef' => {\n      'name' => \"#{secretRef}\",\n      'key' => 'password'\n      },\n    }\n  }, {\n    'name' => 'PGUSER',\n    'valueFrom' => {\n      'secretKeyRef' => {\n        'name' => \"#{secretRef}\",\n        'key' => 'username'\n      },\n    }\n  }, {\n    'name' => 'PGHOST',\n    'value' => \"#{teamId}-#{dbName}-postgresql.default.svc.cluster.local\"\n  }, {\n    'name' => 'DBNAME',\n    'value' => \"#{dbName}\"\n  }\n]\n\n# Injecting the database credentials into the app deployment\nexistingDeployment = YAML.load_file('/kratix/output/deployment.yaml')\nexistingDeployment['spec']['template']['spec']['containers'][0]['env'] = env\n"})}),"\n",(0,t.jsxs)(s.p,{children:["You should also ensure that the ",(0,t.jsx)(s.code,{children:"database-configure"})," is available in the Pipeline image. Update ",(0,t.jsx)(s.code,{children:"Dockerfile"})," to add the new ",(0,t.jsx)(s.code,{children:"database-configure"})," script:"]}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-dockerfile",metastring:'title="app-promise/workflows/Dockerfile',children:"COPY database-configure /scripts/database-configure\n"})}),"\n",(0,t.jsxs)(s.p,{children:["Now that the script has been defined, you can test it. Since the ",(0,t.jsx)(s.code,{children:"database-configure"})," manipulates both the user's input as the existing output, you need to chain the scripts in order to test it properly. Go ahead and execute the test script:"]}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-bash",children:'./scripts/test-pipeline "resource-configure && database-configure"\n'})}),"\n",(0,t.jsx)(s.p,{children:"You should see, at the tail-end of your output, the following log:"}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-shell-session",children:"Checking for database driver...\nNo database driver specified, skipping\n"})}),"\n",(0,t.jsxs)(s.p,{children:["That's because our test input does not specify a ",(0,t.jsx)(s.code,{children:"dbDriver"}),". Open the ",(0,t.jsx)(s.code,{children:"test/input/object.yaml"})," and update its ",(0,t.jsx)(s.code,{children:"spec"})," to include the ",(0,t.jsx)(s.code,{children:"dbDriver"}),":"]}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-yaml",children:'apiVersion: workshop.kratix.io/v1\nkind: App\nmetadata:\n  name: my-app\n  namespace: default\nspec:\n  image: example/image:v1.0.0\n  service:\n    port: 9000\n  #highlight-next-line\n  dbDriver: postgresql\nstatus:\n  createdAt: "Thu Jan 28 15:00:00 UTC 2021"\n  message: "my-app.local.gd:31338"\n'})}),"\n",(0,t.jsx)(s.p,{children:"Run the tests again:"}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-bash",children:'./scripts/test-pipeline "resource-configure && database-configure"\n'})}),"\n",(0,t.jsx)(s.p,{children:"You should now see:"}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-shell-session",children:"Checking for database driver...\nPostgresql database driver detected, including database resources\n"})}),"\n",(0,t.jsx)(s.p,{children:"Great! If you inspect your file test file tree, you should now see the following:"}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{children:"test\n\u251c\u2500\u2500 input\n\u2502\xa0\xa0 \u2514\u2500\u2500 object.yaml\n\u251c\u2500\u2500 metadata\n\u2502\xa0\xa0 \u251c\u2500\u2500 destination-selectors.yaml\n\u2502\xa0\xa0 \u2514\u2500\u2500 status.yaml\n\u2514\u2500\u2500 output\n    \u251c\u2500\u2500 deployment.yaml\n    \u251c\u2500\u2500 ingress.yaml\n    \u251c\u2500\u2500 platform\n    \u2502\xa0\xa0 \u2514\u2500\u2500 postgresql.yaml\n    \u2514\u2500\u2500 service.yaml\n"})}),"\n",(0,t.jsxs)(s.p,{children:["Inspect those files. You should see that the ",(0,t.jsx)(s.code,{children:"test/output/platform/postgresql.yaml"})," file has been created and contains the details of the PostgreSQL service, and the ",(0,t.jsx)(s.code,{children:"test/metadata/destination-selectors.yaml"})," is telling Kratix to request the PostgreSQL from the platform cluster. The ",(0,t.jsx)(s.code,{children:"test/output/deployment.yaml"})," file should also contain the details of the PostgreSQL service in the ",(0,t.jsx)(s.code,{children:"env"})," block of the first ",(0,t.jsx)(s.code,{children:"container"}),"."]}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-yaml",metastring:'title="app-promise/test/output/deployment.yaml"',children:"env:\n- name: PGPASSWORD\n  valueFrom:\n  secretKeyRef:\n    name: my-app-team.my-app-team-my-app-db-postgresql.credentials.postgresql.acid.zalan.do\n    key: password\n- name: PGUSER\n  valueFrom:\n  secretKeyRef:\n    name: my-app-team.my-app-team-my-app-db-postgresql.credentials.postgresql.acid.zalan.do\n    key: password\n- name: PGHOST\n  value: my-app-team-my-app-db-postgresql.default.svc.cluster.local\n- name: DBNAME\n  value: my-app-db\n"})}),"\n",(0,t.jsxs)(s.p,{children:["Great! It looks like everything is in place. The last step is to actually include the ",(0,t.jsx)(s.code,{children:"database-configure"})," step in the pipeline. Open the promise file and include the step in the ",(0,t.jsx)(s.code,{children:"workflows.resource.configure"}),":"]}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-yaml",children:"# ...\nworkflows:\n  resources:\n    configure:\n    - apiVersion: platform.kratix.io/v1alpha1\n      kind: Pipeline\n      metadata:\n        name: resource-configure\n      spec:\n        containers:\n          - name: create-resources\n            # ...\n          - name: create-bucket\n            # ...\n          #highlight-start\n          - name: database-configure\n            image: kratix-workshop/app-pipeline-image:v1.0.0\n            command: [ database-configure ]\n          #highlight-end\n"})}),"\n",(0,t.jsx)(s.p,{children:"Apply your newly updated promise:"}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-bash",children:"kubectl --context $PLATFORM apply --filename promise.yaml\n"})}),"\n",(0,t.jsx)(s.p,{children:"Great! Your App-as-a-Service Promise is now a Compound Promise that can request a PostgreSQL service. You can now test it by making a request for an App-as-a-Service with a PostgreSQL service."}),"\n",(0,t.jsx)(s.h2,{id:"requesting-a-database-with-your-app",children:"Requesting a Database with your App"}),"\n",(0,t.jsxs)(s.p,{children:["Users can now request a database together with their Apps. Open the ",(0,t.jsx)(s.code,{children:"resource-request.yaml"})," and update it to include the ",(0,t.jsx)(s.code,{children:"dbDriver"})," property set to ",(0,t.jsx)(s.code,{children:"postgresql"}),":"]}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-yaml",metastring:'title="app-promise/resource-request.yaml"',children:"apiVersion: workshop.kratix.io/v1\nkind: App\nmetadata:\n  name: todo\n  namespace: default\nspec:\n  image: syntasso/sample-todo:v0.1.0\n  service:\n    port: 8080\n  dbDriver: postgresql\n"})}),"\n",(0,t.jsx)(s.p,{children:"Apply the updated App-as-a-Service Resource Request:"}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-bash",children:"kubectl --context $PLATFORM apply --filename resource-request.yaml\n"})}),"\n",(0,t.jsxs)(s.p,{children:["At this point, the Resource Configure workflow for the App-as-a-Service will be executed. As part of the workflow, the ",(0,t.jsx)(s.code,{children:"database-configure"})," step will be executed, which will create a request for a PostgreSQL service, which, in turn, will trigger the PostgreSQL workflow. You can see the PostgreSQL pipeline getting executed (it may take a few seconds for it to appear):"]}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-bash",children:"kubectl --context $PLATFORM get pods --selector kratix.io/promise-name=postgresql\n"})}),"\n",(0,t.jsx)(s.p,{children:"The above command will output something similar to:"}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-bash",children:"NAME                                        READY   STATUS      RESTARTS   AGE\nconfigure-pipeline-postgresql-abad9-vxgd8   0/1     Completed   0          5m4s\n"})}),"\n",(0,t.jsx)(s.p,{children:"In a couple of minutes, if you list the running pods on your Worker:"}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-bash",children:"kubectl --context $WORKER get pods\n"})}),"\n",(0,t.jsx)(s.p,{children:"You should see the both the App and the PostgreSQL getting deployed on the\nWorker cluster Destination:"}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-bash",children:"NAME                                 READY   STATUS    RESTARTS       AGE\npostgres-operator-64cbcd6fdf-7x6ks   1/1     Running   0              4m19s\ntodo-568ddbc474-qrk8g                1/1     Running   1 (4m7s ago)   10m\ntodoteam-tododb-postgresql-0         1/1     Running   0              4m12s\n"})}),"\n","\n",(0,t.jsxs)("figure",{className:"diagram",children:[(0,t.jsx)("img",{className:"large",src:a,alt:"Flow of a\nResource Request for the Compound Promise"}),(0,t.jsx)("figcaption",{children:"Resource request flow for the App Promise w/ PostgreSQL"})]}),"\n",(0,t.jsxs)(s.p,{children:["Amazing! You have successfully created a Compound Promise that can request a PostgreSQL service alongside an App-as-a-Service. You can now go to the ",(0,t.jsx)(s.a,{href:"http://todo.local.gd:31338/",children:"http://todo.local.gd:31338"})," and add some Todos. Then, re-run the command to delete the App. Once the App gets redeployed, you should see that the Todos are still there, as the state of the App is now persisted in the PostgreSQL service."]}),"\n",(0,t.jsx)(s.h2,{id:"-congratulations",children:"\ud83c\udf89 Congratulations"}),"\n",(0,t.jsxs)(s.p,{children:["\u2705 \xa0 You have just created your first Compound Promise. ",(0,t.jsx)("br",{}),"\n\ud83d\udc49 \xa0 You can go check ",(0,t.jsx)(s.a,{href:"../whats-next",children:"what's next"})," to learn about what else you can achieve with Kratix."]})]})}function h(e={}){const{wrapper:s}={...(0,i.a)(),...e.components};return s?(0,t.jsx)(s,{...e,children:(0,t.jsx)(p,{...e})}):p(e)}}}]);