var gulp = require('gulp');
var gutil = require('gulp-util'); //for logging
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var browserSync = require('browser-sync').create();
var scss = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');


function bundler(bundler) {
  return bundler
    .transform("babelify", {presets: ["es2015"]})
    .bundle()
    .on('error', function(e){
      gutil.log(e);
    })
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./app/dist/js'))
    .pipe(browserSync.stream());
}

gulp.task('watchify', function(){
  var watcher = watchify(browserify('./app/js/app.js', watchify.args));

  bundler(watcher);

  watcher.on('update', function() {
    bundler(watcher);
  });

  watcher.on('log', gutil.log);

});

gulp.task('browsersync', function(){
  browserSync.init({
      server: "./app",
      logFileChanges: false
  });
})

gulp.task('js', function(){
  return bundler(browserify('./app/js/app.js'));
});

gulp.task('scss', function(){
  return gulp
    .src('./app/scss/main.scss')
    .pipe(sourcemaps.init())
    .pipe(scss.sync().on('error', scss.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./app/dist/css'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('watch-scss', function () {
  return gulp.watch('./app/scss/main.scss', ['scss']);
});

gulp.task('default', ['scss', 'watch-scss', 'watchify', 'browsersync']);
