var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3333);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    var id = socket.id;
    socket.on('mousemove', function (data) {
        data.id = id;
        io.emit('moving',data)
    })
    socket.on('disconnect', function () {
       socket.emit('disconnect',id)
    })
});