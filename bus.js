define(function (require) {
    var env = require("sugar-web/env");

    var lastId = 0;
    var callbacks = {};
    var client = null;
    var inputStreams = [];

    function WebSocketClient(environment) {
        this.queue = [];
        this.socket = null;

        var me = this;

        env.getEnvironment(function (error, environment) {
            var socket = new WebSocket("ws://localhost:" +
                                       environment.apiSocketPort);
            socket.binaryType = "arraybuffer";

            socket.onopen = function () {
                var params = [environment.activityId,
                              environment.apiSocketKey];

                socket.send(JSON.stringify({
                    "method": "authenticate",
                    "id": "authenticate",
                    "params": params
                }));

                while (me.queue.length > 0) {
                    socket.send(me.queue.shift());
                }
            };

            socket.onmessage = function (message) {
                me.onMessage(message);
            };

            me.socket = socket;
        });
    }

    WebSocketClient.prototype.send = function (data) {
        if (this.socket && this.socket.readyState == WebSocket.OPEN) {
            this.socket.send(data);
        } else {
            this.queue.push(data);
        }
    };

    WebSocketClient.prototype.close = function () {
        this.socket.close();
    };

    var bus = {};

    function InputStream() {
        this.streamId = null;
        this._readCallback = null;
    }

    InputStream.prototype.open = function (callback) {
        var me = this;
        bus.sendMessage("open_stream", [], function (result) {
            me.streamId = result;
            inputStreams[me.streamId] = me;
            callback();
        });
    };

    InputStream.prototype.read = function (count, callback) {
        if (this._readCallback) {
            throw Error("Read already in progress");
        }

        this._readCallback = callback;

        var buffer = new ArrayBuffer(8);

        var headerView = new Uint8Array(buffer, 0, 1);
        headerView[0] = this.streamId;

        var bodyView = new Uint32Array(buffer, 4, 1);
        bodyView[0] = count;

        bus.sendBinary(buffer);
    };

    InputStream.prototype.gotData = function (buffer) {
        this._readCallback(buffer);
        this._readCallback = null;
    };

    InputStream.prototype.close = function () {
        var me = this;
        bus.sendMessage("close_stream", [this.streamId], function () {
            delete inputStreams[me.streamId];
        });
    };

    function OutputStream() {
        this.streamId = null;
    }

    OutputStream.prototype.open = function (callback) {
        var me = this;
        bus.sendMessage("open_stream", [], function (result) {
            me.streamId = result;
            callback();
        });
    };

    OutputStream.prototype.write = function (data) {
        var buffer = new ArrayBuffer(data.byteLength + 1);

        var bufferView = new Uint8Array(buffer);
        bufferView[0] = this.streamId;
        bufferView.set(new Uint8Array(data), 1);

        bus.sendBinary(buffer);
    };

    OutputStream.prototype.close = function () {
        bus.sendMessage("close_stream", [this.streamId]);
    };

    bus.createInputStream = function (callback) {
        return new InputStream();
    };

    bus.createOutputStream = function (callback) {
        return new OutputStream();
    };

    bus.sendMessage = function (method, params, callback) {
        message = {
            "method": method,
            "id": lastId,
            "params": params
        };

        if (callback) {
            callbacks[lastId] = callback;
        }

        client.send(JSON.stringify(message));

        lastId++;
    };

    bus.sendBinary = function (buffer, callback) {
        client.send(buffer);
    };

    bus.listen = function () {
        client = new WebSocketClient();

        client.onMessage = function (message) {
            if (typeof message.data != "string") {
                var dataView = new Uint8Array(message.data);
                var streamId = dataView[0];

                if (streamId in inputStreams) {
                    var inputStream = inputStreams[streamId];
                    inputStream.gotData(message.data.slice(1));
                }

                return;
            }

            var parsed = JSON.parse(message.data);
            var responseId = parsed.id;
            if (responseId in callbacks) {
                callbacks[responseId](parsed.result);
                delete callbacks[responseId];
            }
        };
    };

    bus.close = function () {
        client.close();
        client = null;
    };

    return bus;
});
