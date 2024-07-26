"use strict";(self.webpackChunkkratix_docs=self.webpackChunkkratix_docs||[]).push([[6466],{2872:(e,s,i)=>{i.r(s),i.d(s,{assets:()=>l,contentTitle:()=>o,default:()=>h,frontMatter:()=>t,metadata:()=>a,toc:()=>c});var n=i(5893),r=i(1151);const t={description:"Documentation for the Promise Release",title:"Versioning",sidebar_label:"Versioning",id:"releases"},o=void 0,a={id:"main/reference/promises/releases",title:"Versioning",description:"Documentation for the Promise Release",source:"@site/docs/main/05-reference/11-promises/05-releases.md",sourceDirName:"main/05-reference/11-promises",slug:"/main/reference/promises/releases",permalink:"/main/reference/promises/releases",draft:!1,unlisted:!1,editUrl:"https://github.com/syntasso/kratix-docs/tree/main/docs/main/05-reference/11-promises/05-releases.md",tags:[],version:"current",sidebarPosition:5,frontMatter:{description:"Documentation for the Promise Release",title:"Versioning",sidebar_label:"Versioning",id:"releases"},sidebar:"mainSidebar",previous:{title:"Workflows",permalink:"/main/reference/promises/workflows"},next:{title:"Workflows",permalink:"/main/reference/workflows"}},l={},c=[{value:"Promise Release",id:"promise-release",level:2},{value:"Source Reference types",id:"source-reference-types",level:2},{value:"HTTP",id:"http",level:3},{value:"Updating Promise Releases",id:"updating-promise-releases",level:2},{value:"Deleting Promise Releases",id:"deleting-promise-releases",level:2}];function d(e){const s={a:"a",code:"code",h2:"h2",h3:"h3",p:"p",pre:"pre",...(0,r.a)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(s.p,{children:"Platform engineers can version their Promise by adding the following label to\ntheir Promise definition:"}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-yaml",children:"apiVersion: platform.kratix.io/v1alpha1\nkind: Promise\nmetadata:\n  name: jenkins\n  labels:\n#highlight-next-line\n    kratix.io/promise-version: v1.1.0\nspec:\n  # Promise spec\n"})}),"\n",(0,n.jsx)(s.p,{children:"A Promise version is an arbitrary number that represents a specific version of a\nPromise. Kratix will, through Promise Releases, ensure the Promise at the\nspecified version is installed in the Platform."}),"\n",(0,n.jsx)(s.h2,{id:"promise-release",children:"Promise Release"}),"\n",(0,n.jsx)(s.p,{children:"A Promise Release represents a Promise with a specific version that will be installed in\nthe Platform. Kratix knows how to fetch the Promise from the specified source and will\nmanage the lifecycle of that Promise."}),"\n",(0,n.jsx)(s.p,{children:"The API for a Promise Release is:"}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-yaml",children:"apiVersion: platform.kratix.io/v1alpha1\nkind: PromiseRelease\nmetadata:\n  name: jenkins-release\nspec:\n  version: # The version of the Promise found at the sourceRef\n  sourceRef:\n    type: # Source type: http, git, etc.\n    # Source specific fields\n"})}),"\n",(0,n.jsxs)(s.p,{children:["The ",(0,n.jsx)(s.code,{children:"spec.version"})," represents the version of the Promise that can be found at\nthe ",(0,n.jsx)(s.code,{children:"sourceRef"}),". If the Promise version label and the Promise Release\n",(0,n.jsx)(s.code,{children:"spec.version"})," do not match, Kratix will not install the Promise."]}),"\n",(0,n.jsxs)(s.p,{children:[(0,n.jsx)(s.code,{children:"spec.version"})," can be left blank. In this case, Kratix will set the Promise\nRelease ",(0,n.jsx)(s.code,{children:"spec.version"})," to the version of the Promise found at the ",(0,n.jsx)(s.code,{children:"sourceRef"})," at\nthe first reconciliation loop."]}),"\n",(0,n.jsx)(s.h2,{id:"source-reference-types",children:"Source Reference types"}),"\n",(0,n.jsxs)(s.p,{children:["Currently, the following ",(0,n.jsx)(s.code,{children:"sourceRef.types"})," are supported:"]}),"\n",(0,n.jsx)(s.h3,{id:"http",children:"HTTP"}),"\n",(0,n.jsxs)(s.p,{children:["The HTTP ",(0,n.jsx)(s.code,{children:"sourceRef.type"})," is used to fetch a Promise from a HTTP endpoint. The\n",(0,n.jsx)(s.code,{children:"sourceRef.url"})," must be set to a valid URL containing a single Promise definition."]}),"\n",(0,n.jsxs)(s.p,{children:["The below example shows a Promise Release using the HTTP ",(0,n.jsx)(s.code,{children:"sourceRef.type"}),":"]}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-yaml",children:"apiVersion: platform.kratix.io/v1alpha1\nkind: PromiseRelease\nmetadata:\n  name: jenkins-release\nspec:\n  version: v1.1.0\n  sourceRef:\n    type: http\n    url: https://raw.githubusercontent.com/syntasso/kratix-marketplace/main/jenkins/promise.yaml\n"})}),"\n",(0,n.jsx)(s.h2,{id:"updating-promise-releases",children:"Updating Promise Releases"}),"\n",(0,n.jsxs)(s.p,{children:["Whenever the ",(0,n.jsx)(s.code,{children:"spec.version"})," of a Promise Release changes, Kratix will\nautomatically fetch the latest Promise definition from the ",(0,n.jsx)(s.code,{children:"sourceRef"})," and\nupdate it in the Platform, as long as the Promise version label matches the\nPromise Release version."]}),"\n",(0,n.jsxs)(s.p,{children:["Note that updating the Promise version in the remote location will not\nautomatically update the Promise in the Platform. The Promise Release\n",(0,n.jsx)(s.code,{children:"spec.version"})," must be updated to trigger the Promise update."]}),"\n",(0,n.jsx)(s.p,{children:"If the Promise is deleted from Platform, but the Promise Release still exists, Kratix\nwill automatically re-install the Promise."}),"\n",(0,n.jsx)(s.h2,{id:"deleting-promise-releases",children:"Deleting Promise Releases"}),"\n",(0,n.jsxs)(s.p,{children:["When a Promise Release is deleted, the underlying Promise is also deleted. This will\ndelete all resources associated with that Promise. See ",(0,n.jsx)(s.a,{href:"../promises/delete",children:"Deleting a Promise"}),"."]})]})}function h(e={}){const{wrapper:s}={...(0,r.a)(),...e.components};return s?(0,n.jsx)(s,{...e,children:(0,n.jsx)(d,{...e})}):d(e)}},1151:(e,s,i)=>{i.d(s,{Z:()=>a,a:()=>o});var n=i(7294);const r={},t=n.createContext(r);function o(e){const s=n.useContext(t);return n.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function a(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:o(e.components),n.createElement(t.Provider,{value:s},e.children)}}}]);