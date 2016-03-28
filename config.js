var config = {
    scheme: 'alpha',
    env:{
        alpha:{
            'url_prefix':'http://127.0.0.1:8081'
        },
        beta:{
            'url_prefix':'http://beta.com:8081'
        },
        release:{
            'url_prefix':'http://aip.com'
        }
    },
    debug:true
};
module.exports = config;
