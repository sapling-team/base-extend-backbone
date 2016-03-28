import chai from 'chai'
import Base from '../src/index'

const BaseView = Base.BaseView
const BaseModel = Base.BaseModel
const BaseRouter = Base.BaseRouter

const IndexView = BaseView.extend({
    el:'#list',
    beforeMount:function(){

    },
    afterMount:function(){

    },
    ready:function(){
        this.initRender()
    },
    initRender:function(){

    },
    destroyed:function(){
        console.log(this);
    },
    beforeDestroy:function(){

    }
})
let indexView = new IndexView()
