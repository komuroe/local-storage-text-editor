const webpack = require('webpack');
const path = require('path');
const nodeEnv = process.env.NODE_ENV || 'production';
const HtmlWebPackPlugin = require("html-webpack-plugin");

const htmlPlugin = new HtmlWebPackPlugin({
  template: "./src/index.html",
  filename: "./index.html",
  favicon: './src/assets/favicon.ico',
});
module.exports = {
  devtool: 'source-map',
  entry: {
    filename: './src/index.js',
  },
  output: {
    path: path.resolve('docs'),
    filename: 'bundled.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015-native-modules'],
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    // uglify js
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      output: { comments: false },
      sourceMap: true,
    }),
    // env plugin
    new webpack.DefinePlugin({
      'proccess.env': { NODE_ENV: JSON.stringify(nodeEnv) },
    }),
    htmlPlugin
  ],
};
