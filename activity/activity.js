define(function (require) {
    var shortcut = require("sugar-web/activity/shortcut");

    var activity = {};

    var bus = require("sugar-web/bus");

    activity.setup = function () {
        shortcut.add("Ctrl", "Q", this.close);
    };

    activity.getXOColor = function (callback) {
        function onResponseReceived(error, result) {
            if (error === null) {
                callback(null, ["#00A0FF", "#8BFF7A"]);
            } else {
                callback(null, result[0]);
            }
        }

        bus.sendMessage("activity.get_xo_color", [], onResponseReceived);
    };

    activity.close = function (callback) {
        function onResponseReceived(error, result) {
            if (error === null) {
                console.log("activity.close called");
            }

            callback(null);
        }

        bus.sendMessage("activity.close", [], onResponseReceived);
    };

    return activity;
});
