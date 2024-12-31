define(["sugar-web/graphics/icon"], function (icon) {
    'use strict';

    describe("icon", function () {
        it("should be able to change icon more than once", function (done) {
            var elem = document.createElement('div');
            var initialIconUrl = "/base/graphics/icons/actions/dialog-ok-active.svg";
            var firstIconUrl;

            // First icon load
            var iconInfo = {
                "uri": initialIconUrl,
                "strokeColor": '#B20008',
                "fillColor": '#FF2B34'
            };

            icon.load(iconInfo, function(firstUrl) {
                expect(firstUrl).not.toBe(initialIconUrl);
                firstIconUrl = firstUrl;

                // Second icon load with different colors
                var secondIconInfo = {
                    "uri": firstUrl,
                    "strokeColor": '#FF2B34',
                    "fillColor": '#B20008'
                };

                icon.load(secondIconInfo, function(secondUrl) {
                    expect(secondUrl).not.toBe(firstIconUrl);
                    done();
                });
            });
        });
    });
});
