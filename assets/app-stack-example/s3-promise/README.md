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

For this example, the S3 Promise is configured to surface the Terraform output `s3_bucket_arn` back to the Resource status. It does not request `s3_bucket_id`.

This is done in two parts:

- `MODULE_OUTPUT_NAMES` is set to `s3_bucket_arn`
- a second `resource.configure` Pipeline runs `ghcr.io/syntasso/ske-tfstate-finder:v0.7.3` to write the Terraform output back to status

## Updating Dependencies

TBD
