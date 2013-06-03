define(function (require) {
    var bus = require("sugar-web/bus");

    var datastore = {};

    function DatastoreObject(objectId) {
        this.objectId = objectId;
        this.newMetadata = {};

        var that = this;

        this.textToArrayBuffer = function (text, callback) {
            var blob = new Blob([text]);

            var reader = new FileReader();
            reader.onload = function (e) {
                callback(e.target.result);
            };
            reader.readAsArrayBuffer(blob);
        };

        this.saveDataAndMetadata = function (metadata, callback) {
            var that = this;

            function onGotOutputStream(outputStream) {
                var data = this.newDataAsText;

                that.textToArrayBuffer(data, function (buffer) {
                    outputStream.write(buffer);
                    outputStream.close(callback);
                });
            }

            function onCreated(error, objectId, outputStream) {
                that.objectId = objectId;
                onGotOutputStream(outputStream);
            }

            function onUpdated(error, outputStream) {
                onGotOutputStream(outputStream);
            }

            if (that.objectId === undefined) {
                datastore.create(metadata, onCreated);
            } else {
                datastore.update(that.objectId, metadata, onUpdated);
            }
        };

        this.saveWithMetadata = function (metadata, callback) {
            for (var key in this.newMetadata) {
                metadata[key] = this.newMetadata[key];
            }

            if (this.newDataAsText !== undefined) {
                this.saveDataAndMetadata(metadata, callback);
            } else {
                datastore.setMetadata(metadata, callback);
            }
        };
    }

    DatastoreObject.prototype.getMetadata = function (callback) {
        datastore.getMetadata(this.objectId, callback);
    };

    DatastoreObject.prototype.loadData = function (callback) {
        datastore.loadData(this.objectId, callback);
    };

    DatastoreObject.prototype.setMetadata = function (metadata) {
        for (var key in metadata) {
            this.newMetadata[key] = metadata[key];
        }
    };

    DatastoreObject.prototype.setDataAsText = function (text) {
        this.newDataAsText = text;
    };

    DatastoreObject.prototype.save = function (callback) {
        if (this.objectId === undefined) {
            this.saveWithMetadata({}, callback);
        } else {
            datastore.getMetadata(this.objectId, function (error, metadata) {
                this.saveWithMetadata(metadata, callback);
            });
        }
    };

    datastore.DatastoreObject = DatastoreObject;


    datastore.setMetadata = function (objectId, metadata, callback) {
        function onResponseReceived(error, result) {
            if (error === null) {
                callback(null);
            } else {
                callback(error);
            }
        }

        var params = [objectId, metadata];
        bus.sendMessage("datastore.set_metadata", params, onResponseReceived);
    };

    datastore.getMetadata = function (objectId, callback) {
        function onResponseReceived(error, result) {
            if (error === null) {
                callback(null, result[0]);
            } else {
                callback(error, null);
            }
        }

        var params = [objectId];
        bus.sendMessage("datastore.get_metadata", params, onResponseReceived);
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

            var params = [objectId, inputStream.streamId];
            bus.sendMessage("datastore.load_data", params, onResponseReceived);
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

            var params = [metadata, outputStream.streamId];
            bus.sendMessage("datastore.create", params, onResponseReceived);
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

            var params = [objectId, metadata, outputStream.streamId];
            bus.sendMessage("datastore.update", params, onResponseReceived);
        });
    };

    return datastore;
});
