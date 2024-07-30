# kratix update api
Command to update promise API

## Description
Command to update promise API

## Usage
```
kratix update api --property PROPERTY-NAME:TYPE [flags]
```

## Examples
```
# add a new property of type string to the API
kratix update api --property region:string

# removes the property from the API
kratix update api --property region-

# updates the API group and the Kind
kratix update api --group myorg.com --kind Database

# updates the version and the plural form
kratix update api --version v1beta3 --plural mydbs
```

## Flags
```
-d, --dir string             Directory to read Promise from (default ".")
-g, --group string           The API group for the Promise
-h, --help                   help for api
-k, --kind string            The kind to be provided by the Promise
--plural string          The plural form of the kind
-p, --property stringArray   Property of the Promise API to update
```


## See Also

* [kratix update](/main/kratix-cli/reference/kratix-update): Command to update kratix resources

