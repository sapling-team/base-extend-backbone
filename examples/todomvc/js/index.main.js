webpackJsonp([0,1],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _index = __webpack_require__(1);
	
	var _index2 = _interopRequireDefault(_index);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	_index2.default.start();
	
	__webpack_require__(15);

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
	
	var warn = __webpack_require__(3);
	var stack = [];
	var routerHash = {};
	var curr = null;
	var router = null;
	var _win = window;
	var routerHashTop = function routerHashTop(key) {
	    return routerHash[key];
	};
	var routerHashRmove = function routerHashRmove(key) {
	    delete routerHash[key];
	};
	var Backbone = _win.Backbone;
	if (!Backbone) {
	    throw new Error("import Backbone");
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
				'url_prefix': 'http://127.0.0.1:4000'
				// 'url_prefix':'http://icepy.yinyuetai.com:4000'
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
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var IndexView = _BaseView2.default.extend({
	    el: '#container',
	    rawLoader: function rawLoader() {
	        return _index2.default;
	    },
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
	        console.log(create);
	    },
	    router: {
	        dealloc: true,
	        viewDidLoad: function viewDidLoad() {
	            console.log(1);
	        },
	        viewWillAppear: function viewWillAppear() {
	            console.log(2);
	        },
	        viewDidAppear: function viewDidAppear() {
	            console.log(3);
	        }
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
	
	var _win = window;
	var Backbone = _win.Backbone;
	if (!Backbone) {
		throw new Error("import Backbone");
	};
	var tplEng = __webpack_require__(9);
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
/* 9 */
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
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _BaseView = __webpack_require__(8);
	
	var _BaseView2 = _interopRequireDefault(_BaseView);
	
	var _create = __webpack_require__(13);
	
	var _create2 = _interopRequireDefault(_create);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var ViewCSS = function () {
	    function ViewCSS() {
	        _classCallCheck(this, ViewCSS);
	    }
	
	    _createClass(ViewCSS, [{
	        key: 'contractor',
	        value: function contractor(style) {
	            this.style = style;
	        }
	    }]);
	
	    return ViewCSS;
	}();
	
	var Pay = function (_ViewCSS) {
	    _inherits(Pay, _ViewCSS);
	
	    function Pay() {
	        _classCallCheck(this, Pay);
	
	        return _possibleConstructorReturn(this, Object.getPrototypeOf(Pay).apply(this, arguments));
	    }
	
	    _createClass(Pay, [{
	        key: 'contractor',
	        value: function contractor(el) {
	            this.el = el;
	        }
	    }, {
	        key: 'reset',
	        value: function reset() {
	            this.el.css(this.style);
	        }
	    }]);
	
	    return Pay;
	}(ViewCSS);
	
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
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
]);
//# sourceMappingURL=index.main.js.map