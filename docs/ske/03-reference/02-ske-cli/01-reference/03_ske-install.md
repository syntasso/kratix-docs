# ske install
install the latest SKE operator and SKE

## Description
install the latest SKE operator and SKE

## Usage
```
ske install --access-token=MY_TOKEN [--context] [flags]
```

## Examples
```
# Install SKE at the latest version
ske install --access-token="myaccesstoken" --context kind-platform
Syntasso helm chart registry 'https://syntasso.github.io/helm-charts' added.

Installing SKE operator helm chart
SKE successfully installed; SKE version: v0.1.0, SKE operator version: v0.2.0
```

## Flags
```
--access-token string   Token to access SKE resources
-h, --help                  help for install
--timeout duration      Timeout for the install (default 5m0s)
```


## See Also

* [ske](/ske/reference/ske-cli/reference/ske): The ske CLI

