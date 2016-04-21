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
        this.listModel = new ListModel();
        this.on('animation',function(args){
            var self = this;
            setTimeout(function(){
                self.title.text(args.name);
                self.title.slideDown('slow');
            },2000)

            console.log('main ----',args);
        });

        //
        var promise = this.listModel.execute({
          type: 'POST',
          url: 'http://127.0.0.1:3000/api/',
          HTTPBody: {
            id: 1
          }
        });
        promise.done(function(){

        });
        promise.fail(function(xhr){
          console.log(this);
          console.log(xhr);
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
