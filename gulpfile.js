var gulp = require('gulp');
var del = require('del');
var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');
var shell = require('gulp-shell');
var merge = require('merge-stream');
var stripDebug = require('gulp-strip-debug');
var concat = require('gulp-concat');
var runSequence = require('run-sequence');
var i18n = require('./gulp-i18n.js');
var zip = require('gulp-zip');
var bump = require('gulp-bump');
var fs = require('fs');

gulp.task('clean:firefox_after', function (){
  return del.sync([
    'build/firefox/data/common/dist/popup.comb.css.map',
    'build/firefox/data/common/lib/3rd/analytics.js',
    'build/firefox/data/common/lib/analytics.js',
    'build/firefox/data/common/lib/oauth2.js',
    'build/firefox/data/common/lib/lytics.js',
    'build/firefox/data/common/lib/onerror.js',
    'build/firefox/data/common/dist/popup.comb.js',
    'build/firefox/data/common/dist/popup.comb.js.map'
  ])
})

gulp.task('copy:opera', function (){
  var c1 = gulp
    .src([
      'build/chrome/**'
    ])
    .pipe(gulp.dest('build/opera/'))

  var c2 = gulp
    .src([
      'opera/**'
    ])
    .pipe(gulp.dest('build/opera/'))

  return merge(c1, c2);
})

gulp.task('copy:firefox', function (){
  var c1 = gulp
    .src([
      'common/lib/3rd/eventemitter.js',
      'common/lib/oauth2.js'
    ])
    .pipe(gulp.dest('build/firefox/lib/'))

  var c4 = gulp
    .src([
      'common/lib/3rd/eventemitter.js'
    ])
    .pipe(gulp.dest('build/firefox/lib/3rd/'))

  var c2 = gulp
    .src([
      'common/**'
    ])
    .pipe(gulp.dest('build/firefox/data/common/'))

  var c3 = gulp
    .src([
      'firefox/**'
    ])
    .pipe(gulp.dest('build/firefox/'))

  return merge(c1, c2, c3, c4);
})

gulp.task('copy:chrome', function (){
  var c1 = gulp
    .src([
      'common/**'
    ])
    .pipe(gulp.dest('build/chrome/common/'))

  var c2 = gulp
    .src([
      "_locales/**"
    ])
    .pipe(gulp.dest('build/chrome/_locales/'))

  var c3 = gulp
    .src([
      'chrome/**'
    ])
    .pipe(gulp.dest('build/chrome/'))

  return merge(c1, c2, c3);
})

gulp.task('concat:popupjs', function (){
  return gulp.src([
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
  ])
    .pipe(concat('popup.comb.js'))
    .pipe(gulp.dest('common/dist/'));
})

gulp.task('concat:popupcss', function (){
  return gulp.src([
    "common/css/reset.css",
    "common/css/bootstrap.min.css",
    "common/css/basic.css",
    "common/css/simple-view.css",
    "common/css/white-view.css",
    "common/css/stream-view.css",
    "common/css/channel-view.css",
    "common/css/game-view.css",
    "common/css/settings-view.css",
    "common/css/menu-view.css",
    "common/css/info-view.css",
    "common/css/fontello.css",
    "common/css/rtl.css",
    "common/css/baron.css"
  ])
    .pipe(concat('popup.comb.css'))
    .pipe(gulp.dest('common/dist/'));
})


gulp.task('stripdebug:firefox', function (){
  gulp
    .src([
      "build/firefox/**/*.js"
    ])
    .pipe(stripDebug())
    .pipe(gulp.dest("build/firefox/"));
})

gulp.task('clean:dist', function (){
  del.sync([
    'dist/*'
  ]);
});

gulp.task('clean:opera', function (){
  return del.sync([
    'build/opera/*'
  ]);
});

gulp.task('clean:chrome', function (){
  return del.sync([
    'build/chrome/*'
  ])
});

gulp.task('clean:firefox', function (){
  return del.sync([
    'build/firefox/*'
  ]);
});

gulp.task('compress:firefox', shell.task([
  "cd ./build/firefox && jpm xpi && mv *.xpi ../../dist/"
]))

gulp.task('compress:chrome', function (){
  var v = JSON.parse(fs.readFileSync("package.json")).version;

  return gulp.src('build/chrome/**')
    .pipe(zip('twitch-now-chrome-' + v + '.zip'))
    .pipe(gulp.dest('dist/'));
})

gulp.task('compress:opera', function (){
  var v = JSON.parse(fs.readFileSync("package.json")).version;

  return gulp.src('build/opera/**')
    .pipe(zip('twitch-now-opera-' + v + '.zip'))
    .pipe(gulp.dest('dist/'));
})

gulp.task('handlebars', function (){
  return gulp.src('templates/*.html')
    .pipe(handlebars())
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    .pipe(declare({
      namespace  : 'Handlebars.templates',
      noRedeclare: true // Avoid duplicate declarations
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('common/dist/'));
});

gulp.task('i18n', function (){
  return gulp.src(['_locales/**/*.json'])
    .pipe(i18n('locales.json'))
    .pipe(gulp.dest('common/dist/'));
});

gulp.task('bump', function (){
  gulp
    .src([
      './package.json',
      './chrome/manifest.json',
      './opera/manifest.json',
      './firefox/package.json'
    ])
    .pipe(bump())
    .pipe(gulp.dest(function (d){
      return d.base;
    }));
});

gulp.task('chrome', function (cb){
  runSequence(
    'clean:chrome',
    ['handlebars', 'concat:popupcss', 'concat:popupjs'],
    'copy:chrome',
    cb
  );
})

gulp.task('firefox', function (cb){
  runSequence(
    'clean:firefox',
    'concat:popupcss',
    'i18n',
    'handlebars',
    'copy:firefox',
    'stripdebug:firefox',
    'clean:firefox_after',
    cb
  )
});

gulp.task('opera', function (cb){
  runSequence(
    'chrome',
    'clean:opera',
    'copy:opera',
    cb
  );
});

gulp.task('dist', function (cb){
  runSequence(
    ['bump', 'clean:dist'],
    'chrome',
    'opera',
    'firefox',
    ['compress:chrome', 'compress:opera', 'compress:firefox'],
    cb);
})