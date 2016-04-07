/**
 * @time 2012年10月26日
 * @author icepy
 * @info debug信息打印
 */

'use strict';

var log = {
	warn:function(){},
	error:function(){}
};
if (process.env.NODE_ENV !== 'product') {
	var hasConsole =  typeof console !== undefined;
	log.warn = function(msg,e){
		if (hasConsole) {
			console.warn('[YYT PC Warning]:'+ msg);
			if (e) {
				throw e;
			}else{
				var warning = new Error('Warning Stack Trace');
				console.warn(warning.stack);
			}
		};
	};
	log.error = function(msg){
		var error = new Error(msg);
		throw error.stack;
	};
	log.info = function(msg){
		if (hasConsole) {
			console.info('[YYT PC INFO]'+msg);
		}
	};
	log.dir = function(tag){
		var arr = document.querySelectorAll(tag);
		if (arr && arr.length) {
			arr.forEach(function(element){
				console.dir(element);
			});
		}
	};
}
module.exports = log;
