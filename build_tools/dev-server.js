/* globals env */
// https://github.com/shelljs/shelljs
require('shelljs/global')
env.NODE_ENV = 'dev'

var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var webpackConfig = require('./webpack.dev.conf')
var browserSync = require('browser-sync')
var settings = require('../settings')
var webpack = require('webpack')
var bundler = webpack(webpackConfig);

/**
 * Run Browsersync and use middleware for Hot Module Replacement
 */
browserSync({
  port: settings.dev.port,

  server: {
    baseDir: 'src',

    middleware: [
      webpackDevMiddleware(bundler, {
        publicPath: webpackConfig.output.publicPath,
        hot: true,
        inline: true,
        historyApiFallback: true,
        noInfo: true,
        quiet: false,
        stats: { colors: true },

        // for other settings see
        // http://webpack.github.io/docs/webpack-dev-middleware.html
      }),

      // bundler should be the same as above
      webpackHotMiddleware(bundler)
    ]
  },

  // no need to watch '*.js' here, webpack will take care of it for us,
  // including full page reloads if HMR won't work
  files: [
    // 'src/*.css',
    'src/index.html'
  ]
});
