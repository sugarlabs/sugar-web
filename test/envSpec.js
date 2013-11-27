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
});
