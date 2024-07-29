---
title: Uninstalling Kratix
sidebar_position: 100
sidebar_label: Uninstalling Kratix
description: Learn more about how to uninstall Kratix
---

## Platform cluster

To uninstall Kratix you need to run through the following steps:
1. Delete all installed Promises:
    ```bash
    kubectl --context $PLATFORM delete promises --all -A
    ```
    This will remove all of the Resource workloads from your [State Store](./statestore/intro).

1. Delete all other Kratix resources:
    ```bash
    kubectl --context $PLATFORM delete destinations --all -A
    kubectl --context $PLATFORM delete bucketstatestores --all -A
    kubectl --context $PLATFORM delete gitstatestores --all -A
    ```

1. Kratix can now be uninstalled:
    ```bash
    kubectl delete -f https://github.com/syntasso/kratix/releases/latest/download/kratix.yaml
    ```

## Worker Destination
In the previous steps Kratix will have deleted all the Resource workloads from the State Store,
which will result in them being deleting from the worker Destination. The only changes
that need to be made on the worker is deleting Flux (if installed just for Kratix)
and the Flux resources that sync down from the State Store.

1. Find the relevant `Kustomization` resource:
    ```bash
    kubectl --context $WORKER get kustomizations -A
    ```
1. Delete the Kustomizations that are for Kratix.
    ```bash
    kubectl --context $WORKER delete kustomization <name>
    ```
1. Find the relevant `Bucket` or `GitRepository` resource:
    ```bash
    kubectl --context $WORKER get buckets,gitrepositories -A
    ```
1. Delete the ones that are for Kratix.
    ```bash
    kubectl --context $WORKER delete bucket/gitrepositories <name>
    ```

## State Store
The [State Store](./statestore/intro) should now be empty, verify
this manually. In the event any files are left behind they can manually be deleted.
