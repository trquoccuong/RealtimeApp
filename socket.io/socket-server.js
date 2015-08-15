'use strict';
var socketIO = require('socket.io');
var qs = require('querystring');
var datatofile = require('datatofile');
var session  = require('./session');

var users = {};

module.exports = function (server) {
    var io = socketIO(server);

    io.use(function(socket, next){
        session(socket.request,socket.request.res,next);
    })

    io.on('connection', function (socket) {
        var sessionID = socket.request.sessionID;

        if(users[sessionID]){
            if(users[sessionID].sockets.indexOf(socket.id) > -1) {

            } else {
                users[sessionID].sockets.push(socket.id)
            }
        } else {
            users[sessionID] = {};
            users[sessionID].sockets = [];
        }

        socket.on('disconnect', function () {
            var index = users[sessionID].sockets.indexOf(socket.id);
            users[sessionID].sockets.splice(index,1);
        });

        socket.emit('welcome',{hello : 'world'});
        socket.on('login', function (data) {
            console.log(data);
        })
    })

}