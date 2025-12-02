#!/usr/bin/env sh

set -euxo pipefail

name=$(yq '.metadata.name' /kratix/input/object.yaml)
namespace=$(yq '.metadata.namespace' /kratix/input/object.yaml)

cd resources
terraform init
terraform apply -auto-approve --var="bucket_name=${name}.${namespace}"
