/**
 * Axel Boberg © 2019
 */

const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.common')
const htmlPlugin = require('html-webpack-plugin')

module.exports = merge(common, {
  'entry': './example/index.js',
  'mode': 'development',
  'devtool': 'inline-source-map',
  'devServer': {
    contentBase: path.join(__dirname, 'dist'),
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