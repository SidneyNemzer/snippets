/* Webpack Development Config

  This configuration file is used by Webpack (and webpack-dev-server) during
  development. It's focused on build speed and ease of debugging while
  production is focused on file size optimization

  This file is based on the create-react-app dev config
  https://github.com/facebookincubator/create-react-app
*/
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const OnBuildPlugin = require('on-build-webpack')
const { version } = require('../package.json')

module.exports = {
  devServer: {
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
  },

  devtool: 'cheap-module-source-map',

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

  module: {
    // This makes missing exports an error instead of a warning
    strictExportPresence: true,
    rules: [
      {
        // "oneOf" will traverse its loaders until one matchs the requirements.
        // When no loader matches it will fall back to the "file" loader at the
        // end of the loader list.
        oneOf: [
          // "url" loader works just like "file" loader but it also embeds
          // assets smaller than specified size as data URLs to avoid requests.
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
              presets: ['env', 'react', 'stage-2']
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
            // its runtime that would otherwise processed through "file" loader.
            // Also exclude a few other extensions so they get processed
            // by Webpack's internal loaders.
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
    new CleanWebpackPlugin(
      ['build/**/*.*'],
      { root: path.resolve('.') }
    ),
    new webpack.DefinePlugin({
      SNIPPETS_VERSION: JSON.stringify(version)
    }),
    // Copy static files into the build folder
    new CopyWebpackPlugin([{
      from: 'static', to: './'
    }]),
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
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['test'],
      filename: 'test.html',
      title: 'Test'
    }),
    // Add module names to factory functions so they appear in browser profiler.
    new webpack.NamedModulesPlugin(),
    // Build the manifest after Webpack is done
    new OnBuildPlugin(() => {
      require('./build-manifest.js')()
    })
  ],
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  // Turn off performance hints during development because we don't do any
  // splitting or minification in interest of speed.
  performance: {
    hints: false
  }
}
