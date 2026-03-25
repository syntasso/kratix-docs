# Promise Template

This Promise was generated with:

```
kratix init promise app-stack  --group example.kratix.io --kind AppStack
```

## Updating API properties

To update the Promise API, you can use the `kratix update api` command:

```
kratix update api \
  --property region- \
  --property bucketName- \
  --property image:string \
  --property bucket.name:string \
  --property bucket.public:boolean \
  --kind AppStack
```

## Updating Workflows

To add the compound resource workflow, you can use the `kratix add container` command:

```
kratix add container resource/configure/instance-configure --image ghcr.io/syntasso/kratix-docs/app-stack-example-pipeline:v0.1.0
```

This workflow can output up to three sub-requests:

- a `bucket` request for the S3 Promise when `spec.bucket` is defined
- a `postgresql` request for the PostgreSQL Promise when `spec.database.driver` is `postgresql`
- a `Runtime` request for the Python application image

The Python application is expected to read:

- `BUCKET_NAME` when a bucket is requested
- `BUCKET_ARN` when a bucket is requested
- `PGHOST`, `DBNAME`, `PGUSER`, and `PGPASSWORD` when PostgreSQL is requested

from its environment and respond in the browser with a message such as `Hello world, my bucket name is <bucket-name>. My bucket ARN is <bucket-arn>.`

This simplified asset does not add ordering between those sub-requests, so the Runtime can be created before PostgreSQL is ready.

The example application source is in [python-app/app.py](/Users/stella/dev/kratix-docs/assets/app-stack-example/python-app/app.py) and [python-app/Dockerfile](/Users/stella/dev/kratix-docs/assets/app-stack-example/python-app/Dockerfile).

In this asset, `BUCKET_ARN` is derived from the bucket name as `arn:aws:s3:::<bucket-name>`. If you need the actual Terraform output instead, you would need to surface it from state before starting the Runtime.
