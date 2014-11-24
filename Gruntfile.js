var semver = require('semver');

module.exports = function (grunt){

  // Project configuration.
  grunt.initConfig({
    pkg                : grunt.file.readJSON('package.json'),
    clean              : {
      dist         : {
        src: ['dist/*']
      },
      opera        : {
        src: ['build/opera/*']
      },
      chrome       : {
        src: ['build/chrome/*']
      },
      firefox      : {
        src: ['build/firefox/*']
      },
      firefox_after: {
        src: ['build/firefox/data/common/dist/popup.comb.js', 'build/firefox/data/common/dist/popup.comb.js.map']
      }
    },
    watch              : {
      dist: {
        files  : ['templates/**', 'common/**', 'firefox/**', 'chrome/**', 'opera/**'],
        tasks  : ['firefox', 'chrome', 'opera'],
        options: {
          nospawn: true
        }
      }
    },
    version            : {
      manifests: {
        src: ['chrome/manifest.json', 'firefox/package.json', 'opera/manifest.json']
      }
    },
    concat             : {
      options : {
        sourceMap: true,
        separator: '\r\n'
      },
      popupjs : {
        src : [
          "common/lib/onerror.js",
          "common/lib/utils.js",
          "common/lib/3rd/jquery.js",
          "common/lib/3rd/jquery.visible.js",
          "common/lib/3rd/baron.js",
          "common/lib/3rd/bootstrap.js",
          "common/lib/3rd/underscore.js",
          "common/lib/3rd/backbone.js",
          "common/lib/3rd/handlebars.js",
          "common/lib/3rd/prettydate.js",
          "common/lib/3rd/i18n.js",
          "common/dist/templates.js",
          "common/lib/handlebars-helpers.js",
          "common/lib/popup.js",
          "common/lib/routes.js",
          "common/lib/init.js"
        ],
        dest: "common/dist/popup.comb.js"
      },
      popupcss: {
        src : [
          "common/css/reset.css",
          "common/css/bootstrap.min.css",
          "common/css/basic.css",
          "common/css/simple-view.css",
          "common/css/white-view.css",
          "common/css/stream-view.css",
          "common/css/game-view.css",
          "common/css/settings-view.css",
          "common/css/menu-view.css",
          "common/css/info-view.css",
          "common/css/fontello.css",
          "common/css/rtl.css",
          "common/css/baron.css"
        ],
        dest: 'common/dist/popup.comb.css'
      }
    },
    copy               : {
      firefox: {
        files: [
          {
            expand: true,
            src   : ['oauth2.js'],
            cwd   : 'common/lib',
            dest  : 'build/firefox/lib'
          },
          {
            expand: true,
            src   : ['common/**'],
            dest  : 'build/firefox/data'
          },
          {
            expand: true,
            src   : ['firefox/**'],
            dest  : 'build/'
          }
        ]
      },
      opera  : {
        files: [
          {
            expand: true,
            src   : ['**'],
            cwd   : 'build/chrome',
            dest  : 'build/opera'
          },
          {
            expand: true,
            src   : ['opera/**'],
            dest  : 'build/'
          }
        ]
      },
      chrome : {
        files: [
          {
            expand: true,
            src   : ['common/**', '_locales/**'],
            dest  : 'build/chrome'
          },
          {
            expand: true,
            src   : ['chrome/**'],
            dest  : 'build/'
          }
        ]
      }
    },
    replace            : {
      firefox: {
        options: {
          patterns: [
            {
              match      : 'foo',
              replacement: 'bar'
            }
          ]
        }
      }
    },
    handlebars         : {
      compile: {
        options: {
          namespace  : 'Handlebars.templates',
          wrapped    : true,
          processName: function (filename){
            return filename.split('/').pop();
          }
        },

        files: {
          'common/dist/templates.js': 'templates/*'
        }
      }
    },
    compress           : {
      opera : {
        options: {
          mode   : 'zip',
          archive: 'dist/twitch-now-opera-<%= pkg.version %>.crx'
        },
        files  : [
          {
            src   : ['**'],
            cwd   : 'build/opera/',
            expand: true
          }
        ]
      },
      chrome: {
        options: {
          mode   : 'zip',
          archive: 'dist/twitch-now-chrome-<%= pkg.version %>.zip'
        },
        files  : [
          {
            src   : ['**'],
            cwd   : 'build/chrome/',
            expand: true
          }
        ]
      }
    },
    'mozilla-addon-sdk': {
      '1_16': {
        options: {
          revision: '1.16'
        }
      },
      '1_17': {
        options: {
          revision: '1.17'
        }
      }
    },
    'mozilla-cfx'      : {
      'run_stable': {
        options: {
          'mozilla-addon-sdk': '1_17',
          extension_dir      : 'build/firefox',
          command            : 'run'
        }
      }
    },
    'mozilla-cfx-xpi'  : {
      stable: {
        options: {
          'mozilla-addon-sdk': '1_17',
          extension_dir      : 'build/firefox',
          dist_dir           : 'dist/',
          arguments          : '--output-file=twitch-now-firefox-<%= pkg.version %>.xpi'
        }
      }
    },
    gittag             : {
      bump: {
        options: {
          tag: '<%= pkg.version %>'
        }
      }
    }
  });

  grunt.registerTask('i18n', function (){
    var locales = {};
    grunt.file.recurse('_locales', function (abspath, rootdir, subdir, filename){
      if ( filename == 'messages.json' ) {
        locales[subdir] = grunt.file.readJSON(abspath);
      }
    });
    grunt.file.write('common/dist/locales.json', JSON.stringify(locales, null, 2));
  });

  grunt.registerTask('bump', function (){
    var pkg = grunt.file.readJSON('package.json');
    pkg.version = semver.inc(pkg.version, 'patch');
    grunt.config.set('pkg', pkg);
    grunt.file.write('package.json', JSON.stringify(pkg, null, 2));
  });

  grunt.loadNpmTasks('grunt-mozilla-addon-sdk');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-version');
  grunt.loadNpmTasks('grunt-git');

  grunt.registerTask('default', ['chrome']);
  grunt.registerTask('opera', ['clean:opera', 'concat:popupcss', 'concat:popupjs', 'handlebars', 'copy:opera']);
  grunt.registerTask('firefox', ['clean:firefox', 'concat:popupcss', 'i18n', 'handlebars', 'copy:firefox', 'clean:firefox_after']);
  grunt.registerTask('chrome', ['clean:chrome', 'concat:popupcss', 'concat:popupjs', 'handlebars', 'copy:chrome']);
  grunt.registerTask('dist', ['clean:dist', 'bump', 'version', 'chrome', 'opera', 'firefox', 'compress:chrome', 'compress:opera', 'mozilla-addon-sdk', 'mozilla-cfx-xpi', 'gittag:bump']);
};