---
description: Documentation for the Kratix GitStateStore Custom Resource
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
  namespace: default
spec:
  # The branch to write to: optional, defaults to main
  branch: main
  # The top-level path in the git repository to write to: optional
  path: clusters/
  # Required
  secretRef:
    # The name of the secret to use to authenticate: required
    name: gitea-credentials
    # The namespace of the secret to use: optional, defaults to the GitStateStore namespace
    namespace: gitea
  # The address of the git repository. If auth method is basic auth, use `http`/`https` format: required
  url: https://github.com/syntasso/kratix-repo
```

## Auth
Kratix uses the credentials contained in the `secretRef` to authenticate with the
Git storage. Kratix currently supports using `username` and `password` to authenticate.
The secret should be in the following format:
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

### GitHub
GitHub supports using [person access tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
instead of user passwords for authenticating with GitHub. Create a personal access token
with read and write permissions to the repository. Populate the `username` and `password`
fields with the GitHub username and token value.

### GitLab
GitLab supports using [project access tokens](https://docs.gitlab.com/ee/user/project/settings/project_access_tokens.html)
instead of user passwords for authenticating with GitLab. Create a project access token
with read and write permissions to the repository. The token is created on the project, and is therefore
not related to any individual user. Populate the `username` field with any value and
the `password` field with the token value.

---

Require a different method of authentication? Get in touch with us at
[feedback@syntasso.io](mailto:feedback@syntasso.io?subject=Kratix%20Feedback)
or [open a GitHub Issue](https://github.com/syntasso/kratix/issues/new).

