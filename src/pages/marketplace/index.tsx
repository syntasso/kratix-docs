import React from 'react';
import Layout from '@theme/Layout';
import styles from './marketplace.module.scss';
import { Promises, PromisesComingSoon } from '../../data/promise-data';

import GridList from '@material-ui/core/GridList'; // TODO use @mui equivalent instead
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';

import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Link from '@docusaurus/Link';
import clsx from 'clsx';

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

function ComingSoonBanner() {
  return (
    <div className={styles.comingSoonBanner}>
      <h3 className={styles.comingSoonBannerTitle}>Coming Soon</h3>
    </div>
  )
}

function PromiseCard({name, url, logoUrl, description, categories, available = true}) {
  return (
      <Card className={clsx(styles.card, available ? null : styles.cardComingSoon)}>
        <CardActionArea
          href={url || '#'}
          disabled={!available}
          target="_blank"
          className={styles.cardAction}
        >
          <CardMedia
            component="img"
            alt={name}
            image={logoUrl}
            title={name}
            className={styles.logo}
          />

          <CardContent>
            <h2 className={styles.cardTitle}>{name}</h2>
            <p className={styles.cardDescription}>
              {description}
            </p>

            <ul className={styles.categoriesList}>
              {categories.map((category) => (
                <ListItem key={category}>
                  <Chip variant="outlined" label={category} className={styles.chip} />
                </ListItem>
              ))}
            </ul>
            {available ? null : <ComingSoonBanner /> }
          </CardContent>
        </CardActionArea>
      </Card>
  )
}

export function Marketplace(props) {
  const getGridListCols = () => {
    if (isWidthUp('xl', props.width)) {
      return 4;
    }

    if (isWidthUp('lg', props.width)) {
      return 3;
    }

    if (isWidthUp('md', props.width)) {
      return 2;
    }

    return 1;
  }

  return (
    <Layout
      title="Kratix Marketplace"
      description="Use Kratix Marketplace to find your next Kratix Promise"
    >
      <main className={styles.main}>
        <header className={"text--center"}>
          <hgroup>
            <h1>Kratix Marketplace</h1>
            <p className="text--center">Community Promises for <Link href="/">Kratix</Link>, the framework for building platforms.</p>
          </hgroup>
        </header>
        <div className="root">
          <GridList
            cellHeight={"auto"}
            className={styles.gridList}
            spacing={30}
            cols={getGridListCols()}
          >
            {Promises.map((tile) => (
              <div key={tile.name}>
                <PromiseCard {...tile} />
              </div>
            ))}
            {PromisesComingSoon.map((tile) => (
              <div key={tile.name}>
                <PromiseCard {...tile} available={false} />
              </div>
            ))}
          </GridList>
        </div>
        <div className={clsx('text--center', 'margin-top--md', styles.bottomText)}>
          <p>
            Want to contribute a Promise to the Marketplace?
            <Link href="/marketplace/contributing">Check out our guide.</Link>
          </p>

          <p>
            Do you have any feedback? Did not find what you were looking for?
            <Link href="https://github.com/syntasso/kratix-marketplace/issues/new/choose">Submit an issue for it on GitHub</Link>
          </p>
        </div>
      </main>
    </Layout>
  );
}

export default withWidth()(Marketplace);
