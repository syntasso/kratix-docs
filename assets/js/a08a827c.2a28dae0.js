"use strict";(self.webpackChunkkratix_docs=self.webpackChunkkratix_docs||[]).push([[3728],{2326:(e,i,n)=>{n.r(i),n.d(i,{assets:()=>c,contentTitle:()=>l,default:()=>u,frontMatter:()=>a,metadata:()=>o,toc:()=>s});var r=n(5893),t=n(1151);const a={},l="kratix build container",o={id:"main/kratix-cli/reference/kratix-build-container",title:"kratix build container",description:"Command to build a container image",source:"@site/docs/main/06-kratix-cli/20-reference/05_kratix-build-container.md",sourceDirName:"main/06-kratix-cli/20-reference",slug:"/main/kratix-cli/reference/kratix-build-container",permalink:"/main/kratix-cli/reference/kratix-build-container",draft:!1,unlisted:!1,editUrl:"https://github.com/syntasso/kratix-docs/tree/main/docs/main/06-kratix-cli/20-reference/05_kratix-build-container.md",tags:[],version:"current",sidebarPosition:5,frontMatter:{},sidebar:"mainSidebar",previous:{title:"kratix build promise",permalink:"/main/kratix-cli/reference/kratix-build-promise"},next:{title:"kratix init",permalink:"/main/kratix-cli/reference/kratix-init"}},c={},s=[{value:"Description",id:"description",level:2},{value:"Usage",id:"usage",level:2},{value:"Examples",id:"examples",level:2},{value:"Flags",id:"flags",level:2},{value:"See Also",id:"see-also",level:2}];function d(e){const i={a:"a",code:"code",h1:"h1",h2:"h2",li:"li",p:"p",pre:"pre",ul:"ul",...(0,t.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(i.h1,{id:"kratix-build-container",children:"kratix build container"}),"\n",(0,r.jsx)(i.p,{children:"Command to build a container image"}),"\n",(0,r.jsx)(i.h2,{id:"description",children:"Description"}),"\n",(0,r.jsx)(i.p,{children:"Command to build a container image"}),"\n",(0,r.jsx)(i.h2,{id:"usage",children:"Usage"}),"\n",(0,r.jsx)(i.pre,{children:(0,r.jsx)(i.code,{children:"kratix build container LIFECYCLE/ACTION/PIPELINE-NAME [flags]\n"})}),"\n",(0,r.jsx)(i.h2,{id:"examples",children:"Examples"}),"\n",(0,r.jsx)(i.pre,{children:(0,r.jsx)(i.code,{children:'# Build a container\nkratix build container resource/configure/mypipeline --name mycontainer\n\n# Build all containers for all pipelines\nkratix build container --all\n\n# Build and push the image\nkratix build container resource/configure/mypipeline --name mycontainer --push\n\n# Custom build arguments\nkratix build container resource/configure/mypipeline --build-args "--platform linux/amd64"\n\n# Build with buildx\nkratix build container resource/configure/mypipeline --buildx\n\n# Build with podman\nkratix build container resource/configure/mypipeline --engine podman\n'})}),"\n",(0,r.jsx)(i.h2,{id:"flags",children:"Flags"}),"\n",(0,r.jsx)(i.pre,{children:(0,r.jsx)(i.code,{children:'-d, --dir string      Directory to build promise from. Default to the current working directory (default ".")\n-h, --help            help for promise\n-a, --all             Build all of the containers for the Promise across all Workflows\n--build-args string   Extra build arguments to pass to the container build command\n--buildx              Build the container using Buildx\n-d, --dir string      Directory to read the Promise from (default ".")\n-e, --engine string   Build all of the containers for the Promise across all Workflows (default "docker")\n-h, --help            help for container\n-n, --name string     Name of the container to build\n--push                Build and push the container\n'})}),"\n",(0,r.jsx)(i.h2,{id:"see-also",children:"See Also"}),"\n",(0,r.jsxs)(i.ul,{children:["\n",(0,r.jsxs)(i.li,{children:[(0,r.jsx)(i.a,{href:"/main/kratix-cli/reference/kratix-build",children:"kratix build"}),": Command to build kratix resources"]}),"\n"]})]})}function u(e={}){const{wrapper:i}={...(0,t.a)(),...e.components};return i?(0,r.jsx)(i,{...e,children:(0,r.jsx)(d,{...e})}):d(e)}},1151:(e,i,n)=>{n.d(i,{Z:()=>o,a:()=>l});var r=n(7294);const t={},a=r.createContext(t);function l(e){const i=r.useContext(a);return r.useMemo((function(){return"function"==typeof e?e(i):{...i,...e}}),[i,e])}function o(e){let i;return i=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:l(e.components),r.createElement(a.Provider,{value:i},e.children)}}}]);