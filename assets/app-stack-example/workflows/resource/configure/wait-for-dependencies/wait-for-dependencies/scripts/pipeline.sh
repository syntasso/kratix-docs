#!/usr/bin/env sh

set -eu

app_name="$(yq eval '.metadata.name' /kratix/input/object.yaml)"
app_namespace="$(yq eval '.metadata.namespace // "default"' /kratix/input/object.yaml)"

bucket_requested="$(yq eval '.status.dependencies.bucket.requested // false' /kratix/input/object.yaml)"
bucket_request_name="$(yq eval '.status.dependencies.bucket.requestName // ""' /kratix/input/object.yaml)"

database_requested="$(yq eval '.status.dependencies.database.requested // false' /kratix/input/object.yaml)"
database_name="$(yq eval '.status.dependencies.database.requestName // ""' /kratix/input/object.yaml)"

mkdir -p /kratix/metadata
tmp_dir="$(mktemp -d)"
# trap 'rm -rf "${tmp_dir}"' EXIT

bucket_ready=false
bucket_arn=""

database_ready=false
database_host=""
database_db_name=""
database_secret_name=""

wait_messages=""

append_wait_message() {
  message="$1"
  if [ -z "${wait_messages}" ]; then
    wait_messages="${message}"
  else
    wait_messages="${wait_messages}; ${message}"
  fi
}

if [ "${bucket_requested}" = "true" ]; then
  if [ -z "${bucket_request_name}" ]; then
    append_wait_message "bucket requested but no requestName recorded in status"
  elif kubectl get bucket "${bucket_request_name}" -n "${app_namespace}" -o yaml > "${tmp_dir}/bucket.yaml" 2>/dev/null; then
    bucket_configure_completed="$(
      yq eval '.status.conditions[]? | select(.type == "ConfigureWorkflowCompleted") | .status' "${tmp_dir}/bucket.yaml" \
      | tail -n 1
    )"
    bucket_arn_key="s3_${app_namespace}_${bucket_request_name}_s3_bucket_arn"
    bucket_arn="$(
      yq eval ".status.outputs.tfe[\"${bucket_arn_key}\"] // \"\"" "${tmp_dir}/bucket.yaml"
    )"

    if [ "${bucket_configure_completed}" = "True" ] && [ -n "${bucket_arn}" ]; then
      bucket_ready=true
    else
      append_wait_message "bucket ${bucket_request_name} is not ready or ARN has not been surfaced yet"
    fi
  else
    append_wait_message "bucket ${bucket_request_name} does not exist yet"
  fi
fi

if [ "${database_requested}" = "true" ]; then
  if [ -z "${database_name}" ]; then
    append_wait_message "database requested but no requestName recorded in status"
  elif kubectl get postgresql "${database_name}" -n "${app_namespace}" -o yaml > "${tmp_dir}/postgresql.yaml" 2>/dev/null; then
    database_ready_condition="$(
      yq eval '.status.conditions[]? | select(.type == "Ready") | .status' "${tmp_dir}/postgresql.yaml" \
      | tail -n 1
    )"

    database_db_name="$(
      yq eval '.status.dbName // .status.connectionDetails.dbName // ""' "${tmp_dir}/postgresql.yaml"
    )"
    if [ -z "${database_db_name}" ]; then
      database_db_name="${database_name}"
    fi

    database_host="$(
      yq eval '.status.host // .status.connectionDetails.host // ""' "${tmp_dir}/postgresql.yaml"
    )"
    if [ -z "${database_host}" ]; then
      database_host="${app_name}-${database_name}-postgresql.default.svc.cluster.local"
    fi

    database_secret_name="$(
      yq eval '.status.secretName // .status.connectionDetails.secretName // ""' "${tmp_dir}/postgresql.yaml"
    )"
    if [ -z "${database_secret_name}" ]; then
      database_secret_name="${app_name}.${app_name}-${database_name}-postgresql.credentials.postgresql.acid.zalan.do"
    fi

    if [ "${database_ready_condition}" = "True" ] && kubectl get secret "${database_secret_name}" -n "${app_namespace}" >/dev/null 2>&1; then
      database_ready=true
    else
      append_wait_message "postgresql ${database_name} is not ready or credentials Secret ${database_secret_name} is missing"
    fi
  else
    append_wait_message "postgresql ${database_name} does not exist yet"
  fi
fi

if [ -n "${wait_messages}" ]; then
  status_message="Waiting for dependencies"
else
  status_message="Dependencies ready"
fi

cat > /kratix/metadata/status.yaml <<EOF
message: ${status_message}
dependencies:
  bucket:
    requested: ${bucket_requested}
    requestName: "${bucket_request_name}"
    ready: ${bucket_ready}
    arn: "${bucket_arn}"
  database:
    requested: ${database_requested}
    requestName: "${database_name}"
    ready: ${database_ready}
    host: "${database_host}"
    dbName: "${database_db_name}"
    secretName: "${database_secret_name}"
EOF

if [ -n "${wait_messages}" ]; then
  cat > /kratix/metadata/workflow-control.yaml <<EOF
retryAfter: 30s
maxAttempts: 60
suspend: false
message: "${wait_messages}"
EOF
fi
