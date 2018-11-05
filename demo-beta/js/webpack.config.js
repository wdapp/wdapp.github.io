
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');


module.exports = {
    devtool: 'source-map',
    entry:  __dirname + "/js/playbackSDK.js",
    output: {
        path: __dirname + "/dist",
        filename: "bundle.js"
    },
    module: {
        loaders:[
            // {
            //     test: /\.scss$/,
            //     loader: 'style-loader!css-loader!sass-loader'
            // },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },
    devServer: {
        contentBase: "./dist",
        historyApiFallback: true,
        inline: true
    },
    plugins: [
        new UglifyJsPlugin({
            sourceMap: true
        })
        // new ExtractTextPlugin("style.css")
    ]
};