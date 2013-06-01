define(function (require) {
    var bus = require("sugar-web/bus");

    var datastore = {};

    datastore.getMetadata = function (objectId, onGotMetadata) {
        function onResponseReceived(error, result) {
            if (error === null) {
                onGotMetadata(null, result[0]);
            } else {
                onGotMetadata(error, null);
            }
        }

        bus.sendMessage("datastore.get_metadata",
                        [objectId], onResponseReceived);
    };

    datastore.loadData = function (objectId, onStream, onLoaded) {
        inputStream = bus.createInputStream();

        inputStream.open(function (error) {
            function onResponseReceived(responseError, result) {
                if (responseError === null) {
                    onLoaded(null, result[0]);
                } else {
                    onLoaded(responseError, null);
                }
            }

            bus.sendMessage("datastore.load_data",
                            [objectId, inputStream.streamId],
                            onResponseReceived);

            onStream(error, inputStream);
        });
    };

    datastore.create = function (metadata, onStream, onCreated) {
        outputStream = bus.createOutputStream();

        outputStream.open(function (error) {
            function onResponseReceived(responseError, result) {
                if (responseError === null) {
                    onCreated(null, result[0]);
                } else {
                    onCreated(responseError, null);
                }
            }

            bus.sendMessage("datastore.create",
                            [metadata, outputStream.streamId],
                            onResponseReceived);

            onStream(error, outputStream);
        });
    };

    datastore.update = function (objectId, metadata, onStream, onUpdated) {
        outputStream = bus.createOutputStream();

        outputStream.open(function (error) {
            function onResponseReceived(responseError, result) {
                if (responseError === null) {
                    onUpdated(null, result[0]);
                } else {
                    onUpdated(responseError, null);
                }
            }

            bus.sendMessage("datastore.update",
                            [objectId, metadata, outputStream.streamId],
                            onResponseReceived);

            onStream(error, outputStream);
        });
    };

    return datastore;
});
