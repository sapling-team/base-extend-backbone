/**
 * @time 2012年10月27日
 * @author icepy
 * @info 封装完成本地缓存API
 *
 * @time 2016年2月27日
 * @author icepy
 * @info 改造兼容webpack打包
 */

'use strict';

(function(factory) {
	var root = (typeof self == 'object' && self.self == self && self) ||
		(typeof global == 'object' && global.global == global && global);
	if(typeof exports === 'object' && typeof module === 'object'){
		module.exports = factory();
	}else if(typeof exports === 'object'){
		exports['storage'] = factory()
	}else{
		if (!root.ICEPlugs) {
			root.ICEPlugs = {};
		};
		root.ICEPlugs.storage = factory();
	};
})(function() {
	var store = {};
	var _window = window;
	var localStorageName = 'localStorage';
	var sessionStorageName = 'sessionStorage';
	var rootKey = 'ICEStorageCache';
	var storage, session;
	var isLocalStorageNameSupported = function() {
		try {
			return (localStorageName in _window && _window[localStorageName]);
		} catch (err) {
			return false;
		}
	};
	var isSessionStorageNameSupported = function() {
		try {
			return (sessionStorageName in _window && _window[sessionStorageName]);
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
	store.has = function(key) {
		return store.get(key) !== undefined;
	};

	/**
	 * [transact 有存储是否成功的回调函数]
	 * @param  {[String]} key           [description]
	 * @param  {[String]} defaultVal    [description]
	 * @param  {[type]} transactionFn [description]
	 */
	store.transact = function(key, defaultVal, transactionFn) {
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
	store.serialize = function(value) {
		return JSON.stringify(value);
	};
	/**
	 * [deserialize 字符串格式化对象]
	 * @param  {[String]} value [description]
	 * @return {[Object]}       [description]
	 */
	store.deserialize = function(value) {
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
		store.set = function(key, val) {
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
		store.get = function(key, defaultVal) {
			var val = store.deserialize(storage.getItem(key));
			return (val === undefined ? defaultVal : val);
		};

		/**
		 * [remove 根据key名删除一个本地缓存]
		 * @param  {[String]} key [description]
		 */
		store.remove = function(key) {
			storage.removeItem(key);
		};

		/**
		 * [clear 清除所有的本地缓存]
		 */
		store.clear = function() {
			storage.clear();
		};

		/**
		 * [getAll description]
		 * @return {[Object]} [description]
		 */
		store.getAll = function() {
			var ret = {};
			store.forEach(function(key, val) {
				ret[key] = val;
			});
			return ret;
		};
		store.forEach = function(callback) {
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
			set: function(key, val, exp) {
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
			get: function(key) {
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
				return info.val
			},
			getAll: function() {
				var Root = store.get(rootKey);
				return Root || null;
			},
			resetSave: function(val) {
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
				set: function(key, val) {
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
				get: function(key) {
					var val = store.deserialize(session.getItem(key));
					return (val === undefined ? defaultVal : val);
				}
			}
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
					delete modelCache[cacheKey]
				}
			}
		};
		store.expiration.resetSave(modelCache);
	};
	return store;
});
