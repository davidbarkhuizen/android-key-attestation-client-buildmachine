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

export const fetch = async () => git.fetch(CHECKOUT_PATH);

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

const updateCodeAndEvaluateTrigger = async () => {

    const repo = await fetch();

    const latestTag = await git.getLatestTag(repo);
    console.log(`latest tag: ${latestTag}`);

    const lastBuildTag = '';

    if (latestTag != lastBuildTag) {

    }

    // evaluate trigger condition
    // new (commit | tag) on (branch | *)
    
    // on trigger => build, publish

    // trigger
    // - commit => get latest commit, compare to last built, rebuild if different
    // - tag => get all tags, sort by date, compare latest to last built

    console.log('checked trigger');
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
        setNotBusy(lock);
    }
};

export const init = async () => {
    await storage.init({ dir: './local-storage' }); // TODO from env
    start(15000, onTick);
};