// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
var config = require('../config')

module.exports = {
  build: {
    env: require('./prod.env'),
    buildingRoot: path.resolve(__dirname, '../building'),
    index: path.resolve(__dirname, '../building/index.html'),
    assetsRoot: path.resolve(__dirname, '../build'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: true
  },
  dev: {
    env: require('./dev.env'),
    port: config.webserver.port,
  }
}
