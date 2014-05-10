var fs = require('fs'),
  cp = require('child_process'),
  exec = cp.exec;

module.exports = function (grunt){

  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-version');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch     : {
      scripts: {
        files  : ['lib/*'],
        tasks  : ['default'],
        options: {
          nospawn: true
        }
      }
    },
    version   : {
      options  : {
        pkg: "version.json"
      },
      manifests: {
        src: ['manifests/opera.json', 'manifests/chrome.json']
      }
    },
    copy      : {
      chrome: {
        expand : true,
        src    : 'manifests/chrome.json',
        dest   : './',
        flatten: true,
        rename : function (dest, src){
          return dest + "manifest.json";
        }
      },
      opera : {
        expand : true,
        src    : 'manifests/opera.json',
        dest   : './',
        flatten: true,
        rename : function (dest, src){
          return dest + "manifest.json";
        }
      }
    },
    handlebars: {
      compile: {
        options: {
          namespace  : "Handlebars.templates",
          wrapped    : true,
          processName: function (filename){
            return filename.split("/").pop();
          }
        },

        files: {
          "dist/templates.js": "lib/templates/*.html"
        }
      }
    }

  });


  grunt.registerTask('zip', '', function (){
    var done = this.async();
    var zip = exec(' zip -r twitch_now.zip ./_locales/* ./audio/* ./lib/* ./oauth2/* ./icons/* ./css/* ./dist/* ./manifest.json  ./html/* ', function (error, stdout, stderr){
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if ( error !== null ) {
        grunt.log.error('This is an error message.\n' + error);
        return false;
      }
      done();
    });
  });

  grunt.registerTask('bump', function (){
    var done = this.async();
    try {
      var manifest = JSON.parse(fs.readFileSync("./version.json"));
      var version = manifest.version.split(".");
      var l = version.length;
      version[l - 1] = parseInt(version[l - 1], 10) + 1;
      manifest.version = version.join(".");
      fs.writeFileSync("./version.json", JSON.stringify(manifest, null, 2));
    } catch (e) {
      grunt.log.error(e);
      return false;
    }
    done();
  });


  grunt.registerTask('default', 'copy:chrome handlebars'.split(' '));
  grunt.registerTask('opera', 'bump version copy:opera handlebars'.split(' '));
  grunt.registerTask('chrome', 'bump version copy:chrome handlebars'.split(' '));
  grunt.registerTask('prod', 'zip'.split(' '));
};