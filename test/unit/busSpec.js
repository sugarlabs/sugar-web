define(["sugar-web/bus"], function (bus) {
    'use strict';

    describe("bus requests", function () {
        var client;

        function MockClient() {
            this.result = [];
            this.error = null;
        }

        MockClient.prototype.send = function (data) {
            var that = this;
            setTimeout(function () {
                var parsed = JSON.parse(data);
                var message = {
                    data: JSON.stringify({
                        result: that.result,
                        error: that.error,
                        id: parsed.id
                    })
                };
                that.onMessage(message);
            }, 0);
        };

        MockClient.prototype.close = function () {};

        beforeEach(function () {
            client = new MockClient();
            bus.listen(client);
        });

        afterEach(function () {
            bus.close();
            client = null;
        });

        it("should receive a response", function (done) {
            function onResponseReceived(error, result) {
                expect(error).toBeNull();
                expect(result).toEqual(["hello"]);
                done();
            }

            client.result = ["hello"];
            bus.sendMessage("hello", [], onResponseReceived);
        });

        it("should receive an error", function (done) {
            function onResponseReceived(error, result) {
                expect(error).toEqual(jasmine.any(Error));
                expect(result).toBeNull();
                done();
            }

            client.result = null;
            client.error = new Error("error");
            bus.sendMessage("hello", [], onResponseReceived);
        });
    });

    describe("bus notifications", function () {
        var client;

        function MockClient() {
            this.params = null;
        }

        MockClient.prototype.send_notification = function (method, params) {
            var that = this;
            setTimeout(function () {
                var message = {
                    data: JSON.stringify({
                        method: method,
                        params: that.params
                    })
                };
                that.onMessage(message);
            }, 0);
        };

        MockClient.prototype.close = function () {};

        beforeEach(function () {
            client = new MockClient();
            bus.listen(client);
        });

        afterEach(function () {
            bus.close();
            client = null;
        });

        it("should receive a notification", function (done) {
            var originalParams = {
                param1: true,
                param2: "foo"
            };

            function onNotificationReceived(params) {
                expect(params).toEqual(originalParams);
                done();
            }

            bus.onNotification("hey.there", onNotificationReceived);
            client.params = originalParams;
            client.send_notification("hey.there");
        });
    });
});
