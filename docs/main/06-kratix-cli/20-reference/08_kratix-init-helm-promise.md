# kratix init helm-promise
Initialize a new Promise from a Helm chart

## Description
Initialize a new Promise from a Helm Chart

## Usage
```bash
kratix init helm-promise PROMISE-NAME --chart-url HELM-CHART-URL --group PROMISE-API-GROUP --kind PROMISE-API-KIND [--chart-version] [flags]
```

## Examples
```bash
# initialize a new promise from an OCI Helm Chart
kratix init helm-promise jenkins --chart-url oci://ghcr.io/jenkinsci/helm-charts/jenkins [--chart-version] --group syntasso.io --kind cicd

# initialize a new promise from a Helm Chart repository
kratix init helm-promise postgresql --chart-url https://fluxcd-community.github.io/helm-charts --chart-name flux2 [--chart-version] --group syntasso.io --kind database

# initialize a new promise from a Helm Chart tar URL
kratix init helm-promise postgresql --chart-url https://github.com/stefanprodan/podinfo/raw/gh-pages/podinfo-0.2.1.tgz --group syntasso.io --kind database
```

## Flags
```bash
--chart-name string      The Helm chart name. Required when using Helm repository
--chart-url string       The URL (supports OCI and tarball) of the Helm chart
--chart-version string   The Helm chart version. Default to latest
-h, --help                   help for helm-promise
```

## Global
```bash
-d, --dir string       The output directory to write the Promise structure to; defaults to '.' (default ".")
-g, --group string     The API group for the Promise
-k, --kind string      The kind to be provided by the Promise
--plural string    The plural form of the kind. Defaults to the kind name with an additional 's' at the end.
--split            Split promise.yaml file into multiple files.
```

## See Also

* [kratix init](/main/kratix-cli/reference/kratix-init): Command used to initialize Kratix resources

