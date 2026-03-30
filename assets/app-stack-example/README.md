# Promise Template

This Promise was generated with:

```
kratix init promise app-stack  --group example.kratix.io --kind AppStack
```

## Updating API properties

To update the Promise API, you can use the `kratix update api` command:

```
kratix update api \
  --property image:string \
  --property database.driver:string \
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
- a `postgresql` request for the PostgreSQL Promise when `spec.database.driver` is `postgresql`
- a `Runtime` request for a TODO application image after requested dependencies are ready

