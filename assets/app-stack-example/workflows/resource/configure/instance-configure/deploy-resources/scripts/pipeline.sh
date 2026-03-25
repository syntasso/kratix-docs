#!/usr/bin/env sh

set -eu

app_name="$(yq eval '.metadata.name' /kratix/input/object.yaml)"
app_namespace="$(yq eval '.metadata.namespace // "default"' /kratix/input/object.yaml)"
app_image="$(yq eval '.spec.image' /kratix/input/object.yaml)"

cat > /kratix/output/runtime-request.yaml <<EOF
apiVersion: marketplace.kratix.io/v1alpha1
kind: Runtime
metadata:
  name: ${app_name}
  namespace: ${app_namespace}
  labels:
    kratix.io/component-of-promise-name: app-stack
    kratix.io/component-of-resource-name: ${app_name}
    kratix.io/component-of-resource-namespace: ${app_namespace}
spec:
  lifecycle: dev
  image: ${app_image}
  servicePort: 8000
  replicas: 1
  applicationEnv:
    - name: PORT
      value: "8000"
EOF

database_driver="$(yq eval '.spec.database.driver // ""' /kratix/input/object.yaml)"
database_name="${app_name}-db"

if [ "${database_driver}" = "postgresql" ]; then
  database_secret_name="${app_name}.${app_name}-${database_name}-postgresql.credentials.postgresql.acid.zalan.do"
  database_host="${app_name}-${database_name}-postgresql.default.svc.cluster.local"

  cat > /kratix/output/postgresql-request.yaml <<EOF
apiVersion: marketplace.kratix.io/v1alpha2
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

  cat >> /kratix/output/runtime-request.yaml <<EOF
    - name: PGHOST
      value: ${database_host}
    - name: DBNAME
      value: ${database_name}
    - name: PGUSER
      valueFrom:
        secretKeyRef:
          name: ${database_secret_name}
          key: username
    - name: PGPASSWORD
      valueFrom:
        secretKeyRef:
          name: ${database_secret_name}
          key: password
EOF
fi


bucket_name="$(yq eval '.spec.bucket.name // ""' /kratix/input/object.yaml)"
if [ -n "${bucket_name}" ]; then
  bucket_public="$(yq eval '.spec.bucket.public // false' /kratix/input/object.yaml)"
  bucket_arn="arn:aws:s3:::${bucket_name}"

  cat > /kratix/output/bucket-request.yaml <<EOF
apiVersion: example.kratix.io/v1alpha1
kind: bucket
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

  cat >> /kratix/output/runtime-request.yaml <<EOF
    - name: BUCKET_NAME
      value: ${bucket_name}
    - name: BUCKET_ARN
      value: ${bucket_arn}
EOF
fi
