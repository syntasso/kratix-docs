# kratix init crossplane-promise
Initialize a new Promise from a Crossplane XRD

## Description
Initialize a new Promise from a Crossplane XRD

## Usage
```bash
kratix init crossplane-promise [flags]
```

## Examples
```bash
# initialize a new promise from a Crossplane XRD and Composition
kratix init crossplane-promise s3buckets --xrd xrd.yaml --group syntasso.io --kind S3Bucket --dir --compositions composition.yaml
```

## Flags
```bash
-c, --compositions string   Filepath to the Compositions file. Can contain a single Composition or multiple Compositions.
-h, --help                  help for crossplane-promise
-s, --skip-dependencies     Skip generating dependencies. For when the XRD and Compositions are already deployed to Crossplane
-x, --xrd string            Filepath to the XRD file
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

