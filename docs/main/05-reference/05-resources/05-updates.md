---
title: Updates
sidebar_label: Updates
description: Documentation on how updates behaviour for resources
---

# Updates

Kratix supports updating resources with new specifications. An update to a resource
will trigger the configure pipeline to run again, and resources outputted will replace
all of the previously outputted resources in the StateStore.

If an update to a resource changes the destination (e.g. the workflow outputs a
different `/kratix/metadata/destination-selectors.yaml`) the change will be
**ignored**. The destination selected at the first the workflow run is always
used. To move a resource from one destination to another you can delete and
create it again.

## Manually trigger configure workflow
If you want to manually trigger the configure workflow for a resource you can add
the `kratix.io/manual-reconciliation: true` labels to the resource. Kratix will detect
this labels, trigger the configure workflow and remove the label from the resource.
