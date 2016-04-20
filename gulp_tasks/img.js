var gulp = require('gulp'),
    del = require('del'),
    flatten = require('gulp-flatten'),
    connect = require('gulp-connect'),
    imagemin = require('gulp-imagemin')
    ;

// paths
var paths = require('./paths');

// task
var tasks = {
    min: function () {
        gulp.src(paths.img.src)
            .pipe(flatten())
            .pipe(imagemin({
                optimizationLevel: 5,
                progressive: true
            }))
            .pipe(gulp.dest(paths.img.dest))
            .pipe(connect.reload())
        ;
    },
    clean: function () {
        del([
            paths.img.dest + '**',
            paths.img.dest
        ]);
    },
    copy: function () {
        gulp.src(paths.img.src)
            .pipe(flatten())
            .pipe(gulp.dest(paths.img.dest))
            .pipe(connect.reload())
    }
};

// module
module.exports = tasks;