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
var Store = require('../store/locationStore');
var Config = require('config');
var Tools = require('../util/tools');
var warn = require('../util/warn');
var uid = 1314;
var expiration = Store.expiration;
var baseModelSort = [];
var env = Config.env[Config.scheme];
var BaseModel = Backbone.Model.extend({
	options:{},
	initialize:function(options){
		this._store = this.props || {};
		this._view = null;
		this._onQueue = [];
		this._original = null;
		this.parameter = null;
		if (_.isFunction(this.beforeEmit)) {
			this.beforeEmit(options);
		};
		this._url = this.url;
		if (!this.setEnv) { //默认使用内置{url_prefix}处理
			this._ICESetEnv();
		};
		if (_.isString(this.url)) {
			this.url = this.url.split('?')[0];
			this.hostname = this.url;
		};
	},
	_ICESetEnv:function(){
		if (/^\{{0,2}(url_prefix)\}{0,2}/.test(this.url)) {
			this.url = this.url.replace('{{url_prefix}}',env['url_prefix']);
			this._url = this.url
		}else{
			warn('你应该正确的配置{{url_prefix}}，在你的config.js文件中')
		}
	},
	_ICESort:function(data,fun){
		var n = data.length;
		if (n < 2) {
			return data;
		};
		var i = 0;
		var j = i+1;
		var logic,temp,key;
		for(;i<j;i++){
			for(j = i+1;j<n;j++){
				logic = fun.call(this,data[i],data[j]);
				key = (typeof logic === 'number' ? logic : !!logic ? 1 : 0) > 0 ? true : false;
				if (key) {
					temp = data[i];
					data[i] = data[j];
					data[j] = temp;
				}
			}
		}
		return data;
	},
	_ICEOptions:function(){
		var self = this;
		return {
			beforeSend:function(xhr,model){
				for(var setHeaderKey in self.headers){
					xhr.setRequestHeader(setHeaderKey,self.headers[setHeaderKey]);
				}
			}
		}
	},
	_ICEFetch:function(success,error){
		var self = this;
		var options = _.extend(this._ICEOptions(),this.options);
		this.fetch(_.extend({
			success:function(model,response) {
				response = self._ICEProcessData(response);
				if (_.isFunction(success)) {
					success.call(self,response);
				};
			},
			error:function(model,e){
				if (_.isFunction(error)) {
					error.call(self,e);
				};
			}
		},options));
	},
	_ICESave:function(saveJSON,success,error){
		var self = this;
		var options = _.extend(this._ICEOptions(),this.options);
		this.save(saveJSON,_.extend({
			success:function(model,response){
				response = self._ICEProcessData(response);
				if (_.isFunction(success)) {
					success.call(self,response);
				}
			},
			error:function(model,e){
				if (_.isFunction(error)) {
					error.call(self,e);
				};
			}
		},options));
	},
	_ICEDestroy:function(success,error){
		var self = this;
		this.destroy({
			success:function(model,response){
				if (_.isFunction(success)) {
					success.call(self,response);
				};
			},
			error:function(model,e){
				if (_.isFunction(error)) {
					error.call(self,e);
				};
			}
		});
	},
	_ICEJSONP:function(success,error){
		var self = this;
		var jsonpXHR = $.ajax({
			url:this.url,
			data:this.parameter || {},
			dataType:'jsonp',
			jsonp:'callback'
		});
		jsonpXHR.done(function(response,state,xhr){
			response = self._ICEProcessData(response);
			if (_.isFunction(success)) {
				success.call(self,response,state,xhr);
			};
		});
		jsonpXHR.fail(function(xhr,state,errors){
			if (_.isFunction(error)) {
				error.call(self,xhr,state,errors);
			};
		});
	},
	_ICESendHelper:function(message){
		var success = message.success;
		var error = message.error;
		if (message.type !== 'GET') {
			this.url = this.hostname;
		};
		switch(message.type){
			case 'POST':
				this._ICESave(message.saveJSON,success,error);
				break;
			case 'PUT':
				var id = message.saveJSON.id;
				if(!id && id !== 0){
					message.saveJSON.id = 'icepy'+(uid++);
				};
				this._ICESave(message.saveJSON,success,error);
				break;
			case 'DELETE':
				this._ICEDestroy(success,error);
				break;
			case 'JSONP':
				this._ICEJSONP(success,error);
				break;
			default:
				this._ICEFetch(success,error);
				break;
		}
	},
	_ICESendMessage:function(message){
		var self = this;
		if (this.storageCache && this.expiration){
			if (!Store.enabled){
				this._ICESendHelper(message);
			}else{
				var data = expiration.get(this.url);
				if (!data) {
					this._ICESendHelper(message);
					return false;
				};
				var success = message.success;
				if (_.isFunction(success)) {
					setTimeout(function(){
						data = self._ICEProcessData(data,true);
						success.call(self,data);
					},50);
				}
			};
		}else{
			this._ICESendHelper(message);
		};
	},
	_ICEProcessData:function(response,before){
		//如果自定义了formatter方法，先对数据进行格式化
		if (_.isFunction(this.formatter)) {
			response = this.formatter(response);
		};
		//如果开启了缓存，对数据源进行本地存储
		if (this.storageCache && this.expiration && !before) {
			if (Store.enabled){
				expiration.set(this.url,response,this.expiration);
			};
		};
		this.$set(response);
		return response;
	},
	/**
	 * [execute GET请求简化版]
	 * @param  {[type]} success [description]
	 * @param  {[type]} error   [description]
	 * @return {[type]}         [description]
	 */
	execute:function(success,error){
		var message = {
			type:'GET',
			success:success,
			error:error
		};
		this._ICESendMessage(message);
	},
	/**
	 * [executeGET 发起GET请求]
	 * @param  {[type]} success [description]
	 * @param  {[type]} error   [description]
	 * @return {[type]}         [description]
	 */
	executeGET:function(success,error){
		var message = {
			type:'GET',
			success:success,
			error:error
		};
		this._ICESendMessage(message);
	},
	/**
	 * [executePOST 发起POST请求]
	 * @param  {[type]} saveJSON [description]
	 * @param  {[type]} success  [description]
	 * @param  {[type]} error    [description]
	 * @return {[type]}          [description]
	 */
	executePOST:function(saveJSON,success,error){
		var message = {
			type:'POST',
			saveJSON:saveJSON,
			success:success,
			error:error
		};
		this._ICESendMessage(message);
	},
	/**
	 * [executePUT 发起PUT请求]
	 * @param  {[type]} saveJSON [description]
	 * @param  {[type]} success  [description]
	 * @param  {[type]} error    [description]
	 * @return {[type]}          [description]
	 */
	executePUT:function(saveJSON,success,error){
		var message = {
			type:'PUT',
			saveJSON:saveJSON,
			success:success,
			error:error
		};
		this._ICESendMessage(message);
	},
	/**
	 * [executeDELETE 发起delete请求]
	 * @return {[type]} [description]
	 */
	executeDELETE:function(){
		var message = {
			type:'DELETE',
			success:success,
			error:error
		};
		this._ICESendMessage(message);
	},
	/**
	 * [executeJSONP 发起JSONP跨域请求]
	 * @param  {[type]} success [description]
	 * @param  {[type]} error   [description]
	 * @return {[type]}         [description]
	 */
	executeJSONP:function(parameter,success,error){
		this.parameter = null;
		this.parameter = parameter;
		var message = {
			type:'JSONP',
			success:success,
			error:error
		};
		this._ICESendMessage(message);
	},
	/**
	 * [setChangeURL 辅助拼接URL参数]
	 * @param {[type]} parameter [description]
	 */
	setChangeURL:function(parameter){
		var url = ''
		if (!parameter) {
			return;
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
	 * @param {[type]} headers [description]
	 */
	setHeaders:function(headers){
		this.headers = null;
		this.headers = headers;
	},
	/**
	 * [setView 设置view-model关系]
	 * @param {[type]} view [description]
	 */
	setView:function(view){
		this._view = view;
	},
	/**
	 * [setOnQueueKeys 设置订阅的渲染事件名队列]
	 * @param {[type]} value [description]
	 */
	setOnQueueKeys:function(value){
		if (!_.isArray(value)) {
			warn('需要传入一个事件keys');
		}else{
			this._onQueue.length = 0;
			this._onQueue = value;
		}
	},
	/**
	 * [$get 从模型获取数据]
	 * @param  {[type]} expression [description]
	 * @return {[type]}            [description]
	 */
	$get:function(expression){
		if (!expression) {
			return this._store;
		}
		var attrNodes = expression.split('.');
		var lh = attrNodes.length;
		if (lh > 0) {
			var node = attrNodes[0];
			var i = 0;
			var store = this._store;
			while(node){
				i++
				store = store[node];
				node = attrNodes[i];
			}
			return store;
		}
	},
	/**
	 * [$set 向模型设置新的数据]
	 * @param {[type]} expression [description]
	 * @param {[type]} value      [description]
	 */
	$set:function(expression,value,options){
		if (expression == null) {
			return this;
		};
		if (Tools.isPlainObject(expression)) {
			this._store = null;
			this._store = expression;
			this.set(this._store);
			return false;
		}
		var attrNodes = expression.split('.');
		var lh = attrNodes.length;
		if (lh > 0) {
			var i = 0;
			var node = attrNodes[i];
			var store = this._store;
			if (lh !== 1) {
				while(node){
					i++
					store = store[node];
					node = attrNodes[i];
					if (i > (lh - 2)) {
						break;
					}
				}
			}
			switch(Tools.toType(store)){
				case '[object Object]':
					store[node] = value;
					break;
				case '[object Array]':
					store[Tools.exportToNumber(node)] = value;
					break;
				default:
					store = value;
					break;
			};
			this.set(this._store);
			// if (this._view && this._view.__YYTPC__) {
			//  	var j = this._onQueue.length;
			//  	while(j--){
			//  		this._view.trigger(this._onQueue[j]);
			//  	}
			// }
		}
	},
	/**
	 * [$filter 对_store数据进行筛选]
	 * @param  {[type]} expression [description]
	 * @param  {[type]} value      [description]
	 * @return {[type]}            [description]
	 */
	$filter:function(expression,value){
		//arguments
		var data = this.$get(expression);
		var result = [];
		if (_.isArray(data)) {
			var i = data.length;
			var n;
			while(i--){
				var val = data[i];
				switch(Tools.toType(value)){
					case '[object Object]':
						n = true;
						for(var k in value){
							if (!(val[k] === value[k])) {
								n = null;
								break;
							}
						}
						break
					case '[object Function]':
						n = value(val,i);
						break
					default:
						n = (val === value);
						break
				}
				if (n) {
					result.push(val)
				}
			};
		};
		return result;
	},
	/**
	 * [$sort 对_store中的数据进行排序]
	 * @param  {[type]} expression [description]
	 * @param  {[type]} value      [description]
	 * @return {[type]}            [description]
	 */
	$sort:function(expression,value){
		//arguments
		// > 大于 true
		// < 小于 false
		// items.id
		var data = this.$get(expression);
		baseModelSort.length = 0;
		if (_.isArray(data)) {
			switch(Tools.toType(value)){
				case '[object Function]':
					baseModelSort = this._ICESort(data,value)
					break
				default:
					if (typeof value === 'string') {
						var attrNodes = value.split('.');
						var logic = null;
						var lh = attrNodes.length - 1;
						switch(attrNodes[lh]){
							case '>':
								logic = true;
								break
							case '<':
								logic = false;
								break
							default:
								return baseModelSort;
								break
						};
						if (logic !== null) {
							return this._ICESort(data,function(val1,val2){
								var node = attrNodes[0];
								var i = 0;
								while(node){
									val1 = val1[node];
									val2 = val2[node];
									i++
									if (i === lh) {
										break;
									};
									node = attrNodes[i];
								}
								if (logic) {
									return val1 > val2;
								}else{
									return val1 < val2;
								};
							});
						}

					};
					break
			}
		};
		return baseModelSort;
	},
	/**
	 * [$updateStore 将_store数据进行更新]
	 * @return {[type]} [description]
	 */
	$updateStore:function(){
		if (Store.enabled){
			expiration.set(self.url,this._store,self.expiration);
		};
	}
});
module.exports = BaseModel;
