# kratix init promise
Initialize a new Promise

## Description
Initialize a new Promise within the current directory, with all the necessary files to get started

## Usage
```bash
kratix init promise PROMISE-NAME --group PROMISE-API-GROUP --kind PROMISE-API-KIND [flags]
```

## Examples
```bash
# initialize a new promise with the api group and provided kind
kratix init promise postgresql --group syntasso.io --kind database

# initialize a new promise with the specified version
kratix init promise postgresql --group syntasso.io --kind database --version v1
```

## Flags
```bash
-h, --help   help for promise
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

