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

    const config = req.body;

    await storage.setItem('config', config);
    console.log(config);

    res.status(200);
    res.send('configured.');
});

app.post('/clone', async (req, res) => {
    const config = await storage.getItem('config');

    await cleanLocation(CHECKOUT_PATH, 'source checkout');
    await clone(config.repo.url, CHECKOUT_PATH);

    res.status(200);
    res.send(`cloned from ${config.repo.url}`);
});

app.post('/build', async (req, res) => {
    const config = await storage.getItem('config');

    console.log('*'.repeat(40));
    console.log('BUILD...');

    const { commit, stdout_stderr } = await build(CHECKOUT_PATH, config.build.command, config.build.cwd);

    res.status(200);
    res.send(`build:\n${stdout_stderr}`);
});

app.post('/publish', async (req, res) => {
    const config = await storage.getItem('config');

    const artefacts = await publish(
        config.publish.host, 
        config.publish.user, 
        PRIVATE_KEY_PATH, 
        CHECKOUT_PATH, 
        config.build.artefactsPath, 
        config.publish.path
    );

    res.status(200);
    res.send(`published ${artefacts.length} artefacts to ${config.publish.host}:${config.publish.path}\n${artefacts.join('\n')}`);
});

// entrypoint
//
storage.init({ dir: './local-storage' })
    .then(
        app.listen(PORT, () => {
            console.log(`android build-machine listening on port ${PORT}`)
        })
    );