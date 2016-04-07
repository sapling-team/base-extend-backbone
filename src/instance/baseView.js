/**
 * @time 2012年10月19日
 * @author icepy
 * @info 完成基础的View类
 *
 * @time 2016年2月27日
 * @author icepy
 * @info 改造兼容webpack打包
 */

'use strict';

var Backbone = require('backbone');
var tplEng = require('tplEng');
var warn = require('../util/warn');
var Tools = require('../util/tools');
var error = require('../util/error');
var BaseView = Backbone.View.extend({
	initialize:function(options){
		//初始化参数
		this._ICEOptions = options || {};
		if (_.isFunction(this.beforeMount)){
			this.beforeMount();
		}else{
			warn('推荐使用beforeMount钩子方法，用来初始化自定义属性');
		};
		if (this._ICEOptions.id) {
			this.$el = $(this._ICEOptions.id);
		};
		this._ICEinit();
		return this;
	},
	_ICEinit:function(){
		if (_.isFunction(this.rawLoader)) {
			this._template = this.rawLoader();
			if (this._template) {
				this.$el.append(this._template);
			};
		}else{
			warn('推荐使用rawLoader钩子方法用来加载需要动态获取的模板');
		};
		if (typeof this.afterMount === 'function') {
			this.afterMount();
		}else{
			warn('推荐使用afterMount钩子方法，用来获取DOM对象');
		};
		this._ICEObject();
	},
	_ICEObject:function(){
		this._ICEinitNode();
		this.__YYTPC__ = true;
		if (_.isFunction(this.ready)) {
			this.ready(this._ICEOptions);
		}else{
			error('一个View对象周期内必须实现ready钩子方法');
		};
	},
	_ICEinitEvent:function(){
		this.delegateEvents(this.events);
	},
	_ICEinitNode:function(){
		var self = this;
		this.$parent = this._ICEOptions.parent;
		this.$children  = [];
		this.$root = this.$parent ? this.$parent.$root : this;
		if (this.$parent && this.$parent.__YYTPC__) {
			this.$parent.$children.push(this);
		};
		this.on('hook:context',function(){
			var args = Tools.toArray(arguments);
			if (self && self.__YYTPC__) {
				if (_.isFunction(self.context)) {
					self.context.apply(self,args);
				}else{
					warn('未定义context上下文钩子方法');
				};
			};
		});
	},
	_ICEDestroy:function(){
		//实例销毁之前
		if (_.isFunction(this.beforeDestroy)) {
			this.beforeDestroy();
		};
		this.remove();
		this.undelegate();
		//实例销毁之后
		if (_.isFunction(this.destroyed)) {
			this.destroyed();
		};
	},
	/**
	 * [triggerHook 触发父对象的Hook]
	 * @return {[type]} [description]
	 */
	triggerContextHook:function(){
		if (this.$parent && this.$parent.__YYTPC__) {
			var args = Tools.toArray(arguments);
			var event = args[0];
			if (_.isString(event)) {
				args[0] = 'hook:context';
			}else{
				args.splice(0,0,'hook:context');
			};
			switch (event) {
				case 'root':
						this.$root.trigger.apply(this.$root,args);
					break;
				default:
						this.$parent.trigger.apply(this.$parent,args);
					break;
			}
		}else{
			warn('在View实例对象初始化时未指明对象的结构关系');
		}
	},
	/**
	 * [findDOMNode 查找DOM节点]
	 * @param  {[type]} exprs [description]
	 * @return {[type]}       [description]
	 */
	findDOMNode:function(exprs){
		return this.$el && this.$el.find(exprs);
	},
	/**
	 * [compileHTML 编译模板]
	 * @param  {[type]} tplStr [description]
	 * @param  {[type]} data   [description]
	 * @return {[type]}        [description]
	 */
	compileHTML:function(tplStr,data){
		return tplEng.compile(tplStr)(data);
	},
	/**
	 * [broadcast 触发所有子组件相应的事件]
	 * @param  {[type]} event [description]
	 * @return {[type]}       [description]
	 */
	broadcast:function(){
		var args = Tools.toArray(arguments);
		var children = this.$children;
		var i = 0;
		var j = children.length;
		for(;i<j;i++){
			var child = children[i];
			var propagate = child.trigger.apply(child,args);
			if(propagate){
				child.broadcast.apply(child,args);
			};
		}
		return this;
	},
	/**
	 * [dispatch 触发所有父组件相应的事件]
	 * @param  {[type]} event [description]
	 * @return {[type]}       [description]
	 */
	dispatch:function(){
		var args = Tools.toArray(arguments);
		var parent = this.$parent;
		while(parent){
			parent.trigger.apply(parent,args);
			parent = parent.$parent;
		}
		return this;
	},
	/**
	 * [destroy 销毁实例]
	 * @return {[type]} [description]
	 */
	destroy:function(){
		this._ICEOptions = null;
		this.methods = null;
		this.props = null;
		this.state = null;
		this._store = null;
		this.$children.length = 0;
		this.$parent = null;
		this.$root = null;
		this._ICEDestroy();
	}
});

module.exports = BaseView;
