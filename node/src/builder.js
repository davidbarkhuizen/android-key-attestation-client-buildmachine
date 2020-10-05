import { clone } from './git.js';
import util from 'util';
import rimraf from 'rimraf';
const rimrafAsync = util.promisify(rimraf);

import { execute } from './execute.js'

const clean = async (
    checkoutLocation
) => {
    console.log('cleaning...');
    
    console.log(`source checkout location @${checkoutLocation}...`);
    await rimrafAsync(checkoutLocation);
    
    console.log('cleaned');
};

const build = async (
    checkoutLocation,
    buildCommand,
) => {
    console.log(`executing build command: ${buildCommand}`);
    const { stdout, stderr, outcome } = await execute(buildCommand, checkoutLocation);
    console.log('executed.');
    console.log(stdout);
    console.log(stderr);
};

export const cleanCloneBuild = async (
    repoURL, checkoutLocation, buildCommand
) => {
    await clean(checkoutLocation);
    await clone(repoURL, checkoutLocation);
    await build(checkoutLocation, buildCommand);
};