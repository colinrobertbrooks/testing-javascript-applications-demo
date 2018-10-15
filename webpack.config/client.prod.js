const fs = require('fs');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const { version } = require('../package.json');

const config = {
  mode: 'production',
  entry: (() => {
    const entry = {};

    fs.readdirSync('app/assets/javascripts/client').forEach(folderName => {
      entry[
        folderName
      ] = `./app/assets/javascripts/client/${folderName}/${folderName}.js`;
    });

    return entry;
  })(),
  output: {
    filename: `[name].${version}.js`,
    path: path.join(__dirname, '../public/javascripts')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `../stylesheets/[name].${version}.css`
    })
  ],
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
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  performance: {
    hints: false
  }
};

module.exports = config;
