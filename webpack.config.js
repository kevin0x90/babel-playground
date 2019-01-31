const path = require('path')

module.exports = {
  entry: ['./src/Test.js'],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  resolveLoader: {
    modules: ['node_modules', path.resolve(__dirname, 'loaders')]
  },
  module: {
    rules: [
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.mustache$/, exclude: /node_modules/, loader: "hogan-loader" }
    ]
  }
}