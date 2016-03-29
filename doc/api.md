### API 思维导图

![](https://raw.githubusercontent.com/sapling-team/base-extend-backbone/master/img/base-extend-backbone.png)

### Model

默认是关闭localStorage缓存的，原则的设计是使用内存缓存，本地缓存需要支持LocalStorage特性（HTML5 API）

可使用的方法名：execute

开启`localStorage`缓存的使用方式：

```JavaScript
var WowerModel = BaseModel.extend({
    url:'{{url_prefix}}/mock/index.json',//填写请求地址
    beforeEmit:function(options){
        // 如果需要开启对请求数据的本地缓存，可将下列两行注释去掉
        this.storageCache = true; //开启本地缓存
        this.expiration = 1; //设置缓存过期时间（1表示60*60*1000 一小时）
    }
});
```

> storageCache 设置为true
>
> expiration 设置过期时间（以小时为单位，如果设置为1表示设置为一个小时1000x60x60x1毫秒）

不开启localStorage缓存的使用方式：

```JavaScript
var WowerModel = BaseModel.extend({
    url:'{{url_prefix}}/mock/mock.json'
});
```

execute使用双回调来描述成功与失败：

```JavaScript
var model = new WowerModel();
model.execute(function(response,model){
    //成功
},function(error){
    //失败
});
```

*Hook*

- beforeEmit：在初始化之后调用
- formatter：在请求成功之后，可以对数据进行格式化，需要返回一个新的数据
- defaultEntity：在初始化时调用


```JavaScript
var Model = BaseModel.extend({
    url:'{{url_prefix}}/examples/todomvc/mock/default.json?id={{id}}',//填写请求地址
    beforeEmit:function(options){
        // 如果需要开启对请求数据的本地缓存，可将下列两行注释去掉
        // this.storageCache = true; //开启本地缓存
        // this.expiration = 2; //设置缓存过期时间（1表示60*60*1000 一小时）
    },
    defaultEntity:function(){
        return {
            "default":1
        }
    },
    formatter:function(response){
          //formatter方法可以格式化数据
        return response;
    }
});
var shared = null;
Model.sharedInstanceModel = function () {
    if (!shared) {
        shared = new Model();
    }
    return shared;
};
module.exports = Model;
```

*Hook 属性*

- setEnv：设置为true，可以自定义Url

```JavaScript
var Model = BaseModel.extend({
    setEnv:true
    url:'{{url_prefix}}/examples/todomvc/mock/env.json',//填写请求地址
    beforeEmit:function(options){
        // 如果需要开启对请求数据的本地缓存，可将下列两行注释去掉
        // this.storageCache = true; //开启本地缓存
        // this.expiration = 2; //设置缓存过期时间（1表示60*60*1000 一小时）
    },
    defaultEntity:function(){
        return {
            "default":1
        }
    },
    formatter:function(response){
          //formatter方法可以格式化数据
        return response;
    }
});
```

*实例属性*

- storageCache：设置为true，可开启本地缓存
- expiration：设置缓存过期时间（1表示60*60*1000 一小时）

本地缓存`建议`在`beforeEmit`钩子方法中设置，比较好维护。或者，你也可以在外部进行设置（必须在调用execute系列方法之前）

```JavaScript
var model = new ListModel();
model.storageCache = true;
model.expiration = 1;
```

#### 实例方法

*execute to Restful*

```JavaScript
var model = new ListModel();
```

- execute：execute延伸方法的根方法

使用方式一：

第一个参数要求传入一个对象，可以自定义配置请求（包括URL，参数），如果是`GET`方法，要求你自己拼接参数

```JavaScript
model.execute({
    type:'POST',
    url:'http://127.0.0.1.com/aip',
    HTTPBody:{}
},function(){

},function(e){

})
```

使用方式二：

双回调，默认使用`GET`

```JavaScript
model.execute(function(response){

},function(e){

})
```

- executeGET：发起一个GET请求，传入success，error的callback，两个参数
- executePOST：发起一个POST请求，传入提交（body JSON格式) ，success，error的callback，三个参数
- executePUT：发起一个PUT请求，传入提交（body JSON格式) ，success，error的 callback，三个参数
- executeDELETE：发起一个DELETE请求，无参数
- executeJSONP：发起一个JSONP跨域请求，传入提交的参数（JSON格式），success，error的callback

*helper*

- setChangeURL：辅助拼接URL，传入一个key/value普通对象
- setHeaders：辅助设置XHR头，传入一个key/value普通对象（JSONP时不可用）
- setUpdateStore：将实体数据更新到本地缓存

### ManagedObject

初始化对象管理器

```JavaScript
var manager = new ManagedObject({
    entity:{
        "items": [{
            "id": 1,
            "name": "icepy"
        }, {
            "id": 0,
            "name": "wen"
        }, {
            "id": 2,
            "name": "xiang"
        }],
        "debug": "test version",
        "trace": {
            "warn": {
                "msg": "wenwen.xiang"
            }
        },
        "items2": [
            "icepy",
            "icepy",
            "wen"
        ]
    }
});
```

- $get：从实体中获取数据，无参将返回所有数据，参数使用.结构化表达式（'items.0.id'）

```JavaScript
console.log('$get items',manager.$get('items'))
console.log('$get debug',manager.$get('debug'))
console.log('$get trace.warn',manager.$get('trace.warn'))
console.log('$get 全部的数据',manager.$get())
```

- $set：向实体内部更新数据，以key/value的方式，第一个参数使用结构化表达式，第二个参数可以是任意类型的数据

```JavaScript
manager.$set('trace.warn',{'msg':'msg'})
```

- $filter：向实体内部的某项数据进行筛选，第一个参数是要筛选数据的.结构化表达式，第二个参数是筛选根据

```JavaScript
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
```

- $sort：对实体内部的某项数据进行排序，第二个参数是要排序数据的.结构化表达式，第二个参数是排序的根据

```JavaScript
var sort1 = this.$sort('items','id.<')
console.log('降序',sort1)
var sort2 = this.$sort('items','id.>')
console.log('升序',sort2)
var sort3 = this.$sort('items',function(){
    return true
});
```

### View

*生命周期Hook*

- rawLoader：返回一个模板字符串，并使用$el.append(html)
- beforeMount：在模板载入到真实dom之前调用
- afterMount：在模板载入到真实dom之后调用
- ready：base.View内部初始化完成之后调用

*实例方法*

- compileHTML：编译模板
- broadcast：触发所有子View实例对象注册的事件
- dispatch：触发所有父View实例对象注册的事件
- destroy：销毁当前实例对象（删除DOM，卸载事件监听等）

*实例属性*

- $parameter：路由参数（#index/12），此参数为12
- $root：根View实例对象
- $parent：父实例对象
- $children：子实例对象数组

### Router

将视图类添加到生命周期管理helper方法中：

- addLifeCycleHelper 帮助管理root视图生命周期的辅助方法

*生命周期Hook*

- viewWillAppear：当视图即将呈现之前调用
- viewDidLoad：当然全部准备完毕（一个生命周期内只会触发一次）
- viewDidAppear：当视图呈现之后调用
- viewWillDisappear：当视图即将隐藏或者销毁之前调用
- viewDidDisappear：当视图隐藏或者销毁之后调用

*生命周期实例属性*

- dealloc：如果此属性为true，那么视图实例在viewWillDisappear调用之后先执行销毁