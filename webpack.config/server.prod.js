const fs = require('fs');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const config = {
  mode: 'production',
  entry: (() => {
    const entry = {};

    fs.readdirSync('app/assets/javascripts/server').forEach(fileName => {
      entry[fileName] = `./app/assets/javascripts/server/${fileName}`;
    });

    return entry;
  })(),
  output: {
    library: '[name]',
    libraryTarget: 'commonjs2',
    filename: '[name]',
    path: path.join(__dirname, '../private')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      { test: /\.css$/, loader: 'ignore-loader' }
    ]
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            warnings: false,
            conditionals: true,
            unused: true,
            comparisons: true,
            dead_code: true,
            evaluate: true,
            if_return: true,
            join_vars: true,
            sequences: true,
            booleans: true,
            drop_console: true
          },
          output: {
            comments: false
          }
        }
      })
    ]
  }
};

module.exports = config;
