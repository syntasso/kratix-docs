---
title: Upgrades
description: Introduction to upgrading SKE using the CLI
sidebar_label: Upgrading SKE
id: ske-cli-upgrade
---

To upgrades SKE, you can use the [CLI](../50-releases/40-ske-cli.mdx). The CLI will check for the latest version of SKE and upgrade it if necessary.
To perform a dry run of the upgrade, you can use the `--dry-run` flag.

```bash
ske upgrade --dry-run --token <licence-token>
```

This will check if your current version of SKE is up to date and will run health
checks to ensure that the SKE installation is healthy.
