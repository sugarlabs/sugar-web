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
          var no_activity_protocol = "http:";
          spyOn(env, 'get_url_scheme').andReturn(no_activity_protocol);

          var is_standalone_mode = env.isStandalone();
          expect(is_standalone_mode).toBe(true);
        });

        it("should return false if not in standalone mode", function () {
          var activity_protocol = "activity:";
          spyOn(env, 'get_url_scheme').andReturn(activity_protocol);

          var is_standalone_mode = env.isStandalone();
          expect(is_standalone_mode).toBe(false);
        });
    });
});
