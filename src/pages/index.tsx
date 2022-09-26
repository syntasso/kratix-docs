import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import UseCases from '@site/src/components/UseCases';
import styles from './index.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Rocket from '@site/static/img/home/rocket.svg';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className={clsx('container', styles.heroContainer)}>
        <h1 className="hero__title">{siteConfig.title}</h1>
        <div className="row">
          <div className={clsx('col', styles.kratixDescription)}>
            <p className="hero__subtitle">{siteConfig.tagline}</p>
            Kratix enables the co-creation of capabilities by providing a clear
            contract between application and platform teams through the definition and creation of Promises.
          </div>
          <div className="col col--5 text--center">
            <img className={styles.kratixLogo} src={useBaseUrl('/img/kratix_banner_logo.jpeg')} alt="Kratix Logo" />
          </div>
        </div>
        <div className={styles.buttons}>
            <Rocket className={styles.actionIcon} />
          <Link className={clsx('button button--lg', styles.actionLink)} to="/docs/main/intro">
            Get Started Here
          </Link>

          <img className={styles.actionIcon} src={require('@site/static/img/home/github_logo.webp').default} alt="Github Logo" />
          <Link className="button button--lg" to="https://github.com/syntasso/kratix">
            Explore the Code
          </Link>
{/*
          <Link
            className="button button--secondary button--lg"
            to="/docs/main/intro">
            Read the docs
          </Link> */}
        </div>
      </div>
    </header>
  );
}

function HomepagePromises() {
  const {siteConfig} = useDocusaurusContext();
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
            <li><strong>Custom Resource Definition:</strong> input from an app team to create instances of a capability.</li>
            <li><strong>Worker Cluster Resources:</strong> dependencies necessary for any created Workloads.</li>
            <li><strong>Request Pipeline:</strong> business logic required when an instance of a capability is requested.</li>
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
              e.g. a database, an identity service, a supply chain, or a complete development pipeline of patterns and tools.
            </li>

            <li>can be shared and reused between platforms, teams, business units, even other organisations.</li>

            <li>are easy to build, deploy, and update. Bespoke business logic can be added to each Promise's pipeline.</li>

            <li>can create "Workloads", which are deployed, via the GitOps Toolkit, across fleets of Kubernetes clusters.</li>
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

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <HomepagePromises />
        <UseCases />
      </main>
    </Layout>
  );
}
