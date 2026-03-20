# kratix init pulumi-component-promise
Preview: Initialize a new Promise from a Pulumi package schema

## Description
Preview: Initialize a new Promise from a Pulumi package schema. This command is in preview, not supported under SLAs, and may change or break without notice.

## Usage
```bash
kratix init pulumi-component-promise PROMISE-NAME --schema PATH_OR_URL --group PROMISE-API-GROUP --kind PROMISE-API-KIND [--component TOKEN] [--version] [--plural] [--split] [--dir DIR] [flags]
```

## Examples
```bash
# initialize a new promise from a local Pulumi package schema
kratix init pulumi-component-promise mypromise --schema ./schema.json --group syntasso.io --kind Database

# initialize a new promise from a remote Pulumi package schema
kratix init pulumi-component-promise mypromise --schema https://www.pulumi.com/registry/packages/aws-iam/schema.json --component aws-iam:index:User --group syntasso.io --kind User
```

## Flags
```bash
--component string   Pulumi component token to use from the schema
-h, --help               help for pulumi-component-promise
--schema string      Path or URL to Pulumi package schema
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

