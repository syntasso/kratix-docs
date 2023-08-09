"use strict";(self.webpackChunkkratix_docs=self.webpackChunkkratix_docs||[]).push([[3348],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>f});var r=n(7294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var l=r.createContext({}),c=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},p=function(e){var t=c(e.components);return r.createElement(l.Provider,{value:t},e.children)},u="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,a=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),u=c(n),d=i,f=u["".concat(l,".").concat(d)]||u[d]||m[d]||a;return n?r.createElement(f,o(o({ref:t},p),{},{components:n})):r.createElement(f,o({ref:t},p))}));function f(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=n.length,o=new Array(a);o[0]=d;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[u]="string"==typeof e?e:i,o[1]=s;for(var c=2;c<a;c++)o[c]=n[c];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},349:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>o,default:()=>u,frontMatter:()=>a,metadata:()=>s,toc:()=>c});var r=n(7462),i=(n(7294),n(3905));const a={title:"Promise Custom Resource",sidebar_label:"Introduction",description:"Documentation for the Kratix Promise Custom Resource",id:"intro"},o="Promises",s={unversionedId:"main/reference/promises/intro",id:"main/reference/promises/intro",title:"Promise Custom Resource",description:"Documentation for the Kratix Promise Custom Resource",source:"@site/docs/main/05-reference/03-promises/01-promises.md",sourceDirName:"main/05-reference/03-promises",slug:"/main/reference/promises/intro",permalink:"/docs/main/reference/promises/intro",draft:!1,editUrl:"https://github.com/syntasso/kratix-docs/tree/main/docs/main/05-reference/03-promises/01-promises.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{title:"Promise Custom Resource",sidebar_label:"Introduction",description:"Documentation for the Kratix Promise Custom Resource",id:"intro"},sidebar:"mainSidebar",previous:{title:"Destinations",permalink:"/docs/main/reference/destinations/intro"},next:{title:"Deleting",permalink:"/docs/main/reference/promises/delete"}},l={},c=[{value:"Use Case",id:"use-case",level:2},{value:"Benefits",id:"benefits",level:2},{value:"Promise API",id:"promise-api",level:2}],p={toc:c};function u(e){let{components:t,...n}=e;return(0,i.kt)("wrapper",(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"promises"},"Promises"),(0,i.kt)("p",null,"Conceptually, Kratix Promises are the building blocks that enable teams to design\nplatforms that specifically meet their customer needs."),(0,i.kt)("p",null,"Technically, a Promise is a YAML document that defines a contract between the Platform and its users."),(0,i.kt)("h2",{id:"use-case"},"Use Case"),(0,i.kt)("p",null,"Consider the task of setting up development environments for application teams.\nThis task is usually repetitive and requires many cookie-cutter steps. It may\ninvolve wiring up Git repos, spinning up a CI/CD server, creating a PaaS to run\nthe applications, instructing CI/CD to listen to the Git repos and push\nsuccessful builds into the PaaS, and finally wiring applications to their\nrequired data services."),(0,i.kt)("p",null,"A Promise can encapsulate all the required steps and handle the toil of running\nthose low-level tasks. It can be designed as a single Promise that does it all,\nor it can be a collection of Promises that, combined, deliver the desired\nfunctionality."),(0,i.kt)("h2",{id:"benefits"},"Benefits"),(0,i.kt)("p",null,"Promises:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"enable you to build your platform incrementally and in response to the needs\nof your users."),(0,i.kt)("li",{parentName:"ul"},"codify the contract between platform teams and application teams for the\ndelivery of a specific service, e.g. a database, an identity service, a\nsupply chain, or a complete development pipeline of patterns and tools."),(0,i.kt)("li",{parentName:"ul"},"are easy to build, deploy, and update."),(0,i.kt)("li",{parentName:"ul"},"are shareable and reusable between platforms, teams, business units, and other\norganisations."),(0,i.kt)("li",{parentName:"ul"},"add up to a frictionless experience when platform users want to create\nservices that they need to deliver value.")),(0,i.kt)("p",null,"To see Promises in-action, check out the guides: ",(0,i.kt)("a",{parentName:"p",href:"../../guides/installing-a-promise"},"Installing a Promise")," and ",(0,i.kt)("a",{parentName:"p",href:"../../guides/writing-a-promise"},"Writing a Promise"),"."),(0,i.kt)("h2",{id:"promise-api"},"Promise API"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: platform.kratix.io/v1alpha1\nkind: Promise\nmetadata:\n  # Name of the Promise; what the platform team will manage in the Platform cluster\n  name: promise-name\nspec:\n  # Check the Scheduling docs for details\n  scheduling:\n    - target:\n        matchLabels:\n          # Arbitrary key/value pairs that will be used for scheduling\n          key: value\n\n  # Array of Kubernetes resources to be scheduled to matching Workers\n  dependencies:\n    - apiVersion: apps/v1\n      kind: Deployment\n      metadata:\n        name: service-operator\n    -  #...\n    -  #...\n\n  # API that a Platform User will use to request an Resource from this Promise\n  api:\n    apiVersion: apiextensions.k8s.io/v1\n    kind: CustomResourceDefinition\n    # ...\n\n  # Ordered set of tasks to run during a Promise and Resource lifecycle\n  workflows:\n    # Tasks to be run only during the Resource lifecycle\n    resource:\n      # Tasks to be run only on creation, maintenance, or update of a Resource\n      configure:\n        # A Kratix provided Pipeline that runs an ordered set of OCI compliant images\n        - apiVersion: platform.kratix.io/v1alpha1\n          kind: Pipeline\n          metadata:\n            name: configure-resource\n          spec:\n            containers:\n              - name: pipeline-stage-0\n                image: myorg/pipeline-image-1 # Kubernetes defaults to docker.io\n              - name: pipeline-stage-1\n                image: ghcr.io/myorg/pipeline-image-2\n              -  #...\n")))}u.isMDXComponent=!0}}]);