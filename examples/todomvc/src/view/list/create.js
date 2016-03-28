import BaseView from 'BaseView'
import cilpTemp from '../../template/list/create.html'

const items = [
    '点击→播放专题页呈现，包括两侧挂幅前贴片',
    'MV播放',
    '核心模块'
]
const CreateView = BaseView.extend({
    el:'#list',
    beforeMount:function(){

    },
    afterMount:function(){
        this.listContainer = this.$el.find('.am-list')
    },
    ready:function(){
        this.initRender()
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
    }
})

module.exports = CreateView
