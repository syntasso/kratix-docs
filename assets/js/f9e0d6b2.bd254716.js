"use strict";(self.webpackChunkkratix_docs=self.webpackChunkkratix_docs||[]).push([[1529],{3905:(e,t,r)=>{r.d(t,{Zo:()=>u,kt:()=>d});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function s(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var c=n.createContext({}),l=function(e){var t=n.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):s(s({},t),e)),r},u=function(e){var t=l(e.components);return n.createElement(c.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,c=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),m=l(r),d=a,f=m["".concat(c,".").concat(d)]||m[d]||p[d]||o;return r?n.createElement(f,s(s({ref:t},u),{},{components:r})):n.createElement(f,s({ref:t},u))}));function d(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,s=new Array(o);s[0]=m;var i={};for(var c in t)hasOwnProperty.call(t,c)&&(i[c]=t[c]);i.originalType=e,i.mdxType="string"==typeof e?e:a,s[1]=i;for(var l=2;l<o;l++)s[l]=r[l];return n.createElement.apply(null,s)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},4223:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>c,contentTitle:()=>s,default:()=>p,frontMatter:()=>o,metadata:()=>i,toc:()=>l});var n=r(7462),a=(r(7294),r(3905));const o={description:"Learn more about the Cluster document",title:"Clusters"},s=void 0,i={unversionedId:"main/reference/clusters/clusters",id:"main/reference/clusters/clusters",title:"Clusters",description:"Learn more about the Cluster document",source:"@site/docs/main/06-reference/01-clusters/01-clusters.md",sourceDirName:"main/06-reference/01-clusters",slug:"/main/reference/clusters/",permalink:"/docs/main/reference/clusters/",draft:!1,editUrl:"https://github.com/syntasso/kratix-docs/tree/main/docs/main/06-reference/01-clusters/01-clusters.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{description:"Learn more about the Cluster document",title:"Clusters"},sidebar:"mainSidebar",previous:{title:"Reference",permalink:"/docs/category/reference"},next:{title:"Promises",permalink:"/docs/category/promises"}},c={},l=[],u={toc:l};function p(e){let{components:t,...r}=e;return(0,a.kt)("wrapper",(0,n.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"This page contains documentation for the Kratix Cluster. The Cluster Resource is a\nrepresentation of a system where workloads can be scheduled to, which in turn are usually\nKubernetes clusters. See below for the API documentation:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: platform.kratix.io/v1alpha1\nkind: Cluster\nmetadata:\n  # The Cluster name is an arbitrary name that represent the cluster in the platform\n  name: cluster-name\n  # The Cluster labels are arbitrary key/value pairs that can be used for scheduling\n  #   the installation of Promises and the workloads\n  labels:\n    environment: dev\nspec:\n  # Cluster identifier: required\n  id: cluster-id\n  # Path to be used by Kratix to create the buckets\n  bucketPath: bucket-path\n")),(0,a.kt)("p",null,"When a new Cluster is registered in the Platform cluster (i.e., a new Cluster Resource is\ncreated), Kratix will create a pair of buckets: one for ",(0,a.kt)("inlineCode",{parentName:"p"},"resources"),", one for ",(0,a.kt)("inlineCode",{parentName:"p"},"crds"),". The\nfull path of the buckets will be:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"<spec.bucketPath>-resources")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"<spec.bucketPath>-crds"))))}p.isMDXComponent=!0}}]);