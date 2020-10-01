const express = require('express');
const app = express();
const port = 8080;

app.get('/', (req, res) => {
    res.send('indrajala build-machine')
});

app.listen(port, () => {
    console.log(`android build-machine listening on port ${port}`)
});