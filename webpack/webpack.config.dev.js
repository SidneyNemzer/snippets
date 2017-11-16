/* Webpack Development Config

  This configuration file is used by Webpack (and webpack-dev-server) during
  development of your app. It is focused on build speed and ease of debugging
  while production is focused on file size optimization

  This file is mostly taken from the create-react-app project
  https://github.com/facebookincubator/create-react-app
*/
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { version } = require('../package.json')

require('./build-manifest.js')()

module.exports = {
  devServer: {
    contentBase: './build',
    watchContentBase: true,
    publicPath: '/'
  },
  devtool: 'cheap-module-source-map',
  // These are the "entry points" to our application.
  // This means they will be the "root" imports that are included in JS bundle.
  entry: {
    background: './src/js/background.js',
    devtools: './src/js/devtools.js',
    panel: './src/js/panel.js',
    test: './src/js/test.js'
  },
  output: {
    // Next line is not used in dev but WebpackDevServer crashes without it:
    path: path.resolve('./build'),
    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: true,
    // Since this config is used by webpack dev server, this does not produce
    // a real file. It's just the virtual path that is served by
    // WebpackDevServer in development. This is the JS bundle containing code
    // from all our entry points, and the Webpack runtime.
    filename: 'js/[name].js',
    // There are also additional JS chunk files if you use code splitting.
    chunkFilename: 'js/[name].chunk.js',
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
  },
  resolve: {
    // These are the reasonable defaults supported by the Node ecosystem.
    // We also include JSX as a common component filename extension to support
    // some tools, although we do not recommend using it, see:
    // https://github.com/facebookincubator/create-react-app/issues/290
    extensions: ['.js', '.json', '.jsx']
  },
  module: {
    // This makes missing exports an error instead of a warning
    strictExportPresence: true,
    rules: [
      {
        test: /\.(js|jsx)$/,
        enforce: 'pre',
        use: [
          {
            options: {
              eslintPath: require.resolve('eslint')
            },
            loader: require.resolve('eslint-loader')
          }
        ],
        include: path.resolve('./src')
      },
      {
        // "oneOf" will traverse all following loaders until one will
        // match the requirements. When no loader matches it will fall
        // back to the "file" loader at the end of the loader list.
        oneOf: [
          // "url" loader works like "file" loader except that it embeds assets
          // smaller than specified limit in bytes as data URLs to avoid requests.
          // A missing `test` is equivalent to a match.
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'media/[name].[ext]'
            }
          },
          // Process JS with Babel.
          {
            test: /\.(js|jsx)$/,
            include: path.resolve('./src'),
            loader: require.resolve('babel-loader'),
            options: {
              // This is a feature of `babel-loader` for webpack (not Babel itself).
              // It enables caching results in ./node_modules/.cache/babel-loader/
              // directory for faster rebuilds.
              cacheDirectory: true,
              presets: ['env', 'react']
            }
          },
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
          // "file" loader makes sure those assets get served by WebpackDevServer.
          // When you `import` an asset, you get its (virtual) filename.
          // In production, they would get copied to the `build` folder.
          // This loader doesn't use a "test" so it will catch all modules
          // that fall through the other loaders.
          {
            // Exclude `js` files to keep "css" loader working as it injects
            // it's runtime that would otherwise processed through "file" loader.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            exclude: [/\.js$/, /\.html$/, /\.json$/, /\.ejs$/],
            loader: require.resolve('file-loader'),
            options: {
              name: 'media/[name].[ext]'
            }
          }
        ]
      }
      // ** STOP ** Are you adding a new loader?
      // Make sure to add the new loader(s) before the "file" loader.
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      SNIPPETS_VERSION: JSON.stringify(version)
    }),
    // Copy static files into the build folder
    new CopyWebpackPlugin([{
      from: 'static', to: './'
    }]),
    // Generates an `index.html` file with the <script> injected.
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
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['test'],
      filename: 'test.html',
      title: 'Test'
    }),
    // Add module names to factory functions so they appear in browser profiler.
    new webpack.NamedModulesPlugin()
  ],
  // Turn off performance hints during development because we don't do any
  // splitting or minification in interest of speed.
  performance: {
    hints: false
  }
}
