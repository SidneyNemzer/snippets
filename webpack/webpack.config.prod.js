const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const base = require('./webpack.config.base')

const htmlPluginMinifyOptions = {
  removeComments: true,
  collapseWhitespace: true,
  removeRedundantAttributes: true,
  useShortDoctype: true,
  removeEmptyAttributes: true,
  removeStyleLinkTypeAttributes: true,
  keepClosingSlash: true,
  minifyJS: true,
  minifyCSS: true,
  minifyURLs: true
}

module.exports = {
  ...base.baseConfig,

  bail: true,

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
          // 'css-loader' resolves paths in CSS and adds assets as dependencies.
          // `ExtractTextPlugin` grabs any CSS and into a separate file.
          // When code splitting, async bundles will use the 'style-loader' and
          // be injected as <style> tags by that bundle
          {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract({
              fallback: {
                loader: require.resolve('style-loader'),
                options: {
                  hmr: false
                }
              },
              use: [
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    importLoaders: 1,
                    minimize: true,
                    sourceMap: true
                  }
                }
              ]
            })
          },
          base.globalLoaders.file
        ]
      }
    ]
  },

  plugins: [
    // Minify the JavaScript
    new UglifyJsPlugin({
      sourceMap: true
    }),
    // Generate html files for the various pages
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['devtools'],
      filename: 'devtools.html',
      minify: htmlPluginMinifyOptions,
      title: 'Devtools'
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['panel'],
      filename: 'panel.html',
      minify: htmlPluginMinifyOptions,
      title: 'Panel'
    }),
    new ExtractTextPlugin({
      filename: 'css/[name].css'
    }),
    ...base.globalPlugins
  ]
}
