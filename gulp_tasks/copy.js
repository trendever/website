// modules
var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    connect = require('gulp-connect'),
    notify = require('gulp-notify'),
    uglify = require('gulp-uglify'),
    gutil = require('gulp-util')
    ;

// paths
var paths = require('./paths');

// task
var task = {
    js_libs: function() {
        gulp.src(paths.js_libs.src)
            .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
            .pipe(uglify())
            .pipe(gulp.dest(paths.js_libs.dest))
            .on('error', gutil.log)
            .pipe(connect.reload())
        ;
    },

    fonts: function() {
        gulp.src(paths.fonts.src)
            .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
            .pipe(gulp.dest(paths.fonts.dest))
            .on('error', gutil.log)
            .pipe(connect.reload())
        ;
    },
};

// module
module.exports = task;