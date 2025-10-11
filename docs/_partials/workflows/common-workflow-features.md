### Multiple Pipelines

Configure workflows can include **multiple** Pipelines which are executed one after another. Each Pipeline writes its output to the Kratix State Store so later Pipelines can depend on the state produced by earlier ones. Containers within a Pipeline also run sequentially. For simple cases a single Pipeline may be enough.

### Pipeline Failures

A Pipeline fails if any of its containers exit with a non‐zero code. When this happens the workflow **halts** — remaining containers and Pipelines are skipped. You can trigger the workflow again by [manually reconciling the object](/main/learn-more/controlling-with-labels).

### Idempotency

Commands run in Configure workflows must be idempotent. Workflows are executed whenever the object is created or updated and may rerun due to controller restarts or the regular reconciliation interval (10 hours by default). Ensure running them multiple times does not cause problems.

## Delete Workflows

Delete workflows run when the Promise or Resource is removed and support only a **single** Pipeline. This Pipeline should clean up any resources created by the configure workflow. Kratix triggers the delete Pipeline exactly once and will not automatically retry it if it fails; handle any retries in the Pipeline itself.
