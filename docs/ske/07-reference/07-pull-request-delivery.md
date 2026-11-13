---
description: Configuration, status fields and behaviour of SKE pull request delivery on a GitStateStore.
title: Pull request delivery
id: pull-request-delivery
slug: "/ske/reference/pull-request-delivery"
sidebar_label: "Pull request delivery"
sidebar_position: 6.5
---

# Pull request delivery

With pull request delivery, SKE opens a pull request for each change to a `GitStateStore` instead
of pushing to its branch. To turn it on, see
[Set up pull request delivery](/ske/operations/pull-request-delivery).

## Configuring

```yaml
apiVersion: platform.kratix.io/v1alpha1
kind: GitStateStore
metadata:
  name: production
spec:
  # url, branch, authMethod and secretRef as usual
  delivery:
    mode: pullRequest
    config:
      provider: github
      checkInterval: 30s
      apiURL: https://github.example.com/api/v3
```

| Field | Required | Description |
| --- | --- | --- |
| `delivery.mode` | Yes | `pullRequest`. |
| `delivery.config.provider` | Yes | `github`, for github.com and GitHub Enterprise Server. |
| `delivery.config.checkInterval` | No | How often SKE checks each open pull request, as a duration such as `30s` or `2m`. Defaults to `30s`. |
| `delivery.config.apiURL` | No | The GitHub API address. Defaults to `https://api.github.com` for github.com, and `https://<host>/api/v3` for any other host. Must be on the same host as `spec.url`. |

`authMethod: ssh` is not supported, because SKE needs a token to call the GitHub API. Use
`basicAuth` or `githubApp` instead.

Destinations with `filepath.mode: aggregatedYAML` are not supported.

## How a change is written

For each change, SKE pushes the files to a `kratix/<WORKPLACEMENT_NAME>` branch and opens a pull
request from it into the Destination's branch. SKE then checks the pull request every
`checkInterval`:

- **Merged:** the change is done, and the request's next pipeline runs.
- **Closed without merging:** the change is rejected, and later pipelines for that request do not
  run.

When you turn pull request delivery on for a `GitStateStore` that already has requests, SKE opens
a pull request only for requests whose files differ from the Destination's branch.

## Status

### Resource requests

The request's `STATUS` column shows where its change is, cut to 120 characters:

| `STATUS` | Meaning |
| --- | --- |
| `Waiting for approval: <URL>` | A pull request is open. |
| `Rejected in <URL>: "<COMMENT>"` | A reviewer closed the pull request with a comment. |
| `Rejected in <URL> with no comment` | A reviewer closed the pull request without a comment. |
| `Waiting for approval to remove: <URL>` | The request was deleted and its removal pull request is open. |
| `Removal rejected; the workloads are still on <DESTINATION>. Rejected in <URL>...` | A reviewer closed the removal pull request without merging it. |

`kubectl describe` shows the full text in the `Reconciled` and `WorksSucceeded` conditions. The
`Reconciled` condition's reason tells tools and portals which case applies:

| Reason | Status | Meaning |
| --- | --- | --- |
| `WorksAwaitingDelivery` | `Unknown` | A pull request is open. |
| `WorksRejected` | `False` | A pull request was closed without being merged. |
| `Reconciled` | `True` | Every pull request for this request has been merged. |

SKE quotes the comment the reviewer left when closing the pull request, up to 500 characters. It
does not quote review comments. Anyone who can read the resource request can read the quote and
the link, even without access to the repository.

### WorkPlacements and Works

Each WorkPlacement holds the link to its pull request in `status.deliveryURL`, and
`status.deliveryRemoval` is `true` when that pull request is a removal. Its `WriteSucceeded`
condition has one of these reasons:

| Reason | Status | Meaning |
| --- | --- | --- |
| `WorkloadsAwaitingDelivery` | `Unknown` | The pull request is open. |
| `WorkloadsWrittenToStateStore` | `True` | The pull request was merged. |
| `WorkloadsRejected` | `False` | The pull request was closed without being merged. |

Each Work's `WriteSucceeded` condition sums up its WorkPlacements, with the reasons
`WorkplacementsAwaitingDelivery` and `WorkplacementsRejected`. `status.workPlacementStatuses`
lists each WorkPlacement with its Destination, status and `deliveryURL`.

## When a request changes under review

If a request changes while its pull request is open, SKE compares the new files with the open pull
request:

- **The files are different:** SKE closes the open pull request and opens a new one. Reviews on the
  old pull request do not carry over.
- **The files are the same:** SKE keeps the open pull request and its reviews.
- **The request changed back to what is already merged:** SKE closes the pull request, because it
  is no longer needed, and the request becomes ready.

## Retrying a rejected change

A rejected change stays rejected until the request produces different files. To make SKE try
again with the same files, label the request's Work with `kratix.io/redeliver=true`. For each
labelled Work, SKE:

- **After a rejected pull request**, opens a new pull request.
- **After a rejected removal**, opens a new removal pull request.
- **While a pull request is open**, does nothing.
- **When everything is merged**, does nothing, unless the files on the Destination's branch have
  changed.

## Conflicts

If a pull request has merge conflicts, SKE rebuilds it on top of the latest Destination's branch.
The pull request keeps its number and link. Depending on your branch protection rules, GitHub may
dismiss its existing approvals.

SKE does not touch a pull request that is only behind the Destination's branch, or that has
failing checks. If you resolve the conflicts yourself, SKE leaves the pull request alone.

## Changes made by hand

SKE overrides any changes made to its `kratix/<WORKPLACEMENT_NAME>` branches. If someone changes
SKE's files on the Destination's branch, SKE opens a new pull request to put them back.

## Deleting a request

Deleting a request opens a pull request that removes its files from the Destination's branch. The
request is only removed when that pull request is merged. If the request still has an open pull
request, SKE closes it. If none of the request's files were ever merged, the request is removed
straight away.

### When a removal is rejected

If a reviewer closes the removal pull request without merging it, the request stays and its
workloads keep running. To retry, see [Retrying a rejected change](#retrying-a-rejected-change).

To remove the request and leave its files on the Destination's branch, remove the finalizers from
its WorkPlacements:

```bash
kubectl get workplacements --all-namespaces \
  -o custom-columns=NAMESPACE:.metadata.namespace,NAME:.metadata.name,REQUEST:.spec.resourceName \
  | grep <RESOURCE_NAME>

kubectl patch workplacement <WORKPLACEMENT_NAME> -n <NAMESPACE> \
  --type=json -p='[{"op": "remove", "path": "/metadata/finalizers"}]'
```

### Deleting a Promise or Destination

- **Deleting a Promise** waits for the removal pull request of every request. One rejected removal
  keeps the Promise.
- **Deleting a Destination with `cleanup: all`** waits for a removal pull request for each of its
  WorkPlacements. With `cleanup: none`, SKE leaves the files on the branch.

## Turning pull request delivery off

When you remove the `delivery` block, SKE writes every request straight to the Destination's
branch again, including requests waiting for approval or rejected. A rejected removal stays
rejected; see [When a removal is rejected](#when-a-removal-is-rejected).

SKE does not close the pull requests that were open. You must close them yourself.

## Related docs

- [Set up pull request delivery](/ske/operations/pull-request-delivery)
- [GitStateStore](/main/reference/statestore/gitstatestore)
- [Work status and events](/main/platform-concepts/kratix-resources/work-status-events)
