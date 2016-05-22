var gulp = require('gulp'),
    sync = require('run-sequence'),
    tasks = require('require-dir')('./gulp_tasks');

// Webpack
gulp.task('webpack_build', tasks.webpack_build);
gulp.task('webpack_dev_server', tasks.webpack_dev_server);

// Css
gulp.task('css', tasks.css);

// Copy js libs and fonts
gulp.task('copy:static', ['copy:js_libs', 'copy:fonts']);
gulp.task('copy:js_libs', tasks.copy.js_libs);
gulp.task('copy:fonts', tasks.copy.fonts);

// Images
gulp.task('img', function () {
    sync('img:clean', ['img:min']);
});
gulp.task('img:dev', ['img:clean', 'img:copy']);
gulp.task('img:min', tasks.img.min);
gulp.task('img:copy', tasks.img.copy);
gulp.task('img:clean', tasks.img.clean);

gulp.task('sprite', function () {
    sync('sprite:make', 'img:clean', 'img:min');
});
gulp.task('sprite:make', tasks.sprite);

gulp.task('template', tasks.template);

// Dev
gulp.task('dev', ['template', 'img:dev', 'css', 'copy:static', 'watch', 'webpack_dev_server']);
gulp.task('modules', tasks.modules);
gulp.task('watch', tasks.watch);

// Build
gulp.task('build', ['template', 'img', 'css', 'webpack_build', 'copy:static']);

// Use default task.
gulp.task('default', ['dev']);