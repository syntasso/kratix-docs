## Set up State Store

Kratix uses GitOps to provision resources on the worker clusters. You can
configure Kratix with multiple GitOps repositories by creating [State
Stores](/main/reference/statestore/intro). Kratix supports [Bucket State
Store](/main/reference/statestore/bucketstatestore) and [Git State
Store](/main/reference/statestore/gitstatestore).

Using a Git State Store is recommended for production environments as it provides
better security and version control. However, for development and testing
purposes, you can also use the Bucket State Store.
