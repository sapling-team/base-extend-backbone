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

```JavaScript

//$get 包装器 使用
console.log('$get items',this.$get('items'))
console.log('$get debug',this.$get('debug'))
console.log('$get trace.warn',this.$get('trace.warn'))
console.log('$get 全部的数据',this.$get())

//$set包装器 使用
this.$set('trace.warn',{'msg':'msg'})

//$filter包装器 使用
var id1 = this.$filter('items',{"id":1})
console.log('$filter id=1',id1)
var id2 = this.$filter('items',function(v,i){
    if(v.id == 2){
        return true
    }
})
console.log('$filter id=2',id2)
var icepy = this.$filter('items2','icepy')
console.log('$filter icepy',icepy)

//$sort包装器 使用
var sort1 = this.$sort('items','id.<')
console.log('降序',sort1)
var sort2 = this.$sort('items','id.>')
console.log('升序',sort2)
var sort3 = this.$sort('items',function(){
    return true
});
```