'use strict';
var socketIO = require('socket.io');
var qs = require('querystring');
var session  = require('./session');

var users = [];

module.exports = function (server) {
    var io = socketIO(server);


    io.use(function(socket, next){
        session(socket.request,socket.request.res,next);
    });

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
            if(socket.request.session.passport) {
                users[sessionID].name = socket.request.session.passport.user.name;
            }
        }

        socket.on('disconnect', function () {
            var index = users[sessionID].sockets.indexOf(socket.id);
            users[sessionID].sockets.splice(index,1);
        });

        socket.on('userMessage', function (data) {
            data.username = users[sessionID].name;
            console.log(data);
            io.emit('userMessage',data);
        })

        socket.emit('welcome',{hello : 'world'});
        socket.on('login', function (data) {
            console.log(data);
        })
    })

}