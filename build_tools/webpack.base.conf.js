var path = require("path")
var utils = require('./utils')
var settings = require('../settings')
var ExtractTextPlugin = require("extract-text-webpack-plugin")
var config  = require('../config');

module.exports = {
  entry: {
    trendever: ['./src/main.js']
  },

  output: {
    path: settings.build.assetsRoot,
    publicPath: settings.build.assetsPublicPath,
    filename: "static/js/[name].[hash].js",
  },

  resolve: {
    root: path.resolve('./src'),
    fallback: [path.join(__dirname, '../node_modules')],
    extensions: ['', '.js', '.vue', '.pcss'],
  },

  resolveLoader: {
    fallback: [path.join(__dirname, '../node_modules')]
  },

  module: {
    // preLoaders: [
      // {
      //   test: /\.vue$/,
      //   loader: 'eslint',
      //   include: projectRoot,
      //   exclude: /node_modules/
      // },
      // {
      //   test: /\.js$/,
      //   loader: 'eslint',
      //   include: projectRoot,
      //   exclude: /node_modules/
      // }
    // ],
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.jade$/,
        loader: 'jade'
      },
      {
        test:   /\.pcss$/,
        loaders: "style-loader!css-loader!postcss-loader?sourceMap"
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 1,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
    ]
  },

  vue: {
    // use custom postcss plugins
    postcss: function (webpack) {
      return [
        require( `postcss-use` )(
          {
            modules: [
              'postcss-autoreset',
              'postcss-initial'
            ]
          }
        ),
        require("postcss-import")({
          path: path.resolve('./src'),
          addDependencyTo: webpack
        }),

        require("postcss-url")(),
        require('postcss-discard-comments')(),
        require('postcss-simple-vars')(),
        require('postcss-short')(),
        require('precss')(),
        require('postcss-flexbugs-fixes')(),

        // optimizations
        require('postcss-comment/hookRequire')(),
        require('postcss-calc')(),
        require('postcss-normalize-url')(),
        require('postcss-merge-longhand')(),
        require('postcss-convert-values')({
            length: false,
            angle: false
        }),
        require('css-mqpacker')(),
        require("postcss-browser-reporter")({
          selector: `body:before`,
          clearMessages: true
        }),
      ];
    },

    loaders: process.env.NODE_ENV === "production" ? {css: ExtractTextPlugin.extract("css?sourceMap")}: {},

    autoprefixer: true
  },

};
