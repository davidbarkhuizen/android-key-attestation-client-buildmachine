import storage from 'node-persist';

import { cleanLocation } from './utils.js';

import { start, stop } from './metronome.js'

import * as git from './git.js';
import * as publisher from './publisher.js';
import * as builder from './builder.js';

const CHECKOUT_PATH = process.env.BS_CHECKOUT_PATH;
const PRIVATE_KEY_PATH = process.env.BS_PRIVATE_KEY_PATH;

let lockRef = null;

export const isBusy = () => lockRef != null;

export const setBusy = (lock) => {

    if (isBusy()) {
        throw Error('busy');
    }

    lockRef = lock;
};

export const setNotBusy = (lock) => {

    if (lock === lockRef) {
        lockRef = null;
    } else if (lock === null) {
        throw Error('no lock ref');
    } else {
        throw Error('lock does not match');
    }
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

export const fetch = async (verbose = false) => {
    return await git.fetch(CHECKOUT_PATH, verbose);
}
export const build = async () => {
    const config = await storage.getItem('config')
    return await builder.build(CHECKOUT_PATH, config.build.command, config.build.cwd);
};

export const publish = async () => {
    const config = await storage.getItem('config');

    const text = await publisher.publish(
        config.publish.host, 
        config.publish.user, 
        PRIVATE_KEY_PATH, 
        CHECKOUT_PATH, 
        config.build.artefactsPath, 
        config.publish.path
    );

    return text;
};

// build and publish latest tag
const updateCodeAndEvaluateTrigger = async () => {

    const repo = await fetch(false);

    const latestTag = await git.getLatestTag(repo);
    if (latestTag == null) {
        console.log('no tags', latestTag);
        return false;
    }

    let lastTagBuilt = await storage.getItem('lastTagBuilt'); // TODO STORAGE KEYS LOOKUP
    if (latestTag.name != lastTagBuilt) {

        console.log(`newest tag ${latestTag.name} not yet built.`);

        // CHECKOUT TARGET TAG
        await git.checkoutCommit(repo, latestTag.commit);

        const built = await build();
        if (built) {
            lastTagBuilt = latestTag.name;
            await storage.setItem('lastTagBuilt', latestTag.name); // TODO STORAGE KEYS LOOKUP
            console.log(`new tag ${latestTag.name} built.`);
        }
    }

    let lastTagPublished = await storage.getItem('lastTagPublished'); // TODO STORAGE KEYS LOOKUP

    if (lastTagBuilt == latestTag.name) {
        if (lastTagPublished != latestTag.name) {

            console.log(`artefacts for newly built tag ${latestTag.name} not yet published.`);

            const published = await publish();
            if (published) {
                console.log(`published build artefacts for tag ${latestTag.name}.`);
                await storage.setItem('lastTagPublished', latestTag.name); // TODO STORAGE KEYS LOOKUP
            } else {
                console.log(`failed tp publish build artefacts for tag ${latestTag.name}.`);
            }
        }
    }
};

const onTick = async () => {

    if (isBusy()) {
        return;
    }

    const lock = {};

    setBusy(lock);

    try {
        await updateCodeAndEvaluateTrigger();
        setNotBusy(lock);
    } catch (e){ 
        console.error(`exception during tick: ${e.message}\n${e.stack}`);
        setNotBusy(lock);
    }
};

export const init = async () => {
    await storage.init({ dir: './local-storage' }); // TODO from env
    // TODO source interval from config, don't start if we don't have config
    start(15000, onTick);
};