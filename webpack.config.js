var path = require('path');
var railsRoot = path.join(__dirname, '.')

module.exports = {
  context: railsRoot,
  entry: {
    'editor.js': 'editor.js'
  },
  output: {
    filename: '[name]',
    path: './public/webpack'
  },
  resolve: {
    root: [
      path.join(railsRoot, './app/assets/javascripts'),
    ],
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      { test: /\.(js|jsx)?$/, exclude: [/node_modules/, /vendor/], loader: 'babel-loader' },
    ]
  },
  cache: true,
  watchDelay: 0,
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(railsRoot, './public')
  },
};
