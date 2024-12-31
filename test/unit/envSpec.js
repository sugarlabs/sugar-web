define(["sugar-web/env"], function (env) {
    'use strict';

    describe("standalone mode", function () {
        it("should return true if in standalone mode", function () {
            var noWebActivityURLScheme = "http:";
            spyOn(env, 'getURLScheme').and.returnValue(noWebActivityURLScheme);

            var isStandaloneMode = env.isStandalone();
            expect(isStandaloneMode).toBe(true);
        });

        it("should return false if not in standalone mode", function () {
            var webActivityURLScheme = "activity:";
            spyOn(env, 'getURLScheme').and.returnValue(webActivityURLScheme);

            var isStandaloneMode = env.isStandalone();
            expect(isStandaloneMode).toBe(false);
        });
    });

    describe("getEnvironment", function () {
        it("should return {} in standalone mode", function (done) {
            window.top.sugar = undefined;
            spyOn(env, 'isStandalone').and.returnValue(true);
            
            env.getEnvironment(function (error, environment) {
                expect(environment).toEqual({});
                done();
            });
        });
    });
});
