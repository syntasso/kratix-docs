import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

To make this step simpler there is a _very basic_ tool which grabs all YAML documents from a single directory and injects them correctly into the `dependencies` field in the `promise.yaml`.

To use this tool, you will need to download the correct binary for your computer from [GitHub releases](https://github.com/syntasso/kratix/releases/tag/v0.0.4):

<Tabs>
  <TabItem value="darwin-amd64" label="Intel Mac" default>

    ```bash
    mkdir -p bin
    curl -sLo ./bin/worker-resource-builder.tar.gz https://github.com/syntasso/kratix/releases/download/v0.0.4/worker-resource-builder_0.0.4_darwin_amd64.tar.gz
    tar -xvf ./bin/worker-resource-builder.tar.gz -C ./bin
    mv ./bin/worker-resource-builder-v* ./bin/worker-resource-builder
    chmod +x ./bin/worker-resource-builder
    ```

  </TabItem>
  <TabItem value="darwin-arm64" label="Apple Silicon Mac">

    ```bash
    mkdir -p bin
    curl -sLo ./bin/worker-resource-builder.tar.gz https://github.com/syntasso/kratix/releases/download/v0.0.4/worker-resource-builder_0.0.4_darwin_arm64.tar.gz
    tar -xvf ./bin/worker-resource-builder.tar.gz -C ./bin
    mv ./bin/worker-resource-builder-v* ./bin/worker-resource-builder
    chmod +x ./bin/worker-resource-builder
    ```

  </TabItem>
  <TabItem value="linux-arm64" label="Linux ARM64">

    ```bash
    mkdir -p bin
    curl -sLo ./bin/worker-resource-builder.tar.gz https://github.com/syntasso/kratix/releases/download/v0.0.4/worker-resource-builder_0.0.4_linux_arm64.tar.gz
    tar -xvf ./bin/worker-resource-builder.tar.gz -C ./bin
    mv ./bin/worker-resource-builder-v* ./bin/worker-resource-builder
    chmod +x ./bin/worker-resource-builder
    ```

  </TabItem>
    <TabItem value="linux-amd64" label="Linux AMD64">

    ```bash
    mkdir -p bin
    curl -sLo ./bin/worker-resource-builder.tar.gz https://github.com/syntasso/kratix/releases/download/v0.0.4/worker-resource-builder_0.0.4_linux_amd64.tar.gz
    tar -xvf ./bin/worker-resource-builder.tar.gz -C ./bin
    mv ./bin/worker-resource-builder-v* ./bin/worker-resource-builder
    chmod +x ./bin/worker-resource-builder
    ```

  </TabItem>
</Tabs>

Once installed, you can see how to use the binary by running the following help command:

```bash
./bin/worker-resource-builder --help
```

The above command will give an output similar to:

```shell-session
Usage of ./bin/worker-resource-builder:
  -resources-dir string
        Absolute Path of k8s resources to build dependencies from
  -promise string
        Absolute path of Promise to insert dependencies into
```
