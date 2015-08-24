'use strict';

var express = require('express');
var app = express();

app.get('/', function (req,res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/time', function (req,res) {
    console.log(typeof res, res.prototype.isPrototypeOf('OutgoingMessage'));
    res.writeHead(200,{
        "Content-Type" : "text/event-stream",
        "Cache-Control" : "no-cache",
        "Connection" : "keep-alive"
    });
    res.write(":" + Array(2049).join(" ") + "\n");
    res.write("retry: 2000\n");

    res.on("close", function () {
        console.log("client disconnected");
    });

    setInterval(function () {
        res.write("data: " + new Date() + "\n");
    },1000);
});


app.listen(80);