---
title: Upgrades
description: Introduction to upgrading SKE using the CLI
sidebar_label: Upgrading SKE
id: ske-cli-upgrade
---

To upgrades SKE, you can use the [CLI](../50-releases/40-ske-cli.mdx). The CLI
will check for the latest version of SKE and upgrade it if necessary. To perform
a dry run of the upgrade, you can use the `--dry-run` flag.

```bash
ske upgrade --dry-run
```

This will check if your current version of SKE is up to date and will run health
checks to ensure that the SKE installation is healthy.

To perform the upgrade, run it without the `--dry-run` flag. The same checks
will still occur before the upgrade is performed.

```bash
ske upgrade
```

:::info
The upgrade will only bump to the next minor at the latest patch version. If you
are multiple versions behind, you will need to run the upgrade command multiple
times to reach the latest version.
:::
