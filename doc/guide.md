## the base-extend-backbone and backbone programming guide

原则上来说backbone的最佳实践也适用于这个扩展项目，但是对于商业项目，我们必须对团队的编程进行一定的约束，以达到风险的可控。因此这份编程指南不一定适用于第三方的团队，但我相信你们也可以有所借鉴。

## 如何组织你的代码

一个Web页面应该是有N+1个小Web页面组织而成的，所以你需要对自己的Web页面有一个初略的设计（估算你的Web页面有多少View组织而成）。而模型，你可以想象一下对于Web的数据大部分来自于请求，backbone的模型针对请求来做模型（因为它是restful），可能某些不是请求的页面，那么你可以使用`defaults`或者`ManagedObject`来处理你的数据。

**单页应用的结构**

    /app
        /link 不支持npm的第三方库或者插件
        /src
            /model
                /index
            /view
                /index
            /template
                /index
            /config.js
        /style
            /sass
        /index.html

**普通页面**

    /app
        其他目录与单页应用相同
        /web
            index.html

非常推荐使用`webpack`来构建你的应用，我们应该在对应的生命周期中完成你的业务逻辑。`beforeMount`来初始化你的自定义属性，`afterMount`来获取你View内的DOM元素对象，推荐使用`findDOMNode`方法来获取DOM元素对象，`ready`你的业务逻辑的开始。

**webpack 构建例子**

```JavaScript
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
```

*请原谅我使用ES2015写的例子，所以使用了babel，如果你写的是ES5，去掉babel-loader即可。*

## 使用的例子

**Model**

```JavaScript
import base from 'base-extend-backbone'
import Config from 'config'

const BaseModel = base.Model;
const env = Config.env[Config.scheme];
const Model = BaseModel.extend({
    url: '{{url_prefix}}/examples/todomvc/mock/default.json?id={{id}}', //填写请求地址
    headers:{
        'Warning-Header':'123'
    },
    defaults:function(){
        return {
            'items':[
                {'id':0,'name':'icepy'}
            ]
        };
    },
    beforeEmit: function(options) {
        // 如果需要开启对请求数据的本地缓存，可将下列两行注释去掉
        // this.storageCache = true; //开启本地缓存
        // this.expiration = 2; //设置缓存过期时间（1表示60*60*1000 一小时）
        if (/^\{{0,2}(url_prefix)\}{0,2}/.test(this.url)) {
            this.url = this.url.replace('{{url_prefix}}',env['url_prefix']);
        }
    },
    validate: function(attrs) {
        console.log(attrs);
    },
    formatter:function(response){
        //formatter方法可以格式化数据
        return response;
    }
});
let shared = null;
Model.sharedInstanceModel = function() {
    if (!shared) {
        shared = new Model();
    }
    return shared;
};
module.exports = Model;
```

**First View**

```JavaScript
import base from 'base-extend-backbone';
import GotoView from './goto.view';
import indexHTML from '../../template/default/index.html';

const BaseView = base.View;
const DefaultView = BaseView.extend({
    el:'#container',
    rawLoader:function(){
        return indexHTML
    },
    beforeMount:function(){
        this.lock = false;
    },
    afterMount:function(){},
    ready:function(){
        this.gotoview = new GotoView({
            parent:this
        });
    },
    context:function(){
        this.lock = true;
    },
    router:{
        dealloc:true,
        viewDidLoad:function(){},
        viewWillAppear:function(){},
        viewDidAppear:function(){},
        viewWillDisappear:function(){}
    }
});

module.exports = DefaultView;
```

**View**

```JavaScript
import base from 'base-extend-backbone';
import gotoHTML from '../../template/default/goto.html';

const BaseView = base.View;
const GotoView = BaseView.extend({
    el:'#defaultGo',
    events:{
        'click .default-margin button':'gotoHandler'
    },
    rawLoader:function(){
        return gotoHTML;
    },
    beforeMount:function(){},
    afterMount:function(){},
    ready:function(){
    },
    gotoHandler:function(e){
        let el = $(e.currentTarget);
        let id = el.attr('data-id');
        if (id) {
            window.router.navigate('list/'+id,{
                trigger:true
            });
        }
    }
});
module.exports = GotoView;
```

**Router**

```JavaScript
import base from 'base-extend-backbone';
import DefaultView from './view/default/main.view';
import ListView from './view/list/main.view'

const BaseRouter = base.Router;
const AppRouter = BaseRouter.extend({
    routes:{
        'index':'indexRouter',
        'list/:id':'listRouter'
    },
    indexRouter:function(){
        this.addLifeCycleHelper('index',DefaultView);
    },
    listRouter:function(id){
        this.addLifeCycleHelper('list-'+id,ListView,id);
    }
})
module.exports = {
    start:function(){
        window.router = new AppRouter
        Backbone.$ = window.$
        Backbone.history.start();
    }
}
```