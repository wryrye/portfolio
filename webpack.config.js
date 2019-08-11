const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    'main': './src/index.js',
    'pdf.worker': 'pdfjs-dist/build/pdf.worker.entry',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Ryan Coughlin',
      template: 'src/index.html'
    }),
    new CopyPlugin([
      { from: 'src/assets', to: 'assets' },
    ])
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  }
};