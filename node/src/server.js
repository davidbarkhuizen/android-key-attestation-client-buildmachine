import express from 'express';

const app = express();
app.use(express.json());

// FROM ENV VARS
//
const PORT = process.env.BS_PORT;

import { init, configure, clone, build, publish } from './controller.js'

const terminate = (res, text) => {
    res.status(200);
    res.send(text);
};

app.get('/', async (req, res) => {
    res.send('indrajala build-machine');
});

app.post('/configure', async (req, res) => {
    const text = await configure(req.body);
    terminate(res, text);
});

app.post('/clone', async (req, res) => {
    const text = await clone(req.body);
    terminate(res, text);
});

app.post('/build', async (req, res) => {
    const text = await build();
    terminate(res, text);
});

app.post('/publish', async (req, res) => {
    const text = await publish();
    terminate(res, text);
    res.status(200);
});

// entrypoint
//
init()
    .then(
        app.listen(PORT, () => {
            console.log(`android build-machine listening on port ${PORT}`)
        })
    );