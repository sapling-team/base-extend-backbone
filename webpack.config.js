var webpack = require('webpack');
var path = require('path');
var plugins = [];
var config = {
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname + '/build'),
        filename: '[name].js'
    },
    devtool: 'source-map',
    module: {
        loaders: [
            // {
            //     test: /\.js$/,
            //     loader: 'eslint-loader',
            //     exclude: /(node_modules)/
            // }
        ]
    },
    plugins: plugins,
    resolve: {
        alias: {
            "config": path.resolve(__dirname, 'config')
        }
    },
    externals: {
        jquery: 'window.jQuery',
        backbone: 'window.Backbone',
        underscore: 'window._'
    }
};
// console.log(path.resolve(__dirname,'node_modules/jquery/dist/jquery.js'))
module.exports = config;
