import BaseView from 'BaseView'
import CreateView from './create'
import listTemp from '../../template/list/index.html'
import ListModel from '../../model/list/create.model'

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
        this.on('render',function(){

        })
        console.log(create)
        var model = new ListModel();
        console.log('model',model)
        model.execute(function(response){
            console.log(this);
            console.log(response);
            console.log(this.manager)
            console.log('$get items',this.manager.$get('items'))
            console.log('$get debug',this.manager.$get('debug'))
            console.log('$get trace.warn',this.manager.$get('trace.warn'))
            this.manager.$set('trace.warn',{'msg':'msg'})
            console.log('$get 全部的数据',this.manager.$get())
            var id1 = this.manager.$filter('items',{"id":1})
            console.log('$filter id=1',id1)
            var id2 = this.manager.$filter('items',function(v,i){
                if(v.id == 2){
                    return true
                }
            })
            console.log('$filter id=2',id2)
            var icepy = this.manager.$filter('items2','icepy')
            console.log('$filter icepy',icepy)
            var sort1 = this.manager.$sort('items','id.<')
            console.log('降序',sort1)
            var sort2 = this.manager.$sort('items','id.>')
            console.log('升序',sort2)
            var sort3 = this.manager.$sort('items',function(){
                return true
            });
        },function(){

        })
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
