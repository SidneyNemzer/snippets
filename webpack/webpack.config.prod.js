/* Webpack Production Config

  This configuration file is used by Webpack to create a production build. It's
  focused on file size optimization and speed when running the bundle.

  This file is based on the create-react-app prod config
  https://github.com/facebookincubator/create-react-app
*/
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const OnBuildPlugin = require('on-build-webpack')
const { version } = require('../package.json')

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
  // Don't attempt to continue if there are any errors.
  bail: true,

  entry: {
    background: './src/js/background.js',
    devtools: './src/js/devtools.js',
    panel: './src/js/panel.js'
  },

  output: {
    path: path.resolve('./build'),
    filename: 'js/[name].js',
    // Code splitting is not fully enabled in this config but webpack supports it
    chunkFilename: 'js/[name].chunk.js',
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: info =>
      path.relative('src', info.absoluteResourcePath).replace(/\\/g, '/')
  },

  module: {
    // This makes missing exports an error instead of a warning
    strictExportPresence: true,
    rules: [
      // Run ESLint on JavaScript files
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
          // 'css-loader' resolves paths in CSS and adds assets as dependencies.
          // `ExtractTextPlugin` grabs any CSS and into a separate file.
          // When code splitting, async bundles will use the 'style-loader' and
          // be injected as <style> tags by that bundle
          {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract(
              Object.assign(
                {
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
                },
                { /* extract text plugin options */ }
              )
            )
          },
          // "file" loader makes sure assets end up in the `build` folder.
          // When you `import` an asset, you get its filename.
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
          // ** STOP ** Are you adding a new loader?
          // Make sure to add the new loader(s) before the "file" loader.
        ]
      }
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
    // Minify the JavaScript
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        // Disabled because of an issue with Uglify breaking seemingly valid code:
        // https://github.com/facebookincubator/create-react-app/issues/2376
        // Pending further investigation:
        // https://github.com/mishoo/UglifyJS2/issues/2011
        comparisons: false
      },
      output: {
        comments: false,
        // Turned on because emoji and regex is not minified properly using default
        // https://github.com/facebookincubator/create-react-app/issues/2488
        ascii_only: true
      },
      sourceMap: true
    }),
    new ExtractTextPlugin({
      filename: 'css/[name].css'
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
    // Build the manifest after Webpack is done
    new OnBuildPlugin(() => {
      require('./build-manifest.js')()
    })
  ]
}
