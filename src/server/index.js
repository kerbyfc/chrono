const fs = require('fs');
const path = require('path');
const homedir = require('os').homedir();

let express = require('express');
let app = express();

const configPath = path.join(homedir, '.chrono', 'config.json');
const config = JSON.parse(fs.readFileSync(configPath));

app.use(express.static(path.resolve('dist', 'client')));

app.get('/hello', function (req, res) {
    res.send("Hello world! Lala Seth is here!");
});

// TODO: take them dynamically
const screensavers = [
    '1.webm',
    '2.webm',
    '3.webm',
    '5.webm',
    '6.webm',
    '7.webm',
    '8.webm',
];

const getRandomScreenSaver = () =>
    `/Users/crewman/Documents/screensavers/${
        screensavers[Math.round(Math.random() * (screensavers.length - 1))]
    }`;

app.get('/screensaver', function (req, res) {
    const path = getRandomScreenSaver();
    const stat = fs.statSync(path)
    const fileSize = stat.size

    const headers = {
        'Content-Length': fileSize,
        'Content-Type': 'video/webm',
    }
    res.writeHead(200, headers)
    fs.createReadStream(path).pipe(res);
});

let server = app.listen(config.server.port, function () {
    console.log('Express server listening on port ' + server.address().port);
});

module.exports = app;
