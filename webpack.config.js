const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    main: "./src/index.js",
  },
  plugins: [
    // new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "Ryan Coughlin",
      template: "index.html",
      favicon: "./favicon.ico",
    }),
    new CopyPlugin([{ from: "src/assets", to: "assets" }]),
  ],
  output: {
    path: path.resolve(__dirname, "docs"),
    filename: "[name].bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  devServer: {
    open: true,
    contentBase: path.join(__dirname, "src/assets"),
  },
};
