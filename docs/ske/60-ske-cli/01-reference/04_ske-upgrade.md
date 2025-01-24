# ske upgrade

Upgrade SKE to the next minor at the latest patch

## Description
```
 > ske upgrade

Upgrading SKE from v0.9.0 to v0.10.0...
Upgrade applied
Waiting for SKE Deployment to be ready..............
SKE Deployment ready, running version v0.10.0
Waiting for SKE to be ready....
SKE is ready, running version v0.10.0
Upgrade successful!
```

## Usage
```
ske upgrade [--context] [flags]
```


## Flags
```
      --dry-run            Dry run the upgrade
  -h, --help               help for upgrade
      --skip-all-checks    Skipping upgrade checks; use with caution
      --timeout duration   Timeout for the upgrade (default 5m0s)
```


## See Also

* [ske](/ske/ske-cli/reference/ske): The ske CLI

