import util from 'util';

import { clone } from './git.js';

import rimraf from 'rimraf';
const rimrafAsync = util.promisify(rimraf);

// const exec = util.promisify(require('child_process').exec);
// const path = require('path');

const purgeFileLocations = async (
    checkoutLocation
) => {
    console.log('purging file locations');
    
    console.log(`source checkout location @${checkoutLocation}...`);
    await rimrafAsync(checkoutLocation);
    
    console.log('cleaned');
};

export const cleanAndRebuild = async (
    repoURL, checkoutLocation
) => {
    await purgeFileLocations(checkoutLocation);
    await clone(repoURL, checkoutLocation);
};