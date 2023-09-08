---
title: Updates
sidebar_label: Updates
description: Documentation on how updates behave for resources
---

# Updates

Kratix supports updating resources with new specifications. An update to a resource
will trigger the configure pipeline to run again, and resources outputted will replace
all of the previously outputted resources in the StateStore.

If an update to a resource changes the Destination (e.g. the Workflow outputs a
different `/kratix/metadata/destination-selectors.yaml`) the change will be
**ignored**. The Destination selected at the first the Workflow run is always
used. To move a resource from one Destination to another you can delete and
create it again.

## Manually trigger configure Workflow
Sometimes you may want to manually trigger a Configure Workflow for a 
specific resource.

While Workflows only trigger when the contents of the resource `Spec`
change, the Kratix will also look for the appearance of a specific label and
trigger a Configure Workflow if it newly appears.

Therefore, if you add `kratix.io/manual-reconciliation: true` to any resource,
it will immediately schedule a manual run for the Configure Workflow.

To run this again, you would need to remove and re-add the label since only
the new appearance of the label will trigger a manual Configure Workflow run.
