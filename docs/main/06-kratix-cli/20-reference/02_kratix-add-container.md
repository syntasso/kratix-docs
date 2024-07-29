# kratix add container
Adds a container to the named workflow

## Description
Adds a container to the named workflow

## Usage
```
kratix add container LIFECYCLE/ACTION/PIPELINE-NAME --image CONTAINER-IMAGE [flags]
```

## Examples
```
# LIFECYCLE is one of: promise, resource
# ACTION is one of: configure, delete

# add a new resource configure container to pipeline 'instance'
kratix add container resource/configure/instance --image syntasso/postgres-resource:v1.0.0

# add a new promise configure container to pipeline 'pipeline0', with the container name 'deploy-deps'
kratix add container promise/configure/pipeline0 --image syntasso/postgres-resource:v1.0.0 --name deploy-deps
```

## Flags
```
-d, --dir string     Directory to read promise.yaml from. Default to current working directory. (default ".")
-h, --help           help for container
-i, --image string   The image used by this container.
```


## See Also

* [kratix add](/main/kratix-cli/reference/kratix-add): Command to add to Kratix resources

