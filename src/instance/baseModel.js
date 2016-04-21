/**
 * @time 2012年10月19日
 * @author icepy
 * @info 实现基础的模型类
 *
 * @time 2012年10月27日
 * @author icepy
 * @info 现实对请求进行本地缓存
 *
 * @time 2016年2月27日
 * @author icepy
 * @info 改造兼容webpack打包以及扩展Model
 *
 */


'use strict';
var Backbone = require('backbone')
var storage = require('../store/storage');
var Tools = require('../util/tools');
var warn = require('../util/warn');
var uid = 1314;
var expiration = storage.expiration;
var BaseModel = Backbone.Model.extend({
	initialize:function(options){
		if (_.isFunction(this.beforeEmit)) {
			this.beforeEmit(options);
		};
		this._url = this.url;
	},
	_ICEFetch:function(options){
		this.fetch(options);
	},
	_ICESave:function(HTTPBody,options){
		this.save(HTTPBody,options);
	},
	_ICEDestroy:function(options){
		this.destroy(options);
	},
	_ICEJSONP:function(parameter,options){
		$.ajax($.extend({
			url:this.url,
			data:parameter || {},
			dataType:'jsonp',
			jsonp:'callback'
		},options));
	},
	_ICESendHelper:function(message,defer){
		var self = this;
		if (message.url) {
			//如果存在url，将this的url替换
			this.url = message.url;
		};
		var options = {};
		options.beforeSend = function(xhr,setting){
			for(var key in this.headers){
				xhr.setRequestHeader(key,this.headers[key]);
			}
		};
		options.success = function(model,response,afterSetting){
			response = self._ICEProcessData(response);
			defer.resolve.call(model,response,afterSetting.xhr);
		}
		options.error = function(model,xhr){
			defer.reject.call(model,xhr);
		}
		switch(message.type){
			case 'POST':
				this._ICESave(message.HTTPBody,options);
				break;
			case 'PUT':
				var id = message.HTTPBody.id;
				if(!id && id !== 0){
					message.HTTPBody.id = 'icepy'+(uid++);
				};
				this._ICESave(message.HTTPBody,options);
				break;
			case 'DELETE':
				this._ICEDestroy(options);
				break;
			case 'JSONP':
				this._ICEJSONP(message.parameter,options);
				break;
			default:
				this._ICEFetch(options);
				break;
		}
	},
	_ICESendMessage:function(message,defer){
		var self = this;
		if (this.storageCache && this.expiration){
			if (!storage.enabled){
				this._ICESendHelper(message,defer);
			}else{
				var data = expiration.get(this.url);
				if (!data) {
					this._ICESendHelper(message,defer);
					return false;
				};
				setTimeout(function(){
					data = self._ICEProcessData(data,true);
					defer.reslove(data)
				},50);
			};
		}else{
			this._ICESendHelper(message,defer);
		};
	},
	_ICEProcessData:function(response,before){
		//如果自定义了formatter方法，先对数据进行格式化
		if (_.isFunction(this.formatter)) {
			response = this.formatter(response);
		};
		//如果开启了缓存，对数据源进行本地存储
		if (this.storageCache && this.expiration && !before) {
			if (storage.enabled){
				expiration.set(this.url,response,this.expiration);
			};
		};
		this.set(response);
		return response;
	},
	/**
	 * [execute GET请求简化版]
	 * @param  {[type]} success [description]
	 * @param  {[type]} error   [description]
	 * @return {[type]}         [description]
	 */
	execute:function(){
		var defer = $.Deferred();
		var message = {
			type:'GET'
		};
		var args = Tools.toArray(arguments);
		var g = args.splice(0,1)[0];
		if (Tools.isPlainObject(g)) {
			message = _.extend(message,g);
		}
		this._ICESendMessage(message,defer);
		return defer.promise();
	},
	/**
	 * [executeGET 发起GET请求]
	 * @param  {[type]} success [description]
	 * @param  {[type]} error   [description]
	 * @return {[type]}         [description]
	 */
	executeGET:function(){
		var message = {
			type:'GET'
		};
		return this.execute(message);
	},
	/**
	 * [executePOST 发起POST请求]
	 * @param  {[type]} HTTPBody [description]
	 * @param  {[type]} success  [description]
	 * @param  {[type]} error    [description]
	 * @return {[type]}          [description]
	 */
	executePOST:function(HTTPBody){
		var message = {
			type:'POST',
			HTTPBody:HTTPBody
		};
		return this.execute(message);
	},
	/**
	 * [executePUT 发起PUT请求]
	 * @param  {[type]} HTTPBody [description]
	 * @param  {[type]} success  [description]
	 * @param  {[type]} error    [description]
	 * @return {[type]}          [description]
	 */
	executePUT:function(HTTPBody){
		var message = {
			type:'PUT',
			HTTPBody:HTTPBody
		};
		return this.execute(message);
	},
	/**
	 * [executeDELETE 发起delete请求]
	 * @return {[type]} [description]
	 */
	executeDELETE:function(){
		var message = {
			type:'DELETE'
		};
		return this.execute(message);
	},
	/**
	 * [executeJSONP 发起JSONP跨域请求]
	 * @param  {[type]} success [description]
	 * @param  {[type]} error   [description]
	 * @return {[type]}         [description]
	 */
	executeJSONP:function(parameter){
		var message = {
			type:'JSONP',
			parameter:parameter
		};
		return this.execute(message);
	},
	/**
	 * [setChangeURL 辅助拼接URL参数]
	 * @param {[type]} parameter [description]
	 */
	setChangeURL:function(parameter){
		var url = ''
		if (!parameter) {
			return this.url;
		};
		for(var key in parameter){
			var value = parameter[key];
			if (!url.length) {
				url = this._url.replace('{{'+key+'}}',value);
			}else{
				url = url.replace('{{'+key+'}}',value);
			};
		};
		this.url = url;
	},
	/**
	 * [setHeaders 设置XHR 头信息]
	 * @param {[string|object]} headers [description]
	 */
	setHeaders:function(){
		if (!this.headers) {
			this.headers = {};
		};
		var args = Tools.toArray(arguments);
		if (args.length === 1) {
			var headers = args[0];
			for(var key in headers){
				this.headers[key] = headers[key];
			}
		}else{
			if (args.length) {
				var key = args[0];
				var value = args[1];
				this.headers[key] = value;
			}
		}
	},
	/**
	 * [setUpdateStorage 将实体数据更新到本地缓存]
	 * @return {[type]} [description]
	 */
	setUpdateStorage:function(){
		if (storage.enabled){
			expiration.set(self.url,this.manager.$get(),self.expiration);
		};
	}
});
module.exports = BaseModel;
