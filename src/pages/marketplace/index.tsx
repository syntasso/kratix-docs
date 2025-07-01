import React from "react";
import Admonition from '@theme/Admonition';
import Layout from "@theme/Layout";
import styles from "./marketplace.module.scss";
import Promises from "../../data/promise-data.json";
import PipelineImages from "../../data/pipeline-image-data.json";
import GridList from "@material-ui/core/GridList"; // TODO use @mui equivalent instead
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
} from "@mui/material";
import { Breakpoint, Theme, styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Link from "@docusaurus/Link";
import clsx from "clsx";
type BreakpointOrNull = Breakpoint | null;
import { useLocation } from "@docusaurus/router";

const ListItem = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

function Banner({ title, style }) {
  return (
    <div className={clsx(styles.banner, style)}>
      <h3 className={styles.bannerTitle}>{title}</h3>
    </div>
  );
}

function MarketplaceCard({
  name,
  url,
  logoUrl,
  description,
  categories,
  available = true,
  example = false,
}) {
  return (
    <Card
      className={clsx(styles.card, available ? null : styles.cardComingSoon)}
    >
      <CardActionArea
        href={url || "#"}
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
          <p className={styles.cardDescription}>{description}</p>

          <ul className={styles.categoriesList}>
            {categories.map((category) => (
              <ListItem key={category}>
                <Chip
                  variant="outlined"
                  label={category}
                  className={styles.chip}
                />
              </ListItem>
            ))}
          </ul>
          {!available ? (
            <Banner title="Coming Soon" style={styles.preview} />
          ) : null}
          {example ? <Banner title="Example" style={styles.example} /> : null}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

function useWidth() {
  const theme: Theme = useTheme();
  const keys: readonly Breakpoint[] = [...theme.breakpoints.keys].reverse();
  return (
    keys.reduce((output: BreakpointOrNull, key: Breakpoint) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const matches = useMediaQuery(theme.breakpoints.up(key));
      return !output && matches ? key : output;
    }, null) || "xs"
  );
}

export function Marketplace(): JSX.Element {
  const getGridListCols = () => {
    const width = useWidth();
    if (isWidthUp("xl", width)) {
      return 4;
    }

    if (isWidthUp("lg", width)) {
      return 3;
    }

    if (isWidthUp("md", width)) {
      return 2;
    }

    return 1;
  };

  return (
    <Layout
      title="Kratix Marketplace"
      description="Use Kratix Marketplace to find your next Kratix Promise"
    >
      <main className={styles.main}>
        <header className={"text--center"}>
          <hgroup>
            <h1>Kratix Marketplace</h1>
            <p className="text--center">
              Explore the community Marketplace featuring pre-built{" "}
              <a href="#promises">Promises</a> and{" "}
              <a href="#images">Pipeline images</a> for{" "}
              <Link href="/">Kratix</Link>, the open-source framework that helps you
              build flexible, composable internal developer platforms.
              Kratix lets you rapidly deliver resources as-a-service, embed key
              business processes, and simplify managing your platform as a unified fleet.
              Learn more about how Kratix can power your platform{" "}
              <Link href="/">here</Link>.
            </p>
            <div style={{ maxWidth: "720px", margin: "1rem auto", padding: "0 1rem" }}>
              <Admonition type="info">
                <p>
                  Looking for production-ready, enterprise-grade, supported Promises?
                  Check out <a href="https://syntasso.io/pricing">Syntasso Kratix Enterprise (SKE)</a> or
                  <a href="https://syntasso.io/#contact-us"> get in contact</a>.
                </p>
              </Admonition>
            </div>
          </hgroup>
        </header>

        <div className="root">
          <section id="promises" className={styles.pipelineMarketplace}>
            <hgroup className="text--center">
              <h2>Promises</h2>
              <p className="text--center"></p>
            </hgroup>
            <GridList
              cellHeight={"auto"}
              className={styles.gridList}
              spacing={30}
              cols={getGridListCols()}
            >
              {Promises.map((tile: any) => (
                <div key={tile.name}>
                  <MarketplaceCard {...tile} />
                </div>
              ))}
            </GridList>
          </section>

          <section id="images" className={styles.pipelineMarketplace}>
            <hgroup className="text--center">
              <h2>Pipeline Images</h2>
              <p className="text--center"></p>
            </hgroup>

            <GridList
              cellHeight={"auto"}
              className={styles.gridList}
              spacing={30}
              cols={getGridListCols()}
            >
              {PipelineImages.map((tile: any) => (
                <div key={tile.name}>
                  <MarketplaceCard {...tile} />
                </div>
              ))}
            </GridList>
          </section>
        </div>

        <div
          className={clsx("text--center", "margin-top--xl", styles.bottomText)}
        >
          <p>
            Want to contribute a Promise to the Marketplace?
            <Link href="/marketplace/contributing">Check out our guide.</Link>
          </p>

          <p>
            Do you have any feedback? Did not find what you were looking for?
            <Link href="https://github.com/syntasso/kratix-marketplace/issues/new/choose">
              Submit an issue for it on GitHub
            </Link>
          </p>
        </div>
      </main>
    </Layout>
  );
}

export default Marketplace;
