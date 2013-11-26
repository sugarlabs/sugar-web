define(["sugar-web/env"], function (env) {

    'use strict';

    describe("environment", function () {

        it("should not return undefined", function () {

            env.getEnvironment(function (error, environment) {
                expect(environment.bundleId).not.toBeUndefined();
                expect(environment.activityId).not.toBeUndefined();
                expect(environment.activityName).not.toBeUndefined();
            });
        });

        it("should return objectId provided from the sugar's environment", function () {
            var environment = {objectId: "objectId"};
            spyOn(env, "getEnvironment").andCallFake(function (callback){
                setTimeout(function () {
                    callback(null, environment);
                }, 5000);
            });
            var expected_objectId;

            runs(function() {
                env.getObjectId(function (objectId){
                    expected_objectId = objectId;
                });
            });

            waitsFor(function () {
                return expected_objectId !== undefined;
            }, "should return objectId");
        });
    });
});
