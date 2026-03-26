# Promise Template

This Promise was generated with:

```
kratix init promise app-stack  --group example.kratix.io --kind AppStack
```

## Updating API properties

To update the Promise API, you can use the `kratix update api` command:

```
kratix update api \
  --property database.driver:string \
  --property bucket.name:string \
  --property bucket.public:boolean \
  --kind AppStack
```

## Updating Workflows

This example now uses three `resource.configure` Pipelines:

- `create-dependencies`
- `wait-for-dependencies`
- `create-runtime`

You can scaffold them with:

```bash
kratix add container resource/configure/create-dependencies \
 --image ghcr.io/syntasso/kratix-docs/app-stack-create-dependencies:v0.1.0 \
 --name create-dependencies
kratix add container resource/configure/wait-for-dependencies \
 --image ghcr.io/syntasso/kratix-docs/app-stack-wait-for-dependencies:v0.1.0 \
 --name wait-for-dependencies
kratix add container resource/configure/create-runtime \ 
 --image ghcr.io/syntasso/kratix-docs/app-stack-create-runtime:v0.1.0 \
 --name create-runtime
```

Together these Pipelines can output up to three sub-requests:

- a `Bucket` request for the S3 Promise when `spec.bucket` is defined
- a `postgresql` request for the PostgreSQL Promise when `spec.database.driver` is `postgresql`
- a `Runtime` request for the Python application image after requested dependencies are ready

The Python application is expected to read:

- `BUCKET_NAME` when a bucket is requested
- `BUCKET_ARN` when a bucket is requested
- `PGHOST`, `DBNAME`, `PGUSER`, and `PGPASSWORD` when PostgreSQL is requested

from its environment and respond in the browser with a message such as `Hello world, my bucket name is <bucket-name>. My bucket ARN is <bucket-arn>.`

* `create-runtime` reads the resolved values written by `wait-for-dependencies`, so the Runtime request is created only after requested dependencies are ready.

The example application source is in [python-app/app.py](/Users/stella/dev/kratix-docs/assets/app-stack-example/python-app/app.py) and [python-app/Dockerfile](/Users/stella/dev/kratix-docs/assets/app-stack-example/python-app/Dockerfile).

In this asset, `BUCKET_ARN` should come from the surfaced S3 status written by the S3 Promise rather than being derived from the bucket name.
