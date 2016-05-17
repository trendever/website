var webpack = require('webpack'),
  ExtractTextPlugin = require("extract-text-webpack-plugin"),
  config = require('./config.js'),
  path = require("path");

function getArg(key) {
  var index = process.argv.indexOf(key);
  var next = process.argv[index + 1];
  return (index < 0) ? false : (!next) ? true : next;
}

var plugins = [];
var css_loaders = {};

if (!config.debug) {
  plugins = plugins.concat([
    // short-circuits all Vue.js warning code
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
     //minify with dead-code elimination
     new webpack.optimize.UglifyJsPlugin({
       compress: {
         warnings: false
       }
     }),
    // optimize module ids by occurence count
    new webpack.optimize.OccurenceOrderPlugin(),
  ]);
}

// Exctract all css from components
if (getArg('build')) {
  plugins = plugins.concat([
    new ExtractTextPlugin("static/css/style_vue.css")
  ]);
  css_loaders.css = ExtractTextPlugin.extract("css?sourceMap");
}

module.exports = {
  devtool: getArg('build') ? '#source-map' : false,

  entry: {
    app_1: ['./src/index.js']
  },

  output: {
    path: require("path").resolve("./build/"),
    publicPath: "/",
    library: '[name]',
    filename: "static/js/[name].js",
    sourceMapFilename: "[file].map",
  },

  watch: !getArg('build'),
  module: {
    preLoaders: [
      {
        test: /\.vue$/,
        loader: 'eslint',
        include: "./src",
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loader: 'eslint',
        include: "./src",
        exclude: /node_modules/
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        // excluding some local linked packages.
        // for normal use cases only node_modules is needed.
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test:   /\.pcss$/,
        loader: "style-loader!css-loader!postcss-loader"
      },
      {
        test: /\.font\.(js|json)$/,
        loader: getArg('build') ? ExtractTextPlugin.extract(["css", "fontgen"]) : "style-loader!css-loader!fontgen-loader",
      },
      {
        test: /\.(woff|eot|ttf|svg)$/,
        loader: "url",
      }
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

        require("postcss-cssnext")(),

        // optimisations
        require('postcss-comment/hookRequire')(),
        require('postcss-discard-empty')(),
        require('postcss-calc')(),
        require('postcss-normalize-url')(),
        require('postcss-minify-selectors')(),
        require('postcss-merge-longhand')(),
        // require('postcss-font-family')(),
        require('postcss-convert-values')({
            length: false,
            angle: false
        }),
        require('postcss-colormin')(),
        require('postcss-merge-rules')(),
        // require('postcss-discard-unused')(),
        // require('postcss-zindex')(), // enable after full refactor css_modules to base/project
        require('postcss-reduce-idents')(),
        require('css-mqpacker')(),
        //require('csswring')() // minify css

        require("postcss-reporter")(),
      ];
    },
    loaders: css_loaders,
    // disable vue-loader autoprefixing.
    // this is a good idea since cssnext comes with it too.
    autoprefixer: false
  },

  eslint: {
    formatter: require('eslint-friendly-formatter')
  },

  babel: {
    presets: ['es2015'],
    plugins: ['transform-runtime']
  },

  resolve: {
    root: path.resolve('./src'),
    extensions: ['', '.js', '.vue', '.pcss'],
    modulesDirectories: ['node_modules'],
  },

  plugins: plugins
};