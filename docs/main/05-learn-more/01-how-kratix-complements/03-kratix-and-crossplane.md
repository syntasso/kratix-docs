---
description: Learn more about how Kratix works with Crossplane
title: Kratix and Crossplane
id: crossplane
---

_**[Crossplane](https://www.crossplane.io/)** is an open-source multi-cloud control plane that allows you to extend Kubernetes to connect to and from external sources like databases, the cloud and the edge._

<img
src={require('@site/static/img/k+crossplane_arch.png').default}
alt="Sample architecture with Kratix and Crossplane"
style={{"float": "right", "width":"400px", "margin":"20px 0 40px 40px"}}
/>

_We have written a tremendous [blog](https://www.syntasso.io/post/kratix-and-crossplane) about how Kratix and Crossplane complement each other._

[Kratix Promises](../../reference/promises/intro) and [Crossplane Compositions](https://docs.crossplane.io/master/concepts/compositions/) are similar in that they both provide declarative APIs and a facade into more complicated underlying platform orchestration.

Kratix does not aim to compete with Crossplane on cloud orchestration and it can help a platform builder already using Crossplane.

- Creating a [Promise](../../reference/promises/intro) for
  Crossplane simplifies the Crossplane installation experience.
- Kratix provides multi-cluster
  support for
  free. Where Crossplane users are managing several Crossplane provider
  clusters, Kratix complements by providing the cross-cluster management of
  resources.
- A Promise can abstract away Crossplane. If a Platform needs to provide a
  Postgres as a Service with a production version managed by Crossplane _and_
  and they also need to provide an inexpensive dev version that is run on a
  densified development cluster then this can be handled for free with Kratix
  via Promises. See the
  [blog](https://www.syntasso.io/post/building-your-platform-your-way-with-crossplane-and-kratix)
  for more detail on this pattern.
- [Kratix Promises](../../reference/promises/intro) can offer the
  benefits of Workflows. Tasks such as billing checks, security scans, audits,
  resource decoration etc can all happen in the Promise before a delegation to
  Crossplane is made.
- Kratix provides GitOps out of the box so the state of Crossplane resources is
  all managed for free.

## Controlling Manifest Generation

When a Crossplane Composition is used through Kratix, the platform normally
generates Kubernetes manifests for all resources created by that Composition so
they can be stored in the configured state store. If you prefer not to generate
these manifests, label the Composition as follows:

```yaml
compositions.core.kratix.io/manifest-generation: "disabled"
```

Removing the label or setting it to `"enabled"` restores the default behaviour.
