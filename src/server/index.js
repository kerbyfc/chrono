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

let server = app.listen(config.server.port, function () {
    console.log('Express server listening on port ' + server.address().port);
});

module.exports = app;
