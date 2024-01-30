import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import DownloadTabs from './_wcr-binary-download-tabs.md';

To make this step simpler there is a _very basic_ tool which grabs all YAML documents from a single directory and injects them correctly into the `dependencies` field in the `promise.yaml`.

To use this tool, you will need to download the correct binary for your computer from [GitHub releases](https://github.com/syntasso/kratix/releases/tag/v0.0.4):

<DownloadTabs />

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
