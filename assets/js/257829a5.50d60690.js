"use strict";(self.webpackChunkkratix_docs=self.webpackChunkkratix_docs||[]).push([[7248],{1495:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>u,contentTitle:()=>l,default:()=>p,frontMatter:()=>o,metadata:()=>c,toc:()=>d});var n=t(5893),a=t(1151),s=t(4866),i=t(5162);const o={title:"Setup for Air-Gapped Environments",description:"Installing and running Syntasso Kratix Enterprise in air-gapped environments"},l=void 0,c={id:"ske/kratix/air-gapped",title:"Setup for Air-Gapped Environments",description:"Installing and running Syntasso Kratix Enterprise in air-gapped environments",source:"@site/docs/ske/01-kratix/01-air-gapped.mdx",sourceDirName:"ske/01-kratix",slug:"/ske/kratix/air-gapped",permalink:"/ske/kratix/air-gapped",draft:!1,unlisted:!1,editUrl:"https://github.com/syntasso/kratix-docs/tree/main/docs/ske/01-kratix/01-air-gapped.mdx",tags:[],version:"current",sidebarPosition:1,frontMatter:{title:"Setup for Air-Gapped Environments",description:"Installing and running Syntasso Kratix Enterprise in air-gapped environments"},sidebar:"skeSidebar",previous:{title:"Introduction",permalink:"/ske/kratix/intro"},next:{title:"Installation via SKE CLI",permalink:"/ske/kratix/ske-cli-installation"}},u={},d=[{value:"Image Registry",id:"image-registry",level:2},{value:"Providing SKE Operator access to use your image registry",id:"providing-ske-operator-access-to-use-your-image-registry",level:3},{value:"SKE Release Storage",id:"ske-release-storage",level:2},{value:"Providing SKE Operator access to use your release registry",id:"providing-ske-operator-access-to-use-your-release-registry",level:3}];function h(e){const r={a:"a",admonition:"admonition",code:"code",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",ul:"ul",...(0,a.a)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.p,{children:"You may want to manage SKE manifests and images within your own environment either\ndue to air-gapped requirements or other security and redundancy measures."}),"\n",(0,n.jsx)(r.p,{children:"Regardless of the reason, if you want to host your own manifests and/or images you\nwill need to ensure that your Platform cluster has access to the following resources:"}),"\n",(0,n.jsxs)(r.ul,{children:["\n",(0,n.jsx)(r.li,{children:"An image registry containing the SKE Operator and additional SKE integration images"}),"\n",(0,n.jsx)(r.li,{children:"A location where the SKE Release manifests can be found"}),"\n"]}),"\n",(0,n.jsx)(r.p,{children:"Depending on your environment configuration, you will be instructed how to create\nconfiguration and secrets the SKE Operator requires to access both the Image\nRegistry and manifest locations."}),"\n",(0,n.jsx)(r.p,{children:"Manifests include reference to the SKE docker images. Do not directly change the manifest\nto reference your image storage. If you need to change the image locations, you can do so\nby using the image registry configuration fields on the SKE Operator which is documented\nbelow."}),"\n",(0,n.jsx)(r.h2,{id:"image-registry",children:"Image Registry"}),"\n",(0,n.jsx)(r.p,{children:"The SKE Operator and SKE images are stored in the GitHub Container Registry (GHCR)."}),"\n",(0,n.jsx)(r.p,{children:"You must ensure that the following images are mirrored to your own image registry and\ntagged according to the version."}),"\n",(0,n.jsxs)(r.ul,{children:["\n",(0,n.jsx)(r.li,{children:(0,n.jsx)(r.code,{children:"registry.syntasso.io/ske-operator"})}),"\n",(0,n.jsx)(r.li,{children:(0,n.jsx)(r.code,{children:"registry.syntasso.io/ske-platform"})}),"\n",(0,n.jsx)(r.li,{children:(0,n.jsx)(r.code,{children:"registry.syntasso.io/ske-platform-pipeline-adapter"})}),"\n"]}),"\n",(0,n.jsx)(r.admonition,{title:"Platform and Pipeline Adapter tags",type:"warning",children:(0,n.jsxs)(r.p,{children:["The tags for the ",(0,n.jsx)(r.code,{children:"ske-platform"})," and the ",(0,n.jsx)(r.code,{children:"ske-platform-pipeline-adapter"})," images are\nthe same and must match the version of the SKE deployment you wish to install."]})}),"\n",(0,n.jsxs)(r.p,{children:["You can find the available versions of the images in the ",(0,n.jsx)(r.a,{href:"http://syntasso-enterprise-releases.s3-website.eu-west-2.amazonaws.com/",children:"Syntasso Enterprise\nReleases page"}),"."]}),"\n",(0,n.jsx)(r.admonition,{type:"tip",children:(0,n.jsxs)(r.p,{children:["You can use a tool like ",(0,n.jsx)(r.a,{href:"https://github.com/containers/skopeo",children:"Skopeo"})," to simplify the\nprocess of mirroring images."]})}),"\n",(0,n.jsx)(r.h3,{id:"providing-ske-operator-access-to-use-your-image-registry",children:"Providing SKE Operator access to use your image registry"}),"\n",(0,n.jsx)(r.p,{children:"You need provide the SKE Operator with both the credentials and location to read your\nimage registry."}),"\n",(0,n.jsx)(r.p,{children:"To create the Image Registry secret, run:"}),"\n",(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:"language-bash",children:'kubectl create secret docker-registry <PULL SECRET NAME> \\\n    --namespace "kratix-platform-system" \\\n    --docker-username="<YOURUSERNAME>" \\\n    --docker-password="<YOURPASSWORD>" \\\n    --docker-server="<YOUR.REGISTRY.ADDRESS>"\n'})}),"\n",(0,n.jsx)(r.p,{children:"You will need to reference this secret when installing SKE operator which is described in\neach installation guide."}),"\n",(0,n.jsx)(r.h2,{id:"ske-release-storage",children:"SKE Release Storage"}),"\n",(0,n.jsxs)(r.p,{children:["The manifests for SKE deployments are available in the ",(0,n.jsx)(r.a,{href:"http://syntasso-enterprise-releases.s3-website.eu-west-2.amazonaws.com/",children:"Syntasso Enterprise\nReleases page"}),"."]}),"\n",(0,n.jsx)(r.p,{children:"You need to host the manifests in your own S3-compatible bucket or Git repository that's\naccessible from the Platform cluster."}),"\n",(0,n.jsx)(r.p,{children:"The contents must match exactly the structure of the Syntasso Enterprise releases bucket."}),"\n",(0,n.jsxs)(r.p,{children:["In Git, all files/directories starting with ",(0,n.jsx)(r.code,{children:"."})," are ignored."]}),"\n",(0,n.jsx)(r.h3,{id:"providing-ske-operator-access-to-use-your-release-registry",children:"Providing SKE Operator access to use your release registry"}),"\n",(0,n.jsx)(r.p,{children:"To create the secret to access the SKE Release Storage:"}),"\n",(0,n.jsxs)(s.Z,{className:"boxedTabs",groupId:"stateStore",children:[(0,n.jsx)(i.Z,{value:"bucket",label:"Mirroring from Bucket",children:(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:"language-bash",children:'kubectl create secret generic <BUCKET SECRET NAME> \\\n    --namespace kratix-platform-system \\\n    --from-literal=accessKeyID="<YOURACCESSKEY>" \\\n    --from-literal=secretAccessKey="<YOURSECRETKEY>"\n'})})}),(0,n.jsx)(i.Z,{value:"git",label:"Mirroring from Git Repo",children:(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:"language-bash",children:'kubectl create secret generic <GIT SECRET NAME> \\\n    --namespace kratix-platform-system \\\n    --from-literal=username="<USERNAME>" \\\n    --from-literal=password="<PASSWORD>"\n'})})})]}),"\n",(0,n.jsx)(r.p,{children:"You will need to reference this secret when installing SKE operator which is described in\neach installation guide."})]})}function p(e={}){const{wrapper:r}={...(0,a.a)(),...e.components};return r?(0,n.jsx)(r,{...e,children:(0,n.jsx)(h,{...e})}):h(e)}},5162:(e,r,t)=>{t.d(r,{Z:()=>i});t(7294);var n=t(6905);const a={tabItem:"tabItem_Ymn6"};var s=t(5893);function i(e){let{children:r,hidden:t,className:i}=e;return(0,s.jsx)("div",{role:"tabpanel",className:(0,n.Z)(a.tabItem,i),hidden:t,children:r})}},4866:(e,r,t)=>{t.d(r,{Z:()=>E});var n=t(7294),a=t(6905),s=t(2466),i=t(6550),o=t(469),l=t(1980),c=t(7392),u=t(812);function d(e){return n.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,n.isValidElement)(e)&&function(e){const{props:r}=e;return!!r&&"object"==typeof r&&"value"in r}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function h(e){const{values:r,children:t}=e;return(0,n.useMemo)((()=>{const e=r??function(e){return d(e).map((e=>{let{props:{value:r,label:t,attributes:n,default:a}}=e;return{value:r,label:t,attributes:n,default:a}}))}(t);return function(e){const r=(0,c.l)(e,((e,r)=>e.value===r.value));if(r.length>0)throw new Error(`Docusaurus error: Duplicate values "${r.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[r,t])}function p(e){let{value:r,tabValues:t}=e;return t.some((e=>e.value===r))}function m(e){let{queryString:r=!1,groupId:t}=e;const a=(0,i.k6)(),s=function(e){let{queryString:r=!1,groupId:t}=e;if("string"==typeof r)return r;if(!1===r)return null;if(!0===r&&!t)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return t??null}({queryString:r,groupId:t});return[(0,l._X)(s),(0,n.useCallback)((e=>{if(!s)return;const r=new URLSearchParams(a.location.search);r.set(s,e),a.replace({...a.location,search:r.toString()})}),[s,a])]}function g(e){const{defaultValue:r,queryString:t=!1,groupId:a}=e,s=h(e),[i,l]=(0,n.useState)((()=>function(e){let{defaultValue:r,tabValues:t}=e;if(0===t.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(r){if(!p({value:r,tabValues:t}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${r}" but none of its children has the corresponding value. Available values are: ${t.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return r}const n=t.find((e=>e.default))??t[0];if(!n)throw new Error("Unexpected error: 0 tabValues");return n.value}({defaultValue:r,tabValues:s}))),[c,d]=m({queryString:t,groupId:a}),[g,f]=function(e){let{groupId:r}=e;const t=function(e){return e?`docusaurus.tab.${e}`:null}(r),[a,s]=(0,u.Nk)(t);return[a,(0,n.useCallback)((e=>{t&&s.set(e)}),[t,s])]}({groupId:a}),y=(()=>{const e=c??g;return p({value:e,tabValues:s})?e:null})();(0,o.Z)((()=>{y&&l(y)}),[y]);return{selectedValue:i,selectValue:(0,n.useCallback)((e=>{if(!p({value:e,tabValues:s}))throw new Error(`Can't select invalid tab value=${e}`);l(e),d(e),f(e)}),[d,f,s]),tabValues:s}}var f=t(2389);const y={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var b=t(5893);function x(e){let{className:r,block:t,selectedValue:n,selectValue:i,tabValues:o}=e;const l=[],{blockElementScrollPositionUntilNextRender:c}=(0,s.o5)(),u=e=>{const r=e.currentTarget,t=l.indexOf(r),a=o[t].value;a!==n&&(c(r),i(a))},d=e=>{let r=null;switch(e.key){case"Enter":u(e);break;case"ArrowRight":{const t=l.indexOf(e.currentTarget)+1;r=l[t]??l[0];break}case"ArrowLeft":{const t=l.indexOf(e.currentTarget)-1;r=l[t]??l[l.length-1];break}}r?.focus()};return(0,b.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,a.Z)("tabs",{"tabs--block":t},r),children:o.map((e=>{let{value:r,label:t,attributes:s}=e;return(0,b.jsx)("li",{role:"tab",tabIndex:n===r?0:-1,"aria-selected":n===r,ref:e=>l.push(e),onKeyDown:d,onClick:u,...s,className:(0,a.Z)("tabs__item",y.tabItem,s?.className,{"tabs__item--active":n===r}),children:t??r},r)}))})}function v(e){let{lazy:r,children:t,selectedValue:a}=e;const s=(Array.isArray(t)?t:[t]).filter(Boolean);if(r){const e=s.find((e=>e.props.value===a));return e?(0,n.cloneElement)(e,{className:"margin-top--md"}):null}return(0,b.jsx)("div",{className:"margin-top--md",children:s.map(((e,r)=>(0,n.cloneElement)(e,{key:r,hidden:e.props.value!==a})))})}function k(e){const r=g(e);return(0,b.jsxs)("div",{className:(0,a.Z)("tabs-container",y.tabList),children:[(0,b.jsx)(x,{...r,...e}),(0,b.jsx)(v,{...r,...e})]})}function E(e){const r=(0,f.Z)();return(0,b.jsx)(k,{...e,children:d(e.children)},String(r))}},1151:(e,r,t)=>{t.d(r,{Z:()=>o,a:()=>i});var n=t(7294);const a={},s=n.createContext(a);function i(e){const r=n.useContext(s);return n.useMemo((function(){return"function"==typeof e?e(r):{...r,...e}}),[r,e])}function o(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:i(e.components),n.createElement(s.Provider,{value:r},e.children)}}}]);