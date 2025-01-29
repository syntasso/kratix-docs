# ske upgrade

Upgrade SKE to the next minor at the latest patch

## Description

```bash
 > ske upgrade

Upgrading SKE from v0.9.0 to v0.10.0...
Upgrade applied
Waiting for SKE Deployment to be ready..............
SKE Deployment ready, running version v0.10.0
Waiting for post-upgrade checks...
  Waiting for Promise Configure workflows to complete...
    Promise Configure workflows: 1 in progress
    Promise Configure workflows: 1 in progress
    Promise Configure workflows: 1 in progress
    Promise Configure workflows: 1 in progress
    Promise Configure workflows: 1 in progress
  All Promise Configure workflows completed successfully
  Waiting for Resource Configure workflows to complete...
    Resource Configure workflows: 1 in progress
    Resource Configure workflows: 1 in progress
  All Resource Configure workflows completed successfully
Post-upgrade checks succeeded
Waiting for SKE to be ready....
SKE is ready, running version v0.10.0
Upgrade successful!
```

## Usage

```bash
ske upgrade [--context] [flags]
```

## Flags

```bash
      --dry-run            Dry run the upgrade
  -h, --help               help for upgrade
      --skip-all-checks    Skipping all pre- and post-upgrade checks; use with caution
      --timeout duration   Timeout for the upgrade (default 5m0s)
```

## See Also

* [ske](/ske/ske-cli/reference/ske): The ske CLI
