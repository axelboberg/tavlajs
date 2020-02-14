/**
 * Axel Boberg © 2019
 */

const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].bundle.css'
    })
  ],
  output: {
    path: path.join(__dirname, '/dist'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [{
        test: /\.(svg|woff2)$/,
        use: {
          loader: 'url-loader',
          options: {
            fallback: 'file-loader',
            name: 'assets/[name].[ext]',
            limit: 8000,
            emitFile: true
          }
        }
      },{
        test: /\.(png|jp(e*)g)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'assets/[name].[ext]',
            emitFile: true
          }
        }
      },{
        test: /\.(css|sass|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  }
}