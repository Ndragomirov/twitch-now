var fs = require('fs'),
  cp = require('child_process'),
  exec = cp.exec;

module.exports = function (grunt){

  // Project configuration.
  grunt.initConfig({
    v                  : grunt.file.readJSON('version.json'),
    clean              : {
      dist   : {
        src: ["./dist/*"]
      },
      opera  : {
        src: ["./build/opera/*"]
      },
      chrome : {
        src: ["./build/chrome/*"]
      },
      firefox: {
        src: ["./build/firefox/*"]
      }
    },
    watch              : {
      firefox: {
        files  : ['templates/**', 'common/**', "firefox/**", "chrome/**", "opera/**"],
        tasks  : ['firefox', 'chrome', 'opera'],
        options: {
          nospawn: true
        }
      }
    },
    version            : {
      options  : {
        pkg   : "version.json",
        prefix: '[\'"]version[\'"]?\\s*[:=]\\s*[\'"]'
      },
      manifests: {
        src: ['chrome/manifest.json', 'firefox/package.json', 'opera/manifest.json']
      }
    },
//    concat    : {
//      options: {
//        separator: ';\n\n'
//      },
//        src : chromePopup,
//        dest: "build/chrome/common/lib/concat.js"
//      }
//    },
    copy               : {
      firefox: {
        files: [
          {
            expand: true,
            src   : ["./common/**"],
            dest  : './build/firefox/data'
          },
          {
            expand: true,
            src   : ["./firefox/**"],
            cwd   : "./",
            dest  : './build/'
          }
        ]
      },
      opera  : {
        files: [
          {
            expand: true,
            src   : ["**"],
            cwd   : "./build/chrome",
            dest  : './build/opera'
          },
          {
            expand: true,
            src   : ["./opera/**"],
            cwd   : "./",
            dest  : './build/'
          }
        ]
      },
      chrome : {
        files: [
          {
            expand: true,
            src   : ["./common/**", "./_locales/**"],
            dest  : './build/chrome'
          },
          {
            expand: true,
            src   : ["./chrome/**"],
            cwd   : "./",
            dest  : './build/'
          }
        ]}
    },
    handlebars         : {
      compile: {
        options: {
          namespace  : "Handlebars.templates",
          wrapped    : true,
          processName: function (filename){
            return filename.split("/").pop();
          }
        },

        files: {
          "common/dist/templates.js": "templates/*"
        }
      }
    },
    compress           : {
      opera : {
        options: {
          mode   : "zip",
          archive: 'dist/twitch-now-opera-<%= v.version %>.crx'
        },
        files  : [
          {src: ['**'], cwd: "build/opera/", expand: true }
        ]
      },
      chrome: {
        options: {
          mode   : "zip",
          archive: 'dist/twitch-now-chrome-<%= v.version %>.zip'
        },
        files  : [
          {src: ['**'], cwd: "build/chrome/", expand: true }
        ]
      }
    },
    'mozilla-addon-sdk': {
      '1_16': {
        options: {
          revision: '1.16'
        }
      }
    },
    'mozilla-cfx'      : {
      'run_stable': {
        options: {
          "mozilla-addon-sdk": "1_16",
          extension_dir      : "build/firefox",
          command            : "run"
        }
      }
    },
    'mozilla-cfx-xpi'  : {
      stable: {
        options: {
          'mozilla-addon-sdk': '1_16',
          extension_dir      : 'build/firefox',
          dist_dir           : 'dist/',
          arguments          : '--output-file=twitch-now-firefox-<%= v.version %>.xpi'
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
    fs.writeFileSync("common/dist/locales.json", JSON.stringify(localesObj, null, 2), "utf8");
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

  grunt.loadNpmTasks('grunt-mozilla-addon-sdk');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-version');


  grunt.registerTask('default', 'chrome'.split(' '));
  grunt.registerTask('opera', 'clean:opera handlebars copy:opera'.split(' '));
  grunt.registerTask('firefox', 'clean:firefox i18n handlebars copy:firefox'.split(' '));
  grunt.registerTask('chrome', 'clean:chrome handlebars copy:chrome'.split(' '));
  grunt.registerTask('dist', 'clean:dist bump version chrome opera firefox compress:chrome compress:opera mozilla-addon-sdk mozilla-cfx-xpi'.split(' '));
};