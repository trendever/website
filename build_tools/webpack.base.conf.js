var path = require("path")
var utils = require('./utils')
var settings = require('../settings')
var ExtractTextPlugin = require("extract-text-webpack-plugin")

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
        loaders: "style-loader!css-loader!postcss-loader"
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
          limit: 10000,
          name: utils.assetsPath('static/img/[name].[hash:7].[ext]')
        }
      },
    ]
  },

  vue: {
    // use custom postcss plugins
    postcss: function (webpack) {
      return [
        require("postcss-import")({
          path: path.resolve('./src'),
          addDependencyTo: webpack
        }),

        require("postcss-url")(),
        require('postcss-discard-comments')(),

        require("postcss-nested")(),
        require('postcss-custom-media')(),
        require('postcss-simple-vars')(),
        require('postcss-custom-selectors')(),
        require('postcss-short-font-size')(),
        require('postcss-short-size'),
        require('postcss-short-position'),

        // optimizations
        require('postcss-comment/hookRequire')(),
        // require('postcss-discard-empty')(),
        require('postcss-calc')(),
        require('postcss-normalize-url')(),
        // require('postcss-minify-selectors')(),
        require('postcss-merge-longhand')(),
        // require('postcss-font-family')(),
        require('postcss-convert-values')({
            length: false,
            angle: false
        }),
        require('postcss-colormin')(),
        // require('postcss-merge-rules')(),
        // require('postcss-discard-unused')(),
        // require('postcss-discard-duplicates')(),
        require('postcss-zindex')(),
        require('postcss-reduce-idents')(),
        require('css-mqpacker')(),
        // require("cssnano")(),
        // require('csswring')(), // minify css

        require("postcss-reporter")(),
      ];
    },

    loaders: {
      css: ExtractTextPlugin.extract("css?sourceMap"),
    },

    // disable vue-loader autoprefixing.
    // this is a good idea since cssnext comes with it too.
    autoprefixer: false
  },

};