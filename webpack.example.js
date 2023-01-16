/**
 * Axel Boberg © 2019
 */

const path = require('path')
const common = require('./webpack.config')
const htmlPlugin = require('html-webpack-plugin')

const { merge } = require('webpack-merge')

module.exports = merge(common, {
  'entry': './example/index.js',
  'mode': 'development',
  'devtool': 'inline-source-map',
  'devServer': {
    static: path.join(__dirname, 'dist'),
    compress: true,
    port: 8080,
    historyApiFallback: true
  },
  'plugins': [
    new htmlPlugin({
      template: './example/template.html'
    })
  ]
})