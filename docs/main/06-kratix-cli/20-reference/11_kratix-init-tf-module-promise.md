# kratix init tf-module-promise
Initialize a Promise from a Terraform module

## Description
Initialize a Promise from a Terraform module.
This commands relies on the Terraform CLI being installed and available in your PATH. It can be used
to pull modules from Git, Terraform registry, or a local directory.
To pull modules from private registries, ensure your system is logged in to the registry with the 'terraform login' command.

## Usage
```bash
kratix init tf-module-promise [flags]
```

## Examples
```bash
# Initialize a Promise from a Terraform Module in git
kratix init tf-module-promise vpc \

--module-source "git::https://github.com/terraform-aws-modules/terraform-aws-vpc.git?ref=v5.19.0" \
--group syntasso.io \

--kind VPC \
--version v1alpha1

# Initialize a Promise from a Terraform Module in git with a specific path
kratix init tf-module-promise gateway \

--module-source "git::https://github.com/GoogleCloudPlatform/cloud-foundation-fabric.git//modules/api-gateway?ref=v44.1.0" \
--group syntasso.io \

--kind Gateway \
--version v1alpha1

# Initialize a Promise from a Terraform Module in Terraform registry
kratix init tf-module-promise iam \

--module-source terraform-aws-modules/iam/aws \
--module-registry-version 6.2.3 \

--group syntasso.io \
--kind IAM \

--version v1alpha1
```

## Flags
```bash
-h, --help                             help for tf-module-promise
-r, --module-registry-version string   (Optional) version of the Terraform module from a registry; only use when pulling modules from Terraform registry
-s, --module-source source             Source of the terraform module.
This can be a Git URL, Terraform registry path, or a local directory path.
It follows the same format as the source argument in the Terraform module block.
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

