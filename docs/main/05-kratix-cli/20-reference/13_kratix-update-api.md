# kratix update api
Command to update promise API

## Description
Command to update the Promise API.
It can be used to update the API GVK, or to add/remove properties to the API.
The --group, --kind, --version, and --plural flags are used to update the API
GVK. The --property flag is used to add or remove properties from the API. The
format is PROPERTY-NAME:TYPE. Valid types are string, number, integer, object,
and boolean.
For object types, the property name can be nested using the '.' character.
To remove a property, append a '-' to the property name.

## Usage
```
kratix update api --property PROPERTY-NAME:TYPE [flags]
```

## Examples
```
# add a new property of type string to the API kratix update api
--property region:string

# add an integer 'port' property nested into a 'service' object
kratix update api --property service.port:integer

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

