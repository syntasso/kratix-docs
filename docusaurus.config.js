// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Kratix',
  tagline: 'A framework for building platforms',
  url: 'https://syntasso.github.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  trailingSlash: false,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'syntasso', // Usually your GitHub org/user name.
  projectName: 'kratix-docs', // Usually your repo name.

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
        },
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

  plugins: [
    [
      '@docusaurus/plugin-ideal-image',
      {
        quality: 70,
        max: 1030, // max resized image's size.
        min: 640, // min resized image's size. if original is lower, use that size.
        steps: 2, // the max number of images generated between min and max (inclusive)
        disableInDev: false,
      },
    ],
  ],

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
            to: '/workshop',
            type: 'doc',
            docId: 'workshop/intro',
            label: 'Workshop',
            position: 'left'
          },
          {
            href: 'https://github.com/syntasso/kratix',
            label: 'GitHub',
            position: 'right',
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
              // {
              //   label: 'Stack Overflow',
              //   href: 'https://stackoverflow.com/questions/tagged/kratix',
              // },
              // {
              //   label: 'Discord',
              //   href: 'https://discordapp.com/invite/docusaurus',
              // },
              {
                label: 'Twitter',
                href: 'https://twitter.com/kratixio',
              },
            ],
          },
          {
            title: 'More',
            items: [
              // {
              //   label: 'Blog',
              //   to: '/blog',
              // },
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
      },
    }),
};

module.exports = config;
