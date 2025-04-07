"use strict";(self.webpackChunkkratix_docs=self.webpackChunkkratix_docs||[]).push([[2669],{7380:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>o,default:()=>p,frontMatter:()=>r,metadata:()=>a,toc:()=>l});const a=JSON.parse('{"id":"ske/integrations/backstage/yaml-file-format","title":"YAML File Format","description":"Reference documentation for what the SKE Plugins expect from the Backstage Entities","source":"@site/docs/ske/10-integrations/10-backstage/05-yaml-file-format.mdx","sourceDirName":"ske/10-integrations/10-backstage","slug":"/ske/integrations/backstage/yaml-file-format","permalink":"/ske/integrations/backstage/yaml-file-format","draft":false,"unlisted":false,"editUrl":"https://github.com/syntasso/kratix-docs/tree/main/docs/ske/10-integrations/10-backstage/05-yaml-file-format.mdx","tags":[],"version":"current","sidebarPosition":5,"frontMatter":{"title":"YAML File Format","description":"Reference documentation for what the SKE Plugins expect from the Backstage Entities","sidebar_label":"YAML File Format"},"sidebar":"skeSidebar","previous":{"title":"SKE Component Promise","permalink":"/ske/integrations/backstage/generator-promise"},"next":{"title":"Releases","permalink":"/ske/releases/"}}');var i=n(4848),s=n(8453);const r={title:"YAML File Format",description:"Reference documentation for what the SKE Plugins expect from the Backstage Entities",sidebar_label:"YAML File Format"},o=void 0,c={},l=[{value:"Promise Template",id:"promise-template",level:3},{value:"The Kratix Catalog Entities",id:"the-kratix-catalog-entities",level:2},{value:"Kratix Promise Entity",id:"kratix-promise-entity",level:3},{value:"Kratix Resource Entity",id:"kratix-resource-entity",level:3}];function m(e){const t={a:"a",code:"code",h2:"h2",h3:"h3",p:"p",pre:"pre",...(0,s.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(t.h3,{id:"promise-template",children:"Promise Template"}),"\n",(0,i.jsxs)(t.p,{children:["The ",(0,i.jsx)(t.code,{children:"ske:configure-resource"})," action works by pushing a generated Resource Request manifest\nto a Git repository, and can be used in a Template to make these requests from within\nBackstage. The Template allows all Promise API fields to be filled in within Backstage."]}),"\n",(0,i.jsx)(t.p,{children:"An outline of a Template for generating Jenkins Resource Requests is as follows:"}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-yaml",children:"apiVersion: scaffolder.backstage.io/v1beta3\nkind: Template\nmetadata:\n  description: Jenkins as a Service\n  name: jenkins-promise-template\n  title: Jenkins\nspec:\n  lifecycle: experimental\n  owner: kratix-platform\n  parameters:\n    - properties:\n        objname:\n          description: Name for the request in the platform cluster\n          title: Name\n          type: string\n        objnamespace:\n          description: Namespace for the request in the platform cluster\n          title: Namespace\n          type: string\n      required:\n        - objname\n        - objnamespace\n      title: Jenkins Instance Metadata\n  # other properties\n  steps:\n    - action: ske:configure-resource\n      id: ske-configure-resource\n      input:\n        manifest: |\n          apiVersion: marketplace.kratix.io/v1alpha1\n          kind: jenkins\n          metadata:\n            name: ${{ parameters.objname }}\n            namespace: ${{ parameters.objnamespace}}\n          spec: ${{ parameters.spec | dump }}\n      name: Create a Jenkins\n  type: kratix-resource\n"})}),"\n",(0,i.jsx)(t.h2,{id:"the-kratix-catalog-entities",children:"The Kratix Catalog Entities"}),"\n",(0,i.jsx)(t.p,{children:"The front-end plugin provides specific entity pages for both Kratix Promises and Kratix\nResources. To get all features of the plugin, your Components must include a few fields\nand annotations so that the front-end plugin can render the right data."}),"\n",(0,i.jsx)(t.h3,{id:"kratix-promise-entity",children:"Kratix Promise Entity"}),"\n",(0,i.jsxs)(t.p,{children:["Kratix Promises should be created with a set of ",(0,i.jsx)(t.code,{children:"kratix.io/"})," annotations which are\nused to convey metadata to the front-end plugin. The name, title and description\nshould also be set to appropriate values."]}),"\n",(0,i.jsx)(t.p,{children:"For example, considering a Promise that provides a Jenkins resource, the Component\ndefinition would look like this:"}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-yaml",children:'apiVersion: backstage.io/v1alpha1\nkind: Component\nmetadata:\n  name: jenkins-promise # Name of the Promise Component\n  title: Jenkins Promise # Title to be displayed in Backstage\n  description: Jenkins as a Service # Description of the Promise\n  tags:\n    - kratix\n  annotations:\n    backstage.io/kubernetes-id: cicd\n    kratix.io/type: promise # This tells the front-end plugin that this is a Promise\n    kratix.io/promise-name: cicd # The Promise\'s metadata.name\n    kratix.io/api-name: Jenkins # The Kind of the resource provided by the Promise\n    kratix.io/api-group: marketplace.kratix.io # The Group of the resource provided by the Promise\n    kratix.io/status: |\n      {"message": "Some Status Message"}\n    kratix.io/backstage-promise-template: jenkins-promise-template # metadata.name of the Backstage Template used to create the resource\nspec:\n  lifecycle: production\n  owner: kratix-platform\n  type: kratix-promise # Alternatively, you can set this to `kratix-promise` to indicate that this is a Promise\n  # remainder of the component spec...\n'})}),"\n",(0,i.jsx)(t.h3,{id:"kratix-resource-entity",children:"Kratix Resource Entity"}),"\n",(0,i.jsxs)(t.p,{children:["Kratix Resources should be created with a set of ",(0,i.jsx)(t.code,{children:"kratix.io/"})," annotations which\nare used to convey metadata to the front-end plugin. The name, title and\ndescription should also be set to appropriate values."]}),"\n",(0,i.jsxs)(t.p,{children:["The relationship between the Resource and the Promise can be displayed in the front-end\nplugin by adding a ",(0,i.jsxs)(t.a,{href:"https://backstage.io/docs/features/software-catalog/well-known-relations/#dependson-and-dependencyof",children:[(0,i.jsx)(t.code,{children:"dependsOn"})," relation"]}),"\nto the spec, which references the Promise Component via an\n",(0,i.jsx)(t.a,{href:"https://backstage.io/docs/features/software-catalog/references#string-references",children:"entity reference"}),"."]}),"\n",(0,i.jsx)(t.p,{children:"For example, considering a Jenkins resource requested on the Promise shown above, the\nComponent definition for the Jenkins resource would look like this:"}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-yaml",children:'apiVersion: backstage.io/v1alpha1\nkind: Component\nmetadata:\n  name: my-request-jenkins # Name of the Resource Component\n  title: "my-request Jenkins" # Title to be displayed in Backstage\n  description: "my-request Jenkins created via cicd Promise" # Description of the resource\n  annotations:\n    backstage.io/kubernetes-label-selector: cicd-cr=my-request\n    kratix.io/type: resource # This tells the front-end plugin that this is a Kratix Resource\n    kratix.io/status: |\n      {"message": "Some Status Message"}\n    kratix.io/promise-name: cicd # The Jenkins Promise\'s metadata.name\n    kratix.io/group: "marketplace.example.io" # Promise API Group\n    kratix.io/version: "v1alpha1" # Promise API Version\n    kratix.io/kind: Jenkins # Promise API Kind\n    kratix.io/name: my-jenkins # Name of the Resource\n    kratix.io/namespace: default # Namespace of the Resource\n    kratix.io/backstage-promise-template: jenkins-promise-template # metadata.name of the Backstage Template used to create the resource\nspec:\n  type: kratix-resource # Alternatively, you can set this to `kratix-resource` to indicate that this is a Kratix Resource\n  lifecycle: production\n  owner: kratix-platform\n  dependsOn:\n    - component:default/jenkins-promise\n  # remainder of the component spec...\n'})})]})}function p(e={}){const{wrapper:t}={...(0,s.R)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(m,{...e})}):m(e)}},8453:(e,t,n)=>{n.d(t,{R:()=>r,x:()=>o});var a=n(6540);const i={},s=a.createContext(i);function r(e){const t=a.useContext(s);return a.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function o(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:r(e.components),a.createElement(s.Provider,{value:t},e.children)}}}]);