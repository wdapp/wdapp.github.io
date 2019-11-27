var path = require("path");
var UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
    entry:{
        "liveSDK":__dirname+"/js/liveSDK.js",
        "playbackSDK":__dirname+"/js/playbackSDK.js"
    },
    output:{
        filename:"[name].js",
        path:path.resolve(__dirname,"dist")
    },
    mode:"production",
    module: {
    },
    plugins:[
        new UglifyJsPlugin({
            sourceMap: true
        })
    ]

};