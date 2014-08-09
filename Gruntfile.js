var semver = require('semver');

module.exports = function (grunt){

  // Project configuration.
  grunt.initConfig({
    pkg                : grunt.file.readJSON('package.json'),
    clean              : {
      dist   : {
        src: ['dist/*']
      },
      opera  : {
        src: ['build/opera/*']
      },
      chrome : {
        src: ['build/chrome/*']
      },
      firefox: {
        src: ['build/firefox/*']
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
      options: {
        sourceMap: true,
        separator: '\r\n'
      },
      popup  : {
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
      }
    },
    'mozilla-cfx'      : {
      'run_stable': {
        options: {
          'mozilla-addon-sdk': '1_16',
          extension_dir      : 'build/firefox',
          command            : 'run'
        }
      }
    },
    'mozilla-cfx-xpi'  : {
      stable: {
        options: {
          'mozilla-addon-sdk': '1_16',
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
  grunt.loadNpmTasks('grunt-version');
  grunt.loadNpmTasks('grunt-git');

  grunt.registerTask('default', ['chrome']);
  grunt.registerTask('opera', ['clean:opera', 'concat:popup', 'handlebars', 'copy:opera']);
  grunt.registerTask('firefox', ['clean:firefox', 'concat:popup', 'i18n', 'handlebars', 'copy:firefox']);
  grunt.registerTask('chrome', ['clean:chrome', 'concat:popup', 'handlebars', 'copy:chrome']);
  grunt.registerTask('dist', ['clean:dist', 'bump', 'version', 'chrome', 'opera', 'firefox', 'compress:chrome', 'compress:opera', 'mozilla-addon-sdk', 'mozilla-cfx-xpi', 'gittag:bump']);
};