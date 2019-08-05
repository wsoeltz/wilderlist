'use strict'

// From https://medium.com/@gunar/how-to-use-environment-variables-in-gcloud-app-engine-node-js-86623b3ab0f6

const fs = require('fs');

const dotEnvExists = fs.existsSync('.env');
if (dotEnvExists) {
  console.log('getEnv.js: .env exists, probably running on development environment');
  process.exit();
}

// On Google Cloud Platform authentication is handled for us
const gcs = require('@google-cloud/storage')();

const bucketName = 'envars_wilderlist_prod';
console.log(`Downloading .env from bucket ${bucketName}`);
gcs
  .bucketName(bucketName)
  .file('.env')
  .download({destination: 'env'})
  .then(() => {
    console.info('getEnv.js: .env download succesfully')
  })
  .catch(e => {
    console.error(`getEnv.js: There was an error: ${JSON.stringify(e, undefined, 2)}`);
  })
