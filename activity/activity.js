define(function (require) {
    var l10n = require("webL10n");
    var shortcut = require("sugar-web/activity/shortcut");
    var bus = require("sugar-web/bus");
    var env = require("sugar-web/env");
    var datastore = require("sugar-web/datastore");

    var datastoreObject = null;

    var activity = {};

    activity.setup = function () {
        bus.listen();

        l10n.start();

        shortcut.add("Ctrl", "Q", this.close);

        datastoreObject = new datastore.DatastoreObject();

        env.getEnvironment(function (error, environment) {
            datastoreObject.setMetadata({
                "activity": environment.bundleId,
                "activity_id": environment.activityId
            });
            datastoreObject.save(function () {});
        });
    };

    activity.getDatastoreObject = function () {
        return datastoreObject;
    };

    activity.getXOColor = function (callback) {
        function onResponseReceived(error, result) {
            if (error === null) {
                callback(null, {
                    stroke: result[0][0],
                    fill: result[0][1]
                });
            } else {
                callback(null, {
                    stroke: "#00A0FF",
                    fill: "#8BFF7A"
                });
            }
        }

        bus.sendMessage("activity.get_xo_color", [], onResponseReceived);
    };

    activity.close = function (callback) {
        function onResponseReceived(error, result) {
            if (error === null) {
                callback(null);
            } else {
                console.log("activity.close called");
            }
        }

        bus.sendMessage("activity.close", [], onResponseReceived);
    };

    return activity;
});
