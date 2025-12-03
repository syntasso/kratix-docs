# kratix init tf-module-promise
Initialize a Promise from a Terraform Module stored in Git or Terraform registry.

## Description
Initialize a Promise from a Terraform Module stored in Git or Terraform registry.

## Usage
```
kratix init tf-module-promise [flags]
```

## Examples
```
# Initialize a Promise from a Terraform Module in git
kratix init tf-module-promise vpc \
  --module-source "git::https://github.com/terraform-aws-modules/terraform-aws-vpc.git?ref=v5.19.0" \
  --group syntasso.io \
  --kind VPC \
  --version v1alpha1

# Initialize a Promise from a Terraform Module in git with a specific path, e.g. path being 'modules/api-gateway'
kratix init tf-module-promise gateway \
  --module-source "git::https://github.com/GoogleCloudPlatform/cloud-foundation-fabric.git//modules/api-gateway?ref=v44.1.0" \
  --group syntasso.io \
  --kind Gateway \
  --version v1alpha1

# Initialize a Promise from a Terraform Module in Terraform registry
# Note that if this is a private module, ensure your system is logged in to the registry with the 'terraform login' command
kratix init tf-module-promise iam \
  --module-source terraform-aws-modules/iam/aws \
  --module-version 6.2.3 \
  --group syntasso.io \
  --kind IAM \
  --version v1alpha1
```

## Flags
```
-h, --help                    help for tf-module-promise
-s, --module-source string    source of the terraform module
-m, --module-version string   (Optional) version of the terraform module; only use when pulling modules from Terraform registry
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

