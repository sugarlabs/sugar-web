define(["sugar-web/env"], function (env) {

    'use strict';

    describe("Environment object", function () {

        it("should have valid properties", function () {
            var expectedEnv;

            runs(function () {
                env.getEnvironment(function (error, environment) {
                    expectedEnv = environment;
                });
            });

            waitsFor(function () {
                return expectedEnv !== undefined;
            }, "should get sugar environment");

            runs(function () {
                expect(expectedEnv.bundleId).not.toBeUndefined();
                expect(expectedEnv.activityId).not.toBeUndefined();
                expect(expectedEnv.activityName).not.toBeUndefined();
            });
        });
    });
});
