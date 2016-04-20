// modules
var gulp = require('gulp'),
    beep = require('./beep'),
    plumber = require('gulp-plumber'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    postcss = require('gulp-postcss'),
    syntax = require('postcss-scss'),
    plugins = [
        require('postcss-mixins')(),
        require('postcss-nested')(),
        require('postcss-custom-media')(),
        require('postcss-simple-vars')(),
        require('postcss-custom-selectors')(),
        require('postcss-short-size'),
        require('postcss-short-position'),
        require('postcss-selector-not')(),
        require('postcss-color-function')(),
        require('autoprefixer')(),

        // optimisations
        require('postcss-discard-comments')(),
        require('postcss-discard-empty')(),
        require('postcss-calc')(),
        require('postcss-normalize-url')(),
        require('postcss-minify-selectors')(),
        require('postcss-merge-longhand')(),
        // require('postcss-font-family')(),
        require('postcss-convert-values')({
            length: false,
            angle: false
        }),
        require('postcss-colormin')(),
        require('postcss-merge-rules')(),
        // require('postcss-discard-unused')(),
        require('postcss-zindex')(),
        require('postcss-reduce-idents')(),
        require('css-mqpacker')()
        //require('csswring')() // minify css
    ]
    ;

// paths
var paths = require('./paths');

// task
var task = function () {
    gulp.src(paths.css.src)
        .pipe(plumber(beep))
        .pipe(concat(paths.css.name))
        .pipe(postcss(plugins, {
            syntax: syntax
        }))
        .pipe(plumber.stop())
        .pipe(gulp.dest(paths.css.dest))
        .pipe(connect.reload())
    ;
};

// module
module.exports = task;