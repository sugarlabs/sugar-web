// Karma configuration for unit tests

sharedConfig = require("./karma-shared.conf.js");

module.exports = function (config) {
    var testFiles = [
        {
            pattern: 'test/unit/**/*.js',
            included: false
        }
    ];

    sharedConfig(config);

    config.files = config.files.concat(testFiles);
};
