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
