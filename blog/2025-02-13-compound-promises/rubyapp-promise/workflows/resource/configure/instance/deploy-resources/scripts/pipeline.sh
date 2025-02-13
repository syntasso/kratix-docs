#!/usr/bin/env sh

set -xe

name="$(yq eval '.metadata.name' /kratix/input/object.yaml)"
namespace=$(yq '.metadata.namespace' /kratix/input/object.yaml)

echo "Hello from ${name} ${namespace}"
