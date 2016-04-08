import base from 'base';
import gotoHTML from '../../template/default/goto.html';

const BaseView = base.View;
const GotoView = BaseView.extend({
    el:'#defaultGo',
    events:{
        'click .default-margin button':'gotoHandler'
    },
    rawLoader:function(){
        return gotoHTML;
    },
    beforeMount:function(){},
    afterMount:function(){},
    ready:function(){
    },
    gotoHandler:function(e){
        let el = $(e.currentTarget);
        let id = el.attr('data-id');
        if (id) {
            window.router.navigate('list/'+id,{
        		trigger:true
        	});
        }
    }
});
module.exports = GotoView;
