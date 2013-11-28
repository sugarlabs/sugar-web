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
            var environment = {
                objectId: "objectId"
            };
            spyOn(env, "getEnvironment").andCallFake(function (callback) {
                setTimeout(function () {
                    callback(null, environment);
                }, 5000);
            });
            var expected_objectId;

            runs(function () {
                env.getObjectId(function (objectId) {
                    expected_objectId = objectId;
                });
            });

            waitsFor(function () {
                return expected_objectId !== undefined;
            }, "should return objectId");
        });
    });

    describe("standalone mode", function () {

        it("should return true if in standalone mode", function () {
            var noWebActivityURLScheme = "http:";
            spyOn(env, 'getURLScheme').andReturn(noWebActivityURLScheme);

            var isStandaloneMode = env.isStandalone();
            expect(isStandaloneMode).toBe(true);
        });

        it("should return false if not in standalone mode", function () {
            var webActivityURLScheme = "activity:";
            spyOn(env, 'getURLScheme').andReturn(webActivityURLScheme);

            var isStandaloneMode = env.isStandalone();
            expect(isStandaloneMode).toBe(false);
        });
    });

    describe("getEnvironment", function () {

        describe("in sugar mode", function () {

            describe("when env was already set", function () {

                it("should run callback with null error and env", function () {
                    var sugarOrig = JSON.parse(
                        JSON.stringify(window.top.sugar));
                    var environment = {};
                    window.top.sugar = {
                        environment: environment
                    };
                    var callback = jasmine.createSpy();

                    runs(function () {
                        env.getEnvironment(callback);
                    });

                    waitsFor(function () {
                        return callback.wasCalled;
                    }, "callback should be executed");

                    runs(function () {
                        expect(callback).toHaveBeenCalledWith(
                            null, environment);
                        window.top.sugar = sugarOrig;
                    });
                });
            });

            describe("when env was not set, yet", function () {

                it("should set environment setter", function () {
                    var sugarOrig = JSON.parse(
                        JSON.stringify(window.top.sugar));
                    window.top.sugar = {};
                    var sugar = window.top.sugar;
                    expect(sugar.environment).toBeUndefined();

                    env.getEnvironment(function () {});
                    expect(sugar.onEnvironmentSet).not.toBeUndefined();

                    window.top.sugar = sugarOrig;
                });
            });
        });
    });
});
