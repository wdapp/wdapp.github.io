const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf.js')

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'eval-source-map'
})

module.exports = devWebpackConfig