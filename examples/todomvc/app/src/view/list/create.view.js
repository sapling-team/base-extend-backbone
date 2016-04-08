import base from 'base';
import ContextRootView from './contextRoot.view';
import cilpTemp from '../../template/list/create.html';


const BaseView = base.View;
const items = [
    '点击→播放专题页呈现，包括两侧挂幅前贴片',
    'MV播放',
    '核心模块'
]
const CreateView = BaseView.extend({
    el:'#list',
    events:{
        'click .am-list li':'contextParent',
        'click .go-backs':'goback'
    },
    beforeMount:function(){

    },
    afterMount:function(){
        this.listContainer = this.findDOMNode('.am-list')
    },
    ready:function(){
        this.rootview = new ContextRootView({
            parent:this
        });
        this.initRender()
        this.on('github',function(args){
            console.log('children',args);
        })
    },
    initRender:function(){
        var html = this.compileHTML(cilpTemp,{'items':items})
        this.listContainer.html(html)
    },
    destroyed:function(){
        console.log(this);
    },
    beforeDestroy:function(){
        this.listContainer = null; //谁引用谁释放
    },
    context:function(args){
        console.log(args);
    },
    contextParent:function(e){
        this.triggerContextHook({"d":123});
    },
    goback:function(){
        window.router.navigate('index',{
            trigger:true
        });
    }
})

module.exports = CreateView
