"use strict";

importScripts('http://cdn.socket.io/socket.io-1.1.0.js');

var socket = io(self.name),
    ports = [];

addEventListener('connect', function (event) {
    var port = event.ports[0];
    ports.push(port);
    port.start();

    port.addEventListener("message", function (event) {
        for (var i = 0; i < event.data.events.length; ++i) {
            var eventName = event.data.events[i];

            socket.on(event.data.events[i], function (e) {
                port.postMessage({type: eventName, message: e});
            });
        }
    });
});

socket.on('connect', function () {
    for (var i = 0; i < ports.length; i++) {
        ports[i].postMessage({type: '_connect'});
    }
});

socket.on('disconnect', function () {
    for (var i = 0; i < ports.length; i++) {
        ports[i].postMessage({type: '_disconnect'});
    }
});