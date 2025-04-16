"use strict";(self.webpackChunkkratix_docs=self.webpackChunkkratix_docs||[]).push([[6311],{4057:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>k,contentTitle:()=>m,default:()=>x,frontMatter:()=>g,metadata:()=>a,toc:()=>f});var a=t(7293),i=t(4848),s=t(8453);const r=t.p+"assets/images/figure01-ae0ff10dcdc8df3cc220e2b1c1988cd8.png",o=t.p+"assets/images/figure02-4ba72a061d23c13d57dec103e749a1ca.png",c=t.p+"assets/images/figure03-51ffc736badd90af5f146aba853f129f.png",l=t.p+"assets/images/figure04-77be20155fea838745c1945fb07af771.png",d=t.p+"assets/images/figure05-de4453e8b0e843d7b16417087d4c5292.png",h=t.p+"assets/images/figure06-7cbf02135628426e460d70296f872f51.png",u=t.p+"assets/images/figure07-0f767ade8176275b4d38ca96a9957424.png",p=t.p+"assets/images/figure08-e4c757ceca6a2c0f67b059e453647ec0.png",g={slug:"backstage-and-keycloak",title:"Kratix, Backstage, and OIDC",description:"Integrating Kratix with Backstage and Keycloak",authors:["derik"],tags:["kratix","backstage","oidc"]},m=void 0,k={authorsImageUrls:[void 0]},f=[{value:"Deploying Keycloak",id:"deploying-keycloak",level:2},{value:"Creating the resources",id:"creating-the-resources",level:3},{value:"Deploying the Cluster",id:"deploying-the-cluster",level:2},{value:"Cluster configuration",id:"cluster-configuration",level:3},{value:"Creating the RBAC resources",id:"creating-the-rbac-resources",level:3},{value:"Validating user access",id:"validating-user-access",level:3},{value:"Configuring Backstage",id:"configuring-backstage",level:2},{value:"The API reference",id:"the-api-reference",level:3},{value:"The API factory",id:"the-api-factory",level:3},{value:"The Keycloak Auth Resolver",id:"the-keycloak-auth-resolver",level:3},{value:"The provider configuration",id:"the-provider-configuration",level:3},{value:"The Sign In page",id:"the-sign-in-page",level:3},{value:"Testing it all together",id:"testing-it-all-together",level:3},{value:"Configuring the SKE plugins",id:"configuring-the-ske-plugins",level:2},{value:"Testing it all together",id:"testing-it-all-together-1",level:2},{value:"Populating the Catalog",id:"populating-the-catalog",level:3},{value:"Using the template",id:"using-the-template",level:3},{value:"Conclusion",id:"conclusion",level:2}];function y(e){const n={a:"a",admonition:"admonition",code:"code",em:"em",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...(0,s.R)(),...e.components},{Details:t}=n;return t||function(e,n){throw new Error("Expected "+(n?"component":"object")+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}("Details",!0),(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(n.p,{children:["The newly released version of the SKE Backstage plugins will no longer rely on a Git repository to perform CRUD operations on the Kubernetes Cluster. Instead, they will now use the Kubernetes API to manage the resources directly. This enables users to get the most up-to-date information on their resources, as well as manage resources created via other means, like via ",(0,i.jsx)(n.code,{children:"kubectl"}),"."]}),"\n",(0,i.jsx)(n.p,{children:"One important aspect is that you can now use the plugins with OIDC providers, allowing you to have finer control over the authentication and authorisation process."}),"\n",(0,i.jsx)(n.p,{children:"In this blog, we'll go through the process of setting up your Kubernetes Cluster with Keycloak, and configuring Backstage to use it for authentication. We will then configure the SKE Backstage plugins to use the OIDC token provided by Keycloak."}),"\n","\n",(0,i.jsx)(n.h2,{id:"deploying-keycloak",children:"Deploying Keycloak"}),"\n",(0,i.jsx)(n.p,{children:"The first thing you will need is a Keycloak instance. Setting one up can be quite a complicated process, and a bit out of scope for this blog."}),"\n",(0,i.jsxs)(n.p,{children:["For simplicity, we will be using a hosted Keycloak instance from ",(0,i.jsx)(n.a,{href:"https://cloud-iam.com/",children:"cloud-iam.com"}),". You can sign up for a free account and get a Keycloak instance up and running in minutes. Once deployed, take note of the ",(0,i.jsx)(n.code,{children:"realm"}),". You will need it on the next steps."]}),"\n",(0,i.jsx)(n.admonition,{type:"tip",children:(0,i.jsx)(n.p,{children:"If you deploy your Keycloak instance with cloud-iam.com, you should receive the admin password in the email sent to you once your Deployment is ready."})}),"\n",(0,i.jsx)(n.h3,{id:"creating-the-resources",children:"Creating the resources"}),"\n",(0,i.jsxs)(n.p,{children:["Now that you have your Keycloak instance up and running, you will need to set up the clients for Backstage and Kubernetes. You can go through the UI and manually create them, or you can use the ",(0,i.jsx)(n.a,{href:"https://registry.terraform.io/providers/keycloak/keycloak/latest",children:"Keycloak Terraform Provider"}),". You will need:"]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"A Client for Backstage and a Client for Kubernetes"}),"\n",(0,i.jsx)(n.li,{children:"Users that can login to both Backstage and Kubernetes"}),"\n",(0,i.jsx)(n.li,{children:"The Groups that will be used to control access to the Kubernetes Cluster"}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["The following Terraform configuration sets up the Keycloak clients, user accounts, and group-based access control. Save it to a file called ",(0,i.jsx)(n.code,{children:"keycloak.tf"})," and run ",(0,i.jsx)(n.code,{children:"terraform init && terraform apply --auto-aprove"}),"."]}),"\n",(0,i.jsxs)(t,{children:[(0,i.jsx)("summary",{children:"Keycloak Terraform Configuration"}),(0,i.jsx)(n.p,{children:"Make sure to update the highlighted values accordingly."}),(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-terraform",children:'terraform {\n  required_providers {\n    keycloak = {\n      source  = "keycloak/keycloak"\n      version = ">= 5.0.0"\n    }\n  }\n}\n\nprovider "keycloak" {\n  client_id = "admin-cli"\n  username  = "admin"\n  //highlight-start\n  password  = "<YOUR ADMIN PASSWORD>"\n  url       = "https://lemur-10.cloud-iam.com/auth" # double check the URL!\n  realm     = "myrealm"\n  //highlight-end\n}\n\nlocals {\n  //highlight-next-line\n  realm_id = "myrealm"\n  groups   = ["kube-dev", "kube-admin"]\n  user_groups = {\n    user-dev   = ["kube-dev"]\n    backstage  = ["kube-dev"]\n    user-admin = ["kube-admin"]\n  }\n}\n\nresource "keycloak_group" "groups" {\n  for_each = toset(local.groups)\n  realm_id = local.realm_id\n  name     = each.key\n}\n\nresource "keycloak_user" "users" {\n  for_each       = local.user_groups\n  realm_id       = local.realm_id\n  username       = each.key\n  enabled        = true\n  email          = "${each.key}@kratix.io"\n  email_verified = true\n  first_name     = each.key\n  last_name      = each.key\n  initial_password {\n    value = each.key\n  }\n}\n\nresource "keycloak_user_groups" "user_groups" {\n  for_each  = local.user_groups\n  realm_id  = local.realm_id\n  user_id   = keycloak_user.users[each.key].id\n  group_ids = [for g in each.value : keycloak_group.groups[g].id]\n}\n\nresource "keycloak_openid_client_scope" "groups" {\n  realm_id               = local.realm_id\n  name                   = "groups"\n  include_in_token_scope = true\n  gui_order              = 1\n}\n\nresource "keycloak_openid_group_membership_protocol_mapper" "groups" {\n  realm_id        = local.realm_id\n  client_scope_id = keycloak_openid_client_scope.groups.id\n  name            = "groups"\n  claim_name      = "groups"\n  full_path       = false\n}\n\nresource "keycloak_openid_client" "kube" {\n  realm_id                     = local.realm_id\n  client_id                    = "kube"\n  name                         = "kube"\n  enabled                      = true\n  access_type                  = "CONFIDENTIAL"\n  client_secret                = "kube-client-secret"\n  standard_flow_enabled        = false\n  implicit_flow_enabled        = false\n  direct_access_grants_enabled = true\n}\n\nresource "keycloak_openid_client" "backstage-client" {\n  realm_id                     = local.realm_id\n  client_id                    = "backstage-client"\n  name                         = "backstage-client"\n  enabled                      = true\n  access_type                  = "CONFIDENTIAL"\n  client_secret                = "backstage-client-secret"\n  standard_flow_enabled        = true\n  implicit_flow_enabled        = false\n  direct_access_grants_enabled = true\n  valid_redirect_uris = [\n    "http://localhost:7007/api/auth/keycloak/handler/frame",\n    "http://localhost:3003/api/auth/keycloak/handler/frame",\n    "http://localhost:3000/api/auth/keycloak/handler/frame",\n  ]\n}\n\nresource "keycloak_openid_audience_protocol_mapper" "backstage_client_audience" {\n  realm_id                 = local.realm_id\n  client_id                = keycloak_openid_client.backstage-client.id\n  name                     = "kube-audience"\n  included_custom_audience = "kube"\n}\n\nresource "keycloak_openid_client_default_scopes" "backstage-client" {\n  realm_id  = local.realm_id\n  client_id = keycloak_openid_client.backstage-client.id\n  default_scopes = [\n    "email", "basic", "profile", "groups"\n  ]\n}\n\nresource "keycloak_openid_client_default_scopes" "kube" {\n  realm_id  = local.realm_id\n  client_id = keycloak_openid_client.kube.id\n  default_scopes = [\n    "email",\n    keycloak_openid_client_scope.groups.name,\n  ]\n}\n'})})]}),"\n",(0,i.jsx)(n.h2,{id:"deploying-the-cluster",children:"Deploying the Cluster"}),"\n",(0,i.jsx)(n.p,{children:"Now that your Keycloak instance is up and running, and the resources are created, you can connect your Kubernetes cluster to it. In this blog post, we will deploy a KinD cluster. For clusters deployed by other means, please check the appropriate documentation."}),"\n",(0,i.jsx)(n.h3,{id:"cluster-configuration",children:"Cluster configuration"}),"\n",(0,i.jsxs)(n.p,{children:["To deploy a KinD cluster with OIDC, save the following configuration to a file called ",(0,i.jsx)(n.code,{children:"config.yaml"}),":"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:"kind: Cluster\napiVersion: kind.x-k8s.io/v1alpha4\nkubeadmConfigPatches:\n  - |\n    kind: ClusterConfiguration\n    apiServer:\n      extraArgs:\n        oidc-client-id: kube\n        # Update this!\n        # highlight-next-line\n        oidc-issuer-url:  https://lemur-10.cloud-iam.com/auth/realms/myrealm\n        oidc-username-claim: email\n        oidc-groups-claim: groups\nnodes:\n  - role: control-plane\n    extraMounts:\n    extraPortMappings:\n      - containerPort: 31337\n        hostPort: 31337\n      - containerPort: 31340\n        hostPort: 31340\n      - containerPort: 31333\n        hostPort: 31333\n"})}),"\n",(0,i.jsx)(n.p,{children:"You can now use the Kratix quick-start script to deploy the Cluster with OIDC and install\nKratix on it. If you don't have the Kratix repository cloned locally, run:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"git clone https://github.com/syntasso/kratix.git\ncd kratix\n"})}),"\n",(0,i.jsx)(n.p,{children:"Now, from the Kratix repository, run:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"KIND_PLATFORM_CONFIG=/path/to/config.yaml \\\n  ./scripts/quick-start.sh \\\n  --git-and-minio \\\n  --recreate\n"})}),"\n",(0,i.jsxs)(n.admonition,{type:"tip",children:[(0,i.jsx)(n.p,{children:"You can also deploy the cluster directly with KinD:"}),(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"kind create cluster --config config.yaml --name platform\n"})})]}),"\n",(0,i.jsx)(n.h3,{id:"creating-the-rbac-resources",children:"Creating the RBAC resources"}),"\n",(0,i.jsxs)(n.p,{children:["Next, you need to give the groups the necessary permissions to access the cluster. If you check the terraform configuration, you will see that the groups defined in the ",(0,i.jsx)(n.code,{children:"user_groups"})," variable: ",(0,i.jsx)(n.code,{children:"kube-dev"})," and ",(0,i.jsx)(n.code,{children:"kube-admin"}),"."]}),"\n",(0,i.jsx)(n.p,{children:"Create the necessary RBAC resources:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"kube-admin"})," should have ",(0,i.jsx)(n.code,{children:"cluster-admin"})," role"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"kube-dev"})," should have be able to read every resource, but not create, update or delete"]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"The ClusterRole and ClusterRoleBinding resources can be defined as follows:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:'kind: ClusterRoleBinding\napiVersion: rbac.authorization.k8s.io/v1\nmetadata:\n  name: kube-admin\nsubjects:\n  - kind: Group\n    name: kube-admin\n    apiGroup: rbac.authorization.k8s.io\nroleRef:\n  apiGroup: rbac.authorization.k8s.io\n  kind: ClusterRole\n  name: cluster-admin\n---\napiVersion: rbac.authorization.k8s.io/v1\nkind: ClusterRole\nmetadata:\n  name: cr-reader\nrules:\n  - apiGroups:\n      - "*"\n    resources:\n      - "*"\n    verbs:\n      - get\n      - list\n      - watch\n---\nkind: ClusterRoleBinding\napiVersion: rbac.authorization.k8s.io/v1\nmetadata:\n  name: kube-dev\nsubjects:\n  - kind: Group\n    name: kube-dev\n    apiGroup: rbac.authorization.k8s.io\nroleRef:\n  apiGroup: rbac.authorization.k8s.io\n  kind: ClusterRole\n  name: cr-reader\n'})}),"\n",(0,i.jsxs)(n.p,{children:["Save that to a file called ",(0,i.jsx)(n.code,{children:"rbac.yaml"})," and apply it to your cluster:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"kubectl apply -f rbac.yaml --context kind-platform\n"})}),"\n",(0,i.jsx)(n.h3,{id:"validating-user-access",children:"Validating user access"}),"\n",(0,i.jsx)(n.p,{children:"To validate the user access, you will need to:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"Login with both users."}),"\n",(0,i.jsxs)(n.li,{children:["Check that the ",(0,i.jsx)(n.code,{children:"user-admin"})," (that's part of the ",(0,i.jsx)(n.code,{children:"kube-admin"})," group) user can create a resource."]}),"\n",(0,i.jsxs)(n.li,{children:["Check that the ",(0,i.jsx)(n.code,{children:"user-dev"})," (that's part of the ",(0,i.jsx)(n.code,{children:"kube-dev"})," group) user can read but not create resources."]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"The easiest way to login is to execute the script below. First, export the KEYCLOAK_URL env variable with the Keycloak issuer URL:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:'export KEYCLOAK_URL="https://lemur-10.cloud-iam.com/auth/realms/myrealm"\n'})}),"\n",(0,i.jsx)(n.p,{children:"Then, run the script below:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"kubectl_config(){\n  local ENDPOINT=${KEYCLOAK_URL}/protocol/openid-connect/token\n  local ID_TOKEN=$(curl --silent -k -X POST $ENDPOINT \\\n    -d grant_type=password \\\n    -d client_id=kube \\\n    -d client_secret=kube-client-secret \\\n    -d username=$1 \\\n    -d password=$1 \\\n    -d scope=openid \\\n    -d response_type=id_token | jq -r '.id_token')\n  local REFRESH_TOKEN=$(curl --silent -k -X POST $ENDPOINT \\\n    -d grant_type=password \\\n    -d client_id=kube \\\n    -d client_secret=kube-client-secret \\\n    -d username=$1 \\\n    -d password=$1 \\\n    -d scope=openid \\\n    -d response_type=id_token | jq -r '.refresh_token')\n\n  kubectl config set-credentials $1 \\\n    --auth-provider=oidc \\\n    --auth-provider-arg=client-id=kube \\\n    --auth-provider-arg=client-secret=kube-client-secret \\\n    --auth-provider-arg=idp-issuer-url=$KEYCLOAK_URL \\\n    --auth-provider-arg=id-token=$ID_TOKEN \\\n    --auth-provider-arg=refresh-token=$REFRESH_TOKEN\n\n  kubectl config set-context $1 --cluster=kind-platform --user=$1\n}\n\n# setup config for our users\nkubectl_config user-admin\nkubectl_config user-dev\n"})}),"\n",(0,i.jsxs)(n.p,{children:["The script above should create two new contexts: ",(0,i.jsx)(n.code,{children:"user-admin"})," and ",(0,i.jsx)(n.code,{children:"user-dev"}),". You can easily switch between them by using the ",(0,i.jsx)(n.code,{children:"--context"})," flag. To test the access the different users have, you can run the following:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:'kubectl --context user-admin create namespace test-ns\n# namespace/test-ns created\n\nkubectl --context user-dev create namespace test-ns-2\n# Error from server (Forbidden): namespaces is forbidden: User "user-dev@syntasso.io" cannot create resource "namespaces" in API group "" at the cluster scope\n\nkubectl --context user-dev get namespace test-ns\n# NAME      STATUS   AGE\n# test-ns   Active   1m\n\nkubectl --context user-dev delete namespace test-ns\n# Error from server (Forbidden): namespaces "test-ns" is forbidden: User "user-dev@syntasso.io" cannot delete resource "namespaces" in API group "" in the namespace "test-ns"\n\nkubectl --context user-admin delete namespace test-ns\n# namespace "test-ns" deleted\n'})}),"\n",(0,i.jsx)(n.p,{children:"Great! You can now move on configuring Backstage."}),"\n",(0,i.jsx)(n.h2,{id:"configuring-backstage",children:"Configuring Backstage"}),"\n",(0,i.jsx)(n.p,{children:"Assuming you already have a Backstage instance, you will need to do the following changes to configure it to use Keycloak for authentication:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"Create an API reference to identify the Keycloak provider."}),"\n",(0,i.jsx)(n.li,{children:"Create the API factory that will handle the authentication."}),"\n",(0,i.jsx)(n.li,{children:"Create the Keycloak Auth provider Resolver."}),"\n",(0,i.jsx)(n.li,{children:"Configure the provider to access the Keycloak instance."}),"\n",(0,i.jsx)(n.li,{children:"Add Keycloak to the sign in page so users can login with it."}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["The steps above are explained in details as part of the ",(0,i.jsx)(n.a,{href:"https://backstage.io/docs/auth/oidc",children:"OIDC provider from scratch"})," guide in the Backstage docs. Below, you will find the code snippets you will need to include in your Backstage instance."]}),"\n",(0,i.jsxs)(n.admonition,{type:"tip",children:[(0,i.jsxs)(n.p,{children:["You can skip this entire section by cloning the Backstage app available ",(0,i.jsx)(n.a,{href:"https://github.com/syntasso/blog-backstage-oidc",children:"here"}),". You still need to authenticate with the Syntasso Registry to run ",(0,i.jsx)(n.code,{children:"yarn install"}),". Check ",(0,i.jsx)(n.a,{href:"/ske/integrations/backstage/plugins#local-development",children:"Accessing the Private NPM registry"})," docs for details."]}),(0,i.jsx)(n.p,{children:"Check the README in the repository for details about how to run the app."})]}),"\n",(0,i.jsx)(n.h3,{id:"the-api-reference",children:"The API reference"}),"\n",(0,i.jsxs)(n.p,{children:["Open the ",(0,i.jsx)(n.code,{children:"packages/app/src/apis.ts"})," file and add the following snippet:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-js",children:'import {\n  AnyApiFactory,\n  configApiRef,\n  createApiFactory,\n  OpenIdConnectApi,\n  ProfileInfoApi,\n  BackstageIdentityApi,\n  SessionApi,\n  createApiRef,\n  ApiRef,\n} from "@backstage/core-plugin-api";\n\nexport const keycloakOIDCAuthApiRef: ApiRef<\n  OpenIdConnectApi & ProfileInfoApi & BackstageIdentityApi & SessionApi\n> = createApiRef({\n  id: "auth.keycloak",\n});\n'})}),"\n",(0,i.jsx)(n.h3,{id:"the-api-factory",children:"The API factory"}),"\n",(0,i.jsxs)(n.p,{children:["Still in the ",(0,i.jsx)(n.code,{children:"apis.ts"})," file, create a new API factory and add to the ",(0,i.jsx)(n.code,{children:"apis"})," array:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-js",children:'import { OAuth2 } from "@backstage/core-app-api";\nimport {\n  discoveryApiRef,\n  oauthRequestApiRef,\n} from "@backstage/core-plugin-api";\n\nexport const apis: AnyApiFactory[] = [\n  /* this is the new API factory */\n  createApiFactory({\n    api: keycloakOIDCAuthApiRef,\n    deps: {\n      discoveryApi: discoveryApiRef,\n      oauthRequestApi: oauthRequestApiRef,\n      configApi: configApiRef,\n    },\n    factory: ({ discoveryApi, oauthRequestApi, configApi }) =>\n      OAuth2.create({\n        configApi,\n        discoveryApi,\n        oauthRequestApi,\n        provider: {\n          id: "keycloak",\n          title: "Keycloak Provider",\n          icon: () => null,\n        },\n        environment: configApi.getOptionalString("auth.environment"),\n        defaultScopes: ["openid", "profile", "email"],\n        popupOptions: {\n          size: { fullscreen: true },\n        },\n      }),\n  }),\n\n  /* these are the existing API factories */\n  createApiFactory({\n    api: scmIntegrationsApiRef,\n    deps: { configApi: configApiRef },\n    factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),\n  }),\n  ScmAuth.createDefaultApiFactory(),\n];\n'})}),"\n",(0,i.jsx)(n.h3,{id:"the-keycloak-auth-resolver",children:"The Keycloak Auth Resolver"}),"\n",(0,i.jsx)(n.p,{children:"You will need to include a couple of modules to your backend dependencies:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"yarn --cwd packages/backend add @backstage/plugin-auth-backend-module-oidc-provider\nyarn --cwd packages/backend add @backstage/backend-plugin-api\nyarn --cwd packages/backend add @backstage/catalog-model\n"})}),"\n",(0,i.jsxs)(n.p,{children:["Next, open the ",(0,i.jsx)(n.code,{children:"packages/backend/src/index.js"})," and add register the keycloak provider:"]}),"\n",(0,i.jsx)(n.admonition,{type:"tip",children:(0,i.jsxs)(n.p,{children:["Make sure to include the snippet below ",(0,i.jsx)(n.em,{children:"before"})," the ",(0,i.jsx)(n.code,{children:"backend.start()"})," call."]})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-js",children:"\nimport {\n  authProvidersExtensionPoint,\n  createOAuthProviderFactory,\n  OAuthAuthenticator,\n} from '@backstage/plugin-auth-node';\nimport { oidcAuthenticator } from '@backstage/plugin-auth-backend-module-oidc-provider';\nimport { createBackendModule } from '@backstage/backend-plugin-api';\nimport {\n  stringifyEntityRef,\n  DEFAULT_NAMESPACE,\n} from '@backstage/catalog-model';\n\nconst kcAuthProviderModule = createBackendModule({\n  // This ID must be exactly \"auth\" because that's the plugin it targets\n  pluginId: 'auth',\n  // This ID must be unique, but can be anything\n  moduleId: 'keycloak',\n  register(reg) {\n    reg.registerInit({\n      deps: { providers: authProvidersExtensionPoint },\n      async init({ providers }) {\n        providers.registerProvider({\n          // This ID must match the actual provider config, e.g. addressing\n          // auth.providers.azure means that this must be \"azur e\".\n          providerId: 'keycloak',\n          // Use createProxyAuthProviderFactory instead if it's one of the proxy\n          // based providers rather than an OAuth based one\n          factory: createOAuthProviderFactory({\n            // For more info about authenticators please see https://backstage.io/docs/auth/add-auth-provider/#adding-an-oauth-based-provider\n            authenticator: oidcAuthenticator as OAuthAuthenticator<unknown, any>,\n            async signInResolver(info, ctx) {\n              console.log(info);\n              const userRef = stringifyEntityRef({\n                kind: 'User',\n                name: info?.result.fullProfile.userinfo.name as string,\n                namespace: DEFAULT_NAMESPACE,\n              });\n              return ctx.issueToken({\n                claims: {\n                  sub: userRef, // The user's own identity\n                  ent: [userRef], // A list of identities that the user claims ownership through\n                  tok: info?.result.session.accessToken, // this is important!\n                },\n              });\n            },\n          }),\n        });\n      },\n    });\n  },\n});\n\nbackend.add(kcAuthProviderModule);\n"})}),"\n",(0,i.jsx)(n.h3,{id:"the-provider-configuration",children:"The provider configuration"}),"\n",(0,i.jsxs)(n.p,{children:["In your ",(0,i.jsx)(n.code,{children:"app-config.yaml"}),", add the following configuration, making sure you update the URLs accordingly:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:"auth:\n  environment: development\n  session:\n    secret: a-session-secret\n  providers:\n    keycloak:\n      development:\n        metadataUrl: ${KEYCLOAK_URL}/.well-known/openid-configuration\n        clientId: backstage-client\n        clientSecret: backstage-client-secret\n        prompt: auto\n        authorizationUrl: ${KEYCLOAK_URL}/protocol/openid-connect/auth\n        tokenUrl: ${KEYCLOAK_URL}/protocol/openid-connect/token\n"})}),"\n",(0,i.jsx)(n.h3,{id:"the-sign-in-page",children:"The Sign In page"}),"\n",(0,i.jsxs)(n.p,{children:["Finally, add Keycloak to the SignInPage component in the ",(0,i.jsx)(n.code,{children:"packages/app/src/App.tsx"})," file:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-js",children:'import { keycloakOIDCAuthApiRef } from "./apis";\n\nconst app = createApp({\n  apis,\n  /* ... */\n  components: {\n    SignInPage: (props) => (\n      <SignInPage\n        {...props}\n        auto\n        providers={[\n          "guest",\n          {\n            id: "keycloak",\n            title: "Keycloak",\n            message: "Sign in using Keycloak",\n            apiRef: keycloakOIDCAuthApiRef,\n          },\n        ]}\n      />\n    ),\n  },\n});\n'})}),"\n",(0,i.jsx)(n.h3,{id:"testing-it-all-together",children:"Testing it all together"}),"\n",(0,i.jsx)(n.p,{children:"At this stage, you should be able to sign in with Keycloak and access your Backstage instance."}),"\n",(0,i.jsx)(n.p,{children:"In a terminal, start your Backstage app and open it in your browser."}),"\n",(0,i.jsx)(n.admonition,{type:"tip",children:(0,i.jsxs)(n.p,{children:["Depending on your version of Backstage, you may need to run ",(0,i.jsx)(n.code,{children:"yarn dev"})," or ",(0,i.jsx)(n.code,{children:"yarn start"})," to start the app."]})}),"\n",(0,i.jsx)(n.p,{children:"You should see the Sign In page with Keycloak as an option:"}),"\n","\n",(0,i.jsxs)("figure",{className:"diagram",children:[(0,i.jsx)("img",{className:"large",src:r,alt:"The Backstage Sign In page showing both the Guest and the Keycloak Authentication options"}),(0,i.jsx)("figcaption",{children:"Sign In Page"})]}),"\n",(0,i.jsx)(n.p,{children:"Clicking in the Keycloak option will redirect you to the Keycloak login page:"}),"\n",(0,i.jsxs)("figure",{className:"diagram",children:[(0,i.jsx)("img",{className:"large",src:o,alt:"The Keycloak login page. Username and password fields are populated with user-admin"}),(0,i.jsx)("figcaption",{children:"The Keycloak login page"})]}),"\n",(0,i.jsx)(n.p,{children:"After logging in, you will be redirected back to Backstage and you should be logged in. If you navigate to the Settings page, you should see your user information:"}),"\n",(0,i.jsxs)("figure",{className:"diagram",children:[(0,i.jsx)("img",{className:"large",src:c,alt:"The Settings Page on Backstage, showing the logged in user information"}),(0,i.jsx)("figcaption",{children:"The Settings page"})]}),"\n",(0,i.jsx)(n.p,{children:"Excellent! Final step is to configure the SKE plugins to communicate with your Platform cluster, using the Keycloak token."}),"\n",(0,i.jsx)(n.h2,{id:"configuring-the-ske-plugins",children:"Configuring the SKE plugins"}),"\n",(0,i.jsxs)(n.p,{children:["This section assumes you have a SKE License token, have access to the SKE Backstage plugins, and installed them in your Backstage instance (or that you have cloned the ",(0,i.jsx)(n.a,{href:"https://github.com/syntasso/blog-backstage-oidc",children:"example Backstage app"}),"). If that's not your case,you can follow a step-by-step guide on how to configure the SKE Backstage plugins ",(0,i.jsx)(n.a,{href:"/ske/integrations/backstage/plugins",children:"here"}),"."]}),"\n",(0,i.jsx)(n.admonition,{type:"tip",children:(0,i.jsx)(n.p,{children:"Make sure you have the latest version of the SKE plugins installed. This post requires, at a minimum, ske-backend v0.14.0 and ske-frontend v0.13.0."})}),"\n",(0,i.jsx)(n.p,{children:"The configuration of the plugins is very straightforward. All you need to do is:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"Add the Platform cluster to your app config."}),"\n",(0,i.jsx)(n.li,{children:"Tell the SKE Plugins the name of the platform cluster."}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["Both of those changes are done via the ",(0,i.jsx)(n.code,{children:"app-config.yaml"})," file."]}),"\n",(0,i.jsxs)(n.p,{children:["Locate the ",(0,i.jsx)(n.code,{children:"kubernetes"})," section (or create one if it doesn't exist) and add the Platform cluster:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:'kubernetes:\n  serviceLocatorMethod:\n    type: multiTenant\n  clusterLocatorMethods:\n    - type: config\n      clusters:\n        - url: "https://<your kind cluster url"\n          name: kratix-platform\n          authProvider: oidc\n          oidcTokenProvider: keycloak\n          skipTLSVerify: true\n'})}),"\n",(0,i.jsx)(n.admonition,{type:"tip",children:(0,i.jsxs)(n.p,{children:["To find your KinD cluster URL, run ",(0,i.jsx)(n.code,{children:"kubectl cluster-info --context kind-platform"})]})}),"\n",(0,i.jsxs)(n.p,{children:["You must now tell the backend plugin which cluster is the platform cluster. For that, add the following section to your ",(0,i.jsx)(n.code,{children:"app-config.yaml"}),":"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:"ske:\n  kubernetes:\n    # make sure this matches name of the cluster in the `kubernetes` section\n    platformName: kratix-platform\n"})}),"\n",(0,i.jsx)(n.p,{children:"Excellent. You should now have a working Backstage instance with Keycloak authentication and SKE plugins configured to work with your Platform cluster. Let's test it all together now."}),"\n",(0,i.jsx)(n.h2,{id:"testing-it-all-together-1",children:"Testing it all together"}),"\n",(0,i.jsx)(n.h3,{id:"populating-the-catalog",children:"Populating the Catalog"}),"\n",(0,i.jsxs)(n.p,{children:["If you have SKE and Backstage fully configured, you could try to install a Promise and create a new resource via the Template. If not, you can register the template available ",(0,i.jsx)(n.a,{href:"https://github.com/syntasso/blog-backstage-oidc/blob/main/examples/ske-entities.yaml",children:"here"})," directly in your instance."]}),"\n",(0,i.jsx)(n.admonition,{type:"tip",children:(0,i.jsx)(n.p,{children:"If you cloned the example backstage application, you can skip this step."})}),"\n",(0,i.jsx)(n.p,{children:"For that:"}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:["Open your ",(0,i.jsx)(n.code,{children:"app-config.yaml"})]}),"\n",(0,i.jsxs)(n.li,{children:["Locate the ",(0,i.jsx)(n.code,{children:"catalog.locations"})," section"]}),"\n",(0,i.jsx)(n.li,{children:"Add to the list:"}),"\n"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:"- type: url\n  target: https://github.com/syntasso/blog-backstage-oidc/blob/main/examples/ske-entities.yaml\n  rules:\n    - allow: [Template]\n"})}),"\n",(0,i.jsx)(n.p,{children:"Now you restart your Backstage instance."}),"\n",(0,i.jsx)(n.h3,{id:"using-the-template",children:"Using the template"}),"\n",(0,i.jsx)(n.p,{children:"Once you have a template registered in your Backstage instance, you can use it to create a new resource. This could either be your the Template generated by your Promise or the template you registered in the previous step. We will assume you are using the example Template in the next steps."}),"\n",(0,i.jsx)(n.p,{children:"Locate and click the CREATE button in the sidebar and select the ConfigMap:"}),"\n","\n",(0,i.jsxs)("figure",{className:"diagram",children:[(0,i.jsx)("img",{className:"large",src:l,alt:"The Create page"}),(0,i.jsx)("figcaption",{children:"The Create Page"})]}),"\n",(0,i.jsxs)(n.p,{children:["Follow the steps and configure a new ConfigMap. Don't forget to click the ",(0,i.jsx)(n.code,{children:"+"})," icon to add key-value pairs to your ConfigMap."]}),"\n",(0,i.jsxs)("figure",{className:"diagram",children:[(0,i.jsx)("img",{className:"large",src:d,alt:"The form to create a configmap"}),(0,i.jsx)("figcaption",{children:"The ConfigMap Template"})]}),"\n",(0,i.jsx)(n.p,{children:"Proceed with the form and create the ConfigMap:"}),"\n",(0,i.jsxs)("figure",{className:"diagram",children:[(0,i.jsx)("img",{className:"large",src:h,alt:"The page backstage shows once you create the configmap"}),(0,i.jsx)("figcaption",{children:"The ConfigMap created"})]}),"\n",(0,i.jsx)(n.p,{children:"At this stage, you should have a new ConfigMap in your Cluster:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"$ kubectl --context user-admin get configmap test-configmap # or the name you used!\nNAME             DATA   AGE\ntest-configmap   2      1m\n"})}),"\n",(0,i.jsxs)(n.p,{children:["Great! Now logout and login with the ",(0,i.jsx)(n.code,{children:"user-dev"})," user. To logout, click ",(0,i.jsx)(n.code,{children:"Settings"})," on the bottom-left corner, then the three dots, and Sign Out"]}),"\n",(0,i.jsxs)("figure",{className:"diagram",children:[(0,i.jsx)("img",{className:"large",src:u,alt:"The sign out process"}),(0,i.jsx)("figcaption",{children:"Signing out page"})]}),"\n",(0,i.jsxs)(n.p,{children:["Logged in as the ",(0,i.jsx)(n.code,{children:"user-dev"})," user, try to create a new ConfigMap following the same steps."]}),"\n",(0,i.jsxs)(n.p,{children:["You should get a 403 error, since the ",(0,i.jsx)(n.code,{children:"user-dev"})," user does not have the required permissions:"]}),"\n",(0,i.jsxs)("figure",{className:"diagram",children:[(0,i.jsx)("img",{className:"large",src:p,alt:"A Screenshot of the Backstage UI with a 403 error for the user-dev"}),(0,i.jsx)("figcaption",{children:"Creating the ConfigMap failed"})]}),"\n",(0,i.jsx)(n.p,{children:"\ud83c\udf89"}),"\n",(0,i.jsx)(n.h2,{id:"conclusion",children:"Conclusion"}),"\n",(0,i.jsx)(n.p,{children:"By integrating Keycloak with both Kubernetes and Backstage, and configuring the SKE Backstage plugins to leverage OIDC tokens, we've created a seamless and secure developer experience. This setup not only simplifies authentication and authorisation but also enables fine-grained access control across your platform, allowing you to manage who-can-do-what directly from your Kubernetes cluster."}),"\n",(0,i.jsx)(n.p,{children:"Communicating directly to the Platform cluster opens up a new world of possibilities of what Kratix can now surface to Backstage. Most up-to-date status, pipeline progress, logs, and much more. We are still prioritising what we think will bring the most value, but we are very curious to hear any feedback or suggestion you might have."}),"\n",(0,i.jsxs)(n.p,{children:["While article focuses on the Backstage, Kratix can be integrated with any portal or interface. For example, check out ",(0,i.jsx)(n.a,{href:"https://www.youtube.com/watch?v=7nKx4CnEvoY",children:"this video"})," to see how Kratix can integrate with ",(0,i.jsx)(n.a,{href:"https://port.io",children:"Port"}),". We're also keen to hear what you are using (or planning to use) as the interface to your platform in your organisation, and hearing how could Kratix help you out."]}),"\n",(0,i.jsxs)(n.p,{children:["As always, ping us directly via ",(0,i.jsx)(n.a,{href:"https://github.com/syntasso/kratix",children:"Github"})," or in our ",(0,i.jsx)(n.a,{href:"https://kratixworkspace.slack.com/",children:"Community Slack"}),"."]})]})}function x(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(y,{...e})}):y(e)}},8453:(e,n,t)=>{t.d(n,{R:()=>r,x:()=>o});var a=t(6540);const i={},s=a.createContext(i);function r(e){const n=a.useContext(s);return a.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:r(e.components),a.createElement(s.Provider,{value:n},e.children)}},7293:e=>{e.exports=JSON.parse('{"permalink":"/blog/backstage-and-keycloak","source":"@site/blog/2025-04-16-backstage-keycloak/index.mdx","title":"Kratix, Backstage, and OIDC","description":"Integrating Kratix with Backstage and Keycloak","date":"2025-04-16T00:00:00.000Z","tags":[{"inline":true,"label":"kratix","permalink":"/blog/tags/kratix"},{"inline":true,"label":"backstage","permalink":"/blog/tags/backstage"},{"inline":true,"label":"oidc","permalink":"/blog/tags/oidc"}],"readingTime":15.23,"hasTruncateMarker":true,"authors":[{"name":"Derik Evangelista","title":"Engineer @ Syntasso","url":"https://github.com/kirederik","imageURL":"https://2.gravatar.com/avatar/7ac63fbda18c97f6a7fab8af157021367793187f4c5830eb722ff565c5a767e9?size=256","key":"derik","page":null}],"frontMatter":{"slug":"backstage-and-keycloak","title":"Kratix, Backstage, and OIDC","description":"Integrating Kratix with Backstage and Keycloak","authors":["derik"],"tags":["kratix","backstage","oidc"]},"unlisted":false,"nextItem":{"title":"Debugging in Kratix","permalink":"/blog/debugging-promise-updates"}}')}}]);