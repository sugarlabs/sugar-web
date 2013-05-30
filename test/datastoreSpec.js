define(function (require) {

    var datastore = require("sugar-html-datastore/datastore");

    describe("datastore", function () {

        function loadData(objectId, onLoaded) {
            var objectData;

            function onObjectLoaded() {
                onLoaded(objectData);
            }

            function onRead(data) {
                objectData = data;
            }

            function onStream(inputStream) {
                inputStream.read(8192, onRead);
                inputStream.close();
            }

            datastore.loadData(objectId, onStream, onObjectLoaded);
        }

        function createObject(metadata, data, onCreated) {
            function onStream(outputStream) {
                outputStream.write(data);
                outputStream.close();
            }

            datastore.create(metadata, onStream, onCreated);
        }

        it("should be able to create an object", function () {
            var wasCreated;

            runs(function () {
                wasCreated = false;

                function onCreated(objectId) {
                    expect(objectId).toEqual(jasmine.any(String));
                    wasCreated = true;
                }

                createObject({}, new Uint8Array([1, 2, 3, 4]), onCreated);
            });

            waitsFor(function () {
                return wasCreated;
            }, "the object should be created");
        });

        it("should be able to get object metadata", function () {
            var gotMetadata = false;

            var testData = new Uint8Array([1]);
            var testTitle = "hello";

            runs(function () {
                function onGotMetadata(metadata) {
                    console.log(metadata.title);
                    expect(metadata.title).toEqual(testTitle);
                    gotMetadata = true;
                }

                function onCreated(objectId) {
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
                function onLoaded(data) {
                    expect(data).toEqual(testData.buffer);

                    wasLoaded = true;
                }

                function onCreated(objectId) {
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
