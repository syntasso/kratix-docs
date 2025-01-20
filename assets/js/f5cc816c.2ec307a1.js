"use strict";(self.webpackChunkkratix_docs=self.webpackChunkkratix_docs||[]).push([[5458],{7461:(e,n,t)=>{t.d(n,{A:()=>a});t(6540);var s=t(8215);const r={tabItem:"tabItem_Ymn6"};var o=t(4848);function a(e){let{children:n,hidden:t,className:a}=e;return(0,o.jsx)("div",{role:"tabpanel",className:(0,s.A)(r.tabItem,a),hidden:t,children:n})}},2206:(e,n,t)=>{t.d(n,{A:()=>j});var s=t(6540),r=t(8215),o=t(52),a=t(6347),i=t(5793),l=t(9025),c=t(4430),u=t(4148);function d(e){return s.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,s.isValidElement)(e)&&function(e){const{props:n}=e;return!!n&&"object"==typeof n&&"value"in n}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function h(e){const{values:n,children:t}=e;return(0,s.useMemo)((()=>{const e=n??function(e){return d(e).map((e=>{let{props:{value:n,label:t,attributes:s,default:r}}=e;return{value:n,label:t,attributes:s,default:r}}))}(t);return function(e){const n=(0,c.XI)(e,((e,n)=>e.value===n.value));if(n.length>0)throw new Error(`Docusaurus error: Duplicate values "${n.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[n,t])}function p(e){let{value:n,tabValues:t}=e;return t.some((e=>e.value===n))}function f(e){let{queryString:n=!1,groupId:t}=e;const r=(0,a.W6)(),o=function(e){let{queryString:n=!1,groupId:t}=e;if("string"==typeof n)return n;if(!1===n)return null;if(!0===n&&!t)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return t??null}({queryString:n,groupId:t});return[(0,l.aZ)(o),(0,s.useCallback)((e=>{if(!o)return;const n=new URLSearchParams(r.location.search);n.set(o,e),r.replace({...r.location,search:n.toString()})}),[o,r])]}function m(e){const{defaultValue:n,queryString:t=!1,groupId:r}=e,o=h(e),[a,l]=(0,s.useState)((()=>function(e){let{defaultValue:n,tabValues:t}=e;if(0===t.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(n){if(!p({value:n,tabValues:t}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${n}" but none of its children has the corresponding value. Available values are: ${t.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return n}const s=t.find((e=>e.default))??t[0];if(!s)throw new Error("Unexpected error: 0 tabValues");return s.value}({defaultValue:n,tabValues:o}))),[c,d]=f({queryString:t,groupId:r}),[m,x]=function(e){let{groupId:n}=e;const t=function(e){return e?`docusaurus.tab.${e}`:null}(n),[r,o]=(0,u.Dv)(t);return[r,(0,s.useCallback)((e=>{t&&o.set(e)}),[t,o])]}({groupId:r}),g=(()=>{const e=c??m;return p({value:e,tabValues:o})?e:null})();(0,i.A)((()=>{g&&l(g)}),[g]);return{selectedValue:a,selectValue:(0,s.useCallback)((e=>{if(!p({value:e,tabValues:o}))throw new Error(`Can't select invalid tab value=${e}`);l(e),d(e),x(e)}),[d,x,o]),tabValues:o}}var x=t(5251);const g={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var b=t(4848);function y(e){let{className:n,block:t,selectedValue:s,selectValue:a,tabValues:i}=e;const l=[],{blockElementScrollPositionUntilNextRender:c}=(0,o.a_)(),u=e=>{const n=e.currentTarget,t=l.indexOf(n),r=i[t].value;r!==s&&(c(n),a(r))},d=e=>{let n=null;switch(e.key){case"Enter":u(e);break;case"ArrowRight":{const t=l.indexOf(e.currentTarget)+1;n=l[t]??l[0];break}case"ArrowLeft":{const t=l.indexOf(e.currentTarget)-1;n=l[t]??l[l.length-1];break}}n?.focus()};return(0,b.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,r.A)("tabs",{"tabs--block":t},n),children:i.map((e=>{let{value:n,label:t,attributes:o}=e;return(0,b.jsx)("li",{role:"tab",tabIndex:s===n?0:-1,"aria-selected":s===n,ref:e=>{l.push(e)},onKeyDown:d,onClick:u,...o,className:(0,r.A)("tabs__item",g.tabItem,o?.className,{"tabs__item--active":s===n}),children:t??n},n)}))})}function k(e){let{lazy:n,children:t,selectedValue:o}=e;const a=(Array.isArray(t)?t:[t]).filter(Boolean);if(n){const e=a.find((e=>e.props.value===o));return e?(0,s.cloneElement)(e,{className:(0,r.A)("margin-top--md",e.props.className)}):null}return(0,b.jsx)("div",{className:"margin-top--md",children:a.map(((e,n)=>(0,s.cloneElement)(e,{key:n,hidden:e.props.value!==o})))})}function v(e){const n=m(e);return(0,b.jsxs)("div",{className:(0,r.A)("tabs-container",g.tabList),children:[(0,b.jsx)(y,{...n,...e}),(0,b.jsx)(k,{...n,...e})]})}function j(e){const n=(0,x.A)();return(0,b.jsx)(v,{...e,children:d(e.children)},String(n))}},4448:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>u,contentTitle:()=>c,default:()=>p,frontMatter:()=>l,metadata:()=>s,toc:()=>d});const s=JSON.parse('{"id":"main/guides/installing-gitops-agent/flux","title":"Flux","description":"Install Flux","source":"@site/docs/main/04-guides/05-installing-gitops-agent/01-flux.mdx","sourceDirName":"main/04-guides/05-installing-gitops-agent","slug":"/main/guides/installing-fluxcd","permalink":"/main/guides/installing-fluxcd","draft":false,"unlisted":false,"editUrl":"https://github.com/syntasso/kratix-docs/tree/main/docs/main/04-guides/05-installing-gitops-agent/01-flux.mdx","tags":[],"version":"current","sidebarPosition":1,"frontMatter":{"description":"Install Flux","slug":"/main/guides/installing-fluxcd","title":"Flux"},"sidebar":"mainSidebar","previous":{"title":"Installing GitOps Agent","permalink":"/category/installing-gitops-agent"},"next":{"title":"ArgoCD","permalink":"/main/guides/installing-argocd"}}');var r=t(4848),o=t(8453),a=t(2206),i=t(7461);const l={description:"Install Flux",slug:"/main/guides/installing-fluxcd",title:"Flux"},c=void 0,u={},d=[{value:"Installing Flux",id:"installing-flux",level:2},{value:"Configuring Flux",id:"configuring-flux",level:2},{value:"Configuring access to the State Store",id:"configuring-access-to-the-state-store",level:3},{value:"Configuring Flux to deploy resources from the State Store",id:"configuring-flux-to-deploy-resources-from-the-state-store",level:3}];function h(e){const n={a:"a",code:"code",h2:"h2",h3:"h3",p:"p",pre:"pre",...(0,o.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.p,{children:"Flux can be used as the GitOps agent for Kratix. This guide will show you how to\ninstall Flux to sync Kubernetes resources from your state store to your cluster."}),"\n",(0,r.jsx)(n.h2,{id:"installing-flux",children:"Installing Flux"}),"\n",(0,r.jsx)(n.p,{children:"If you have already installed Flux you can skip this section."}),"\n",(0,r.jsxs)(n.p,{children:["For the most up to date information on installing Flux, see the ",(0,r.jsx)(n.a,{href:"https://fluxcd.io/docs/installation/",children:"Flux\ndocumentation"}),". The simplest method of\ninstallaton is to use the latest FluxCD release manifest from the Flux repo on\nGitHub:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"kubectl --context $WORKER apply -f https://github.com/fluxcd/flux2/releases/latest/download/install.yaml\n"})}),"\n",(0,r.jsxs)(n.p,{children:["If you wish to install a different way (e.g. Helm or CLI), or want to install a specific version,\nfollow the instructions in the ",(0,r.jsx)(n.a,{href:"https://fluxcd.io/docs/installation/",children:"Flux documentation"}),"."]}),"\n",(0,r.jsxs)(n.p,{children:["Make sure that ",(0,r.jsx)(n.code,{children:"flux"})," is ready before proceeding:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell-session",children:"$ kubectl --context $WORKER get pods --namespace flux-system\nNAME                                       READY   STATUS    RESTARTS   AGE\nhelm-controller-5f7457c9dd-s5qzt           1/1     Running   0          18s\nkustomize-controller-5f58d55f76-hwm5w      1/1     Running   0          19s\nnotification-controller-685bdc466d-5xmk8   1/1     Running   0          16s\nsource-controller-86b8b57796-t6xgg         1/1     Running   0          20s\n"})}),"\n",(0,r.jsx)(n.h2,{id:"configuring-flux",children:"Configuring Flux"}),"\n",(0,r.jsx)(n.h3,{id:"configuring-access-to-the-state-store",children:"Configuring access to the State Store"}),"\n",(0,r.jsxs)(n.p,{children:["In order for FluxCD to be able to sync resources to your cluster you need to provide\nFluxCD access to read from your state store. This can be done by creating a ",(0,r.jsx)(n.code,{children:"Bucket"})," or ",(0,r.jsx)(n.code,{children:"GitRepository"}),"\nresource depending on the type of state store you are using."]}),"\n",(0,r.jsxs)(a.A,{className:"boxedTabs",groupId:"stateStore",children:[(0,r.jsxs)(i.A,{value:"minio",label:"Bucket (on KinD)",children:[(0,r.jsxs)(n.p,{children:["Create a ",(0,r.jsx)(n.code,{children:"flux-statestore.yaml"})," for giving Flux access to the Minio\nbucket. Below is an example of a ",(0,r.jsx)(n.code,{children:"Bucket"})," configured to talk to a MinIO\ninstance running locally. For more information on the different\nconfiguration and authentication opitions for the ",(0,r.jsx)(n.code,{children:"Bucket"})," resource, see the\n",(0,r.jsx)(n.a,{href:"https://fluxcd.io/flux/components/source/buckets/",children:"FluxCD docs"}),"."]}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:"---\napiVersion: source.toolkit.fluxcd.io/v1beta1\nkind: Bucket\nmetadata:\n  name: <state store name>\n  namespace: flux-system\nspec:\n  interval: 10s\n  provider: generic\n  bucketName: kratix\n  endpoint: 172.18.0.2:31337\n  insecure: true\n  secretRef:\nname: minio-credentials\n---\napiVersion: v1\nkind: Secret\nmetadata:\n  name: minio-credentials\n  namespace: default\ntype: Opaque\nstringData:\n  accesskey: <access key>\n  secretkey: <secret key>\n"})})]}),(0,r.jsxs)(i.A,{value:"git",label:"Git Repository",children:[(0,r.jsxs)(n.p,{children:["Create a ",(0,r.jsx)(n.code,{children:"flux-statestore.yaml"})," for giving Flux access to the Git\nRepository. Below is an example of a ",(0,r.jsx)(n.code,{children:"GitRepository"})," configured to talk to\nGitHub repo. For more information on the different configuration and\nauthentication opitions for the ",(0,r.jsx)(n.code,{children:"GitRepository"})," resource, see the ",(0,r.jsx)(n.a,{href:"https://fluxcd.io/flux/components/source/gitrepositories/",children:"FluxCD\ndocs"}),"."]}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:"---\napiVersion: source.toolkit.fluxcd.io/v1\nkind: GitRepository\nmetadata:\n  name: podinfo\n  namespace: default\nspec:\n  interval: 10s\n  url: https://github.com/syntasso/worker-destination\n  ref:\nbranch: main\n  secretRef:\n    name: git-credentials\n---\napiVersion: v1\nkind: Secret\nmetadata:\nname: ssh-credentials\ntype: Opaque\nstringData:\nidentity: |\n  -----BEGIN OPENSSH PRIVATE KEY-----\n  ...\n  -----END OPENSSH PRIVATE KEY-----\nknown_hosts: |\n  github.com ecdsa-sha2-nistp256 AAAA...\n"})})]})]}),"\n",(0,r.jsxs)(n.p,{children:["Install the ",(0,r.jsx)(n.code,{children:"flux-statestore.yaml"})," resources to the worker cluster:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"kubectl apply --context $WORKER -f flux-statestore.yaml\n"})}),"\n",(0,r.jsx)(n.h3,{id:"configuring-flux-to-deploy-resources-from-the-state-store",children:"Configuring Flux to deploy resources from the State Store"}),"\n",(0,r.jsxs)(n.p,{children:["Now that Flux is configured to read from the state store, you need to configure\nFlux to read the resources from the state store and apply them to the cluster.\nThis is done by creating a ",(0,r.jsx)(n.code,{children:"Kustomization"})," resources. Kratix creates two, one\nfor the dependencies (documents from the Promise Dependencies or Promise\nConfigure Workflow) and one for the resources (documents from the Resource\nConfigure Workflow)."]}),"\n",(0,r.jsxs)(n.p,{children:["Create a ",(0,r.jsx)(n.code,{children:"kustomization.yaml"})," file with the following content, substituting the values\nfor the ",(0,r.jsx)(n.code,{children:"sourceRef"})," depending on which type of state store you are using."]}),"\n",(0,r.jsxs)(n.p,{children:["The ",(0,r.jsx)(n.code,{children:"path"})," field should point to the directory in the state store where the\nresources/dependencies are getting written to. By default this is the\n",(0,r.jsx)(n.code,{children:"./<destination-name>/resources"})," and ",(0,r.jsx)(n.code,{children:"./<destination-name>/dependencies"}),"\ndirectories. If you are configuring more advanced setups, you may need to change\nthis path, see ",(0,r.jsx)(n.a,{href:"../reference/destinations/intro",children:"Destination documentation"}),"\nfor more information."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:"---\napiVersion: kustomize.toolkit.fluxcd.io/v1beta1\nkind: Kustomization\nmetadata:\n  name: kratix-workload-resources\n  namespace: <Same namespace as the Bucket/GitRepository>\nspec:\n  interval: 3s\n  prune: true\n  dependsOn:\n    - name: kratix-workload-dependencies\n  sourceRef:\n    kind: <Bucket or GitRepository>\n    name: <Name of Bucket/GitRepository>\n  path: ./<path in state store to destination>/resources\n  validation: client\n---\napiVersion: kustomize.toolkit.fluxcd.io/v1beta1\nkind: Kustomization\nmetadata:\n  name: kratix-workload-dependencies\n  namespace: <Same namespace as the Bucket/GitRepository>\nspec:\n  interval: 8s\n  prune: true\n  sourceRef:\n    kind: <Bucket or GitRepository>\n    name: <Name of Bucket/GitRepository>\n  path: ./<path in state store to destination>/dependencies\n  validation: client\n"})}),"\n",(0,r.jsx)(n.p,{children:"Once filled in with the correct values, apply the resource to the worker\ncluster:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"kubectl apply --context $WORKER -f kustomization.yaml\n"})}),"\n",(0,r.jsx)(n.p,{children:"To check that Flux is correctly syncing resources from the state store to the\ncluster you can check the health of the Kustomization resources:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell-session",children:"kubectl --context $WORKER get kustomizations -A -w\n"})}),"\n",(0,r.jsxs)(n.p,{children:["You should see the ",(0,r.jsx)(n.code,{children:"kratix-workload-resources"})," and ",(0,r.jsx)(n.code,{children:"kratix-workload-dependencies"}),"\nresources eventually get in the ",(0,r.jsx)(n.code,{children:"Ready"})," state."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{children:"NAMESPACE     NAME                           AGE   READY   STATUS\nflux-system   kratix-platform-dependencies   23s   True    Applied revision: sha256:9610eac643b6cadfd7bce31eb26abea051ae02c5f81b52de1d9d2a8458c3e0b8\nflux-system   kratix-platform-resources      23s   True    Applied revision: sha256:9610eac643b6cadfd7bce31eb26abea051ae02c5f81b52de1d9d2a8458c3e0b8\n"})})]})}function p(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(h,{...e})}):h(e)}},8453:(e,n,t)=>{t.d(n,{R:()=>a,x:()=>i});var s=t(6540);const r={},o=s.createContext(r);function a(e){const n=s.useContext(o);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function i(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:a(e.components),s.createElement(o.Provider,{value:n},e.children)}}}]);