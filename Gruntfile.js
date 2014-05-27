var fs = require('fs'),
  cp = require('child_process'),
  exec = cp.exec;

module.exports = function (grunt){

  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-version');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch     : {
      scripts: {
        files  : ['lib/**'],
        tasks  : ['firefox'],
        options: {
          nospawn: true
        }
      }
    },
    version   : {
      options  : {
        pkg   : "version.json",
        prefix: '[\'"]version[\'"]?\\s*[:=]\\s*[\'"]'
      },
      manifests: {
        src: ['manifests/opera.json', 'manifests/chrome.json']
      }
    },
    concat    : {
      options: {
        separator: ';\n\n'
      },
      firefox: {
        src : grunt.file.readJSON("manifests/firefox.json").background.scripts,
        dest: './firefox/twitch-now/lib/main.js'
      }
    },
    copy      : {
      firefox: {
        files: [
          {
            expand : true,
            src    : 'lib/3rd/*.js',
            dest   : './firefox/twitch-now/lib/3rd',
            flatten: true
          },
          {
            expand : true,
            src    : ['lib/main.js', 'lib/i18n-ff.js', 'lib/oauth2.js' ],
            dest   : './firefox/twitch-now/lib',
            flatten: true
          },
          {
            expand: true,
            src   : ["./_locales/**", "./dist/**", "./html/**", "./icons/**", "./css/**", "./lib/**"],
            dest  : './firefox/twitch-now/data'
          }
        ]
      },
      chrome : {
        expand : true,
        src    : 'manifests/chrome.json',
        dest   : './',
        flatten: true,
        rename : function (dest, src){
          return dest + "manifest.json";
        }
      },
      opera  : {
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

  grunt.registerTask('i18n', function (){
    var localesObj = {};
    var locales = fs.readdirSync("_locales");
    for ( var i = 0; i < locales.length; i++ ) {
      var file = fs.readFileSync(__dirname + "/_locales/" + locales[i] + "/messages.json");
      localesObj[locales[i]] = JSON.parse(file);
    }
    fs.writeFileSync("dist/locales.json", JSON.stringify(localesObj, null, 2), "utf8");
  });

  grunt.registerTask('zip', function (){
    var done = this.async();
    var zip = exec(' zip -r twitch_now.zip ./chrome-platform-analytics/google-analytics-bundle.js ./_locales/* ./audio/* ./lib/* ./oauth2/* ./icons/* ./css/* ./dist/* ./manifest.json  ./html/* ', function (error, stdout, stderr){
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
  grunt.registerTask('firefox', 'i18n handlebars copy:firefox'.split(' '));
  grunt.registerTask('chrome', 'bump version copy:chrome handlebars'.split(' '));
  grunt.registerTask('prod', 'zip'.split(' '));
};