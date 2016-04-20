var cfg = require('../config.js');

var gulp = require('gulp'),
	connect = require('gulp-connect'),
	template = require('gulp-template');

// task
var task = function () {
	return gulp.src('./src/index.html')
		.pipe(template({config: cfg}))
		.pipe(gulp.dest('./build'))
		.pipe(connect.reload())
};

// module
module.exports = task;