import base from 'base';
import DefaultView from './view/default/main.view';
import ListView from './view/list/main.view'

const BaseRouter = base.Router;
const AppRouter = BaseRouter.extend({
    routes:{
        'index':'indexRouter',
        'list/:id':'listRouter'
    },
    indexRouter:function(){
        this.addLifeCycleHelper('index',DefaultView);
    },
    listRouter:function(id){
        this.addLifeCycleHelper('list-'+id,ListView,id);
    }
})
module.exports = {
    start:function(){
        window.router = new AppRouter
        Backbone.$ = window.$
        Backbone.history.start();
    }
}
