var chai = require('chai');
var Manage = require('../../src/entity/ManagedObject');
var expect = chai.expect
var testData = {
	'items':[
		{
			'id':1,
			'name':'魔兽世界'
		},
		{
			'id':0,
			'name':'icepy'
		},
		{
			'id':2,
			'name':'developer'
		}
	],
	'ci':'travis',
	'items1':[
		'icepy',
		'icepy',
		'wen'
	]
}
var sortTestData = [
	{
		'id':2,
		'name':'developer'
	},
	{
		'id':1,
		'name':'魔兽世界'
	},
	{
		'id':0,
		'name':'icepy'
	}
]
var testDataT = {
	'items':[
		{
			'id':1,
			'name':'wower'
		},
		{
			'id':0,
			'name':'0'
		},
		{
			'id':2,
			'name':'12'
		}
	]
}

var sortTestDataT = [
	{
		'id':0,
		'name':'0'
	},
	{
		'id':1,
		'name':'wower'
	},
	{
		'id':2,
		'name':'12'
	}
]

var manager = new Manage({
	entity:testData
});

var managerT = new Manage({
	entity:testDataT
})

describe('ManagerObject', function() {
	describe('$get 从实体中获取数据，无参将返回所有数据，参数使用.结构化表达式', function() {
		it('获取items.0.id，第一个元素中id的值', function () {
			expect(manager.$get('items.0.id')).to.equal(1)
		})

		it('获取单个ci的值为travis', function () {
			expect(manager.$get('ci')).to.equal('travis')
		})
	})

	describe('$set 向实体内部更新数据，以key/value的方式，第一个参数使用结构化表达式，第二个参数可以是任意类型的数据', function() {
		it('改变ci的值travis为tools',function(){
			manager.$set('ci','tools')
			expect(manager.$get('ci')).to.equal('tools')
		})
	})

	describe('$filter 向实体内部的某项数据进行筛选，第一个参数是要筛选数据的.结构化表达式，第二个参数是筛选根据', function() {
		it('测试根据字典{"id":0}进行筛选', function () {
			expect(manager.$filter('items',{'id':0})).to.eql([{'id':0,'name':'icepy'}])
		})
		it('测试根据函数{返回true或者false}进行筛选',function(){
			expect(manager.$filter('items',function(v,i){
				if(v.id === 2){
					return true
				}
			})).to.eql([{'id':2,'name':'developer'}])
		})
		it('测试根据单个字符串（应用于数组中只存在数字，字符串等基本类型时）',function(){
			expect(manager.$filter('items1','icepy')).to.eql(['icepy','icepy'])
		})
	})

	describe('$sort 对实体内部的某项数据进行排序，第二个参数是要排序数据的.结构化表达式，第二个参数是排序的根据',function(){
		it('测试.表达式< 降序',function(){
			expect(manager.$sort('items','id.<')).to.eql(sortTestData)
		})

		it('测试.表达式> 升序',function(){
			expect(managerT.$sort('items','id.>')).to.eql(sortTestDataT)
		})

		it('测试 function进行排序',function(){
			expect(managerT.$sort('items',function(){
				return true
			})).to.eql(sortTestDataT.reverse())
		})
	})
})
