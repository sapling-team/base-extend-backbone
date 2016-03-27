/**
 * @time 2016年3月21日
 * @author icepy
 * @info 基于路由的生命周期
 */

'use strict'

var warn = require('../util/warn');
var stack = [];
var routerHash = {};
var curr = null;
var router = null;
var _win = window;
var routerHashTop = function(key) {
    return routerHash[key];
};
var routerHashRmove = function(key) {
    delete routerHash[key];
};
var Backbone = _win.Backbone;
if (!Backbone) {
    throw new Error("import Backbone");
};
var BaseRouter = Backbone.Router.extend({
    addLifeCycleHandler: function(name, view, parameter) {
        var top = routerHashTop(name);
        var stackCheckHandler = function() {
            if (curr) {
                //视图隐藏或者销毁之前
                if (_.isFunction(router.viewWillDisappear)) {
                    router.viewWillDisappear.call(curr);
                }else{
                    if (router.dealloc) {
                        warn('销毁实例{dealloc = true}之前必须存在viewWillDisappear，在此进行解除其他对象的引用或者调用（每个）destroy方法');
                    };
                };
                if (router.dealloc) {
                    //进入实例销毁流程
                    curr.destroy();
                    var obj = routerHashTop(curr._router);
                    if (obj) {
                        routerHashRmove(curr.router);
                        stack.splice(stack.indexOf(curr.cid), 1);
                        obj = null;
                    };
                };
                //视图隐藏或者销毁之后
                if (_.isFunction(router.viewDidDisappear)) {
                    router.viewDidDisappear.call(curr);
                };
            }
        }
        if (top) {
            stackCheckHandler();
            curr = null;
            curr = top;
            curr.trigger('viewWillAppear');
        } else {
            stackCheckHandler();
            curr = parameter ? new view({
                "parameter": parameter
            }) : new view();
            stack.push(curr.cid);
            curr._router = name;
            curr._didLoad = false; //记录viewDidLoad跟随路由呈现的生命周期状态
            router = curr.router;
            routerHash[name] = curr;
            //视图呈现的生命周期只会触发一次
            curr.once('viewDidLoad', function() {
                if (_.isFunction(router.viewDidLoad)) {
                    router.viewDidLoad.call(curr);
                }else{
                    warn('基于路由的Root Component，必须存在viewDidLoad钩子');
                };
                if (!curr._didLoad) {
                    curr._didLoad = true;
                    curr.trigger('viewDidAppear');
                };
            });
            //视图将要呈现之前
            curr.on('viewWillAppear', function() {
                if (_.isFunction(router.viewWillAppear)) {
                    router.viewWillAppear.call(curr);
                }else{
                    warn('基于路由的Root Component，必须存在viewWillAppear');
                };
                if (!curr._didLoad) {
                    //viewDidLoad事件还未触发
                    curr.trigger('viewDidLoad');
                }else{
                    curr.trigger('viewDidAppear');
                };
            });
            //视图已经呈现之后
            curr.on('viewDidAppear', function() {
                if (_.isFunction(router.viewDidAppear)) {
                    router.viewDidAppear.call(curr);
                }else{
                    warn('基于路由的Root Component，必须存在viewDidAppear');
                };
            });
            curr.trigger('viewWillAppear');
        }
        return curr;
    }
});
module.exports = BaseRouter;
