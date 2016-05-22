// https://github.com/shelljs/shelljs
require('shelljs/global')
env.NODE_ENV = 'dev'

var path = require('path')
var settings = require('../settings')
var webpack = require('webpack')
var ora = require('ora')
var webpackConfig = require('./webpack.dev.conf')
var webpackDevServer = require('webpack-dev-server')

var assetsPath = path.join(settings.build.assetsRoot, settings.build.assetsSubDirectory)
rm('-rf', settings.build.assetsRoot)
mkdir('-p', assetsPath)

var spinner = ora('dev server working...')
spinner.start()

webpackConfig.entry.trendever.unshift(`webpack-dev-server/client?http://localhost:${settings.dev.port}/`, "webpack/hot/dev-server");
var compiler = webpack(webpackConfig);
var server = new webpackDevServer(compiler, {
  hot: true,
  inline: true,
  historyApiFallback: true,
  noInfo: true,
  quiet: false,
  stats: { colors: true }
});
server.listen(settings.dev.port);
