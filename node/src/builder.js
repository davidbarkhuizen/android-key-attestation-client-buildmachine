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
    buildCommandPath
) => {
    console.log(`executing build command: ${buildCommand}`);

    const cwd = path.join(checkoutLocation, buildCommandPath);

    const { stdout, stderr, outcome } = await execute(buildCommand, cwd);
    console.log('executed.');
    console.log('stdout');
    console.log(stdout);
    console.log('stderr');
    console.log(stderr);
};

export const rebuild = async (
    checkoutLocation,
    buildCommand,
    buildCommandPath
) => {

    await build(checkoutLocation, buildCommand, buildCommandPath);
};

export const cleanCloneBuild = async (
    repoURL, checkoutLocation, buildCommand, buildCommandPath 
) => {
    await cleanLocation(checkoutLocation, 'source');
    await clone(repoURL, checkoutLocation);
    await build(checkoutLocation, buildCommand, buildCommandPath);
};