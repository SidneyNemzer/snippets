const path = require('path')

module.exports = {
  context: path.resolve(__dirname, './src'),
  entry: 'panel.js',
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'panel.min.js'
  }
}
