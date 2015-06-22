var config = require('./webpack.config.js');
var SaveAssetsJson = require('assets-webpack-plugin');

config.output.filename = '[chunkhash]-[name]';

var plugin = new SaveAssetsJson({
  path: config.output.path,
  filename: 'manifest.json'
});

config.plugins = [plugin];
config.devtool = '';

module.exports = config;
