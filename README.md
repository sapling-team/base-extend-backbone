## base-extend-backbone

`baseModel`，`baseRouter`，`baseView`因为涉及业务编程，只支持require方式载入。

### baseModel

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

execute其他方法

- executeGET 发起一个GET请求，传入成功，失败的callback，两个参数。
- executePOST发起一个POST请求，传入提交（body JSON格式) ，成功，失败的callback，三个参数。
- executePUT发起一个PUT请求，传入提交（body JSON格式) ，成功，失败的 callback，三个参数。
- executeDELETE 发起一个DELETE请求，无参数。
- executeJSONP 发起一个JSONP跨域请求，传入提交的参数（JSON格式），成功，失败的callback。

构造器方法

- beforeEmit 在发起请求之前给用户一次初始化时后悔的机会 - formatter 可以对数据进行格式化，需要返回一个新的数据

其他API

- setChangeURL 辅助拼接URL，传入一个key/value普通对象
- setHeaders 辅助设置XHR头，传入一个key/value普通对象（JSONP时不可用）
- setView 设置view-model关系
- setOnQueueKeys 设置订阅的渲染事件名队列
- $get 包装器，从模型获取数据，无参将返回所有数据，参数使用.结构化表达式
- $set 包装器，向模型内部更新数据，以key/value的方式，第一个参数使用结构化表达式，第二个参数可以是任意类型的数据
- $filter 包装器，向模型内部筛选数据
- $sort 包装器，向模型内部进行排序
- $updateStore 将_store中的数据缓存到本地缓存中

### baseView

构造器方法

- rawLoader 方法，需要返回一个模板字符串
- beforeMount 钩子方法，在模板载入到真实DOM之前
- afterMount 钩子方法，在模板载入到真实DOM后调用
- ready 钩子方法，baseView内部初始化完成之后调用

其他API

- compileHTML 编译模板方法
- broadcast 触发所有子组件的事件
- dispatch 触发所有父组件的事件
- destroy 销毁当前实例内部的对象

其他属性

- $parameter 路由参数
- $root 根实例对象
- $parent 父实例对象
- $children 子实例对象数组
- $props 传递渲染UI所依赖的对象
- $state 传递维护状态所需要的对象
- $methods 传递内部可能使用的方法对象

BaseView Life Cycle Image：

![](https://raw.githubusercontent.com/sapling-team/base-extend-backbone/master/examples/img/BaseView%20Life%20Cycle.png)

### baseRouter

将视图类添加到生命周期管理helper方法中：

- addLifeCycleHelper 帮助管理root视图生命周期的辅助方法

视图生命周期方法：

- viewWillAppear 当视图即将呈现之前调用
- viewDidLoad 当然全部准备完毕（一个周期内只会触发一次）
- viewDidAppear 当视图呈现之后调用
- viewWillDisappear 当视图即将隐藏或者销毁之前调用
- viewDidDisappear 当视图隐藏或者销毁之后调用

视图生命周期属性：

- dealloc 如果此属性为true，那么视图实例在viewWillDisappear调用之后先执行销毁

BaseRouter Life Cycle as BaseView

![](https://raw.githubusercontent.com/sapling-team/base-extend-backbone/master/examples/img/BaseRouter%20Life%20Cycle%20as%20BaseView.png)
