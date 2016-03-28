### API 思维导图

![](https://raw.githubusercontent.com/sapling-team/base-extend-backbone/master/img/base-extend-backbone.png)

### Model

*Hook*

- beforeEmit：在初始化之后调用
- formatter：在请求成功之后，可以对数据进行格式化，需要返回一个新的数据

*实例属性*

- setEnv：设置为true，可以自定义Url
- storageCache：设置为true，可开启本地缓存
- expiration：设置缓存过期时间（1表示60*60*1000 一小时）

#### 实例方法

*存取器与筛选过滤器*

- $get：从实体中获取数据，无参将返回所有数据，参数使用.结构化表达式（this.$get('items.0.id')）
- $set：向实体内部_store更新数据，以key/value的方式，第一个参数使用结构化表达式，第二个参数可以是任意类型的数据
- $filter：向实体内部_store的某项数据进行筛选，第一个参数是要筛选数据的.结构化表达式，第二个参数是筛选根据
- $sort：对实体内部_store的某项数据进行排序，第二个参数是要排序数据的.结构化表达式，第二个参数是排序的根据

*execute to Restful*

- execute：发起一个GET请求，传入success，error的callback
- executeGET：发起一个GET请求，传入success，error的callback，两个参数
- executePOST：发起一个POST请求，传入提交（body JSON格式) ，success，error的callback，三个参数
- executePUT：发起一个PUT请求，传入提交（body JSON格式) ，success，error的 callback，三个参数
- executeDELETE：发起一个DELETE请求，无参数
- executeJSONP：发起一个JSONP跨域请求，传入提交的参数（JSON格式），success，error的callback

*helper*

- setChangeURL：辅助拼接URL，传入一个key/value普通对象
- setHeaders：辅助设置XHR头，传入一个key/value普通对象（JSONP时不可用）
- setView：设置view-model关系
- setOnQueueKeys：设置订阅的渲染事件名队列
- setUpdateStore：将_store中的数据缓存到本地缓存中


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
- $props：传递渲染UI所依赖的数据对象
- $state：传递维护状态所需要的数据对象
- $methods：传递内部可能使用的对象方法

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