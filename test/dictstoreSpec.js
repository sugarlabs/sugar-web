define(["sugar-web/dictstore", "sugar-web/env"], function (dictstore, env) {

    'use strict';

    describe("dictstore on standalone mode", function () {

      beforeEach(function() {
        spyOn(env, 'isStandalone').andReturn(true);
      });

      describe("init method", function () {

        it("should execute callback", function () {

          var callback = jasmine.createSpy();

          dictstore.init(callback);
          expect(callback).toHaveBeenCalled();

        });

        it("should maintain localStorage", function () {

          localStorage.test_key = "test";

          dictstore.init(function () {});
          expect(localStorage.test_key).toBe("test");

        });

      });

      describe("save method", function () {

        it("should execute callback", function () {

          var callback = jasmine.createSpy();

          dictstore.save(callback);
          expect(callback).toHaveBeenCalled();

        });

        it("should saves on localStorage", function () {

          localStorage.test_key = "test";

          dictstore.save();
          expect(localStorage.test_key).toBe("test");

        });

      });

    });

});
