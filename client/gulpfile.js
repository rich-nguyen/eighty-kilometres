'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');

gulp.task('default', function() {
  var b = browserify({
    entries: './src/app.js',
    debug: true
  });

  return b.bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./target/'));
});