define(function (require) {
    var lastId = 0;
    var callbacks = {};
    var queue = [];
    var socket = null;
    var inputStreams = [];

    function start() {
        socket = new WebSocket("ws://localhost:" + window.top.sugarPort);
        socket.binaryType = "arraybuffer";

        socket.onopen = function () {
            params = [window.top.sugarId, window.top.sugarKey];

            socket.send(JSON.stringify({
                "method": "authenticate",
                "id": "authenticate",
                "params": params
            }));

            while (queue.length > 0) {
                socket.send(queue.shift());
            }
        };

        socket.onmessage = function (message) {
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
    }

    function sendOrQueue(data) {
        if (socket.readyState == WebSocket.OPEN) {
            socket.send(data);
        } else {
            queue.push(data);
        }
    }

    if (window.top.sugarKey &&
        window.top.sugarPort &&
        window.top.sugarId) {
        start();
    } else {
        window.top.onSugarAuthSet = function () {
            start();
        };
    }

    var Bus = {};

    function InputStream() {
        this.streamId = null;
        this._readCallback = null;
    }

    InputStream.prototype.open = function (callback) {
        var me = this;
        Bus.sendMessage("open_stream", [], function (result) {
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

        Bus.sendBinary(buffer);
    };

    InputStream.prototype.gotData = function (buffer) {
        this._readCallback(buffer);
        this._readCallback = null;
    };

    InputStream.prototype.close = function () {
        var me = this;
        Bus.sendMessage("close_stream", [this.streamId], function () {
            delete inputStreams[me.streamId];
        });
    };

    function OutputStream() {
        this.streamId = null;
    }

    OutputStream.prototype.open = function (callback) {
        var me = this;
        Bus.sendMessage("open_stream", [], function (result) {
            me.streamId = result;
            callback();
        });
    };

    OutputStream.prototype.write = function (data) {
        var buffer = new ArrayBuffer(data.byteLength + 1);

        var bufferView = new Uint8Array(buffer);
        bufferView[0] = this.streamId;
        bufferView.set(new Uint8Array(data), 1);

        Bus.sendBinary(buffer);
    };

    OutputStream.prototype.close = function () {
        Bus.sendMessage("close_stream", [this.streamId]);
    };

    Bus.createInputStream = function (callback) {
        return new InputStream();
    };

    Bus.createOutputStream = function (callback) {
        return new OutputStream();
    };

    Bus.sendMessage = function (method, params, callback) {
        message = {
            "method": method,
            "id": lastId,
            "params": params
        };

        if (callback) {
            callbacks[lastId] = callback;
        }

        sendOrQueue(JSON.stringify(message));

        lastId++;
    };

    Bus.sendBinary = function (buffer, callback) {
        sendOrQueue(buffer);
    };

    return Bus;
});
