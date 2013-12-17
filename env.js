define(function () {

    'use strict';

    var env = {};

    env.getEnvironment = function (callback) {
        if (env.isStandalone()) {
            callback(null, {});
        } else {
            var sugar;

            if (window.top.sugar) {
                sugar = window.top.sugar;
            } else {
                sugar = {};
                window.top.sugar = sugar;
            }

            if (sugar.environment) {
                setTimeout(function () {
                    callback(null, sugar.environment);
                }, 0);
            } else {
                sugar.onEnvironmentSet = function () {
                    callback(null, sugar.environment);
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
