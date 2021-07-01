/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

// const fs = require('fs-extra');
// const path = require('path');

exports.onCreatePage = ({ page, actions }) => {
  const { createPage } = actions;

  if (page.path.match(/auth/)) {
    page.context.layout = 'auth';
  } else if (page.path.match(/user\/upload/)) {
    page.context.layout = 'doc';
  } else {
    page.context.layout = 'primary';
  }

  // createPage(page);
  return;
};



// exports.onPostBuild = () => {
//   console.log('Copying locales');
//   fs.copySync(path.join(__dirname, '/src/locales'), path.join(__dirname, '/public/locales'));
// };
