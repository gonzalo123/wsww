var gio = function (uri, onConnect, onDisConnect) {
    "use strict";
    var worker, onError, workerUri, events = {};

    function getKeys(obj) {
        var keys = [];

        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                keys.push(i);
            }
        }

        return keys;
    }

    function onMessage(type, message) {
        switch (type) {
            case '_connect':
                if (onConnect) onConnect();
                break;
            case '_disconnect':
                if (onDisConnect) onDisConnect();
                break;
            default:
                if (events[type]) events[type](message);
        }
    }

    function startWorker() {
        worker = new SharedWorker(workerUri, uri);
        worker.port.addEventListener("message", function (event) {
            onMessage(event.data.type, event.data.message);

        }, false);

        worker.onerror = function (evt) {
            if (onError) onError(evt);
        };

        worker.port.start();
        worker.port.postMessage({events: getKeys(events)});
    }

    function startSocketIo() {
        var socket = io(uri);
        socket.on('connect', function () {
            if (onConnect) onConnect();
        });

        socket.on('disconnect', function () {
            if (onDisConnect) onDisConnect();
        });

        for (var eventName in events) {
            if (events.hasOwnProperty(eventName)) {
                socket.on(eventName, socketOnEventHandler(eventName));
            }
        }
    }

    function socketOnEventHandler(eventName) {
        return function (e) {
            onMessage(eventName, e);
        };
    }

    return {
        registerEvent: function (eventName, callback) {
            events[eventName] = callback;
        },

        start: function () {
            if (!SharedWorker) {
                startSocketIo();
            } else {
                startWorker();
            }
        },

        onError: function (cbk) {
            onError = cbk;
        },

        setWorker: function (uri) {
            workerUri = uri;
        }
    };
};