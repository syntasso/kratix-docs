"use strict";(self.webpackChunkkratix_docs=self.webpackChunkkratix_docs||[]).push([[6180],{5906:(e,s,t)=>{t.r(s),t.d(s,{assets:()=>o,contentTitle:()=>a,default:()=>h,frontMatter:()=>i,metadata:()=>l,toc:()=>c});var r=t(5893),n=t(1151);const i={title:"Hashicorp Terraform",description:"Release information about the Hashcorp Terraform State Finder aspect",sidebar_label:"Hashicorp Terraform"},a=void 0,l={id:"ske/releases/aspects/tfstate-finder",title:"Hashicorp Terraform",description:"Release information about the Hashcorp Terraform State Finder aspect",source:"@site/docs/ske/50-releases/30-aspects/20-tfstate-finder.mdx",sourceDirName:"ske/50-releases/30-aspects",slug:"/ske/releases/aspects/tfstate-finder",permalink:"/ske/releases/aspects/tfstate-finder",draft:!1,unlisted:!1,editUrl:"https://github.com/syntasso/kratix-docs/tree/main/docs/ske/50-releases/30-aspects/20-tfstate-finder.mdx",tags:[],version:"current",sidebarPosition:20,frontMatter:{title:"Hashicorp Terraform",description:"Release information about the Hashcorp Terraform State Finder aspect",sidebar_label:"Hashicorp Terraform"},sidebar:"skeSidebar",previous:{title:"Backstage Generator",permalink:"/ske/releases/aspects/backstage-generator"},next:{title:"Support Policy",permalink:"/ske/support"}},o={},c=[{value:"Overview",id:"overview",level:2},{value:"Release Notes",id:"release-notes",level:2},{value:"0.4.0 (2024-08-07)",id:"040-2024-08-07",level:3},{value:"Features",id:"features",level:4},{value:"Bug Fixes",id:"bug-fixes",level:4},{value:"0.3.0 (2024-08-06)",id:"030-2024-08-06",level:3},{value:"Features",id:"features-1",level:4},{value:"Bug Fixes",id:"bug-fixes-1",level:4},{value:"0.2.0 (2024-07-06)",id:"020-2024-07-06",level:3},{value:"Features",id:"features-2",level:4}];function d(e){const s={a:"a",code:"code",h2:"h2",h3:"h3",h4:"h4",li:"li",p:"p",pre:"pre",ul:"ul",...(0,n.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(s.h2,{id:"overview",children:"Overview"}),"\n",(0,r.jsx)(s.p,{children:"The Hashicorp Terraform State Finder aspect is responsible for finding the\nTerraform state of a given resource. It is used to find the Terraform state of a\ngiven resource and write it to the status of the object."}),"\n",(0,r.jsx)(s.p,{children:"The Aspect is available as a Container image at:"}),"\n",(0,r.jsx)(s.pre,{children:(0,r.jsx)(s.code,{children:"ghcr.io/syntasso/ske-tfstate-finder:VERSION\n"})}),"\n",(0,r.jsx)(s.p,{children:"Check the release notes below for information on each available version."}),"\n",(0,r.jsx)(s.h2,{id:"release-notes",children:"Release Notes"}),"\n",(0,r.jsxs)(s.h3,{id:"040-2024-08-07",children:[(0,r.jsx)(s.a,{href:"http://syntasso-enterprise-releases.s3-website.eu-west-2.amazonaws.com/#aspects/ske-tfstate-finder/v0.4.0/",children:"0.4.0"})," (2024-08-07)"]}),"\n",(0,r.jsx)(s.h4,{id:"features",children:"Features"}),"\n",(0,r.jsxs)(s.ul,{children:["\n",(0,r.jsx)(s.li,{children:"improve logging"}),"\n"]}),"\n",(0,r.jsx)(s.h4,{id:"bug-fixes",children:"Bug Fixes"}),"\n",(0,r.jsxs)(s.ul,{children:["\n",(0,r.jsx)(s.li,{children:"no longer panic on errors"}),"\n"]}),"\n",(0,r.jsx)(s.h3,{id:"030-2024-08-06",children:"0.3.0 (2024-08-06)"}),"\n",(0,r.jsx)(s.h4,{id:"features-1",children:"Features"}),"\n",(0,r.jsxs)(s.ul,{children:["\n",(0,r.jsx)(s.li,{children:"always write outputs to /kratix/metadata"}),"\n",(0,r.jsx)(s.li,{children:"check the run status when fetching outputs from tfe"}),"\n",(0,r.jsx)(s.li,{children:"ske-tfstate-finder image gets all TF Destinations/WorkPlacements"}),"\n",(0,r.jsx)(s.li,{children:"write object-relevant outputs to status automagically"}),"\n",(0,r.jsx)(s.li,{children:"write tf outputs to object status"}),"\n",(0,r.jsx)(s.li,{children:"support finding works of promises"}),"\n"]}),"\n",(0,r.jsx)(s.h4,{id:"bug-fixes-1",children:"Bug Fixes"}),"\n",(0,r.jsxs)(s.ul,{children:["\n",(0,r.jsx)(s.li,{children:"check tf credentials secret key not empty"}),"\n",(0,r.jsx)(s.li,{children:"each pipeline now runs with separate service account"}),"\n",(0,r.jsx)(s.li,{children:"handle existing status entries"}),"\n",(0,r.jsx)(s.li,{children:"handle no tf destinations found (inc. retries)"}),"\n",(0,r.jsx)(s.li,{children:"handle no tf outputs"}),"\n",(0,r.jsx)(s.li,{children:"handle the workplacement not having a VersionID"}),"\n",(0,r.jsx)(s.li,{children:"improve naming of output files in pipeline"}),"\n",(0,r.jsx)(s.li,{children:"only get promise work when it has resource requests"}),"\n",(0,r.jsx)(s.li,{children:"OUTPUT_TO_STATUS -> SKIP_STATUS for a better default"}),"\n",(0,r.jsx)(s.li,{children:"write outputs as yaml, not json"}),"\n"]}),"\n",(0,r.jsx)(s.h3,{id:"020-2024-07-06",children:"0.2.0 (2024-07-06)"}),"\n",(0,r.jsx)(s.h4,{id:"features-2",children:"Features"}),"\n",(0,r.jsxs)(s.ul,{children:["\n",(0,r.jsx)(s.li,{children:"check the run status when fetching outputs from tfe"}),"\n"]})]})}function h(e={}){const{wrapper:s}={...(0,n.a)(),...e.components};return s?(0,r.jsx)(s,{...e,children:(0,r.jsx)(d,{...e})}):d(e)}},1151:(e,s,t)=>{t.d(s,{Z:()=>l,a:()=>a});var r=t(7294);const n={},i=r.createContext(n);function a(e){const s=r.useContext(i);return r.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function l(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:a(e.components),r.createElement(i.Provider,{value:s},e.children)}}}]);