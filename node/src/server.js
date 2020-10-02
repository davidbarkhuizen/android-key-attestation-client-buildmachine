const util = require('util');
const path = require('path');

const exec = util.promisify(require('child_process').exec);

const express = require('express');

const app = express();
const port = 8080;

const test = 'test';

const git = require("nodegit");

var cloneOptions = {
    fetchOpts: {
        remoteCallbacks: {
            credentials: (url, userName) => git.Cred.sshKeyFromAgent(userName)
        }
    }
};

const clone = async () => {
    const url = 'ssh://davidbarkhuizen@github.com/davidbarkhuizen/indrajala-fluid-client.git';
    await git.Clone(url, "/tmp/checkout/", cloneOptions);
};

// 1. initial clone
// 2. fetch
// 3. check for trigger condition (e.g. new tag or commit)
// 4. launch build process
// 5. extract build artefact (e.g. APK) 
// 6. publish build artefact (e.g. S3 bucket, ftp site)

const execute = async (command) => {
    try {
        const result = await exec(command);
        
        return {
            succeeded: true,
            stdout: result.stdout,
            stderr: result.stderr,
            error: null
        }
    } catch (e) {
        return {
            succeeded: false,
            stdout: e.stdout,
            stderr: e.stderr,
            error: e
        }
    }
};

const fetchCode = async () => { 

    const repo = 'github.com:davidbarkhuizen/indrajala-fluid-client.git';
    const checkoutPath = '/tmp/checkout';
    //const command = `ssh-agent bash -c 'ssh-add /run/secrets/id_rsa; git clone git@${repo} --depth 0 ${checkoutPath}'`;
    
    const command = `git clone git@${repo} --depth 1 ${checkoutPath}`;
    
    const outcome = await execute(command);
    console.log(`repo cloned: ${outcome.succeeded}`);
    console.log('stdout:', outcome.stdout);
    if (outcome.stderr) {
        console.log(outcome.stderr);
    }

    return outcome.succeeded;
}

app.get('/', async (req, res) => {
    
    if (await clone()) {
        res.status(200);
    } else {
        res.status(500);
    }

    res.send('indrajala build-machine');
});

app.listen(port, () => {

    console.log(`android build-machine listening on port ${port}`)
});