import React from "react";
import uniqueId from 'lodash/uniqueId'
import styles from "./styles.module.css";
import Window from "@site/src/components/Window";
import Link from '@docusaurus/Link';
import CurvedArrow from 'react-curved-arrow';
import BrowserOnly from '@docusaurus/BrowserOnly';

interface Props { }
export default function GettingStarted({ }: Props): JSX.Element {
  const win1ID = uniqueId('window-1');
  const win2ID = uniqueId('window-2');
  const win3ID = uniqueId('window-3');

  return (
    <div className={styles.gettingStarted}>

      <h2>Deliver Your Platform in Three Easy Commands</h2>

      <div className={styles.terminal} id={win1ID}>
        <Window title="1. Install Kratix">
          <a className={styles.terminalBody}>
            $&gt; kubectl apply -f kratix.yaml
          </a>
        </Window>
      </div>

      <div className={styles.terminal} id={win2ID}>
        <Window title="2. Install a Promise">
          <a className={styles.terminalBody}>
            $&gt; kubectl apply -f promise-postgres.yaml
          </a>
        </Window>
      </div>

      <div className={styles.terminal} id={win3ID}>
        <Window title="3. Request a resource from your Promise">
          <a className={styles.terminalBody}>
            $&gt; kubectl apply -f request-postgres.yaml
          </a>
        </Window>
      </div>

      <p>
        <strong>🎉 Your Promised Postgres is ready to use! 🎉</strong>
      </p>
      <p>
        Follow our <Link to="/main/quick-start">Quick Start</Link> on a Kubernetes cluster, then extend your platform by adding Promises and additional destinations.
      </p>

      <BrowserOnly fallback={<div></div>}>
        {() => {
          const color = getComputedStyle(document.documentElement).getPropertyValue('--color-purple');
          return (
            <div>
              <CurvedArrow
                fromSelector={`#${win1ID}`}
                toSelector={`#${win2ID}`}
                width={3}
                middleX={-50}
                fromOffsetX={-250}
                toOffsetX={-250}
                fromOffsetY={-20}
                dynamicUpdate={true}
                color={color}
              />
              <CurvedArrow
                fromSelector={`#${win2ID}`}
                toSelector={`#${win3ID}`}
                width={3}
                middleX={50}
                fromOffsetX={250}
                toOffsetX={250}
                fromOffsetY={-20}
                dynamicUpdate={true}
                color={color}
              />
            </div>
          );
        }}
      </BrowserOnly>
    </div>
  );
}
