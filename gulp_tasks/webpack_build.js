// module
module.exports = task;

var shell = require('gulp-shell');

var command = 'webpack --config webpack.config.js' +
  ' --colors'  +
  ' --progress' +
  ' build';

// task
var task = shell.task([command]);

// module
module.exports = task;