define(function (require) {

    var bus = require("sugar-web/bus");
    var datastore = require("sugar-web/datastore");

    describe("datastore object", function () {

        beforeEach(function () {
            bus.listen();
        });

        afterEach(function () {
            bus.close();
        });

        it("should be able to get metadata", function () {
            var saved;
            var gotMetadata;
            var datastoreObject;
            var objectId;
            var testTitle = "hello";

            runs(function () {
                saved = false;

                datastoreObject = new datastore.DatastoreObject();
                datastoreObject.setMetadata({
                    title: testTitle
                });
                datastoreObject.setDataAsText("");

                datastoreObject.save(function () {
                    saved = true;
                    objectId = datastoreObject.objectId;
                });
            });

            waitsFor(function () {
                return saved;
            }, "should have saved the object");

            runs(function () {
                gotMetadata = false;

                datastoreObject = new datastore.DatastoreObject(objectId);
                datastoreObject.getMetadata(function (error, metadata) {
                    expect(metadata.title).toEqual(testTitle);
                    gotMetadata = true;
                });
            });

            waitsFor(function () {
                return gotMetadata;
            }, "should have got the object metadata");
        });

    });

    describe("datastore", function () {

        function loadData(objectId, callback) {
            var objectData;

            function onStreamClose(error, result) {
                callback(error, objectData);
            }

            function onStreamRead(data) {
                objectData = data;
            }

            function onLoaded(error, inputStream) {
                inputStream.read(8192, onStreamRead);
                inputStream.close(onStreamClose);
            }

            datastore.loadData(objectId, onLoaded);
        }

        function createObject(metadata, data, callback) {
            var createdObjectId;

            function onStreamClose(error) {
                callback(error, createdObjectId);
            }

            function onCreated(error, objectId, outputStream) {
                createdObjectId = objectId;
                outputStream.write(data);
                outputStream.close(onStreamClose);
            }

            datastore.create(metadata, onCreated);
        }

        beforeEach(function () {
            bus.listen();
        });

        afterEach(function () {
            bus.close();
        });

        it("should be able to create an object", function () {
            var wasCreated;

            runs(function () {
                wasCreated = false;

                function onCreated(error, objectId) {
                    expect(objectId).toEqual(jasmine.any(String));
                    wasCreated = true;
                }

                createObject({}, new Uint8Array([1, 2, 3, 4]), onCreated);
            });

            waitsFor(function () {
                return wasCreated;
            }, "the object should be created");
        });

        it("should be able to set object metadata", function () {
            var metadataSet;
            var gotMetadata;
            var objectId;
            var testTitle = "hello";

            runs(function () {
                function onMetadataSet(error) {
                    expect(error).toBeNull();
                    metadataSet = true;
                }

                function onCreated(error, createdObjectId) {
                    objectId = createdObjectId;

                    var metadata = {
                        title: testTitle
                    };
                    datastore.setMetadata(objectId, metadata, onMetadataSet);
                }

                metadataSet = false;

                createObject({}, new Uint8Array(), onCreated);
            });

            waitsFor(function () {
                return metadataSet;
            }, "metadata should be set");

            runs(function () {
                function onGotMetadata(error, metadata) {
                    expect(metadata.title).toEqual(testTitle);
                    gotMetadata = true;
                }

                gotMetadata = false;

                datastore.getMetadata(objectId, onGotMetadata);
            });

            waitsFor(function () {
                return gotMetadata;
            }, "should have got object metadata");
        });

        it("should be able to get object metadata", function () {
            var gotMetadata = false;

            var testData = new Uint8Array([1]);
            var testTitle = "hello";

            runs(function () {
                function onGotMetadata(error, metadata) {
                    expect(metadata.title).toEqual(testTitle);
                    gotMetadata = true;
                }

                function onCreated(error, objectId) {
                    datastore.getMetadata(objectId, onGotMetadata);
                }

                createObject({
                    "title": testTitle
                }, testData, onCreated);
            });

            waitsFor(function () {
                return gotMetadata;
            }, "should have got object metadata");
        });

        it("should be able to load an object", function () {
            var wasLoaded = false;

            var testData = new Uint8Array([1, 2, 3, 4]);

            runs(function () {
                function onLoaded(error, data) {
                    expect(data).toEqual(testData.buffer);

                    wasLoaded = true;
                }

                function onCreated(error, objectId) {
                    loadData(objectId, onLoaded);
                }

                createObject({}, testData, onCreated);
            });

            waitsFor(function () {
                return wasLoaded;
            }, "the object should be loaded");
        });
    });
});
