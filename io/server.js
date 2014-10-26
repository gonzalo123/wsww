var io, connectedSockets;

io = require('socket.io').listen(8080);
connectedSockets = 0;

io.sockets.on('connection', function (socket) {
    connectedSockets++;
    console.log("Socket connected! Conected sockets:", connectedSockets);

    socket.on('disconnect', function () {
        connectedSockets--;
        console.log("Socket disconnect! Conected sockets:", connectedSockets);
    });
});

setInterval(function() {
    io.emit("message", "Hola " + new Date().getTime());
}, 1000);
