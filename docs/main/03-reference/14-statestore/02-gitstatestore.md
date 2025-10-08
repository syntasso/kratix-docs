---
description: Documentation for the Kratix `GitStateStore`` Custom Resource
title: GitStateStore
sidebar_label: GitStateStore
id: gitstatestore
---

# GitStateStore

Kratix supports writing to Git repositories. See below for the API documentation:

```yaml
apiVersion: platform.kratix.io/v1alpha1
kind: GitStateStore
metadata:
  name: default
spec:
  # The branch to write to: optional, defaults to main
  branch: main
  # The top-level path in the git repository to write to: optional
  path: destinations/
  # Valid options: basicAuth, ssh, and githubApp; defaults to basicAuth
  authMethod: basicAuth
  # Optional
  gitAuthor:
    # The name of the author to use when committing: optional, defaults to kratix
    name: kratix
    # The email of the author to use when committing: optional, defaults to empty
    email:
  # Required
  secretRef:
    # The name and namespace of the secret to use to authenticate: required
    name: gitea-credentials
    namespace: default
  # The address of the git repository. If auth method is basic auth or githubApp, use `http`/`https` format: required
  # if your using ssh auth then ensure its of the format git@github.com:<org>/<repo>.git
  url: https://github.com/syntasso/kratix-repo
```

## Auth

Kratix uses the credentials contained in the `secretRef` to authenticate with the
Git storage. Kratix currently supports using `basicAuth`, `ssh` or `githubApp`.

### SSH
When `authMethod` is equal to `ssh` Kratix will check the secret for `sshPrivateKey` and `knownHosts`
to authenticate. The secret should be in the following format:
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: # name
  namespace: # namespace
type: Opaque
data:
  sshPrivateKey: # base64 encoded private key
  knownHosts: # base64 encoded known hosts
```
Kratix supports **any** Git provider that supports ssh auth. Depending on the provider
you are using you may be able to use an per-repo ssh key in-place of user's ssh key.
See below for further details.

#### GitHub
GitHub supports per-repo ssh keys using [deploy keys](https://docs.github.com/en/rest/deploy-keys/deploy-keys?apiVersion=2022-11-28).

#### GitLab
GitLab supports per-repo ssh keys using [deploy keys](https://docs.gitlab.com/ee/user/project/deploy_keys/).

### Basic Auth
When `authMethod` is equal to `basicAuth` Kratix will check the secret for `username`
and `password` to authenticate. The secret should be in the following format:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: # name
  namespace: # namespace
type: Opaque
data:
  username: # base64 encoded username
  password: # base64 encoded password
```

Kratix supports **any** Git provider that supports basic auth. Depending on the provider
you are using you may be able to use an access token in-place of an actual password.
See below for further details.

#### GitHub

GitHub supports using [personal access tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
instead of user passwords for authenticating with GitHub. Create a personal access token
with read and write permissions to the repository. Populate the `username` and `password`
fields with the GitHub username and token value.

#### GitLab

GitLab supports using [project access tokens](https://docs.gitlab.com/ee/user/project/settings/project_access_tokens.html)
instead of user passwords for authenticating with GitLab. Create a project access token
with read and write permissions to the repository. The token is created on the project, and is therefore
not related to any individual user. Populate the `username` field with any value and
the `password` field with the token value.

#### AWS CodeCommit

AWS CodeCommit supports using [basic
auth](https://docs.aws.amazon.com/codecommit/latest/userguide/setting-up-gc.html?icmpid=docs_acc_console_connect_np#setting-up-gc-iam)
to authenticate with the repository. Populate the `username` and `password`
field with the values generated for the HTTPS Git credentials.

### Github App

When `authMethod` is set to `githubApp`, Kratix uses a GitHub App installation for authentication.
The referenced Secret must contain the `appID`, `installationID`, and `privateKey`.
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: # name
  namespace: # namespace
type: Opaque
stringData:
  appID: "<GitHub App ID>"
  installationID: "<Installation ID>"
  privateKey: |
    -----BEGIN RSA PRIVATE KEY-----
    ...
    -----END RSA PRIVATE KEY-----
```

Kratix authenticates to GitHub using a short-lived installation access token, generated via your GitHub App credentials.
It automatically refreshes this token before expiry and no manual token rotation is required.

You can find the `appID` and `installationID` in your GitHub App settings or by using  [the GitHub REST API](https://docs.github.com/en/rest/apps/apps?apiVersion=2022-11-28).
Ensure your GitHub App has **Contents (Read & Write)** permission to the target repository.

For more information about installing GitHub Apps, see [Installing GitHub Apps](https://docs.github.com/en/developers/apps/managing-github-apps/installing-github-apps).

---

Require a different method of authentication? Get in touch with us at
[feedback@syntasso.io](mailto:feedback@syntasso.io?subject=Kratix%20Feedback)
or [open a GitHub Issue](https://github.com/syntasso/kratix/issues/new).

## Status

The status of the GitStateStore can be `Ready` or `NotReady` based on Kratix's availability to write to the State Store.

A condition of type `Ready` is also provided to enable waiting for the State Store to be ready.

An example is provided below showing a GitStateStore coming online, including events detailing any status changes.

```
$ kubectl describe gitstatestores.platform.kratix.io default
Name:         default
...
Status:
  Conditions:
    Last Transition Time:  2025-03-05T12:53:12Z
    Message:               State store is ready
    Reason:                StateStoreReady
    Status:                True
    Type:                  Ready
  Status:                  Ready
Events:
  Type     Reason    Age    From                     Message
  ----     ------    ----   ----                     -------
  Warning  NotReady  2m44s  GitStateStoreController  GitStateStore "default" is not ready: Error writing test file: Get "https://172.18.0.2:31333/gitea_admin/kratix/info/refs?service=git-upload-pack": dial tcp 172.18.0.2:31333: connect: connection refused
  Warning  NotReady  2m32s  GitStateStoreController  GitStateStore "default" is not ready: Error writing test file: repository not found: Repository not found
  Normal   Ready     2m21s  GitStateStoreController  GitStateStore "default" is ready
```

:::info

Kratix determines whether it can write to the State Store by writing a `kratix-write-probe.txt` file under the State Store's `.spec.path` filepath.

:::