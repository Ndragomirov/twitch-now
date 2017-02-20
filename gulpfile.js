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
var jshint = require('gulp-jshint');
var request = require('request');


gulp.task('lint', function (){
  return gulp
    .src([
      './common/lib/*.js'
    ])
    .pipe(jshint({
      moz          : true,
      asi          : true,
      maxparams    : 5,
      maxdepth     : 4,
      maxstatements: 35,
      maxcomplexity: 10
    }))
    .pipe(jshint.reporter('default'));
});

gulp.task('copy:opera', function (){
  return gulp
    .src([
      'build/chrome/**',
      'opera/**'
    ])
    .pipe(gulp.dest('build/opera/'))
})


gulp.task('copy:firefox', function (){
  return gulp.src([
    'build/chrome/**',
    'firefox/**'
  ])
    .pipe(gulp.dest('build/firefox/'))
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


gulp.task('stripdebug', function (){
  return gulp
    .src([
      "build/**/*.js"
    ])
    .pipe(stripDebug())
    .pipe(gulp.dest("build/"));
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

gulp.task('compress:firefox', function (){
  var v = JSON.parse(fs.readFileSync("package.json")).version;

  return gulp.src('build/firefox/**')
    .pipe(zip('twitch-now-firefox-' + v + '.zip'))
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

gulp.task('contributors', function (cb){
  request({
    method : "GET",
    url    : "https://api.github.com/repos/ndragomirov/twitch-now/contributors",
    headers: {
      "User-Agent": "whatever"
    }
  }, function (err, res, body){
    if ( err || !body ) {
      return cb(err || new Error("No body"));
    }
    fs.writeFile("common/dist/contributors.js", 'var contributorList = ' + body + ';', cb)
  })
})

gulp.task('bump', function (){
  gulp
    .src([
      './package.json',
      './chrome/manifest.json',
      './opera/manifest.json',
      './firefox/manifest.json'
    ])
    .pipe(bump())
    .pipe(gulp.dest(function (d){
      return d.base;
    }));
});

gulp.task('watch', function (){
  gulp.watch(["common/**", "templates/**"], ['chrome']);
})

gulp.task('chrome', function (cb){
  runSequence(
    'clean:chrome',
    'handlebars',
    'contributors',
    'concat:popupcss',
    'concat:popupjs',
    'copy:chrome',
    cb
  );
})

gulp.task('opera', function (cb){
  runSequence(
    'chrome',
    'clean:opera',
    'copy:opera',
    cb
  );
});


gulp.task('firefox', function (cb){
  runSequence(
    'chrome',
    'clean:firefox',
    'copy:firefox',
    cb
  );
});

gulp.task('dist', function (cb){
  runSequence(
    ['bump', 'clean:dist'],
    'chrome',
    'opera',
    'firefox',
    'stripdebug',
    ['compress:chrome', 'compress:opera', 'compress:firefox'],
    cb);
})