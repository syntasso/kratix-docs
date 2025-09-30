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

# Initialize a Promise from a Terraform Module in git with a specific path
kratix init tf-module-promise gateway --module-version v44.1.0 --module-source https://github.com/GoogleCloudPlatform/cloud-foundation-fabric --group syntasso.io --kind Gateway --version v1alpha1 --module-path modules/api-gateway
```

## Flags
```
-h, --help                    help for tf-module-promise
-p, --module-path string      (Optional) Path within the repository to the terraform module, if the module is not in the root of the repository
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
```

## See Also

* [kratix init](/main/kratix-cli/reference/kratix-init): Command used to initialize Kratix resources

