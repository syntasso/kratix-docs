// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

// const abbr = require("remark-abbr");

const { themes } = require("prism-react-renderer");
const lightTheme = themes.github;
const darkTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Kratix",
  tagline: "An open-source framework for building platforms",
  url: "https://kratix.io",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "throw",
  favicon: "img/favicon.ico",

  // GitHub pages deployment config.
  organizationName: "syntasso", // Usually your GitHub org/user name.
  projectName: "kratix-docs", // Usually your repo name.
  trailingSlash: false,

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "@docusaurus/preset-classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Sidebar expanded by default on docs pages
          sidebarCollapsed: true,
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/syntasso/kratix-docs/tree/main",
          // remarkPlugins: [abbr],
        },
        // uncomment to add the blog section to the website
        // blog: {
        //   showReadingTime: true,
        //   // Remove this to remove the "edit this page" links.
        //   editUrl:
        //     'https://github.com/syntasso/kratix-docs/tree/main',
        // },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        gtag: {
          trackingID: "G-88SJVH10M9",
          anonymizeIP: true,
        },
      }),
    ],
  ],

  plugins: ["docusaurus-plugin-sass"],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      metadata: [
        {
          name: "keywords",
          content: "kratix docs, kratix documentation",
        },
      ],
      docs: {
        sidebar: {
          hideable: true,
        },
      },
      navbar: {
        title: "Kratix",
        logo: {
          alt: "Kratix Logo",
          src: "/img/kratix_k_logo.png",
        },
        items: [
          {
            type: "doc",
            docId: "main/intro",
            position: "left",
            label: "Docs",
          },
          {
            type: "doc",
            docId: "workshop/intro",
            label: "Workshop",
            position: "left",
          },
          {
            to: "marketplace",
            label: "Marketplace",
            position: "left",
          },
          {
            type: "doc",
            docId: "main/community",
            position: "left",
            label: "Community",
          },
          {
            href: "https://github.com/syntasso/kratix",
            position: "right",
            className: "header-github-link",
            "aria-label": "GitHub repository",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Getting Started",
                to: "/docs/main/intro",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Twitter",
                href: "https://twitter.com/kratixio",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/syntasso/kratix",
              },
              {
                label: "Syntasso",
                href: "https://syntasso.io",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Syntasso Limited. Built with Docusaurus.`,
      },
      prism: {
        theme: lightTheme,
        darkTheme: darkTheme,
        additionalLanguages: [
          "shell-session",
          "docker",
          "bash",
          "diff",
          "json",
          "yaml",
        ],
      },
      algolia: {
        // Algolia application ID
        appId: "0T1XCKLOOH",
        // Public API key
        apiKey: "f03b43d042df527c0538ff3a332a39a7",
        indexName: "kratix",
        contextualSearch: true,
      },
    }),
};

module.exports = config;
