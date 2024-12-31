define(["sugar-web/env", "sugar-web/datastore"], function (env, datastore) {
    'use strict';

    describe("Ensure the datastore object has an objectId", function () {
        it("should have objectId", function (done) {
            var objectId = "objectId";
            
            spyOn(env, "getObjectId").and.callFake(function (callback) {
                setTimeout(function () {
                    callback(objectId);
                }, 0);
            });

            var callback = jasmine.createSpy();
            var datastoreObject = new datastore.DatastoreObject();

            datastoreObject.ensureObjectId(function() {
                expect(callback).toHaveBeenCalled();
                expect(datastoreObject.objectId).toBeDefined();
                expect(datastoreObject.objectId).toEqual(objectId);
                done();
            });

            callback();
        });
    });
});
