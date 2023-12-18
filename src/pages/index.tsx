import React from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import ActionButtons from '@site/src/components/ActionButtons';
import styles from './index.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl'
import GettingStarted from '@site/src/components/GettingStarted'

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className={clsx('container', styles.heroContainer)}>
        <h1 className="hero__title">{siteConfig.title}</h1>
        <div className="row">
          <div className={clsx('col', styles.kratixDescription)}>
            Kratix is an open-source platform framework that combines the flexibility and customisability of building your platform from scratch with the on-demand and self-service power of public clouds.
          </div>
          <div className="col col--5 text--center">
            <img className={styles.kratixLogo} src={useBaseUrl('/img/kratix_banner_logo.jpeg')} alt="Kratix Logo" />
          </div>
        </div>
        <ActionButtons />
      </div>
    </header>
  );
}

function HomepagePromises() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <div className={clsx('container padding--lg', styles.promises)}>
      <h2 className="text--center">What's a Kratix Promise?</h2>
      <div className="row">
        <div className="col text--center">
          <img src={require('@site/static/img/home/logo_transparent_background.webp').default} alt="A K represeting Kratix logo" />
        </div>
        <div className="col">
          A Promise is comprised of three elements:
          <ul>
            <li><strong>An API:</strong> input from an app team to create Resources from a capability.</li>
            <li><strong>A set of Dependencies:</strong> Dependencies necessary for any created Workloads.</li>
            <li><strong>Workflows:</strong> business logic required when an Resource is requested.</li>
          </ul>
        </div>
      </div>
      <div className="row margin-top--lg">
        <div className="col">
          Promises:
          <ul>
            <li>
              provide the right abstractions to make your developers as productive, efficient, and secure as possible.
              Any capability can be encoded and delivered via a Promise, and once "Promised" the capability is available on-demand,
              at scale, across the organisation.
            </li>

            <li>codify the contract between platform teams and application teams for the delivery of a specific service,
              e.g. a database, an identity service, a supply chain, or a complete development workflow of patterns and tools.
            </li>

            <li>can be shared and reused between platforms, teams, business units, even other organisations.</li>

            <li>are easy to build, deploy, and update. Bespoke business logic can be added to each Promise's Workflows.</li>

            <li>can create "Workloads", which are deployed, via the GitOps Toolkit, across fleets of Kubernetes clusters or other destinations.</li>
          </ul>
        </div>
      </div>
      <div className="row margin-top--xl">
        <div className="col text--center">
          <iframe width="560" height="315" src="https://www.youtube.com/embed/ZZUD2NUCBJI" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        </div>
      </div>
    </div>
  );
}

function ActionButtonFrame(): JSX.Element {
  return (
    <section className={clsx('background-color--dark color--light', styles.actionButtons)}>
      <div className="container">
        <ActionButtons />
      </div>
    </section>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Kratix documentation, guides and tutorials">
      <HomepageHeader />
      <main>
        <GettingStarted />
      </main>
    </Layout>
  );
}
