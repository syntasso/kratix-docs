#!/usr/bin/env sh

set -ex

image="$(yq eval '.spec.image' /kratix/input/object.yaml)"

echo "Scanning ${image}"

if [ $DEBUG = "true" ]; then
  DEBUG_MODE=true
  echo "Running in debug mode"
else 
  DEBUG_MODE=false
fi

TRIVY_DEBUG=$DEBUG_MODE trivy image --format=json --output=results.json "${image}" > results.json

health_state="healthy"

if [ "$(jq '.[] | select(.Vulnerabilities != null) | length' results.json)" != "" ]; then
  health_state="degraded"
fi

resource_name=$(yq '.metadata.name' /kratix/input/object.yaml)
namespace="default"

mkdir -p /kratix/output/platform/

cat <<EOF > /kratix/output/platform/health-record.yaml
apiVersion: platform.kratix.io/v1alpha1
kind: HealthRecord
metadata:
  name: runtime-${resource_name}
  namespace: ${namespace}
data:
  promiseRef:
    name: runtime
  resourceRef:
    name: ${resource_name}
    namespace: ${namespace}
  state: ${health_state}
  lastRun: $(date +%s)
  details:
    results: ""
EOF

cat results.json | yq -P > results.yaml
yq e -i '.data.details.results = load("results.yaml")' /kratix/output/platform/health-record.yaml

cat <<EOF > /kratix/metadata/destination-selectors.yaml
- directory: platform
  matchLabels:
    environment: platform
EOF