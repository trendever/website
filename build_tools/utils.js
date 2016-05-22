var path = require('path');

exports.assetsPath = function (_path) {
  return path.posix.join('static', _path);
};

exports.getArg = function (key) {
  var index = process.argv.indexOf(key);
  var next = process.argv[index + 1];
  return (index < 0) ? false : (!next) ? true : next;
};