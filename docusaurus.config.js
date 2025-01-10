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
  url: "https://docs.kratix.io",
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
          routeBasePath: '/',
        },
        // uncomment to add the blog section to the website
        blog: {
          showReadingTime: true,
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/syntasso/kratix-docs/tree/main',
        },
        theme: {
          customCss: require.resolve("./src/css/custom.scss"),
        },
        googleTagManager: {
          containerId: 'GTM-M8KNBP6C',
        },
      }),
    ],
  ],

  plugins: ["docusaurus-plugin-sass", require.resolve("docusaurus-plugin-image-zoom")],

  scripts: [
      {
        src: "https://app.termly.io/resource-blocker/6f1bb777-b1e3-40d9-a340-e80f132710f0?autoBlock=on",
        async: false,
    },
  ],

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
        logo: {
          alt: "Kratix Logo",
          src: "/img/kratix-purple-io.svg",
          srcDark: "/img/kratix-white-io.svg",
          href: "https://kratix.io",
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
            to: "blog",
            label: "Blog",
            position: "left",
          },
          {
            href: "https://github.com/syntasso/kratix",
            position: "right",
            className: "header-github-link",
            "aria-label": "GitHub repository",
          },
          {
            href: "https://kratixworkspace.slack.com",
            position: "right",
            className: "header-slack-link",
            "aria-label": "Kratix Slack Workspace",
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
                to: "/",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "Kratix",
                href: "https://kratix.io",
              },
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
          "ruby",
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
      zoom: {
        selector: '.diagram > .large',
        config: {
          // options you can specify via https://github.com/francoischalifour/medium-zoom#usage
          background: {
            light: 'rgb(255, 255, 255)',
            dark: 'rgb(50, 50, 50)'
          }
        }
      }
    }),
};

module.exports = config;
