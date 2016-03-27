/**
 * @time 2012年10月26日
 * @author icepy
 * @info 完成处理tools对象
 */

'use strict';

(function (factory) {
    var root = (typeof self == 'object' && self.self == self && self) ||
        (typeof global == 'object' && global.global == global && global);
    if (typeof exports === 'object' && typeof module === 'object') {
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
    return tools;
});
