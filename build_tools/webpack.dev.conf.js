var settings = require('../settings')
var utils = require('./utils')
var webpack = require('webpack')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var ExtractTextPlugin = require("extract-text-webpack-plugin")
var HtmlWebpackPlugin = require('html-webpack-plugin')
var env = settings.build.env;

module.exports = merge(baseWebpackConfig, {
  devtool: '#eval-source-map',
  watch: true,

  module: {
    loaders: [{
        test: /\.font\.(js|json)$/,
        loader: 'style-loader!css-loader!fontgen-loader',
      }],
  },

  plugins: [
    new ExtractTextPlugin(utils.assetsPath('static/css/[name].[contenthash].css')),
    // http://vuejs.github.io/vue-loader/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),

    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),

    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.jade',
      inject: true,
    }),

  ]

});
