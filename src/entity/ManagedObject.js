/**
 * @time 2016年3月29日
 * @author icepy
 * @info 实体管理类
 */
var warn = require('../util/warn');
var Tools = require('../util/tools');
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
    if (_.isArray(data)) {
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
    if (_.isArray(data)) {
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
