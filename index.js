const express = require('express');
const http = require('http');
const ws = require('ws');
const app = express();

app.use(express.static('src/client'));

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new ws.Server({ server });

let intervalId = null;

wss.on('connection', (ws) => {
    console.log('socket client connected');
    //connection is up, let's add a simple simple event
    ws.on('message', (message) => {

        //log the received message and send it back to the client
        console.log('received: %s', message);
    });

    //send immediatly a feedback to the incoming connection    
    ws.send(JSON.stringify({
        method: 'intro',
        message: 'Hi there, I am a WebSocket server'
    }));

    intervalId = setInterval(() => {
        ws.send(JSON.stringify({
            method: 'example',
            message: {
                'key1': 'value1'
            }
        }));
    }, 1500);
});

wss.on('close', function close() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
});

app.get('/api', (req, res) => res.send('Hello World!'));

server.listen(3000, () => console.log('Example app listening on port 3000!'));