var app = require('express')();
var WebSocketServer = require('ws').Server;
var toJsonFile = require('datatofile');

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

var server = app.listen(3000);

var wss = new WebSocketServer({port : 3333});

var userArray = {};
wss.on('connection', function (ws) {
    var userId = ws.upgradeReq.headers['sec-websocket-key'];
    ws.send(JSON.stringify({type :"updateUser", users : JSON.stringify(userArray)}));
    if(!(userArray[userId])) {
        userArray[userId] = ""
    };
    ws.on('message', function (message) {
        var msg = JSON.parse(message);
        if(msg.type = "newUser"){
            userArray[userId] = msg.username;
        }
        wss.clients.forEach(function each(client) {
            client.send(message);
        });
    })
    ws.on('close', function () {
        delete userArray[userId];
        wss.clients.forEach(function each(client) {
            client.send(JSON.stringify({type :"updateUser", users : JSON.stringify(userArray)}));

        });
    })
})