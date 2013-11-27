define(["sugar-web/dictstore", "sugar-web/env", "sugar-web/activity/activity"], function (dictstore, env, activity) {

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

        it("should just execute the callback", function () {
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

    describe("dictstore on sugar mode", function () {

      beforeEach(function() {
        spyOn(env, 'isStandalone').andReturn(false);
      });

      describe("init method", function () {

        function MockDatastoreObject(jsonData) {
          this.loadAsText = function (callback) {
            setTimeout(function () {
              callback(null, [], jsonData);
            }, 1000);
          };
        }

        it("should populate localStorage", function () {
          var initiated = false;
          var jsonData = '{"key": "value"}';
          var datastore_obj = new MockDatastoreObject(jsonData);
          spyOn(activity, "getDatastoreObject").andReturn(datastore_obj);

          runs(function () {
            dictstore.init(function () {
              initiated = true;
            });
          });

          waitsFor(function () {
            return initiated;
          }, "callback should be executed");

          runs(function () {
            expect(localStorage.key).toBe("value");
          });
        });
      });
    });
});
