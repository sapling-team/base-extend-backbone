import BaseView from 'BaseView'
import CreateView from './create'
import listTemp from '../../template/list/index.html'

const IndexView = BaseView.extend({
    el:'#container',
    rawLoader:function(){
        return listTemp;
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
        console.log(create)
    },
    router:{
        dealloc:true,
        viewDidLoad:function(){
            console.log(1)
        },
        viewWillAppear:function(){
            console.log(2)
        },
        viewDidAppear:function(){
            console.log(3)
        }
    }
})

module.exports = IndexView
