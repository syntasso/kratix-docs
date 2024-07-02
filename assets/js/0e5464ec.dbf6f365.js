"use strict";(self.webpackChunkkratix_docs=self.webpackChunkkratix_docs||[]).push([[1024],{929:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>o,default:()=>h,frontMatter:()=>s,metadata:()=>r,toc:()=>l});var i=t(5893),a=t(1151);const s={title:"Configuring the Plugins",description:"Documentation for the enterprise plugins for Backstage bundled with SKE.",sidebar_label:"Configuring the Plugins"},o=void 0,r={id:"ske/backstage/plugins",title:"Configuring the Plugins",description:"Documentation for the enterprise plugins for Backstage bundled with SKE.",source:"@site/docs/ske/02-backstage/02-plugins.mdx",sourceDirName:"ske/02-backstage",slug:"/ske/backstage/plugins",permalink:"/ske/backstage/plugins",draft:!1,unlisted:!1,editUrl:"https://github.com/syntasso/kratix-docs/tree/main/docs/ske/02-backstage/02-plugins.mdx",tags:[],version:"current",sidebarPosition:2,frontMatter:{title:"Configuring the Plugins",description:"Documentation for the enterprise plugins for Backstage bundled with SKE.",sidebar_label:"Configuring the Plugins"},sidebar:"skeSidebar",previous:{title:"Configuring Backstage",permalink:"/ske/backstage/configuring-backstage"},next:{title:"SKE Backstage Generator",permalink:"/ske/backstage/generator"}},c={},l=[{value:"Accessing the private npm registry",id:"accessing-the-private-npm-registry",level:2},{value:"For local development",id:"local-development",level:3},{value:"For Docker",id:"for-docker",level:3},{value:"Installing the frontend plugin",id:"installing-the-frontend-plugin",level:2},{value:"Update the EntityPage",id:"update-the-entitypage",level:3},{value:"Installing the backend plugin",id:"installing-the-backend-plugin",level:2},{value:"Configure",id:"configure",level:3},{value:"Add the backend plugin",id:"add-the-backend-plugin",level:3},{value:"Configuring the Platform",id:"configuring-the-platform",level:2},{value:"Start your Backstage app",id:"start-your-backstage-app",level:2},{value:"Using the actions",id:"using-the-actions",level:2}];function d(e){const n={a:"a",admonition:"admonition",code:"code",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",ul:"ul",...(0,a.a)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.p,{children:"The Backstage plugins for SKE are a set of plugins that provide additional functionality to Backstage. The plugins are:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"@syntasso/plugin-ske-backend"}),": The backend plugin for SKE."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"@syntasso/plugin-ske-frontend"}),": The frontend plugin for SKE."]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"Follow the instructions below to install and configure both plugins."}),"\n",(0,i.jsxs)(n.p,{children:["The instructions below assume that you have created a Backstage app. The\ncommands must be executed from the root of your Backstage app. Refer to the\n",(0,i.jsx)(n.a,{href:"https://backstage.io/docs/getting-started",children:"Backstage official documentation"}),"\nfor instructions on how to create a Backstage app."]}),"\n",(0,i.jsxs)(n.admonition,{type:"info",children:[(0,i.jsx)(n.p,{children:"For the plugins to work, make sure you have the following environment variable set when\nstarting your Backstage app:"}),(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"export NODE_OPTIONS=--no-node-snapshot\n"})})]}),"\n",(0,i.jsx)(n.admonition,{type:"info",children:(0,i.jsxs)(n.p,{children:["Plugins for SKE are compatible with Backstage apps created with Backstage version v1.24 or above.\nIf you are running Backstage v1.23 or lower, you can check out their ",(0,i.jsx)(n.a,{href:"https://backstage.io/docs/backend-system/building-backends/migrating",children:"migration guide"}),"."]})}),"\n",(0,i.jsx)(n.h2,{id:"accessing-the-private-npm-registry",children:"Accessing the private npm registry"}),"\n",(0,i.jsx)(n.p,{children:"The SKE plugins are distributed through a private npm registry. Please follow the steps below to enable access to it."}),"\n",(0,i.jsx)(n.h3,{id:"local-development",children:"For local development"}),"\n",(0,i.jsxs)(n.p,{children:["To access the private npm registry in your local machine, you will need npm config in a\nlocal ",(0,i.jsx)(n.code,{children:"~/.npmrc"})," file in your home directory. Create this file if it doesn't already\nexist, and add the following content:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:'# replace <YOUR_TOKEN_HERE> with the provided token\n@syntasso:registry=https://npm.pkg.github.com\n//npm.pkg.github.com/:_authToken="<YOUR_TOKEN_HERE>"\nalways-auth=true\n'})}),"\n",(0,i.jsxs)(n.admonition,{type:"info",children:[(0,i.jsxs)(n.p,{children:["For Yarn 3+, use the following command to set a local ",(0,i.jsx)(n.code,{children:".yarnrc.yml"})," file:"]}),(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:'export PRIVATE_REGISTRY_TOKEN="<YOUR_TOKEN_HERE>"\n\nyarn config set npmScopes --json \'{"syntasso": {"npmAlwaysAuth": true, "npmAuthToken": "$PRIVATE_REGISTRY_TOKEN", "npmRegistryServer": "https://npm.pkg.github.com"}}\'\n'})})]}),"\n",(0,i.jsx)(n.h3,{id:"for-docker",children:"For Docker"}),"\n",(0,i.jsxs)(n.p,{children:["For Docker builds, you must update the ",(0,i.jsx)(n.code,{children:"packages/backend/Dockerfile"})," in your Backstage\napp so that it can access the private npm registry."]}),"\n",(0,i.jsxs)(n.p,{children:["Update the ",(0,i.jsx)(n.code,{children:"RUN"})," command that is running the ",(0,i.jsx)(n.code,{children:"yarn install"})," to mount a secret, as\ndescribed below:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-Dockerfile",children:"RUN --mount=type=cache,target=/home/node/.cache/yarn,sharing=locked,uid=1000,gid=1000 \\\n    #highlight-next-line\n    --mount=type=secret,id=npmrc,target=/app/.npmrc,uid=1000,gid=1000 \\\n    yarn install --frozen-lockfile --production --network-timeout 300000\n"})}),"\n",(0,i.jsxs)(n.p,{children:["When running ",(0,i.jsx)(n.code,{children:"yarn build-image"})," you now need to pass in the additional args\n",(0,i.jsx)(n.code,{children:"--secret id=npmrc,src=$HOME/.npmrc"})," to provide the npm credentials to Docker.\nAlternatively, you can update the ",(0,i.jsx)(n.code,{children:"build-image"})," script in the ",(0,i.jsx)(n.code,{children:"package.json"}),"\nfile to include the additional required flag."]}),"\n",(0,i.jsx)(n.admonition,{type:"warning",children:(0,i.jsxs)(n.p,{children:["Make sure that the ",(0,i.jsx)(n.code,{children:"~/.npmrc"})," file is in the home directory of the user that is running\nthe Docker build. Refer to the ",(0,i.jsx)(n.a,{href:"#local-development",children:"Local Development"})," section for instructions."]})}),"\n",(0,i.jsx)(n.h2,{id:"installing-the-frontend-plugin",children:"Installing the frontend plugin"}),"\n",(0,i.jsx)(n.p,{children:"From the root of the backstage repository, run:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"yarn add @syntasso/plugin-ske-frontend --cwd packages/app\n"})}),"\n",(0,i.jsx)(n.h3,{id:"update-the-entitypage",children:"Update the EntityPage"}),"\n",(0,i.jsxs)(n.p,{children:["In the ",(0,i.jsx)(n.code,{children:"packages/app/src/components/catalog/EntityPage.tsx"})," file, add the following to the list of imports:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-typescript",children:'import {\n  KratixPromiseEntityPage,\n  KratixResourceEntityPage,\n} from "@syntasso/plugin-ske-frontend";\n'})}),"\n",(0,i.jsxs)(n.p,{children:["Find the line where the ",(0,i.jsx)(n.code,{children:"const componentPage"})," is being declared. Add the following case\nto the ",(0,i.jsx)(n.code,{children:"EntitySwitch"}),":"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-typescript",children:"<EntitySwitch.Case if={isComponentType('kratix-promise')}>\n  <KratixPromiseEntityPage>{entityWarningContent}</KratixPromiseEntityPage>\n</EntitySwitch.Case>\n\n<EntitySwitch.Case if={isComponentType('kratix-resource')}>\n  <KratixResourceEntityPage>{entityWarningContent}</KratixResourceEntityPage>\n</EntitySwitch.Case>\n"})}),"\n",(0,i.jsxs)(n.p,{children:["When updated, the ",(0,i.jsx)(n.code,{children:"componentPage"})," variable should look similar to this, with any other\nadditional case statements:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-typescript",children:"const componentPage = (\n  <EntitySwitch>\n    <EntitySwitch.Case if={isComponentType(\"service\")}>\n      {serviceEntityPage}\n    </EntitySwitch.Case>\n\n    <EntitySwitch.Case if={isComponentType(\"website\")}>\n      {websiteEntityPage}\n    </EntitySwitch.Case>\n\n    //highlight-start\n    <EntitySwitch.Case if={isComponentType('kratix-promise')}>\n      <KratixPromiseEntityPage>{entityWarningContent}</KratixPromiseEntityPage>\n    </EntitySwitch.Case>\n\n    <EntitySwitch.Case if={isComponentType('kratix-resource')}>\n      <KratixResourceEntityPage>{entityWarningContent}</KratixResourceEntityPage>\n    </EntitySwitch.Case>\n    //highlight-end\n\n    <EntitySwitch.Case>{defaultEntityPage}</EntitySwitch.Case>\n  </EntitySwitch>\n);\n"})}),"\n",(0,i.jsx)(n.h2,{id:"installing-the-backend-plugin",children:"Installing the backend plugin"}),"\n",(0,i.jsx)(n.p,{children:"From the root of the backstage repository, run:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"yarn add @syntasso/plugin-ske-backend --cwd packages/backend\n"})}),"\n",(0,i.jsx)(n.h3,{id:"configure",children:"Configure"}),"\n",(0,i.jsxs)(n.p,{children:["Add the following to the ",(0,i.jsx)(n.code,{children:"app-config.yaml"})," file:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:'ske:\n  scm:\n    token: "my-access-token" # git access token\n    repoUrl: "https://github.com/my-org/my-repo" # repository url\n    type: "github" # optional; git provider, currently one of "github" or "gitlab" (used to determine username if `username` not set)\n    username: "my-username" # optional; username for basic auth (default: inferred based on `type`)\n    path: "catalog" # optional; path within the repository (default: "")\n    branch: "main" # optional; branch to use (default: "main")\n    defaultAuthor: # optional; git author details\n      name: "my-name" # default: "SKE"\n      email: "my@email.com" # default: ske@backstage.io\n'})}),"\n",(0,i.jsxs)(n.p,{children:["The backend plugin uses basic auth to authenticate against the Git provider. If you wish\nto specify a username/password, or use a Git provider other than GitHub or Gitlab, set the\n",(0,i.jsx)(n.code,{children:"username"})," field, and set the ",(0,i.jsx)(n.code,{children:"token"})," field to the password or token. Otherwise, the\nusername will be inferred from the ",(0,i.jsx)(n.code,{children:"type"})," (e.g. ",(0,i.jsx)(n.code,{children:'"oauth2"'})," for Gitlab). One of ",(0,i.jsx)(n.code,{children:"username"}),"\nor ",(0,i.jsx)(n.code,{children:"type"})," must be provided."]}),"\n",(0,i.jsxs)(n.p,{children:["The ",(0,i.jsx)(n.code,{children:"repoUrl"})," is the repository to which Backstage will push the resource\nrequests; you must configure your platform to reconcile on new documents."]}),"\n",(0,i.jsx)(n.h3,{id:"add-the-backend-plugin",children:"Add the backend plugin"}),"\n",(0,i.jsxs)(n.p,{children:["Open the ",(0,i.jsx)(n.code,{children:"packages/backend/src/index.ts"})," file and add the following import:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-typescript",children:"import { scaffolderModuleSkeExtensions } from '@syntasso/plugin-ske-backend';\n"})}),"\n",(0,i.jsx)(n.p,{children:"Then register the backend plugin by adding the following:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-typescript",children:"backend.add(import('@syntasso/plugin-ske-backend'));\nbackend.add(scaffolderModuleSkeExtensions());\n"})}),"\n",(0,i.jsx)(n.p,{children:"Once both packages are added and configured, from the root of your Backstage app, run:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"yarn install\n"})}),"\n",(0,i.jsx)(n.p,{children:"Your backstage instance is now ready to use the SKE plugins."}),"\n",(0,i.jsx)(n.p,{children:"In the next section, you will configure your Platform cluster to reconcile on the documents pushed to the Git repository by the SKE actions."}),"\n",(0,i.jsx)(n.h2,{id:"configuring-the-platform",children:"Configuring the Platform"}),"\n",(0,i.jsxs)(n.p,{children:["This section assumes you have a Kratix instance running following the ",(0,i.jsx)(n.a,{href:"/main/quick-start",children:"quick start guide"}),". Adjust the following steps to fit your installation in case you have a different setup."]}),"\n",(0,i.jsxs)(n.p,{children:["Following the Quick Start, you should have both Kratix and Flux running on your platform. The easiest way to configure the platform to reconcile on the documents pushed to the Git repository by the SKE actions is to use the ",(0,i.jsx)(n.a,{href:"https://fluxcd.io/flux/cmd/",children:"Flux CLI"}),"."]}),"\n",(0,i.jsx)(n.p,{children:"If you configured SKE to use GitHub, you can use the following command to bootstrap your platform, replacing the placeholders with your own values:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:'export GITHUB_TOKEN=<your-github-token>\nflux bootstrap github \\<\n    --owner="<org>" \\\n    --repository="<repo>" \\\n    --branch="<branch>" \\\n    --interval="10s" \\\n    --path="catalog" # must match the `ske.scm.path` in the `app-config.yaml`\n'})}),"\n",(0,i.jsxs)(n.p,{children:["For other Git providers (including a generic git provider), check the ",(0,i.jsx)(n.a,{href:"https://fluxcd.io/flux/cmd/flux_bootstrap_git/",children:"Flux CLI docs"}),"."]}),"\n",(0,i.jsx)(n.admonition,{type:"tip",children:(0,i.jsxs)(n.p,{children:["If you don't want to use the Flux CLI, you can check out the ",(0,i.jsx)(n.a,{href:"https://fluxcd.io/docs/",children:"Flux documentation"})," for other ways to configure your platform."]})}),"\n",(0,i.jsx)(n.h2,{id:"start-your-backstage-app",children:"Start your Backstage app"}),"\n",(0,i.jsx)(n.p,{children:"You should now have two-way communication between Kratix and Backstage set up. You can now start your Backstage with the necessary environment variables set:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"export NODE_OPTIONS=--no-node-snapshot\nexport AWS_ACCESS_KEY_ID=minioadmin\nexport AWS_SECRET_ACCESS_KEY=minioadmin\nyarn dev\n"})}),"\n",(0,i.jsx)(n.admonition,{type:"info",children:(0,i.jsx)(n.p,{children:"Make sure the port-forwarding to the MinIO instance is still running in a separate terminal."})}),"\n",(0,i.jsx)(n.h2,{id:"using-the-actions",children:"Using the actions"}),"\n",(0,i.jsx)(n.p,{children:"Once both your frontend and backend plugins are installed and configured, your\nbackstage should now have the SKE actions available and it should be able to render\nKratix resources in the catalog."}),"\n",(0,i.jsxs)(n.p,{children:["To access the documentation for the SKE actions, check the actions documentation\non your Backstage instance, which is available on the ",(0,i.jsx)(n.code,{children:"/create/actions"}),"\nendpoint."]}),"\n",(0,i.jsxs)(n.p,{children:["The ",(0,i.jsx)(n.a,{href:"./generator",children:"next guide"})," will show how you can use the SKE Backstage Generator to automatically generate Backstage entities from your Promises. If you want to manually configure your Promises, check the ",(0,i.jsx)(n.a,{href:"./yaml-file-format",children:"YAML File Format"})," reference."]})]})}function h(e={}){const{wrapper:n}={...(0,a.a)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},1151:(e,n,t)=>{t.d(n,{Z:()=>r,a:()=>o});var i=t(7294);const a={},s=i.createContext(a);function o(e){const n=i.useContext(s);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:o(e.components),i.createElement(s.Provider,{value:n},e.children)}}}]);