import React from 'react';
import Layout from '@theme/Layout';
import Button from '@mui/material/Button';
import Input from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import GridList from "@material-ui/core/GridList";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography
} from "@material-ui/core";
import { Promises } from './promise-data';
import useBaseUrl from '@docusaurus/useBaseUrl'

import { ThemeProvider, createTheme } from '@mui/material/styles';
import Icon from '@mui/material/Icon';
import MdPhone from '@mui/icons-material/Phone';
import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      // margin: theme.spacing(1),
    margin: "auto",
    width: "25ch",
    }
  },
  main: {
    maxWidth: 1600,
    margin: 'auto',
    padding: '50px 0'
  },
  gridList: {
    height: "auto",
    margin: "auto"
  },
  card: {
    maxWidth: 500,
    height: "100%",
    margin: '15px'
  }, 
  logo: {
    maxWidth: 170,
    margin: "auto",
    padding: '20px 0 0'

  },
  categoriesList: {
    display: 'flex',
    justifyContent: 'left',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: '20px 0 0',
    margin: 0  
  },
  cardTitle: {
    marginTop: '10px'
  },
  cardDescription: {
    minHeight: 60
  },
  cardAction: {
    "&:hover": {
      textDecoration: 'none',
      color: 'black'
    }
  }
}));
const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export default function Marketplace() {
  const classes = useStyles();
  return (
    <Layout title="Kratix Marketplace" description="Use Kratix Marketplace to find your next Kratix Promise">
      <main className={classes.main}>
        <header>
          <h1 style={{ textAlign: 'center'}}>Kratix Marketplace</h1>
        </header>
        <GridList cellHeight={"auto"} className={classes.gridList} spacing={0} >
          {Promises.map((tile) => (
            <Card className={classes.card} key={tile.name}>
              <CardActionArea 
                href="https://www.github.com/syntasso/kratix-marketplace" 
                target="_blank" 
                className={classes.cardAction}>
                <CardMedia
                  component="img"
                  alt={tile.name}
                  className={classes.logo}
                  image={useBaseUrl('/img/marketplace/' + tile.name.toLowerCase() + ".svg")}
                  title={tile.name}
                  
                />
                <CardContent>
                  <h2 className={classes.cardTitle}>{tile.name}</h2>
                  <p className={classes.cardDescription}>{tile.description}</p>
                  
                  <ul className={classes.categoriesList}>
                  {tile.categories.map((category) => (
                    <ListItem key={category}>
                      <Chip
                        variant="outlined"
                        label={category} />
                    </ListItem>
                  ))}
                  </ul>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </GridList>
      </main>
    </Layout>
  );
}