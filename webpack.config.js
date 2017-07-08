const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TodoWebpackPlugin = require('todo-webpack-plugin')
const pages = require('./src/build')

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
        include: [
          './src'
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'react']
          }
        }
      },
      {
        test: /\.css/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },

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

  baseConfig.plugins = baseConfig.plugins.concat(pagesToAdd.map(page => (
    new HtmlWebpackPlugin({
      title: page.options.title,
      filename: page.output.html,
      template: 'src/' + page.input.template,
      chunks: [page.output.bundle]
    })
  )))

  return baseConfig
}

module.exports = generateConfig(config, pages)
