const express = require('express');
const http = require('http');
const ws = require('ws');
const fs = require('fs');
const path = require('path');

const scenariosFolder = path.resolve('./src/scenarios');

const app = express();

app.use(express.static('src/client'));

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new ws.Server({ server });

let intervalId = null;

let scenarioId = 0;
let scenarioTypes = {};
let individualScenarios = {};

processScenarios().then(() => {
    processScenarioActions();
}, (err) => {
    console.error(err);
    process.exit(1);
});

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

app.get('/api/scenarios', (req, res) => {
    res.send(Object.keys(scenarioTypes).map(type => {
        const scenarioType = Object.assign({}, scenarioTypes[type]);
        scenarioType.commands = individualScenarios[type];
        return scenarioType;
    }));
});

app.get('/api/scenarios/:scenarioId(\\d+)', (req, res) => {
    res.send(individualScenarios[req.params.scenarioId]);
});

app.get('/api/scenarios/:scenarioId(\\d+)/:actionId(\\d+)', (req, res) => {
    const scenarioType = scenarioTypes[req.params.scenarioId];
    const action = individualScenarios[req.params.scenarioId][req.params.actionId];
    const actionFilePath = path.join(scenariosFolder, scenarioType.name, action.name);
    if (action) {
        fs.readFile(actionFilePath, 'utf8', (err, data) => {
            if (err != null) {
                console.error(err);
                res.sendStatus(500);
                return;
            }

            res.send(JSON.parse(data));
        });
    } else {
        res.sendStatus(404);
    }
});

function processScenarios() {
    return new Promise((resolve, reject) => {
        scenarioTypes = {};
        fs.readdir(scenariosFolder, (err, files) => {
            if (err != null) {
                reject(err);
                return;
            }
    
            files.filter(filePath => {
                const stats = fs.lstatSync(path.join(scenariosFolder, filePath));
                return stats.isDirectory();
            }).map(directory => {
                scenarioId += 1;
                return {
                    id: scenarioId,
                    name: path.basename(directory)
                };
            }).forEach(scenario => {
                scenarioTypes[scenario.id] = scenario;
            });
    
            resolve();
        });
    });
}

function processScenarioActions() {
    Object.keys(scenarioTypes).forEach(scenarioTypeId => {
        const scenario = scenarioTypes[scenarioTypeId];
        individualScenarios[scenarioTypeId] = {};
    
        const scenarioFolder = path.resolve(`./src/scenarios/${scenario.name}`);
        fs.readdir(scenarioFolder, (err, files) => {
            if (err != null) {
                console.error(err);
                return;
            }
    
            const scenarioObjects = files.filter(filePath => {
                const stats = fs.lstatSync(path.join(scenarioFolder, filePath));
                return stats.isFile();
            }).map(file => {
                scenarioId += 1;
                return {
                    id: scenarioId,
                    name: path.basename(file)
                };
            }).forEach(scenario => {
                individualScenarios[scenarioTypeId][scenario.id] = scenario;
            });
        });
    }); 
}

server.listen(3000, () => console.log('Example app listening on port 3000!'));