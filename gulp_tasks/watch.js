var gulp = require('gulp'),
  watch = require('gulp-watch');

// paths
var paths = require('./paths');

// task
var task = function () {
  watch(paths.index, function () {
    gulp.start('template');
  });

  watch(paths.js_libs.src, function () {
    gulp.start('copy:js_libs');
  });

  watch(paths.fonts.src, function () {
    gulp.start('copy:fonts');
  });

  watch(paths.src_modules + '**/*.{css,scss}', function () {
    gulp.start('css');
  });

  watch(paths.img.src, function () {
    gulp.start('img');
  });

  watch(paths.sprite.src, function () {
    gulp.start('sprite');
  });

  watch('gulpconfig.json', function () {
    gulp.start('modules');
  })
};

// module
module.exports = task;