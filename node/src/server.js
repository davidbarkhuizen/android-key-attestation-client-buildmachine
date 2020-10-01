const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 8080;

const fetchCode = () => { 

    const repo = 'github.com:davidbarkhuizen/indrajala-fluid-client.git';
    //const checkoutPath = '/tmp/checkout'

    console.log('fetching');

    const executing = exec(`ssh-agent bash -c 'ssh-add /run/secrets/id_rsa; git clone git@${repo}'`, function(err, stdout, stderr) {
        if (err) {
            console.log('error')
            console.log(stderr)
        }
        console.log('normal termination');
        console.log(stdout);
    });

    executing.on('exit', (exitCode) => {

        console.log(`done, exit code ${exitCode}`);

    })
}

app.get('/', (req, res) => {
    res.send('indrajala build-machine')

    fetchCode();
});

app.listen(port, () => {

    console.log(`android build-machine listening on port ${port}`)
});