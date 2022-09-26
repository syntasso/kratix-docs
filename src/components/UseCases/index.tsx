import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import ActionButtons from '@site/src/components/ActionButtons';

type UseCaseItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const UseCaseList: UseCaseItem[] = [
  {
    title: 'Global Bank',
    Svg: require('@site/static/img/home/usecase1.svg').default,
    description: (
      <>
        A suite of Promises to deliver on-demand production-ready internal services such as identity, namespaces, and databases
      </>
    ),
  },
  {
    title: 'National Retail Chain',
    Svg: require('@site/static/img/home/usecase2.svg').default,
    description: (
      <>
        A Promise to encapsulate the golden path to production, making it easy and fast for application teams to request a "path"
        on-demand, and then get their application into production via that path in a compliant and governed manner.
      </>
    ),
  },
  {
    title: 'Independent Software Vendor',
    Svg: require('@site/static/img/home/usecase3.svg').default,
    description: (
      <>
        A Promise to deliver complex software deployments across multiple Kubernetes clusters in customer sites.
        The bespoke needs of the software are encoded into the Promise, providing a clean and consistent interface for
        customers to deploy additional instances of the ISV's software.
      </>
    ),
  },
  {
    title: 'Global Systems Integrator',
    Svg: require('@site/static/img/home/usecase4.svg').default,
    description: (
      <>
        A range of Promises to deliver high-level abstractions via a consistent interface across multiple public cloud providers.
        The GSI's customers are able to consume high-value services across all public clouds.
      </>
    ),
  },
  {
    title: 'Online Gaming Company',
    Svg: require('@site/static/img/home/usecase5.svg').default,
    description: (
      <>
       A Promise to deliver a combined metrics, monitoring, and logging solution based on open-source software but bespoke to the organisation's needs.
       The Promise delivers an on-demand solution to the game teams that's ready to use in production.
      </>
    ),
  },
  {
    title: 'Fintech Startup',
    Svg: require('@site/static/img/home/usecase6.svg').default,
    description: (
      <>
        A Promise to deliver per-tenant SaaS environments on-demand.
        Tenants are unable to share environments due to regulatory reasons.
        Each request from the Promise creates a complete and ready to use environment,
        orchestrating public-cloud APIs with Terraform and Crossplane and scheduling custom resources to kubernetes clusters.
      </>
    ),
  },
];

function UseCase({title, Svg, description}: UseCaseItem) {
  return (
    <div className="row">
      <div className={clsx('col col--1 col--offset-2 text--right', styles.iconCol)} >
        <div className={styles.useCaseWrap}>
          <Svg className={styles.useCaseSvg} role="img" />
        </div>
      </div>
      <div className="col col--9">
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
    </div>
  );
}


export default function UseCases(): JSX.Element {
  return (
    <section className={clsx('background-color--dark color--light', styles.useCases)}>
      <div className="container">
        <h2 className={clsx('text--center', styles.title)}>Kratix Promise Use Cases</h2>
        <hr />
          {UseCaseList.map((props, idx) => (
            <UseCase key={idx} {...props} />
          ))}
          <ActionButtons />
      </div>
    </section>
  );
}