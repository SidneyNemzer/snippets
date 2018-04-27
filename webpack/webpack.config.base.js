const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const OnBuildPlugin = require('on-build-webpack')
const { version } = require('../package.json')

const globalPlugins = [
  new webpack.DefinePlugin({
    SNIPPETS_VERSION: JSON.stringify(version)
  }),
  new CleanWebpackPlugin(
    ['build/**/*.*'],
    { root: path.resolve('.') }
  ),
  new CopyWebpackPlugin([{
    from: 'static', to: './'
  }]),
  // Build the manifest after Webpack is done
  new OnBuildPlugin(() => {
    require('./build-manifest.js')()
  })
]

const globalLoaders = {
  // "url" loader works just like "file" loader but it also embeds
  // assets smaller than specified size as data URLs to avoid requests.
  url: {
    test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
    loader: require.resolve('url-loader'),
    options: {
      limit: 10000,
      name: 'media/[name].[ext]'
    }
  },
  // Process JS with Babel.
  babel: {
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
  // "file" loader makes sure assets end up in the `build` folder.
  // When you `import` an asset, you get its filename.
  // This loader doesn't use a "test" so it will catch all modules
  // that fall through the other loaders.
  file: {
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
}

module.exports = {
  baseConfig: {
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
      strictExportPresence: true
    },

    // Some libraries import Node modules but don't use them in the browser.
    // Tell Webpack to provide empty mocks for them so importing them works.
    node: {
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty'
    }
  },

  globalPlugins,
  globalLoaders
}
