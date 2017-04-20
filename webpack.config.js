const path = require('path')

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'src/panel.js'),
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'panel.min.js'
  },
  plugins: [
    new UglifyJSPlugin()
  ]
}
