const { writeFile } = require('fs');
const fs = require('fs');
const { argv } = require('yargs');

if (fs.existsSync('.env')) {
  console.log('Reading variables from .env file');
  // read environment variables from .env file
  require('dotenv').config();
}

// read the command line arguments passed with yargs
const environment = argv.environment;
const isProduction = environment === 'production';

const targetPath = isProduction
  ? `./src/environments/environment.production.ts`
  : `./src/environments/environment.development.ts`;

// we have access to our environment variables
// in the process.env object thanks to dotenv
const environmentFileContent = `
export const environment = {
  production: ${isProduction},
  envVar: {
    NG_APP_BACKEND_BASE_URL: "${process.env['NG_APP_BACKEND_BASE_URL']}",
    NG_APP_IMAGE_CATEGORIES: "${process.env['NG_APP_IMAGE_CATEGORIES']}",
    NG_APP_OKTA_ISSUER: "${process.env['NG_APP_OKTA_ISSUER']}",
    NG_APP_OKTA_CLIENT_ID: "${process.env['NG_APP_OKTA_CLIENT_ID']}",
    NG_APP_OKTA_REDIRECT_URI: "${process.env['NG_APP_OKTA_REDIRECT_URI']}",
    NG_APP_VIEW_PAGE_FUTURE_ITEMS: "${process.env['NG_APP_VIEW_PAGE_FUTURE_ITEMS']}",
    NG_APP_LIST_PAGE_FUTURE_ITEMS: "${process.env['NG_APP_LIST_PAGE_FUTURE_ITEMS']}",
    NG_APP_SCHEDULES_LIST_DISPLAY_ONLY_FUTURE: "${process.env['NG_APP_SCHEDULES_LIST_DISPLAY_ONLY_FUTURE']}"
 }
};
`;

// write the content to the respective file
const paths = [targetPath, './src/environments/environment.ts'];
paths.map((path) =>
  writeFile(path, environmentFileContent, function (err) {
    if (err) {
      console.log(err);
    }
    console.log(`Wrote variables to ${path}`);
  })
);
