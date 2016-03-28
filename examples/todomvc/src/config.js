const CONFIG = {
	scheme: 'alpha',
	env:{
		alpha:{
			'url_prefix':'http://127.0.0.1:3000'
			// 'url_prefix':'http://icepy.yinyuetai.com:4000'
		},
		beta:{
			'url_prefix':'http://beta.com'
		},
		release:{
			'url_prefix':''
		}
	},
	debug:true
};
module.exports = CONFIG
