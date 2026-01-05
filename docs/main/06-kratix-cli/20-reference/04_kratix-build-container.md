# kratix build container
Command to build a container image generated with 'add container'

## Description
Command to build a container image generated with 'add container'

## Usage
```bash
kratix build container LIFECYCLE/ACTION/PIPELINE-NAME [flags]
```

## Examples
```bash
# Build a container
kratix build container resource/configure/mypipeline --name mycontainer

# Build all containers for all pipelines
kratix build container --all

# Build and push the image
kratix build container resource/configure/mypipeline --name mycontainer --push

# Custom build arguments
kratix build container resource/configure/mypipeline --build-args "--platform linux/amd64"

# Build with buildx
kratix build container resource/configure/mypipeline --buildx --build-args "--builder custom-builder --platform=linux/arm64,linux/amd64"

# Build with podman
kratix build container resource/configure/mypipeline --engine podman
```

## Flags
```bash
-a, --all                 Build all of the containers for the Promise across all Workflows
--build-args string   Extra build arguments to pass to the container build command
--buildx              Build the container using Buildx
-d, --dir string          Directory to read the Promise from (default ".")
-e, --engine string       Build all of the containers for the Promise across all Workflows (default "docker")
-h, --help                help for container
-n, --name string         Name of the container to build
```


## See Also

* [kratix build](/main/kratix-cli/reference/kratix-build): Command to build kratix resources

