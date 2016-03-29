webpackJsonp([0,1],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _index = __webpack_require__(1);
	
	var _index2 = _interopRequireDefault(_index);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	_index2.default.start();
	
	__webpack_require__(19);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _BaseRouter = __webpack_require__(2);
	
	var _BaseRouter2 = _interopRequireDefault(_BaseRouter);
	
	var _setting = __webpack_require__(7);
	
	var _setting2 = _interopRequireDefault(_setting);
	
	var _list = __webpack_require__(8);
	
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
	
	var Backbone = __webpack_require__(3);
	var warn = __webpack_require__(4);
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
/***/ function(module, exports) {

	module.exports = window.Backbone;

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
	
	var warn = function warn(msg, e) {
	  if (Config.debug) {
	    Debug.warn(msg, e);
	  }
	};
	module.exports = warn;

/***/ },
/* 5 */
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
/* 6 */
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
/* 7 */
/***/ function(module, exports) {

	"use strict";

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _BaseView = __webpack_require__(9);
	
	var _BaseView2 = _interopRequireDefault(_BaseView);
	
	var _create = __webpack_require__(13);
	
	var _create2 = _interopRequireDefault(_create);
	
	var _index = __webpack_require__(15);
	
	var _index2 = _interopRequireDefault(_index);
	
	var _create3 = __webpack_require__(16);
	
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
	        console.log('model', model);
	        model.execute(function (response) {
	            console.log(this);
	            console.log(response);
	            console.log(this.manager);
	            console.log('$get items', this.manager.$get('items'));
	            console.log('$get debug', this.manager.$get('debug'));
	            console.log('$get trace.warn', this.manager.$get('trace.warn'));
	            this.manager.$set('trace.warn', { 'msg': 'msg' });
	            console.log('$get 全部的数据', this.manager.$get());
	            var id1 = this.manager.$filter('items', { "id": 1 });
	            console.log('$filter id=1', id1);
	            var id2 = this.manager.$filter('items', function (v, i) {
	                if (v.id == 2) {
	                    return true;
	                }
	            });
	            console.log('$filter id=2', id2);
	            var icepy = this.manager.$filter('items2', 'icepy');
	            console.log('$filter icepy', icepy);
	            var sort1 = this.manager.$sort('items', 'id.<');
	            console.log('降序', sort1);
	            var sort2 = this.manager.$sort('items', 'id.>');
	            console.log('升序', sort2);
	            var sort3 = this.manager.$sort('items', function () {
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
/* 9 */
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
	
	var Backbone = __webpack_require__(3);
	var tplEng = __webpack_require__(10);
	var warn = __webpack_require__(4);
	var tools = __webpack_require__(11);
	var error = __webpack_require__(6).error;
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
			this.__YYTPC__ = true;
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
	  * [compileHTML 编译模板]
	  * @param  {[type]} tplStr [description]
	  * @param  {[type]} data   [description]
	  * @return {[type]}        [description]
	  */
		compileHTML: function compileHTML(tplStr, data) {
			return tplEng.compile(tplStr)(data);
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
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;"use strict";
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	/*!art-template - Template Engine | http://aui.github.com/artTemplate/*/
	!function () {
	  function a(a) {
	    return a.replace(t, "").replace(u, ",").replace(v, "").replace(w, "").replace(x, "").split(y);
	  }function b(a) {
	    return "'" + a.replace(/('|\\)/g, "\\$1").replace(/\r/g, "\\r").replace(/\n/g, "\\n") + "'";
	  }function c(c, d) {
	    function e(a) {
	      return m += a.split(/\n/).length - 1, k && (a = a.replace(/\s+/g, " ").replace(/<!--[\w\W]*?-->/g, "")), a && (a = s[1] + b(a) + s[2] + "\n"), a;
	    }function f(b) {
	      var c = m;if (j ? b = j(b, d) : g && (b = b.replace(/\n/g, function () {
	        return m++, "$line=" + m + ";";
	      })), 0 === b.indexOf("=")) {
	        var e = l && !/^=[=#]/.test(b);if (b = b.replace(/^=[=#]?|[\s;]*$/g, ""), e) {
	          var f = b.replace(/\s*\([^\)]+\)/, "");n[f] || /^(include|print)$/.test(f) || (b = "$escape(" + b + ")");
	        } else b = "$string(" + b + ")";b = s[1] + b + s[2];
	      }return g && (b = "$line=" + c + ";" + b), r(a(b), function (a) {
	        if (a && !p[a]) {
	          var b;b = "print" === a ? u : "include" === a ? v : n[a] ? "$utils." + a : o[a] ? "$helpers." + a : "$data." + a, w += a + "=" + b + ",", p[a] = !0;
	        }
	      }), b + "\n";
	    }var g = d.debug,
	        h = d.openTag,
	        i = d.closeTag,
	        j = d.parser,
	        k = d.compress,
	        l = d.escape,
	        m = 1,
	        p = { $data: 1, $filename: 1, $utils: 1, $helpers: 1, $out: 1, $line: 1 },
	        q = "".trim,
	        s = q ? ["$out='';", "$out+=", ";", "$out"] : ["$out=[];", "$out.push(", ");", "$out.join('')"],
	        t = q ? "$out+=text;return $out;" : "$out.push(text);",
	        u = "function(){var text=''.concat.apply('',arguments);" + t + "}",
	        v = "function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);" + t + "}",
	        w = "'use strict';var $utils=this,$helpers=$utils.$helpers," + (g ? "$line=0," : ""),
	        x = s[0],
	        y = "return new String(" + s[3] + ");";r(c.split(h), function (a) {
	      a = a.split(i);var b = a[0],
	          c = a[1];1 === a.length ? x += e(b) : (x += f(b), c && (x += e(c)));
	    });var z = w + x + y;g && (z = "try{" + z + "}catch(e){throw {filename:$filename,name:'Render Error',message:e.message,line:$line,source:" + b(c) + ".split(/\\n/)[$line-1].replace(/^\\s+/,'')};}");try {
	      var A = new Function("$data", "$filename", z);return A.prototype = n, A;
	    } catch (B) {
	      throw B.temp = "function anonymous($data,$filename) {" + z + "}", B;
	    }
	  }var d = function d(a, b) {
	    return "string" == typeof b ? q(b, { filename: a }) : g(a, b);
	  };d.version = "3.0.0", d.config = function (a, b) {
	    e[a] = b;
	  };var e = d.defaults = { openTag: "<%", closeTag: "%>", escape: !0, cache: !0, compress: !1, parser: null },
	      f = d.cache = {};d.render = function (a, b) {
	    return q(a, b);
	  };var g = d.renderFile = function (a, b) {
	    var c = d.get(a) || p({ filename: a, name: "Render Error", message: "Template not found" });return b ? c(b) : c;
	  };d.get = function (a) {
	    var b;if (f[a]) b = f[a];else if ("object" == (typeof document === "undefined" ? "undefined" : _typeof(document))) {
	      var c = document.getElementById(a);if (c) {
	        var d = (c.value || c.innerHTML).replace(/^\s*|\s*$/g, "");b = q(d, { filename: a });
	      }
	    }return b;
	  };var h = function h(a, b) {
	    return "string" != typeof a && (b = typeof a === "undefined" ? "undefined" : _typeof(a), "number" === b ? a += "" : a = "function" === b ? h(a.call(a)) : ""), a;
	  },
	      i = { "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "&": "&#38;" },
	      j = function j(a) {
	    return i[a];
	  },
	      k = function k(a) {
	    return h(a).replace(/&(?![\w#]+;)|[<>"']/g, j);
	  },
	      l = Array.isArray || function (a) {
	    return "[object Array]" === {}.toString.call(a);
	  },
	      m = function m(a, b) {
	    var c, d;if (l(a)) for (c = 0, d = a.length; d > c; c++) {
	      b.call(a, a[c], c, a);
	    } else for (c in a) {
	      b.call(a, a[c], c);
	    }
	  },
	      n = d.utils = { $helpers: {}, $include: g, $string: h, $escape: k, $each: m };d.helper = function (a, b) {
	    o[a] = b;
	  };var o = d.helpers = n.$helpers;d.onerror = function (a) {
	    var b = "Template Error\n\n";for (var c in a) {
	      b += "<" + c + ">\n" + a[c] + "\n\n";
	    }"object" == (typeof console === "undefined" ? "undefined" : _typeof(console)) && console.error(b);
	  };var p = function p(a) {
	    return d.onerror(a), function () {
	      return "{Template Error}";
	    };
	  },
	      q = d.compile = function (a, b) {
	    function d(c) {
	      try {
	        return new i(c, h) + "";
	      } catch (d) {
	        return b.debug ? p(d)() : (b.debug = !0, q(a, b)(c));
	      }
	    }b = b || {};for (var g in e) {
	      void 0 === b[g] && (b[g] = e[g]);
	    }var h = b.filename;try {
	      var i = c(a, b);
	    } catch (j) {
	      return j.filename = h || "anonymous", j.name = "Syntax Error", p(j);
	    }return d.prototype = i.prototype, d.toString = function () {
	      return i.toString();
	    }, h && b.cache && (f[h] = d), d;
	  },
	      r = n.$each,
	      s = "break,case,catch,continue,debugger,default,delete,do,else,false,finally,for,function,if,in,instanceof,new,null,return,switch,this,throw,true,try,typeof,var,void,while,with,abstract,boolean,byte,char,class,const,double,enum,export,extends,final,float,goto,implements,import,int,interface,long,native,package,private,protected,public,short,static,super,synchronized,throws,transient,volatile,arguments,let,yield,undefined",
	      t = /\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|\s*\.\s*[$\w\.]+/g,
	      u = /[^\w$]+/g,
	      v = new RegExp(["\\b" + s.replace(/,/g, "\\b|\\b") + "\\b"].join("|"), "g"),
	      w = /^\d[^,]*|,\d[^,]*/g,
	      x = /^,+|,+$/g,
	      y = /^$|,+/;e.openTag = "{{", e.closeTag = "}}";var z = function z(a, b) {
	    var c = b.split(":"),
	        d = c.shift(),
	        e = c.join(":") || "";return e && (e = ", " + e), "$helpers." + d + "(" + a + e + ")";
	  };e.parser = function (a) {
	    a = a.replace(/^\s/, "");var b = a.split(" "),
	        c = b.shift(),
	        e = b.join(" ");switch (c) {case "if":
	        a = "if(" + e + "){";break;case "else":
	        b = "if" === b.shift() ? " if(" + b.join(" ") + ")" : "", a = "}else" + b + "{";break;case "/if":
	        a = "}";break;case "each":
	        var f = b[0] || "$data",
	            g = b[1] || "as",
	            h = b[2] || "$value",
	            i = b[3] || "$index",
	            j = h + "," + i;"as" !== g && (f = "[]"), a = "$each(" + f + ",function(" + j + "){";break;case "/each":
	        a = "});";break;case "echo":
	        a = "print(" + e + ");";break;case "print":case "include":
	        a = c + "(" + b.join(",") + ");";break;default:
	        if (/^\s*\|\s*[\w\$]/.test(e)) {
	          var k = !0;0 === a.indexOf("#") && (a = a.substr(1), k = !1);for (var l = 0, m = a.split("|"), n = m.length, o = m[l++]; n > l; l++) {
	            o = z(o, m[l]);
	          }a = (k ? "=" : "=#") + o;
	        } else a = d.helpers[c] ? "=#" + c + "(" + b.join(",") + ");" : "=" + a;}return a;
	  },  true ? !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	    return d;
	  }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : "undefined" != typeof exports ? module.exports = d : this.template = d;
	}();

/***/ },
/* 11 */
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
	    tools.mergeData = function (to, from) {
	        var key, toVal, fromVal;
	        for (key in from) {
	            toVal = to[key];
	            fromVal = from[key];
	            if (tools.isPlainObject(toVal) && tools.isPlainObject(fromVal)) {
	                tools.mergeData(toVal, fromVal);
	            }
	        }
	        return to;
	    };
	    return tools;
	});
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(12)(module)))

/***/ },
/* 12 */
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
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _BaseView = __webpack_require__(9);
	
	var _BaseView2 = _interopRequireDefault(_BaseView);
	
	var _create = __webpack_require__(14);
	
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
/* 14 */
/***/ function(module, exports) {

	module.exports = "{{each items as item i}}\r\n    <li><a href=\"#\">{{item}}</a></li>\r\n{{/each}}\r\n"

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = "<div id=\"indexId\" class=\"am-container\">\r\n    <header class=\"header\">\r\n        <span class=\"title\">@icepy Test Todo App</span>\r\n    </header>\r\n    <div id=\"list\" class=\"content\">\r\n        <ul class=\"am-list\">\r\n\r\n        </ul>\r\n    </div>\r\n    <footer class=\"footer\">\r\n        <span class=\"title\">@YYT PC Demo</span>\r\n    </footer>\r\n</div>\r\n"

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @time {时间}
	 * @author {编写者}
	 * @info {实现的功能}
	 */
	
	'use strict';
	
	var BaseModel = __webpack_require__(17);
	
	var Model = BaseModel.extend({
		url: '{{url_prefix}}/examples/todomvc/mock/default.json?id={{id}}', //填写请求地址
		beforeEmit: function beforeEmit(options) {
			// 如果需要开启对请求数据的本地缓存，可将下列两行注释去掉
			// this.storageCache = true; //开启本地缓存
			// this.expiration = 2; //设置缓存过期时间（1表示60*60*1000 一小时）
		},
		defaultEntity: function defaultEntity() {
			return {
				"default": 1
			};
		}
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
/* 17 */
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
	
	var Backbone = __webpack_require__(3);
	var Store = __webpack_require__(18);
	var Config = __webpack_require__(5);
	var Tools = __webpack_require__(11);
	var warn = __webpack_require__(4);
	var ManagedObject = __webpack_require__(21);
	var uid = 1314;
	var expiration = Store.expiration;
	var env = Config.env[Config.scheme];
	var BaseModel = Backbone.Model.extend({
		options: {},
		initialize: function initialize(options) {
			this.parameter = null;
			this.manager = new ManagedObject({ entity: this.defaultEntity() || {} });
			if (_.isFunction(this.beforeEmit)) {
				this.beforeEmit(options);
			};
			this._url = this.url;
			if (!this.setEnv) {
				//默认使用内置{url_prefix}处理
				this._ICESetEnv();
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
		_ICESave: function _ICESave(HTTPBody, success, error) {
			var self = this;
			var options = _.extend(this._ICEOptions(), this.options);
			this.save(HTTPBody, _.extend({
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
		_ICEJSONP: function _ICEJSONP(parameter, success, error) {
			var self = this;
			var jsonpXHR = $.ajax({
				url: this.url,
				data: parameter || {},
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
			if (message.url) {
				//如果存在url，将this的url替换
				this.url = message.url;
			};
			switch (message.type) {
				case 'POST':
					this._ICESave(message.HTTPBody, success, error);
					break;
				case 'PUT':
					var id = message.HTTPBody.id;
					if (!id && id !== 0) {
						message.HTTPBody.id = 'icepy' + uid++;
					};
					this._ICESave(message.HTTPBody, success, error);
					break;
				case 'DELETE':
					this._ICEDestroy(success, error);
					break;
				case 'JSONP':
					this._ICEJSONP(message.parameter, success, error);
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
			this.manager.$update(response);
			this.set(response);
			return response;
		},
		/**
	  * [execute GET请求简化版]
	  * @param  {[type]} success [description]
	  * @param  {[type]} error   [description]
	  * @return {[type]}         [description]
	  */
		execute: function execute() {
			var message = {
				type: 'GET'
			};
			var args = Tools.toArray(arguments);
			var g = args.splice(0, 1)[0];
			if (Tools.isPlainObject(g)) {
				message = _.extend(message, g);
				message.success = args[0];
				message.error = args[1];
			} else {
				message.success = g;
				message.error = args[0];
			}
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
			this.execute(message);
		},
		/**
	  * [executePOST 发起POST请求]
	  * @param  {[type]} HTTPBody [description]
	  * @param  {[type]} success  [description]
	  * @param  {[type]} error    [description]
	  * @return {[type]}          [description]
	  */
		executePOST: function executePOST(HTTPBody, success, error) {
			var message = {
				type: 'POST',
				HTTPBody: HTTPBody,
				success: success,
				error: error
			};
			this.execute(message);
		},
		/**
	  * [executePUT 发起PUT请求]
	  * @param  {[type]} HTTPBody [description]
	  * @param  {[type]} success  [description]
	  * @param  {[type]} error    [description]
	  * @return {[type]}          [description]
	  */
		executePUT: function executePUT(HTTPBody, success, error) {
			var message = {
				type: 'PUT',
				HTTPBody: HTTPBody,
				success: success,
				error: error
			};
			this.execute(message);
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
			this.execute(message);
		},
		/**
	  * [executeJSONP 发起JSONP跨域请求]
	  * @param  {[type]} success [description]
	  * @param  {[type]} error   [description]
	  * @return {[type]}         [description]
	  */
		executeJSONP: function executeJSONP(parameter, success, error) {
			var message = {
				type: 'JSONP',
				success: success,
				error: error,
				parameter: parameter
			};
			this.execute(message);
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
	  * [setUpdateStore 将实体数据更新到本地缓存]
	  * @return {[type]} [description]
	  */
		setUpdateStore: function setUpdateStore() {
			if (Store.enabled) {
				expiration.set(self.url, this.manager.$get(), self.expiration);
			};
		}
	});
	module.exports = BaseModel;

/***/ },
/* 18 */
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
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(12)(module)))

/***/ },
/* 19 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 20 */,
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * @time 2016年3月29日
	 * @author icepy
	 * @info 实体管理类
	 */
	var warn = __webpack_require__(4);
	var Tools = __webpack_require__(11);
	var baseModelSort = [];
	
	var ManagedObject = function ManagedObject(options) {
	    this.entity = options.entity || {};
	};
	
	ManagedObject.prototype.$update = function (obj) {
	    var entity = _.extend(this.entity, obj);
	    this.entity = null;
	    this.entity = entity;
	};
	/**
	 * [$get 从实体中获取数据，无参将返回所有数据，参数使用.结构化表达式（this.$get('items.0.id')）]
	 * @param  {[type]} expression [description]
	 * @return {[type]}            [description]
	 */
	ManagedObject.prototype.$get = function (expression) {
	    if (!expression) {
	        return this.entity;
	    }
	    var attrNodes = expression.split('.');
	    var lh = attrNodes.length;
	    if (lh > 0) {
	        var node = attrNodes[0];
	        var i = 0;
	        var entity = this.entity;
	        while (node) {
	            i++;
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
	ManagedObject.prototype.$set = function (expression, value, options) {
	    if (expression === null || expression === undefined) {
	        warn('存储器不允许传递一个null或者undefined');
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
	            while (node) {
	                i++;
	                entity = entity[node];
	                node = attrNodes[i];
	                if (i > lh - 2) {
	                    break;
	                }
	            }
	        }
	        switch (Tools.toType(entity)) {
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
	ManagedObject.prototype.$filter = function (expression, value) {
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
	            };
	            if (n) {
	                result.push(val);
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
	ManagedObject.prototype.$sort = function (expression, value) {
	    // > 大于 true
	    // < 小于 false
	    var data = this.$get(expression);
	    baseModelSort.length = 0;
	    if (_.isArray(data)) {
	        switch (Tools.toType(value)) {
	            case '[object Function]':
	                baseModelSort = this._sort(data, value);
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
	                        return this._sort(data, function (val1, val2) {
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
	};
	
	ManagedObject.prototype._sort = function (data, fun) {
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
	};
	
	module.exports = ManagedObject;

/***/ }
]);
//# sourceMappingURL=index.main.js.map