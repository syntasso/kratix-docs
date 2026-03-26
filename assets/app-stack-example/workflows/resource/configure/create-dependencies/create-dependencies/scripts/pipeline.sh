#!/usr/bin/env sh

set -eu

app_name="$(yq eval '.metadata.name' /kratix/input/object.yaml)"
app_namespace="$(yq eval '.metadata.namespace // "default"' /kratix/input/object.yaml)"

mkdir -p /kratix/output /kratix/metadata

bucket_requested=false
database_requested=false

bucket_name="$(yq eval '.spec.bucket.name // ""' /kratix/input/object.yaml)"
bucket_public="$(yq eval '.spec.bucket.public // false' /kratix/input/object.yaml)"

if [ -n "${bucket_name}" ]; then
  bucket_requested=true

  cat > /kratix/output/bucket-request.yaml <<EOF
apiVersion: example.kratix.io/v1alpha1
kind: Bucket
metadata:
  name: ${bucket_name}
  namespace: ${app_namespace}
  labels:
    kratix.io/component-of-promise-name: app-stack
    kratix.io/component-of-resource-name: ${app_name}
    kratix.io/component-of-resource-namespace: ${app_namespace}
spec:
  bucketName: ${bucket_name}
  public: ${bucket_public}
EOF
fi


database_driver="$(yq eval '.spec.database.driver // ""' /kratix/input/object.yaml)"
database_name="${app_name}-db"

if [ "${database_driver}" = "postgresql" ]; then
  database_requested=true

  cat > /kratix/output/postgresql-request.yaml <<EOF
apiVersion: marketplace.kratix.io/v1alpha1
kind: postgresql
metadata:
  name: ${database_name}
  namespace: ${app_namespace}
  labels:
    kratix.io/component-of-promise-name: app-stack
    kratix.io/component-of-resource-name: ${app_name}
    kratix.io/component-of-resource-namespace: ${app_namespace}
spec:
  env: dev
  teamId: ${app_name}
  dbName: ${database_name}
EOF
fi

cat > /kratix/metadata/status.yaml <<EOF
message: Dependency requests created
dependencies:
  bucket:
    requested: ${bucket_requested}
    requestName: "${bucket_name}"
  database:
    requested: ${database_requested}
    requestName: "${database_name}"
EOF
