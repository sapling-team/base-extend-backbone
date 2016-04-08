var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var env = process.env.WEBPACK;
var plugins = [];
var filename = '';
var output = {};
var filePath = __dirname.replace('/configs/webpack','');
if (env === 'dev') {
    filename = 'base-extend-backbone.js';
    plugins.length = 0;
    output = {
        path: path.resolve(filePath+'/build'),
        filename: filename
    };
}else{
    filename = 'base-extend-backbone.min.js';
    plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress:{
            warnings:false
        }
    }));
    plugins.push(new webpack.DefinePlugin({
        'process.env':{
            NODE_ENV:'product'
        }
    }));
    output = {
        path: path.resolve(filePath + '/build'),
        filename: filename,
		libraryTarget:'commonjs2'
    };
}
var config = {
    entry: "./src/index.js",
    output: output,
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
