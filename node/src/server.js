import storage from 'node-persist';

import express from 'express';

const app = express();
app.use(express.json());

// FROM ENV VARS
//
const port = 8080;
const checkoutPath = "/tmp/checkout/";

import { cleanCloneBuild, rebuild } from './builder.js';

app.get('/', async (req, res) => {
    res.send('indrajala build-machine');
});

app.post('/configure', async (req, res) => {

    res.status(200);
    res.send('configuring...');

    const repoURL = req.body.repoURL;
    await storage.setItem('repoURL', repoURL);
    console.log('repoURL', repoURL);

    const buildCommand = req.body.buildCommand;
    await storage.setItem('buildCommand', buildCommand);
    console.log('buildCommand', buildCommand);

    const buildPath = req.body.buildPath;
    await storage.setItem('buildPath', buildPath);
    console.log('buildPath', buildPath);

    await cleanCloneBuild(repoURL, checkoutPath, buildCommand, buildPath);

    console.log('done');
});

app.post('/rebuild', async (req, res) => {

    // should rebuild last commit
    // so we need to make a note of it always
    // should clean out build location

    res.status(200);
    res.send('rebuilding...');

    // TODO check for presence of stored config

    const buildCommand = await storage.getItem('buildCommand');
    const buildPath = await storage.getItem('buildPath');

    await rebuild(checkoutPath, buildCommand, buildPath);

    console.log('rebuilt.');
});

// entrypoint
//
storage.init({ dir: './local-storage' })
    .then(
        app.listen(port, () => {
            console.log(`android build-machine listening on port ${port}`)
        })
    );