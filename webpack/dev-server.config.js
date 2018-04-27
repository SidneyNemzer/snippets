const HtmlWebpackPlugin = require('html-webpack-plugin')
const devConfig = require('./webpack.config.dev')

devConfig.devServer = {
  contentBase: './static',
  watchContentBase: true,
  publicPath: '/',
  clientLogLevel: 'none',
  before: app => {
    app.use('/', (req, res, next) => {
      if (req.path === '/') {
        return res.redirect('/test.html')
      }
      next()
    })
  }
}

// Only build the test page
devConfig.entry = { test: './src/js/test.js' }
devConfig.plugins = devConfig.plugins.concat([
  new HtmlWebpackPlugin({
    inject: true,
    chunks: ['test'],
    filename: 'test.html',
    title: 'Test'
  })
])

module.exports = devConfig
