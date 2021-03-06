const canonical = "https://dev.localweather.io";
const path = require("path");
const variables = require("./src/js/modules/defaults");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: [
    "./src/js/app.js",
    "./src/scss/styles.scss",
  ],
  output: {
    filename: "./js/bundle.js",
    chunkFilename: "./js/[name].bundle.js",
    path: path.resolve(__dirname, "build")
  },
  devServer: {
    compress: true,
    port: 5500,
    overlay: {
      warnings: true,
      errors: true
    }
  },
  mode: "development",
  module: {
    rules: [{
        test: /\.s?[ac]ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader"
          },
          {
            loader: "sass-loader"
          }
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "./css/styles.css",
    }),
    new HtmlWebpackPlugin({
      inject: false,
      template: "./src/index.html",
      environment: "development",
      appName: variables.appName,
      author: variables.author,
      canonical: canonical,
      description: variables.description,
      keywords: variables.keywords,
      loadingText: variables.loadingText,
      themeColor: variables.themeColor,
      title: variables.title,
      versionString: variables.versionString,
    }),
    new CopyWebpackPlugin([{
      from: "./src/service-worker.js",
      to: "./",
      force: true,
    }]),
    new CopyWebpackPlugin([{
      from: "./src/manifest.json",
      to: "./",
      force: true,
    }]),
    new CopyWebpackPlugin([{
      from: "./src/_redirects",
      to: "./",
      force: true,
    }]),
    new CopyWebpackPlugin([{
      from: "./assets/**/*",
      to: "./",
      force: true,
    }]),
  ]
};
