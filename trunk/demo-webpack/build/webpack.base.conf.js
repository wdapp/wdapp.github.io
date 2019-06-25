const path = require('path')
const webpack = require('webpack')
const config = require('./config')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    //入口文件
    index: './src/main/index.js',
    live: './src/main/live.js',
    liveMobile: './src/main/live-mobile.js',
    replay: './src/main/replay.js',
    replayMobile: './src/main/replay-mobile.js',
  },
  output: {
    path: path.join(__dirname, '..', 'dist'),
    filename: 'js/[name].js?hash=[hash]'
  },

  devServer: {
    host: (config.host || 'localhost'),
    inline: false,
    contentBase: path.join(__dirname, '..', '/dist'),
    historyApiFallback: true,
    port: (config.port || '8080')
  },

  resolve: {
    alias: {
      'build': path.resolve(__dirname, '..', 'build'),
      '@': path.resolve(__dirname, '..', 'src'),
      'assets': path.resolve(__dirname, '..', 'src/assets'),
      'common': path.resolve(__dirname, '..', 'src/common'),
      'components': path.resolve(__dirname, '..', 'src/components'),
      'main': path.resolve(__dirname, '..', 'src/main')
    }
  },

  performance: {
    maxAssetSize: 2000000,
    maxEntrypointSize: 2000000
  },

  module: {
    rules: [

      //HTML模板预处理

      {
        test: /\.(html)$/,
        include: path.join(__dirname, '..', 'src/components'),
        use: {
          loader: 'html-loader',
          options: {
            attrs: ['img:src', 'link:href'],
            minimize: true,
            removeComments: true,
            collapseWhitespace: false
          }
        }
      },

      //预处理ECMAScript 6

      {
        test: /\.js$/,
        // exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              ['@babel/plugin-transform-template-literals', {'loose': true}],
              ['@babel/plugin-proposal-class-properties', {'loose': true}]
            ]
          }
        }
      },

      //预处理 sass css style

      {
        test: /\.scss$|\.css/,
        use: ['style-loader', {
          loader: 'css-loader',
          options: {
            importLoaders: 2
          }
        }, {
          loader: 'postcss-loader',
          options: {
            ident: 'postcss',
            plugins: [
              require('autoprefixer')({
                browsers: ['last 5 version']
              }),
            ]
          }
        }, 'sass-loader']
      },

      //压缩图片、字体

      {
        test: /(\.(png|jpg|gif|svg)$)|(\.(woff2?|eot|ttf|otf)(\?.*)?$)/,
        use: [
          'url-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              limit: 10000,
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: '登录',
      inject: 'body',
      filename: 'index.html',
      template: 'src/index.html',
      chunks: ['index']
    }),
    new HtmlWebpackPlugin({
      title: 'WEB端观看直播',
      inject: 'body',
      filename: 'live.html',
      template: 'src/live.html',
      chunks: ['live']
    }),
    new HtmlWebpackPlugin({
      title: '移动端观看直播',
      inject: 'body',
      filename: 'live-mobile.html',
      template: 'src/live-mobile.html',
      chunks: ['liveMobile']
    }),
    new HtmlWebpackPlugin({
      title: 'WEB端观看回放',
      inject: 'body',
      filename: 'replay.html',
      template: 'src/replay.html',
      chunks: ['replay']
    }),
    new HtmlWebpackPlugin({
      title: '移动端观看回放',
      inject: 'body',
      filename: 'replay-mobile.html',
      template: 'src/replay-mobile.html',
      chunks: ['replayMobile']
    })
  ]
}
