import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

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
