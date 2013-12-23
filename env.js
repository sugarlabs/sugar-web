define(function () {

    'use strict';

    var env = {};

    env.getEnvironment = function (callback) {
        if (env.isStandalone()) {
            callback(null, {});
        } else {
            var environmentCallback = function () {
                callback(null, window.top.sugar.environment);
            };
            if (window.top.sugar) {
                setTimeout(function () {
                    environmentCallback();
                }, 0);
            } else {
                window.top.sugar = {};
                window.top.sugar.onEnvironmentSet = function () {
                    environmentCallback();
                };
            }
        }
    };

    env.getObjectId = function (callback) {
        var objectId;
        env.getEnvironment(function (error, environment) {
            objectId = environment.objectId;
            callback(objectId);
        });
    };

    env.getURLScheme = function () {
        return window.location.protocol;
    };

    env.isStandalone = function () {
        var webActivityURLScheme = "activity:";
        var currentURLScheme = env.getURLScheme();

        return currentURLScheme !== webActivityURLScheme;
    };

    return env;
});
