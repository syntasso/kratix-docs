---
description: Documentation for using Backstage with Kratix
title: Backstage
sidebar_label: Backstage
id: intro
---

```mdx-code-block
import useBaseUrl from '@docusaurus/useBaseUrl';
```

_[Backstage](https://backstage.io/) is a framework for building developer portals. Kratix is a framework for building platforms. The two were almost designed to work perfectly with one another._

<img
align="right"
src={useBaseUrl('/img/k+backstage.png')}
style={{"float": "right", "width":"400px", "margin":"20px 0 40px 40px"}}
alt="Kratix logo and Backstage logo"
/>

## What

Backstage and Kratix both believe that the most powerful platforms must be built
by each organisation. While a platform needs to be custom built, both tools also
encourage building on top of community provided support where possible. Both
tools provide a framework for platform engineers that encourages user experience
front and center.

Backstage is a framework that enables GUIs to be declaratively created with the
aim of unifying infrastructure tooling, services, and documentation to produce a
great developer experience. Backstage is un-opinionated and decoupled from how
you drive your platform infrastructure.

Kratix enables platform teams to declare platform APIs that orchestrates
workloads across your infrastructure. Kratix does not come with a packaged GUI.

## Why

This divide between GUI and API makes Backstage and Kratix the perfect package.

- **Decoupled architecture:**

  GUI architectures shine when their responsibility is limited to the UX
  experience. Rather than define your platform orchestartation in Backstage
  directly, you can have Backstage call the Kratix API which provides easier
  portability across GUIs, alternative experiences for more CLI driven users,
  and easier refactoring of platfom implementation due to stable API
  definitions.

- **Auto-populated GUI:**

  Backstage GUIs must be declared: this is toil for the platform. Kratix can
  reduce this toil by integrating [Promises](../03-promises/01-promises.md) with
  Backstage by default. In addition, these GUIs can diverge from platform
  offerings if they are managed separately from the backend implementations.
  Promises that defined the API and the Backstage GUI at the same time provide
  automatic support for iterations on your offerings.

## How

Integrating Backstage with Kratix is simple. Point Backstage at the Kratix
platform cluster and that's it. Kratix will then build the Backstage views as
Promises are loaded into Kratix, and Resources are requested by users of the
platform.

Declarative UIs by default with Kratix:

- The Backstage Catalog is automatically populated when Kratix Promises are
  applied.
- Templates for Promises are automatically created when Promises are loaded.
  Giving consumers of the platform simple, predictable UX to create Resources
  from the Promises they require. This could be entire paved-path environments,
  or simply instances of services developers need. See the
  [Marketplace](https://www.kratix.io/marketplace) our Promises.
- Due to Kratix's powerful GitOps abstractions, the Backstage configuration data
  lives outside of Backstage, leaving your Kratix-driven Backstage ephemeral in
  nature. If your Backstage dies, no problem, redeploy it and your views will be
  automatically brought back to life by Kratix.

<br />
<div style={{"text-align":"center"}}>
<iframe width="560" height="315" src="https://www.youtube.com/embed/wj5VaXYTvrg" title="Use Kratix to provide on-demand services through a Backstage UI" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

<br/>

### Setting up Kratix with Backstage

Backstage supports reading objects from S3-Compatible Blobstores, and Kratix
also supports writing to them. To set up this integration, create a
[BucketStateStore](../06-statestore/03-bucketstatestore.md) and a
[Destination](../02-destinations/01-destinations.md) that points to the
directory Backstage is configured to watch. For example:

Create a `BucketStateStore`:
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

And a `backstage` Destination:
```yaml
apiVersion: platform.kratix.io/v1alpha1
kind: Destination
metadata:
  labels:
    environment: backstage
  name: backstage
spec:
  stateStoreRef:
    kind: BucketStateStore
    name: backstage
```

Kratix is now setup to enable Promises to write to this Destination. Backstage
needs to be configured to read from it. Update your [Backstage
configuration](https://backstage.io/docs/conf/) to read from the bucket:

```yaml
integrations:
  awsS3:
    - endpoint: 'http://s3.amazonaws.com'
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
          frequency: {minutes: 1}
          timeout: {seconds: 20}

```

Backstage is now configured to load any Backstage documents, such as templates
and components, that Kratix writes to the bucket.

### Create Backstage Resources with Kratix

Kratix [workflows](../workflows) allow Promise authors to define pipelines that
run for a [Resource](../05-resources/02-workflows.md) or
[Promise](../03-promises/04-workflows.md) for various different lifecycles.
These workflows can output documents of *any type*, and a single workflow can
schedule to [multiple destinations](../multicluster-management#dynamic). This
enables Promise authors in a single workflow to both output any desired
resources, like Kubernetes, alongside other types of resources, in this case
Backstage.

The Promise workflow can be used to output a component and template for the
Promise at install time, and then the Resource workflow can output a component
to describe what has been provisioned. The [Kafka
Promise](https://github.com/syntasso/kratix-marketplace/tree/main/kafka)
demonstrates this.

The Promise workflow for Kafka outputs the Kafka operator for deployment to a
Kubernetes cluster (the default scheduling for this Promise) and then outputs a
Component and Template separately for backstage and specifies the scheduling to
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

The sample Component and Template can be found
[here](https://github.com/syntasso/kratix-marketplace/blob/main/kafka/internal/configure-promise-pipeline/resources/backstage/backstage.yaml).
The Template takes advantage of a Backstage plugin to kubectl apply the desired
resource directly to the Platform cluster. Any plugin can be used that enables
the request to make its way to the Platform cluster, for example it could
instead of hitting the cluster directly commit or open a PR to a GitHub
repository that is being used to deploy resources to the Platform cluster via
GitOps.

Kratix will write the Backstage resources to the Backstage Destination, where
Backstage will then read and populate the UI with:

<img src={useBaseUrl('/img/docs/backstage-promise.png')} />


A user can then make a request by clicking "Create" in the top right, selecting
the Kafka form and filling out the details:

<img src={useBaseUrl('/img/docs/backstage-template.png')} />

The last step is to ensure that after a user has requested a Resource that a
Component in Backstage appears to resemeble it. Kafka does the in-lined in the
Resource workflow:

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

This results in the instance being shown in Backstage:

<img src={useBaseUrl('/img/docs/backstage-resource.png')} />

<br />

<br />

Having difficulties with Backstage and Kratix? Get in touch with us at
[feedback@syntasso.io](mailto:feedback@syntasso.io?subject=Kratix%20Feedback) or
[open a GitHub Issue](https://github.com/syntasso/kratix/issues/new).
