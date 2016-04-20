var config = require('../config.js'),
    shell = require('gulp-shell');

var command = 'webpack-dev-server --content-base build/' +
  ' --history-api-fallback' +
  ' --inline' +
  ' --hot' +
  ' --no-info' +
  ' --colors';

command += ' --port ' + config.webserver.port;

if (config.webserver.open) {
  command += " --open";
}

// task
var task = shell.task([command]);

// module
module.exports = task;