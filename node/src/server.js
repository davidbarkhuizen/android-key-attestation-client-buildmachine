import express from 'express';

const app = express();
app.use(express.json());

const PORT = process.env.BS_PORT;

import { init, configure, isBusy, setBusy, setNotBusy } 
    from './controller.js'

app.get('/', async (req, res) => {
    res.send('indrajala build-machine');
});

const handle = async (res, method) => {

    const lock = { };
    
    if (isBusy()) {

        res.status(423); // locked
        res.send('busy');
        
        return;
    }

    try {
        setBusy(lock);

        const text = await method();
        res.status(200);
        res.send(text);    
    } catch (e) {
        const errorText = `${e}\n${e.message}\n${e.stack}`;
        console.error(errorText);
        
        res.status(500);
        res.send(errorText);
    } finally {

        try { 
            setNotBusy(lock);
        } catch (e) { 
            // swallow, e.g. if we don't own the lock
        };
    }
};

app.post('/configure', async (req, res) => {
    handle(res, async () => configure(req.body));
});

// entrypoint
//
init()
    .then(
        app.listen(PORT, () => {
            console.log(`IndraJala build-machine listening on port ${PORT}`)
        })
    );