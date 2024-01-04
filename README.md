# Kratix Docs

Kratix documentation is built using [Docusaurus 2](https://docusaurus.io/). The live version of the documentation is available at [docs.kratix.io](https://docs.kratix.io).

## Installation

```
$ yarn install
```

This command will install all the Dependencies required to build the website. If you don't have `yarn` installed, check out the [installation guide](https://yarnpkg.com/getting-started/install).

## Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Running in Docker

You can also run it in Docker:

```
docker run -it -v `pwd`:/app -p 3000:3000 node /bin/bash -c "cd /app; yarn run start --host 0.0.0.0-"
```

## Build, test, and verify

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service. Building the website also runs a lightweight test suite that ensure there are no broken links in the documentation.

```bash
$ yarn serve
```

This command starts a local server, serving the contents of the `build` directory. This is useful for testing the production build locally.

## Deployment

Publishing the website managed by CircleCI and is triggered by a commit to the `main` branch. The CircleCI configuration is available in the `.circleci` directory.

The live website is hosted on GitHub Pages and the deployment is done by pushing the generated static files to the `gh-pages` branch. The yarn `deploy` task is configured to do this. A [CircleCI pipeline](https://app.circleci.com/pipelines/github/syntasso/kratix-docs?branch=main) is responsible for running the `deploy` task.

> Note: a branch protection rule is in place to prevent direct commits to the `gh-pages` branch. The `gh-pages` branch is only updated by the CircleCI job.

Once the `gh-pages` is updated, a Github Actions will be triggered to update the live website, and is available [here](https://github.com/syntasso/kratix-docs/actions/workflows/pages/pages-build-deployment).

Once the Action completes, you can verify the documentation at [docs.kratix.io](https://docs.kratix.io).

## Docs structure

The landing page is built with React and the source code can be found in [src/pages/index.tsx](src/pages/index.tsx). From there, you can find the other React components that make up the landing page.

The documentation pages are located in the [docs](docs) directory.
