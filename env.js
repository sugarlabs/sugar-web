define(function () {

    'use strict';

    var env = {};

    env.getEnvironment = function (callback) {
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
    };

    env.get_current_protocol = function () {
        return window.location.protocol;
    };

    env.isStandalone = function () {
        var activity_protocol = "activity:";
        var current_protocol = env.get_current_protocol();

        return current_protocol !== activity_protocol;
    };

    return env;
});
