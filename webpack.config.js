const path = require('path')


function relativePath(subURL) {
  return path.resolve(__dirname, subURL)
}

module.exports = {
  entry: relativePath('src/panel.js'),
  output: {
    path: relativePath('build'),
    filename: 'panel.min.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: relativePath('src'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015']
          }
        }
      }
    ]
  }
}
