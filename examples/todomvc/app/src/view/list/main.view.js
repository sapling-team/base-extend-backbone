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
        this.title = this.findDOMNode('.dispatch-title');
    },
    ready:function(){
        this.createview = new CreateView({
            parent:this
        });
        this.on('animation',function(args){
            var self = this;
            setTimeout(function(){
                self.title.text(args.name);
                self.title.slideDown('slow');
            },2000)
            
            console.log('main ----',args);
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
