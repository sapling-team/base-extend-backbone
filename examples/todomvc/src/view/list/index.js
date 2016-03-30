import BaseView from 'BaseView'
import CreateView from './create'
import listTemp from '../../template/list/index.html'
import ListModel from '../../model/list/create.model'
import ManagedObject from 'ManagedObject'

const manager = new ManagedObject();
const IndexView = BaseView.extend({
    el:'#container',
    rawLoader:function(){
        return listTemp;
    },
    beforeMount:function(){

    },
    afterMount:function(){

    },
    ready:function(){
        let props = {
            'items':[]
        }
        let state = {
            'default':0
        }

        let create = new CreateView({
            methods:{},
            props:props,
            state:state,
            parent:this
        })
        console.log(this);
        console.log(create);
        var model = new ListModel();
        console.log('model',model)
        model.execute(function(response){
            console.log(this);
            console.log(response);
            manager.$update(response);
            console.log('$get items',manager.$get('items'))
            console.log('$get debug',manager.$get('debug'))
            console.log('$get trace.warn',manager.$get('trace.warn'))
            manager.$set('trace.warn',{'msg':'msg'})
            console.log('$get 全部的数据',manager.$get())
            var id1 = manager.$filter('items',{"id":1})
            console.log('$filter id=1',id1)
            var id2 = manager.$filter('items',function(v,i){
                if(v.id == 2){
                    return true
                }
            })
            console.log('$filter id=2',id2)
            var icepy = manager.$filter('items2','icepy')
            console.log('$filter icepy',icepy)
            var sort1 = manager.$sort('items','id.<')
            console.log('降序',sort1)
            var sort2 = manager.$sort('items','id.>')
            console.log('升序',sort2)
            var sort3 = manager.$sort('items',function(){
                return true
            });
        },function(){

        })
    },
    context:function(args){
        console.log('index parent',args)
    },
    router:{
        dealloc:true,
        viewDidLoad:function(){

        },
        viewWillAppear:function(){
        },
        viewDidAppear:function(){
        }
    }
})

module.exports = IndexView
