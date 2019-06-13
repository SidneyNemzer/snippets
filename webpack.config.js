const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const package_ = require("./package.json");
const path = require("path");
const webpack = require("webpack");

const AfterEmitPlugin = fn => ({
  apply: compiler => {
    compiler.hooks.afterEmit.tap("AfterEmitPlugin", fn);
  }
});

const buildManifest = () => {
  const { name, description, version } = package_;
  const manifest = Object.assign(require("./src/manifest.json"), {
    name,
    description,
    version
  });
  fs.writeFileSync("build/manifest.json", JSON.stringify(manifest, null, 2));
};

const html = [
  new HtmlWebpackPlugin({
    chunks: ["panel"],
    filename: "panel.html",
    title: "Snippets"
  }),
  new HtmlWebpackPlugin({
    chunks: ["devtools"],
    filename: "devtools.html",
    title: "Snippets"
  })
];

const devServerHtml = [
  new HtmlWebpackPlugin({
    template: "./src/panel.html",
    chunks: ["test"],
    filename: "index.html"
  })
];

const extractCssLoader = {
  loader: MiniCssExtractPlugin.loader,
  options: { hmr: false }
};

module.exports = (env, args) => {
  const isDevServer = env && env.devServer;
  const isProduction = args.mode === "production";
  const entry = isDevServer
    ? { test: "./src/js/test.js" }
    : {
        background: "./src/js/background.js",
        devtools: "./src/js/devtools.js",
        panel: "./src/js/panel.js"
      };

  return {
    mode: args.mode || "development",

    devtool: !isProduction && "cheap-module-eval-source-map",

    entry,

    output: {
      path: path.resolve(__dirname, "build")
    },

    module: {
      strictExportPresence: true,
      rules: [
        {
          oneOf: [
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              loader: "url-loader",
              options: {
                limit: 10000,
                fallback: "file-loader",
                name: "[name].[ext]"
              }
            },
            {
              test: /\.(js|jsx)$/,
              loader: "babel-loader",
              options: { cacheDirectory: true }
            },
            {
              test: /\.css$/,
              use: [
                isProduction ? extractCssLoader : "style-loader",
                "css-loader"
              ]
            },
            {
              test: /\.(ttf|eot|woff|woff2)$/,
              loader: "file-loader",
              options: { name: "fonts/[name].[ext]" }
            },
            {
              // Exclude a few other extensions so they get processed by Webpack's
              // internal loaders.
              exclude: [/\.js$/, /\.html$/, /\.json$/, /\.ejs$/],
              loader: "file-loader",
              options: { name: "[name].[ext]" }
            }
          ]
        }
      ]
    },

    plugins: [
      new webpack.DefinePlugin({
        SNIPPETS_VERSION: JSON.stringify(package_.version),
        "process.env.NODE_ENV": JSON.stringify(args.mode || "development")
      }),
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin([{ from: "static", to: "./" }]),
      AfterEmitPlugin(buildManifest),
      isProduction && new MiniCssExtractPlugin(),
      ...(isDevServer ? devServerHtml : html)
    ].filter(Boolean),

    optimization: {
      minimize: isProduction
    },

    performance: {
      hints: false
    }
  };
};
