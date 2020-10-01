var http = require('http');

let onRequest = (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World!');
};

let server = http.createServer(onRequest);

let onListening = () => { console.log('build-machine started...'); };

server.on('listening', onListening);

server.listen(8080);