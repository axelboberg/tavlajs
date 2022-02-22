/**
 * Axel Boberg © 2019
 */

const path = require('path')

module.exports = {
  entry: './index.js',
  mode: 'production',
  target: 'web',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: '[name].bundle.js'
  }
}