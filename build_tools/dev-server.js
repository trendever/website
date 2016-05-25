/* globals env */
// https://github.com/shelljs/shelljs
require('shelljs/global')
env.NODE_ENV = 'dev'

var webpackConfig = require('./webpack.dev.conf')
var settings = require('../settings')
var webpack = require('webpack')
var bundler = webpack(webpackConfig)

var webpackDevServer = require('webpack-dev-server')

var spinner = require('ora')({text: 'Server loading...', spinner: 'monkey'})
spinner.start()

require('dns').lookup(require('os').hostname(), function(err, add) {
  spinner.text = 'Server run on: ' + add + ":" + settings.dev.port;
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
