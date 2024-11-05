"use strict";(self.webpackChunkkratix_docs=self.webpackChunkkratix_docs||[]).push([[6371],{8063:(e,s,t)=>{t.r(s),t.d(s,{assets:()=>o,contentTitle:()=>i,default:()=>h,frontMatter:()=>r,metadata:()=>l,toc:()=>c});var a=t(5893),n=t(1151);const r={title:"Backstage Generator",description:"Release information about the Backstage Generator",sidebar_label:"Backstage Generator"},i=void 0,l={id:"ske/releases/aspects/backstage-generator",title:"Backstage Generator",description:"Release information about the Backstage Generator",source:"@site/docs/ske/50-releases/30-aspects/10-backstage-generator.mdx",sourceDirName:"ske/50-releases/30-aspects",slug:"/ske/releases/aspects/backstage-generator",permalink:"/ske/releases/aspects/backstage-generator",draft:!1,unlisted:!1,editUrl:"https://github.com/syntasso/kratix-docs/tree/main/docs/ske/50-releases/30-aspects/10-backstage-generator.mdx",tags:[],version:"current",sidebarPosition:10,frontMatter:{title:"Backstage Generator",description:"Release information about the Backstage Generator",sidebar_label:"Backstage Generator"},sidebar:"skeSidebar",previous:{title:"Aspects",permalink:"/category/aspects"},next:{title:"Hashicorp Terraform",permalink:"/ske/releases/aspects/tfstate-finder"}},o={},c=[{value:"Overview",id:"overview",level:2},{value:"Release Notes",id:"release-notes",level:2},{value:"0.10.1(2024-10-15)",id:"v0.10.1",level:3},{value:"Features",id:"features",level:4},{value:"0.10.0(2024-09-19)",id:"01002024-09-19",level:3},{value:"Features",id:"features-1",level:4},{value:"0.9.0(2024-09-18)",id:"0902024-09-18",level:3},{value:"Features",id:"features-2",level:4},{value:"0.8.0(2024-09-13)",id:"0802024-09-13",level:3},{value:"Features",id:"features-3",level:4},{value:"Bug fixes",id:"bug-fixes",level:4},{value:"0.7.0(2024-09-07)",id:"0702024-09-07",level:3},{value:"Features",id:"features-4",level:4},{value:"0.6.0 (2024-08-07)",id:"060-2024-08-07",level:3},{value:"Features",id:"features-5",level:4},{value:"Bug Fixes",id:"bug-fixes-1",level:4}];function d(e){const s={a:"a",code:"code",h2:"h2",h3:"h3",h4:"h4",li:"li",p:"p",pre:"pre",ul:"ul",...(0,n.a)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(s.h2,{id:"overview",children:"Overview"}),"\n",(0,a.jsx)(s.p,{children:"The Backstage Generator Aspect is responsible for generating Backstage entities\nfrom the SKE objects. It is used to generate Backstage entities from the Kratix\nobjects."}),"\n",(0,a.jsx)(s.p,{children:"The Aspect is available as a Container image at:"}),"\n",(0,a.jsx)(s.pre,{children:(0,a.jsx)(s.code,{children:"registry.syntasso.io/ske-backstage-generator:VERSION\n"})}),"\n",(0,a.jsx)(s.p,{children:"Check the release notes below for information on each available version."}),"\n",(0,a.jsx)(s.h2,{id:"release-notes",children:"Release Notes"}),"\n",(0,a.jsxs)(s.h3,{id:"v0.10.1",children:[(0,a.jsx)(s.a,{href:"http://syntasso-enterprise-releases.s3-website.eu-west-2.amazonaws.com/#aspects/ske-backstage-generator/v0.10.1/",children:"0.10.1"}),"(2024-10-15)"]}),"\n",(0,a.jsx)(s.h4,{id:"features",children:"Features"}),"\n",(0,a.jsxs)(s.ul,{children:["\n",(0,a.jsxs)(s.li,{children:["Generated Components to include ",(0,a.jsx)(s.code,{children:"kratix.io/type"})," annotation."]}),"\n"]}),"\n",(0,a.jsxs)(s.h3,{id:"01002024-09-19",children:[(0,a.jsx)(s.a,{href:"http://syntasso-enterprise-releases.s3-website.eu-west-2.amazonaws.com/#aspects/ske-backstage-generator/v0.10.0/",children:"0.10.0"}),"(2024-09-19)"]}),"\n",(0,a.jsx)(s.h4,{id:"features-1",children:"Features"}),"\n",(0,a.jsxs)(s.ul,{children:["\n",(0,a.jsx)(s.li,{children:"feat: Add support for customising the generated Templates"}),"\n"]}),"\n",(0,a.jsxs)(s.h3,{id:"0902024-09-18",children:[(0,a.jsx)(s.a,{href:"http://syntasso-enterprise-releases.s3-website.eu-west-2.amazonaws.com/#aspects/ske-backstage-generator/v0.9.0/",children:"0.9.0"}),"(2024-09-18)"]}),"\n",(0,a.jsx)(s.h4,{id:"features-2",children:"Features"}),"\n",(0,a.jsxs)(s.ul,{children:["\n",(0,a.jsx)(s.li,{children:"feat: Add support for specifying a promise summary annotation that will cascade to resource components"}),"\n"]}),"\n",(0,a.jsxs)(s.h3,{id:"0802024-09-13",children:[(0,a.jsx)(s.a,{href:"http://syntasso-enterprise-releases.s3-website.eu-west-2.amazonaws.com/#aspects/ske-backstage-generator/v0.8.0/",children:"0.8.0"}),"(2024-09-13)"]}),"\n",(0,a.jsx)(s.h4,{id:"features-3",children:"Features"}),"\n",(0,a.jsxs)(s.ul,{children:["\n",(0,a.jsxs)(s.li,{children:["feat: Add support for specifying ",(0,a.jsx)(s.code,{children:"COMPONENT_DESCRIPTION"}),", ",(0,a.jsx)(s.code,{children:"COMPONENT_NAME"}),", ",(0,a.jsx)(s.code,{children:"COMPONENT_TAGS"})," and ",(0,a.jsx)(s.code,{children:"COMPONENT_TITLE"})]}),"\n"]}),"\n",(0,a.jsx)(s.h4,{id:"bug-fixes",children:"Bug fixes"}),"\n",(0,a.jsxs)(s.ul,{children:["\n",(0,a.jsxs)(s.li,{children:["fix: pass through ",(0,a.jsx)(s.code,{children:"COMPONENT_*"})," environment variables along when invoking via\n",(0,a.jsx)(s.code,{children:"BackstageComponent"})," Promise"]}),"\n"]}),"\n",(0,a.jsxs)(s.h3,{id:"0702024-09-07",children:[(0,a.jsx)(s.a,{href:"http://syntasso-enterprise-releases.s3-website.eu-west-2.amazonaws.com/#aspects/ske-backstage-generator/v0.7.0/",children:"0.7.0"}),"(2024-09-07)"]}),"\n",(0,a.jsx)(s.h4,{id:"features-4",children:"Features"}),"\n",(0,a.jsxs)(s.ul,{children:["\n",(0,a.jsxs)(s.li,{children:["feat: Generator can be called across multiple pipelines in a workflow. See\n",(0,a.jsxs)(s.a,{href:"/ske/integrations/backstage/generator#ske-backstage-component-promise",children:[(0,a.jsx)(s.code,{children:"BackstageComponent"})," promise for more information"]})]}),"\n"]}),"\n",(0,a.jsxs)(s.h3,{id:"060-2024-08-07",children:[(0,a.jsx)(s.a,{href:"http://syntasso-enterprise-releases.s3-website.eu-west-2.amazonaws.com/#aspects/ske-backstage-generator/v0.6.0/",children:"0.6.0"})," (2024-08-07)"]}),"\n",(0,a.jsx)(s.h4,{id:"features-5",children:"Features"}),"\n",(0,a.jsxs)(s.ul,{children:["\n",(0,a.jsx)(s.li,{children:"feat: support existing destination selector files"}),"\n"]}),"\n",(0,a.jsx)(s.h4,{id:"bug-fixes-1",children:"Bug Fixes"}),"\n",(0,a.jsxs)(s.ul,{children:["\n",(0,a.jsx)(s.li,{children:"use 'configure' in the template action title"}),"\n"]})]})}function h(e={}){const{wrapper:s}={...(0,n.a)(),...e.components};return s?(0,a.jsx)(s,{...e,children:(0,a.jsx)(d,{...e})}):d(e)}},1151:(e,s,t)=>{t.d(s,{Z:()=>l,a:()=>i});var a=t(7294);const n={},r=a.createContext(n);function i(e){const s=a.useContext(r);return a.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function l(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:i(e.components),a.createElement(r.Provider,{value:s},e.children)}}}]);