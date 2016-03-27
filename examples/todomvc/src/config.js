const CONFIG = {
	scheme: 'alpha',
	env:{
		alpha:{
			'url_prefix':'http://127.0.0.1:4000'
			// 'url_prefix':'http://icepy.yinyuetai.com:4000'
		},
		release:{
			'url_prefix':''
		}
	},
	debug:true
};
module.exports = CONFIG
