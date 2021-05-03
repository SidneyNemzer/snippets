const fs = require("fs");
const path = require("path");

const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");

const package_ = require("./package.json");

const AfterEmitPlugin = (fn) => ({
  apply: (compiler) => {
    compiler.hooks.afterEmit.tap("AfterEmitPlugin", fn);
  },
});

const buildManifest = () => {
  const { name, description, version } = package_;
  const manifest = Object.assign(require("./src/manifest.json"), {
    name,
    description,
    version,
  });
  fs.writeFileSync("build/manifest.json", JSON.stringify(manifest, null, 2));
};

const html = [
  new HtmlWebpackPlugin({
    chunks: ["panel"],
    filename: "panel.html",
    title: "Snippets",
    template: "./src/panel.html",
  }),
  new HtmlWebpackPlugin({
    chunks: ["devtools"],
    filename: "devtools.html",
    title: "Snippets",
  }),
];

const devServerHtml = [
  new HtmlWebpackPlugin({
    template: "./src/panel.html",
    chunks: ["test"],
    filename: "index.html",
  }),
];

const extractCssLoader = {
  loader: MiniCssExtractPlugin.loader,
  options: { hmr: false },
};

module.exports = (env, args) => {
  const isDevServer = env && env.devServer;
  const isProduction = args.mode === "production";
  const entry = isDevServer
    ? {
        test: "./src/test.ts",
        "worker-javascript-eslint":
          "./src/mode-javascript-eslint/worker-javascript-eslint.js",
      }
    : {
        background: "./src/background.ts",
        devtools: "./src/devtools.ts",
        panel: "./src/panel.ts",
        "worker-javascript-eslint":
          "./src/mode-javascript-eslint/worker-javascript-eslint.js",
      };

  return {
    mode: args.mode || "development",

    devtool: !isProduction && "cheap-source-map",

    entry,

    output: {
      path: path.resolve(__dirname, "build"),
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
                name: "[name].[ext]",
              },
            },
            {
              test: /\.(jsx?|tsx?)$/,
              loader: "babel-loader",
              options: { cacheDirectory: true },
            },
            {
              test: /\.css$/,
              use: [
                isProduction ? extractCssLoader : "style-loader",
                "css-loader",
              ],
            },
            {
              test: /\.(ttf|eot|woff|woff2)$/,
              loader: "file-loader",
              options: { name: "fonts/[name].[ext]" },
            },
            {
              // Exclude a few other extensions so they get processed by Webpack's
              // internal loaders.
              exclude: [/\.js$/, /\.html$/, /\.json$/, /\.ejs$/],
              loader: "file-loader",
              options: { name: "[name].[ext]" },
            },
          ],
        },
      ],
    },

    plugins: [
      new webpack.DefinePlugin({
        "process.env.SNIPPETS_VERSION": JSON.stringify(package_.version),
        "process.env.NODE_ENV": JSON.stringify(args.mode || "development"),
      }),
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin({ patterns: [{ from: "static", to: "./" }] }),
      AfterEmitPlugin(buildManifest),
      isProduction && new MiniCssExtractPlugin(),
      ...(isDevServer ? devServerHtml : html),
      isDevServer && new ForkTsCheckerWebpackPlugin(),
    ].filter(Boolean),

    optimization: {
      minimize: isProduction,
    },

    performance: {
      hints: false,
    },

    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      mainFields: ["browser", "main", "module"],
    },

    node: {
      module: "empty",
      dgram: "empty",
      dns: "mock",
      fs: "empty",
      http2: "empty",
      net: "empty",
      tls: "empty",
      child_process: "empty",
    },
  };
};
