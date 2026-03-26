# Promise Template

This Promise was generated with:

```
kratix init tf-module-promise s3-bucket --module-source terraform-aws-modules/s3-bucket/aws --module-registry-version 3.7.0 --group example.kratix.io --kind S3Bucket
```

## Updating API properties

To update the Promise API, you can use the `kratix update api` command:

```
kratix update api --property name:string --property region- --kind S3Bucket
```

## Updating Workflows

To add workflow containers, you can use the `kratix add container` command:

```
kratix add container resource/configure/pipeline0 --image syntasso/postgres-resource:v1.0.0
```

For this example, the S3 Promise is configured to surface the Terraform outputs `s3_bucket_arn`, `s3_bucket_id`, and `s3_bucket_bucket_domain_name` back to the Resource status.

This is done in two parts:

- `MODULE_OUTPUT_NAMES` is set to `s3_bucket_arn,s3_bucket_id,s3_bucket_bucket_domain_name`
- a second `resource.configure` Pipeline runs `ghcr.io/syntasso/ske-tfstate-finder:v0.7.3` to write the Terraform output back to status

For the `app-stack` example, treat the surfaced ARN as coming from:

```yaml
status:
  outputs:
    tfe:
      s3_<namespace>_<resource-name>_s3_bucket_arn: arn:aws:s3:::<bucket-name>
```

For example, a request named `my-bucket` in the `default` namespace would surface:

```yaml
status:
  outputs:
    tfe:
      s3_default_my-bucket_s3_bucket_arn: arn:aws:s3:::my-bucket
```

For `app-stack`, consider the bucket ready only when both of these are true:

- the bucket resource itself is ready
- `status.outputs.tfe.s3_<namespace>_<resource-name>_s3_bucket_arn` exists

## Updating Dependencies

TBD
