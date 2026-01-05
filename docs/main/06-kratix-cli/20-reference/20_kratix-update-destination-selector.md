# kratix update destination-selector
Command to update destination selectors

## Description
Command to update destination selectors

## Usage
```bash
kratix update destination-selector KEY=VALUE [flags]
```

## Examples
```bash
# adds and updates a destination selector
kratix update destination-selector env=dev

# removes an existing destination selector
kratix update destination-selector zone-
```

## Flags
```bash
-d, --dir string   Directory to read Promise from (default ".")
```


## See Also

* [kratix update](/main/kratix-cli/reference/kratix-update): Command to update kratix resources

