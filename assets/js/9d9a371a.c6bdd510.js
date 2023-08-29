"use strict";(self.webpackChunkkratix_docs=self.webpackChunkkratix_docs||[]).push([[5147],{3905:(e,t,a)=>{a.d(t,{Zo:()=>p,kt:()=>h});var n=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function s(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function i(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},o=Object.keys(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var l=n.createContext({}),u=function(e){var t=n.useContext(l),a=t;return e&&(a="function"==typeof e?e(t):s(s({},t),e)),a},p=function(e){var t=u(e.components);return n.createElement(l.Provider,{value:t},e.children)},c="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,o=e.originalType,l=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),c=u(a),d=r,h=c["".concat(l,".").concat(d)]||c[d]||m[d]||o;return a?n.createElement(h,s(s({ref:t},p),{},{components:a})):n.createElement(h,s({ref:t},p))}));function h(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=a.length,s=new Array(o);s[0]=d;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i[c]="string"==typeof e?e:r,s[1]=i;for(var u=2;u<o;u++)s[u]=a[u];return n.createElement.apply(null,s)}return n.createElement.apply(null,a)}d.displayName="MDXCreateElement"},1567:(e,t,a)=>{a.d(t,{ZP:()=>s});var n=a(7462),r=(a(7294),a(3905));const o={toc:[]};function s(e){let{components:t,...a}=e;return(0,r.kt)("wrapper",(0,n.Z)({},o,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"Following the previous step of this tutorial, you should now\nhave a deployment of both Kratix and MinIO running on your platform cluster\nwith no installed Promises."),(0,r.kt)("p",null,"You should also have two environment variables, ",(0,r.kt)("inlineCode",{parentName:"p"},"PLATFORM")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"WORKER"),"."),(0,r.kt)("details",null,(0,r.kt)("summary",null,"Verify the current state of your installation"),"Run:",(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"kubectl --context $PLATFORM get deployments --namespace kratix-platform-system\n")),(0,r.kt)("p",null,"The above command will give an output similar to:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell-session"},"NAME                                 READY   UP-TO-DATE   AVAILABLE   AGE\nkratix-platform-controller-manager   1/1     1            1           1h\nminio                                1/1     1            1           1h\n")),(0,r.kt)("p",null,"You should also have a State Store created and configured to point to the\n",(0,r.kt)("inlineCode",{parentName:"p"},"kratix")," bucket on MinIO. Verify the ",(0,r.kt)("inlineCode",{parentName:"p"},"bucketstatestores"),":"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"kubectl --context $PLATFORM get bucketstatestores.platform.kratix.io\n")),(0,r.kt)("p",null,"The above command will give an output similar to:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell-session"},"NAME          AGE\nminio-store   1h\n")),(0,r.kt)("p",null,"Verify there are no existing Promises:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"kubectl --context $PLATFORM get promises\n")),(0,r.kt)("p",null,"Verify your cluster environment variables are set:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"env | grep 'PLATFORM\\|WORKER'\n")),(0,r.kt)("p",null,"which should result in:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell-session"},"WORKER=kind-worker\nPLATFORM=kind-platform\n"))),(0,r.kt)("p",null,"If you are are not continuing from the previous section, or your outputs do not align with the validation, please refer back to\n",(0,r.kt)("a",{parentName:"p",href:"installing-kratix"},"Installing Kratix"),"."))}s.isMDXComponent=!0},4926:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>l,contentTitle:()=>s,default:()=>c,frontMatter:()=>o,metadata:()=>i,toc:()=>u});var n=a(7462),r=(a(7294),a(3905));a(1567);const o={description:"Updating the Resource status",title:"Updating the Resource status",id:"updating-status",slug:"../updating-status"},s=void 0,i={unversionedId:"workshop/part-ii/updating-status",id:"workshop/part-ii/updating-status",title:"Updating the Resource status",description:"Updating the Resource status",source:"@site/docs/workshop/part-ii/05-updating-status.md",sourceDirName:"workshop/part-ii",slug:"/workshop/updating-status",permalink:"/docs/workshop/updating-status",draft:!1,editUrl:"https://github.com/syntasso/kratix-docs/tree/main/docs/workshop/part-ii/05-updating-status.md",tags:[],version:"current",sidebarPosition:5,frontMatter:{description:"Updating the Resource status",title:"Updating the Resource status",id:"updating-status",slug:"../updating-status"},sidebar:"workshopSidebar",previous:{title:"Scheduling Promises",permalink:"/docs/workshop/scheduling-promise"},next:{title:"What's next?",permalink:"/docs/workshop/whats-next"}},l={},u=[{value:"Conveying information back to the application developers",id:"understand-metadata",level:2},{value:"Status",id:"status",level:2},{value:"Picking a status for your ECK Promise",id:"picking-a-status-for-your-eck-promise",level:3},{value:"Request a resource and check its status",id:"request-a-resource-and-check-its-status",level:2},{value:"The conditions field",id:"the-conditions-field",level:3},{value:"Summary",id:"summary",level:2}],p={toc:u};function c(e){let{components:t,...a}=e;return(0,r.kt)("wrapper",(0,n.Z)({},p,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"This is Part 2 of ",(0,r.kt)("a",{parentName:"p",href:"intro"},"a series")," illustrating how Kratix works. ",(0,r.kt)("br",null),"\n\ud83d\udc48\ud83c\udffe","\xa0","\xa0"," Previous: ",(0,r.kt)("a",{parentName:"p",href:"scheduling-promise"},"Intentionally schedule Promise resources"),")",(0,r.kt)("br",null),"\n\ud83d\udc49\ud83c\udffe","\xa0","\xa0"," Next: ",(0,r.kt)("a",{parentName:"p",href:"whats-next"},"What's next")),(0,r.kt)("hr",null),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"In this tutorial, you will")),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#understand-metadata"},"Conveying information back to the application developers")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#status"},"Status"),(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#picking-a-status-for-your-eck-promise"},"Picking a status for your ECK Promise")))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#request-a-resource-and-check-its-status"},"Request a resource and check its status")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#summary"},"Summary"))),(0,r.kt)("h2",{id:"understand-metadata"},"Conveying information back to the application developers"),(0,r.kt)("p",null,"What we've focused on so far is how to define a Kratix Promise in a compelling way so that platform users choose to use the platform. A Kratix-powered platform enables users to ask for the services they need, on-demand, without having to know unnecessary business and service lifecycle requirements."),(0,r.kt)("p",null,"What platform users need, though, is the end-to-end experience of making a simple request, understanding what's happening with the request, then ultimately making use of the service created by the request. So how do you communicate back to platform users information about their request, and how do users use the services that the platform creates?"),(0,r.kt)("p",null,"There are actually a number of ways you can communicate the status of a service to the platform, and the choice comes down to the Promise and Promise Workflow author."),(0,r.kt)("p",null,"One approach is to generate notifications for internal systems like Slack or Teams from the Promise Workflow's Pipeline container."),(0,r.kt)("p",null,"Another approach, which is what we'll choose today, is to follow convention and leverage the ",(0,r.kt)("inlineCode",{parentName:"p"},"status")," field on Kubernetes resources. The Kratix Workflow's Pipeline has the ability to write information back to the status of the Resource."),(0,r.kt)("p",null,"In the context of your Promise, an example of what you might want to convey back is the configuration of the Resource (e.g. default configuration), and how to access the running Resources (e.g. a URL or connection string)."),(0,r.kt)("h2",{id:"status"},"Status"),(0,r.kt)("p",null,"As we saw in ",(0,r.kt)("a",{parentName:"p",href:"/docs/workshop/scheduling-promise"},"scheduling"),", within the Pipeline container file system, Kratix mounts a ",(0,r.kt)("a",{parentName:"p",href:"../main/reference/resources/workflows#metadata"},(0,r.kt)("inlineCode",{parentName:"a"},"/kratix/metadata"))," directory to manage important configuration that is independent of the Resources definitions for your State Store."),(0,r.kt)("p",null,"Similar to writing destination selector rules to ",(0,r.kt)("inlineCode",{parentName:"p"},"/kratix/metadata/destination-selectors.yaml"),", you will write changes to the Resource status to the ",(0,r.kt)("inlineCode",{parentName:"p"},"/kratix/metadata/status.yaml")," file."),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"The ",(0,r.kt)("inlineCode",{parentName:"li"},"status.yaml")," file can contain arbitrary key values, with the ",(0,r.kt)("inlineCode",{parentName:"li"},"message")," key being a special key that is communicated back to the user when running ",(0,r.kt)("inlineCode",{parentName:"li"},"kubectl get elastic-cloud"),"."),(0,r.kt)("li",{parentName:"ul"},"All other key-value pairs are viewable by getting the full Resource definition.")),(0,r.kt)("h3",{id:"picking-a-status-for-your-eck-promise"},"Picking a status for your ECK Promise"),(0,r.kt)("p",null,"You want to achieve two things with the ECK Promise Resource status:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"The Promise provides an option to pre-configure Beats with modules. Broadcast the existence of these modules as part of the ",(0,r.kt)("inlineCode",{parentName:"li"},"message")," field."),(0,r.kt)("li",{parentName:"ul"},"You are providing Kibana as a user interface, and your users need a way to access the Kibana UI. Provide the initial username and password as additional ",(0,r.kt)("inlineCode",{parentName:"li"},"status")," values.")),(0,r.kt)("p",null,"Update the ",(0,r.kt)("inlineCode",{parentName:"p"},"pipeline/run")," script:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash",metastring:"title=pipeline/run -- add to the end",title:"pipeline/run","--":!0,add:!0,to:!0,the:!0,end:!0},'cat <<EOF > /kratix/metadata/status.yaml\nmessage: "Instance ${name} provisioned with preconfigured system metrics"\ninitialLoginDetails:\n    username: "elastic"\n    passwordSecretName: "${name}-es-elastic-user"\nEOF\n')),(0,r.kt)("h2",{id:"request-a-resource-and-check-its-status"},"Request a resource and check its status"),(0,r.kt)("p",null,"The ",(0,r.kt)("inlineCode",{parentName:"p"},"run")," script is included in the Pipeline's container image, so to have these destination selector changes take effect, you need to rebuild and re-load the Docker image."),(0,r.kt)("p",null,"The ",(0,r.kt)("inlineCode",{parentName:"p"},"test-pipeline")," script builds, loads, and runs the Docker image."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"./scripts/test-pipeline\n")),(0,r.kt)("p",null,"Verify that the test output directory contains the correct status:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell-session"},"\ud83d\udcc2 test\n\u251c\u2500\u2500 input\n\u2502   \u2514\u2500\u2500 object.yaml\n\u251c\u2500\u2500 metadata\n\u2502   \u2514\u2500\u2500 destination-selectors.yaml\n#highlight-next-line\n    \u2514\u2500\u2500 status.yaml\n\u2514\u2500\u2500 output\n    \u251c\u2500\u2500 beats.yaml\n    \u251c\u2500\u2500 elasticsearch.yaml\n    \u2514\u2500\u2500 kibana.yaml\n")),(0,r.kt)("p",null,"Next, install the Promise:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"kubectl --context $PLATFORM create --filename promise.yaml\n")),(0,r.kt)("p",null,"And finally, put on the Application Developer hat and make a request for a Elastic Cloud Resource:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"kubectl --context $PLATFORM apply --filename resource-request.yaml\n")),(0,r.kt)("p",null,"The status of the request for the Resource will start as ",(0,r.kt)("inlineCode",{parentName:"p"},"pending"),", which is the Kratix default before a Workflow runs. Once the Workflow has completed, the status will be updated."),(0,r.kt)("p",null,"Check the status of the Resource:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"kubectl --context $PLATFORM get elastic-clouds\n")),(0,r.kt)("p",null,"The above command will return something close to the following:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"NAME      STATUS\nexample   Instance example provisioned with preconfigured system metrics\n")),(0,r.kt)("p",null,"As you can see, the ",(0,r.kt)("inlineCode",{parentName:"p"},"message")," field appears in the output. To see the other keys, get the full ",(0,r.kt)("inlineCode",{parentName:"p"},"status")," value from Kubernetes:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"kubectl --context $PLATFORM get elastic-clouds example -o yaml | yq .status\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},'conditions:\n  - lastTransitionTime: "2023-01-01T12:00:00Z"\n    message: Pipeline completed\n    reason: PipelineExecutedSuccessfully\n    status: "True"\n    type: PipelineCompleted\nmessage: Instance example provisioned with preconfigured system metrics\ninitialLoginDetails:\n    username: elastic\n    passwordSecretName: example-es-elastic-user\n')),(0,r.kt)("details",null,(0,r.kt)("summary",null,"\ud83e\udd14 Curious about the conditions fields?"),(0,r.kt)("h3",{id:"the-conditions-field"},"The conditions field"),(0,r.kt)("p",null,(0,r.kt)("a",{parentName:"p",href:"https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#typical-status-properties"},"Conditions")," are a core Kubernetes concept and standard to convey information about a resources status. For example, Pods report back various conditions:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},'- lastProbeTime: null\n  lastTransitionTime: "2023-06-20T15:02:20Z"\n  status: "True"\n  type: Ready\n- lastProbeTime: null\n  lastTransitionTime: "2023-06-20T15:02:20Z"\n  status: "True"\n  type: ContainersReady\n- lastProbeTime: null\n  lastTransitionTime: "2023-06-20T15:00:49Z"\n  status: "True"\n  type: PodScheduled\n\n')),(0,r.kt)("p",null,"Conditions are also powerful for enabling you to wait for an occurrence. For example, you can wait for the health of a pod by running something like this:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"kubectl --context $PLATFORM \\\n    wait pods \\\n    --namespace kratix-platform-system \\\n    --selector control-plane=controller-manager \\\n    --for condition=Ready \\\n    --timeout=90s\n")),(0,r.kt)("p",null,"This same logic can be applied to Resources. Kratix sets the ",(0,r.kt)("inlineCode",{parentName:"p"},"PipelineCompleted")," condition. For example, a user (or CI/Automation) could wait for a request to finish by running:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"kubectl --context $PLATFORM wait elastic-cloud/example \\\n  --for=condition=PipelineCompleted --timeout=60s\n")),(0,r.kt)("p",null,"Kratix supports this by default for all Resources.")),(0,r.kt)("h2",{id:"summary"},"Summary"),(0,r.kt)("p",null,"To recap what you achieved:"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"\u2705","\xa0","\xa0"," Use metadata to set a custom Resource status")),(0,r.kt)("p",null,"\u2705","\xa0","\xa0","This tutorial concludes an Introduction to writing a Promise. ",(0,r.kt)("br",null),"\n\ud83d\udc49\ud83c\udffe","\xa0","\xa0","You can go check ",(0,r.kt)("a",{parentName:"p",href:"whats-next"},"what's next")," to learn about\nwhat else you can achieve with Kratix."))}c.isMDXComponent=!0}}]);