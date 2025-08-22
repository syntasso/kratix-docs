---
title: Python
sidebar_position: 2
sidebar_label: Python
description: The Python Promise-writing SDK
id: python
---

An overview of the Python Promise-writing SDK.

## Features

- **Resource Management**: Read and write Kratix resources and promises with convenient accessors
- **Composable status management**: Get, set, or remove nested status fields
- **Output Generation**: Write workflow outputs to files
- **Destination Selectors**: Configure where resources should be deployed
- **Environment Variables**: Access workflow context (action, type, promise name, pipeline name)

## Usage

```python
import kratix_sdk as ks

def main():
    sdk = ks.KratixSDK()
        resource = sdk.read_resource_input()
        print(f'Name" {resource.get_name()}')

if __name__ == '__main__':
    main()
```

:::info
You can find more usage examples in the Repository [github.com/syntasso/kratix-python](https://github.com/syntasso/kratix-python)
:::

## Resources

- [Source Code](https://github.com/syntasso/kratix-python)
- [Documentation](https://syntasso.github.io/kratix-python/kratix_sdk.html)

## License

[kratix-python](https://github.com/syntasso/kratix-python) is licensed under the Apache License 2.0. See the full [License](https://github.com/syntasso/kratix-python/blob/main/LICENSE) for details.
