var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var plugins = [];
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var optimize = webpack.optimize
var extractLESS = new ExtractTextPlugin('../style/css/[name].css');
plugins.push(extractLESS);
plugins.push(new optimize.CommonsChunkPlugin('common.js'));
var config = {
    entry: {
        "index.main":"./src/index.main.js"
    },
    output: {
        path: path.resolve(__dirname + '/js'),
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
            "tplEng": path.resolve(__dirname, 'link/template'),  //模板引擎
            "BaseModel": path.resolve('../../src/instance/baseModel'),
            "BaseView": path.resolve('../../src/instance/baseView'),
            "BaseRouter": path.resolve('../../src/instance/baseRouter'),
            "ManagedObject": path.resolve('../../src/entity/ManagedObject'),
            "store": path.resolve('../../src/store/locationStore'),
            "cookie": path.resolve('../../src/store/cookie'),
            "url": path.resolve('../../src/util/url'),
            "tools": path.resolve('../../src/util/tools'),
            "DateTime": path.resolve('../../src/util/DateTime'),
            "config": path.resolve(__dirname,'src/config')
        }
    },
    externals: {
        jquery: 'window.jQuery',
        backbone: 'window.Backbone',
        underscore: 'window._'
    }
};
module.exports = config;
