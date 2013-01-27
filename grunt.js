var fs = require('fs'),
    cp = require('child_process'),
    exec = cp.exec;

module.exports = function ( grunt ) {
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.initConfig({
        handlebars: {
            compile: {
                options: {
                    namespace  : "Handlebars.templates",
                    wrapped    : true,
                    processName: function ( filename ) {
                        return filename.split("/").pop();
                    }
                },
                files  : {
                    "dist/precompiled/hb_templates.js": [
                        "lib/templates/*"
                    ]
                }
            }
        }
    });

    grunt.registerTask('zip', '', function () {
        var done = this.async();
        var zip = exec(' zip -r twitch_now.zip ./audio/* ./lib/* ./oauth2/* ./icons/* ./css/* ./dist/* ./manifest.json  ./html/* ', function ( error, stdout, stderr ) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if ( error !== null ) {
                grunt.log.error('This is an error message.\n' + error);
                return false;
            }
            done();
        });
    });

    grunt.registerTask('version', function () {
        var done = this.async();
        try {
            var manifest = JSON.parse(fs.readFileSync("./manifest.json"));
            var version = manifest.version.split(".");
            var l = version.length;
            version[l - 1] = parseInt(version[l - 1], 10) + 1;
            manifest.version = version.join(".");
            fs.writeFileSync("./manifest.json", JSON.stringify(manifest));
        } catch ( e ) {
            grunt.log.error(e);
            return false;
        }
        done();
    });

    grunt.registerTask('default', 'version handlebars');
    grunt.registerTask('prod', 'default zip');
};