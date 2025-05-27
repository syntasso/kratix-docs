# kratix init tf-module-promise
Initialize a Promise from a Terraform Module stored in Git

## Description
Initialize a Promise from a Terraform Module stored in Git

## Usage
```
kratix init tf-module-promise [flags]
```

## Examples
```
# Initialize a Promise from a Terraform Module in git
kratix init tf-module-promise vpc --module-version v5.19.0 --module-source https://github.com/terraform-aws-modules/terraform-aws-vpc.git --group syntasso.io --kind VPC --version v1alpha1
```

## Flags
```
-h, --help                    help for tf-module-promise
-s, --module-source string    source of the terraform module
-m, --module-version string   version of the terraform module
```

## Global
```
-d, --dir string       The output directory to write the Promise structure to; defaults to '.' (default ".")
-g, --group string     The API group for the Promise
-k, --kind string      The kind to be provided by the Promise
    --plural string    The plural form of the kind. Defaults to the kind name with an additional 's' at the end.
    --split            Split promise.yaml file into multiple files.
-v, --version string   The group version for the Promise. Defaults to v1alpha1
```

## See Also

* [kratix init](/main/kratix-cli/reference/kratix-init): Command used to initialize Kratix resources

