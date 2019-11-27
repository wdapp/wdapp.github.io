const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  devtool: 'none',
  plugins: [
    new UglifyJsPlugin({
      sourceMap: true,
      parallel: true
    })
  ]
})

module.exports = webpackConfig

