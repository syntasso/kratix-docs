# kratix init
Command used to initialize Kratix resources

## Description
Command used to initialize Kratix resources"

## Usage
```
kratix init [command]
```


## Flags
```
-d, --dir string       The output directory to write the Promise structure to; defaults to '.' (default ".")
-g, --group string     The API group for the Promise
-h, --help             help for init
-k, --kind string      The kind to be provided by the Promise
--plural string    The plural form of the kind. Defaults to the kind name with an additional 's' at the end.
--split            Split promise.yaml file into multiple files.
-v, --version string   The group version for the Promise. Defaults to v1alpha1
```


## See Also

* [kratix](/main/kratix-cli/reference/kratix): The kratix CLI
* [kratix init crossplane-promise](/main/kratix-cli/reference/kratix-init-crossplane-promise): Initialize a new Promise from a Crossplane XRD
* [kratix init helm-promise](/main/kratix-cli/reference/kratix-init-helm-promise): Initialize a new Promise from a Helm chart
* [kratix init operator-promise](/main/kratix-cli/reference/kratix-init-operator-promise): Generate a Promise from a given Kubernetes Operator.
* [kratix init promise](/main/kratix-cli/reference/kratix-init-promise): Initialize a new Promise
* [kratix init tf-module-promise](/main/kratix-cli/reference/kratix-init-tf-module-promise): Initialize a Promise from a Terraform Module stored in Git
