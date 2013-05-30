define(function (require) {
    var bus = require("bus/bus");

    var datastore = {};

    datastore.getMetadata = function (objectId, onGotMetadata) {
        var params = [objectId];
        bus.sendMessage("datastore.get_metadata", params, function (result) {
            onGotMetadata(result[0]);
        });
    };

    datastore.loadData = function (objectId, onStream, onLoaded) {
        inputStream = bus.createInputStream();

        inputStream.open(function () {
            var params = [objectId, inputStream.streamId];
            bus.sendMessage("datastore.load_data", params, function (result) {
                if (onLoaded) {
                    onLoaded();
                }
            });

            onStream(inputStream);
        });
    };

    datastore.create = function (metadata, onStream, onCreated) {
        outputStream = bus.createOutputStream();

        outputStream.open(function () {
            var params = [metadata, outputStream.streamId];
            bus.sendMessage("datastore.create", params, function (result) {
                onCreated(result);
            });

            onStream(outputStream);
        });
    };

    datastore.update = function (objectId, metadata, onStream, onUpdated) {
        outputStream = bus.createOutputStream();

        outputStream.open(function () {
            var params = [objectId, metadata, outputStream.streamId];
            bus.sendMessage("datastore.update", params, function () {
                onUpdated();
            });

            onStream(outputStream);
        });
    };

    return datastore;
});
