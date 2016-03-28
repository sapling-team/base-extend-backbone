import chai from 'chai'
import tools from '../src/util/tools'

const expect = chai.expect
class Node{
	constructor(name,attr){
		this.name = name
		this.attr = attr
	}
	print(){
		console.log(this.name)
	}
}
const node = new Node()
describe('tools', function() {
	describe('isPlainObject  判断任意一个值是否为普通对象', function() {
		it('{"id":1}是一个对象', function() {
			expect(tools.isPlainObject({"id":1})).to.be.ok
		})
		it('class Node不是一个对象', function() {
			expect(tools.isPlainObject(Node)).to.not.be.ok
		})
	})
	describe('isObject 判断任意一个值是否为对象', function() {
		it('数字1不是一个对象', function() {
			expect(tools.isObject(1)).to.not.be.ok
		})
		it('数组是一个对象', function() {
			expect(tools.isObject([])).to.be.ok
		})
	})
	describe('hasOwn 检查对象是否为自身的属性', function() {
		it('检查name是否为class Node自身的属性', function() {
			expect(tools.hasOwn(node,'name')).to.be.ok
		})
	})
	describe('toArray 类数组转化为数组', function() {
		let toArrayTest = function(){
			var arg = arguments
			it('检查参数：1和2是否转化为真实数组', function() {
				expect(tools.toArray(arg)).to.eql([1,2])
			})
		}
		toArrayTest(1,2)
	})
	describe('toType 导出类型字符串', function() {
		it('将[] 导出为[object Array]', function() {
			expect(tools.toType([])).to.equal('[object Array]')
		})
		it('将Function 导出为[object Function]', function() {
			expect(tools.toType(function(){})).to.equal('[object Function]')
		})
	})
	describe('exportToNumber 导出数字',function(){
		it('将字符串\'12\'导出为数字12',function(){
			expect(tools.exportToNumber('12')).to.equal(12)
		})
	})
});
