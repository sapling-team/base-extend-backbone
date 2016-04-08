import base from 'base'
import CreateView from './create.view'
import listTemp from '../../template/list/index.html'
import ListModel from '../../model/list/create.model'

const BaseView = base.View;
const ManagedObject = base.ManagedObject;
const manager = new ManagedObject();
const ListView = BaseView.extend({
    el:'#container',
    rawLoader:function(){
        return listTemp;
    },
    beforeMount:function(){

    },
    afterMount:function(){

    },
    ready:function(){
        this.createview = new CreateView({
            parent:this
        });
    },
    context:function(args){
        console.log('index parent',args)
    },
    router:{
        dealloc:true,
        viewDidLoad:function(){},
        viewWillAppear:function(){},
        viewDidAppear:function(){},
        viewWillDisappear:function(){}
    }
})

module.exports = ListView;
