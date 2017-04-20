const path = require('path')

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname, './src'),
  entry: 'panel.js',
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'panel.min.js'
  },
  plugins: [
    new UglifyJSPlugin()
  ]
}
