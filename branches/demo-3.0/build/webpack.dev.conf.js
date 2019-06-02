const path = require('path')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf.js')
const config = require('../src/common/config')

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    host: (config.host || 'localhost'),
    inline: false,
    contentBase: path.join(__dirname, '..', '/dist'),
    historyApiFallback: true,
    port: (config.port || '8080')
  },
})

module.exports = devWebpackConfig