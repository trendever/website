/* globals env */
// https://github.com/shelljs/shelljs
require('shelljs/global')
env.NODE_ENV = 'dev'

var webpackConfig = require('./webpack.dev.conf')
var settings = require('../settings')
var config = require('../config')
var webpack = require('webpack')
var bundler = webpack(webpackConfig)

var webpackDevServer = require('webpack-dev-server')

if (config.webserver.public) {
  var localtunnel = require('localtunnel');
  var lt = localtunnel(settings.dev.port, function(err, tunnel) {
    if (err) {
      console.log(err)
    }
    // the assigned public url for your tunnel
    // i.e. https://abcdefgjhij.localtunnel.me
    console.log("  Public url:", tunnel.url)
  });
  lt.on('close', function() {
    console.log('tunel err')
  })
}

var spinner = require('ora')('dev server working...')
spinner.start()

require('dns').lookup(require('os').hostname(), function(err, add) {
  console.log('  Serve on address: ' + add + ":" + settings.dev.port);
})

var server = new webpackDevServer(bundler, {
  hot: true,
  inline: true,
  historyApiFallback: true,
  noInfo: true,
  quiet: false,
  stats: { colors: true },
});
server.listen(settings.dev.port, "0.0.0.0");
