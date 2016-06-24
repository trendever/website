/* globals env, rm, mkdir, mv */
// https://github.com/shelljs/shelljs
require('shelljs/global')
var Rsync = require('rsync')
env.NODE_ENV = 'production'

var path = require('path')
var settings = require('../settings')
var ora = require('ora')
var webpack = require('webpack')
var webpackConfig = require('./webpack.prod.conf')

console.log(
  '  Tip:\n' +
  '  Built files are meant to be served over an HTTP server.\n' +
  '  Opening index.html over file:// won\'t work.\n' +
  '  But you can test build with: cd build && python -m SimpleHTTPServer 3001 \n'
)
var spinner = ora('building for production...')
spinner.start()

var assetsPath = path.join(settings.build.buildingRoot, settings.build.assetsSubDirectory)
rm('-rf', settings.build.buildingRoot)
mkdir('-p', assetsPath)

webpack(webpackConfig, function (err, stats) {
  spinner.stop()
  if (err) {throw err}
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false,
  }) + '\n')

  console.log("Move building to", settings.build.assetsRoot);
  rm('-rf', settings.build.assetsRoot)
  mv(settings.build.buildingRoot, settings.build.assetsRoot)

})
