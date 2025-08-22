---
title: Go
sidebar_position: 1
sidebar_label: Go
description: The Go Promise-writing SDK
id: go
---

An overview of the Go Promise-writing SDK.

## Features

- **Resource Management**: Read and write Kratix resources and promises via helpful abstractions
- **Status Handling**: Update resource status and write status files
- **Output Generation**: Write workflow outputs to files
- **Destination Selectors**: Configure where resources should be deployed
- **Environment Variables**: Access workflow context (action, type, promise name, pipeline name)
- **Testing Support**: Built-in testing utilities and mocks to support unit testing

## Installation

```bash
go get github.com/syntasso/kratix-go
```

## Usage

```go
package main

import (
    kratix "github.com/syntasso/kratix-go"
)

func main() {
    sdk := kratix.New()

    resource, _ := sdk.ReadResourceInput()
    log.Printf("Name:" + resource.GetName())
}
```

:::info
You can find more usage examples in the Repository [github.com/syntasso/kratix-go](https://github.com/syntasso/kratix-go)
:::

## Resources

- [Source Code](https://github.com/syntasso/kratix-go)
- [Documentation](https://pkg.go.dev/github.com/syntasso/kratix-go)

## License

[kratix-go](https://github.com/syntasso/kratix-go) is licensed under the Apache License 2.0. See the full [License](https://github.com/syntasso/kratix-go/blob/main/LICENSE) for details.
