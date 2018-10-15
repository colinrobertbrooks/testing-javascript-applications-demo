const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const { version } = require('../package.json');

const config = {
  mode: 'development',
  entry: (() => {
    const entry = {};

    fs.readdirSync('app/assets/javascripts/client').forEach(folderName => {
      entry[folderName] = [
        '@babel/polyfill',
        'react-hot-loader/patch',
        'react',
        'react-dom',
        'webpack-hot-middleware/client',
        `./app/assets/javascripts/client/${folderName}/${folderName}.js`
      ];
    });

    return entry;
  })(),
  output: {
    filename: `[name].${version}.js`,
    path: path.join(__dirname, 'public/javascripts'),
    publicPath: '/javascripts/'
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
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin({
      publicPath: '/static/'
    })
  ]
};

module.exports = config;
