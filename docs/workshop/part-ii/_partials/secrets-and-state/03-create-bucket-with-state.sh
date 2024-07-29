#!/usr/bin/env sh

set -euxo pipefail

name=$(yq '.metadata.name' /kratix/input/object.yaml)
namespace=$(yq '.metadata.namespace' /kratix/input/object.yaml)

cd resources
terraform init

# Check if the state exists and retrieve it if so
if kubectl get configmap ${name}-state; then
    kubectl get configmap ${name}-state \
        --output=jsonpath='{.data.tfstate}' \
        > state.tfstate
fi

terraform apply \
    -auto-approve \
    --var="bucket_name=${name}.${namespace}" \
    -state=state.tfstate

# Store the state in a ConfigMap
kubectl create configmap ${name}-state \
    --from-file=tfstate=state.tfstate \
    --dry-run=client \
    --output=yaml > configmap.yaml
kubectl replace --filename configmap.yaml --force
