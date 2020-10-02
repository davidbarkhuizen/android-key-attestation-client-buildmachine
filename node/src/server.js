const util = require('util');
// const exec = util.promisify(require('child_process').exec);
// const path = require('path');

const storage = require('node-persist');

const rimraf = util.promisify(require('rimraf'));

const express = require('express');

const app = express();
app.use(express.json());

const port = 8080;
const checkoutLocation = "/tmp/checkout/";

const git = require("nodegit");

let repo = null;

var cloneOptions = {
    fetchOpts: {
        callbacks: {
            credentials: (url, userName) => git.Cred.sshKeyFromAgent(userName)
        }
    }
};

const clone = async (url) => {

    console.log(`cleaning ${checkoutLocation}...`);
    try {
        await rimraf(checkoutLocation);
    } catch (e) {
        console.log('error', e)
    }

    console.log(`cloning ${url}...`);
    try {
        repo = await git.Clone(url, checkoutLocation, cloneOptions);
        console.dir(repo);
    } catch (e) {
        console.log('error', e)
    }
};

// 1. initial clone
// 2. fetch
// 3. check for trigger condition (e.g. new tag or commit)
// 4. launch build process
// 5. extract build artefact (e.g. APK) 
// 6. publish build artefact (e.g. S3 bucket, ftp site)

app.get('/', async (req, res) => {
    res.send('indrajala build-machine');
});

app.post('/configure', async (req, res) => {

    res.status(200);
    res.send('configuring...');

    await clone(req.body.repoURL);
});

storage.init({ dir: './local-storage' })
    .then(
        app.listen(port, () => {
            console.log(`android build-machine listening on port ${port}`)
        })
    );