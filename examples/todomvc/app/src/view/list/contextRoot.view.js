import base from 'base';

const BaseView = base.View;

const RootView = BaseView.extend({
    el:'#contextRoot',
    events:{
        'click .send':'sendData'
    },
    ready:function(){

    },
    sendData:function(){
        this.triggerContextHook('root',{'root':'icepy'});
    }
})

module.exports = RootView;
