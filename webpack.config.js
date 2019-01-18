const path = require('path')

module.exports = {
  entry: ['@babel/polyfill', './src/Test.js'],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.handlebars$/, exclude: /node_modules/, loader: "handlebars-loader" } 
    ]
  }
}