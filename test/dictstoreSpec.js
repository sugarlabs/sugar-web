define(["sugar-web/dictstore", "sugar-web/env"], function (dictstore, env) {

    'use strict';

    describe("dictstore on standalone mode", function () {

      it("init should execute callback", function () {

        spyOn(env, 'isStandalone').andReturn(true);
        var callback = jasmine.createSpy();

        dictstore.init(callback);
        expect(callback).toHaveBeenCalled();

      });

      it("init should maintain localStorage", function () {

        spyOn(env, 'isStandalone').andReturn(true);
        localStorage.test_key = "test";

        dictstore.init(function () {});
        expect(localStorage.test_key).toBe("test");

      });

    });

});
