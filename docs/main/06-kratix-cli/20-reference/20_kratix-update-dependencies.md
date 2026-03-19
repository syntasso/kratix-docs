# kratix update dependencies
Commands to update promise dependencies

## Description
Commands to update promise dependencies, by default dependencies are stored in the Promise spec.dependencies field

## Usage
```bash
kratix update dependencies PATH [flags]
```

## Examples
```bash
# update promise dependencies with all files in 'local-dir'
kratix update dependencies path/to/dir/

# update promise dependencies with single file
kratix update dependencies path/to/file.yaml
```

## Flags
```bash
-d, --dir string     Directory to read Promise from (default ".")
-h, --help           help for dependencies
```


## See Also

* [kratix update](/main/kratix-cli/reference/kratix-update): Command to update kratix resources

