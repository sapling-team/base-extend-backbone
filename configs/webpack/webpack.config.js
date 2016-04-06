var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var env = process.env.WEBPACK;
var plugins = [];
var filename = '';
var filePath = __dirname.replace('/configs/webpack','');
if (env === 'DEV') {
    filename = 'base-extend-backbone.js';
    plugins.length = 0;
}else{
    filename = 'base-extend-backbone.min.js';
    plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress:{
            warnings:false
        }
    }))
}
var config = {
    entry: "./src/index.js",
    output: {
        path: path.resolve(filePath+'/build'),
        filename: filename
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'eslint-loader',
                exclude: /(node_modules)/
            }
        ]
    },
    plugins: plugins,
    resolve: {
        alias: {
            "config": path.resolve(filePath,'config')
        }
    },
    externals: {
        jquery: 'window.jQuery',
        backbone: 'window.Backbone',
        underscore: 'window._',
        tplEng : 'window.artTemplate'
    }
};
// console.log(path.resolve(__dirname,'node_modules/jquery/dist/jquery.js'))
module.exports = config;
