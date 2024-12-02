---
title: Updates
sidebar_label: Updates
description: Documentation on how updates behave for Resources
---

# Updates

Kratix supports updating Resource Requests with new specifications.

Given that the Resource workflows are defined within the parent Promise, updates to a
Resource Request are limited to updating the request parameters in the `spec`.

## Workflows

Any update to the Resource will result in Kratix re-running the
[Resource Configure](./workflows#configure-workflows) workflow.

Any files which are output by this workflow will replace all existing files associated
with this Resource in the [StateStore](../statestore/intro).

## Scheduling

If an update to a Resource changes its scheduling, the change will be **ignored**.

The Destination selected at the first the Workflow run is always used. To move a Resource
from one Destination to another, you can delete and create it again.

See [Managing Multiple Destinations](../destinations/multidestination-management#resources) for
more details on scheduling.
