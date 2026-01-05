# kratix build promise
Command to build a Kratix Promise

## Description
Command to build a Kratix Promise from given api, dependencies and workflow files in a directory. Use this command if you initialized your Promise with `--split`.

## Usage
```bash
kratix build promise PROMISE-NAME [flags]
```

## Examples
```bash
# build a promise from path
kratix build promise postgresql --dir ~/path/to/promise-bundle/
```

## Flags
```bash
-d, --dir string      Directory to build promise from. Default to the current working directory (default ".")
-h, --help            help for promise
```


## See Also

* [kratix build](/main/kratix-cli/reference/kratix-build): Command to build kratix resources

