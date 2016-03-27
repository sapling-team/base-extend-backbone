import BaseRouter from 'BaseRouter'
import SettingView from './view/setting/'
import IndexView from './view/list/'

const WINDOW = window
const BACKBONE = WINDOW.Backbone

if (!BACKBONE) {
    throw new Error('import Backbone now!!~')
}
var AppRouter = BaseRouter.extend({
    routes:{
        'index':'indexRouter',
        'setting/:id':'settingRouter'
    },
    indexRouter:function(){
        this.addLifeCycleHandler('index',IndexView)
    },
    settingRouter:function(id){
        this.addLifeCycleHandler('setting-' + id,SettingView,id)
    }
})
module.exports = {
    start:function(){
        WINDOW.router = new AppRouter
        BACKBONE.$ = window.$
        Backbone.history.start()
    }
}
