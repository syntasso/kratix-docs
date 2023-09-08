"use strict";(self.webpackChunkkratix_docs=self.webpackChunkkratix_docs||[]).push([[727],{3905:(e,n,t)=>{t.d(n,{Zo:()=>c,kt:()=>f});var r=t(7294);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var l=r.createContext({}),p=function(e){var n=r.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},c=function(e){var n=p(e.components);return r.createElement(l.Provider,{value:n},e.children)},d="mdxType",m={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},u=r.forwardRef((function(e,n){var t=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),d=p(t),u=a,f=d["".concat(l,".").concat(u)]||d[u]||m[u]||o;return t?r.createElement(f,i(i({ref:n},c),{},{components:t})):r.createElement(f,i({ref:n},c))}));function f(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var o=t.length,i=new Array(o);i[0]=u;var s={};for(var l in n)hasOwnProperty.call(n,l)&&(s[l]=n[l]);s.originalType=e,s[d]="string"==typeof e?e:a,i[1]=s;for(var p=2;p<o;p++)i[p]=t[p];return r.createElement.apply(null,i)}return r.createElement.apply(null,t)}u.displayName="MDXCreateElement"},3706:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>i,default:()=>d,frontMatter:()=>o,metadata:()=>s,toc:()=>p});var r=t(7462),a=(t(7294),t(3905));const o={title:"Updates",sidebar_label:"Updates",description:"Documentation on how updates behave for Promises"},i="Updates",s={unversionedId:"main/reference/promises/updates",id:"main/reference/promises/updates",title:"Updates",description:"Documentation on how updates behave for Promises",source:"@site/docs/main/05-reference/03-promises/03-updates.md",sourceDirName:"main/05-reference/03-promises",slug:"/main/reference/promises/updates",permalink:"/docs/main/reference/promises/updates",draft:!1,editUrl:"https://github.com/syntasso/kratix-docs/tree/main/docs/main/05-reference/03-promises/03-updates.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{title:"Updates",sidebar_label:"Updates",description:"Documentation on how updates behave for Promises"},sidebar:"mainSidebar",previous:{title:"Deleting",permalink:"/docs/main/reference/promises/delete"},next:{title:"Introduction",permalink:"/docs/main/reference/resources/intro"}},l={},p=[{value:"Scheduling",id:"scheduling",level:2},{value:"Example",id:"example",level:3}],c={toc:p};function d(e){let{components:n,...t}=e;return(0,a.kt)("wrapper",(0,r.Z)({},c,t,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"updates"},"Updates"),(0,a.kt)("p",null,"Kratix supports updating Promises with new specifications. Any update to the\nPromise will result in the re-running the Configure Workflows for all resources.\nFor example, if you update the Configure Workflow image version and change\na field in the Dependencies Kratix will roll out the new Dependencies to\nDestinations and re-run all the Configure Workflows\nwith the new image version."),(0,a.kt)("h2",{id:"scheduling"},"Scheduling"),(0,a.kt)("p",null,"When changing the scheduling of a Promise, either by modifying ",(0,a.kt)("inlineCode",{parentName:"p"},".spec.destinationSelectors")," or\nchanging the contents of ",(0,a.kt)("inlineCode",{parentName:"p"},"/kratix/metadata/destination-selectors.yaml")," at the end of a Workflow may result\nin a set of Destinations previously targeted from old version of the Promise no longer\nbeing targeted. When this happens the files written to the Destination ",(0,a.kt)("strong",{parentName:"p"},"are not removed"),", but are\nmarked as ",(0,a.kt)("inlineCode",{parentName:"p"},"orphaned")," by Kratix and are ",(0,a.kt)("strong",{parentName:"p"},"not updated anymore"),"."),(0,a.kt)("h3",{id:"example"},"Example"),(0,a.kt)("p",null,"If you had a Promise with the following scheduling:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"apiVersion: platform.kratix.io/v1alpha1\nkind: Promise\nmetadata:\n  name: promise-name\nspec:\n  destinationSelectors:\n    - matchLabels:\n        environment: dev\n  dependencies:\n    - apiVersion: v1\n      kind: Namespace\n      metadata:\n        name: foo\n")),(0,a.kt)("p",null,"Kratix will schedule the ",(0,a.kt)("inlineCode",{parentName:"p"},"foo")," namespace resource to all destination with the label\n",(0,a.kt)("inlineCode",{parentName:"p"},"environment: dev"),". If you updated the Promise to now instead have the following spec:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"apiVersion: platform.kratix.io/v1alpha1\nkind: Promise\nmetadata:\n  name: promise-name\nspec:\n  destinationSelectors:\n    - matchLabels:\n        environment: prod\n  dependencies:\n    - apiVersion: v1\n      kind: Namespace\n      metadata:\n        name: bar\n")),(0,a.kt)("p",null,"Kratix will schedule the ",(0,a.kt)("inlineCode",{parentName:"p"},"bar")," namespace to all Destinations with the label\n",(0,a.kt)("inlineCode",{parentName:"p"},"environment: dev")," and leave all of ",(0,a.kt)("inlineCode",{parentName:"p"},"environment: dev")," Desintations with the old\n",(0,a.kt)("inlineCode",{parentName:"p"},"foo")," namespace. It's up to the platform team to manually delete these resources\nby deleting all ",(0,a.kt)("inlineCode",{parentName:"p"},"WorkPlacement")," resources marked with the ",(0,a.kt)("inlineCode",{parentName:"p"},"kratix.io/orphaned"),"\nlabel."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"kubectl --context kind-platform -n kratix-platform-system get workplacements.platform.kratix.io --show-labels\nNAME                       AGE   LABELS\nnamespace.dev-cluster-1    40s   kratix.io/orphaned=true,kratix.io/work=namespace\nnamespace.prod-cluster-1   26s   kratix.io/work=namespace\n")))}d.isMDXComponent=!0}}]);