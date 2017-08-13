const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TodoWebpackPlugin = require('todo-webpack-plugin')
const pages = require('./src/build-dev')

// Prevents deprecation warnings
process.noDeprecation = true

const config = {
  entry: {},
  output: {},

  plugins: [
    //new TodoWebpackPlugin()
  ],

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react']
          }
        }
      },
      {
        test: /\.css/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
      }
    ]
  },

  devtool: 'eval-source-map',

  devServer: {
    contentBase: './build',
    inline: true,
    stats: {
      colors: true
    }
  }
}

const generateConfig = (baseConfig, pagesToAdd) => {
  baseConfig.entry = pagesToAdd.reduce(
    (accumulator, page) => (Object.assign(accumulator, {
      [page.output.bundle]: './src/' + page.input.entryScript
    })),
    {}
  )

  baseConfig.output = {
    path: path.resolve('./build/'),
    filename: '[name].js'
  }

  baseConfig.plugins = baseConfig.plugins.concat(pagesToAdd.map(page => {
    if (page.input.template) {
      return new HtmlWebpackPlugin({
        title: page.options ? page.options.title : '',
        filename: page.output.html,
        template: 'src/' + page.input.template,
        chunks: [page.output.bundle]
      })
    } else {
      return undefined
    }
  }).filter(item => item !== undefined))

  return baseConfig
}

module.exports = generateConfig(config, pages)
