import { clone } from './git.js';
import util from 'util';
import * as path from 'path';

import rimraf from 'rimraf';
const rimrafAsync = util.promisify(rimraf);

import { execute } from './execute.js'

const cleanLocation = async (
    filePath,
    label
) => {
  
    console.log(`cleaning ${label} @ ${filePath}...`);
    await rimrafAsync(filePath);
    
    console.log('cleaned');
};

const build = async (
    checkoutLocation,
    buildCommand,
) => {
    console.log(`executing build command: ${buildCommand}`);
    const { stdout, stderr, outcome } = await execute(buildCommand, checkoutLocation);
    console.log('executed.');
    console.log('stdout');
    console.log(stdout);
    console.log('stderr');
    console.log(stderr);
};

export const rebuild = async (
    checkoutLocation,
    buildCommand,
    buildLocation
) => {

    const buildPath = path.join(checkoutLocation, buildLocation);

    await cleanLocation(buildPath, 'build');
    await build(checkoutLocation, buildCommand);
};

export const cleanCloneBuild = async (
    repoURL, checkoutLocation, buildCommand, buildPath
) => {
    await cleanLocation(checkoutLocation, 'source');
    await clone(repoURL, checkoutLocation);
    await cleanLocation(buildPath, 'build');
    await build(checkoutLocation, buildCommand);
};