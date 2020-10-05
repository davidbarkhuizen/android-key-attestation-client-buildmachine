import storage from 'node-persist';

import express from 'express';

const app = express();
app.use(express.json());

const port = 8080;
const checkoutLocation = "/tmp/checkout/";

import { cleanAndRebuild } from './builder.js';

app.get('/', async (req, res) => {
    res.send('indrajala build-machine');
});

app.post('/configure', async (req, res) => {

    res.status(200);
    res.send('configuring...');

    const repoURL = req.body.repoURL
    await storage.setItem('repoURL', repoURL);

    await cleanAndRebuild(repoURL, checkoutLocation);

    console.log('done');
});

// const commit = repo.getReferenceCommit('head');

storage.init({ dir: './local-storage' })
    .then(
        app.listen(port, () => {
            console.log(`android build-machine listening on port ${port}`)
        })
    );