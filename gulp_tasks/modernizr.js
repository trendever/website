var modernizr = require('modernizr'),
    fs = require('fs'),
    mkdirp = require('mkdirp'),
    paths = require('./paths');

var task = function () {
    modernizr.build(require('../gulpconfig').modernizr, function (result) {
        if (!fs.existsSync(paths.js_libs.dest)) {
            mkdirp.sync(paths.js_libs.dest);
            fs.writeFile(paths.js_libs.dest + 'modernizr.js', result);
        }
    });
};

module.exports = task;