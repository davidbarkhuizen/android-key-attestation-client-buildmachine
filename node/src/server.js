import storage from 'node-persist';

import express from 'express';

const app = express();
app.use(express.json());

// FROM ENV VARS
//
const port = 8080;
const checkoutPath = "/tmp/checkout/";

import { cleanCloneBuild, rebuild } from './builder.js';
import { publish } from './publisher.js';

app.get('/', async (req, res) => {
    res.send('indrajala build-machine');
});

app.post('/configure', async (req, res) => {

    res.status(200);
    res.send('configuring...');

    console.log('*'.repeat(40));
    console.log('CONFIGURE');

    const repoURL = req.body.repoURL;
    await storage.setItem('repoURL', repoURL);
    console.log('repoURL', repoURL);

    const buildCommand = req.body.buildCommand;
    await storage.setItem('buildCommand', buildCommand);
    console.log('buildCommand', buildCommand);

    const buildCommandPath = req.body.buildCommandPath;
    await storage.setItem('buildCommandPath', buildCommandPath);
    console.log('buildCommandPath', buildCommandPath);

    const buildArtefactsFolderPath = req.body.buildArtefactsFolderPath;
    await storage.setItem('buildArtefactsFolderPath', buildArtefactsFolderPath);
    console.log('buildArtefactsFolderPath', buildArtefactsFolderPath);

    const publishHost = req.body.publishHost;
    await storage.setItem('publishHost', publishHost);
    console.log('publishHost', publishHost);

    const publishPath = req.body.publishPath;
    await storage.setItem('publishPath', publishPath);
    console.log('publishPath', publishPath);

    // await cleanCloneBuild(repoURL, checkoutPath, buildCommand, buildCommandPath);

    console.log('done');
});

app.post('/rebuild', async (req, res) => {

    // should rebuild last commit
    // so we need to make a note of it always
    // should clean out build location

    res.status(200);
    res.send('rebuilding...');

    console.log('*'.repeat(40));
    console.log('REBUILD...');

    // TODO check for presence of stored config

    const buildCommand = await storage.getItem('buildCommand');
    const buildCommandPath = await storage.getItem('buildCommandPath');

    await rebuild(checkoutPath, buildCommand, buildCommandPath, buildCommandPath);

    console.log('rebuilt.');
});

app.post('/publish', async (req, res) => {

    const buildArtefactsFolderPath = await storage.getItem('buildArtefactsFolderPath');
    const publishHost = await storage.getItem('publishHost');
    const publishPath = await storage.getItem('publishPath');

    await publish(publishHost, checkoutPath, buildArtefactsFolderPath, publishPath);
});

// entrypoint
//
storage.init({ dir: './local-storage' })
    .then(
        app.listen(port, () => {
            console.log(`android build-machine listening on port ${port}`)
        })
    );