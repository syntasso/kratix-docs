# kratix build container
Command to build a container image

## Description
Command to build a container image

## Usage
```
kratix build container LIFECYCLE/ACTION/PIPELINE-NAME [flags]
```

## Examples
```
# Build a container
kratix build container resource/configure/mypipeline --name mycontainer

# Build all containers for all pipelines
kratix build container --all

# Build and push the image
kratix build container resource/configure/mypipeline --name mycontainer --push

# Custom build arguments
kratix build container resource/configure/mypipeline --build-args "--platform linux/amd64"

# Build with buildx
kratix build container resource/configure/mypipeline --buildx

# Build with podman
kratix build container resource/configure/mypipeline --engine podman
```

## Flags
```
-d, --dir string      Directory to build promise from. Default to the current working directory (default ".")
-h, --help            help for promise
-a, --all             Build all of the containers for the Promise across all Workflows
--build-args string   Extra build arguments to pass to the container build command
--buildx              Build the container using Buildx
-d, --dir string      Directory to read the Promise from (default ".")
-e, --engine string   Build all of the containers for the Promise across all Workflows (default "docker")
-h, --help            help for container
-n, --name string     Name of the container to build
--push                Build and push the container
```


## See Also

* [kratix build](/main/kratix-cli/reference/kratix-build): Command to build kratix resources
