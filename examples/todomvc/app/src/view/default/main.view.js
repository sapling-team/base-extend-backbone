import base from 'base';
import GotoView from './goto.view';
import indexHTML from '../../template/default/index.html';

const BaseView = base.View;
const DefaultView = BaseView.extend({
    el:'#container',
    rawLoader:function(){
        return indexHTML
    },
    beforeMount:function(){},
    afterMount:function(){},
    ready:function(){
        this.gotoview = new GotoView({
            parent:this
        });
    },
    context:function(){

    },
    router:{
        dealloc:true,
        viewDidLoad:function(){},
        viewWillAppear:function(){},
        viewDidAppear:function(){},
        viewWillDisappear:function(){}
    }
});

module.exports = DefaultView;
