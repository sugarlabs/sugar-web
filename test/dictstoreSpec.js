define(["sugar-web/dictstore", "sugar-web/env"], function (dictstore, env) {

    'use strict';

    describe("dictstore on standalone mode", function () {

      describe("init method", function () {

        it("should execute callback", function () {
          spyOn(env, 'isStandalone').andReturn(true);
          var callback = jasmine.createSpy();

          dictstore.init(callback);
          expect(callback).toHaveBeenCalled();
        });

        it("should maintain localStorage", function () {
          spyOn(env, 'isStandalone').andReturn(true);
          localStorage.test_key = "test";

          dictstore.init(function () {});
          expect(localStorage.test_key).toBe("test");
        });
      });

      describe("save method", function () {

        it("should just execute the callback", function () {
          spyOn(env, 'isStandalone').andReturn(true);
          var callback_executed;

          localStorage.test_key = "test";

          runs(function () {
            callback_executed = false;

            dictstore.save(function () {
              callback_executed = true;
            });
          });

          waitsFor(function () {
            return callback_executed === true;
          }, "The callback should executed");

          runs(function () {
            expect(localStorage.test_key).toBe("test");
          });
        });
      });

    });
});
