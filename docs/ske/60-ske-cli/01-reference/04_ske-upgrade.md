# ske upgrade
Upgrade to the next SKE version

## Description
Upgrade to the next SKE version

## Usage
```
ske upgrade [--context] [--version] [flags]
```

## Examples
```
# upgrade to the next minor version
ske upgrade --context kind-platform

# upgrade to a specific version
ske upgrade --context kind-platform --version v0.10.0
```

## Flags
```
--dry-run            Dry run the upgrade
-h, --help           help for upgrade
--skip-all-checks    Skipping upgrade checks; use with caution
--timeout duration   Timeout for the upgrade (default 5m0s)
--version string     The version to upgrade to. Defaults to the next minor version
```


## Global Flags:
```
--context string   Name of the kubeconfig context to use
```

## See Also

* [ske](/ske/ske-cli/reference/ske): The ske CLI

