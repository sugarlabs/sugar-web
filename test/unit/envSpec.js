define(["sugar-web/env"], function (env) {

    'use strict';

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
        it("should return {} in standalone mode", function () {
            window.top.sugar = undefined;
            spyOn(env, 'isStandalone').andReturn(true);
            var actualEnv;

            runs(function () {
                env.getEnvironment(function (error, environment) {
                    actualEnv = environment;
                });
            });

            waitsFor(function () {
                return actualEnv !== undefined;
            }, "environment not to be undefined");

            runs(function () {
                expect(actualEnv).toEqual({});
            });

        });
    });
});
