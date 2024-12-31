define(["sugar-web/env"], function (env) {
    'use strict';

    describe("getObjectId", function () {
        it("should return objectId from the sugar's environment", function (done) {
            var environment = {
                objectId: "objectId"
            };
            
            spyOn(env, "getEnvironment").and.callFake(function (callback) {
                setTimeout(function () {
                    callback(null, environment);
                }, 0);
            });

            env.getObjectId(function (objectId) {
                expect(objectId).toEqual(environment.objectId);
                done();
            });
        });
    });

    describe("getEnvironment", function () {
        var sugarOrig;

        beforeEach(function () {
            sugarOrig = JSON.parse(JSON.stringify(window.top.sugar));
        });

        afterEach(function () {
            window.top.sugar = sugarOrig;
        });

        describe("in sugar mode", function () {
            beforeEach(function () {
                spyOn(env, 'isStandalone').and.returnValue(false);
            });

            describe("when env was already set", function () {
                it("should run callback with null error and env", function (done) {
                    var environment = {};
                    window.top.sugar = {
                        environment: environment
                    };
                    
                    env.getEnvironment(function(error, env) {
                        expect(error).toBeNull();
                        expect(env).toBe(environment);
                        done();
                    });
                });
            });

            describe("when env was not set, yet", function () {
                beforeEach(function () {
                    window.top.sugar = undefined;
                });

                it("should set onEnvironmentSet handler", function () {
                    env.getEnvironment(function () {});
                    expect(window.top.sugar.onEnvironmentSet).toBeDefined();
                });

                it("should run callback on EnvironmentSet event", function (done) {
                    var expectedEnv = "env";
                    
                    env.getEnvironment(function(error, env) {
                        expect(error).toBeNull();
                        expect(env).toBe(expectedEnv);
                        done();
                    });

                    window.top.sugar.environment = expectedEnv;
                    window.top.sugar.onEnvironmentSet();
                });
            });
        });
    });
});
