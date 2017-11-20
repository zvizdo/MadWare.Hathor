var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require('path');
var extractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  context: path.join(__dirname),
  devtool: debug ? "inline-sourcemap" : null,
  entry: "./src/js/app.js",
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy'],
        }
      },
      {
        test: /\.css$/,
        loader: extractTextPlugin.extract("style-loader", "css-loader")
       },
       {
         test: /\.(png|jpg|woff|woff2|eot|ttf|svg).*$/,
         loader: 'url-loader?limit=8192'
        }
    ]
  },
  output: {
    path: "./dist",
    filename: "app.min.js",
    publicPath: "/dist/"
  },
  plugins: debug ? [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new extractTextPlugin("app.min.css")
  ] : [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new extractTextPlugin("app.min.css"),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false, comments: false  }),
  ],
};
