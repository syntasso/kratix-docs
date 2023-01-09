// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');
const abbr = require('remark-abbr');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Kratix',
  tagline: 'A framework for building platforms',
  url: 'https://kratix.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  organizationName: 'syntasso', // Usually your GitHub org/user name.
  projectName: 'kratix-docs', // Usually your repo name.
  trailingSlash: false,

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Sidebar expanded by default on docs pages
          sidebarCollapsed: false,
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/syntasso/kratix-docs/tree/main',
          remarkPlugins: [
            abbr
          ],
        },
        // uncomment to add the blog section to the website
        // blog: {
        //   showReadingTime: true,
        //   // Remove this to remove the "edit this page" links.
        //   editUrl:
        //     'https://github.com/syntasso/kratix-docs/tree/main',
        // },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        gtag: {
          trackingID: 'G-88SJVH10M9',
          anonymizeIP: true,
        },
      }),
    ],
  ],

  plugins: ['docusaurus-plugin-sass'],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Kratix',
        logo: {
          alt: 'Kratix Logo',
          src: '/img/kratix_k_logo.png',
        },
        items: [
          {
            type: 'doc',
            docId: 'main/intro',
            position: 'left',
            label: 'Docs',
          },
          {
            type: 'doc',
            docId: 'workshop/intro',
            label: 'Workshop',
            position: 'left'
          },
          {
            to: 'marketplace',
            label: 'Marketplace',
            position: 'left'
          },
          {
            href: 'https://github.com/syntasso/kratix',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub repository',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Getting Started',
                to: '/docs/main/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Twitter',
                href: 'https://twitter.com/kratixio',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/syntasso/kratix',
              },
              {
                label: 'Syntasso',
                href: 'https://syntasso.io',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Syntasso Limited. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['shell-session']
      }
    }),
};

module.exports = config;
