const activeEnv = process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || 'development';

console.log(`Using environment config: '${activeEnv}'`);

require('dotenv').config({
  path: `.env.${activeEnv}`,
});

module.exports = {
  siteMetadata: {
    title: 'CargoLink Backoffice',
    // description: 'Admin dashboard template based on Gatsby with @paljs/ui component package.',
    author: 'Katanyoo Ubalee',
    // apiUrl: process.env.API_ENDPOINT,
  },
  plugins: [
    'gatsby-plugin-styled-components',
    'gatsby-plugin-notify',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-typescript',
    {
      resolve: 'gatsby-plugin-theme-ui',
      options: {
        preset: require("./src/theme/ui"),
        // prismPreset: 'night-owl',
        // preset: '@theme-ui/preset-funk',
      },
    },
    {
      resolve: `gatsby-source-sugarcrm`,
      options: {
        endpoint: 'API_ENDPOINT',
        configOptions: {
          client_id: 'sugar',
          client_secret: '',
          username: 'SUGAR_USERNAME',
          password: 'PASSWORD',
          platform: 'base',
        },
        modules: ['MODULE_NAME'],
      },
    },
    {
      resolve: `gatsby-plugin-layout`,
      options: {
        component: require.resolve(`./src/Layouts/index.tsx`),
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/images`,
      },
      __key: "images",
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: "./src/pages/",
      },
      __key: "pages",
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    // {
    //   resolve: 'gatsby-plugin-manifest',
    //   options: {
    //     name: 'cargolink-admin',
    //     short_name: 'Cargolink',
    //     start_url: '/dashboard',
    //     display: 'minimal-ui',
    //     icon: 'src/images/logo.png', // This path is relative to the root of the site.
    //   },
    // },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: 'UA-171177495-3',
      },
    },
    {
      resolve: 'gatsby-plugin-web-font-loader',
      options: {
        custom: {
          families: ['Lato, Dank Mono'],
          urls: ['/fonts/fonts.css'],
        },
      },
    },
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [`Prompt`],
        display: 'swap',
      },
    },
  ],
};
