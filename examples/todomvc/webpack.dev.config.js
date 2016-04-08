var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var plugins = [];
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var optimize = webpack.optimize;
var extractLESS = new ExtractTextPlugin('/css/[name].css');
plugins.push(extractLESS);
plugins.push(new optimize.CommonsChunkPlugin('common.js'));
var config = {
    entry: {
        "index.main":"./app/src/index.main.js"
    },
    output: {
        path: path.resolve(__dirname + '/source'),
        filename: '[name].js'
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.html$/,
                loader: 'raw',
                exclude: /(node_modules)/
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /(node_modules)/
            },
            {
                test: /\.less$/i,
                loader: extractLESS.extract(['css', 'less'])
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader?limit=8192'
            }
        ]
    },
    plugins: plugins,
    resolve: {
        alias: {
            "tplEng": path.resolve(__dirname, './app/link/template'),  //模板引擎
            "base": path.resolve('../../src/index'),
            "store": path.resolve('../../src/store/locationStore'),
            "cookie": path.resolve('../../src/store/cookie'),
            "url": path.resolve('../../src/util/url'),
            "tools": path.resolve('../../src/util/tools'),
            "DateTime": path.resolve('../../src/util/DateTime'),
            "config": path.resolve(__dirname,'./app/src/config')
        }
    },
    externals: {
        jquery: 'window.jQuery',
        backbone: 'window.Backbone',
        underscore: 'window._'
    }
};
module.exports = config;
