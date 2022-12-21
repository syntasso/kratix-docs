import React from 'react';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl'

import styles from './marketplace.module.css';
import { Promises } from '../data/promise-data';

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

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

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
    <Layout title='Kratix Marketplace' description='Use Kratix Marketplace to find your next Kratix Promise'>
      <main className={styles.main}>
        <header>
          <h1>Kratix Marketplace</h1>
        </header>
        <div className="root">
          <GridList cellHeight={'auto'} className={styles.gridList} spacing={30} cols={getGridListCols()}>
            {Promises.map((tile) => (
              <div key={tile.name}>
                <Card className={styles.card}>
                  <CardActionArea 
                    href='https://www.github.com/syntasso/kratix-marketplace' 
                    target='_blank' 
                    className={styles.cardAction}>
                    <CardMedia
                      component='img'
                      alt={tile.name}
                      className={styles.logo}
                      image={useBaseUrl('/img/marketplace/' + tile.name.toLowerCase() + '.svg')}
                      title={tile.name}
                    />
                    <CardContent>
                      <h2 className={styles.cardTitle}>{tile.name}</h2>
                      <p className={styles.cardDescription}>{tile.description}</p>
                      
                      <ul className={styles.categoriesList}>
                      {tile.categories.map((category) => (
                        <ListItem key={category}>
                          <Chip
                            variant='outlined'
                            label={category} />
                        </ListItem>
                      ))}
                      </ul>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </div>
            ))}
          </GridList>
        </div>
      </main>
    </Layout>
  );
}

export default withWidth()(Marketplace);