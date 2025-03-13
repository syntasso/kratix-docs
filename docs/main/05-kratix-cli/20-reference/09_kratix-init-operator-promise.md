# kratix init operator-promise
Generate a Promise from a given Kubernetes Operator.

## Description
Generate a Promise from a given Kubernetes Operator.

## Usage
```
kratix init operator-promise PROMISE-NAME --group PROMISE-API-GROUP --version PROMISE-API-VERSION --kind PROMISE-API-KIND --operator-manifests OPERATOR-MANIFESTS-DIR --api-schema-from CRD-NAME [flags]
```


## Flags
```
-a, --api-schema-from string      The name of the CRD which the Promise API schema should be generated from.
-h, --help                        help for operator-promise
-m, --operator-manifests string   The path to the directory containing the operator manifests.
```

## Global
```
-d, --dir string       The output directory to write the Promise structure to; defaults to '.' (default ".")
-g, --group string     The API group for the Promise
-k, --kind string      The kind to be provided by the Promise
--plural string    The plural form of the kind. Defaults to the kind name with an additional 's' at the end.
--split            Split promise.yaml file into multiple files.
```

## See Also

* [kratix init](/main/kratix-cli/reference/kratix-init): Command used to initialize Kratix resources

