var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var babel = require('gulp-babel');
// set variable via $ gulp --type production
var environment = $.util.env.type || 'development';
var isProduction = environment === 'production';
var webpackConfig = require('./webpack.config.js').getConfig(environment);

var port = $.util.env.port || 1337;
var app = 'app/';
var dist = 'dist/';
var scriptsLib = app + 'lib/';

// https://github.com/ai/autoprefixer
var autoprefixerBrowsers = [
  'ie >= 9',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 6',
  'opera >= 23',
  'ios >= 6',
  'android >= 4.4',
  'bb >= 10'
];

gulp.task('scripts', function() {
  return gulp.src(webpackConfig.entry)
      .pipe(babel())
      .pipe($.webpack(webpackConfig))
      .pipe(isProduction ? $.uglifyjs() : $.util.noop())
      .pipe(gulp.dest(dist + 'js/'))
      .pipe($.size({ title : 'js' }))
      .pipe($.connect.reload());
});

// copy html from app to dist
gulp.task('html', function() {
  if (isProduction) {
    gulp.src(app + 'index.erb')
        .pipe(gulp.dest(dist))
        .pipe($.size({title: 'ERB'}));
    gulp.src(app + 'index.ejs')
        .pipe(gulp.dest(dist))
        .pipe($.size({title: 'EJS'}));
  }
  else {
    return gulp.src(app + 'index.html')
      .pipe(gulp.dest(dist))
      .pipe($.size({ title : 'html' }))
      .pipe($.connect.reload());
  }
});

// copy libs to dist
gulp.task('lib', function() {

  gulp.src(app + '/fonts/*')
      .pipe(gulp.dest(dist + '/fonts'))
      .pipe($.size({ title : 'Ionicons' }));


  return gulp.src(scriptsLib + '/*')
      .pipe(gulp.dest(dist + '/lib'))
      .pipe($.size({ title : 'Lib' }))
      .pipe($.connect.reload());
});

gulp.task('less', function() {
  return gulp.src(app + 'less/main_ext.less')
      .pipe($.less())
      .pipe($.autoprefixer({browsers: autoprefixerBrowsers}))
      .pipe(isProduction ? $.minifyCss() : $.util.noop())
      .pipe(gulp.dest(dist + 'css/'))
      .pipe($.size({ title : 'css' }));
});

gulp.task('styles',function(cb) {
  // convert stylus to css
  return gulp.src(app + 'stylus/main.styl')
      .pipe($.stylus({
        // only compress if we are in production
        compress: isProduction,
        // include 'normal' css into main.css
        'include css' : true
      }))
      .pipe($.autoprefixer({browsers: autoprefixerBrowsers}))
      .pipe(gulp.dest(dist + 'css/'))
      .pipe($.size({ title : 'css' }))
      .pipe($.connect.reload());

});

// add livereload on the given port
gulp.task('serve', function() {
  $.connect.server({
    root: dist,
    port: port,
    livereload: {
      port: 35729
    }
  });
});

gulp.task('fontIcons', function() {
  return gulp.src(app + '/less/font-icons/**')
      .pipe(gulp.dest(dist + 'css/font-icons'));
});

// copy images
gulp.task('images', function(cb) {
  return gulp.src(app + 'images/**/*.{png,jpg,jpeg,gif}')
      .pipe($.size({ title : 'images' }))
      .pipe(gulp.dest(dist + 'images/'));
});

// watch styl, html and js file changes
gulp.task('watch', function() {
  gulp.watch(app + 'stylus/*.styl', ['styles']);
  gulp.watch(app + 'less/*.less', ['less']);
  gulp.watch(app + 'index.html', ['html']);
  gulp.watch(app + 'scripts/**/*.js', ['scripts']);
  gulp.watch(app + 'scripts/**/*.jsx', ['scripts']);
});

// remove bundles
gulp.task('clean', function(cb) {
  del([dist], cb);
});

// by default build project and then watch files in order to trigger livereload
gulp.task('default', ['build', 'serve', 'watch']);

// waits until clean is finished then builds the project
gulp.task('build', ['clean'], function(){
  gulp.start(['images', 'html', 'lib', 'scripts','styles','fontIcons','less']);
});
