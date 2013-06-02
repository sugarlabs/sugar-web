define(function (require) {
    var bus = require("sugar-web/bus");

    var datastore = {};

    datastore.getMetadata = function (objectId, callback) {
        function onResponseReceived(error, result) {
            if (error === null) {
                callback(null, result[0]);
            } else {
                callback(error, null);
            }
        }

        bus.sendMessage("datastore.get_metadata",
                        [objectId], onResponseReceived);
    };

    datastore.loadData = function (objectId, callback) {
        inputStream = bus.createInputStream();

        inputStream.open(function (error) {
            function onResponseReceived(responseError, result) {
                if (responseError === null) {
                    callback(null, inputStream);
                } else {
                    callback(responseError, null);
                }
            }

            bus.sendMessage("datastore.load_data",
                            [objectId, inputStream.streamId],
                            onResponseReceived);
        });
    };

    datastore.create = function (metadata, callback) {
        outputStream = bus.createOutputStream();

        outputStream.open(function (error) {
            function onResponseReceived(responseError, result) {
                if (responseError === null) {
                    callback(null, result[0], outputStream);
                } else {
                    callback(responseError, null, null);
                }
            }

            bus.sendMessage("datastore.create",
                            [metadata, outputStream.streamId],
                            onResponseReceived);
        });
    };

    datastore.update = function (objectId, metadata, callback) {
        outputStream = bus.createOutputStream();

        outputStream.open(function (error) {
            function onResponseReceived(responseError, result) {
                if (responseError === null) {
                    callback(null, result[0], outputStream);
                } else {
                    callback(responseError, null, null);
                }
            }

            bus.sendMessage("datastore.update",
                            [objectId, metadata, outputStream.streamId],
                            onResponseReceived);
        });
    };

    return datastore;
});
