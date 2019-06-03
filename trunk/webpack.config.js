var path = require('path')
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: {
    'liveSDK': __dirname + '/js/liveSDK.js',
    'playbackSDK': __dirname + '/js/playbackSDK.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'production',
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: false,
        uglifyOptions: {
          ie8: true
        }
      })
    ]
  },

  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   enforce: 'post', // post-loader处理
      //   use: ['es3ify-loader']
      // },
      // {
      //   test: /\.js$/,
      //   use: ['babel-loader']
      // }
    ]
  },
  plugins: [
    // new UglifyJsPlugin({
    //   // sourceMap: true,
    //   cache:false,
    //   uglifyOptions: {
    //
    //     // warning:false,
    //     ie8:true,
    //     // mangle:false
    //
    //
    //   }
    //
    // })
  ]

}