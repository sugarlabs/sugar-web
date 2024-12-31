define(["sugar-web/dictstore", "sugar-web/env"], function (dictstore, env) {
    'use strict';

    describe("dictstore on standalone mode", function () {
        beforeEach(function () {
            spyOn(env, 'isStandalone').and.returnValue(true);
        });

        describe("init method", function () {
            it("should execute callback", function (done) {
                var callback = jasmine.createSpy().and.callFake(function() {
                    expect(callback).toHaveBeenCalled();
                    done();
                });

                dictstore.init(callback);
            });

            it("should maintain localStorage", function (done) {
                localStorage.testKey = "test";

                dictstore.init(function () {
                    expect(localStorage.testKey).toBe("test");
                    done();
                });
            });
        });

        describe("save method", function () {
            it("should just execute the callback", function (done) {
                localStorage.test_key = "test";

                dictstore.save(function () {
                    expect(localStorage.test_key).toBe("test");
                    done();
                });
            });
        });
    });
});
