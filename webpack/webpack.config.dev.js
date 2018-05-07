const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const base = require('./webpack.config.base')

module.exports = {
  ...base.baseConfig,

  devtool: 'cheap-module-source-map',

  entry: {
    background: './src/js/background.js',
    devtools: './src/js/devtools.js',
    panel: './src/js/panel.js'
  },

  module: {
    ...base.baseConfig.module,

    rules: [
      {
        oneOf: [
          base.globalLoaders.url,
          base.globalLoaders.babel,
          // "css" loader resolves paths in CSS and adds assets as dependencies.
          // "style" loader turns CSS into JS modules that inject <style> tags.
          // In production, we use a plugin to extract that CSS to a file, but
          // in development "style" loader enables hot editing of CSS.
          {
            test: /\.css/,
            use: [
              'style-loader',
              'css-loader'
            ]
          },
          base.globalLoaders.file
        ]
      }
    ]
  },

  plugins: [
    // Generate html files for the various pages
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['devtools'],
      filename: 'devtools.html',
      title: 'Devtools'
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['panel'],
      filename: 'panel.html',
      title: 'Panel'
    }),
    // Add module names to factory functions so they appear in browser profiler.
    new webpack.NamedModulesPlugin(),
    ...base.globalPlugins
  ],

  // Turn off performance hints during development because we don't do any
  // splitting or minification in interest of speed.
  performance: {
    hints: false
  }
}
