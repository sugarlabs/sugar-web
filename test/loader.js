var tests = Object.keys(window.__karma__.files).filter(function (file) {
    return (/Spec\.js$/).test(file);
});

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: "/base",

    paths: {
        "sugar-web": ".",
        "mustache": "node_modules/mustache/mustache",
        "text": "lib/text",
        "webL10n": "node_modules/webL10n/webL10n",
    },

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});
