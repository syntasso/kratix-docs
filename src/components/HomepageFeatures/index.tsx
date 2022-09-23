import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Focus on Platform Teams',
    Svg: require('@site/static/img/home/icon1.svg').default,
    description: (
      <>
        Kratix supports platform teams to easily deliver a curated
        Kubernetes-native platform API, over fleets of Kubernetes clusters,
        to increase flow across your organisation.
      <br /><br />
        Unlike other frameworks and tooling which focus exclusively on
        application-developer experience, Kratix focuses on empowering
        platform engineers to build better platforms.
      </>
    ),
  },
  {
    title: 'Powered by GitOps',
    Svg: require('@site/static/img/home/icon2.svg').default,
    description: (
      <>
        Using the GitOps workflow and Kubernetes-native constructs, Kratix provides a
        flexible solution to empower your platform team to curate an API-driven, curated,
        bespoke platform that can easily be kept secure and up-to-date,
        as well as evolving as business needs change.
      </>
    ),
  },
  {
    title: 'Kubernetes as the building block',
    Svg: require('@site/static/img/home/icon3.svg').default,
    description: (
      <>
        By using Kubernetes as the building block, Kratix brings together the power
        and flexibility of raw Kubernetes and enables platform teams to simplify
        the experience for application teams by reducing complexity.
      </>
    ),
  },
  {
    title: 'Tailored to your needs',
    Svg: require('@site/static/img/home/icon4.svg').default,
    description: (
      <>
        Kratix enables the injection of business-specific requirements such as compliance,
        security, and billing so that the “Promises” delivered by the platform represent
        the Golden Paths to production; making the right way the easy way.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--6', styles.feature)}>
      <div className={clsx('padding--lg', styles.featureContent)}>
        <div className="text--center">
          <Svg className={styles.featureSvg} role="img" />
        </div>
        <div className="text--center padding-horiz--lg margin-top--md">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={clsx('background-color--dark', styles.features)}>
      <div className="container">
        <div className="row feature">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}