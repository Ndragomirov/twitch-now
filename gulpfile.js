var gulp = require('gulp');
var del = require('del');
var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');
var concat = require('gulp-concat');
var i18n = require('./gulp-i18n.js');
var zip = require('gulp-zip');
var bump = require('gulp-bump');
var fs = require('fs');

gulp.task('clean:firefox_after', function (){
  del.sync([
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
  gulp
    .src([
      'build/chrome/**'
    ])
    .pipe(gulp.dest('build/opera/'))

  gulp
    .src([
      'opera/**'
    ])
    .pipe(gulp.dest('build/opera/'))
})

gulp.task('copy:firefox', function (){
  gulp
    .src([
      'common/lib/3rd/eventemitter.js',
      'common/lib/oauth.js'
    ])
    .pipe(gulp.dest('build/firefox/lib'))

  gulp
    .src([
      'common/**'
    ])
    .pipe(gulp.dest('build/firefox/data/'))

  gulp
    .src([
      'firefox/**'
    ])
    .pipe(gulp.dest('build/firefox/'))
})

gulp.task('copy:chrome', function (){
  gulp
    .src([
      'common/**'
    ])
    .pipe(gulp.dest('build/chrome/common/'))

  gulp
    .src([
      "_locales/**"
    ])
    .pipe(gulp.dest('build/chrome/_locales/'))

  gulp
    .src([
      'chrome/**'
    ])
    .pipe(gulp.dest('build/chrome/'))

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

gulp.task('clean:dist', function (){
  del.sync([
    'dist/*'
  ]);
});

gulp.task('clean:opera', function (){
  del.sync([
    'build/opera/*'
  ]);
});

gulp.task('clean:chrome', function (){
  del.sync([
    'build/chrome'
  ])
});

gulp.task('clean:firefox', function (){
  del.sync([
    'build/firefox/*'
  ]);
});

gulp.task('compress:chrome', function (){
  var v = JSON.parse(fs.readFileSync("package.json")).version;

  return gulp.src('build/chrome/*')
    .pipe(zip('twitch-now-chrome-' + v + '.zip'))
    .pipe(gulp.dest('dist'));
})

gulp.task('compress:opera', function (){
  var v = JSON.parse(fs.readFileSync("package.json")).version;

  return gulp.src('build/opera/*')
    .pipe(zip('twitch-now-opera-' + v + '.zip'))
    .pipe(gulp.dest('dist'));
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
  gulp.src(['_locales/**/*.json'])
    .pipe(i18n('locales.json'))
    .pipe(gulp.dest('common/dist/'));
});

gulp.task('bump', function (){
  gulp.src('./package.json')
    .pipe(bump())
    .pipe(gulp.dest('./'));
});

gulp.task('chrome', ['clean:chrome', 'handlebars', 'concat:popupcss', 'concat:popupjs', 'copy:chrome']);
gulp.task('firefox', ['clean:firefox', 'concat:popupcss', 'i18n', 'handlebars', 'copy:firefox', 'clean:firefox_after']);
gulp.task('opera', ['chrome', 'clean:opera', 'copy:opera']);

gulp.task('dist', ['bump', 'clean:dist', 'chrome', 'opera', 'firefox', 'compress:chrome', 'compress:opera']);