(function (gio) {
    "use strict";

    var onConnect = function () {
        console.log("connected!");
    };

    var onDisConnect = function () {
        console.log("disconnect!");
    };

    var ws = gio("http://localhost:8080", onConnect, onDisConnect);
    ws.setWorker("sharedWorker.js");

    ws.registerEvent("message", function (data) {
        console.log("message", data);
    });

    ws.onError(function (data) {
        console.log("error", data);
    });

    ws.start();
}(gio));