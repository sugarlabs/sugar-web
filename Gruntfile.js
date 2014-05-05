module.exports = function (grunt) {

    grunt.initConfig({
        jshint: {
            all: [
                '*.js',
                'activity/**/*.js',
                'graphics/**/*.js',
                'test/**/*.js']
        },
        karma: {
            unit: {
                configFile: 'test/karma-unit.conf.js',
                browsers: ['Chrome'],
                singleRun: true
            },
            functional: {
                configFile: 'test/karma-functional.conf.js',
                browsers: ['Chrome'],
                singleRun: true
            }
        },
        jsbeautifier: {
            mode: 'VERIFY_ONLY',
            files: [
                '*.js',
                'activity/**/*.js',
                'graphics/**/*.js',
                'test/**/*.js'],
            options: {
                js: {
                    jslintHappy: true,
                    keepArrayIndentation: true,
                    keepFunctionIndentation: true
                }
            }
        }
    });

    grunt.registerTask('test', 'run automated tests', function () {
        if (process.env.SUGAR_DEVELOPER) {
            grunt.config('karma.unit.browsers', ['sugar-web-test']);
            grunt.config('karma.functional.browsers', ['sugar-web-test']);
        }

        grunt.task.run('karma:unit');

        if (process.env.SUGAR_DEVELOPER) {
            grunt.task.run('karma:functional');
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-jsbeautifier');

    grunt.registerTask('default', ['jsbeautifier', 'jshint', 'test']);

};
