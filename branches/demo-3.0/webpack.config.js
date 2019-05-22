const path = require('path')
//引用webpack
const webpack = require('webpack')
//预处理HTML模板理插件
const HtmlWebpackPlugin = require('html-webpack-plugin')
//压缩javascript插件
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
//单独打包文件
// const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  mode: 'development',//development production
  devtool: 'eval-source-map',
  entry: {
    //入口文件
    index: '@/main/index.js',
    live: '@/main/live.js',
    liveMobile: '@/main/live-mobile.js',
    replay: '@/main/replay.js',
    replayMobile: '@/main/replay-mobile.js',
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'js/[name].js?hash=[hash]',
    // publicPath:"//static.csslcloud.net"
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'assets': path.resolve(__dirname, 'src/assets'),
      'common': path.resolve(__dirname, 'src/common'),
      'components': path.resolve(__dirname, 'src/components'),
      'main': path.resolve(__dirname, 'src/main')
    }
  },

  devServer: {
    host: "192.168.200.33",
    //设置为true，当源文件改变时会自动刷新页面
    inline: false,
    //本地服务器所加载的页面所在的目录
    contentBase: path.join(__dirname, '/dist'),
    //禁止跳转
    historyApiFallback: true,
    //端口
    port: 8080
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
        include: path.join(__dirname, '/src/components'),
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

      //单独打包css

      // {
      //   test: /\.css$/,
      //   use: ExtractTextPlugin.extract({
      //     fallback: 'style-loader',
      //     use: 'css-loader'
      //   })
      // },

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
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new HtmlWebpackPlugin({
      title: '登录',
      inject: 'body',
      filename: 'index.html',
      template: './src/index.html',
      chunks: ['index']
    }),
    new HtmlWebpackPlugin({
      title: 'WEB端观看直播',
      inject: 'body',
      filename: 'live.html',
      template: './src/live.html',
      chunks: ['live']
    }),
    new HtmlWebpackPlugin({
      title: '移动端观看直播',
      inject: 'body',
      filename: 'live-mobile.html',
      template: './src/live-mobile.html',
      chunks: ['liveMobile']
    }),
    new HtmlWebpackPlugin({
      title: 'WEB端观看回放',
      inject: 'body',
      filename: 'replay.html',
      template: './src/replay.html',
      chunks: ['replay']
    }),
    new HtmlWebpackPlugin({
      title: '移动端观看回放',
      inject: 'body',
      filename: 'replay-mobile.html',
      template: './src/replay-mobile.html',
      chunks: ['replayMobile']
    }),
    // new UglifyJsPlugin({
    //   sourceMap: true,
    //   parallel: true
    // }),
    // new ExtractTextPlugin('css/main.css')
  ]
}
