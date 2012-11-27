/*global module:false*/
module.exports = function (grunt) {

    'use strict';

    var SRC_CSS = 'content/static/css/';
    var SRC_JS = 'content/static/js/';
    var DIST = 'content/static/dist/';

    var MINIFIED_CSS = DIST + 'screen.min.css';
    var MINIFIED_JS = DIST + 'all-js.min.js';

    var ASSET_MAP = DIST + 'assets.json';

    // Project configuration.
    grunt.initConfig({
        lint: {
            files: ['grunt.js', SRC_JS + '*.js', 'test/*.js']
        },
        qunit: {
            files: 'test/tests.html'
        },
        concat: {
            dist: {
                src: SRC_JS + '**/*.js',
                dest: DIST + 'all-js.js'
            }
        },
        min: {
            dist: {
                src: '<config:concat.dist.dest>',
                dest: MINIFIED_JS
            }
        },
        cssmin: {
            dist: {
                src: SRC_CSS + 'screen.css',
                dest: MINIFIED_CSS
            }
        },
        hash: {
            src: [MINIFIED_JS, MINIFIED_CSS],
            dest: DIST,
            mapping: ASSET_MAP
        },
        watch: {
            test: {
                files: ['test/**/*'],
                tasks: 'qunit'
            },
            js: {
                files: ['content/**/*.js'],
                tasks: 'lint quick-build qunit'
            },
            build: {
                files: ['templates/**/*.html'],
                tasks: 'build'
            },
            quick: {
                files: ['content/**/!(*.js)', 'sass/**/*.scss'],
                tasks: 'quick-build'
            }
        },
        server: {
            base: 'output/'
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                browser: true
            },
            globals: {}
        },
        uglify: {},
        compass: {
            dev: {
                bundleExec: true,
                config: 'config.rb'
            }
        },
        exec: {
            clean: {
                command: 'find content -name *~ -delete && rm -rf output/*',
                stdout: true
            },
            build: {
                command: 'python run.py build content/'
            }
        }
    });

    // Default task.
    grunt.registerTask('default', 'lint compass concat min cssmin qunit hash exec');

    // Full clean & build, but don't lint JS or run JS tests.
    grunt.registerTask('build', 'compass concat min cssmin hash exec');

    // Quick build (@@@ need to make this just build, not clean)
    grunt.registerTask('quick-build', 'compass concat min cssmin hash exec');

    // Run server.
    grunt.registerTask('serve', 'build server watch');

    // Plugin tasks.
    grunt.loadNpmTasks('grunt-css');
    grunt.loadNpmTasks('grunt-compass');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-hash');
};
