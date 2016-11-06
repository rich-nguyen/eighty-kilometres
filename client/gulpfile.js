'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var tsify = require('tsify');
var source = require('vinyl-source-stream');

gulp.task('default', function() {
  var build = browserify({
    entries: './src/app.ts',
    debug: true
  });

  return build
    .plugin(tsify, { noImplicitAny: true, allowJs: true })
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./target/'));
});