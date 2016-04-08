import base from 'base'
import Config from 'config'

const BaseModel = base.Model;
const env = Config.env[Config.scheme];
const Model = BaseModel.extend({
	url: '{{url_prefix}}/examples/todomvc/mock/default.json?id={{id}}', //填写请求地址
	headers:{
		'Warning':'123'
	},
	defaults:function(){
		return {
			'github':'123'
		};
	},
	beforeEmit: function(options) {
		// 如果需要开启对请求数据的本地缓存，可将下列两行注释去掉
		// this.storageCache = true; //开启本地缓存
		// this.expiration = 2; //设置缓存过期时间（1表示60*60*1000 一小时）
		if (/^\{{0,2}(url_prefix)\}{0,2}/.test(this.url)) {
			this.url = this.url.replace('{{url_prefix}}',env['url_prefix']);
		}
	},
	validate: function(attrs) {
		console.log(attrs);
	},
	formatter:function(response){
		//formatter方法可以格式化数据
		return response;
	}
});
let shared = null;
Model.sharedInstanceModel = function() {
	if (!shared) {
		shared = new Model();
	}
	return shared;
};
module.exports = Model;
