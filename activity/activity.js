define(["webL10n",
        "sugar-web/activity/shortcut",
        "sugar-web/bus",
        "sugar-web/env",
        "sugar-web/datastore"], function (
    l10n, shortcut, bus, env, datastore) {

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
