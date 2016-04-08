webpackJsonp([0,1],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _index = __webpack_require__(1);
	
	var _index2 = _interopRequireDefault(_index);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	_index2.default.start();
	
	__webpack_require__(26);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _base = __webpack_require__(2);
	
	var _base2 = _interopRequireDefault(_base);
	
	var _main = __webpack_require__(16);
	
	var _main2 = _interopRequireDefault(_main);
	
	var _main3 = __webpack_require__(20);
	
	var _main4 = _interopRequireDefault(_main3);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var BaseRouter = _base2.default.Router;
	var AppRouter = BaseRouter.extend({
	    routes: {
	        'index': 'indexRouter',
	        'list/:id': 'listRouter'
	    },
	    indexRouter: function indexRouter() {
	        this.addLifeCycleHelper('index', _main2.default);
	    },
	    listRouter: function listRouter(id) {
	        this.addLifeCycleHelper('list-' + id, _main4.default, id);
	    }
	});
	module.exports = {
	    start: function start() {
	        window.router = new AppRouter();
	        Backbone.$ = window.$;
	        Backbone.history.start();
	    }
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var BaseView = __webpack_require__(3);
	var BaseModel = __webpack_require__(12);
	var BaseRouter = __webpack_require__(14);
	var ManagedObject = __webpack_require__(15);
	module.exports = {
	    'View': BaseView,
	    'Model': BaseModel,
	    'Router': BaseRouter,
	    'ManagedObject': ManagedObject
	};

/***/ },
/* 3 */
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
	
	var Backbone = __webpack_require__(4);
	var tplEng = __webpack_require__(5);
	var warn = __webpack_require__(6);
	var Tools = __webpack_require__(9);
	var error = __webpack_require__(11);
	var uid = 999;
	var createID = function createID() {
		return 'view_' + uid++ + '_' + new Date().getTime() + Math.floor(Math.random(100) * 100);
	};
	var BaseView = Backbone.View.extend({
		initialize: function initialize(options) {
			//初始化参数
			this._ICEOptions = options || {};
			if (_.isFunction(this.beforeMount)) {
				this.beforeMount();
			} else {
				warn('推荐使用beforeMount钩子方法，用来初始化自定义属性');
			};
			if (this.router) {
				this.id = createID();
				this.$el.append('<div id="' + this.id + '"></div>');
				this.$el = this.$el.find('#' + this.id);
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
			}
			if (typeof this.afterMount === 'function') {
				this.afterMount();
			} else {
				warn('推荐使用afterMount钩子方法，在此钩子方法中来获取DOM对象');
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
			var self = this;
			this.$parent = this._ICEOptions.parent;
			this.$children = [];
			this.$root = this.$parent ? this.$parent.$root : this;
			if (this.$parent && this.$parent.__YYTPC__) {
				this.$parent.$children.push(this);
			};
			this.on('hook:context', function () {
				var args = Tools.toArray(arguments);
				if (self && self.__YYTPC__) {
					if (_.isFunction(self.context)) {
						self.context.apply(self, args);
					} else {
						warn('未定义context上下文钩子方法');
					};
				};
			});
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
	  * [triggerHook 触发父对象的Hook]
	  * @return {[type]} [description]
	  */
		triggerContextHook: function triggerContextHook() {
			if (this.$parent && this.$parent.__YYTPC__) {
				var args = Tools.toArray(arguments);
				var event = args[0];
				if (_.isString(event)) {
					args[0] = 'hook:context';
				} else {
					args.splice(0, 0, 'hook:context');
				};
				switch (event) {
					case 'root':
						this.$root.trigger.apply(this.$root, args);
						break;
					default:
						this.$parent.trigger.apply(this.$parent, args);
						break;
				}
			} else {
				warn('在View实例对象初始化时未指明对象的结构关系');
			}
		},
		/**
	  * [findDOMNode 查找DOM节点]
	  * @param  {[type]} exprs [description]
	  * @return {[type]}       [description]
	  */
		findDOMNode: function findDOMNode(exprs) {
			return this.$el && this.$el.find(exprs);
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
		broadcast: function broadcast() {
			var args = Tools.toArray(arguments);
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
		dispatch: function dispatch() {
			var args = Tools.toArray(arguments);
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
			this.$children.length = 0;
			this.$parent = null;
			this.$root = null;
			this._ICEDestroy();
		}
	});
	
	module.exports = BaseView;

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = window.Backbone;

/***/ },
/* 5 */
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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @time 2012年10月26日
	 * @author icepy
	 * @info 完成warn包装
	 */
	
	'use strict';
	
	var log = __webpack_require__(7);
	
	var warn = function warn(msg, e) {
	  log.warn(msg, e);
	};
	module.exports = warn;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * @time 2012年10月26日
	 * @author icepy
	 * @info debug信息打印
	 */
	
	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var log = {
		warn: function warn() {},
		error: function error() {},
		info: function info() {},
		dir: function dir() {}
	};
	if (process.env.NODE_ENV !== 'product') {
		var hasConsole = (typeof console === 'undefined' ? 'undefined' : _typeof(console)) !== undefined;
		log.warn = function (msg, e) {
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
		log.error = function (msg) {
			var error = new Error(msg);
			throw error.stack;
		};
		log.info = function (msg) {
			if (hasConsole) {
				console.info('[YYT PC INFO]' + msg);
			}
		};
		log.dir = function (tag) {
			var arr = document.querySelectorAll(tag);
			if (arr && arr.length) {
				arr.forEach(function (element) {
					console.dir(element);
				});
			}
		};
	}
	module.exports = log;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)))

/***/ },
/* 8 */
/***/ function(module, exports) {

	// shim for using process in browser
	
	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 9 */
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
	
	    /**
	     * [isArray 判断是否为数组]
	     * @param  {*} value [description]
	     * @return {Boolean}       [description]
	     */
	    tools.isArray = function (obj) {
	        return tools.toType(obj) === '[object Array]';
	    };
	
	    /**
	     * [mergeData 合并数据]
	     * @param  {obj} value [description]
	     * @param  {obj} value [description]
	     * @return {obj}       [description]
	     */
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
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(10)(module)))

/***/ },
/* 10 */
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
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @time 2012年10月26日
	 * @author icepy
	 * @info 完成error包装
	 */
	
	'use strict';
	
	var log = __webpack_require__(7);
	
	var error = function error(msg, e) {
	  log.error(msg, e);
	};
	module.exports = error;

/***/ },
/* 12 */
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
	
	var Backbone = __webpack_require__(4);
	var Store = __webpack_require__(13);
	var Tools = __webpack_require__(9);
	var warn = __webpack_require__(6);
	var uid = 1314;
	var expiration = Store.expiration;
	var BaseModel = Backbone.Model.extend({
		initialize: function initialize(options) {
			if (_.isFunction(this.beforeEmit)) {
				this.beforeEmit(options);
			};
			this._url = this.url;
		},
		_ICEFetch: function _ICEFetch(options) {
			this.fetch(options);
		},
		_ICESave: function _ICESave(HTTPBody, options) {
			this.save(HTTPBody, options);
		},
		_ICEDestroy: function _ICEDestroy(options) {
			this.destroy(options);
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
			var self = this;
			if (message.url) {
				//如果存在url，将this的url替换
				this.url = message.url;
			};
			var options = {};
			if (message.type !== 'JSONP') {
				options.beforeSend = function (xhr, setting) {
					for (var key in this.headers) {
						xhr.setRequestHeader(key, this.headers[key]);
					}
				};
				options.success = function (model, response, afterSetting) {
					response = self._ICEProcessData(response);
					if (_.isFunction(message.success)) {
						message.success.call(self, response, afterSetting.xhr);
					};
				};
				options.error = function (model, xhr) {
					if (_.isFunction(message.error)) {
						message.error.call(self, xhr);
					};
				};
			}
			switch (message.type) {
				case 'POST':
					this._ICESave(message.HTTPBody, options);
					break;
				case 'PUT':
					var id = message.HTTPBody.id;
					if (!id && id !== 0) {
						message.HTTPBody.id = 'icepy' + uid++;
					};
					this._ICESave(message.HTTPBody, options);
					break;
				case 'DELETE':
					this._ICEDestroy(options);
					break;
				case 'JSONP':
					this._ICEJSONP(message.parameter, message.success, message.error);
					break;
				default:
					this._ICEFetch(options);
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
				return this.url;
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
	  * @param {[string|object]} headers [description]
	  */
		setHeaders: function setHeaders() {
			if (!this.headers) {
				this.headers = {};
			};
			var args = Tools.toArray(arguments);
			if (args.length === 1) {
				var headers = args[0];
				for (var key in headers) {
					this.headers[key] = headers[key];
				}
			} else {
				if (args.length) {
					var key = args[0];
					var value = args[1];
					this.headers[key] = value;
				}
			}
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
/* 13 */
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
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(10)(module)))

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @time 2016年3月21日
	 * @author icepy
	 * @info 基于路由的生命周期
	 */
	
	'use strict';
	
	var Backbone = __webpack_require__(4);
	var warn = __webpack_require__(6);
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
	                        routerHashRmove(curr._router);
	                        stack.splice(stack.indexOf(curr.cid), 1);
	                        obj = null;
	                    };
	                }
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
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * @time 2016年3月29日
	 * @author icepy
	 * @info 实体管理类
	 */
	var Tools = __webpack_require__(9);
	var baseModelSort = [];
	
	var ManagedObject = function ManagedObject(options) {
	    options = options || {};
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
	    if (Tools.isArray(data)) {
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
	    if (Tools.isArray(data)) {
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

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _base = __webpack_require__(2);
	
	var _base2 = _interopRequireDefault(_base);
	
	var _goto = __webpack_require__(17);
	
	var _goto2 = _interopRequireDefault(_goto);
	
	var _index = __webpack_require__(19);
	
	var _index2 = _interopRequireDefault(_index);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var BaseView = _base2.default.View;
	var DefaultView = BaseView.extend({
	    el: '#container',
	    rawLoader: function rawLoader() {
	        return _index2.default;
	    },
	    beforeMount: function beforeMount() {},
	    afterMount: function afterMount() {},
	    ready: function ready() {
	        this.gotoview = new _goto2.default({
	            parent: this
	        });
	    },
	    context: function context() {},
	    router: {
	        dealloc: true,
	        viewDidLoad: function viewDidLoad() {},
	        viewWillAppear: function viewWillAppear() {},
	        viewDidAppear: function viewDidAppear() {},
	        viewWillDisappear: function viewWillDisappear() {}
	    }
	});
	
	module.exports = DefaultView;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _base = __webpack_require__(2);
	
	var _base2 = _interopRequireDefault(_base);
	
	var _goto = __webpack_require__(18);
	
	var _goto2 = _interopRequireDefault(_goto);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var BaseView = _base2.default.View;
	var GotoView = BaseView.extend({
	    el: '#defaultGo',
	    events: {
	        'click .default-margin button': 'gotoHandler'
	    },
	    rawLoader: function rawLoader() {
	        return _goto2.default;
	    },
	    beforeMount: function beforeMount() {},
	    afterMount: function afterMount() {},
	    ready: function ready() {},
	    gotoHandler: function gotoHandler(e) {
	        var el = $(e.currentTarget);
	        var id = el.attr('data-id');
	        if (id) {
	            window.router.navigate('list/' + id, {
	                trigger: true
	            });
	        }
	    }
	});
	module.exports = GotoView;

/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = "<div>\r\n    <img src=\"http://s.amazeui.org/media/i/demos/bw-2014-06-19.jpg\" class=\"am-img-responsive\" alt=\"\"/>\r\n</div>\r\n<div class=\"am-btn-group default-margin\">\r\n    <button type=\"button\" class=\"am-btn am-btn-primary am-radius\" data-id=\"1\">To do</button>\r\n    <button type=\"button\" class=\"am-btn am-btn-primary am-radius\">Setting</button>\r\n</div>\r\n"

/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = "<div  class=\"am-container\">\r\n    <header class=\"header\">\r\n        <span class=\"title\">@icepy Test Todo App</span>\r\n    </header>\r\n    <div id=\"defaultGo\">\r\n\r\n    </div>\r\n    <footer class=\"footer\">\r\n        <span class=\"title\">@YYT PC Demo</span>\r\n    </footer>\r\n</div>\r\n"

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _base = __webpack_require__(2);
	
	var _base2 = _interopRequireDefault(_base);
	
	var _create = __webpack_require__(21);
	
	var _create2 = _interopRequireDefault(_create);
	
	var _index = __webpack_require__(23);
	
	var _index2 = _interopRequireDefault(_index);
	
	var _create3 = __webpack_require__(24);
	
	var _create4 = _interopRequireDefault(_create3);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var BaseView = _base2.default.View;
	var ManagedObject = _base2.default.ManagedObject;
	var manager = new ManagedObject();
	var ListView = BaseView.extend({
	    el: '#container',
	    rawLoader: function rawLoader() {
	        return _index2.default;
	    },
	    beforeMount: function beforeMount() {},
	    afterMount: function afterMount() {},
	    ready: function ready() {
	        this.createview = new _create2.default({
	            parent: this
	        });
	    },
	    context: function context(args) {
	        console.log('index parent', args);
	    },
	    router: {
	        dealloc: true,
	        viewDidLoad: function viewDidLoad() {},
	        viewWillAppear: function viewWillAppear() {},
	        viewDidAppear: function viewDidAppear() {},
	        viewWillDisappear: function viewWillDisappear() {}
	    }
	});
	
	module.exports = ListView;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _base = __webpack_require__(2);
	
	var _base2 = _interopRequireDefault(_base);
	
	var _contextRoot = __webpack_require__(28);
	
	var _contextRoot2 = _interopRequireDefault(_contextRoot);
	
	var _create = __webpack_require__(22);
	
	var _create2 = _interopRequireDefault(_create);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var BaseView = _base2.default.View;
	var items = ['点击→播放专题页呈现，包括两侧挂幅前贴片', 'MV播放', '核心模块'];
	var CreateView = BaseView.extend({
	    el: '#list',
	    events: {
	        'click .am-list li': 'contextParent',
	        'click .go-backs': 'goback'
	    },
	    beforeMount: function beforeMount() {},
	    afterMount: function afterMount() {
	        this.listContainer = this.findDOMNode('.am-list');
	    },
	    ready: function ready() {
	        this.rootview = new _contextRoot2.default({
	            parent: this
	        });
	        this.initRender();
	        this.on('github', function (args) {
	            console.log('children', args);
	        });
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
	    },
	    context: function context(args) {
	        console.log(args);
	    },
	    contextParent: function contextParent(e) {
	        this.triggerContextHook({ "d": 123 });
	    },
	    goback: function goback() {
	        window.router.navigate('index', {
	            trigger: true
	        });
	    }
	});
	
	module.exports = CreateView;

/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = "{{each items as item i}}\r\n    <li><a>{{item}}</a></li>\r\n{{/each}}\r\n"

/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = "<div class=\"am-container\">\r\n    <header class=\"header\">\r\n        <span class=\"title\">@icepy Test Todo App</span>\r\n    </header>\r\n    <div id=\"list\" class=\"content\">\r\n        <ul class=\"am-list\">\r\n\r\n        </ul>\r\n        <div class=\"am-btn-group go-back go-backs\">\r\n            <button type=\"button\" class=\"am-btn am-btn-primary am-radius\">Back</button>\r\n        </div>\r\n        <div class=\"am-btn-group go-back\" id=\"contextRoot\">\r\n            <button type=\"button\" class=\"am-btn am-btn-primary am-radius send\">{'root':'icepy'} 向Root实例对象发送数据</button>\r\n        </div>\r\n    </div>\r\n    <footer class=\"footer\">\r\n        <span class=\"title\">@YYT PC Demo</span>\r\n    </footer>\r\n</div>\r\n"

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _base = __webpack_require__(2);
	
	var _base2 = _interopRequireDefault(_base);
	
	var _config = __webpack_require__(25);
	
	var _config2 = _interopRequireDefault(_config);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var BaseModel = _base2.default.Model;
	var env = _config2.default.env[_config2.default.scheme];
	var Model = BaseModel.extend({
		url: '{{url_prefix}}/examples/todomvc/mock/default.json?id={{id}}', //填写请求地址
		headers: {
			'Warning': '123'
		},
		defaults: function defaults() {
			return {
				'github': '123'
			};
		},
		beforeEmit: function beforeEmit(options) {
			// 如果需要开启对请求数据的本地缓存，可将下列两行注释去掉
			// this.storageCache = true; //开启本地缓存
			// this.expiration = 2; //设置缓存过期时间（1表示60*60*1000 一小时）
			if (/^\{{0,2}(url_prefix)\}{0,2}/.test(this.url)) {
				this.url = this.url.replace('{{url_prefix}}', env['url_prefix']);
			}
		},
		validate: function validate(attrs) {
			console.log(attrs);
		},
		formatter: function formatter(response) {
			//formatter方法可以格式化数据
			return response;
		}
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
/* 25 */
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
/* 26 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 27 */,
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _base = __webpack_require__(2);
	
	var _base2 = _interopRequireDefault(_base);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var BaseView = _base2.default.View;
	
	var RootView = BaseView.extend({
	    el: '#contextRoot',
	    events: {
	        'click .send': 'sendData'
	    },
	    ready: function ready() {},
	    sendData: function sendData() {
	        this.triggerContextHook('root', { 'root': 'icepy' });
	    }
	});
	
	module.exports = RootView;

/***/ }
]);
//# sourceMappingURL=index.main.js.map