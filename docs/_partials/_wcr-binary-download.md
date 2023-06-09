import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

To make this step simpler we have written a _very basic_ tool to grab all YAML
documents from all YAML files located in `internal/resources` and inject them
into the `workerClusterResources` field in the `promise.yaml`.

To use this tool, you will need to download the correct binary for your computer
from [GitHub releases](https://github.com/syntasso/kratix/releases/tag/v0.0.2):

<Tabs>
  <TabItem value="darwin-amd64" label="Intel Mac" default>

    curl -sLo internal/scripts/worker-resource-builder https://github.com/syntasso/kratix/releases/download/v0.0.2/worker-resource-builder-v0.0.2-darwin-amd64
    chmod +x internal/scripts/worker-resource-builder

  </TabItem>
  <TabItem value="darwin-arm64" label="Apple Silicon Mac">


    curl -sLo internal/scripts/worker-resource-builder https://github.com/syntasso/kratix/releases/download/v0.0.2/worker-resource-builder-v0.0.2-darwin-arm64
    chmod +x internal/scripts/worker-resource-builder

  </TabItem>
  <TabItem value="linux-arm64" label="Linux ARM64">

    curl -sLo internal/scripts/worker-resource-builder https://github.com/syntasso/kratix/releases/download/v0.0.2/worker-resource-builder-v0.0.2-linux-arm64
    chmod +x internal/scripts/worker-resource-builder

  </TabItem>
    <TabItem value="linux-amd64" label="Linux AMD64">

    curl -sLo internal/scripts/worker-resource-builder https://github.com/syntasso/kratix/releases/download/v0.0.2/worker-resource-builder-v0.0.2-linux-amd64
    chmod +x internal/scripts/worker-resource-builder

  </TabItem>
</Tabs>
