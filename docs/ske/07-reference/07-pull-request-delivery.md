---
description: Settings, status fields and behaviour of SKE pull request delivery on a GitStateStore.
title: Pull request delivery
id: pull-request-delivery
slug: "/ske/reference/pull-request-delivery"
sidebar_label: "Pull request delivery"
sidebar_position: 6.5
---

# Pull request delivery

A `GitStateStore`'s delivery mode controls how Kratix writes to it. Pull request delivery is an
SKE delivery mode: instead of pushing to the Destination's branch, SKE opens a pull request for each
change and waits for someone to merge or close it. To turn it on and use it, see
[Set up pull request delivery](/ske/operations/pull-request-delivery). This page lists the
settings, the status SKE reports, and what SKE does in less common situations.

## Settings

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
| `delivery.config.checkInterval` | No | How often SKE checks each open pull request, as a duration such as `30s` or `2m`. Must be positive. Defaults to `30s`. |
| `delivery.config.apiURL` | No | The GitHub API address. Defaults to `https://api.github.com` for github.com, and `https://<host>/api/v3` for any other host. It must be on the same host as `spec.url`, so that the repository's credentials are not sent anywhere else. |

The `GitStateStore` must use `authMethod: basicAuth`, with the token in the Secret's `password`,
or `authMethod: githubApp`.

A Destination with `filepath.mode: aggregatedYAML` cannot use a `GitStateStore` that has a
`delivery` block. Kratix refuses to create or update either the Destination or the
`GitStateStore` if the change would put them together, with an error such as:

```text
filepath.mode aggregatedYAML cannot be used with a state store that has a delivery mode (GitStateStore/production has delivery.mode "pullRequest")
```

## How SKE writes a change

For each WorkPlacement whose files differ from the Destination's branch, SKE:

1. Writes the files to a `kratix/<WORKPLACEMENT_NAME>` branch, force-pushing if the branch exists.
2. Opens a pull request from that branch into the Destination's branch, and records its link in
   the WorkPlacement's `status.deliveryURL`.
3. Checks the pull request every `checkInterval`:
   - **Merged:** the WorkPlacement succeeds, and the request's next pipeline runs.
   - **Closed without merging:** the WorkPlacement fails, and later pipelines for that request do
     not run.

When a `delivery` block is added to a `GitStateStore` that already has requests, SKE delivers each
of them again, and opens a pull request only for those whose files differ from the Destination's
branch.

SKE recognises its own pull request by a hidden comment in its description that records the files
it proposes. Each time it writes a WorkPlacement's files, SKE keeps the open pull request from its
`kratix/<WORKPLACEMENT_NAME>` branch whose hidden comment matches the files, and closes any other
open pull request from that branch, with a comment saying why. That includes one a person opened
from that branch, one whose hidden comment was edited away, and one into a branch the
`GitStateStore` no longer uses.

## Status

### Resource requests

The request's `STATUS` column says where its change is, and is cut to 120 characters:

| `STATUS` | Meaning |
| --- | --- |
| `Waiting for approval: <URL>` | A pull request is open. |
| `Rejected in <URL>: "<COMMENT>"` | A reviewer closed the pull request with a comment. |
| `Rejected in <URL> with no comment` | A reviewer closed the pull request without a comment. |
| `Waiting for approval to remove: <URL>` | The request was deleted and its removal pull request is open. |
| `Removal rejected; the workloads are still on <DESTINATION>. Rejected in <URL>...` | A reviewer closed the removal pull request without merging it. |

`kubectl describe` shows the full text in the `Reconciled` and `WorksSucceeded` conditions, except
while the request is being deleted. A request scheduled to several Destinations names each
Destination in `WorksSucceeded`. When a Promise has several configure pipelines, the Promise's own
`Reconciled` condition shows the text too while a later pipeline waits for an earlier one's pull
request.

The `Reconciled` condition's reason tells tools and portals which case applies, for new requests
and deleted ones alike:

| Reason | Status | Meaning |
| --- | --- | --- |
| `WorksAwaitingDelivery` | `Unknown` | A pull request is open and waiting for review. |
| `WorksRejected` | `False` | A pull request was closed without being merged. |
| `Reconciled` | `True` | Every pull request for this request has been merged. |

### Rejection comments

SKE quotes only the comment that the person who closed the pull request left as they closed it,
up to 500 characters, on one line. It does not quote review comments, such as a **Request changes**
review. SKE reads the comment once, when it first sees the pull request closed. If the credentials
cannot read comments, the request still shows the rejection, without the quote.

Anyone who can read the resource request can read the quote and the pull request link, even
without access to the repository. The same goes for anywhere the request's status is copied to,
such as Cortex.

### WorkPlacements

Each WorkPlacement holds the link to its pull request in `status.deliveryURL`.
`status.deliveryRemoval` is `true` while the open or rejected pull request is a removal. Its
`WriteSucceeded` condition says where the change is:

```bash
kubectl get workplacement <WORKPLACEMENT_NAME> -n <NAMESPACE> \
  -o jsonpath='{.status.deliveryURL}{"\n"}{.status.conditions[?(@.type=="WriteSucceeded")]}'
```

| Reason | Status | Meaning |
| --- | --- | --- |
| `WorkloadsAwaitingDelivery` | `Unknown` | The pull request is open. |
| `WorkloadsWrittenToStateStore` | `True` | The pull request was merged. |
| `WorkloadsRejected` | `False` | The pull request was closed without being merged. |

### Works

Each Work sums up its WorkPlacements. Its `WriteSucceeded` condition is `Unknown` with reason
`WorkplacementsAwaitingDelivery` while any pull request is open, and `False` with
`WorkplacementsRejected` once one is closed without being merged. `status.workPlacementStatuses`
lists every WorkPlacement of the Work with its Destination, write status, message and
`deliveryURL`:

```bash
kubectl get work <WORK_NAME> -n <NAMESPACE> -o jsonpath='{.status.workPlacementStatuses}'
```

## When a request changes under review

When a request changes while its pull request is open, what SKE does depends on the files the
pipeline produces:

- **Different files.** SKE closes the open pull request with a comment saying the request changed,
  and opens a new one. The request's `STATUS` links the new pull request. Reviews on the old pull
  request do not carry over.
- **The same files.** SKE keeps the open pull request and its reviews.
- **Files the Destination's branch already has.** This happens when the request changes back to
  what is already merged. SKE closes the open pull request with a comment saying the request
  changed, opens no new one, and the request becomes ready.

A pull request SKE closed is out of date, so do not reopen it. If someone reopens or merges it
anyway, SKE does not count it as merged or under review. The next time it writes the request, it compares the
request's files with the Destination's branch again, and opens a new pull request for whatever
still differs.

## After a rejection

A rejection stays until the request produces different files. Running the pipeline again with the
same output keeps the rejection, and so does a restart of SKE or a Destination that is briefly not
ready.

Labelling a Work with `kratix.io/redeliver=true` asks SKE to try again. Kratix passes the label on
to the Work's WorkPlacements and removes it from the Work. To retry only one Destination, label
that WorkPlacement instead. For each labelled WorkPlacement, SKE:

- **After a rejected pull request**, opens a new pull request. It does not reopen the closed one,
  but if a reviewer already reopened it and it proposes the same files, SKE uses that one. The
  request's `STATUS` goes back to `Waiting for approval` with the link.
- **After a rejected removal**, opens a new removal pull request. Merging it deletes the request as
  usual.
- **While a pull request is open**, keeps that pull request and its reviews, and opens no other.
- **When everything is merged**, opens no pull request, unless SKE's files on the branch were edited
  by hand (see [Changes made by hand](#changes-made-by-hand)).

Kratix removes the label from the WorkPlacement once SKE has opened the pull request, or found the
one already open. If that fails, for example because GitHub is unavailable, the label stays and SKE
tries again. To see which WorkPlacements are still waiting to be retried:

```bash
kubectl get workplacements --all-namespaces -l kratix.io/redeliver
```

If the reviewer rejects the new pull request too, the request is rejected again.

## Conflicts

When the Destination's branch changes after SKE opened a pull request, the pull request can end up
with merge conflicts. SKE rebuilds that pull request: it takes the latest commit on the
Destination's branch, writes the request's current files on top of it, and force-pushes the same
`kratix/<WORKPLACEMENT_NAME>` branch. The pull request keeps its number and link. SKE looks for
conflicts every `checkInterval`.

SKE rebuilds a pull request only when it has conflicts. It leaves the pull request alone when:

- **It is only behind the Destination's branch.** Use GitHub's **Update branch** button.
- **Reviews or required checks are missing.**
- **Checks fail.**

Whether a rebuild dismisses the approvals a pull request already has depends on the repository's
branch protection setting "Dismiss stale pull request approvals when new commits are pushed". SKE
does not control it. See GitHub's
[About protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches#require-pull-request-reviews-before-merging).

A rebuild replaces the branch, so any commits someone added to it are lost. If you fix the conflicts
yourself with GitHub's **Resolve conflicts** button, the pull request no longer has conflicts, so SKE
leaves it alone and your version is what gets merged. If that version differs from the request's
files, SKE opens a pull request to put them back the next time it writes the request.

Other cases:

- **Nothing left to change.** If, once rebuilt, the pull request would not change anything on the
  Destination's branch, SKE closes it with a comment saying there is nothing left to review, and
  the request becomes ready.
- **Removal pull requests** are rebuilt the same way. If the Destination's branch no longer has the
  files, SKE closes the removal pull request with a comment saying there is nothing left to remove,
  and the request finishes deleting.
- **The `GitStateStore`'s `branch` changed** since SKE opened the pull request. SKE does not rebuild
  it. It closes it with a comment saying the Destination's branch changed, and opens a new one
  against the new branch.
- **The `delivery` block is removed** during a rebuild. The pull request stays open, like any other
  pull request that was open when pull request delivery was turned off. Close it yourself.

## Changes made by hand

- **Commits on a `kratix/<WORKPLACEMENT_NAME>` branch are lost** the next time SKE opens a pull
  request for that WorkPlacement, or rebuilds its pull request after a conflict, because SKE
  replaces the branch. If the pull request is merged with those commits first, they reach the
  Destination's branch, and the next time SKE writes the request it opens a pull request to remove them.
- **Changes to SKE's files on the Destination's branch are reverted through a pull request.** If
  someone edits or reverts those files directly on the Destination's branch, SKE opens a pull
  request that puts them back the next time it writes the request. The edit stays on the branch until that pull
  request is merged. While it is open, the request's `STATUS` shows `Waiting for approval` again.
  Closing it without merging marks the request as rejected.

SKE writes the request again when its pipeline runs again, or at the platform's
reconciliation interval (every 10 hours by default), whichever comes first.

## Deletion

When a request is deleted, SKE opens a pull request titled
`Kratix: remove <promise> <namespace>/<name> from <destination>` that removes the request's files
from the Destination's branch. The request, and its Works and WorkPlacements, stay until that pull
request is merged. The request's delete pipeline has already run by the time the removal pull
request opens.

SKE handles each Destination and each pipeline on its own:

- **Nothing to remove.** If none of the request's files are on the branch, for example because its
  only pull request was closed without merging, SKE opens no pull request and the request is
  deleted straight away.
- **A pull request still open.** SKE closes it with the comment `Kratix closed this pull request
  because these files are being removed from the Destination.` If nothing from that request was
  ever merged, the request is deleted straight away. Otherwise SKE opens a removal pull request for
  what was merged.

So a request with one pipeline's files merged and another pipeline's pull request still open gets a
removal pull request for the first, and the second is closed.

### When a removal is rejected

If a reviewer closes the removal pull request without merging it, the files stay on the branch and
the workloads keep running. The request stays, marked as being deleted. SKE does not open the
removal pull request again on its own, and whatever the delete pipeline did, such as removing
external resources, is not undone.

While a request is being deleted, `kubectl describe` does not show the full rejection text. The
request's `Reconciled` condition has the same cut text as `STATUS`, and its `WorksSucceeded`
condition still shows the state from before the delete. The full text is on each WorkPlacement's
`WriteSucceeded` condition:

```bash
kubectl get workplacement <WORKPLACEMENT_NAME> -n <NAMESPACE> \
  -o jsonpath='{.status.deliveryURL}{"\n"}{.status.conditions[?(@.type=="WriteSucceeded")].message}'
```

To retry the removal, see [After a rejection](#after-a-rejection). To let the request finish
deleting and keep its files on the branch, remove the finalizers from its WorkPlacements. List them
with the Promise and request names:

```bash
kubectl get workplacements --all-namespaces \
  -o custom-columns=NAMESPACE:.metadata.namespace,NAME:.metadata.name,PROMISE:.spec.promiseName,REQUEST:.spec.resourceName \
  | grep <RESOURCE_NAME>
```

Then, for each one, remove the `finalizers.workplacement.kratix.io/repo-cleanup` finalizer. On a
Destination with `filepath.mode: none`, also remove
`finalizers.workplacement.kratix.io/kratix-dot-files-cleanup`. To remove all of them at once:

```bash
kubectl patch workplacement <WORKPLACEMENT_NAME> -n <NAMESPACE> \
  --type=json -p='[{"op": "remove", "path": "/metadata/finalizers"}]'
```

The request then finishes deleting. Its files stay on the branch until someone removes them by
hand.

The same applies if a reviewer reopens and merges a removal pull request after closing it. The files
go, but the request stays until you remove the finalizers.

### Other deletions

- **Deleting a Promise** deletes its requests, so it waits for every removal pull request. One
  rejected removal keeps the Promise.
- **Deleting a Destination with `cleanup: all`** opens a removal pull request for each
  WorkPlacement, and the Destination waits until all are merged. A rejected one keeps the
  Destination. With `cleanup: none`, the default, SKE deletes the WorkPlacements without removing
  their files. Any removal pull request still open stays open, so close it yourself.
- **A pipeline that stops outputting a workload group** removes it the same way, through a removal
  pull request.

## Turning pull request delivery off

When the `delivery` block is removed, SKE writes every request on the `GitStateStore` again,
straight to the Destination's branch. That includes a request waiting for
approval and a request whose pull request a reviewer rejected.

- **A rejected removal stays rejected.** Remove the finalizers as described in
  [When a removal is rejected](#when-a-removal-is-rejected).
- **An open removal pull request** stays open, and SKE removes the files directly. Close the
  pull request yourself.
- **Open pull requests are not closed.** Merging one later can put files on the branch that no
  request asks for, until the next time SKE writes that request. Each request that had a pull
  request open or rejected gets a `DeliveryModeChanged` warning on its WorkPlacement, with a link to
  the pull request it left behind:

  ```bash
  kubectl get events --all-namespaces --field-selector reason=DeliveryModeChanged
  ```

## Related docs

- [Set up pull request delivery](/ske/operations/pull-request-delivery)
- [GitStateStore](/main/reference/statestore/gitstatestore)
- [Work status and events](/main/platform-concepts/kratix-resources/work-status-events)
