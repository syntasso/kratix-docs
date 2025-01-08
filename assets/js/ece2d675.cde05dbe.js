"use strict";(self.webpackChunkkratix_docs=self.webpackChunkkratix_docs||[]).push([[2308],{88:(e,s,a)=>{a.r(s),a.d(s,{assets:()=>c,contentTitle:()=>l,default:()=>h,frontMatter:()=>i,metadata:()=>n,toc:()=>o});const n=JSON.parse('{"id":"ske/releases/aspects/backstage-generator","title":"Backstage Generator","description":"Release information about the Backstage Generator","source":"@site/docs/ske/50-releases/30-aspects/10-backstage-generator.mdx","sourceDirName":"ske/50-releases/30-aspects","slug":"/ske/releases/aspects/backstage-generator","permalink":"/ske/releases/aspects/backstage-generator","draft":false,"unlisted":false,"editUrl":"https://github.com/syntasso/kratix-docs/tree/main/docs/ske/50-releases/30-aspects/10-backstage-generator.mdx","tags":[],"version":"current","sidebarPosition":10,"frontMatter":{"title":"Backstage Generator","description":"Release information about the Backstage Generator","sidebar_label":"Backstage Generator"},"sidebar":"skeSidebar","previous":{"title":"Aspects","permalink":"/category/aspects"},"next":{"title":"Hashicorp Terraform","permalink":"/ske/releases/aspects/tfstate-finder"}}');var t=a(4848),r=a(8453);const i={title:"Backstage Generator",description:"Release information about the Backstage Generator",sidebar_label:"Backstage Generator"},l=void 0,c={},o=[{value:"Overview",id:"overview",level:2},{value:"Release Notes",id:"release-notes",level:2},{value:"0.12.1(2024-12-27)",id:"v0.12.1",level:3},{value:"Bug Fixes",id:"bug-fixes",level:4},{value:"Maintenance",id:"maintenance",level:3},{value:"0.12.0(2024-12-04)",id:"v0.12.0",level:3},{value:"Features",id:"features",level:4},{value:"0.11.0(2024-10-15)",id:"v0.11.0",level:3},{value:"Features",id:"features-1",level:4},{value:"0.10.1(2024-10-15)",id:"v0.10.1",level:3},{value:"Features",id:"features-2",level:4},{value:"0.10.0(2024-09-19)",id:"01002024-09-19",level:3},{value:"Features",id:"features-3",level:4},{value:"0.9.0(2024-09-18)",id:"0902024-09-18",level:3},{value:"Features",id:"features-4",level:4},{value:"0.8.0(2024-09-13)",id:"0802024-09-13",level:3},{value:"Features",id:"features-5",level:4},{value:"Bug fixes",id:"bug-fixes-1",level:4},{value:"0.7.0(2024-09-07)",id:"0702024-09-07",level:3},{value:"Features",id:"features-6",level:4},{value:"0.6.0 (2024-08-07)",id:"060-2024-08-07",level:3},{value:"Features",id:"features-7",level:4},{value:"Bug Fixes",id:"bug-fixes-2",level:4}];function d(e){const s={a:"a",code:"code",h2:"h2",h3:"h3",h4:"h4",li:"li",p:"p",pre:"pre",ul:"ul",...(0,r.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(s.h2,{id:"overview",children:"Overview"}),"\n",(0,t.jsx)(s.p,{children:"The Backstage Generator Aspect is responsible for generating Backstage entities\nfrom the SKE objects. It is used to generate Backstage entities from the Kratix\nobjects."}),"\n",(0,t.jsx)(s.p,{children:"The Aspect is available as a Container image at:"}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{children:"registry.syntasso.io/ske-backstage-generator:VERSION\n"})}),"\n",(0,t.jsx)(s.p,{children:"Check the release notes below for information on each available version."}),"\n",(0,t.jsx)(s.h2,{id:"release-notes",children:"Release Notes"}),"\n",(0,t.jsxs)(s.h3,{id:"v0.12.1",children:[(0,t.jsx)(s.a,{href:"http://syntasso-enterprise-releases.s3-website.eu-west-2.amazonaws.com/#aspects/ske-backstage-generator/v0.12.1/",children:"0.12.1"}),"(2024-12-27)"]}),"\n",(0,t.jsx)(s.h4,{id:"bug-fixes",children:"Bug Fixes"}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsxs)(s.li,{children:["The aspect will now properly handle ",(0,t.jsx)(s.code,{children:"type: array"})," in the CRD when generating the Backstage Template entity."]}),"\n"]}),"\n",(0,t.jsx)(s.h3,{id:"maintenance",children:"Maintenance"}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsx)(s.li,{children:"Bump dependencies"}),"\n"]}),"\n",(0,t.jsxs)(s.h3,{id:"v0.12.0",children:[(0,t.jsx)(s.a,{href:"http://syntasso-enterprise-releases.s3-website.eu-west-2.amazonaws.com/#aspects/ske-backstage-generator/v0.12.0/",children:"0.12.0"}),"(2024-12-04)"]}),"\n",(0,t.jsx)(s.h4,{id:"features",children:"Features"}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsxs)(s.li,{children:["Support custom scheduling for BackstageComponent.\nSee ",(0,t.jsx)(s.a,{href:"/ske/integrations/backstage/generator#scheduling-backstage-components",children:"Scheduling Backstage Components for more information"})]}),"\n"]}),"\n",(0,t.jsxs)(s.h3,{id:"v0.11.0",children:[(0,t.jsx)(s.a,{href:"http://syntasso-enterprise-releases.s3-website.eu-west-2.amazonaws.com/#aspects/ske-backstage-generator/v0.11.0/",children:"0.11.0"}),"(2024-10-15)"]}),"\n",(0,t.jsx)(s.h4,{id:"features-1",children:"Features"}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsx)(s.li,{children:"Add field validations to templates"}),"\n",(0,t.jsx)(s.li,{children:"Update the BackstageComponent promise to consume a list of backstage documents"}),"\n"]}),"\n",(0,t.jsxs)(s.h3,{id:"v0.10.1",children:[(0,t.jsx)(s.a,{href:"http://syntasso-enterprise-releases.s3-website.eu-west-2.amazonaws.com/#aspects/ske-backstage-generator/v0.10.1/",children:"0.10.1"}),"(2024-10-15)"]}),"\n",(0,t.jsx)(s.h4,{id:"features-2",children:"Features"}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsxs)(s.li,{children:["Generated Components to include ",(0,t.jsx)(s.code,{children:"kratix.io/type"})," annotation."]}),"\n"]}),"\n",(0,t.jsxs)(s.h3,{id:"01002024-09-19",children:[(0,t.jsx)(s.a,{href:"http://syntasso-enterprise-releases.s3-website.eu-west-2.amazonaws.com/#aspects/ske-backstage-generator/v0.10.0/",children:"0.10.0"}),"(2024-09-19)"]}),"\n",(0,t.jsx)(s.h4,{id:"features-3",children:"Features"}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsx)(s.li,{children:"feat: Add support for customising the generated Templates"}),"\n"]}),"\n",(0,t.jsxs)(s.h3,{id:"0902024-09-18",children:[(0,t.jsx)(s.a,{href:"http://syntasso-enterprise-releases.s3-website.eu-west-2.amazonaws.com/#aspects/ske-backstage-generator/v0.9.0/",children:"0.9.0"}),"(2024-09-18)"]}),"\n",(0,t.jsx)(s.h4,{id:"features-4",children:"Features"}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsx)(s.li,{children:"feat: Add support for specifying a promise summary annotation that will cascade to resource components"}),"\n"]}),"\n",(0,t.jsxs)(s.h3,{id:"0802024-09-13",children:[(0,t.jsx)(s.a,{href:"http://syntasso-enterprise-releases.s3-website.eu-west-2.amazonaws.com/#aspects/ske-backstage-generator/v0.8.0/",children:"0.8.0"}),"(2024-09-13)"]}),"\n",(0,t.jsx)(s.h4,{id:"features-5",children:"Features"}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsxs)(s.li,{children:["feat: Add support for specifying ",(0,t.jsx)(s.code,{children:"COMPONENT_DESCRIPTION"}),", ",(0,t.jsx)(s.code,{children:"COMPONENT_NAME"}),", ",(0,t.jsx)(s.code,{children:"COMPONENT_TAGS"})," and ",(0,t.jsx)(s.code,{children:"COMPONENT_TITLE"})]}),"\n"]}),"\n",(0,t.jsx)(s.h4,{id:"bug-fixes-1",children:"Bug fixes"}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsxs)(s.li,{children:["fix: pass through ",(0,t.jsx)(s.code,{children:"COMPONENT_*"})," environment variables along when invoking via\n",(0,t.jsx)(s.code,{children:"BackstageComponent"})," Promise"]}),"\n"]}),"\n",(0,t.jsxs)(s.h3,{id:"0702024-09-07",children:[(0,t.jsx)(s.a,{href:"http://syntasso-enterprise-releases.s3-website.eu-west-2.amazonaws.com/#aspects/ske-backstage-generator/v0.7.0/",children:"0.7.0"}),"(2024-09-07)"]}),"\n",(0,t.jsx)(s.h4,{id:"features-6",children:"Features"}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsxs)(s.li,{children:["feat: Generator can be called across multiple pipelines in a workflow. See\n",(0,t.jsxs)(s.a,{href:"/ske/integrations/backstage/generator#ske-backstage-component-promise",children:[(0,t.jsx)(s.code,{children:"BackstageComponent"})," promise for more information"]})]}),"\n"]}),"\n",(0,t.jsxs)(s.h3,{id:"060-2024-08-07",children:[(0,t.jsx)(s.a,{href:"http://syntasso-enterprise-releases.s3-website.eu-west-2.amazonaws.com/#aspects/ske-backstage-generator/v0.6.0/",children:"0.6.0"})," (2024-08-07)"]}),"\n",(0,t.jsx)(s.h4,{id:"features-7",children:"Features"}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsx)(s.li,{children:"feat: support existing destination selector files"}),"\n"]}),"\n",(0,t.jsx)(s.h4,{id:"bug-fixes-2",children:"Bug Fixes"}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsx)(s.li,{children:"use 'configure' in the template action title"}),"\n"]})]})}function h(e={}){const{wrapper:s}={...(0,r.R)(),...e.components};return s?(0,t.jsx)(s,{...e,children:(0,t.jsx)(d,{...e})}):d(e)}},8453:(e,s,a)=>{a.d(s,{R:()=>i,x:()=>l});var n=a(6540);const t={},r=n.createContext(t);function i(e){const s=n.useContext(r);return n.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function l(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:i(e.components),n.createElement(r.Provider,{value:s},e.children)}}}]);