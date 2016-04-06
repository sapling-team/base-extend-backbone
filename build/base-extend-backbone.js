/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var BaseView = __webpack_require__(1);
	var BaseModel = __webpack_require__(8);
	var BaseRouter = __webpack_require__(8);
	var ManagedObject = __webpack_require__(9);
	module.exports = {
	    'View':BaseView,
	    'Model':BaseModel,
	    'Router':BaseRouter,
	    'ManagedObject':ManagedObject
	};


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

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
	
	var Backbone = __webpack_require__(2);
	var tplEng = __webpack_require__(3);
	var warn = __webpack_require__(4);
	var tools = __webpack_require__(7);
	var error = __webpack_require__(6).error;
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
				var args = tools.toArray(arguments);
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
		triggerParentHook:function(){
			if (this.$parent && this.$parent.__YYTPC__) {
				var args = tools.toArray(arguments);
				var event = args[0];
				if (_.isString(event)) {
					event = 'hook:'+ event;
					args[0] = event;
				}else{
					args.splice(0,0,'hook:context');
				};
				this.$parent.trigger.apply(this.$parent,args);
			}else{
				warn('在View实例对象初始化时未指明对象的结构关系');
			}
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
		broadcast:function(event){
			var args = tools.toArray(arguments);
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
		dispatch:function(event){
			var args = tools.toArray(arguments);
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


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = window.Backbone;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = window.artTemplate;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @time 2012年10月26日
	 * @author icepy
	 * @info 完成warn包装
	 */
	
	'use strict';
	
	var Config = __webpack_require__(5);
	var Debug = __webpack_require__(6);
	
	var warn = function(msg,e){
		if (Config.debug) {
			Debug.warn(msg,e)
		}
	}
	module.exports = warn;


/***/ },
/* 5 */
/***/ function(module, exports) {

	var config = {
	    scheme: 'alpha',
	    env:{
	        alpha:{
	            'url_prefix':'http://127.0.0.1:8081'
	        },
	        beta:{
	            'url_prefix':'http://beta.com:8081'
	        },
	        release:{
	            'url_prefix':'http://aip.com'
	        }
	    },
	    debug:true
	};
	module.exports = config;


/***/ },
/* 6 */
/***/ function(module, exports) {

	/**
	 * @time 2012年10月26日
	 * @author icepy
	 * @info debug信息打印
	 */
	
	'use strict';
	
	var debug = {}
	debug.warn = function(msg,e){
		var hasConsole = typeof console !== undefined;
		if (hasConsole) {
			console.warn('[YYT PC Warning]:'+ msg);
			if (e) {
				throw e;
			}else{
				var warning = new Error('Warning Stack Trace');
				console.warn(warning.stack);
			}
		};
		return hasConsole;
	};
	debug.error = function(msg){
		var error = new Error(msg);
		throw error.stack;
	};
	module.exports = debug;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * @time 2012年10月26日
	 * @author icepy
	 * @info 完成处理tools对象
	 */
	
	'use strict';
	
	(function (factory) {
	    var root = (typeof self == 'object' && self.self == self && self) ||
	        (typeof global == 'object' && global.global == global && global);
	    if (true) {
	        module.exports = factory();
	    } else if (typeof exports === 'object') {
	        exports['tools'] = factory()
	    } else {
	        if (!root.ICEPlugs) {
	            root.ICEPlugs = {};
	        }
	        root.ICEPlugs.tools = factory();
	    }
	})(function () {
	    var tools = {};
	    var toString = Object.prototype.toString;
	    var OBJECT_TYPE = '[object Object]';
	    /**
	     * [isPlainObject 判断是否为普通对象]
	     * @param  {[Object]}  obj [对象]
	     * @return {Boolean}
	     */
	    tools.isPlainObject = function (obj) {
	        return toString.call(obj) === OBJECT_TYPE;
	    };
	    /**
	     * [isObject 判断是否为对象]
	     * @param  {[*]}  obj [任意一个元素]
	     * @return {Boolean}
	     */
	    tools.isObject = function (obj) {
	        return obj !== null && typeof obj === 'object';
	    };
	    var hasOwnProperty = Object.prototype.hasOwnProperty;
	    /**
	     * [hasOwn 检查对象是否为自身的属性]
	     * @param  {[Object]}  obj [description]
	     * @param  {[String]}  key [description]
	     * @return {Boolean}     [description]
	     */
	    tools.hasOwn = function (obj, key) {
	        return hasOwnProperty.call(obj, key);
	    };
	    /**
	     * [toArray 类数组对象转数组]
	     * @param  {[Array-like]} list  [类数组]
	     * @param  {[Number]} index [起始索引]
	     * @return {[Array]}       [返回一个新的真实数组]
	     */
	    tools.toArray = function (list, index) {
	        index = index || 0;
	        var i = list.length - index;
	        var _array = new Array(i);
	        while (i--) {
	            _array[i] = list[i + index];
	        }
	        return _array;
	    };
	    /**
	     * [toType 导出类型字符串]
	     * @param  {[type]} value [description]
	     * @return {[type]}       [description]
	     */
	    tools.toType = function (value) {
	        return toString.call(value);
	    };
	    /**
	     * [exportToNumber 导出数字]
	     * @param  {[*]} value [description]
	     * @return {[*|Number]}       [description]
	     */
	    tools.exportToNumber = function (value) {
	        if (typeof value !== 'string') {
	            return value;
	        } else {
	            var number = Number(value);
	            return isNaN(number) ? value : number;
	        }
	    };
	
	    /**
	     * [isArray 判断是否为数组]
	     * @param  {*} value [description]
	     * @return {Boolean}       [description]
	     */
	    tools.isArray = function(obj){
	        return tools.toType(obj) === '[object Array]';
	    };
	
	    /**
	     * [mergeData 合并数据]
	     * @param  {obj} value [description]
	     * @param  {obj} value [description]
	     * @return {obj}       [description]
	     */
	    tools.mergeData = function(to,from){
	        var key,toVal,fromVal;
	        for(key in from){
	            toVal = to[key];
	            fromVal = from[key];
	            if (tools.isPlainObject(toVal) && tools.isPlainObject(fromVal)) {
	                tools.mergeData(toVal,fromVal);
	            }
	        }
	        return to;
	    };
	    return tools;
	});
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @time 2016年3月21日
	 * @author icepy
	 * @info 基于路由的生命周期
	 */
	
	'use strict'
	
	var Backbone = __webpack_require__(2);
	var warn = __webpack_require__(4);
	var stack = [];
	var routerHash = {};
	var curr = null;
	var router = null;
	var routerHashTop = function(key) {
	    return routerHash[key];
	};
	var routerHashRmove = function(key) {
	    delete routerHash[key];
	};
	var BaseRouter = Backbone.Router.extend({
	    addLifeCycleHelper: function(name, view, parameter) {
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
	                '$parameter': parameter
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


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @time 2016年3月29日
	 * @author icepy
	 * @info 实体管理类
	 */
	var Tools = __webpack_require__(7);
	var baseModelSort = [];
	
	var ManagedObject = function(options){
	    options = options || {};
	    this.entity = options.entity || {};
	};
	
	ManagedObject.prototype.$update = function(obj){
	    var entity = _.extend(this.entity,obj);
	    this.entity = null;
	    this.entity = entity;
	};
	/**
	 * [$get 从实体中获取数据，无参将返回所有数据，参数使用.结构化表达式（this.$get('items.0.id')）]
	 * @param  {[type]} expression [description]
	 * @return {[type]}            [description]
	 */
	ManagedObject.prototype.$get = function(expression){
	    if (!expression) {
	        return this.entity;
	    }
	    var attrNodes = expression.split('.');
	    var lh = attrNodes.length;
	    if (lh > 0) {
	        var node = attrNodes[0];
	        var i = 0;
	        var entity = this.entity;
	        while(node){
	            i++
	            entity = entity[node];
	            node = attrNodes[i];
	        }
	        return entity;
	    }
	};
	/**
	 * [$set 向实体内部更新数据，以key/value的方式，第一个参数使用结构化表达式，第二个参数可以是任意类型的数据]
	 * @param {[type]} expression [description]
	 * @param {[type]} value      [description]
	 */
	ManagedObject.prototype.$set = function(expression,value,options){
	    if (expression === null || expression === undefined) {
	        return this;
	    };
	    if (Tools.isPlainObject(expression)) {
	        this.entity = null;
	        this.entity = expression;
	        return this.entity;
	    };
	    var attrNodes = expression.split('.');
	    var lh = attrNodes.length;
	    if (lh > 0) {
	        var i = 0;
	        var node = attrNodes[i];
	        var entity = this.entity;
	        if (lh !== 1) {
	            while(node){
	                i++
	                entity = entity[node];
	                node = attrNodes[i];
	                if (i > (lh - 2)) {
	                    break;
	                }
	            }
	        }
	        switch(Tools.toType(entity)){
	            case '[object Object]':
	                entity[node] = value;
	                break;
	            case '[object Array]':
	                entity[Tools.exportToNumber(node)] = value;
	                break;
	            default:
	                entity = value;
	                break;
	        };
	    }
	};
	/**
	 * [$filter 向实体内部的某项数据进行筛选，第一个参数是要筛选数据的.结构化表达式，第二个参数是筛选根据]
	 * @param  {[type]} expression [description]
	 * @param  {[type]} value      [description]
	 * @return {[type]}            [description]
	 */
	ManagedObject.prototype.$filter = function(expression,value){
	    var data = this.$get(expression);
	    var result = [];
	    if (Tools.isArray(data)) {
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
	            };
	            if (n) {
	                result.push(val)
	            };
	        };
	    };
	    return result;
	};
	/**
	 * [$sort 对实体内部的某项数据进行排序，第二个参数是要排序数据的.结构化表达式，第二个参数是排序的根据]
	 * @param  {[type]} expression [description]
	 * @param  {[type]} value      [description]
	 * @return {[type]}            [description]
	 */
	ManagedObject.prototype.$sort = function(expression,value){
	    // > 大于 true
	    // < 小于 false
	    var data = this.$get(expression);
	    baseModelSort.length = 0;
	    if (Tools.isArray(data)) {
	        switch(Tools.toType(value)){
	            case '[object Function]':
	                baseModelSort = this._sort(data,value)
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
	                        return this._sort(data,function(val1,val2){
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
	};
	
	ManagedObject.prototype._sort = function(data,fun){
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
	};
	
	module.exports = ManagedObject;


/***/ }
/******/ ]);
//# sourceMappingURL=base-extend-backbone.js.map