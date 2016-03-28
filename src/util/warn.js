/**
 * @time 2012年10月26日
 * @author icepy
 * @info 完成warn包装
 */

'use strict';

var Config = require('config');
var Debug = require('./debug');

var warn = function(msg,e){
	if (Config.debug) {
		Debug.warn(msg,e)
	}
}
module.exports = warn;
