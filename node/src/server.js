import storage from 'node-persist';

import express from 'express';

const app = express();
app.use(express.json());

// FROM ENV VARS
//
const PORT = process.env.BS_PORT;
const CHECKOUT_PATH = process.env.BS_CHECKOUT_PATH;
const PRIVATE_KEY_PATH = process.env.BS_PRIVATE_KEY_PATH;

import { cleanLocation } from './utils.js';
import { build } from './builder.js';
import { clone } from './git.js';
import { publish } from './publisher.js';

app.get('/', async (req, res) => {
    res.send('indrajala build-machine');
});

app.post('/configure', async (req, res) => {

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

    const publishUser = req.body.publishUser;
    await storage.setItem('publishUser', publishUser);
    console.log('publishUser', publishUser);

    const publishPath = req.body.publishPath;
    await storage.setItem('publishPath', publishPath);
    console.log('publishPath', publishPath);

    res.status(200);
    res.send('configured.');
});

app.post('/clone', async (req, res) => {

    const repoURL = await storage.getItem('repoURL');

    await cleanLocation(CHECKOUT_PATH, 'source checkout');
    await clone(repoURL, CHECKOUT_PATH);

    res.status(200);
    res.send(`cloned ${repoURL}`);
});

app.post('/build', async (req, res) => {

    console.log('*'.repeat(40));
    console.log('BUILD...');

    const buildCommand = await storage.getItem('buildCommand');
    const buildCommandPath = await storage.getItem('buildCommandPath');

    const { commit, stdout_stderr } = await build(CHECKOUT_PATH, buildCommand, buildCommandPath, buildCommandPath);

    res.status(200);
    res.send(`build:\n${stdout_stderr}`);
});

app.post('/publish', async (req, res) => {

    const buildArtefactsFolderPath = await storage.getItem('buildArtefactsFolderPath');
    const host = await storage.getItem('publishHost');
    const user = await storage.getItem('publishUser');
    const path = await storage.getItem('publishPath');

    const artefacts = await publish(host, user, PRIVATE_KEY_PATH, CHECKOUT_PATH, buildArtefactsFolderPath, path);

    res.status(200);
    res.send(`published ${artefacts.length} artefacts to ${host}:${path}\n${artefacts.join('\n')}`);
});

// entrypoint
//
storage.init({ dir: './local-storage' })
    .then(
        app.listen(PORT, () => {
            console.log(`android build-machine listening on port ${PORT}`)
        })
    );