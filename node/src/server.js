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

const credentialsCallback = (url, userName) => git.Cred.sshKeyFromAgent(userName)

var cloneOptions = {
    fetchOpts: {
        callbacks: {
            credentials: credentialsCallback
        }
    }
};

// 1. initial clone

const clone = async (url) => {
    try {
        console.log(`cleaning ${checkoutLocation}...`);
        await rimraf(checkoutLocation);
        
        console.log(`cloning ${url}...`);
        await git.Clone(url, checkoutLocation, cloneOptions);
    } catch (e) {
        console.log('error', e)
    }
};

// 2. update

const fetch = async () => {

    console.log('synching...');

    const repo = await git.Repository.open(checkoutLocation);
    const done = await repo.fetch('origin', { callbacks: { credentials: credentialsCallback }});

    return repo;
};

const checkForNewTag = async (repo) => {

    const tags = await git.Tag.list(repo);
    console.log(tags);

    tags.map(
        () => {
            const ref = await nodegit.Reference.lookup(repo, `refs/tags/${tagName}`);
            const commit = await nodegit.Commit.lookup(repo, ref.target());
            console.log(commit.date().toJSON())
        }
    );
};

// 3. detect trigger condition (e.g. new tag or commit) and checkout target state


// triggers
// - new tag, any branch

// 4. launch build process
// 5. extract build artefact (e.g. APK) 
// 6. publish build artefact (e.g. S3 bucket, ftp site)



// git.Checkout.tree(repo, tag.targetId()

app.get('/', async (req, res) => {
    res.send('indrajala build-machine');
});

app.post('/configure', async (req, res) => {

    res.status(200);
    res.send('configuring...');

    await storage.setItem('repoURL', req.body.repoURL);

    await clone(req.body.repoURL);

    await synch();

    console.log('done');
});

// const commit = repo.getReferenceCommit('head');

storage.init({ dir: './local-storage' })
    .then(
        app.listen(port, () => {
            console.log(`android build-machine listening on port ${port}`)
        })
    );