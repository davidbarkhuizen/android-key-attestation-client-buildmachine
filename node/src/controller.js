import storage from 'node-persist';

import { cleanLocation } from './utils.js';

import * as git from './git.js';
import * as publisher from './publisher.js';
import * as builder from './builder.js';

const CHECKOUT_PATH = process.env.BS_CHECKOUT_PATH;
const PRIVATE_KEY_PATH = process.env.BS_PRIVATE_KEY_PATH;

let busy = false;

export const init = async () => {
    await storage.init({ dir: './local-storage' }); // TODO from env
};

export const configure = async (config) => {
    await storage.setItem('config', config);
    return config;
};

export const clone = async () => {
    const config = await storage.getItem('config');

    await cleanLocation(CHECKOUT_PATH, 'source checkout');
    await git.clone(config.repo.url, CHECKOUT_PATH);
};

export const fetch = async () => {
    await git.fetch(CHECKOUT_PATH);
};

export const build = async () => {
    const config = await storage.getItem('config')
    return await builder.build(CHECKOUT_PATH, config.build.command, config.build.cwd);
};

export const publish = async () => {
    const config = await storage.getItem('config');

    const artefacts = await publisher.publish(
        config.publish.host, 
        config.publish.user, 
        PRIVATE_KEY_PATH, 
        CHECKOUT_PATH, 
        config.build.artefactsPath, 
        config.publish.path
    );

    return `published ${artefacts.length} artefacts to ${config.publish.host}:${config.publish.path}\n${artefacts.join('\n')}`;
};