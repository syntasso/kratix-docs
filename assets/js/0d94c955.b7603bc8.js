"use strict";(self.webpackChunkkratix_docs=self.webpackChunkkratix_docs||[]).push([[4452],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>f});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),c=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},p=function(e){var t=c(e.components);return r.createElement(l.Provider,{value:t},e.children)},d="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),d=c(n),m=a,f=d["".concat(l,".").concat(m)]||d[m]||u[m]||o;return n?r.createElement(f,i(i({ref:t},p),{},{components:n})):r.createElement(f,i({ref:t},p))}));function f(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=m;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[d]="string"==typeof e?e:a,i[1]=s;for(var c=2;c<o;c++)i[c]=n[c];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},5818:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>d,frontMatter:()=>o,metadata:()=>s,toc:()=>c});var r=n(7462),a=(n(7294),n(3905));const o={description:"Documentation for the Kratix Destination Custom Resource",title:"Destination Custom Resource",sidebar_label:"Destinations",id:"intro"},i=void 0,s={unversionedId:"main/reference/destinations/intro",id:"main/reference/destinations/intro",title:"Destination Custom Resource",description:"Documentation for the Kratix Destination Custom Resource",source:"@site/docs/main/05-reference/02-destinations/01-destinations.md",sourceDirName:"main/05-reference/02-destinations",slug:"/main/reference/destinations/intro",permalink:"/docs/main/reference/destinations/intro",draft:!1,editUrl:"https://github.com/syntasso/kratix-docs/tree/main/docs/main/05-reference/02-destinations/01-destinations.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{description:"Documentation for the Kratix Destination Custom Resource",title:"Destination Custom Resource",sidebar_label:"Destinations",id:"intro"},sidebar:"mainSidebar",previous:{title:"Deployment topology",permalink:"/docs/main/reference/deployment-topology/"},next:{title:"Introduction",permalink:"/docs/main/reference/promises/intro"}},l={},c=[],p={toc:c};function d(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"The Kratix Destination Custom Resource Definition (CRD) is the representation of a system where workloads\ncan be scheduled to. These can be Kubernetes clusters or any other infrastructure that can be deployed to using GitOps.\nSee below for the API documentation:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: platform.kratix.io/v1alpha1\nkind: Destination\nmetadata:\n  # The Destination name is an arbitrary name that represent where workloads will be scheduled by the platform\n  name: destination-name\n  # The Destination labels are arbitrary key/value pairs that can be used for scheduling\n  #   the installation of Promises and the Resources\n  labels:\n    environment: dev\nspec:\n  # Destination identifier: optional, appended path to be used within the State Store\n  path: path/in/statestore\n  # Required\n  stateStoreRef:\n    # The name of the State Store to use: required\n    name: default\n    # The kind of the State Store to use: required, valid options: GitStateStore, BucketStateStore\n    kind: BucketStateStore\n")),(0,a.kt)("p",null,"When a new Destination is registered in the Platform cluster (i.e., a new Destination resource is\ncreated), Kratix will write to two paths in the ",(0,a.kt)("a",{parentName:"p",href:"/docs/main/reference/statestore/intro"},"State Store"),":\none for ",(0,a.kt)("inlineCode",{parentName:"p"},"resources"),", one for ",(0,a.kt)("inlineCode",{parentName:"p"},"crds"),". The path within the ",(0,a.kt)("inlineCode",{parentName:"p"},"State Store")," follows the following pattern:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"statestore.Spec.Path/\n    destination.Spec.Path/\n        destination.Metadata.Namespace/\n            destination.Metadata.Name/\n")),(0,a.kt)("p",null,"For example:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-yaml"},"---\napiVersion: platform.kratix.io/v1alpha1\nkind: BucketStateStore\nmetadata:\n  name: default\n  namespace: default\nspec:\n  path: destinations\n  endpoint: s3.amazonaws.com\n  insecure: true\n  bucketName: kratix\n  secretRef:\n    name: aws-credentials\n---\napiVersion: platform.kratix.io/v1alpha1\nkind: Destination\nmetadata:\n  name: worker-1\n  labels:\n    environment: dev\nspec:\n  path: dev\n  stateStoreRef:\n    name: default\n    kind: BucketStateStore\n")),(0,a.kt)("p",null,"The above configuration would result in the following paths being written to:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"destinations/dev/default/worker-1/crds/")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"destinations/dev/default/worker-1/resources/"))),(0,a.kt)("br",null),(0,a.kt)("p",null,"The paths should be used when setting up the workers to pull\ndown from the ",(0,a.kt)("inlineCode",{parentName:"p"},"StateStore"),"."),(0,a.kt)("admonition",{type:"info"},(0,a.kt)("p",{parentName:"admonition"},"The reason for two directories is that GitOps applies require any prerequisite workloads like CRDs to be ready before any dependent workloads are applied. By dividing the two directories you can configure your GitOps tool to manage this for you.")))}d.isMDXComponent=!0}}]);