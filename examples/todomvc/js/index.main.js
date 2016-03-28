webpackJsonp([0,1],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _index = __webpack_require__(1);
	
	var _index2 = _interopRequireDefault(_index);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	_index2.default.start();
	
	__webpack_require__(18);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _BaseRouter = __webpack_require__(2);
	
	var _BaseRouter2 = _interopRequireDefault(_BaseRouter);
	
	var _setting = __webpack_require__(6);
	
	var _setting2 = _interopRequireDefault(_setting);
	
	var _list = __webpack_require__(7);
	
	var _list2 = _interopRequireDefault(_list);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var WINDOW = window;
	var BACKBONE = WINDOW.Backbone;
	
	if (!BACKBONE) {
	    throw new Error('import Backbone now!!~');
	}
	var AppRouter = _BaseRouter2.default.extend({
	    routes: {
	        'index': 'indexRouter',
	        'setting/:id': 'settingRouter'
	    },
	    indexRouter: function indexRouter() {
	        this.addLifeCycleHelper('index', _list2.default);
	    },
	    settingRouter: function settingRouter(id) {
	        this.addLifeCycleHelper('setting-' + id, _setting2.default, id);
	    }
	});
	module.exports = {
	    start: function start() {
	        WINDOW.router = new AppRouter();
	        BACKBONE.$ = window.$;
	        Backbone.history.start();
	    }
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @time 2016年3月21日
	 * @author icepy
	 * @info 基于路由的生命周期
	 */
	
	'use strict';
	
	var Backbone = __webpack_require__(20);
	var warn = __webpack_require__(3);
	var stack = [];
	var routerHash = {};
	var curr = null;
	var router = null;
	var routerHashTop = function routerHashTop(key) {
	    return routerHash[key];
	};
	var routerHashRmove = function routerHashRmove(key) {
	    delete routerHash[key];
	};
	var BaseRouter = Backbone.Router.extend({
	    addLifeCycleHelper: function addLifeCycleHelper(name, view, parameter) {
	        var top = routerHashTop(name);
	        var stackCheckHandler = function stackCheckHandler() {
	            if (curr) {
	                //视图隐藏或者销毁之前
	                if (_.isFunction(router.viewWillDisappear)) {
	                    router.viewWillDisappear.call(curr);
	                } else {
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
	        };
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
	            curr.once('viewDidLoad', function () {
	                if (_.isFunction(router.viewDidLoad)) {
	                    router.viewDidLoad.call(curr);
	                } else {
	                    warn('基于路由的Root Component，必须存在viewDidLoad钩子');
	                };
	                if (!curr._didLoad) {
	                    curr._didLoad = true;
	                    curr.trigger('viewDidAppear');
	                };
	            });
	            //视图将要呈现之前
	            curr.on('viewWillAppear', function () {
	                if (_.isFunction(router.viewWillAppear)) {
	                    router.viewWillAppear.call(curr);
	                } else {
	                    warn('基于路由的Root Component，必须存在viewWillAppear');
	                };
	                if (!curr._didLoad) {
	                    //viewDidLoad事件还未触发
	                    curr.trigger('viewDidLoad');
	                } else {
	                    curr.trigger('viewDidAppear');
	                };
	            });
	            //视图已经呈现之后
	            curr.on('viewDidAppear', function () {
	                if (_.isFunction(router.viewDidAppear)) {
	                    router.viewDidAppear.call(curr);
	                } else {
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
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @time 2012年10月26日
	 * @author icepy
	 * @info 完成warn包装
	 */
	
	'use strict';
	
	var Config = __webpack_require__(4);
	var Debug = __webpack_require__(5);
	
	var warn = function warn(msg, e) {
	  if (Config.debug) {
	    Debug.warn(msg, e);
	  }
	};
	module.exports = warn;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	var CONFIG = {
		scheme: 'alpha',
		env: {
			alpha: {
				'url_prefix': 'http://127.0.0.1:3000'
				// 'url_prefix':'http://icepy.yinyuetai.com:4000'
			},
			beta: {
				'url_prefix': 'http://beta.com'
			},
			release: {
				'url_prefix': ''
			}
		},
		debug: true
	};
	module.exports = CONFIG;

/***/ },
/* 5 */
/***/ function(module, exports) {

	/**
	 * @time 2012年10月26日
	 * @author icepy
	 * @info debug信息打印
	 */
	
	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var debug = {};
	debug.warn = function (msg, e) {
		var hasConsole = (typeof console === 'undefined' ? 'undefined' : _typeof(console)) !== undefined;
		if (hasConsole) {
			console.warn('[YYT PC Warning]:' + msg);
			if (e) {
				throw e;
			} else {
				var warning = new Error('Warning Stack Trace');
				console.warn(warning.stack);
			}
		};
		return hasConsole;
	};
	debug.error = function (msg) {
		var error = new Error(msg);
		throw error.stack;
	};
	module.exports = debug;

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _BaseView = __webpack_require__(8);
	
	var _BaseView2 = _interopRequireDefault(_BaseView);
	
	var _create = __webpack_require__(12);
	
	var _create2 = _interopRequireDefault(_create);
	
	var _index = __webpack_require__(14);
	
	var _index2 = _interopRequireDefault(_index);
	
	var _create3 = __webpack_require__(15);
	
	var _create4 = _interopRequireDefault(_create3);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var IndexView = _BaseView2.default.extend({
	    el: '#container',
	    rawLoader: function rawLoader() {
	        return _index2.default;
	    },
	    beforeMount: function beforeMount() {},
	    afterMount: function afterMount() {},
	    ready: function ready() {
	        var props = {
	            'items': []
	        };
	        var state = {
	            'default': 0
	        };
	        var create = new _create2.default({
	            methods: {},
	            props: props,
	            state: state,
	            parent: this
	        });
	        this.on('render', function () {});
	        console.log(create);
	        var model = new _create4.default();
	        model.setView(this);
	        model.setOnQueueKeys(['render']);
	        model.execute(function (response) {
	            console.log('$get items', this.$get('items'));
	            console.log('$get debug', this.$get('debug'));
	            console.log('$get trace.warn', this.$get('trace.warn'));
	            this.$set('trace.warn', { 'msg': 'msg' });
	            console.log('$get 全部的数据', this.$get());
	            var id1 = this.$filter('items', { "id": 1 });
	            console.log('$filter id=1', id1);
	            var id2 = this.$filter('items', function (v, i) {
	                if (v.id == 2) {
	                    return true;
	                }
	            });
	            console.log('$filter id=2', id2);
	            var icepy = this.$filter('items2', 'icepy');
	            console.log('$filter icepy', icepy);
	            var sort1 = this.$sort('items', 'id.<');
	            console.log('降序', sort1);
	            var sort2 = this.$sort('items', 'id.>');
	            console.log('升序', sort2);
	            var sort3 = this.$sort('items', function () {
	                return true;
	            });
	        }, function () {});
	    },
	    router: {
	        dealloc: true,
	        viewDidLoad: function viewDidLoad() {},
	        viewWillAppear: function viewWillAppear() {},
	        viewDidAppear: function viewDidAppear() {}
	    }
	});
	
	module.exports = IndexView;

/***/ },
/* 8 */
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
	
	var Backbone = __webpack_require__(20);
	var warn = __webpack_require__(3);
	var tools = __webpack_require__(10);
	var error = __webpack_require__(5).error;
	var BaseView = Backbone.View.extend({
		initialize: function initialize(options) {
			//初始化参数
			this._ICEOptions = options || {};
	
			if (_.isFunction(this.beforeMount)) {
				this.beforeMount();
			} else {
				warn('推荐使用beforeMount钩子方法，用来初始化自定义属性');
			};
			if (this._ICEOptions.id) {
				this.$el = $(this._ICEOptions.id);
			};
			this._ICEinit();
			return this;
		},
		_ICEinit: function _ICEinit() {
			if (_.isFunction(this.rawLoader)) {
				this._template = this.rawLoader();
				if (this._template) {
					this.$el.append(this._template);
				};
			} else {
				warn('推荐使用rawLoader钩子方法用来加载需要动态获取的模板');
			};
			if (typeof this.afterMount === 'function') {
				this.afterMount();
			} else {
				warn('推荐使用afterMount钩子方法，用来获取DOM对象');
			};
			this._ICEObject();
		},
		_ICEObject: function _ICEObject() {
			this._ICEinitNode();
			this._store = {};
			this.__YYTPC__ = true;
			this.$props = this._ICEOptions.props || {};
			this.$state = this._ICEOptions.state || {};
			this.$methods = this._ICEOptions.methods || {};
			if (_.isFunction(this.ready)) {
				this.ready(this._ICEOptions);
			} else {
				error('一个View对象周期内必须实现ready钩子方法');
			};
		},
		_ICEinitEvent: function _ICEinitEvent() {
			this.delegateEvents(this.events);
		},
		_ICEinitNode: function _ICEinitNode() {
			this.$parent = this._ICEOptions.parent;
			this.$children = [];
			this.$root = this.$parent ? this.$parent.$root : this;
			if (this.$parent) {
				this.$parent.$children.push(this);
			};
		},
		_ICEDestroy: function _ICEDestroy() {
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
	  * [broadcast 触发所有子组件相应的事件]
	  * @param  {[type]} event [description]
	  * @return {[type]}       [description]
	  */
		broadcast: function broadcast(event) {
			var args = tools.toArray(arguments);
			var children = this.$children;
			var i = 0;
			var j = children.length;
			for (; i < j; i++) {
				var child = children[i];
				var propagate = child.trigger.apply(child, args);
				if (propagate) {
					child.broadcast.apply(child, args);
				};
			}
			return this;
		},
		/**
	  * [dispatch 触发所有父组件相应的事件]
	  * @param  {[type]} event [description]
	  * @return {[type]}       [description]
	  */
		dispatch: function dispatch(event) {
			var args = tools.toArray(arguments);
			var parent = this.$parent;
			while (parent) {
				parent.trigger.apply(parent, args);
				parent = parent.$parent;
			}
			return this;
		},
		/**
	  * [destroy 销毁实例]
	  * @return {[type]} [description]
	  */
		destroy: function destroy() {
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
/* 9 */,
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, module) {/**
	 * @time 2012年10月26日
	 * @author icepy
	 * @info 完成处理tools对象
	 */
	
	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	(function (factory) {
	    var root = (typeof self === 'undefined' ? 'undefined' : _typeof(self)) == 'object' && self.self == self && self || (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global.global == global && global;
	    if (( false ? 'undefined' : _typeof(exports)) === 'object' && ( false ? 'undefined' : _typeof(module)) === 'object') {
	        module.exports = factory();
	    } else if (( false ? 'undefined' : _typeof(exports)) === 'object') {
	        exports['tools'] = factory();
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
	        return obj !== null && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
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
	    return tools;
	});
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(11)(module)))

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _BaseView = __webpack_require__(8);
	
	var _BaseView2 = _interopRequireDefault(_BaseView);
	
	var _create = __webpack_require__(13);
	
	var _create2 = _interopRequireDefault(_create);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var items = ['点击→播放专题页呈现，包括两侧挂幅前贴片', 'MV播放', '核心模块'];
	var CreateView = _BaseView2.default.extend({
	    el: '#list',
	    beforeMount: function beforeMount() {},
	    afterMount: function afterMount() {
	        this.listContainer = this.$el.find('.am-list');
	    },
	    ready: function ready() {
	        this.initRender();
	    },
	    initRender: function initRender() {
	        var html = this.compileHTML(_create2.default, { 'items': items });
	        this.listContainer.html(html);
	    },
	    destroyed: function destroyed() {
	        console.log(this);
	    },
	    beforeDestroy: function beforeDestroy() {
	        this.listContainer = null; //谁引用谁释放
	    }
	});
	
	module.exports = CreateView;

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = "{{each items as item i}}\r\n    <li><a href=\"#\">{{item}}</a></li>\r\n{{/each}}\r\n"

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = "<div id=\"indexId\" class=\"am-container\">\r\n    <header class=\"header\">\r\n        <span class=\"title\">@icepy Test Todo App</span>\r\n    </header>\r\n    <div id=\"list\" class=\"content\">\r\n        <ul class=\"am-list\">\r\n\r\n        </ul>\r\n    </div>\r\n    <footer class=\"footer\">\r\n        <span class=\"title\">@YYT PC Demo</span>\r\n    </footer>\r\n</div>\r\n"

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @time {时间}
	 * @author {编写者}
	 * @info {实现的功能}
	 */
	
	'use strict';
	
	var BaseModel = __webpack_require__(16);
	
	var Model = BaseModel.extend({
		url: '{{url_prefix}}/examples/todomvc/mock/default.json', //填写请求地址
		beforeEmit: function beforeEmit(options) {
			// 如果需要开启对请求数据的本地缓存，可将下列两行注释去掉
			// this.storageCache = true; //开启本地缓存
			// this.expiration = 2; //设置缓存过期时间（1表示60*60*1000 一小时）
		},
		props: {}
		// formatter:function(response){
		//		//formatter方法可以格式化数据
		// }
	});
	var shared = null;
	Model.sharedInstanceModel = function () {
		if (!shared) {
			shared = new Model();
		}
		return shared;
	};
	module.exports = Model;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

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
	
	var Backbone = __webpack_require__(20);
	var Store = __webpack_require__(17);
	var Config = __webpack_require__(4);
	var Tools = __webpack_require__(10);
	var warn = __webpack_require__(3);
	var uid = 1314;
	var expiration = Store.expiration;
	var baseModelSort = [];
	var env = Config.env[Config.scheme];
	var BaseModel = Backbone.Model.extend({
		options: {},
		initialize: function initialize(options) {
			this._store = {};
			this._view = null;
			this._onQueue = [];
			this._original = null;
			this.parameter = null;
			if (_.isFunction(this.beforeEmit)) {
				this.beforeEmit(options);
			};
			this._url = this.url;
			if (!this.setEnv) {
				//默认使用内置{url_prefix}处理
				this._ICESetEnv();
			};
			if (_.isString(this.url)) {
				this.url = this.url.split('?')[0];
				this.hostname = this.url;
			};
		},
		_ICESetEnv: function _ICESetEnv() {
			if (/^\{{0,2}(url_prefix)\}{0,2}/.test(this.url)) {
				this.url = this.url.replace('{{url_prefix}}', env['url_prefix']);
				this._url = this.url;
			} else {
				warn('你应该正确的配置{{url_prefix}}，在你的config.js文件中');
			}
		},
		_ICESort: function _ICESort(data, fun) {
			var n = data.length;
			if (n < 2) {
				return data;
			};
			var i = 0;
			var j = i + 1;
			var logic, temp, key;
			for (; i < j; i++) {
				for (j = i + 1; j < n; j++) {
					logic = fun.call(this, data[i], data[j]);
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
		_ICEOptions: function _ICEOptions() {
			var self = this;
			return {
				beforeSend: function beforeSend(xhr, model) {
					for (var setHeaderKey in self.headers) {
						xhr.setRequestHeader(setHeaderKey, self.headers[setHeaderKey]);
					}
				}
			};
		},
		_ICEFetch: function _ICEFetch(success, error) {
			var self = this;
			var options = _.extend(this._ICEOptions(), this.options);
			this.fetch(_.extend({
				success: function (_success) {
					function success(_x, _x2) {
						return _success.apply(this, arguments);
					}
	
					success.toString = function () {
						return _success.toString();
					};
	
					return success;
				}(function (model, response) {
					response = self._ICEProcessData(response);
					if (_.isFunction(success)) {
						success.call(self, response);
					};
				}),
				error: function (_error) {
					function error(_x3, _x4) {
						return _error.apply(this, arguments);
					}
	
					error.toString = function () {
						return _error.toString();
					};
	
					return error;
				}(function (model, e) {
					if (_.isFunction(error)) {
						error.call(self, e);
					};
				})
			}, options));
		},
		_ICESave: function _ICESave(saveJSON, success, error) {
			var self = this;
			var options = _.extend(this._ICEOptions(), this.options);
			this.save(saveJSON, _.extend({
				success: function (_success2) {
					function success(_x5, _x6) {
						return _success2.apply(this, arguments);
					}
	
					success.toString = function () {
						return _success2.toString();
					};
	
					return success;
				}(function (model, response) {
					response = self._ICEProcessData(response);
					if (_.isFunction(success)) {
						success.call(self, response);
					}
				}),
				error: function (_error2) {
					function error(_x7, _x8) {
						return _error2.apply(this, arguments);
					}
	
					error.toString = function () {
						return _error2.toString();
					};
	
					return error;
				}(function (model, e) {
					if (_.isFunction(error)) {
						error.call(self, e);
					};
				})
			}, options));
		},
		_ICEDestroy: function _ICEDestroy(success, error) {
			var self = this;
			this.destroy({
				success: function (_success3) {
					function success(_x9, _x10) {
						return _success3.apply(this, arguments);
					}
	
					success.toString = function () {
						return _success3.toString();
					};
	
					return success;
				}(function (model, response) {
					if (_.isFunction(success)) {
						success.call(self, response);
					};
				}),
				error: function (_error3) {
					function error(_x11, _x12) {
						return _error3.apply(this, arguments);
					}
	
					error.toString = function () {
						return _error3.toString();
					};
	
					return error;
				}(function (model, e) {
					if (_.isFunction(error)) {
						error.call(self, e);
					};
				})
			});
		},
		_ICEJSONP: function _ICEJSONP(success, error) {
			var self = this;
			var jsonpXHR = $.ajax({
				url: this.url,
				data: this.parameter || {},
				dataType: 'jsonp',
				jsonp: 'callback'
			});
			jsonpXHR.done(function (response, state, xhr) {
				response = self._ICEProcessData(response);
				if (_.isFunction(success)) {
					success.call(self, response, state, xhr);
				};
			});
			jsonpXHR.fail(function (xhr, state, errors) {
				if (_.isFunction(error)) {
					error.call(self, xhr, state, errors);
				};
			});
		},
		_ICESendHelper: function _ICESendHelper(message) {
			var success = message.success;
			var error = message.error;
			if (message.type !== 'GET') {
				this.url = this.hostname;
			};
			switch (message.type) {
				case 'POST':
					this._ICESave(message.saveJSON, success, error);
					break;
				case 'PUT':
					var id = message.saveJSON.id;
					if (!id && id !== 0) {
						message.saveJSON.id = 'icepy' + uid++;
					};
					this._ICESave(message.saveJSON, success, error);
					break;
				case 'DELETE':
					this._ICEDestroy(success, error);
					break;
				case 'JSONP':
					this._ICEJSONP(success, error);
					break;
				default:
					this._ICEFetch(success, error);
					break;
			}
		},
		_ICESendMessage: function _ICESendMessage(message) {
			var self = this;
			if (this.storageCache && this.expiration) {
				if (!Store.enabled) {
					this._ICESendHelper(message);
				} else {
					var data = expiration.get(this.url);
					if (!data) {
						this._ICESendHelper(message);
						return false;
					};
					var success = message.success;
					if (_.isFunction(success)) {
						setTimeout(function () {
							data = self._ICEProcessData(data, true);
							success.call(self, data);
						}, 50);
					}
				};
			} else {
				this._ICESendHelper(message);
			};
		},
		_ICEProcessData: function _ICEProcessData(response, before) {
			//如果自定义了formatter方法，先对数据进行格式化
			if (_.isFunction(this.formatter)) {
				response = this.formatter(response);
			};
			//如果开启了缓存，对数据源进行本地存储
			if (this.storageCache && this.expiration && !before) {
				if (Store.enabled) {
					expiration.set(this.url, response, this.expiration);
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
		execute: function execute(success, error) {
			var message = {
				type: 'GET',
				success: success,
				error: error
			};
			this._ICESendMessage(message);
		},
		/**
	  * [executeGET 发起GET请求]
	  * @param  {[type]} success [description]
	  * @param  {[type]} error   [description]
	  * @return {[type]}         [description]
	  */
		executeGET: function executeGET(success, error) {
			var message = {
				type: 'GET',
				success: success,
				error: error
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
		executePOST: function executePOST(saveJSON, success, error) {
			var message = {
				type: 'POST',
				saveJSON: saveJSON,
				success: success,
				error: error
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
		executePUT: function executePUT(saveJSON, success, error) {
			var message = {
				type: 'PUT',
				saveJSON: saveJSON,
				success: success,
				error: error
			};
			this._ICESendMessage(message);
		},
		/**
	  * [executeDELETE 发起delete请求]
	  * @return {[type]} [description]
	  */
		executeDELETE: function executeDELETE() {
			var message = {
				type: 'DELETE',
				success: success,
				error: error
			};
			this._ICESendMessage(message);
		},
		/**
	  * [executeJSONP 发起JSONP跨域请求]
	  * @param  {[type]} success [description]
	  * @param  {[type]} error   [description]
	  * @return {[type]}         [description]
	  */
		executeJSONP: function executeJSONP(parameter, success, error) {
			this.parameter = null;
			this.parameter = parameter;
			var message = {
				type: 'JSONP',
				success: success,
				error: error
			};
			this._ICESendMessage(message);
		},
		/**
	  * [setChangeURL 辅助拼接URL参数]
	  * @param {[type]} parameter [description]
	  */
		setChangeURL: function setChangeURL(parameter) {
			var url = '';
			if (!parameter) {
				return;
			};
			for (var key in parameter) {
				var value = parameter[key];
				if (!url.length) {
					url = this._url.replace('{{' + key + '}}', value);
				} else {
					url = url.replace('{{' + key + '}}', value);
				};
			};
			this.url = url;
		},
		/**
	  * [setHeaders 设置XHR 头信息]
	  * @param {[type]} headers [description]
	  */
		setHeaders: function setHeaders(headers) {
			this.headers = null;
			this.headers = headers;
		},
		/**
	  * [setView 设置view-model关系]
	  * @param {[type]} view [description]
	  */
		setView: function setView(view) {
			this._view = view;
		},
		/**
	  * [setOnQueueKeys 设置订阅的渲染事件名队列]
	  * @param {[type]} value [description]
	  */
		setOnQueueKeys: function setOnQueueKeys(value) {
			if (!_.isArray(value)) {
				warn('需要传入一个事件keys');
			} else {
				this._onQueue.length = 0;
				this._onQueue = value;
			}
		},
		/**
	  * [$get 从模型获取数据]
	  * @param  {[type]} expression [description]
	  * @return {[type]}            [description]
	  */
		$get: function $get(expression) {
			if (!expression) {
				return this._store;
			}
			var attrNodes = expression.split('.');
			var lh = attrNodes.length;
			if (lh > 0) {
				var node = attrNodes[0];
				var i = 0;
				var store = this._store;
				while (node) {
					i++;
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
		$set: function $set(expression, value, options) {
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
					while (node) {
						i++;
						store = store[node];
						node = attrNodes[i];
						if (i > lh - 2) {
							break;
						}
					}
				}
				switch (Tools.toType(store)) {
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
		$filter: function $filter(expression, value) {
			//arguments
			var data = this.$get(expression);
			var result = [];
			if (_.isArray(data)) {
				var i = data.length;
				var n;
				while (i--) {
					var val = data[i];
					switch (Tools.toType(value)) {
						case '[object Object]':
							n = true;
							for (var k in value) {
								if (!(val[k] === value[k])) {
									n = null;
									break;
								}
							}
							break;
						case '[object Function]':
							n = value(val, i);
							break;
						default:
							n = val === value;
							break;
					}
					if (n) {
						result.push(val);
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
		$sort: function $sort(expression, value) {
			//arguments
			// > 大于 true
			// < 小于 false
			// items.id
			var data = this.$get(expression);
			baseModelSort.length = 0;
			if (_.isArray(data)) {
				switch (Tools.toType(value)) {
					case '[object Function]':
						baseModelSort = this._ICESort(data, value);
						break;
					default:
						if (typeof value === 'string') {
							var attrNodes = value.split('.');
							var logic = null;
							var lh = attrNodes.length - 1;
							switch (attrNodes[lh]) {
								case '>':
									logic = true;
									break;
								case '<':
									logic = false;
									break;
								default:
									return baseModelSort;
									break;
							};
							if (logic !== null) {
								return this._ICESort(data, function (val1, val2) {
									var node = attrNodes[0];
									var i = 0;
									while (node) {
										val1 = val1[node];
										val2 = val2[node];
										i++;
										if (i === lh) {
											break;
										};
										node = attrNodes[i];
									}
									if (logic) {
										return val1 > val2;
									} else {
										return val1 < val2;
									};
								});
							}
						};
						break;
				}
			};
			return baseModelSort;
		},
		/**
	  * [$updateStore 将_store数据进行更新]
	  * @return {[type]} [description]
	  */
		$updateStore: function $updateStore() {
			if (Store.enabled) {
				expiration.set(self.url, this._store, self.expiration);
			};
		}
	});
	module.exports = BaseModel;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, module) {/**
	 * @time 2012年10月27日
	 * @author icepy
	 * @info 封装完成本地缓存API
	 *
	 * @time 2016年2月27日
	 * @author icepy
	 * @info 改造兼容webpack打包
	 */
	
	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	(function (factory) {
		var root = (typeof self === 'undefined' ? 'undefined' : _typeof(self)) == 'object' && self.self == self && self || (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global.global == global && global;
		if (( false ? 'undefined' : _typeof(exports)) === 'object' && ( false ? 'undefined' : _typeof(module)) === 'object') {
			module.exports = factory();
		} else if (( false ? 'undefined' : _typeof(exports)) === 'object') {
			exports['store'] = factory();
		} else {
			if (!root.ICEPlugs) {
				root.ICEPlugs = {};
			};
			root.ICEPlugs.store = factory();
		};
	})(function () {
		var store = {};
		var _window = window;
		var localStorageName = 'localStorage';
		var sessionStorageName = 'sessionStorage';
		var rootKey = 'ICEStorageCache';
		var storage, session;
		var isLocalStorageNameSupported = function isLocalStorageNameSupported() {
			try {
				return localStorageName in _window && _window[localStorageName];
			} catch (err) {
				return false;
			}
		};
		var isSessionStorageNameSupported = function isSessionStorageNameSupported() {
			try {
				return sessionStorageName in _window && _window[sessionStorageName];
			} catch (err) {
				return false;
			}
		};
		store.disabled = false;
		store.version = '0.0.1';
		/**
	  * [has 根据Key判断是否存在]
	  * @param  {[String]}  key [description]
	  * @return {Boolean}     [description]
	  */
		store.has = function (key) {
			return store.get(key) !== undefined;
		};
	
		/**
	  * [transact 有存储是否成功的回调函数]
	  * @param  {[String]} key           [description]
	  * @param  {[String]} defaultVal    [description]
	  * @param  {[type]} transactionFn [description]
	  */
		store.transact = function (key, defaultVal, transactionFn) {
			if (transactionFn == null) {
				transactionFn = defaultVal;
				defaultVal = null;
			}
	
			if (defaultVal == null) {
				defaultVal = {};
			}
	
			var val = store.get(key, defaultVal);
			transactionFn(val);
			store.set(key, val);
		};
		/**
	  * [serialize 对象转字符串]
	  * @param  {[Object]} value [description]
	  * @return {[String]}       [description]
	  */
		store.serialize = function (value) {
			return JSON.stringify(value);
		};
		/**
	  * [deserialize 字符串格式化对象]
	  * @param  {[String]} value [description]
	  * @return {[Object]}       [description]
	  */
		store.deserialize = function (value) {
			if (typeof value != 'string') {
				return undefined;
			}
			try {
				return JSON.parse(value);
			} catch (e) {
				return value || undefined;
			}
		};
		if (isLocalStorageNameSupported()) {
			storage = _window[localStorageName];
			/**
	   * [set  存储本地缓存]
	   * @param {[String]} key [description]
	   * @param {[Object]} val [description]
	   */
			store.set = function (key, val) {
				if (val === undefined) {
					return store.remove(key);
				}
				storage.setItem(key, store.serialize(val));
				return val;
			};
	
			/**
	   * [get 获取本地缓存]
	   * @param  {[String]} key        [description]
	   * @param  {[type]} defaultVal [description]
	   * @return {[Boolean]}            [description]
	   */
			store.get = function (key, defaultVal) {
				var val = store.deserialize(storage.getItem(key));
				return val === undefined ? defaultVal : val;
			};
	
			/**
	   * [remove 根据key名删除一个本地缓存]
	   * @param  {[String]} key [description]
	   */
			store.remove = function (key) {
				storage.removeItem(key);
			};
	
			/**
	   * [clear 清除所有的本地缓存]
	   */
			store.clear = function () {
				storage.clear();
			};
	
			/**
	   * [getAll description]
	   * @return {[Object]} [description]
	   */
			store.getAll = function () {
				var ret = {};
				store.forEach(function (key, val) {
					ret[key] = val;
				});
				return ret;
			};
			store.forEach = function (callback) {
				for (var i = 0; i < storage.length; i++) {
					var key = storage.key(i);
					callback(key, store.get(key));
				}
			};
			//可以设置过期时间
			store.expiration = {
				/**
	    * [set 存储可以设置过期时间的本地缓存]
	    * @param {[String]} key [description]
	    * @param {[Object]} val [description]
	    * @param {[Number]} exp [description]
	    */
				set: function set(key, val, exp) {
					//exp 接受自然整数，以一小时60分钟为单位
					var Root = store.get(rootKey) || {};
					Root[key] = {
						val: val,
						exp: exp * (1000 * 60 * 60),
						time: new Date().getTime()
					};
					store.set(rootKey, Root);
				},
				/**
	    * [get 获取有过期时间的本地缓存]
	    * @param  {[String]} key [description]
	    * @return {[*]}     [*]
	    */
				get: function get(key) {
					var Root = store.get(rootKey);
					if (!Root) {
						//根节点不存在
						return null;
					};
					var info = Root[key];
					if (!info) {
						return null;
					}
					if (new Date().getTime() - info.time > info.exp) {
						return null;
					}
					return info.val;
				},
				getAll: function getAll() {
					var Root = store.get(rootKey);
					return Root || null;
				},
				resetSave: function resetSave(val) {
					store.set(rootKey, val);
				}
			};
			if (isSessionStorageNameSupported()) {
				session = _window[sessionStorageName];
				//会话模式
				store.session = {
					/**
	     * [set 存储一个会话]
	     * @param {[String]} key [description]
	     * @param {[*]} val [*]
	     */
					set: function set(key, val) {
						if (val === undefined) {
							return store.remove(key);
						}
						var stayStore;
						if (Object.prototype.toString.call(val) === '[object Object]') {
							stayStore = store.serialize(val);
						} else {
							stayStore = val;
						};
						session.setItem(key, stayStore);
					},
					/**
	     * [get 获取一个会话]
	     * @param  {[String]} key [description]
	     * @return {[Boolean]}     [description]
	     */
					get: function get(key) {
						var val = store.deserialize(session.getItem(key));
						return val === undefined ? defaultVal : val;
					}
				};
			};
		}
		try {
			var testKey = '__storeJs__';
			store.set(testKey, testKey);
			if (store.get(testKey) != testKey) {
				store.disabled = true;
			}
			store.remove(testKey);
		} catch (e) {
			store.disabled = true;
		}
		store.enabled = !store.disabled;
		if (store.enabled) {
			var modelCache = store.expiration.getAll();
			if (modelCache) {
				for (var cacheKey in modelCache) {
					var cache = modelCache[cacheKey];
					if (new Date().getTime() - cache.time > cache.exp) {
						cache = null;
						delete modelCache[cacheKey];
					}
				}
			};
			store.expiration.resetSave(modelCache);
		};
		return store;
	});
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(11)(module)))

/***/ },
/* 18 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 19 */,
/* 20 */
/***/ function(module, exports) {

	module.exports = window.Backbone;

/***/ }
]);
//# sourceMappingURL=index.main.js.map