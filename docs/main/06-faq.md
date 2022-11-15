# Frequently Asked Questions

### What does the "day two" experience of a Kratix-based platform look like?

Kratix is intended to help platform teams deliver platforms in a sustainable way. Products are never "done", so a Platform-as-a-Product is never done. Instead, a platform is an opportunity to continuously learn about the best way to accelerate delivery in your organisation. Day two, three, four, etc. are equally as important as day one.

In the future, Kratix will:
- Add testing to Promises, so that:
    - The capability of the platform to deploy promised instances on-demand is continuously asserted, with Service-Level Objective(s) assigned against relevant Service-Level indicator(s)
    - The capability of each promised instance to deliver its Service-Level Objective(s) against relevant Service-Level indicator(s) is continuously asserted
- Expose service status information via standard endpoints
- Converge all deployed resources (cluster or instance) when a Promise is updated
- Converge individual instance resources when a user's request is updated

### Should the platform team or the stream-aligned team be responsible for updating the version of a deployed instance? Who should be responsible for storage/network/other configuration?

The platform team should collaborate with the stream-aligned teams when building Promises. The Promises should encapsulate the contract between the teams - the elements the stream-aligned teams care about should be exposed via the API, and the other elements should be configured by the platform team. Which settings matter to the stream-aligned team, and which matter to the platform team, is often organisation specific, particularly for bespoke Promises.

### How do I scan/validate/sign-off/log a request from a user before deploying the resources associated with their requested instance from a Promise?

Add images to the `xaasRequestPipeline` array inside the Promise definition to ensure all relevant steps are fulfilled prior to scheduling an instance. See [Writing a Promise](./guides/writing-a-promise).

### Is Kratix only useful for deploying simple services?

Quite the opposite, Kratix is at its most powerful when deploying complex services. The more complexity is removed from the stream-aligned teams (and encapsulated in the platform), the lower their cognitive load, and the more productive they are. See the [Kpack-and-Knative Application Stack](https://github.com/Syntasso/kratix/tree/main/samples/appstack) as an example of a more complex Promise making life easier for stream-aligned teams.

### My organisation would like to add all of our tooling as Promises to our platform, and some of our tools are challenging to deploy and manage. I worry a single platform team would get overwhelmed. How do I scale up?

Platform teams do not need to author all, or any, of the Promises in their platform. Off-the-shelf Promises should be used when suitable (see [samples on GitHub](https://github.com/kratix/samples)). Where bespoke Promises are necessary, follow Team Topologies; where possible "Complicated Subsystem Teams" should collaboratively author Promises with stream-aligned teams, and add them to the platform. Thus multiple complicated subsystem teams can contribute to a platform delivered by a platform team.

### How do I manage roles/teams/credentials/identity/networking/other?

Kratix functionality will be enhanced in many of these aspects in the future, utilising the best of the Kubernetes ecosystem.

### How do I schedule workloads to different clusters?

The supplied Kratix scheduler (work_controller) labels all Work objects with `cluster=worker`. This scheduler will be swappable with customised schedulers for the specific needs of your organisation.

### How do I use GitHub/GitLab/S3/other instead of MinIO in my GitOps pipeline?

The supplied Kratix Work writer (work_writer_controller) writes directly to a local Minio. This will be swappable with any other writer able to take a scheduled Work and write its resources to a compatible [source](https://fluxcd.io/docs/components/source/).

### How does Kratix compare to X? (where X is...)

[See here](./value-of-kratix#comparison-with-other-tools)

### AWS, Google Cloud, Microsoft Azure

The big public cloud providers offer tremendous power and functionality. Unfortunately, they also require expert knowledge, experience, time, and effort to deliver results in your organisation. Running a multi-cloud multi-cluster Kubernetes-based topology, powered by Kratix and a sustainable platform team, is the best way for your stream-aligned teams to leverage the power of public clouds without being "locked in" to a vendor.

### I'd like to invest/partner/buy. Who do I talk to?

Please [contact Syntasso](mailto:hello@syntasso.io?subject=Kratix%20Enquiry).
