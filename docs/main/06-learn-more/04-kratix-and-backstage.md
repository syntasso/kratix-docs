---
description: Learn more about how Kratix works with Backstage
title: Kratix and Backstage
id: backstage
slug: /main/learn-more/how-kratix-complements/backstage
---


_[Backstage](https://backstage.io/) is a framework for building developer portals. Kratix is a framework for building platforms. It's as if they were made for each other._

<img
  align="right"
  src={require("@site/static/img/k+backstage.png").default}
  style={{ float: "right", width: "400px", margin: "20px 0 40px 40px" }}
  alt="Kratix logo and Backstage logo"
/>


## What

Backstage and Kratix both believe that the most powerful platforms must be built
by each organisation. While each platform needs to be custom-built, both tools also
encourage building on top of community-provided support where possible. Together, the two
provide a framework for platform engineers which places user experience front and center.

Backstage is a framework that enables GUIs to be declaratively created with the
aim of unifying infrastructure tooling, services, and documentation to produce a
stellar developer experience. It's completely un-opinionated and decoupled from how
you drive your platform infrastructure.

Kratix enables platform teams to declare platform APIs that orchestrates
workloads across your infrastructure. Kratix does not come with a packaged GUI.

## Why

This divide between GUI and API makes Backstage and Kratix the perfect package.

- **Decoupled architecture:**

  GUI architectures shine when their responsibility is limited to the UX
  experience. Rather than define your platform orchestration in Backstage
  directly, you can have Backstage call the Kratix API which provides easier
  portability across GUIs, while still supporting the experience of more CLI-driven
  users. Plus, decoupling enables easier refactoring of platform implementation due to
  stable API definitions.

- **Auto-populated GUI:**

  Backstage GUIs must be declared, which is toil for the platform. Kratix can
  reduce this toil by integrating [Promises](/main/reference/promises/intro) with
  Backstage by default. In addition, these GUIs can diverge from platform
  offerings if they are managed separately from the backend implementations.
  Promises that define the API and the Backstage GUI at the same time provide
  automatic support for iterations on your platform's offerings.

## How

:::info

👉 Don’t want to manage all the Backstage integration complexity yourself? [Book
a demo to see how **Syntasso Kratix Enterprise** does the hard work for
you.](https://www.syntasso.io/solutions/upgrade-backstage-from-portal-to-platform-with-kratix)

:::

Integrating Backstage with Kratix is simple. Point Backstage at the Kratix
platform cluster, and that's it. Kratix will then build the Backstage views as
Promises are loaded into Kratix, and Resources are requested by users of the
platform.

With Kratix, you get declarative UIs by default:

- The Backstage Catalog is automatically populated when Kratix Promises are
  applied.
- Templates for Promises are automatically created when Promises are loaded.
  This provides consumers of the platform with a simple, predictable UX to create
  Resources from the Promises they require. This could be entire paved-path environments,
  or simply instances of services developers need. See our selection of Promises on our
  [Marketplace](https://docs.kratix.io/marketplace).
- Due to Kratix's powerful GitOps abstractions, the Backstage configuration data
  lives outside of Backstage, leaving your Kratix-driven Backstage ephemeral in
  nature. If your Backstage dies, no problem: redeploy it and your views will
  automatically be brought back to life by Kratix.

  {" "}

  <br />
  <div style={{ "text-align": "center" }}>
    <iframe
      width="560"
      height="315"
      src="https://www.youtube.com/embed/wj5VaXYTvrg"
      title="Use Kratix to provide on-demand services through a Backstage UI"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
    ></iframe>
  </div>

  {" "}

  <br />

### Setting up Kratix with Backstage

Backstage supports reading objects from S3-compatible blob stores. Kratix
also supports writing to them.

To set up this integration, you'll need to create a
[BucketStateStore](/main/reference/statestore/bucketstatestore) and a
[Destination](/main/reference/destinations/intro) which points to the
directory that Backstage is configured to watch.

For example, first create a `BucketStateStore` for Backstage to use:

```yaml
apiVersion: platform.kratix.io/v1alpha1
kind: BucketStateStore
metadata:
  name: backstage
spec:
  bucketName: kratix
  endpoint: s3.amazonaws.com
  insecure: false
  path: backstage/
  secretRef:
    name: s3-credentials
    namespace: default
```

And a `backstage` Destination in Kratix to enable Promises to write to the state store:

```yaml
apiVersion: platform.kratix.io/v1alpha1
kind: Destination
metadata:
  labels:
    environment: backstage
  name: backstage
spec:
  path: backstage
  stateStoreRef:
    kind: BucketStateStore
    name: backstage
```

At this point, the Kratix half of the partnership is set up: we have a state store, and we
can write to it. We now need to configure Backstage to read from this state store.

To do this, you can update your [Backstage configuration](https://backstage.io/docs/conf/)
as follows:

```yaml
integrations:
  awsS3:
    - endpoint: "http://s3.amazonaws.com"
      s3ForcePathStyle: true
      accessKeyId: ${AWS_ACCESS_KEY_ID}
      secretAccessKey: ${AWS_SECRET_ACCESS_KEY}
catalog:
  providers:
    awsS3:
      kratix-bucket:
        bucketName: kratix
        prefix: backstage/
        region: us-east-2
        schedule:
          frequency: { minutes: 1 }
          timeout: { seconds: 20 }
```

Backstage is now configured to load any Backstage documents, such as templates
and components, which Kratix has written to the state store.

### Create Backstage Resources with Kratix

Kratix [workflows](/main/reference/workflows) allow Promise authors to define pipelines that
run at various points in the lifecycle of a [Resource](/main/reference/resources/workflows) or
[Promise](/main/reference/promises/workflows). These workflows can output documents of
_any type_, and a single workflow can schedule to
[multiple destinations](/main/reference/destinations/multidestination-management#dynamic).

This powerful combination enables Promise authors to output many distinct types of
resource to its own destination, all in a single workflow. In this case, we're writing
both Kubernetes manifests and Backstage components and templates, ensuring that the latter
are only picked up by Backstage.

The Promise Configure workflow can be used to output a component and template for the
Promise at installation time, and then the Resource Configure workflow can output a
component to describe what has been provisioned. The [Kafka
Promise](https://github.com/syntasso/kratix-marketplace/tree/main/kafka) in our
Marketplace demonstrates this.

The Promise Configure workflow for Kafka outputs the Kafka operator for deployment to a
Kubernetes cluster (the default scheduling for this Promise) and then outputs a
component and template separately for Backstage, specifying the scheduling to
ensure it goes to the Backstage destination:

```bash
#!/usr/bin/env sh

set -x


# Copy the Operator manifest
cp -r /tmp/transfer/dependencies/* /kratix/output/

# Copy the Backstage resources
cp -r /tmp/transfer/backstage /kratix/output

# Ensure the contents of the /kratix/output/backstage/
# directory go to the Backstage Destination
echo """
- directory: backstage
  matchLabels:
    environment: backstage
""" >> /kratix/metadata/destination-selectors.yaml
```

The sample component and template can be found
[here](https://github.com/syntasso/kratix-marketplace/blob/main/kafka/internal/configure-promise-pipeline/resources/backstage/backstage.yaml).
The Template takes advantage of the
[kubernetes-apply](https://github.com/muvaf/kubernetes-apply) Backstage plugin to
`kubectl apply` the desired resource directly to the Platform cluster. Any plugin can be
used which enables the request to make its way to the Platform cluster; for example,
instead of hitting the cluster directly, it could commit or open a PR to a GitHub
repository that is being used to deploy resources to the Platform cluster via GitOps.

Once Kratix and Backstage are wired up, Backstage will read from the Destination and
populate the UI as shown below:

![Promise in Backstage](/img/docs/backstage-promise.png)

A user can then make a [Resource request](/main/reference/resources/intro) to Kratix by
clicking "Create" in the top right, selecting the Kafka form and filling out the details:

![Backstage Template](/img/docs/backstage-template.png)

The last step is to ensure that a component in Backstage appears to represent the Resource
the user requested. The Kafka Promise achieves this as part of the Resource workflow, as
shown below:

```bash
#!/usr/bin/env sh

set -eux

# Read current values from the provided resource request
export name="$(yq eval '.metadata.name' /kratix/input/object.yaml)"

...

mkdir -p /kratix/output/backstage/

cat <<EOF > /kratix/output/backstage/component.yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: kafka-${name}
  title: "Kafka ${name}"
  description: Kafka created via the Promise
  annotations:
    backstage.io/kubernetes-label-selector: kafka=${name}
  links:
  - url: https://github.com/syntasso/kratix-marketplace
    title: Support
    icon: help
spec:
  type: service
  lifecycle: production
  owner: kratix-worker
  dependsOn:
    - component:default/kafka
  providesApis:
    - kafka-promise-api
EOF

echo """
- directory: backstage
  matchLabels:
    environment: backstage
""" >> /kratix/metadata/destination-selectors.yaml
```

This results in the instance being displayed in Backstage:

![Backstage Instance](/img/docs/backstage-resource.png)

### Support

Having difficulties with Backstage and Kratix? Get in touch with us at
[feedback@syntasso.io](mailto:feedback@syntasso.io?subject=Kratix%20Feedback) or
[open a GitHub Issue](https://github.com/syntasso/kratix/issues/new).
