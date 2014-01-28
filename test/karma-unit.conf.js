// Karma configuration for unit tests

shared_config = require("./karma.conf.js");

module.exports = function (config) {
    shared_config(config);

    config.set({
        files: [
        'test/loader.js', {
                pattern: 'test/unit/*Spec.js',
                included: false
        }, {
                pattern: 'test/graphics/*Spec.js',
                included: false
        }, {
                pattern: 'lib/**/*.js',
                included: false
        }, {
                pattern: '*.js',
                included: false
        }, {
                pattern: 'activity/**/*.js',
                included: false
        }, {
                pattern: 'graphics/**/*',
                included: false
        }
        ],
    });
};
