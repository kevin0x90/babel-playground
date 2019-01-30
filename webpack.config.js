const path = require('path')

module.exports = {
  entry: ['@babel/polyfill', './src/Test.js'],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  resolveLoader: {
    fallback: [
      path.resolve(__dirname, 'loaders'),
      path.join(process.cwd(), 'node_modules')
    ]
  },
  module: {
    rules: [
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.mustache$/, exclude: /node_modules/, loader: "hogan-loader" }
    ]
  }
}