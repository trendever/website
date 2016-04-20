// modules
var gulp = require('gulp'),
  plumber = require('gulp-plumber'),
  notify = require('gulp-notify'),
  uglify = require('gulp-uglify'),
  gutil = require('gulp-util'),
  webpack_stream = require('webpack-stream'),
  paths = require('./paths')
  ;

// task
var task = function () {
  gulp.src('../src/index.js')
      .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
      .pipe(webpack_stream( require('./../webpack.config.js') ))
      .pipe(gulp.dest('build/'))
      .on('error', gutil.log)
  ;
};

// module
module.exports = task;