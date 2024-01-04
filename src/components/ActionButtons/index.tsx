import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Rocket from '@site/static/img/home/rocket.svg';
import Link from '@docusaurus/Link';

export default function ActionButtons(): JSX.Element {
  return (
    <div className={styles.buttons}>
      <Rocket className={styles.actionIcon} />
      <Link className={clsx('button button--lg', styles.actionLink)} to="/main/intro">
        Get Started Here
      </Link>

      <img className={styles.actionIcon} src={require('@site/static/img/home/github_logo.webp').default} alt="Github Logo" />
      <Link className="button button--lg" to="https://github.com/syntasso/kratix">
        Explore the Code
      </Link>
    </div>
  );
}
