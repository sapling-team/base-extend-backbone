import base from 'base';

const BaseView = base.View;

const RootView = BaseView.extend({
    el:'#contextRoot',
    events:{
        'click .send':'sendData',
        'click .dispatch':'dispatchData'
    },
    ready:function(){

    },
    sendData:function(){
        this.triggerContextHook('root',{'root':'icepy'});
    },
    dispatchData:function(e){
    	this.dispatch('animation',{'name':'Help'});
    }
})

module.exports = RootView;
